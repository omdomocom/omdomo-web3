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
    subject: "Your Om Domo NFT is ready to claim 🎁",
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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Claim your Om Domo NFT</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#9333ea,#06b6d4);line-height:48px;font-size:22px;font-weight:bold;color:#fff;">O</div>
      <p style="margin:8px 0 0;font-size:14px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">Om Domo</p>
    </div>

    <!-- Main card -->
    <div style="background:#111827;border:1px solid #1e293b;border-radius:16px;padding:32px;margin-bottom:24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:40px;margin-bottom:12px;">🎁</div>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#f1f5f9;">Your NFT is ready to claim</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#64748b;">Thank you for your Om Domo purchase. You have an NFT waiting for you.</p>
      </div>

      <!-- Products -->
      <div style="background:#0f172a;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#475569;">Your purchase</p>
        <pre style="margin:0;font-family:inherit;font-size:13px;color:#cbd5e1;white-space:pre-line;">${productList}</pre>
      </div>

      <!-- OMMY reward -->
      <div style="background:linear-gradient(135deg,rgba(147,51,234,0.15),rgba(6,182,212,0.15));border:1px solid rgba(147,51,234,0.3);border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#94a3b8;">OMMY Coin reward included</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:700;background:linear-gradient(90deg,#9333ea,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">+${totalOmmyReward} OMMY</p>
      </div>

      <!-- CTA -->
      <a href="${claimUrl}" style="display:block;text-align:center;background:linear-gradient(90deg,#7c3aed,#0891b2);color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 24px;border-radius:12px;">
        Claim My NFT →
      </a>

      <p style="margin:16px 0 0;text-align:center;font-size:12px;color:#475569;">
        Or go to <a href="https://omdomo.com/claim" style="color:#7c3aed;">omdomo.com/claim</a> and enter your email
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;font-size:11px;color:#334155;">
      <p style="margin:0;">Order ${orderId} · Om Domo Ecosystem</p>
      <p style="margin:6px 0 0;color:#1e293b;">You're receiving this because you made a purchase at omdomo.com</p>
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText({ claimUrl, productList, totalOmmyReward, orderId }: TemplateData): string {
  return `Om Domo — Your NFT is ready to claim

Thank you for your purchase!

Your items:
${productList}

OMMY Coin reward: +${totalOmmyReward} OMMY

Claim your NFT here:
${claimUrl}

Or visit omdomo.com/claim and enter your email.

Order: ${orderId}
`;
}
