import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

// Stripe pre-compra OMMY
// Requiere: STRIPE_SECRET_KEY en .env.local
// Rate limit: 10 sesiones / 10 min por IP para evitar abuso de Stripe API

const CHECKOUT_RATE_LIMIT = 10;
const CHECKOUT_RATE_WINDOW_S = 600;
const _checkoutMemRL = new Map<string, number>();

async function checkCheckoutRateLimit(ip: string): Promise<boolean> {
  const redis = await getRedis();
  if (redis) {
    try {
      const windowKey = `rate-limit:checkout:${ip}:${Math.floor(Date.now() / (CHECKOUT_RATE_WINDOW_S * 1000))}`;
      const count = await redis.incr(windowKey);
      if (count === 1) await redis.expire(windowKey, CHECKOUT_RATE_WINDOW_S);
      return count <= CHECKOUT_RATE_LIMIT;
    } catch { return true; }
  }
  const windowKey = `${ip}:${Math.floor(Date.now() / (CHECKOUT_RATE_WINDOW_S * 1000))}`;
  const count = (_checkoutMemRL.get(windowKey) ?? 0) + 1;
  _checkoutMemRL.set(windowKey, count);
  return count <= CHECKOUT_RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  // Rate limiting — prevenir spam de sesiones Stripe
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkCheckoutRateLimit(ip))) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera 10 minutos." },
      { status: 429 }
    );
  }

  const { ommyAmount, wallet } = await req.json();

  if (!ommyAmount || ommyAmount < 10000) {
    return NextResponse.json({ error: "Mínimo 10,000 OMMY" }, { status: 400 });
  }

  // Validar wallet si se proporciona
  if (wallet && !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: "Wallet inválida" }, { status: 400 });
  }

  // Límite máximo razonable: 50M OMMY por sesión ($50,000)
  if (ommyAmount > 50_000_000) {
    return NextResponse.json({ error: "Cantidad máxima: 50,000,000 OMMY por sesión" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe no configurado. Añade STRIPE_SECRET_KEY en .env.local" },
      { status: 503 }
    );
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(stripeKey);

  const usdAmount = Math.round(ommyAmount * 0.001 * 100); // en centavos
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://web3.omdomo.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    payment_intent_data: {
      description: `Pre-compra OMMY — Om Domo Ecosystem · ${ommyAmount.toLocaleString()} tokens · Lanzamiento Jun 2026`,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: usdAmount,
          product_data: {
            name: `${ommyAmount.toLocaleString()} OMMY — Acceso Anticipado Om Domo`,
            description: `Adquieres ${ommyAmount.toLocaleString()} Ommy Coin (OMMY) al precio de lanzamiento de $0.001 por token, reservado exclusivamente para early adopters. Los tokens se entregan en Avalanche el día del lanzamiento oficial (Junio 2026) con un período de lock de 30 días para garantizar la estabilidad del ecosistema. Formas parte de la comunidad fundadora del primer Spiritual Web3 Lifestyle de Europa.`,
            images: [`${appUrl}/logo-blanco.png`],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      wallet: wallet || "",
      ommyAmount: ommyAmount.toString(),
      type: "precompra",
    },
    success_url: `${appUrl}/?precompra=success&ommy=${ommyAmount}`,
    cancel_url: `${appUrl}/#precompra`,
  });

  return NextResponse.json({ url: session.url });
}
