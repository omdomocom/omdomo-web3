// Check pending claims by email or order ID
import { NextRequest, NextResponse } from "next/server";
import { getClaimsByShopifyOrderId, getClaimsByEmail } from "@/lib/claims";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");

  if (orderId) {
    const claims = await getClaimsByShopifyOrderId(orderId);
    if (claims.length === 0) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    return NextResponse.json({ found: true, claims });
  }

  if (email) {
    const claims = await getClaimsByEmail(email);
    return NextResponse.json({ found: claims.length > 0, claims });
  }

  return NextResponse.json(
    { error: "orderId or email required" },
    { status: 400 }
  );
}
