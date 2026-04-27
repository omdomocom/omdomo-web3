// Called after customer successfully mints on-chain
// Records the transaction hash and marks claim as complete

import { NextRequest, NextResponse } from "next/server";
import { getClaimByOrderId, updateClaim } from "@/lib/claims";

// Regex para txHash válido de Avalanche / EVM (32 bytes hex)
const TX_HASH_RE = /^0x[a-fA-F0-9]{64}$/;

export async function POST(req: NextRequest) {
  try {
    const { orderId, txHash, walletAddress, tokenId = "0" } = await req.json();

    if (!orderId || !txHash) {
      return NextResponse.json({ error: "orderId and txHash required" }, { status: 400 });
    }

    // Validar formato de txHash para evitar datos corruptos en Redis
    if (!TX_HASH_RE.test(txHash)) {
      return NextResponse.json({ error: "txHash inválido" }, { status: 400 });
    }

    // Obtener el claim y verificar que la wallet coincide
    const claim = await getClaimByOrderId(orderId);
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Si el claim ya tiene walletAddress aprobada, verificar que coincide
    // Previene que un tercero marque un claim como completado con su propio txHash
    if (walletAddress && claim.walletAddress) {
      if (claim.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        console.warn(`[confirm-claimed] Wallet mismatch — orderId=${orderId} claim.wallet=${claim.walletAddress} req.wallet=${walletAddress}`);
        return NextResponse.json({ error: "Wallet mismatch" }, { status: 403 });
      }
    }

    if (claim.status === "claimed") {
      return NextResponse.json({ success: true, alreadyClaimed: true, claim });
    }

    const updated = await updateClaim(orderId, {
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
    console.error("[NFT confirm-claimed]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
