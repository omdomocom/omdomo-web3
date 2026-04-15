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
import { getNFTContract } from "@/lib/nft";
import type { NFT } from "thirdweb";
import { loadProfile } from "./ProfilePanel";

// ─── Tipos ──────────────────────────────────────────────────────────────────
type Rarity = "Genesis" | "Founder" | "Community" | "Standard";
type NFTCategory = "drop" | "zodiac";

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
];

const ZODIAC_NFTS = NFT_CATALOG.filter((n) => n.category === "zodiac");
const DROP_NFTS   = NFT_CATALOG.filter((n) => n.category === "drop");

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
            href={nft.claimUrl || "#"}
            onClick={(e) => e.stopPropagation()}
            className={`mt-1.5 w-full py-1 rounded-lg text-[9px] font-bold hidden group-hover:flex items-center justify-center gap-0.5 transition-colors cursor-pointer
              ${isMyZodiac
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                : "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
              }`}
          >
            {isMyZodiac ? <><Sparkles size={8} /> Reclamar</> : <><ShoppingCart size={8} /> Obtener</>}
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

// ─── Helper: IPFS → HTTP gateway ─────────────────────────────────────────────
function ipfsToHttp(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url;
}

// ─── On-chain NFT Card (Tab 1) ───────────────────────────────────────────────
function OnChainNFTCard({ nft }: { nft: NFT }) {
  const name = nft.metadata?.name ?? `NFT #${nft.id.toString()}`;
  const image = ipfsToHttp(nft.metadata?.image);

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
      <div className="p-2.5">
        <p className="text-xs font-bold text-purple-200 truncate">{name}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">ID #{nft.id.toString()} · Om Domo</p>
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
                    <OnChainNFTCard key={nft.id.toString()} nft={nft} />
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
