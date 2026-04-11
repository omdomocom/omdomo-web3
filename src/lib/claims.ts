// ─── Claims Store ────────────────────────────────────────────────────────────
// Persiste NFT claims usando Supabase como fuente de verdad.
// Fallback a Redis si Supabase no está configurado.
// Fallback a in-memory Map si tampoco hay Redis (dev local).
//
// Supabase tabla `claims` — schema en /supabase/migrations/001_claims.sql
// Redis key schema (legacy/fallback):
//   claim:{id}              → JSON del Claim completo
//   order-index:{orderId}   → JSON array de claim IDs por orden Shopify
//   email-index:{email}     → JSON array de claim IDs por email

import { getRedis } from "@/lib/redis";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export interface Claim {
  id: string;             // `${shopifyOrderId}-${product_id}`
  email: string;
  productTitle: string;
  productImage: string;
  orderTotal: number;     // USD
  ommyReward: number;
  walletAddress?: string;
  status: "pending" | "claimed" | "failed";
  createdAt: string;
  claimedAt?: string;
  txHash?: string;
  tokenId?: string;
}

// ─── Mapeo Supabase ↔ TypeScript ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromSupabase(row: Record<string, any>): Claim {
  return {
    id:            row.id,
    email:         row.email,
    productTitle:  row.product_title,
    productImage:  row.product_image ?? "",
    orderTotal:    Number(row.order_total),
    ommyReward:    Number(row.ommy_reward),
    walletAddress: row.wallet_address ?? undefined,
    status:        row.status,
    createdAt:     row.created_at,
    claimedAt:     row.claimed_at ?? undefined,
    txHash:        row.tx_hash ?? undefined,
    tokenId:       row.token_id ?? undefined,
  };
}

function toSupabase(claim: Claim) {
  return {
    id:               claim.id,
    email:            claim.email,
    product_title:    claim.productTitle,
    product_image:    claim.productImage,
    order_total:      claim.orderTotal,
    ommy_reward:      claim.ommyReward,
    wallet_address:   claim.walletAddress ?? null,
    status:           claim.status,
    created_at:       claim.createdAt,
    claimed_at:       claim.claimedAt ?? null,
    tx_hash:          claim.txHash ?? null,
    token_id:         claim.tokenId ?? null,
    shopify_order_id: extractOrderId(claim.id),
  };
}

// ─── Dev fallback ─────────────────────────────────────────────────────────────

const devStore = new Map<string, Claim>();
let devWarnShown = false;

function warnDev() {
  if (devWarnShown) return;
  devWarnShown = true;
  console.warn(
    "[Claims] Sin Supabase ni Redis — usando in-memory store (datos perdidos al reiniciar).\n" +
    "  Configura NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
}

// ─── Redis helpers (fallback) ─────────────────────────────────────────────────

function extractOrderId(claimId: string): string {
  const lastDash = claimId.lastIndexOf("-");
  return lastDash > 0 ? claimId.slice(0, lastDash) : claimId;
}

async function redisGet<T>(redis: import("ioredis").Redis, key: string): Promise<T | null> {
  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

async function redisSet(redis: import("ioredis").Redis, key: string, value: unknown) {
  await redis.set(key, JSON.stringify(value));
}

async function appendToIndex(redis: import("ioredis").Redis, key: string, value: string) {
  const existing = await redisGet<string[]>(redis, key) ?? [];
  if (!existing.includes(value)) {
    existing.push(value);
    await redisSet(redis, key, existing);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function createClaim(data: Omit<Claim, "status" | "createdAt">): Promise<Claim> {
  const claim: Claim = { ...data, status: "pending", createdAt: new Date().toISOString() };

  // ── Supabase (fuente de verdad) ──
  if (isSupabaseConfigured()) {
    try {
      const { error } = await getSupabaseAdmin().from("claims").insert(toSupabase(claim));
      if (error) throw error;
      return claim;
    } catch (err) {
      console.error("[Claims] Supabase createClaim falló, intentando Redis:", err);
    }
  }

  // ── Redis (fallback) ──
  const redis = await getRedis();
  if (redis) {
    const orderId = extractOrderId(claim.id);
    await redisSet(redis, `claim:${claim.id}`, claim);
    await appendToIndex(redis, `order-index:${orderId}`, claim.id);
    await appendToIndex(redis, `email-index:${claim.email.toLowerCase()}`, claim.id);
    return claim;
  }

  warnDev();
  devStore.set(claim.id, claim);
  return claim;
}

// Exact match — usado cuando se tiene el claim.id completo
export async function getClaimByOrderId(claimId: string): Promise<Claim | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("claims")
        .select("*")
        .eq("id", claimId)
        .single();
      if (!error && data) return fromSupabase(data);
    } catch (err) {
      console.error("[Claims] Supabase getClaimByOrderId falló:", err);
    }
  }

  const redis = await getRedis();
  if (!redis) { warnDev(); return devStore.get(claimId); }
  return await redisGet<Claim>(redis, `claim:${claimId}`) ?? undefined;
}

// Busca por shopify order ID (el cliente introduce su número de pedido)
export async function getClaimsByShopifyOrderId(shopifyOrderId: string): Promise<Claim[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("claims")
        .select("*")
        .eq("shopify_order_id", shopifyOrderId);
      if (!error && data) return data.map(fromSupabase);
    } catch (err) {
      console.error("[Claims] Supabase getClaimsByShopifyOrderId falló:", err);
    }
  }

  const redis = await getRedis();
  if (!redis) {
    warnDev();
    const prefix = `${shopifyOrderId}-`;
    return Array.from(devStore.values()).filter(
      (c) => c.id === shopifyOrderId || c.id.startsWith(prefix)
    );
  }

  const ids = await redisGet<string[]>(redis, `order-index:${shopifyOrderId}`);
  if (!ids?.length) return [];
  const claims = await Promise.all(ids.map((id) => redisGet<Claim>(redis, `claim:${id}`)));
  return claims.filter((c): c is Claim => c !== null);
}

