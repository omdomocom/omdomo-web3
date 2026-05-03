// Shopify Webhook Handler — orders/paid (Multi-tienda: EU + CL)
// ─────────────────────────────────────────────────────────────────────────────
// Configuración en Shopify Admin → Settings → Notifications → Webhooks
// Event: "Order payment" | Format: JSON
//
// Tienda EU (omdomo.com):
//   URL: https://web3.omdomo.com/api/shopify/webhook?store=eu
//   Secret: SHOPIFY_WEBHOOK_SECRET_EU  (o SHOPIFY_WEBHOOK_SECRET como fallback)
//
// Tienda CL (omdomo.cl):
//   URL: https://web3.omdomo.com/api/shopify/webhook?store=cl
//   Secret: SHOPIFY_WEBHOOK_SECRET_CL
//
// Prefijos de claim ID:
//   EU: ${orderId}-${product_id}        ← sin prefijo (backward compatible)
//   CL: cl_${orderId}-${product_id}     ← prefijo para evitar colisiones

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClaim } from "@/lib/claims";
import { calculateOmmyReward, calculateOmmyBurn } from "@/lib/nft";
import { sendClaimEmail } from "@/lib/email";

// ─── Configuración por tienda ─────────────────────────────────────────────────

export type StoreKey = "eu" | "cl";

interface StoreConfig {
  label: string;
  secret: string | undefined;
  claimPrefix: string;     // prefijo para IDs de claim (evita colisiones entre tiendas)
  baseCurrency: string;    // moneda nativa de la tienda
  shopDomainHint: string;  // fragmento del dominio Shopify para autodetección
}

const STORE_CONFIG: Record<StoreKey, StoreConfig> = {
  eu: {
    label: "EU (omdomo.com)",
    secret: process.env.SHOPIFY_WEBHOOK_SECRET_EU ?? process.env.SHOPIFY_WEBHOOK_SECRET,
    claimPrefix: "",          // sin prefijo — backward compatible con claims existentes
    baseCurrency: "EUR",
    shopDomainHint: "omdomo.com",
  },
  cl: {
    label: "CL (omdomo.cl)",
    secret: process.env.SHOPIFY_WEBHOOK_SECRET_CL,
    claimPrefix: "cl_",
    baseCurrency: "CLP",
    shopDomainHint: "omdomo.cl",
  },
};

// ─── Detección de tienda ──────────────────────────────────────────────────────

function detectStore(req: NextRequest): StoreKey {
  // 1. Query param explícito en la URL del webhook (método recomendado)
  const storeParam = req.nextUrl.searchParams.get("store");
  if (storeParam === "cl") return "cl";
  if (storeParam === "eu") return "eu";

  // 2. Header X-Shopify-Shop-Domain (enviado automáticamente por Shopify)
  const shopDomain = req.headers.get("x-shopify-shop-domain") ?? "";
  if (shopDomain.includes(".cl") || shopDomain.includes("-cl")) return "cl";

  // 3. Default: tienda EU
  return "eu";
}

// ─── Verificación HMAC ────────────────────────────────────────────────────────

function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string,
  secret: string
): boolean {
  const hash = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");
  const a = Buffer.from(hash);
  const b = Buffer.from(hmacHeader);
  // Longitud diferente → rechazar (timingSafeEqual requiere mismo tamaño)
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ─── Conversión de moneda a USD ───────────────────────────────────────────────
// Los OMMY rewards se calculan siempre en USD (70 OMMY por USD).
// EUR y CLP se convierten via CoinGecko. Fallback a rates hardcodeados.

const FALLBACK_RATES_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.08,    // ~1 EUR = 1.08 USD
  CLP: 0.00105, // ~1 CLP = 0.00105 USD (aprox. 950 CLP/USD)
};

// Cache en memoria del proceso (se resetea con cada deploy — suficiente para webhooks)
let rateCache: { rates: Record<string, number>; fetchedAt: number } | null = null;
const RATE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

