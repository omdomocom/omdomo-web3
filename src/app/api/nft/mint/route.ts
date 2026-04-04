// NFT Mint API — called when customer claims their NFT
// Uses Edition Drop claimTo — correct method for ERC-1155 Edition Drop contracts
// Minter wallet only needs AVAX for gas, no special role required for claimTo

import { NextRequest, NextResponse } from "next/server";
import { getClaimByOrderId, updateClaim } from "@/lib/claims";
import { buildNFTMetadata } from "@/lib/nft";

async function claimNFTTo(toAddress: string, tokenId: bigint, contractAddress: string) {
  const { createThirdwebClient, getContract } = await import("thirdweb");
  const { avalancheFuji } = await import("thirdweb/chains");
  const { claimTo } = await import("thirdweb/extensions/erc1155");
  const { sendTransaction } = await import("thirdweb");
  const { privateKeyToAccount } = await import("thirdweb/wallets");

  const serverClient = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  // Minter wallet — needs AVAX on Fuji for gas fees
  // Address: 0x648FD67c26E607324B860d95b2ee8834EE30b146
  const minterAccount = privateKeyToAccount({
    client: serverClient,
    privateKey: process.env.MINTER_PRIVATE_KEY || "",
  });

  const contract = getContract({
    client: serverClient,
    chain: avalancheFuji,
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
    const { orderId, walletAddress, tokenId = 0 } = await req.json();

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

    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_FUJI || "";
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
        message: "DEV MODE: add NEXT_PUBLIC_NFT_CONTRACT_FUJI and MINTER_PRIVATE_KEY to .env.local",
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
