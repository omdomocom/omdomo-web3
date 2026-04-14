// /api/nft/claim-zodiac — Claim gratuito de NFT Zodiacal por completar perfil
// Requiere: wallet + email + birthday
// Calcula el signo zodiacal server-side (no confía en el cliente)
// Anti-doble-claim: Redis key "zodiac-claimed:{wallet}"
// Usa mintAdditionalSupplyTo → bypasea claim conditions (requiere MINTER_ROLE)

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

// ─── Zodiac calculation (server-side) ────────────────────────────────────────

const ZODIAC_MAP: { name: string; tokenId: number; start: [number, number]; end: [number, number] }[] = [
  { name: "Capricornio", tokenId: 10, start: [12, 22], end: [1,  19] },
  { name: "Acuario",     tokenId: 11, start: [1,  20], end: [2,  18] },
  { name: "Piscis",      tokenId: 12, start: [2,  19], end: [3,  20] },
  { name: "Aries",       tokenId: 1,  start: [3,  21], end: [4,  19] },
  { name: "Tauro",       tokenId: 2,  start: [4,  20], end: [5,  20] },
  { name: "Géminis",     tokenId: 3,  start: [5,  21], end: [6,  20] },
  { name: "Cáncer",      tokenId: 4,  start: [6,  21], end: [7,  22] },
  { name: "Leo",         tokenId: 5,  start: [7,  23], end: [8,  22] },
  { name: "Virgo",       tokenId: 6,  start: [8,  23], end: [9,  22] },
  { name: "Libra",       tokenId: 7,  start: [9,  23], end: [10, 22] },
  { name: "Escorpio",    tokenId: 8,  start: [10, 23], end: [11, 21] },
  { name: "Sagitario",   tokenId: 9,  start: [11, 22], end: [12, 21] },
];

function getZodiacFromBirthday(birthday: string): { name: string; tokenId: number } | null {
  const d = new Date(birthday + "T12:00:00Z");
  if (isNaN(d.getTime())) return null;
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();

  for (const z of ZODIAC_MAP) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm === 12) {
      // Capricornio: 22 Dic – 19 Ene
      if ((m === 12 && day >= sd) || (m === 1 && day <= ed)) return z;
    } else {
      if ((m === sm && day >= sd) || (m === em && day <= ed)) return z;
    }
  }
  return null;
}

// ─── Mint usando mintAdditionalSupplyTo (bypasea claim conditions) ────────────

