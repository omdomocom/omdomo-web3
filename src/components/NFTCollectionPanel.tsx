"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReadContract } from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  Wallet,
  Sparkles,
  Layers,
  ChevronDown,
  ExternalLink,
  Lock,
  Check,
  ShoppingCart,
} from "lucide-react";
import { getNFTContract, NFT_CONTRACT_ADDRESS_FUJI, NFT_CONTRACT_ADDRESS_MAINNET, isMainnet } from "@/lib/nft";
import type { NFT } from "thirdweb";
import { loadProfile } from "./ProfilePanel";

// ─── Tipos ──────────────────────────────────────────────────────────────────
type Rarity = "Genesis" | "Founder" | "Community" | "Standard" | "Rare" | "Legendary" | "Special";
type NFTCategory = "drop" | "zodiac" | "dias" | "chakra" | "sol-y-luna";

interface CatalogNFT {
  id: string;
  name: string;
  rarity: Rarity;
  tokenId: string;
  category: NFTCategory;
  emoji: string;
  image: string;        // ruta local /nft-assets/{tokenId}.png
  ommyPrice: number | null;
  lockDate?: string;
  claimUrl?: string;
  shopUrl?: string;
  ommyReward: number;
  element?: string;
}

// ─── Estilos por rareza ─────────────────────────────────────────────────────
const RARITY_STYLES: Record<Rarity, {
  border: string; bg: string; badge: string; glow: string;
  gradientText: string; fullBg: string;
}> = {
  Genesis: {
    border: "border-yellow-400/60",
    bg: "from-yellow-900/30 to-orange-900/30",
    badge: "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30",
    glow: "shadow-yellow-500/30",
    gradientText: "from-yellow-300 to-orange-300",
    fullBg: "from-yellow-900/60 to-orange-900/60",
  },
  Founder: {
    border: "border-purple-400/60",
    bg: "from-purple-900/30 to-pink-900/30",
    badge: "bg-purple-400/20 text-purple-300 border border-purple-400/30",
    glow: "shadow-purple-500/30",
    gradientText: "from-purple-300 to-pink-300",
    fullBg: "from-purple-900/60 to-pink-900/60",
  },
  Community: {
    border: "border-cyan-400/60",
    bg: "from-cyan-900/30 to-blue-900/30",
    badge: "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30",
    glow: "shadow-cyan-500/30",
    gradientText: "from-cyan-300 to-blue-300",
    fullBg: "from-cyan-900/60 to-blue-900/60",
  },
  Standard: {
    border: "border-slate-600/50",
    bg: "from-slate-900/20 to-slate-800/20",
    badge: "bg-slate-700/40 text-slate-400 border border-slate-600/30",
    glow: "shadow-slate-700/20",
    gradientText: "from-slate-300 to-slate-400",
    fullBg: "from-slate-800/60 to-slate-700/60",
  },
  Rare: {
    border: "border-orange-400/60",
    bg: "from-orange-900/30 to-amber-900/30",
    badge: "bg-orange-400/20 text-orange-300 border border-orange-400/30",
    glow: "shadow-orange-500/30",
    gradientText: "from-orange-300 to-amber-300",
    fullBg: "from-orange-900/60 to-amber-900/60",
  },
  Legendary: {
    border: "border-yellow-300/70",
    bg: "from-yellow-900/40 to-cyan-900/30",
    badge: "bg-yellow-300/20 text-yellow-200 border border-yellow-300/40",
    glow: "shadow-yellow-400/40",
    gradientText: "from-yellow-200 to-cyan-300",
    fullBg: "from-yellow-900/70 to-cyan-900/50",
  },
  Special: {
    border: "border-violet-300/70",
    bg: "from-violet-900/40 to-white/5",
    badge: "bg-violet-300/20 text-violet-100 border border-violet-300/40",
    glow: "shadow-violet-400/50",
    gradientText: "from-violet-200 to-white",
    fullBg: "from-violet-900/70 to-slate-700/50",
  },
};

// ─── Colores por Rayo (Días de la Semana) ───────────────────────────────────
const RAYO_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  "Rayo Amarillo-Dorado": { from: "from-yellow-900/60", to: "to-amber-900/60",   glow: "shadow-yellow-500/40" },
  "Rayo Rosa":            { from: "from-pink-900/60",   to: "to-rose-900/60",    glow: "shadow-pink-500/40"   },
  "Rayo Blanco":          { from: "from-slate-700/50",  to: "to-slate-600/50",   glow: "shadow-slate-300/20"  },
  "Rayo Verde":           { from: "from-green-900/60",  to: "to-emerald-900/60", glow: "shadow-green-500/40"  },
  "Rayo Oro-Rubí-Naranja":{ from: "from-orange-900/60", to: "to-red-900/60",     glow: "shadow-orange-500/40" },
  "Rayo Violeta":         { from: "from-violet-900/60", to: "to-purple-900/60",  glow: "shadow-violet-500/40" },
  "Rayo Azul":            { from: "from-blue-900/70",   to: "to-cyan-900/60",    glow: "shadow-blue-500/50"   },
};

// ─── Colores por Chakra ──────────────────────────────────────────────────────
const CHAKRA_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  "Rojo":            { from: "from-red-900/60",    to: "to-rose-900/60",    glow: "shadow-red-500/40"    },
  "Naranja":         { from: "from-orange-900/60", to: "to-amber-900/60",   glow: "shadow-orange-500/40" },
  "Amarillo":        { from: "from-yellow-900/60", to: "to-amber-900/60",   glow: "shadow-yellow-500/40" },
  "Verde":           { from: "from-green-900/60",  to: "to-emerald-900/60", glow: "shadow-green-500/40"  },
  "Azul":            { from: "from-blue-900/60",   to: "to-cyan-900/60",    glow: "shadow-blue-500/40"   },
  "Índigo":          { from: "from-indigo-900/60", to: "to-violet-900/60",  glow: "shadow-indigo-500/40" },
  "Violeta / Blanco":{ from: "from-purple-900/70", to: "to-violet-900/60",  glow: "shadow-purple-500/50" },
};

