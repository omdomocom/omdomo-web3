// API — DAO Feedback
// POST /api/dao/feedback
// Registra feedback de un wallet para un NFT en la fase activa.
//
// Body: { seasonId, nftId, phase, wallet, sentiment: "positive"|"neutral"|"negative", text? }
// - Anti-double: un feedback por nft por phase por wallet
// - Rate limit: 30 req/hora por IP
// - Reward: +100 OMMY (registrado, no on-chain todavía)
//
// Redis schema:
//   dao:fb:{seasonId}:{nftId}:total               → INCR (total feedbacks)
//   dao:fb:{seasonId}:{nftId}:pos                 → INCR si sentiment=positive
//   dao:fb:{seasonId}:{nftId}:{phase}:{wallet}    → JSON FeedbackRecord (SET NX)
//   dao:fb:wallet:{wallet}                        → JSON array de claves de feedback

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";

const VALID_PHASES  = ["feedback1", "feedback2"] as const;
const VALID_SENTIMENTS = ["positive", "neutral", "negative"] as const;
type Phase     = typeof VALID_PHASES[number];
type Sentiment = typeof VALID_SENTIMENTS[number];

const OMMY_REWARD    = 100;
const RATE_LIMIT     = 30;
const RATE_WINDOW_S  = 3600; // 1 hora

interface FeedbackRecord {
  seasonId: string;
  nftId: string;
  phase: Phase;
  wallet: string;
  sentiment: Sentiment;
  text: string;
  ommyReward: number;
  createdAt: string;
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return true;
  try {
    const window = Math.floor(Date.now() / (RATE_WINDOW_S * 1000));
    const key = `rate-limit:dao-feedback:${ip}:${window}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_WINDOW_S);
    return count <= RATE_LIMIT;
  } catch {
    return true;
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json() as {
      seasonId?: string;
      nftId?: string;
      phase?: string;
      wallet?: string;
      sentiment?: string;
      text?: string;
    };

    const { seasonId, nftId, phase, wallet, sentiment, text = "" } = body;

    // Validaciones
    if (!seasonId || !nftId || !phase || !wallet || !sentiment) {
      return NextResponse.json(
        { error: "seasonId, nftId, phase, wallet y sentiment son requeridos" },
        { status: 400 }
      );
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "wallet inválido" }, { status: 400 });
    }
    if (!VALID_PHASES.includes(phase as Phase)) {
      return NextResponse.json(
        { error: `phase debe ser: ${VALID_PHASES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!VALID_SENTIMENTS.includes(sentiment as Sentiment)) {
      return NextResponse.json(
        { error: `sentiment debe ser: ${VALID_SENTIMENTS.join(", ")}` },
        { status: 400 }
      );
    }
    if (text.length > 500) {
      return NextResponse.json({ error: "text máximo 500 caracteres" }, { status: 400 });
    }

    const fbKey = `dao:fb:${seasonId}:${nftId}:${phase}:${wallet.toLowerCase()}`;
    const redis = await getRedis();

    // Anti-double-feedback (un feedback por nft por phase por wallet)
    if (redis) {
      const existing = await redis.get(fbKey);
      if (existing) {
        return NextResponse.json(
          { error: "Ya enviaste feedback para este NFT en esta fase", alreadySubmitted: true },
          { status: 409 }
        );
      }
    }

    const record: FeedbackRecord = {
      seasonId,
      nftId,
      phase: phase as Phase,
      wallet: wallet.toLowerCase(),
      sentiment: sentiment as Sentiment,
      text: text.trim(),
      ommyReward: OMMY_REWARD,
      createdAt: new Date().toISOString(),
    };

    if (redis) {
      // Guardar registro del feedback (TTL 1 año)
      await redis.set(fbKey, JSON.stringify(record), "EX", 365 * 24 * 3600);

      // Incrementar contadores globales
      await redis.incr(`dao:fb:${seasonId}:${nftId}:total`);
      if (sentiment === "positive") {
        await redis.incr(`dao:fb:${seasonId}:${nftId}:pos`);
      }

      // Índice por wallet para historial
      const walletKey = `dao:fb:wallet:${wallet.toLowerCase()}`;
      const raw = await redis.get(walletKey);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(fbKey)) {
        list.push(fbKey);
        await redis.set(walletKey, JSON.stringify(list));
      }
    }

    console.log(`[DAO/feedback] ${phase} | ${nftId} | ${wallet.slice(0,8)}... | ${sentiment}`);

    return NextResponse.json({
      success: true,
      ommyReward: OMMY_REWARD,
      message: `+${OMMY_REWARD} OMMY por tu feedback en ${nftId}`,
    });
  } catch (error) {
    console.error("[DAO/feedback]", error);
    return NextResponse.json({ error: "Error al registrar feedback" }, { status: 500 });
  }
}
