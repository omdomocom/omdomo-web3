import { createThirdwebClient, getContract } from "thirdweb";
import { avalanche, avalancheFuji } from "thirdweb/chains";

// ─── Clients ───────────────────────────────────────────────────────────────

// Client-side (public clientId — safe to expose)
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "placeholder",
});

// Server-side only (secret key — NEVER import in "use client" files)
export function getServerClient() {
  return createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });
}

// ─── Networks ──────────────────────────────────────────────────────────────

// Avalanche Mainnet (chainId 43114) — Ommy Coin live
export { avalanche };

// Avalanche Fuji Testnet (chainId 43113) — testing NFTs & new contracts
export { avalancheFuji };

// Active network — swap to avalancheFuji for local testing
export const activeChain = avalanche;

// ─── Ommy Coin ERC20 ───────────────────────────────────────────────────────

// Ommy Coin on Avalanche Mainnet
// Symbol: OMMY | Decimals: 18 | Initial supply: 29,979,245,800 OMMY
// Burn target: 90% → final supply 2,997,924,580 OMMY
export const OMMY_COIN_ADDRESS =
  process.env.NEXT_PUBLIC_OMMY_COIN_ADDRESS ||
  "0x70EdA9Bb95eeE2551261c37720933905f9425596";

// Convenience: Ommy Coin contract instance
export function getOmmyContract() {
  return getContract({
    client,
    chain: avalanche,
    address: OMMY_COIN_ADDRESS,
  });
}

// ─── Owner ─────────────────────────────────────────────────────────────────

export const OWNER_WALLET =
  process.env.NEXT_PUBLIC_OWNER_WALLET ||
  "0x15Eb18b12979AD8a85041423df4C92de6EF186f9";

// ─── Tokenomics ────────────────────────────────────────────────────────────

export const OMMY_TOKENOMICS = {
  symbol: "OMMY",
  decimals: 18,
  initialSupply: 29_979_245_800,
  finalSupply: 2_997_924_580,
  burnTarget: 26_981_321_220,
  burnPercent: 90,
  // Burn triggers: purchases, conscious activity, staking, governance
  burnMechanics: ["purchases", "activity", "staking", "governance"],
};
