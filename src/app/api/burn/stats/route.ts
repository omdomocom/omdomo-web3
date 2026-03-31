// API — Estadísticas de quema de OMMY
// GET /api/burn/stats
// Devuelve: total quemado, % progreso, supply actual estimado, transacciones

import { NextResponse } from "next/server";
import { getAllClaims } from "@/lib/claims";
import { BURN, SUPPLY, getCurrentBurnPercent } from "@/lib/tokenomics";

export async function GET() {
  try {
    const claims = await getAllClaims();

    // Calcular burn total basado en claims procesados
    const claimedOrders = claims.filter((c) => c.status === "claimed");
    const totalPurchaseBurns = claimedOrders.length * BURN.perPurchase;

    // Burn estimado por transacciones on-chain (2% de rewards distribuidos)
    const totalRewardsDistributed = claimedOrders.reduce((s, c) => s + c.ommyReward, 0);
    const transactionBurns = Math.floor(totalRewardsDistributed * BURN.perTransaction);

    const totalBurned = totalPurchaseBurns + transactionBurns;
    const burnPercent = getCurrentBurnPercent(totalBurned);
    const currentSupply = SUPPLY.initial - totalBurned;

    return NextResponse.json({
      totalBurned,
      burnPercent: parseFloat(burnPercent.toFixed(4)),
      currentSupply,
      initialSupply: SUPPLY.initial,
      finalTarget: SUPPLY.final,
      burnTarget: SUPPLY.burnTarget,
      burnTargetPercent: SUPPLY.burnPercent,
      breakdown: {
        purchaseBurns: totalPurchaseBurns,
        transactionBurns,
        claimedOrders: claimedOrders.length,
        totalOrders: claims.length,
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Burn Stats]", error);
    return NextResponse.json(
      { error: "Failed to fetch burn stats" },
      { status: 500 }
    );
  }
}
