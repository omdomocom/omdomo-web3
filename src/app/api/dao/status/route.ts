// API — DAO Status por Wallet
// GET /api/dao/status?seasonId=xxx&wallet=0x...
// Devuelve qué NFTs ha votado/feedbacked el wallet en la temporada dada.
//
// Response: { [nftId]: { feedback1?, feedback2?, finalVote? } }

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";

// IDs de los NFTs de la temporada Chakras (debe coincidir con season/route.ts)
const CHAKRA_NFT_IDS = [
  "chakra-muladhara",
  "chakra-svadhisthana",
  "chakra-manipura",
  "chakra-anahata",
  "chakra-vishuddha",
  "chakra-ajna",
  "chakra-sahasrara",
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const seasonId = searchParams.get("seasonId");
    const wallet   = searchParams.get("wallet");

    if (!seasonId || !wallet) {
      return NextResponse.json(
        { error: "seasonId y wallet son requeridos" },
        { status: 400 }
      );
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "wallet inválido" }, { status: 400 });
    }

    const redis = await getRedis();
    if (!redis) {
      return NextResponse.json({ status: {} });
    }

    const w = wallet.toLowerCase();

    type NFTStatus = {
      feedback1?: string;
      feedback2?: string;
      finalVote?: string;
    };
    const result: Record<string, NFTStatus> = {};

    await Promise.all(
      CHAKRA_NFT_IDS.map(async (nftId) => {
        const [fb1Raw, fb2Raw, voteRaw] = await Promise.all([
          redis.get(`dao:fb:${seasonId}:${nftId}:feedback1:${w}`),
          redis.get(`dao:fb:${seasonId}:${nftId}:feedback2:${w}`),
          redis.get(`dao:vote:${seasonId}:${nftId}:${w}`),
        ]);

        if (fb1Raw || fb2Raw || voteRaw) {
          const entry: NFTStatus = {};
          if (fb1Raw)   entry.feedback1  = JSON.parse(fb1Raw).sentiment;
          if (fb2Raw)   entry.feedback2  = JSON.parse(fb2Raw).sentiment;
          if (voteRaw)  entry.finalVote  = voteRaw; // "yes"|"no"
          result[nftId] = entry;
        }
      })
    );

    return NextResponse.json({ status: result });
  } catch (error) {
    console.error("[DAO/status]", error);
    return NextResponse.json({ status: {} });
  }
}
