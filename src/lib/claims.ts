// ─── Claims Store ────────────────────────────────────────────────────────────
// Persists NFT claims to Redis via ioredis (supports any standard redis:// URL).
//
// Redis key schema:
//   claim:{id}              → JSON of the full Claim object
//   order-index:{orderId}   → JSON array of claim IDs for a Shopify order
//   email-index:{email}     → JSON array of claim IDs for an email
//
// DEV FALLBACK: if REDIS_URL is not set, falls back to an in-memory Map
// so local development works without Redis configured.

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

// ─── Redis client (singleton, lazy) ──────────────────────────────────────────

let _redis: import("ioredis").Redis | null = null;

async function getRedis(): Promise<import("ioredis").Redis | null> {
  const url = process.env.REDIS_URL || process.env.KV_REDIS_URL;
  if (!url) return null;

  if (!_redis) {
    const { default: Redis } = await import("ioredis");
    _redis = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 3 });
  }
  return _redis;
}

// ─── Dev fallback ─────────────────────────────────────────────────────────────

const devStore = new Map<string, Claim>();
let devWarnShown = false;

function warnDev() {
  if (devWarnShown) return;
  devWarnShown = true;
  console.warn(
    "[Claims] REDIS_URL not set — using in-memory store (data lost on restart).\n" +
    "  Set REDIS_URL=redis://... in .env.local to persist claims."
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

  const redis = await getRedis();
  if (!redis) {
    warnDev();
    devStore.set(claim.id, claim);
    return claim;
  }

  const orderId = extractOrderId(claim.id);
  await redisSet(redis, `claim:${claim.id}`, claim);
  await appendToIndex(redis, `order-index:${orderId}`, claim.id);
  await appendToIndex(redis, `email-index:${claim.email.toLowerCase()}`, claim.id);
  return claim;
}

// Exact match — used internally when claim.id is the full key (e.g. from mint route)
export async function getClaimByOrderId(claimId: string): Promise<Claim | undefined> {
  const redis = await getRedis();
  if (!redis) { warnDev(); return devStore.get(claimId); }

  return await redisGet<Claim>(redis, `claim:${claimId}`) ?? undefined;
}

// Prefix search — used when customer enters their Shopify order ID
export async function getClaimsByShopifyOrderId(shopifyOrderId: string): Promise<Claim[]> {
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
  const all = await getAllClaims();
  return all.filter((c) => c.status === "pending");
}
