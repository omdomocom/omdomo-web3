// POST /api/precompra/register
// Registra una reserva de pre-compra OMMY COIN en Redis
// Envía email de confirmación via Resend

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getResend } from "@/lib/email";

const PRECOMPRA_WALLET = "0x7c7cd287e3901888d29218b4fDe00C9c6Bc0F1e2";
const UNLOCK_DATE = "21 Diciembre 2026 — Solsticio de Invierno";
const OMMY_PRICE_USD = 0.001;

// Regex txHash EVM: 0x seguido de 64 hex chars (32 bytes)
const TX_HASH_RE = /^0x[a-fA-F0-9]{64}$/;

// Obtiene precio de AVAX desde CoinGecko con fallback razonable.
// NO confiar en el valor que envía el cliente (manipulable para inflar OMMY).
async function getAvaxPriceUSD(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json() as { "avalanche-2": { usd: number } };
    return data["avalanche-2"].usd;
  } catch {
    console.warn("[PreCompra] CoinGecko fallback — usando precio conservador 20 USD/AVAX");
    return 20; // fallback conservador
  }
}

export async function POST(req: NextRequest) {
  try {
    const { wallet, email, avaxAmount, txHash } = await req.json() as {
      wallet?: string;
      email?: string;
      avaxAmount?: number;
      txHash?: string;
      // avaxPriceUSD se ignora intencionalmente — se obtiene server-side
    };

    // Validaciones
    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "Wallet inválida" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }
    if (!avaxAmount || avaxAmount < 0.05) {
      return NextResponse.json({ error: "Mínimo 0.05 AVAX" }, { status: 400 });
    }
    if (!txHash) {
      return NextResponse.json({ error: "TX hash requerido" }, { status: 400 });
    }
    // Validar formato de txHash para evitar datos corruptos
    if (!TX_HASH_RE.test(txHash)) {
      return NextResponse.json({ error: "TX hash inválido" }, { status: 400 });
    }

    // Obtener precio AVAX server-side — no confiar en el cliente
    const price = await getAvaxPriceUSD();
    const ommyReserved = Math.floor((avaxAmount * price) / OMMY_PRICE_USD);
    const usdValue = avaxAmount * price;

    const record = {
      wallet: wallet.toLowerCase(),
      email,
      avaxAmount,
      avaxPriceUSD: price,   // precio obtenido server-side, no del cliente
      ommyReserved,
      usdValue,
      txHash,
      unlockDate: "2026-12-21",
      status: "reserved",
      reservedAt: new Date().toISOString(),
    };

    // Guardar en Redis
    const redis = await getRedis();
    const key = `precompra:${wallet.toLowerCase()}`;

    if (redis) {
      // Verificar si ya tiene reserva
      const existing = await redis.get(key);
      if (existing) {
        const prev = JSON.parse(existing);
        // Acumular si ya tiene
        record.ommyReserved += prev.ommyReserved ?? 0;
        record.avaxAmount   += prev.avaxAmount ?? 0;
        record.usdValue     += prev.usdValue ?? 0;
      }

      await redis.set(key, JSON.stringify(record), "EX", 60 * 60 * 24 * 400); // 400 días

      // Contador global de OMMY reservados
      await redis.incrby("precompra:total_ommy", ommyReserved);
      await redis.incr("precompra:total_holders");
    }

    // Email de confirmación
    const resend = getResend();
    if (resend && email) {
      const explorerUrl = `https://snowtrace.io/tx/${txHash}`;
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Om Domo <noreply@omdomo.com>",
        to: email,
        subject: `✅ Pre-compra confirmada — ${ommyReserved.toLocaleString()} OMMY reservados`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0c0906; color: #f5f0e8; padding: 32px; border-radius: 16px;">
            <img src="https://web3.omdomo.com/logo-blanco.png" alt="Om Domo" style="height: 40px; margin-bottom: 24px;" />
            <h1 style="color: #fbbf24; font-size: 24px; margin: 0 0 8px;">¡Pre-compra confirmada! 🌟</h1>
            <p style="color: rgba(245,240,232,0.7); margin: 0 0 24px;">Eres parte de los early believers de Om Domo.</p>

            <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px; font-size: 13px; color: rgba(245,240,232,0.6);">OMMY COIN reservados</p>
              <p style="margin: 0; font-size: 32px; font-weight: 900; color: #fbbf24;">${ommyReserved.toLocaleString()} OMMY</p>
              <p style="margin: 4px 0 0; font-size: 12px; color: rgba(245,240,232,0.5);">≈ $${usdValue.toFixed(2)} USD al precio de lanzamiento</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.1); color: rgba(245,240,232,0.6); font-size: 12px;">Precio por OMMY</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.1); color: #f5f0e8; font-size: 12px; text-align: right; font-weight: bold;">$0.001 USD</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.1); color: rgba(245,240,232,0.6); font-size: 12px;">AVAX pagados</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.1); color: #f5f0e8; font-size: 12px; text-align: right; font-weight: bold;">${avaxAmount.toFixed(4)} AVAX</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.1); color: rgba(245,240,232,0.6); font-size: 12px;">Tu wallet</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.1); color: #f5f0e8; font-size: 12px; text-align: right;">${wallet.slice(0, 6)}...${wallet.slice(-4)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: rgba(245,240,232,0.6); font-size: 12px;">🔒 Unlock</td>
                <td style="padding: 8px 0; color: #a78bfa; font-size: 12px; text-align: right; font-weight: bold;">${UNLOCK_DATE}</td>
              </tr>
            </table>

            <a href="${explorerUrl}" style="display: inline-block; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); color: #fbbf24; padding: 10px 20px; border-radius: 8px; font-size: 12px; text-decoration: none; margin-bottom: 24px;">
              Ver transacción en Snowtrace →
            </a>

            <p style="font-size: 11px; color: rgba(245,240,232,0.4); line-height: 1.6;">
              Los tokens quedan bloqueados hasta el <strong style="color: rgba(245,240,232,0.6);">Solsticio de Invierno, 21 Diciembre 2026</strong>.
              En esa fecha podrás reclamarlos en web3.omdomo.com con esta misma wallet.
              El lanzamiento oficial es el <strong style="color: rgba(245,240,232,0.6);">Solsticio de Verano, 21 Agosto 2026</strong>.
            </p>

            <hr style="border: none; border-top: 1px solid rgba(245,240,232,0.1); margin: 20px 0;" />
            <p style="font-size: 11px; color: rgba(245,240,232,0.3); margin: 0;">Om Domo · Spiritual Web3 Lifestyle · omdomo.com</p>
          </div>
        `,
      }).catch((err: unknown) => {
        console.error("[PreCompra Email]", err);
      });
    }

    console.log(`[PreCompra] ${wallet} | ${ommyReserved.toLocaleString()} OMMY | ${avaxAmount} AVAX | TX: ${txHash}`);

    return NextResponse.json({
      success: true,
      ommyReserved,
      usdValue,
      unlockDate: UNLOCK_DATE,
      txHash,
      explorerUrl: `https://snowtrace.io/tx/${txHash}`,
    });
  } catch (error) {
    console.error("[PreCompra Register]", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// GET /api/precompra/register?wallet=0x...
// Consulta la reserva de una wallet
export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "wallet requerida" }, { status: 400 });

  const redis = await getRedis();
  if (!redis) return NextResponse.json({ reservation: null });

  const [record, totalOmmy, totalHolders] = await Promise.all([
    redis.get(`precompra:${wallet.toLowerCase()}`),
    redis.get("precompra:total_ommy"),
    redis.get("precompra:total_holders"),
  ]);

  return NextResponse.json({
    reservation: record ? JSON.parse(record) : null,
    stats: {
      totalOmmyReserved: parseInt(totalOmmy ?? "0"),
      totalHolders: parseInt(totalHolders ?? "0"),
      totalAvailable: 2_997_924_580,
    },
  });
}
