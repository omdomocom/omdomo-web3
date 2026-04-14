import { getContract } from "thirdweb";
import { avalancheFuji, avalanche } from "thirdweb/chains";
import { client } from "./thirdweb";
import {
  calculateOmmyReward as calcReward,
  calculateBurnAmount,
  BURN,
  REWARDS,
} from "./tokenomics";

// ─── NFT Contract (Edition Drop / ERC-1155) ─────────────────────────────────
// Om Domo NFTs — Avalanche Fuji Testnet (chainId 43113)
// Verified: Name=Om Domo NFTs, Symbol=OMDNFT, Type=Edition Drop ERC-1155
export const NFT_CONTRACT_ADDRESS_FUJI =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_FUJI ||
  "0xd51de87FbC012b694922036C30E5C82e16594958";

export const NFT_CONTRACT_ADDRESS_MAINNET =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET || "";

// Usa mainnet si el contrato mainnet está configurado, sin depender de USE_MAINNET flag
export const isMainnet = !!NFT_CONTRACT_ADDRESS_MAINNET;

export function getNFTContract() {
  const address = isMainnet
    ? NFT_CONTRACT_ADDRESS_MAINNET
    : NFT_CONTRACT_ADDRESS_FUJI;

  if (!address) return null;

  return getContract({
    client,
    chain: isMainnet ? avalanche : avalancheFuji,
    address,
  });
}

// ─── OMMY Rewards & Burn ──────────────────────────────────────────────────────
// Rate: 70 OMMY por USD → hoodie €70 ≈ $76 ≈ 5,320 OMMY (~$5.32 al lanzamiento)
// Regla: cuanto más pronto compres, más valen tus OMMY a futuro.
export { REWARDS, BURN };

export function calculateOmmyReward(orderTotalUSD: number): number {
  return calcReward(orderTotalUSD);
}

export function calculateOmmyBurn(orderTotalUSD: number): number {
  return calculateBurnAmount(orderTotalUSD);
}

// ─── NFT Metadata ─────────────────────────────────────────────────────────────
export interface ProductNFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
}

// Rarity tiers — basado en fecha de compra (early adopters = rarer)
export type NFTRarity = "Genesis" | "Founder" | "Community" | "Standard";

export function getNFTRarity(purchaseDate: string): NFTRarity {
  const date = new Date(purchaseDate);
  const launch = new Date("2026-06-01");
  const msDiff = date.getTime() - launch.getTime();
  const daysDiff = msDiff / (1000 * 60 * 60 * 24);

  if (daysDiff <= 0)   return "Genesis";    // Antes del lanzamiento oficial
  if (daysDiff <= 30)  return "Founder";    // Primer mes
  if (daysDiff <= 90)  return "Community";  // Primeros 3 meses
  return "Standard";
}

export function buildNFTMetadata(
  productTitle: string,
  productImageUrl: string,
  orderId: string,
  orderDate: string
): ProductNFTMetadata {
  const rarity = getNFTRarity(orderDate);

  return {
    name: `${productTitle} — Om Domo ${rarity}`,
    description: `NFT de propiedad auténtica de "${productTitle}" de la colección Om Domo. Rarity: ${rarity}. Otorga acceso a la comunidad Om Domo, beneficios de holder, y votaciones DAO en futuras colecciones.`,
    image: productImageUrl,
    attributes: [
      { trait_type: "Product",         value: productTitle },
      { trait_type: "Collection",      value: "Om Domo Genesis" },
      { trait_type: "Rarity",          value: rarity },
      { trait_type: "Order ID",        value: orderId },
      { trait_type: "Purchase Date",   value: orderDate },
      { trait_type: "Network",         value: "Avalanche" },
      { trait_type: "Community Access",value: "Yes" },
      { trait_type: "DAO Voting",      value: "Yes" },
    ],
  };
}
