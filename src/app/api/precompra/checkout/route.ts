import { NextRequest, NextResponse } from "next/server";

// Stripe pre-compra OMMY
// Requiere: STRIPE_SECRET_KEY en .env.local
// npm install stripe

export async function POST(req: NextRequest) {
  const { ommyAmount, wallet } = await req.json();

  if (!ommyAmount || ommyAmount < 10000) {
    return NextResponse.json({ error: "Mínimo 10,000 OMMY" }, { status: 400 });
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
