// Validates a purchase claim and returns approval to mint
// The actual NFT claim happens client-side via the user's wallet
// This eliminates the need for a server-side minter wallet entirely

import { NextRequest, NextResponse } from "next/server";
import { getClaimByOrderId, getClaimsByEmail, updateClaim } from "@/lib/claims";

export async function POST(req: NextRequest) {
  try {
    const { orderId, walletAddress } = await req.json();

    if (!orderId || !walletAddress) {
      return NextResponse.json(
        { error: "orderId and walletAddress required" },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const claim = await getClaimByOrderId(orderId);
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }
    if (claim.status === "claimed") {
      return NextResponse.json(
        { error: "Already claimed", txHash: claim.txHash },
        { status: 409 }
      );
    }

    // Pre-approve: link wallet to this claim
    await updateClaim(orderId, { walletAddress, status: "pending" });

    return NextResponse.json({
      approved: true,
      orderId,
      walletAddress,
      contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_FUJI || "",
      tokenId: 0,
      quantity: 1,
      ommyReward: claim.ommyReward,
      productTitle: claim.productTitle,
    });
  } catch (error) {
    console.error("[Approve Claim]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
