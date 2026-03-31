// Called after customer successfully mints on-chain
// Records the transaction hash and marks claim as complete

import { NextRequest, NextResponse } from "next/server";
import { updateClaim } from "@/lib/claims";

export async function POST(req: NextRequest) {
  try {
    const { orderId, txHash, tokenId = "0" } = await req.json();

    if (!orderId || !txHash) {
      return NextResponse.json({ error: "orderId and txHash required" }, { status: 400 });
    }

    const updated = updateClaim(orderId, {
      status: "claimed",
      claimedAt: new Date().toISOString(),
      txHash,
      tokenId,
    });

    if (!updated) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    console.log(`[NFT Confirmed] Order ${orderId} | TX: ${txHash}`);
    return NextResponse.json({ success: true, claim: updated });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
