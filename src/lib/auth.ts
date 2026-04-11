// ─── API Key Auth ─────────────────────────────────────────────────────────────
// Middleware para proteger rutas API internas.
// Usa timingSafeEqual para prevenir timing attacks (igual que webhook Shopify).
//
// Uso en route handler:
//   const denied = requireApiKey(req);
//   if (denied) return denied;

import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export function requireApiKey(req: NextRequest): NextResponse | null {
  const secret = process.env.API_SECRET_KEY;
  if (!secret) {
    console.error("[Auth] API_SECRET_KEY no configurado");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const provided = req.headers.get("x-api-key") ?? "";

  let valid = false;
  try {
    const a = Buffer.from(secret);
    const b = Buffer.from(provided);
    valid = a.length === b.length && timingSafeEqual(a, b);
  } catch {
    valid = false;
  }

  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // autorizado
}
