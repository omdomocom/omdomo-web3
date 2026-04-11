// Shopify Webhook Handler — orders/paid
// ─────────────────────────────────────────────────────────────────────────────
// Setup in Shopify:
//   Admin → Settings → Notifications → Webhooks
//   Event: "Order payment"
//   URL:   https://yourdomain.com/api/shopify/webhook
//   Format: JSON
//   Secret: copy SHOPIFY_WEBHOOK_SECRET from .env.local

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClaim } from "@/lib/claims";
import { calculateOmmyReward, calculateOmmyBurn } from "@/lib/nft";
import { sendClaimEmail } from "@/lib/email";

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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmac = req.headers.get("x-shopify-hmac-sha256") || "";
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

    // SHOPIFY_WEBHOOK_SECRET es obligatorio en producción
    if (!secret) {
      console.error("[Shopify webhook] SHOPIFY_WEBHOOK_SECRET no configurado — rechazando request");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    if (!verifyShopifyWebhook(rawBody, hmac, secret)) {
      console.warn("[Shopify webhook] Firma HMAC inválida");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = JSON.parse(rawBody);

    // Extract relevant data from Shopify order
    const orderId = String(order.id);
    const email = order.email || order.contact_email || "";
    const orderTotal = parseFloat(order.total_price || "0");
    const currency = order.currency || "USD";

    // Get first line item as the "primary product" for NFT
    const lineItems: Array<{
      title: string;
      product_id: number;
      quantity: number;
    }> = order.line_items || [];

    if (lineItems.length === 0 || !email) {
      return NextResponse.json({ received: true, skipped: "no line items or email" });
    }

    // Create one claim per line item (each product → its own NFT)
    const claims = await Promise.all(lineItems.map((item) => {
      const itemTotal = orderTotal / lineItems.length;
      const ommyReward = calculateOmmyReward(itemTotal);
      const ommyBurn = calculateOmmyBurn(itemTotal);

      return createClaim({
        id: `${orderId}-${item.product_id}`,
        email,
        productTitle: item.title,
        productImage: "", // Shopify doesn't send image in webhook — fetched on claim
        orderTotal: itemTotal,
        ommyReward,
      }).then((claim) => ({ ...claim, ommyBurn }));
    }));

    const totalBurn = claims.reduce((s, c) => s + (c.ommyBurn ?? 0), 0);

    console.log(
      `[Shopify] Order ${orderId} — ${claims.length} NFT claim(s) for ${email} | +${claims.reduce((s, c) => s + c.ommyReward, 0)} OMMY reward | -${totalBurn} OMMY burned`
    );

    // Send claim email (fire-and-forget — don't block webhook response)
    sendClaimEmail({
      toEmail: email,
      orderId,
      productTitles: claims.map((c) => c.productTitle),
      totalOmmyReward: claims.reduce((sum, c) => sum + c.ommyReward, 0),
    }).catch((err) => console.error("[Email] Failed to send claim email:", err));

    return NextResponse.json({
      received: true,
      orderId,
      claimsCreated: claims.length,
      totalOmmyReward: claims.reduce((sum, c) => sum + c.ommyReward, 0),
      totalOmmyBurned: claims.reduce((sum, c) => sum + (c.ommyBurn ?? 0), 0),
    });
  } catch (error) {
    console.error("[Shopify webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
