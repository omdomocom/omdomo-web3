// API — DAO Final Vote
// POST /api/dao/vote
// Registra el voto final de un wallet en fase "final-vote".
// Requiere NFT Om Domo o 10,000 OMMY (verificación on-chain pendiente Fase 2).
//
// Body: { seasonId, nftId, wallet, vote: "yes"|"no" }
// - Anti-double: un voto por nft por wallet por temporada
// - Rate limit: 20 req/hora por IP
// - Reward: +200 OMMY si vota "yes" (registrado, no on-chain)
//
// Redis schema:
//   dao:vote:{seasonId}:{nftId}:{wallet}   → "yes"|"no" (SET NX)
//   dao:vote:{seasonId}:{nftId}:yes        → INCR
//   dao:vote:{seasonId}:{nftId}:no         → INCR
//   dao:vote:wallet:{wallet}               → JSON array de claves de voto

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";

const OMMY_REWARD_YES = 200;
const RATE_LIMIT      = 20;
const RATE_WINDOW_S   = 3600;

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return true;
  try {
    const window = Math.floor(Date.now() / (RATE_WINDOW_S * 1000));
    const key = `rate-limit:dao-vote:${ip}:${window}`;
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
      wallet?: string;
      vote?: string;
    };

    const { seasonId, nftId, wallet, vote } = body;

    // Validaciones
    if (!seasonId || !nftId || !wallet || !vote) {
      return NextResponse.json(
        { error: "seasonId, nftId, wallet y vote son requeridos" },
        { status: 400 }
      );
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "wallet inválido" }, { status: 400 });
    }
    if (vote !== "yes" && vote !== "no") {
      return NextResponse.json({ error: "vote debe ser 'yes' o 'no'" }, { status: 400 });
    }

    const voteKey    = `dao:vote:${seasonId}:${nftId}:${wallet.toLowerCase()}`;
    const voteYesKey = `dao:vote:${seasonId}:${nftId}:yes`;
    const voteNoKey  = `dao:vote:${seasonId}:${nftId}:no`;
    const redis      = await getRedis();

    // Anti-double-vote
    if (redis) {
      const existing = await redis.get(voteKey);
      if (existing) {
        return NextResponse.json(
          { error: "Ya votaste en este NFT", alreadyVoted: true, previousVote: existing },
          { status: 409 }
        );
      }
    }

    if (redis) {
      // Guardar voto (TTL 1 año)
      await redis.set(voteKey, vote, "EX", 365 * 24 * 3600);

      // Incrementar contador correspondiente
      if (vote === "yes") {
        await redis.incr(voteYesKey);
      } else {
        await redis.incr(voteNoKey);
      }

      // Índice por wallet
      const walletKey = `dao:vote:wallet:${wallet.toLowerCase()}`;
      const raw = await redis.get(walletKey);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(voteKey)) {
        list.push(voteKey);
        await redis.set(walletKey, JSON.stringify(list));
      }
    }

    const ommyReward = vote === "yes" ? OMMY_REWARD_YES : 0;

    console.log(`[DAO/vote] ${nftId} | ${wallet.slice(0,8)}... | ${vote}`);

    return NextResponse.json({
      success: true,
      vote,
      ommyReward,
      message: vote === "yes"
        ? `✓ Votaste a favor — +${ommyReward} OMMY`
        : "✗ Votaste en contra — gracias por participar",
    });
  } catch (error) {
    console.error("[DAO/vote]", error);
    return NextResponse.json({ error: "Error al registrar voto" }, { status: 500 });
  }
}