async function mintZodiacNFT(toAddress: string, tokenId: bigint, contractAddress: string) {
  const { createThirdwebClient, getContract } = await import("thirdweb");
  const { avalancheFuji, avalanche } = await import("thirdweb/chains");
  const { claimTo } = await import("thirdweb/extensions/erc1155");
  const { sendTransaction } = await import("thirdweb");
  const { privateKeyToAccount } = await import("thirdweb/wallets");

  // Usa mainnet si el contrato mainnet está configurado
  const isMainnet = !!(process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET);

  const serverClient = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  const minterAccount = privateKeyToAccount({
    client: serverClient,
    privateKey: process.env.MINTER_PRIVATE_KEY || "",
  });

  const contract = getContract({
    client: serverClient,
    chain: isMainnet ? avalanche : avalancheFuji,
    address: contractAddress,
  });

  // claimTo con precio 0 — requiere Claim Condition a 0 AVAX en Thirdweb Dashboard
  // La seguridad es la API: Redis anti-double-claim + verificación perfil completo
  const transaction = claimTo({
    contract,
    to: toAddress,
    tokenId,
    quantity: BigInt(1),
  });

  const receipt = await sendTransaction({
    transaction,
    account: minterAccount,
  });

  return receipt;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { wallet, email, birthday } = await req.json() as {
      wallet?: string;
      email?: string;
      birthday?: string;
    };

    // Validaciones básicas
    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "Wallet inválida" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }
    if (!birthday) {
      return NextResponse.json({ error: "Fecha de nacimiento requerida" }, { status: 400 });
    }

    // Calcular signo zodiacal server-side
    const zodiac = getZodiacFromBirthday(birthday);
    if (!zodiac) {
      return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
    }

    // Anti-doble-claim via Redis
    const redis = await getRedis();
    const claimKey = `zodiac-claimed:${wallet.toLowerCase()}`;

    if (redis) {
      const already = await redis.get(claimKey);
      if (already) {
        const parsed = JSON.parse(already);
        return NextResponse.json(
          {
            error: "Ya reclamaste tu NFT Zodiacal",
            zodiac: parsed.zodiac,
            txHash: parsed.txHash,
          },
          { status: 409 }
        );
      }
    }

    // Obtener dirección del contrato — mainnet si está configurado
    const isMainnet = !!(process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET);
    const contractAddress = isMainnet
      ? (process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET || "")
      : (process.env.NEXT_PUBLIC_NFT_CONTRACT_FUJI || "");
    const minterKey = process.env.MINTER_PRIVATE_KEY || "";

    // Dev mode — sin contrato configurado
    if (!contractAddress || !minterKey) {
      // Guardar igual en Redis para que no se pueda reclamar dos veces en dev
      if (redis) {
        await redis.set(
          claimKey,
          JSON.stringify({ zodiac: zodiac.name, tokenId: zodiac.tokenId, txHash: "DEV_MODE", email, claimedAt: new Date().toISOString() }),
          "EX",
          60 * 60 * 24 * 365 // 1 año
        );
      }
      return NextResponse.json({
        success: true,
        devMode: true,
        txHash: "DEV_MODE",
        zodiac: zodiac.name,
        tokenId: zodiac.tokenId,
        message: "Dev mode — NFT Zodiacal registrado. Configura NEXT_PUBLIC_NFT_CONTRACT_MAINNET en Vercel para el mint real.",
      });
    }

    // Mintear NFT
    try {
      const receipt = await mintZodiacNFT(wallet, BigInt(zodiac.tokenId), contractAddress);
      const txHash = receipt.transactionHash;

      // Registrar en Redis (anti-doble-claim permanente)
      if (redis) {
        await redis.set(
          claimKey,
          JSON.stringify({ zodiac: zodiac.name, tokenId: zodiac.tokenId, txHash, email, claimedAt: new Date().toISOString() }),
          "EX",
          60 * 60 * 24 * 365 * 10 // 10 años
        );
      }

      const explorerBase = isMainnet
        ? "https://snowtrace.io/tx/"
        : "https://testnet.snowtrace.io/tx/";

      console.log(`[Zodiac Claim] ${zodiac.name} (tokenId ${zodiac.tokenId}) → ${wallet} | TX: ${txHash} | email: ${email}`);

      return NextResponse.json({
        success: true,
        txHash,
        explorerUrl: explorerBase + txHash,
        zodiac: zodiac.name,
        tokenId: zodiac.tokenId,
      });
    } catch (mintErr) {
      const errMsg = String(mintErr);
      console.error(`[Zodiac Claim] Mint error — wallet=${wallet} tokenId=${zodiac.tokenId}:`, errMsg);

      // Si falta el MINTER_ROLE, dar instrucción clara
      if (errMsg.includes("MINTER_ROLE") || errMsg.includes("unauthorized") || errMsg.includes("AccessControl")) {
        return NextResponse.json(
          { error: "El minter necesita MINTER_ROLE en el contrato. Ve a Thirdweb Dashboard → tu contrato → Permisos → añade 0x648FD67c26E607324B860d95b2ee8834EE30b146 con rol Minter." },
          { status: 403 }
        );
      }

      // Clasificar el error para dar mensaje útil al usuario
      let userMsg = "Error al mintear NFT";
      if (errMsg.includes("insufficient funds") || errMsg.includes("gas")) {
        userMsg = "El minter wallet no tiene AVAX suficiente para gas en Mainnet. Recarga 0x648FD67...30b146 con AVAX.";
      } else if (errMsg.includes("MINTER_ROLE") || errMsg.includes("unauthorized") || errMsg.includes("AccessControl")) {
        userMsg = "El minter no tiene permisos. Ve a Thirdweb → Permissions → añade 0x648FD67...30b146 como Minter y firma con MetaMask.";
      } else if (errMsg.includes("TokenDoesNotExist") || errMsg.includes("does not exist") || errMsg.includes("token")) {
        userMsg = "El token zodiacal no existe aún en el contrato. Configura Claim Conditions en Thirdweb Dashboard.";
      }

      return NextResponse.json(
        { error: userMsg, raw: errMsg.slice(0, 400) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Zodiac Claim]", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