// ─── Colores Sol y Luna ──────────────────────────────────────────────────────
const SOL_LUNA_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  "Sol":     { from: "from-amber-900/60",  to: "to-orange-900/60", glow: "shadow-amber-500/40"  },
  "Luna":    { from: "from-slate-800/60",  to: "to-blue-900/60",   glow: "shadow-blue-400/30"   },
  "Eclipse": { from: "from-violet-900/60", to: "to-red-900/60",    glow: "shadow-violet-500/40" },
};

// ─── Colores por elemento zodiacal ──────────────────────────────────────────
const ELEMENT_COLORS: Record<string, { glow: string; from: string; to: string }> = {
  Fuego:  { glow: "shadow-orange-500/40", from: "from-orange-900/60", to: "to-red-900/60" },
  Tierra: { glow: "shadow-green-500/40",  from: "from-green-900/60",  to: "to-amber-900/60" },
  Aire:   { glow: "shadow-cyan-500/40",   from: "from-cyan-900/60",   to: "to-blue-900/60" },
  Agua:   { glow: "shadow-purple-500/40", from: "from-blue-900/60",   to: "to-purple-900/60" },
};

// ─── Catálogo completo de NFTs ───────────────────────────────────────────────
const NFT_CATALOG: CatalogNFT[] = [
  // ── Drops ──
  { id: "genesis-hoodie",      name: "Genesis Hoodie", rarity: "Genesis",   tokenId: "0",  category: "drop",   emoji: "✦",  image: "/nft-assets/0.gif",  ommyPrice: null, claimUrl: "/claim",  shopUrl: "https://www.omdomo.com", ommyReward: 5320 },
  { id: "drop2-solsticio",     name: "Drop #2 Solsticio", rarity: "Founder", tokenId: "13", category: "drop",   emoji: "🌕", image: "/nft-assets/0.gif",  ommyPrice: null, lockDate: "Sep 2026", claimUrl: "/drops", ommyReward: 3000 },
  { id: "drop3-ommylab",       name: "Ommy Lab Vol.1",    rarity: "Community",tokenId: "14", category: "drop",   emoji: "⚗️", image: "/nft-assets/0.gif",  ommyPrice: null, lockDate: "Dic 2026", claimUrl: "/drops", ommyReward: 2000 },
  // ── Zodiacales ──
  { id: "zodiac-aries",       name: "Aries",       rarity: "Genesis", tokenId: "1",  category: "zodiac", emoji: "♈", image: "/nft-assets/1.gif",  element: "Fuego",  ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Aries",       ommyReward: 1000 },
  { id: "zodiac-tauro",       name: "Tauro",       rarity: "Genesis", tokenId: "2",  category: "zodiac", emoji: "♉", image: "/nft-assets/2.gif",  element: "Tierra", ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Tauro",       ommyReward: 1000 },
  { id: "zodiac-geminis",     name: "Géminis",     rarity: "Genesis", tokenId: "3",  category: "zodiac", emoji: "♊", image: "/nft-assets/3.gif",  element: "Aire",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Géminis",     ommyReward: 1000 },
  { id: "zodiac-cancer",      name: "Cáncer",      rarity: "Genesis", tokenId: "4",  category: "zodiac", emoji: "♋", image: "/nft-assets/4.gif",  element: "Agua",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Cáncer",      ommyReward: 1000 },
  { id: "zodiac-leo",         name: "Leo",         rarity: "Genesis", tokenId: "5",  category: "zodiac", emoji: "♌", image: "/nft-assets/5.gif",  element: "Fuego",  ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Leo",         ommyReward: 1000 },
  { id: "zodiac-virgo",       name: "Virgo",       rarity: "Genesis", tokenId: "6",  category: "zodiac", emoji: "♍", image: "/nft-assets/6.gif",  element: "Tierra", ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Virgo",       ommyReward: 1000 },
  { id: "zodiac-libra",       name: "Libra",       rarity: "Genesis", tokenId: "7",  category: "zodiac", emoji: "♎", image: "/nft-assets/7.gif",  element: "Aire",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Libra",       ommyReward: 1000 },
  { id: "zodiac-escorpio",    name: "Escorpio",    rarity: "Genesis", tokenId: "8",  category: "zodiac", emoji: "♏", image: "/nft-assets/8.gif",  element: "Agua",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Escorpio",    ommyReward: 1000 },
  { id: "zodiac-sagitario",   name: "Sagitario",   rarity: "Genesis", tokenId: "9",  category: "zodiac", emoji: "♐", image: "/nft-assets/9.gif",  element: "Fuego",  ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Sagitario",   ommyReward: 1000 },
  { id: "zodiac-capricornio", name: "Capricornio", rarity: "Genesis", tokenId: "10", category: "zodiac", emoji: "♑", image: "/nft-assets/10.gif", element: "Tierra", ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Capricornio", ommyReward: 1000 },
  { id: "zodiac-acuario",     name: "Acuario",     rarity: "Genesis", tokenId: "11", category: "zodiac", emoji: "♒", image: "/nft-assets/11.gif", element: "Aire",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Acuario",     ommyReward: 1000 },
  { id: "zodiac-piscis",      name: "Piscis",      rarity: "Genesis", tokenId: "12", category: "zodiac", emoji: "♓", image: "/nft-assets/12.gif", element: "Agua",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Piscis",      ommyReward: 1000 },
  // ── Días de la Semana ──
  { id: "dias-lunes",     name: "Lunes · Jofiel",    rarity: "Standard",  tokenId: "13", category: "dias", emoji: "☀️", image: "ipfs://QmYoa6YrehBKzJPep4T1D5i9mbCYfPp3RvtNA3cqtkAEeh",  ommyPrice: null, ommyReward: 500,  element: "Rayo Amarillo-Dorado",   lockDate: "Oct 2026" },
  { id: "dias-martes",    name: "Martes · Chamuel",  rarity: "Standard",  tokenId: "14", category: "dias", emoji: "🌸", image: "ipfs://QmfUx8ccabiQabWhSzKAA1CjWgkCtWVWy8tv6UTuEoanPb",  ommyPrice: null, ommyReward: 500,  element: "Rayo Rosa",              lockDate: "Oct 2026" },
  { id: "dias-miercoles", name: "Miércoles · Gabriel",rarity: "Standard", tokenId: "15", category: "dias", emoji: "🤍", image: "ipfs://QmdyTNrmNu3xe9CWZT3wKjk17dDecbax2Pefa97bDrGCLY",  ommyPrice: null, ommyReward: 500,  element: "Rayo Blanco",            lockDate: "Oct 2026" },
  { id: "dias-jueves",    name: "Jueves · Rafael",   rarity: "Rare",      tokenId: "16", category: "dias", emoji: "🍃", image: "ipfs://Qmbozb86Mkspg7xdfaTQit8mNHPxo129wYd8VV71WyNAKK",  ommyPrice: null, ommyReward: 1500, element: "Rayo Verde",             lockDate: "Oct 2026" },
  { id: "dias-viernes",   name: "Viernes · Uriel",   rarity: "Rare",      tokenId: "17", category: "dias", emoji: "💛", image: "ipfs://QmSxoBghRUuiamv6TggsujpsRAcZeFwiAurE91Uwk5F3ve",  ommyPrice: null, ommyReward: 1500, element: "Rayo Oro-Rubí-Naranja",  lockDate: "Oct 2026" },
  { id: "dias-sabado",    name: "Sábado · Zadkiel",  rarity: "Rare",      tokenId: "18", category: "dias", emoji: "🔮", image: "ipfs://QmZDzRu2PApFpcEfoCGgN6BzNnEMbgZ5iaaQvVVDoeYvt2",  ommyPrice: null, ommyReward: 1500, element: "Rayo Violeta",           lockDate: "Oct 2026" },
  { id: "dias-domingo",   name: "Domingo · Miguel",  rarity: "Legendary", tokenId: "19", category: "dias", emoji: "⚡", image: "ipfs://QmYEUkVHbjK1owZmGYenWF89o69xGxjvfKpTuqwmegZ4BF",  ommyPrice: null, ommyReward: 5000, element: "Rayo Azul",              lockDate: "Oct 2026" },
  // ── Sol y Luna ──
  { id: "sol-dawn",       name: "Dawn · Amanecer",                  rarity: "Standard", tokenId: "27", category: "sol-y-luna", emoji: "🌅", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004004_c424b1d6-8579-44c1-aa2a-98b7fffd61e9.png", ommyPrice: null, ommyReward: 500,  element: "Sol",     lockDate: "Jun 2026" },
  { id: "sol-zenith",     name: "Solar Zenith · Sol Cenital",       rarity: "Standard", tokenId: "28", category: "sol-y-luna", emoji: "☀️", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004008_5b3cbef4-9f82-47d6-b70f-828097ba4188.png", ommyPrice: null, ommyReward: 500,  element: "Sol",     lockDate: "Jun 2026" },
  { id: "sol-sunset",     name: "Sunset · Atardecer",               rarity: "Standard", tokenId: "29", category: "sol-y-luna", emoji: "🌇", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_010308_bd837f1f-e24a-4e31-b251-17c0123e62ad.png", ommyPrice: null, ommyReward: 500,  element: "Sol",     lockDate: "Jun 2026" },
  { id: "sol-negro",      name: "Black Sun · Sol Negro",            rarity: "Rare",     tokenId: "30", category: "sol-y-luna", emoji: "🌑", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004014_7a86dddb-42b0-4f02-a336-79f2831786fb.png", ommyPrice: null, ommyReward: 1500, element: "Sol",     lockDate: "Jun 2026" },
  { id: "sol-solsticio",  name: "Solstice · Solsticio",             rarity: "Rare",     tokenId: "31", category: "sol-y-luna", emoji: "🗿", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004021_ee4a7566-b769-49d9-abf0-952276609e0e.png", ommyPrice: null, ommyReward: 1500, element: "Sol",     lockDate: "Jun 2026" },
  { id: "luna-nueva",     name: "New Moon · Luna Nueva",            rarity: "Standard", tokenId: "32", category: "sol-y-luna", emoji: "🌑", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004025_6dd9b02a-0f60-4216-8241-d8a9f2e6fe2b.png", ommyPrice: null, ommyReward: 500,  element: "Luna",    lockDate: "Jun 2026" },
  { id: "luna-creciente", name: "Waxing Crescent · Luna Creciente", rarity: "Standard", tokenId: "33", category: "sol-y-luna", emoji: "🌒", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004028_8ef7f9f7-b308-4980-be94-d5a33221d24d.png", ommyPrice: null, ommyReward: 500,  element: "Luna",    lockDate: "Jun 2026" },
  { id: "luna-cuarto1",   name: "First Quarter · Cuarto Creciente", rarity: "Standard", tokenId: "34", category: "sol-y-luna", emoji: "🌓", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004031_03901464-746e-4626-bb51-fb1b42ccea1b.png", ommyPrice: null, ommyReward: 500,  element: "Luna",    lockDate: "Jun 2026" },
  { id: "luna-gibosa1",   name: "Waxing Gibbous · Gibosa Creciente",rarity: "Standard", tokenId: "35", category: "sol-y-luna", emoji: "🌔", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004040_b1be9101-63c1-46d4-aaaa-4d00f10fa16d.png", ommyPrice: null, ommyReward: 500,  element: "Luna",    lockDate: "Jun 2026" },
  { id: "luna-llena",     name: "Full Moon · Luna Llena",           rarity: "Rare",     tokenId: "36", category: "sol-y-luna", emoji: "🌕", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004043_fc8fd298-1da3-4845-a00f-c6eb3e3a5249.png", ommyPrice: null, ommyReward: 1500, element: "Luna",    lockDate: "Jun 2026" },
  { id: "luna-gibosa2",   name: "Waning Gibbous · Gibosa Menguante",rarity: "Standard", tokenId: "37", category: "sol-y-luna", emoji: "🌖", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004046_3801bc97-d647-4949-afac-bf87f81af754.png", ommyPrice: null, ommyReward: 500,  element: "Luna",    lockDate: "Jun 2026" },
  { id: "luna-cuarto2",   name: "Last Quarter · Cuarto Menguante",  rarity: "Standard", tokenId: "38", category: "sol-y-luna", emoji: "🌗", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004523_a1944e28-6979-4dbf-a06b-ab2f1c65d296.png", ommyPrice: null, ommyReward: 500,  element: "Luna",    lockDate: "Jun 2026" },
  { id: "luna-menguante", name: "Waning Crescent · Luna Menguante", rarity: "Standard", tokenId: "39", category: "sol-y-luna", emoji: "🌘", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004056_c589a284-1a1e-4e83-980e-86463cd0ac1f.png", ommyPrice: null, ommyReward: 500,  element: "Luna",    lockDate: "Jun 2026" },
  { id: "eclipse-total",  name: "Total Solar Eclipse · Eclipse Total",rarity: "Special", tokenId: "40", category: "sol-y-luna", emoji: "🌑", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004059_5c560483-8920-4439-b1b0-dfabcfdef0f5.png", ommyPrice: null, ommyReward: 5000, element: "Eclipse", lockDate: "Jun 2026" },
  { id: "eclipse-anular", name: "Annular Eclipse · Eclipse Anular", rarity: "Special",  tokenId: "41", category: "sol-y-luna", emoji: "💫", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004103_ab78d644-4b06-4ea3-8e64-9b08d7cb993c.png", ommyPrice: null, ommyReward: 5000, element: "Eclipse", lockDate: "Jun 2026" },
  { id: "eclipse-sangre", name: "Blood Moon · Luna de Sangre",      rarity: "Special",  tokenId: "42", category: "sol-y-luna", emoji: "🔴", image: "https://d8j0ntlcm91z4.cloudfront.net/user_3DOfG8D2Coz7F3FRUeXDMJCeYOi/hf_20260516_004106_450318e9-66b8-4825-8655-c039c5984b3b.png", ommyPrice: null, ommyReward: 5000, element: "Eclipse", lockDate: "Jun 2026" },
  // ── Chakras ──
  { id: "chakra-muladhara",    name: "Muladhara",    rarity: "Standard",  tokenId: "20", category: "chakra", emoji: "🔴", image: "ipfs://QmQhurqhQ6YrGxtinGvDnvYYRHwedfy5oNnJmxf3P2qrZf", ommyPrice: null, ommyReward: 500,  element: "Rojo",             lockDate: "Sep 2026" },
  { id: "chakra-svadhisthana", name: "Svadhisthana", rarity: "Standard",  tokenId: "21", category: "chakra", emoji: "🟠", image: "ipfs://QmSxWUBmAqUrTh2VpMUg47yHXoUVyaLqFoeebJgJUgoqWi", ommyPrice: null, ommyReward: 500,  element: "Naranja",          lockDate: "Sep 2026" },
  { id: "chakra-manipura",     name: "Manipura",     rarity: "Standard",  tokenId: "22", category: "chakra", emoji: "🟡", image: "ipfs://QmP6KDkHU1FqPWmsX6wn3FKc1yujEuLiJKkHd72uGzHrv6", ommyPrice: null, ommyReward: 500,  element: "Amarillo",         lockDate: "Sep 2026" },
  { id: "chakra-anahata",      name: "Anahata",      rarity: "Rare",      tokenId: "23", category: "chakra", emoji: "💚", image: "ipfs://QmThfSyF1NocDT8vSLdXgybDzshxQH7mu3osxWfzkeqPJe", ommyPrice: null, ommyReward: 1500, element: "Verde",            lockDate: "Sep 2026" },
  { id: "chakra-vishuddha",    name: "Vishuddha",    rarity: "Standard",  tokenId: "24", category: "chakra", emoji: "💙", image: "ipfs://QmcsuCZPsp1tHSnpkA73b4CndBc4tXDMUnzWYe3KL4v7md", ommyPrice: null, ommyReward: 500,  element: "Azul",             lockDate: "Sep 2026" },
  { id: "chakra-ajna",         name: "Ajna",         rarity: "Rare",      tokenId: "25", category: "chakra", emoji: "👁", image: "ipfs://QmSgzzW5VqpV7DxkAg9crxw3LC5TTxrB8MLBizPV6a37Hg",  ommyPrice: null, ommyReward: 1500, element: "Índigo",           lockDate: "Sep 2026" },
  { id: "chakra-sahasrara",    name: "Sahasrara",    rarity: "Special",   tokenId: "26", category: "chakra", emoji: "👑", image: "ipfs://QmV4EWPQJTyS7D2TDkN9xZMYenbC3jYbK27vBt2bTvk5Ng",  ommyPrice: null, ommyReward: 5000, element: "Violeta / Blanco", lockDate: "Sep 2026" },
];

const ZODIAC_NFTS    = NFT_CATALOG.filter((n) => n.category === "zodiac");
const DROP_NFTS      = NFT_CATALOG.filter((n) => n.category === "drop");
const DIAS_NFTS      = NFT_CATALOG.filter((n) => n.category === "dias");
const CHAKRA_NFTS    = NFT_CATALOG.filter((n) => n.category === "chakra");
const SOL_LUNA_NFTS  = NFT_CATALOG.filter((n) => n.category === "sol-y-luna");

// ─── Helper: calcular signo desde birthday ───────────────────────────────────
function getZodiacIdFromBirthday(birthday: string): string | null {
  if (!birthday) return null;
  const d = new Date(birthday + "T12:00:00");
  if (isNaN(d.getTime())) return null;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const RANGES = [
    { id: "zodiac-capricornio", sm: 12, sd: 22, em: 1,  ed: 19 },
    { id: "zodiac-acuario",     sm: 1,  sd: 20, em: 2,  ed: 18 },
    { id: "zodiac-piscis",      sm: 2,  sd: 19, em: 3,  ed: 20 },
    { id: "zodiac-aries",       sm: 3,  sd: 21, em: 4,  ed: 19 },
    { id: "zodiac-tauro",       sm: 4,  sd: 20, em: 5,  ed: 20 },
    { id: "zodiac-geminis",     sm: 5,  sd: 21, em: 6,  ed: 20 },
    { id: "zodiac-cancer",      sm: 6,  sd: 21, em: 7,  ed: 22 },
    { id: "zodiac-leo",         sm: 7,  sd: 23, em: 8,  ed: 22 },
    { id: "zodiac-virgo",       sm: 8,  sd: 23, em: 9,  ed: 22 },
    { id: "zodiac-libra",       sm: 9,  sd: 23, em: 10, ed: 22 },
    { id: "zodiac-escorpio",    sm: 10, sd: 23, em: 11, ed: 21 },
    { id: "zodiac-sagitario",   sm: 11, sd: 22, em: 12, ed: 21 },
  ];
  for (const z of RANGES) {
    if (z.sm === 12) {
      if ((m === 12 && day >= z.sd) || (m === 1 && day <= z.ed)) return z.id;
    } else {
      if ((m === z.sm && day >= z.sd) || (m === z.em && day <= z.ed)) return z.id;
    }
  }
  return null;
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-700/30 bg-slate-800/30 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-700/40" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-3 w-3/4 rounded bg-slate-700/40" />
        <div className="h-2.5 w-1/2 rounded bg-slate-700/30" />
      </div>
    </div>
  );
}

// ─── Zodiac Card para el grid Om Domo ────────────────────────────────────────
function ZodiacCard({
  nft,
  isOwned,
  isMyZodiac,
}: {
  nft: CatalogNFT;
  isOwned: boolean;
  isMyZodiac: boolean;
}) {
  const elemColor = nft.element ? ELEMENT_COLORS[nft.element] : null;
  const cardBg = elemColor ? `${elemColor.from} ${elemColor.to}` : "from-purple-900/60 to-blue-900/60";
  const cardGlow = elemColor ? elemColor.glow : "shadow-purple-500/30";

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.03 }}
      transition={{ duration: 0.18 }}
      className={`group relative rounded-xl border overflow-hidden shadow-md ${cardGlow} transition-all duration-300
        ${isOwned
          ? `border-yellow-400/40 bg-gradient-to-br ${cardBg}`
          : "border-slate-700/30 bg-gradient-to-br from-slate-900/50 to-slate-800/40"}
      `}
    >
      {/* hover overlay para no poseídos */}
      {!isOwned && (
        <div className={`absolute inset-0 bg-gradient-to-br ${cardBg} opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none`} />
      )}

      {/* Imagen */}
      <div className={`aspect-square flex flex-col items-center justify-center gap-0.5 relative overflow-hidden
        ${isOwned ? "" : "grayscale group-hover:grayscale-0"} transition-all duration-300`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${isOwned ? cardBg : "from-slate-800/60 to-slate-900/60"} opacity-70 group-hover:opacity-0 transition-opacity duration-300`} />

        {isOwned && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)", filter: "blur(16px)" }}
          />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nft.image}
          alt={nft.name}
          className={`absolute inset-0 w-full h-full object-cover z-10
            ${isOwned ? "" : "opacity-40 group-hover:opacity-100"} transition-opacity duration-300`}
        />
        {nft.element && (
          <span className={`absolute bottom-1 left-0 right-0 text-center z-20 text-[9px] drop-shadow-lg
            ${isOwned ? "text-white/80" : "text-slate-500 group-hover:text-slate-300"} transition-colors duration-300`}>
            {nft.element}
          </span>
        )}

        {/* badges */}
        <div className="absolute top-1 left-1 right-1 flex items-center justify-between z-20">
          {isOwned ? (
            <span className="px-1 py-0.5 rounded-full text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-0.5">
              <Check size={7} /> Tuyo
            </span>
          ) : isMyZodiac ? (
            <span className="px-1 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
              <Sparkles size={7} /> Gratis
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-2 relative z-10 ${isOwned ? "" : "opacity-50 group-hover:opacity-100"} transition-opacity duration-300`}>
        <p className={`text-[11px] font-bold truncate
          ${isOwned ? "text-yellow-300" : "text-slate-400 group-hover:text-slate-200"} transition-colors duration-300`}>
          {nft.name}
        </p>
        {!isOwned && (
          <p className="text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
            {isMyZodiac ? "Reclamar gratis" : "0.5 AVAX"}
          </p>
        )}
        {/* CTA en hover */}
        {!isOwned && (
          <a
            href={isMyZodiac ? (nft.claimUrl || "#") : (nft.claimUrl ? nft.claimUrl + "&buy=1" : "#")}
            onClick={(e) => e.stopPropagation()}
            className={`mt-1.5 w-full py-1 rounded-lg text-[9px] font-bold hidden group-hover:flex items-center justify-center gap-0.5 transition-colors cursor-pointer
              ${isMyZodiac
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                : "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
              }`}
          >
            {isMyZodiac ? <><Sparkles size={8} /> Reclamar</> : <><ShoppingCart size={8} /> Comprar</>}
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Drop Card para Genesis Drops ────────────────────────────────────────────
function DropCard({ nft, isOwned }: { nft: CatalogNFT; isOwned: boolean }) {
  const style = RARITY_STYLES[nft.rarity];
  const isLocked = !!nft.lockDate;

  return (
    <motion.div
      whileHover={!isLocked ? { y: -3, scale: 1.02 } : {}}
      transition={{ duration: 0.18 }}
      className={`group relative rounded-2xl border overflow-hidden shadow-lg transition-all duration-300
        ${isOwned ? `${style.border} bg-gradient-to-br ${style.fullBg} ${style.glow}` : "border-slate-700/30 bg-slate-900/40"}
        ${isLocked ? "opacity-50" : ""}
      `}
    >
      <div className={`aspect-video flex flex-col items-center justify-center relative overflow-hidden
        ${isLocked ? "" : isOwned ? "" : "group-hover:grayscale-0 grayscale"} transition-all duration-300`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${isOwned ? style.fullBg : "from-slate-800/60 to-slate-900/60"} opacity-80`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nft.image}
          alt={nft.name}
          className={`absolute inset-0 w-full h-full object-cover z-10
            ${isLocked ? "opacity-30" : isOwned ? "" : "opacity-40 group-hover:opacity-100"} transition-opacity duration-300`}
        />
        <span className={`absolute bottom-2 left-0 right-0 text-center z-20 text-[10px] drop-shadow-lg ${isOwned ? "text-white/80" : "text-slate-400"}`}>Om Domo</span>

        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
          {isOwned && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-0.5">
              <Check size={8} /> Tuyo
            </span>
          )}
          {!isOwned && <span />}
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>
            {nft.rarity}
          </span>
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-30 bg-slate-900/70">
            <Lock size={20} className="text-slate-500" />
            <span className="text-[10px] text-slate-500 font-semibold">{nft.lockDate} · Próximamente</span>
          </div>
        )}
      </div>

      <div className={`p-3 relative z-10 ${isLocked ? "" : isOwned ? "" : "opacity-60 group-hover:opacity-100"} transition-opacity duration-300`}>
        <p className={`text-sm font-bold ${isOwned ? `bg-gradient-to-r ${style.gradientText} bg-clip-text text-transparent` : "text-slate-300"}`}>
          {nft.name}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">Token ID #{nft.tokenId}</p>
        {!isLocked && !isOwned && (
          <div className="flex gap-2 mt-2">
            <a href={nft.claimUrl || "#"}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors cursor-pointer flex items-center justify-center gap-1">
              <ExternalLink size={9} /> Reclamar
            </a>
            {nft.shopUrl && (
              <a href={nft.shopUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center bg-slate-700/40 text-slate-300 border border-slate-600/30 hover:bg-slate-700/60 transition-colors cursor-pointer flex items-center justify-center gap-1">
                <ShoppingCart size={9} /> Tienda
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Card genérica para Días y Chakras ──────────────────────────────────────
function CollectionNFTCard({
  nft,
  colorMap,
  isOwned,
}: {
  nft: CatalogNFT;
  colorMap: Record<string, { from: string; to: string; glow: string }>;
  isOwned: boolean;
}) {
  const style = RARITY_STYLES[nft.rarity];
  const color = nft.element ? colorMap[nft.element] : null;
  const imgSrc = nft.image.startsWith("ipfs://")
    ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : nft.image;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.03 }}
      transition={{ duration: 0.18 }}
      className={`group relative rounded-xl border overflow-hidden shadow-md transition-all duration-300
        ${isOwned ? style.border : "border-slate-700/30"}
        ${color ? color.glow : style.glow}
      `}
    >
      {/* Imagen */}
      <div className="aspect-square relative overflow-hidden bg-slate-900/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={nft.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-300
            ${isOwned ? "" : "opacity-50 group-hover:opacity-100 grayscale group-hover:grayscale-0"}`}
        />
        {/* overlay de color en hover */}
        {!isOwned && color && (
          <div className={`absolute inset-0 bg-gradient-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none`} />
        )}
        {/* badges */}
        <div className="absolute top-1 left-1 right-1 flex items-center justify-between z-20">
          <span className={`px-1 py-0.5 rounded-full text-[9px] font-bold ${style.badge}`}>
            {nft.rarity}
          </span>
          {isOwned && (
            <span className="px-1 py-0.5 rounded-full text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-0.5">
              <Check size={7} /> Tuyo
            </span>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className={`p-2 transition-opacity duration-300 ${isOwned ? "" : "opacity-60 group-hover:opacity-100"}`}>
        <p className="text-[11px] font-bold text-slate-200 truncate">{nft.name}</p>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[9px] text-slate-500">#{nft.tokenId}</p>
          {nft.lockDate && (
            <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
              <Lock size={7} /> {nft.lockDate}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Helper: IPFS → HTTP gateway ─────────────────────────────────────────────
function ipfsToHttp(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url;
}

// ─── On-chain NFT Card (Tab 1) ───────────────────────────────────────────────
function OnChainNFTCard({ nft, contractAddress }: { nft: NFT; contractAddress: string }) {
  const [mmAdded, setMmAdded] = useState(false);
  const name = nft.metadata?.name ?? `NFT #${nft.id.toString()}`;
  const image = ipfsToHttp(nft.metadata?.image);

  async function addToMetaMask() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        await navigator.clipboard.writeText(contractAddress);
        alert("MetaMask no detectado. Dirección del contrato copiada.");
        return;
      }
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC1155",
          options: {
            address: contractAddress,
            tokenId: nft.id.toString(),
          },
        },
      });
      setMmAdded(true);
    } catch (err) {
      console.error("MetaMask add error:", err);
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-slate-900/40 overflow-hidden shadow-lg shadow-purple-500/10"
    >
      <div className="aspect-square bg-slate-800/40 flex items-center justify-center overflow-hidden relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Layers size={28} className="text-purple-400/60" />
            <span className="text-[10px] text-slate-500">Sin imagen</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-0.5">
            <Check size={8} /> Tuyo
          </span>
        </div>
      </div>
      <div className="p-2.5 space-y-2">
        <div>
          <p className="text-xs font-bold text-purple-200 truncate">{name}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">ID #{nft.id.toString()} · Om Domo</p>
        </div>
        {/* Botón agregar a MetaMask */}
        <button
          onClick={addToMetaMask}
          disabled={mmAdded}
          className={`w-full py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
            mmAdded
              ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
              : "bg-[#F6851B]/10 border border-[#F6851B]/30 text-[#F6851B] hover:bg-[#F6851B]/20"
          }`}
        >
          {mmAdded ? (
            <><Check size={9} /> En MetaMask</>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 35 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.958 1L19.401 10.797l2.532-5.972L32.958 1zM2.663 1l13.436 9.891-2.408-5.966L2.663 1z" />
              </svg>
              Agregar a MetaMask
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Panel principal ─────────────────────────────────────────────────────────
interface NFTCollectionPanelProps {
  walletAddress?: string;
}

export function NFTCollectionPanel({ walletAddress }: NFTCollectionPanelProps) {
  const [activeTab, setActiveTab] = useState<"wallet" | "omdomo">("wallet");
  const [expandedCollection, setExpandedCollection] = useState<string | null>("zodiac");
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [myZodiacId, setMyZodiacId] = useState<string | null>(null);
  const [profile, setProfile] = useState(loadProfile());

  // Cargar perfil y datos locales
  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    const owned = new Set<string>();

    if (p.zodiacClaimed && p.birthday) {
      const zodiacId = getZodiacIdFromBirthday(p.birthday);
      if (zodiacId) owned.add(zodiacId);
    }

    if (p.birthday) {
      setMyZodiacId(getZodiacIdFromBirthday(p.birthday));
    }

    setOwnedIds(owned);
  }, [walletAddress]);

  // On-chain NFTs
  const nftContract = getNFTContract();
  const shouldFetch = !!nftContract && !!walletAddress;

  const { data: ownedNFTs, isLoading: nftsLoading } = useReadContract(
    getOwnedNFTs,
    shouldFetch
      ? { contract: nftContract!, address: walletAddress! }
      : { contract: nftContract!, address: "" }
  );

  // Colecciones Om Domo
  const COLLECTIONS = [
    {
      id: "zodiac",
      name: "Zodiac Collection",
      description: "12 NFTs zodiacales · Genesis Rarity",
      active: true,
      gradient: "from-purple-600 to-blue-600",
      badgeText: null,
      nftCount: 12,
    },
    {
      id: "genesis-drops",
      name: "Genesis Drops",
      description: "Drop #1 Genesis Hoodie · 100 unidades",
      active: true,
      gradient: "from-yellow-600 to-orange-600",
      badgeText: null,
      nftCount: 1,
    },
    {
      id: "dias",
      name: "Días de la Semana",
      description: "7 NFTs · Arcángeles · Rayos Divinos",
      active: true,
      gradient: "from-blue-600 to-violet-600",
      badgeText: null,
      nftCount: 7,
    },
    {
      id: "chakras",
      name: "Chakras",
      description: "7 NFTs animados · 396–963 Hz",
      active: true,
      gradient: "from-red-600 to-purple-600",
      badgeText: null,
      nftCount: 7,
    },
    {
      id: "sol-y-luna",
      name: "Sol y Luna - Sun and Moon",
      description: "16 NFTs · Fases solares, lunares y eclipses",
      active: true,
      gradient: "from-amber-500 to-blue-700",
      badgeText: null,
      nftCount: 16,
    },
    {
      id: "solsticio",
      name: "Drop #2 Solsticio",
      description: "50 unidades exclusivas",
      active: false,
      gradient: "from-slate-700 to-slate-800",
      badgeText: "Sep 2026 · Próximamente",
      nftCount: 0,
    },
    {
      id: "ommylab",
      name: "Ommy Lab Vol.1",
      description: "200 unidades · Edición especial",
      active: false,
      gradient: "from-slate-700 to-slate-800",
      badgeText: "Dic 2026 · Próximamente",
      nftCount: 0,
    },
  ];

  const TABS = [
    { id: "wallet" as const, label: "NFTs",         icon: Wallet },
    { id: "omdomo" as const, label: "Colecciones",  icon: Layers },
  ];

  return (
    <div className="space-y-4">

      {/* ── Tabs ── */}
      <div className="flex rounded-xl overflow-hidden border border-slate-700/40 p-0.5 gap-0.5 bg-slate-900/40">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
              ${activeTab === id
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1 — NFTs (on-chain)
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === "wallet" && (
          <motion.div
            key="wallet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Sin wallet */}
            {!walletAddress && (
              <div className="glass rounded-2xl p-8 border border-purple-500/20 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
                  <Wallet size={22} className="text-purple-400" />
                </div>
                <p className="text-slate-300 text-sm font-medium">Conecta tu wallet</p>
                <p className="text-slate-500 text-xs">Conecta tu wallet para ver tus NFTs on-chain en la red Avalanche</p>
              </div>
            )}

            {/* Cargando */}
            {walletAddress && nftsLoading && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 px-1">Cargando NFTs on-chain...</p>
                <div className="grid grid-cols-2 gap-3">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            )}

            {/* Con NFTs */}
            {walletAddress && !nftsLoading && ownedNFTs && ownedNFTs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 px-1">
                  {ownedNFTs.length} NFT{ownedNFTs.length !== 1 ? "s" : ""} en tu wallet
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {ownedNFTs.map((nft) => (
                    <OnChainNFTCard
                      key={nft.id.toString()}
                      nft={nft}
                      contractAddress={isMainnet ? NFT_CONTRACT_ADDRESS_MAINNET : NFT_CONTRACT_ADDRESS_FUJI}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sin NFTs */}
            {walletAddress && !nftsLoading && (!ownedNFTs || ownedNFTs.length === 0) && (
              <div className="glass rounded-2xl p-8 border border-slate-700/30 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto">
                  <Wallet size={22} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm font-medium">Sin NFTs on-chain</p>
                  <p className="text-slate-500 text-xs mt-1">Esta wallet no tiene NFTs de Om Domo todavía</p>
                </div>
                <a
                  href="/claim-zodiac"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Sparkles size={12} /> Reclamar NFT Zodiacal
                </a>
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2 — Colecciones
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "omdomo" && (
          <motion.div
            key="omdomo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Slides horizontales */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {COLLECTIONS.map((col) => (
                <motion.button
                  key={col.id}
                  whileHover={col.active ? { scale: 1.03 } : {}}
                  whileTap={col.active ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (!col.active) return;
                    setExpandedCollection(expandedCollection === col.id ? null : col.id);
                  }}
                  className={`flex-shrink-0 w-44 rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer text-left
                    ${expandedCollection === col.id
                      ? "border-purple-500/60 shadow-lg shadow-purple-500/20"
                      : "border-slate-700/40"
                    }
                    ${!col.active ? "opacity-50 cursor-default" : ""}
                  `}
                >
                  <div className={`bg-gradient-to-br ${col.gradient} p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <Layers size={16} className="text-white/80" />
                      {col.active && col.nftCount > 0 && (
                        <span className="text-[10px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                          {col.nftCount} NFTs
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">{col.name}</p>
                    <p className="text-[10px] text-white/60 mt-0.5 leading-tight">{col.description}</p>
                  </div>
                  {col.badgeText && (
                    <div className="px-3 py-2 bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Lock size={9} /> {col.badgeText}
                      </span>
                    </div>
                  )}
                  {col.active && !col.badgeText && (
                    <div className={`px-3 py-2 flex items-center justify-between bg-slate-900/40
                      ${expandedCollection === col.id ? "text-purple-400" : "text-slate-500"}`}
                    >
                      <span className="text-[10px] font-semibold">
                        {expandedCollection === col.id ? "Ocultar" : "Ver colección"}
                      </span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${expandedCollection === col.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Colección expandida — Zodiac */}
            <AnimatePresence>
              {expandedCollection === "zodiac" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-2xl border border-purple-500/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-purple-300">Zodiac Collection — 12 NFTs Genesis</p>
                      <span className="text-[10px] text-slate-500">500 OMMY c/u</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {ZODIAC_NFTS.map((nft) => (
                        <ZodiacCard
                          key={nft.id}
                          nft={nft}
                          isOwned={ownedIds.has(nft.id)}
                          isMyZodiac={nft.id === myZodiacId && !ownedIds.has(nft.id)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Colección expandida — Días de la Semana */}
            <AnimatePresence>
              {expandedCollection === "dias" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-2xl border border-blue-500/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-blue-300">Días de la Semana — 7 Arcángeles</p>
                      <span className="text-[10px] text-slate-500">Oct 2026</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {DIAS_NFTS.map((nft) => (
                        <CollectionNFTCard
                          key={nft.id}
                          nft={nft}
                          colorMap={RAYO_COLORS}
                          isOwned={ownedIds.has(nft.id)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Colección expandida — Sol y Luna */}
            <AnimatePresence>
              {expandedCollection === "sol-y-luna" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-2xl border border-amber-500/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-amber-300">Sol y Luna — 5 Sol · 8 Luna · 3 Eclipses</p>
                      <span className="text-[10px] text-slate-500">Jun 2026</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {SOL_LUNA_NFTS.map((nft) => (
                        <CollectionNFTCard
                          key={nft.id}
                          nft={nft}
                          colorMap={SOL_LUNA_COLORS}
                          isOwned={ownedIds.has(nft.id)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Colección expandida — Chakras */}
            <AnimatePresence>
              {expandedCollection === "chakras" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-2xl border border-purple-500/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-purple-300">Chakras — 7 Fractales Animados</p>
                      <span className="text-[10px] text-slate-500">Sep 2026</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {CHAKRA_NFTS.map((nft) => (
                        <CollectionNFTCard
                          key={nft.id}
                          nft={nft}
                          colorMap={CHAKRA_COLORS}
                          isOwned={ownedIds.has(nft.id)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Colección expandida — Genesis Drops */}
            <AnimatePresence>
              {expandedCollection === "genesis-drops" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-2xl border border-yellow-500/20 p-4 space-y-3">
                    <p className="text-xs font-bold text-yellow-300">Genesis Drops</p>
                    <div className="grid grid-cols-1 gap-3">
                      {DROP_NFTS.map((nft) => (
                        <DropCard
                          key={nft.id}
                          nft={nft}
                          isOwned={ownedIds.has(nft.id)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
