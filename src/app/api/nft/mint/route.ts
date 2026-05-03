// NFT Mint API — called when customer claims their NFT
// Uses Edition Drop claimTo — correct method for ERC-1155 Edition Drop contracts
// Minter wallet only needs AVAX for gas, no special role required for claimTo

import { NextRequest, NextResponse } from "next/server";
import { getClaimByOrderId, updateClaim } from "@/lib/claims";
import { buildNFTMetadata } from "@/lib/nft";
import { getRedis } from "@/lib/redis";

async function claimNFTTo(toAddress: string, tokenId: bigint, contractAddress: string) {
  const { createThirdwebClient, getContract } = await import("thirdweb");
  const { avalancheFuji, avalanche } = await import("thirdweb/chains");
  const { claimTo } = await import("thirdweb/extensions/erc1155");
  const { sendTransaction } = await import("thirdweb");
  const { privateKeyToAccount } = await import("thirdweb/wallets");

  const isMainnet = !!(process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET);
  const activeChain = isMainnet ? avalanche : avalancheFuji;

  const serverClient = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  // Minter wallet — needs AVAX on the active chain for gas fees
  // Address: 0x648FD67c26E607324B860d95b2ee8834EE30b146
  const minterAccount = privateKeyToAccount({
    client: serverClient,
    privateKey: process.env.MINTER_PRIVATE_KEY || "",
  });

  const contract = getContract({
    client: serverClient,
    chain: activeChain,
    address: contractAddress,
  });

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type: string = body.type ?? "shopify";

    // ── Zodiac mint (compra con OMMY o claim gratis) ──────────────────────────
    if (type === "zodiac") {
      const { wallet, email, tokenId: rawTokenId } = body as {
        wallet?: string;
        email?: string;
        tokenId?: string;
        paymentTxHash?: string;
      };

      const walletAddress = wallet ?? "";
      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
      }

      const parsedTokenId = parseInt(rawTokenId ?? "0", 10);
      if (isNaN(parsedTokenId) || parsedTokenId < 1 || parsedTokenId > 12) {
        return NextResponse.json({ error: "tokenId must be between 1 and 12 for zodiac NFTs" }, { status: 400 });
      }

      // Anti-doble-claim: verificar en Redis que esta wallet no haya minteado ya via este endpoint
      const redis = await getRedis();
      if (redis) {
        const claimKey = `zodiac-claimed:${walletAddress.toLowerCase()}`;
        const already = await redis.get(claimKey);
        if (already) {
          const parsed = JSON.parse(already);
          return NextResponse.json(
            { error: "Ya reclamaste tu NFT Zodiacal", zodiac: parsed.zodiac, txHash: parsed.txHash },
            { status: 409 }
          );
        }
      }

      const useMainnet = !!(process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET);
      const contractAddress = useMainnet
        ? (process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET || "")
        : (process.env.NEXT_PUBLIC_NFT_CONTRACT_FUJI || "");
      const minterKey = process.env.MINTER_PRIVATE_KEY || "";

      if (!contractAddress || !minterKey) {
        return NextResponse.json({
          success: true,
          devMode: true,
          txHash: "0xDEV_MODE",
          message: useMainnet
            ? "DEV MODE: añade NEXT_PUBLIC_NFT_CONTRACT_MAINNET y MINTER_PRIVATE_KEY en Vercel"
            : "DEV MODE: añade NEXT_PUBLIC_NFT_CONTRACT_FUJI y MINTER_PRIVATE_KEY en .env.local",
        });
      }

      try {
        const receipt = await claimNFTTo(walletAddress, BigInt(parsedTokenId), contractAddress);
        console.log(`[NFT Zodiac] tokenId=${parsedTokenId} → ${walletAddress} | TX: ${receipt.transactionHash} | email=${email ?? "n/a"}`);

        return NextResponse.json({
          success: true,
          txHash: receipt.transactionHash,
          explorerUrl: `https://testnet.snowtrace.io/tx/${receipt.transactionHash}`,
        });
      } catch (mintError) {
        const errMsg = String(mintError);
        console.error(`[NFT Zodiac Mint] tokenId=${parsedTokenId} wallet=${walletAddress} error:`, errMsg);

        // DropClaimExceedLimit: ya reclamaste este NFT o el contrato tiene límite de 1 por wallet
        if (errMsg.includes("DropClaimExceedLimit") || errMsg.includes("ExceedLimit")) {
          return NextResponse.json(
            {
              error: "Ya reclamaste tu NFT Zodiacal",
              code: "ALREADY_CLAIMED",
              message: "Este NFT ya fue reclamado por esta wallet. Solo se permite 1 por signo zodiacal.",
            },
            { status: 409 }
          );
        }

        // Si el error es de claim conditions no configuradas, devolver devMode
        const isNotConfigured =
          errMsg.includes("ClaimConditions") ||
          errMsg.includes("!Qty") ||
          errMsg.includes("claim condition") ||
          errMsg.includes("No claim condition") ||
          errMsg.includes("TokenDoesNotExist") ||
          errMsg.includes("does not exist");

        if (isNotConfigured) {
          return NextResponse.json({
            success: true,
            devMode: true,
            txHash: "0xDEV_ZODIAC_" + parsedTokenId,
            message: `Token zodiacal #${parsedTokenId} pendiente de configuración en Thirdweb Dashboard. Tu NFT quedará registrado al lanzamiento mainnet.`,
          });
        }

        // No exponer detalles del error en producción
        const isDev = process.env.NODE_ENV === "development";
        return NextResponse.json(
          { error: "Mint failed", ...(isDev && { details: errMsg.slice(0, 200) }) },
          { status: 500 }
        );
      }
    }

    // ── Shopify purchase mint (flujo original) ────────────────────────────────
    const { orderId, walletAddress, tokenId = 0 } = body as {
      orderId?: string;
      walletAddress?: string;
      tokenId?: number;
    };

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

    // Verificar que la wallet coincide con la aprobada en approve-claim
    // Previene que atacantes con orderId ajeno mintéen NFTs a su propia wallet
    if (claim.walletAddress && claim.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      console.warn(`[NFT Mint] Wallet mismatch — orderId=${orderId} claim.wallet=${claim.walletAddress} request.wallet=${walletAddress}`);
      return NextResponse.json({ error: "Wallet address does not match approved claim" }, { status: 403 });
    }

    const useMainnet = !!(process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET);
    const contractAddress = useMainnet
      ? (process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET || "")
      : (process.env.NEXT_PUBLIC_NFT_CONTRACT_FUJI || "");
    const minterKey = process.env.MINTER_PRIVATE_KEY || "";

    // Dev mode — no contract or key configured yet
    if (!contractAddress || !minterKey) {
      const mockClaim = await updateClaim(orderId, {
        walletAddress,
        status: "claimed",
        claimedAt: new Date().toISOString(),
        txHash: "0xDEV_MODE",
        tokenId: "0",
      });
      return NextResponse.json({
        success: true,
        devMode: true,
        message: useMainnet
          ? "Añade NEXT_PUBLIC_NFT_CONTRACT_MAINNET y MINTER_PRIVATE_KEY en Vercel"
          : "DEV MODE: add NEXT_PUBLIC_NFT_CONTRACT_FUJI and MINTER_PRIVATE_KEY to .env.local",
        claim: mockClaim,
      });
    }

    await updateClaim(orderId, { walletAddress, status: "pending" });

    const receipt = await claimNFTTo(walletAddress, BigInt(tokenId), contractAddress);

    const updatedClaim = await updateClaim(orderId, {
      walletAddress,
      status: "claimed",
      claimedAt: new Date().toISOString(),
      txHash: receipt.transactionHash,
      tokenId: String(tokenId),
    });

    console.log(`[NFT] Order ${orderId} → ${walletAddress} | TX: ${receipt.transactionHash}`);

    return NextResponse.json({
      success: true,
      txHash: receipt.transactionHash,
      explorerUrl: `https://testnet.snowtrace.io/tx/${receipt.transactionHash}`,
      ommyReward: claim.ommyReward,
      claim: updatedClaim,
    });
  } catch (error) {
    console.error("[NFT Mint]", error);
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      { error: "Mint failed", ...(isDev && { details: String(error) }) },
      { status: 500 }
    );
  }
}
