// API — Share to Earn
// POST /api/share
// Registra que un wallet compartió en redes y otorga OMMY reward pendiente
//
// Body: { walletAddress, platform: "twitter"|"instagram", orderId, postUrl? }
// Response: { success, ommyReward, totalShares }

import { NextRequest, NextResponse } from "next/server";
import { REWARDS, BURN } from "@/lib/tokenomics";

async function getKV() {
  if (!process.env.KV_REST_API_URL) return null;
  const { kv } = await import("@vercel/kv");
  return kv;
}

interface ShareRecord {
  walletAddress: string;
  platform: "twitter" | "instagram";
  orderId: string;
  postUrl?: string;
  ommyReward: number;
  ommyBurned: number;
  createdAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, platform, orderId, postUrl } = body;

    if (!walletAddress || !platform || !orderId) {
      return NextResponse.json(
        { error: "walletAddress, platform y orderId son requeridos" },
        { status: 400 }
      );
    }

    if (!["twitter", "instagram"].includes(platform)) {
      return NextResponse.json(
        { error: "platform debe ser 'twitter' o 'instagram'" },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: "walletAddress inválido" }, { status: 400 });
    }

    const kv = await getKV();
    const shareKey = `share:${walletAddress}:${orderId}:${platform}`;

    // Prevenir doble claim del mismo share
    if (kv) {
      const existing = await kv.get(shareKey);
      if (existing) {
        return NextResponse.json(
          { error: "Este share ya fue registrado", alreadyClaimed: true },
          { status: 409 }
        );
      }
    }

    const ommyReward =
      platform === "twitter" ? REWARDS.shareTwitter : REWARDS.shareInstagram;
    const ommyBurned = BURN.perSocialShare;

    const record: ShareRecord = {
      walletAddress,
      platform,
      orderId,
      postUrl,
      ommyReward,
      ommyBurned,
      createdAt: new Date().toISOString(),
    };

    if (kv) {
      await kv.set(shareKey, record);
      // Índice por wallet para historial
      const walletSharesKey = `shares:wallet:${walletAddress.toLowerCase()}`;
      const existing: string[] | null = await kv.get(walletSharesKey);
      const list = existing ?? [];
      list.push(shareKey);
      await kv.set(walletSharesKey, list);
    }

    console.log(
      `[Share2Earn] ${platform} | ${walletAddress.slice(0, 8)}... | Order ${orderId} | +${ommyReward} OMMY | -${ommyBurned} burned`
    );

    return NextResponse.json({
      success: true,
      ommyReward,
      ommyBurned,
      platform,
      message: `+${ommyReward} OMMY por compartir en ${platform}. Se quemaron ${ommyBurned} OMMY del ecosistema.`,
    });
  } catch (error) {
    console.error("[Share API]", error);
    return NextResponse.json(
      { error: "Error al registrar share" },
      { status: 500 }
    );
  }
}

// GET /api/share?wallet=0x...  — historial de shares de un wallet
export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get("wallet");
    if (!wallet) {
      return NextResponse.json({ error: "wallet param requerido" }, { status: 400 });
    }

    const kv = await getKV();
    if (!kv) {
      return NextResponse.json({ shares: [], totalOmmy: 0, devMode: true });
    }

    const walletSharesKey = `shares:wallet:${wallet.toLowerCase()}`;
    const shareKeys: string[] | null = await kv.get(walletSharesKey);

    if (!shareKeys || shareKeys.length === 0) {
      return NextResponse.json({ shares: [], totalOmmy: 0 });
    }

    const shares = await Promise.all(
      shareKeys.map((k) => kv.get<ShareRecord>(k))
    );
    const valid = shares.filter((s): s is ShareRecord => s !== null);
    const totalOmmy = valid.reduce((sum, s) => sum + s.ommyReward, 0);

    return NextResponse.json({ shares: valid, totalOmmy });
  } catch (error) {
    console.error("[Share GET]", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
