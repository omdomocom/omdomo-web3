// API — Share to Earn
// POST /api/share
// Registra que un wallet compartió en redes y otorga OMMY reward.
//
// Body: { walletAddress, platform: "twitter"|"instagram"|"tiktok"|"whatsapp", orderId? }
// - orderId es opcional: si no se provee, se usa "community" (un share por plataforma por wallet)
// - Si se provee, se usa "order:{orderId}" como scope (un share por pedido por plataforma)
//
// Response: { success, ommyReward, totalShares }

import { NextRequest, NextResponse } from "next/server";
import { REWARDS, BURN } from "@/lib/tokenomics";
import { getRedis } from "@/lib/redis";

const PLATFORMS = ["twitter", "instagram", "tiktok", "whatsapp"] as const;
type Platform = (typeof PLATFORMS)[number];

// Rate limit: 10 shares por IP cada 10 minutos
const RATE_LIMIT = 10;
const RATE_WINDOW_S = 600;

interface ShareRecord {
  walletAddress: string;
  platform: Platform;
  orderId: string;
  ommyReward: number;
  ommyBurned: number;
  createdAt: string;
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return true; // sin Redis, sin rate limit (fallback permisivo)
  try {
    const window = Math.floor(Date.now() / (RATE_WINDOW_S * 1000));
    const key = `rate-limit:share:${ip}:${window}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_WINDOW_S);
    return count <= RATE_LIMIT;
  } catch {
    return true;
  }
}

function getPlatformReward(platform: Platform): number {
  if (platform === "twitter")   return REWARDS.shareTwitter;
  if (platform === "instagram") return REWARDS.shareInstagram;
  // TikTok y WhatsApp: misma recompensa que Instagram
  return REWARDS.shareInstagram;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting por IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Intenta en unos minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { walletAddress, platform, orderId } = body as {
      walletAddress?: string;
      platform?: string;
      orderId?: string;
    };

    // Validaciones
    if (!walletAddress || !platform) {
      return NextResponse.json(
        { error: "walletAddress y platform son requeridos" },
        { status: 400 }
      );
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: "walletAddress inválido" }, { status: 400 });
    }
    if (!PLATFORMS.includes(platform as Platform)) {
      return NextResponse.json(
        { error: `platform debe ser uno de: ${PLATFORMS.join(", ")}` },
        { status: 400 }
      );
    }

    // Scope: si hay orderId es un share post-compra; si no, es community share
    const scope = orderId ? `order:${orderId}` : "community";
    const shareKey = `share:${walletAddress.toLowerCase()}:${scope}:${platform}`;

    const redis = await getRedis();

    // Anti-double-claim
    if (redis) {
      const existing = await redis.get(shareKey);
      if (existing) {
        return NextResponse.json(
          { error: "Este share ya fue registrado", alreadyClaimed: true },
          { status: 409 }
        );
      }
    }

    const ommyReward = getPlatformReward(platform as Platform);
    const ommyBurned = BURN.perSocialShare;

    const record: ShareRecord = {
      walletAddress: walletAddress.toLowerCase(),
      platform: platform as Platform,
      orderId: scope,
      ommyReward,
      ommyBurned,
      createdAt: new Date().toISOString(),
    };

    if (redis) {
      // Guardar registro del share (TTL 1 año)
      await redis.set(shareKey, JSON.stringify(record), "EX", 365 * 24 * 3600);

      // Índice por wallet para historial
      const walletKey = `shares:wallet:${walletAddress.toLowerCase()}`;
      const existingList = await redis.get(walletKey);
      const list: string[] = existingList ? JSON.parse(existingList) : [];
      if (!list.includes(shareKey)) {
        list.push(shareKey);
        await redis.set(walletKey, JSON.stringify(list));
      }
    }

    console.log(
      `[Share2Earn] ${platform} | ${walletAddress.slice(0, 8)}... | ${scope} | +${ommyReward} OMMY | -${ommyBurned} burned`
    );

    return NextResponse.json({
      success: true,
      ommyReward,
      ommyBurned,
      platform,
      message: `+${ommyReward.toLocaleString()} OMMY por compartir en ${platform}. Se quemaron ${ommyBurned} OMMY del supply.`,
    });
  } catch (error) {
    console.error("[Share API]", error);
    return NextResponse.json({ error: "Error al registrar share" }, { status: 500 });
  }
}

// GET /api/share?wallet=0x...  — historial de shares de un wallet
export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get("wallet");
    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "wallet param requerido y válido" }, { status: 400 });
    }

    const redis = await getRedis();
    if (!redis) {
      return NextResponse.json({ shares: [], totalOmmy: 0 });
    }

    const walletKey = `shares:wallet:${wallet.toLowerCase()}`;
    const raw = await redis.get(walletKey);
    const shareKeys: string[] = raw ? JSON.parse(raw) : [];

    if (shareKeys.length === 0) {
      return NextResponse.json({ shares: [], totalOmmy: 0 });
    }

    const shareValues = await Promise.all(shareKeys.map((k) => redis.get(k)));
    const shares = shareValues
      .map((v) => (v ? JSON.parse(v) as ShareRecord : null))
      .filter((s): s is ShareRecord => s !== null);

    const totalOmmy = shares.reduce((sum, s) => sum + s.ommyReward, 0);

    return NextResponse.json({ shares, totalOmmy });
  } catch (error) {
    console.error("[Share GET]", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
