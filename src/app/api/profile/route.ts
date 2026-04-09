import { NextRequest, NextResponse } from "next/server";
import { getResend } from "@/lib/email";

// ─── Profile type ─────────────────────────────────────────────────────────────
export interface ZodiacProfile {
  wallet?: string;
  email: string;
  birthday: string;
  zodiac: string;
  verified: boolean;
  createdAt: string;
  nftClaimed?: boolean;
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

const devStore = new Map<string, ZodiacProfile>();
let devWarnShown = false;

function warnDev() {
  if (devWarnShown) return;
  devWarnShown = true;
  console.warn(
    "[Profile] REDIS_URL not set — usando store en memoria (datos perdidos al reiniciar).\n" +
    "  Configura REDIS_URL=redis://... en .env.local para persistir perfiles."
  );
}

// ─── Redis helpers ────────────────────────────────────────────────────────────

async function redisGet<T>(redis: import("ioredis").Redis, key: string): Promise<T | null> {
  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

async function redisSet(redis: import("ioredis").Redis, key: string, value: unknown) {
  await redis.set(key, JSON.stringify(value));
}

// ─── Store helpers ────────────────────────────────────────────────────────────

async function getProfile(key: string): Promise<ZodiacProfile | null> {
  const redis = await getRedis();
  if (!redis) { warnDev(); return devStore.get(key) ?? null; }
  return await redisGet<ZodiacProfile>(redis, `zodiac-profile:${key}`);
}

async function setProfile(key: string, profile: ZodiacProfile): Promise<void> {
  const redis = await getRedis();
  if (!redis) { warnDev(); devStore.set(key, profile); return; }
  await redisSet(redis, `zodiac-profile:${key}`, profile);
  if (profile.email) {
    await redisSet(redis, `zodiac-email-index:${profile.email.toLowerCase()}`, key);
  }
}

// ─── Zodiac logic ─────────────────────────────────────────────────────────────

function getZodiacSign(birthday: string): string {
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricornio";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Acuario";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Piscis";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Tauro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Géminis";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cáncer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpio";
  return "Sagitario";
}

// ─── POST — crear o actualizar perfil ────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { wallet, email, birthday } = await req.json();

  if (!email || !birthday) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const zodiac = getZodiacSign(birthday);
  const key = wallet?.toLowerCase() || email.toLowerCase();

  const profile: ZodiacProfile = {
    ...(wallet ? { wallet: wallet.toLowerCase() } : {}),
    email,
    birthday,
    zodiac,
    verified: false,
    createdAt: new Date().toISOString(),
  };

  await setProfile(key, profile);

  // Si el email es diferente a la clave, indexar también por email
  const redis = await getRedis();
  if (redis && wallet) {
    await redisSet(redis, `zodiac-email-index:${email.toLowerCase()}`, key);
  } else if (!redis && wallet) {
    devStore.set(email.toLowerCase(), profile);
  }

  // Enviar email de verificación
  const resend = getResend();
  if (resend) {
    const claimUrl = wallet
      ? `${process.env.NEXT_PUBLIC_APP_URL || "https://web3.omdomo.com"}/claim-zodiac?wallet=${wallet}&email=${encodeURIComponent(email)}&zodiac=${encodeURIComponent(zodiac)}`
      : `${process.env.NEXT_PUBLIC_APP_URL || "https://web3.omdomo.com"}/claim-zodiac?email=${encodeURIComponent(email)}&zodiac=${encodeURIComponent(zodiac)}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Om Domo <noreply@omdomo.com>",
      to: email,
      subject: `Tu NFT ${zodiac} te espera — Om Domo`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0c0906;color:#f5f0e8;padding:32px;border-radius:16px;">
          <h1 style="font-size:24px;margin-bottom:8px;">Hola, ${zodiac} ✨</h1>
          <p style="color:#9ca3af;margin-bottom:24px;">Tu NFT zodiacal Om Domo está listo. Verifica tu email para reclamarlo gratis.</p>
          <a href="${claimUrl}"
            style="display:inline-block;background:linear-gradient(to right,#9333ea,#06b6d4);color:white;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;">
            Reclamar NFT ${zodiac} →
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px;">
            ${wallet ? `Wallet: ${wallet.slice(0, 6)}...${wallet.slice(-4)}<br/>` : ""}Signo: ${zodiac}
          </p>
        </div>
      `,
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true, zodiac });
}

// ─── GET — obtener perfil ─────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  const email = req.nextUrl.searchParams.get("email");

  if (!wallet && !email) {
    return NextResponse.json({ error: "Falta wallet o email" }, { status: 400 });
  }

  let key = wallet?.toLowerCase() || email!.toLowerCase();
  let profile = await getProfile(key);

  // Si no encontramos por wallet, buscar por email index
  if (!profile && email) {
    const redis = await getRedis();
    if (redis) {
      const walletKey = await redisGet<string>(redis, `zodiac-email-index:${email.toLowerCase()}`);
      if (walletKey) profile = await getProfile(walletKey);
    } else {
      profile = devStore.get(email.toLowerCase()) ?? null;
    }
  }

  return NextResponse.json(profile ?? null);
}

// ─── PATCH — marcar NFT como reclamado ───────────────────────────────────────

export async function PATCH(req: NextRequest) {
  const { wallet, email } = await req.json();

  if (!wallet && !email) {
    return NextResponse.json({ error: "Falta wallet o email" }, { status: 400 });
  }

  const key = wallet?.toLowerCase() || email!.toLowerCase();
  const profile = await getProfile(key);

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  const updated: ZodiacProfile = { ...profile, nftClaimed: true };
  await setProfile(key, updated);

  return NextResponse.json({ ok: true, profile: updated });
}
