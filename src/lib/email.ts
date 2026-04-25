// Email notifications via Resend (resend.com — free tier: 3k/month)
// Setup: get API key at resend.com → add RESEND_API_KEY to .env.local
// Also verify your sending domain (omdomo.com) in Resend dashboard

import { Resend } from "resend";

// Lazy init — only create when API key exists, avoids build-time crash
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export interface ClaimEmailData {
  toEmail: string;
  orderId: string;
  productTitles: string[];   // one per line item
  totalOmmyReward: number;
}

export async function sendClaimEmail(data: ClaimEmailData): Promise<void> {
  const { toEmail, orderId, productTitles, totalOmmyReward } = data;

  const resend = getResend();
  if (!resend) {
    console.log("[Email DEV] RESEND_API_KEY not set — skipping email to", toEmail);
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://omdomo-web3.vercel.app";
  const claimUrl = `${baseUrl}/claim?email=${encodeURIComponent(toEmail)}`;
  const productList = productTitles.map((t) => `• ${t}`).join("\n");

  await resend.emails.send({
    // Use verified Resend domain until omdomo.com is verified in Resend dashboard
    // Once verified, change to: "Om Domo <noreply@omdomo.com>"
    from: process.env.EMAIL_FROM || "Om Domo <onboarding@resend.dev>",
    to: toEmail,
    subject: "🎁 Tu NFT Genesis Om Domo te está esperando",
    html: buildEmailHTML({ claimUrl, productList, totalOmmyReward, orderId }),
    text: buildEmailText({ claimUrl, productList, totalOmmyReward, orderId }),
  });

  console.log(`[Email] Claim email sent to ${toEmail} for order ${orderId}`);
}

// ─── HTML Template ────────────────────────────────────────────────────────────

interface TemplateData {
  claimUrl: string;
  productList: string;
  totalOmmyReward: number;
  orderId: string;
}

function buildEmailHTML({ claimUrl, productList, totalOmmyReward, orderId }: TemplateData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tu NFT Genesis Om Domo te está esperando</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#9333ea,#06b6d4);line-height:48px;font-size:22px;font-weight:bold;color:#fff;">O</div>
      <p style="margin:8px 0 0;font-size:14px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">Om Domo</p>
    </div>

    <!-- Genesis badge -->
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:linear-gradient(90deg,#9333ea,#f59e0b);color:#fff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:6px 16px;border-radius:999px;">✦ NFT Genesis — Máxima rareza</span>
    </div>

    <!-- Main card -->
    <div style="background:#111827;border:1px solid #1e293b;border-radius:16px;padding:32px;margin-bottom:24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:40px;margin-bottom:12px;">🎁</div>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#f1f5f9;">Tu NFT está listo para reclamar</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#64748b;">Compraste antes del lanzamiento oficial — tu NFT tiene rareza Genesis, la más alta del ecosistema.</p>
      </div>

      <!-- Products -->
      <div style="background:#0f172a;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#475569;">Tu compra</p>
        <pre style="margin:0;font-family:inherit;font-size:13px;color:#cbd5e1;white-space:pre-line;">${productList}</pre>
      </div>

      <!-- OMMY reward -->
      <div style="background:linear-gradient(135deg,rgba(147,51,234,0.15),rgba(6,182,212,0.15));border:1px solid rgba(147,51,234,0.3);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#94a3b8;">OMMY Coins ganadas con esta compra</p>
        <p style="margin:4px 0 0;font-size:28px;font-weight:700;background:linear-gradient(90deg,#9333ea,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">+${totalOmmyReward} OMMY</p>
        <p style="margin:6px 0 0;font-size:11px;color:#475569;">+1,000 OMMY extra al reclamar tu NFT · +500 OMMY por compartir en redes</p>
      </div>

      <!-- What are OMMY Coins -->
      <div style="background:#0f172a;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">¿Qué puedes hacer con tus OMMY Coins?</p>
        <p style="margin:0 0 6px;font-size:13px;color:#cbd5e1;">🛍️ Descuentos en futuras compras Om Domo</p>
        <p style="margin:0 0 6px;font-size:13px;color:#cbd5e1;">⚡ Acceso prioritario a drops exclusivos</p>
        <p style="margin:0 0 6px;font-size:13px;color:#cbd5e1;">🗳️ Vota en las decisiones de la marca (DAO)</p>
        <p style="margin:0;font-size:13px;color:#cbd5e1;">🌐 Acceso a la comunidad gateada Om Domo</p>
      </div>

      <!-- CTA -->
      <a href="${claimUrl}" style="display:block;text-align:center;background:linear-gradient(90deg,#7c3aed,#0891b2);color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 24px;border-radius:12px;">
        Reclamar mi NFT Genesis →
      </a>

      <p style="margin:16px 0 0;text-align:center;font-size:12px;color:#475569;">
        O entra en <a href="https://web3.omdomo.com/claim" style="color:#7c3aed;">web3.omdomo.com/claim</a> con tu email
      </p>
    </div>

    <!-- Discord CTA -->
    <div style="background:#1e1333;border:1px solid #3b1f6e;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 8px;font-size:14px;color:#e2e8f0;font-weight:600;">Únete a la comunidad Om Domo</p>
      <p style="margin:0 0 14px;font-size:12px;color:#94a3b8;">Conecta con otros holders, accede a drops antes que nadie y sé parte de las decisiones de la marca.</p>
      <a href="https://discord.gg/xXezFXnpaX" style="display:inline-block;background:#5865f2;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;">Entrar al Discord →</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;font-size:11px;color:#334155;">
      <p style="margin:0;">Pedido ${orderId} · Om Domo Ecosystem · web3.omdomo.com</p>
      <p style="margin:6px 0 0;color:#1e293b;">Recibes este email porque realizaste una compra en omdomo.com</p>
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText({ claimUrl, productList, totalOmmyReward, orderId }: TemplateData): string {
  return `Om Domo — Tu NFT Genesis está listo para reclamar

Compraste antes del lanzamiento oficial. Tu NFT tiene rareza Genesis — la más alta del ecosistema Om Domo.

Tu compra:
${productList}

OMMY Coins ganadas: +${totalOmmyReward} OMMY
+1,000 OMMY extra al reclamar · +500 OMMY por compartir en redes

Reclama tu NFT aquí:
${claimUrl}

O entra en web3.omdomo.com/claim con tu email.

¿Qué puedes hacer con tus OMMY Coins?
- Descuentos en futuras compras Om Domo
- Acceso prioritario a drops exclusivos
- Votar en decisiones de la marca (DAO)
- Acceso a la comunidad gateada

Únete al Discord: https://discord.gg/xXezFXnpaX

Pedido: ${orderId} · web3.omdomo.com
`;
}