export async function getClaimsByEmail(email: string): Promise<Claim[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("claims")
        .select("*")
        .ilike("email", email);
      if (!error && data) return data.map(fromSupabase);
    } catch (err) {
      console.error("[Claims] Supabase getClaimsByEmail falló:", err);
    }
  }

  const redis = await getRedis();
  if (!redis) {
    warnDev();
    return Array.from(devStore.values()).filter(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
  }

  const ids = await redisGet<string[]>(redis, `email-index:${email.toLowerCase()}`);
  if (!ids?.length) return [];
  const claims = await Promise.all(ids.map((id) => redisGet<Claim>(redis, `claim:${id}`)));
  return claims.filter((c): c is Claim => c !== null);
}

export async function updateClaim(claimId: string, updates: Partial<Claim>): Promise<Claim | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabaseUpdates: Record<string, unknown> = {};
      if (updates.status !== undefined)        supabaseUpdates.status         = updates.status;
      if (updates.walletAddress !== undefined) supabaseUpdates.wallet_address  = updates.walletAddress;
      if (updates.claimedAt !== undefined)     supabaseUpdates.claimed_at      = updates.claimedAt;
      if (updates.txHash !== undefined)        supabaseUpdates.tx_hash         = updates.txHash;
      if (updates.tokenId !== undefined)       supabaseUpdates.token_id        = updates.tokenId;

      const { data, error } = await getSupabaseAdmin()
        .from("claims")
        .update(supabaseUpdates)
        .eq("id", claimId)
        .select()
        .single();
      if (!error && data) return fromSupabase(data);
    } catch (err) {
      console.error("[Claims] Supabase updateClaim falló:", err);
    }
  }

  const redis = await getRedis();
  if (!redis) {
    warnDev();
    const claim = devStore.get(claimId);
    if (!claim) return null;
    const updated = { ...claim, ...updates };
    devStore.set(claimId, updated);
    return updated;
  }

  const claim = await redisGet<Claim>(redis, `claim:${claimId}`);
  if (!claim) return null;
  const updated = { ...claim, ...updates };
  await redisSet(redis, `claim:${claimId}`, updated);
  return updated;
}

export async function getAllClaims(): Promise<Claim[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data.map(fromSupabase);
    } catch (err) {
      console.error("[Claims] Supabase getAllClaims falló:", err);
    }
  }

  const redis = await getRedis();
  if (!redis) {
    warnDev();
    return Array.from(devStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const keys = await redis.keys("claim:*");
  if (!keys.length) return [];
  const claims = await Promise.all(keys.map((key) => redisGet<Claim>(redis, key)));
  return claims
    .filter((c): c is Claim => c !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPendingClaims(): Promise<Claim[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("claims")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (!error && data) return data.map(fromSupabase);
    } catch (err) {
      console.error("[Claims] Supabase getPendingClaims falló:", err);
    }
  }

  const all = await getAllClaims();
  return all.filter((c) => c.status === "pending");
}