async function getUsdRate(currency: string): Promise<number> {
  if (currency === "USD") return 1;

  const now = Date.now();
  if (rateCache && now - rateCache.fetchedAt < RATE_CACHE_TTL_MS) {
    return rateCache.rates[currency] ?? FALLBACK_RATES_TO_USD[currency] ?? 1;
  }

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/exchange_rates",
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) throw new Error(`CoinGecko status ${res.status}`);

    // CoinGecko devuelve rates relativas a BTC — derivamos USD como base
    const json = await res.json() as { rates: Record<string, { value: number }> };
    const btcRates = json.rates;
    if (!btcRates.usd) throw new Error("No USD rate in CoinGecko response");

    const usdPerBtc = btcRates.usd.value;
    const freshRates: Record<string, number> = { USD: 1 };

    for (const [code, info] of Object.entries(btcRates)) {
      const upperCode = code.toUpperCase();
      if (upperCode === "USD" || info.value === 0) continue;
      // Convertir: USD/moneda = (BTC→USD) / (BTC→moneda)
      freshRates[upperCode] = usdPerBtc / info.value;
    }

    rateCache = { rates: freshRates, fetchedAt: now };
    console.log(`[Shopify webhook] Tipos de cambio actualizados. EUR: ${freshRates.EUR?.toFixed(4)}, CLP: ${freshRates.CLP?.toFixed(6)}`);
    return freshRates[currency] ?? FALLBACK_RATES_TO_USD[currency] ?? 1;

  } catch (err) {
    console.warn(`[Shopify webhook] No se pudo obtener tipo de cambio para ${currency} — usando fallback:`, err);
    return FALLBACK_RATES_TO_USD[currency] ?? 1;
  }
}

async function toUSD(amount: number, currency: string): Promise<number> {
  const rate = await getUsdRate(currency);
  return Math.round(amount * rate * 100) / 100; // redondear a 2 decimales
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmac = req.headers.get("x-shopify-hmac-sha256") ?? "";

    // 1. Detectar tienda
    const storeKey = detectStore(req);
    const store = STORE_CONFIG[storeKey];

    // 2. Verificar que el secret está configurado
    if (!store.secret) {
      console.error(
        `[Shopify webhook][${store.label}] Secret no configurado ` +
        `(SHOPIFY_WEBHOOK_SECRET_${storeKey.toUpperCase()}) — rechazando`
      );
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // 3. Verificar firma HMAC
    if (!verifyShopifyWebhook(rawBody, hmac, store.secret)) {
      console.warn(`[Shopify webhook][${store.label}] Firma HMAC inválida`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = JSON.parse(rawBody);

    // 4. Extraer datos del pedido
    const shopifyOrderId = String(order.id);
    const email = order.email || order.contact_email || "";
    const orderTotal = parseFloat(order.total_price || "0");
    const currency: string = order.currency || store.baseCurrency;

    const lineItems: Array<{ title: string; product_id: number; quantity: number }> =
      order.line_items || [];

    if (lineItems.length === 0 || !email) {
      return NextResponse.json({ received: true, skipped: "no line items or email" });
    }

    // 5. Convertir total a USD para calcular OMMY correctamente
    const orderTotalUSD = await toUSD(orderTotal, currency);
    const conversionNote =
      currency !== "USD"
        ? ` (${orderTotal} ${currency} → ${orderTotalUSD} USD)`
        : "";

    // 6. Crear un claim por línea de producto
    const claims = await Promise.all(
      lineItems.map((item) => {
        const itemTotalUSD = orderTotalUSD / lineItems.length;
        const ommyReward = calculateOmmyReward(itemTotalUSD);
        const ommyBurn = calculateOmmyBurn(itemTotalUSD);

        // El prefijo de tienda evita colisiones de orderId entre EU y CL
        const claimId = `${store.claimPrefix}${shopifyOrderId}-${item.product_id}`;

        return createClaim({
          id: claimId,
          email,
          productTitle: item.title,
          productImage: "", // Shopify no envía imagen en webhook — se obtiene al hacer claim
          orderTotal: itemTotalUSD,
          ommyReward,
          store: storeKey,
        }).then((claim) => ({ ...claim, ommyBurn }));
      })
    );

    const totalOmmyReward = claims.reduce((s, c) => s + c.ommyReward, 0);
    const totalBurn = claims.reduce((s, c) => s + (c.ommyBurn ?? 0), 0);

    console.log(
      `[Shopify][${store.label}] Order ${shopifyOrderId}${conversionNote} — ` +
      `${claims.length} NFT claim(s) para ${email} | +${totalOmmyReward} OMMY | -${totalBurn} OMMY burned`
    );

    // 7. Email de claim (fire-and-forget — no bloquea la respuesta al webhook)
    sendClaimEmail({
      toEmail: email,
      orderId: shopifyOrderId,
      productTitles: claims.map((c) => c.productTitle),
      totalOmmyReward,
      store: storeKey,
    }).catch((err) => console.error(`[Email][${store.label}] Error al enviar:`, err));

    return NextResponse.json({
      received: true,
      store: storeKey,
      orderId: shopifyOrderId,
      currency,
      orderTotalUSD,
      claimsCreated: claims.length,
      totalOmmyReward,
      totalOmmyBurned: totalBurn,
    });

  } catch (error) {
    console.error("[Shopify webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
