"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles, Coins, Lock, ShoppingCart, Check, Layers, Grid3X3 } from "lucide-react";
import { loadProfile } from "./ProfilePanel";

// ─── Tipos ─────────────────────────────────────────────────────────────────
type Rarity = "Genesis" | "Founder" | "Community" | "Standard";
type NFTStatus = "owned" | "available" | "locked";
type NFTCategory = "drop" | "zodiac";

interface CatalogNFT {
  id: string;
  name: string;
  rarity: Rarity;
  tokenId: string;
  category: NFTCategory;
  emoji: string;
  ommyPrice: number | null;   // null = no se vende con OMMY (compra tienda)
  lockDate?: string;          // solo si status = "locked"
  claimUrl?: string;          // URL para reclamar/comprar
  shopUrl?: string;
  ommyReward: number;
  element?: string;
}

// ─── Estilos por rareza ────────────────────────────────────────────────────
const RARITY_STYLES: Record<Rarity, {
  border: string; bg: string; badge: string; glow: string;
  gradientText: string; fullBg: string;
}> = {
  Genesis:   {
    border: "border-yellow-400/60",
    bg: "from-yellow-900/30 to-orange-900/30",
    badge: "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30",
    glow: "shadow-yellow-500/30",
    gradientText: "from-yellow-300 to-orange-300",
    fullBg: "from-yellow-900/60 to-orange-900/60",
  },
  Founder:   {
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
  Standard:  {
    border: "border-slate-600/50",
    bg: "from-slate-900/20 to-slate-800/20",
    badge: "bg-slate-700/40 text-slate-400 border border-slate-600/30",
    glow: "shadow-slate-700/20",
    gradientText: "from-slate-300 to-slate-400",
    fullBg: "from-slate-800/60 to-slate-700/60",
  },
};

// ─── Colores por elemento zodiacal ─────────────────────────────────────────
const ELEMENT_COLORS: Record<string, { glow: string; from: string; to: string }> = {
  Fuego:  { glow: "shadow-orange-500/40", from: "from-orange-900/60", to: "to-red-900/60" },
  Tierra: { glow: "shadow-green-500/40",  from: "from-green-900/60",  to: "to-amber-900/60" },
  Aire:   { glow: "shadow-cyan-500/40",   from: "from-cyan-900/60",   to: "to-blue-900/60" },
  Agua:   { glow: "shadow-purple-500/40", from: "from-blue-900/60",   to: "to-purple-900/60" },
};

// ─── Catálogo completo de NFTs ─────────────────────────────────────────────
const NFT_CATALOG: CatalogNFT[] = [
  // ── Drops ──
  {
    id: "genesis-hoodie",
    name: "Genesis Hoodie",
    rarity: "Genesis",
    tokenId: "0",
    category: "drop",
    emoji: "✦",
    ommyPrice: null,
    claimUrl: "/claim",
    shopUrl: "https://www.omdomo.com",
    ommyReward: 5320,
  },
  {
    id: "drop2-solsticio",
    name: "Drop #2 Solsticio",
    rarity: "Founder",
    tokenId: "13",
    category: "drop",
    emoji: "🌕",
    ommyPrice: null,
    lockDate: "Sep 2026",
    claimUrl: "/drops",
    ommyReward: 3000,
  },
  {
    id: "drop3-ommylab",
    name: "Ommy Lab Vol.1",
    rarity: "Community",
    tokenId: "14",
    category: "drop",
    emoji: "⚗️",
    ommyPrice: null,
    lockDate: "Dic 2026",
    claimUrl: "/drops",
    ommyReward: 2000,
  },
  // ── Zodiacales ──
  { id: "zodiac-aries",       name: "Aries",       rarity: "Genesis", tokenId: "1",  category: "zodiac", emoji: "♈", element: "Fuego",  ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Aries",       ommyReward: 1000 },
  { id: "zodiac-tauro",       name: "Tauro",       rarity: "Genesis", tokenId: "2",  category: "zodiac", emoji: "♉", element: "Tierra", ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Tauro",       ommyReward: 1000 },
  { id: "zodiac-geminis",     name: "Géminis",     rarity: "Genesis", tokenId: "3",  category: "zodiac", emoji: "♊", element: "Aire",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Géminis",     ommyReward: 1000 },
  { id: "zodiac-cancer",      name: "Cáncer",      rarity: "Genesis", tokenId: "4",  category: "zodiac", emoji: "♋", element: "Agua",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Cáncer",      ommyReward: 1000 },
  { id: "zodiac-leo",         name: "Leo",         rarity: "Genesis", tokenId: "5",  category: "zodiac", emoji: "♌", element: "Fuego",  ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Leo",         ommyReward: 1000 },
  { id: "zodiac-virgo",       name: "Virgo",       rarity: "Genesis", tokenId: "6",  category: "zodiac", emoji: "♍", element: "Tierra", ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Virgo",       ommyReward: 1000 },
  { id: "zodiac-libra",       name: "Libra",       rarity: "Genesis", tokenId: "7",  category: "zodiac", emoji: "♎", element: "Aire",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Libra",       ommyReward: 1000 },
  { id: "zodiac-escorpio",    name: "Escorpio",    rarity: "Genesis", tokenId: "8",  category: "zodiac", emoji: "♏", element: "Agua",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Escorpio",    ommyReward: 1000 },
  { id: "zodiac-sagitario",   name: "Sagitario",   rarity: "Genesis", tokenId: "9",  category: "zodiac", emoji: "♐", element: "Fuego",  ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Sagitario",   ommyReward: 1000 },
  { id: "zodiac-capricornio", name: "Capricornio", rarity: "Genesis", tokenId: "10", category: "zodiac", emoji: "♑", element: "Tierra", ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Capricornio", ommyReward: 1000 },
  { id: "zodiac-acuario",     name: "Acuario",     rarity: "Genesis", tokenId: "11", category: "zodiac", emoji: "♒", element: "Aire",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Acuario",     ommyReward: 1000 },
  { id: "zodiac-piscis",      name: "Piscis",      rarity: "Genesis", tokenId: "12", category: "zodiac", emoji: "♓", element: "Agua",   ommyPrice: 500, claimUrl: "/claim-zodiac?zodiac=Piscis",      ommyReward: 1000 },
];

// ─── Helper: calcular signo desde birthday ─────────────────────────────────
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

// ─── NFT Card ──────────────────────────────────────────────────────────────
function NFTCard({
  nft,
  status,
  isMyZodiac,
}: {
  nft: CatalogNFT;
  status: NFTStatus;
  isMyZodiac: boolean;
}) {
  const style = RARITY_STYLES[nft.rarity];
  const elemColor = nft.element ? ELEMENT_COLORS[nft.element] : null;
  const isLocked = status === "locked";
  const isOwned = status === "owned";

  const cardBg = nft.category === "zodiac" && elemColor
    ? `${elemColor.from} ${elemColor.to}`
    : style.fullBg;

  const cardGlow = nft.category === "zodiac" && elemColor ? elemColor.glow : style.glow;

  return (
    <motion.div
      whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border overflow-hidden cursor-pointer
        shadow-lg ${cardGlow}
        ${isOwned ? `${style.border} bg-gradient-to-br ${cardBg}` : "border-slate-700/30 bg-gradient-to-br from-slate-900/40 to-slate-800/30"}
        ${isLocked ? "opacity-40" : ""}
        transition-all duration-300
      `}
    >
      {/* Overlay de colores en hover para no poseídos */}
      {!isOwned && !isLocked && (
        <div className={`absolute inset-0 bg-gradient-to-br ${cardBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      )}

      {/* Imagen / Emoji area */}
      <div className={`aspect-square relative flex flex-col items-center justify-center gap-1 overflow-hidden
        ${isOwned ? "" : "grayscale group-hover:grayscale-0"}
        transition-all duration-300
      `}>
        {/* Fondo decorativo */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isOwned ? cardBg : "from-slate-800/60 to-slate-900/60 group-hover:" + cardBg} opacity-60`} />

        {/* Glow pulsante si es poseído */}
        {isOwned && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full pointer-events-none`}
            style={{ background: `radial-gradient(circle, ${nft.category === "zodiac" && elemColor ? elemColor.glow.replace("shadow-", "").replace("/40", "") : "#8B5CF6"} 0%, transparent 70%)`, filter: "blur(20px)" }}
          />
        )}

        {/* Emoji principal */}
        <span
          className={`relative z-10 select-none
            ${nft.category === "zodiac" ? "text-5xl" : "text-4xl"}
            ${isOwned ? "" : "opacity-40 group-hover:opacity-100"}
            transition-opacity duration-300
          `}
        >
          {nft.emoji}
        </span>

        {nft.category === "drop" && (
          <span className={`relative z-10 text-xs text-slate-400 ${isOwned ? "text-slate-300" : "opacity-40 group-hover:opacity-80"} transition-opacity duration-300`}>
            Om Domo
          </span>
        )}
        {nft.category === "zodiac" && nft.element && (
          <span className={`relative z-10 text-xs ${isOwned ? "text-slate-300" : "text-slate-600 group-hover:text-slate-400"} transition-colors duration-300`}>
            {nft.element}
          </span>
        )}

        {/* Badges de estado */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
          {isOwned && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-0.5">
              <Check size={8} /> Tuyo
            </span>
          )}
          {isMyZodiac && !isOwned && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
              <Sparkles size={8} /> Gratis
            </span>
          )}
          {!isOwned && !isMyZodiac && <span />}

          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>
            {nft.rarity}
          </span>
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-20 bg-slate-900/60">
            <Lock size={18} className="text-slate-500" />
            <span className="text-[10px] text-slate-600">{nft.lockDate}</span>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className={`p-2.5 relative z-10
        ${isOwned ? "" : "opacity-50 group-hover:opacity-100"}
        transition-opacity duration-300
      `}>
        <p className={`text-xs font-bold truncate
          ${isOwned ? `bg-gradient-to-r ${style.gradientText} bg-clip-text text-transparent` : "text-slate-400 group-hover:text-slate-200"}
          transition-colors duration-300
        `}>
          {nft.name}
        </p>

        {/* OMMY reward / price */}
        {!isLocked && (
          <div className="flex items-center justify-between mt-1.5 gap-1">
            {isOwned ? (
              <span className="text-[10px] text-purple-400 flex items-center gap-0.5">
                <Coins size={9} /> +{nft.ommyReward.toLocaleString()} OMMY
              </span>
            ) : nft.ommyPrice ? (
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-semibold">
                <Coins size={9} /> {nft.ommyPrice.toLocaleString()} OMMY
              </span>
            ) : (
              <span className="text-[10px] text-slate-600">Compra en tienda</span>
            )}
            <span className="text-[10px] text-slate-600">#{nft.tokenId}</span>
          </div>
        )}

        {/* Botón de acción para disponibles (visible en hover) */}
        {!isOwned && !isLocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <a
              href={nft.claimUrl || nft.shopUrl || "#"}
              onClick={(e) => e.stopPropagation()}
              className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1
                hidden group-hover:flex
                ${isMyZodiac
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                  : nft.ommyPrice
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                    : "bg-slate-700/40 text-slate-300 border border-slate-600/30 hover:bg-slate-700/60"
                }
                transition-colors cursor-pointer
              `}
            >
              {isMyZodiac ? (
                <><Sparkles size={9} /> Reclamar gratis</>
              ) : nft.ommyPrice ? (
                <><ShoppingCart size={9} /> Comprar {nft.ommyPrice} OMMY COIN</>
              ) : (
                <><ExternalLink size={9} /> Ver en tienda</>
              )}
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Panel principal ────────────────────────────────────────────────────────
interface NFTCollectionPanelProps {
  walletAddress?: string;
}

export function NFTCollectionPanel({ walletAddress }: NFTCollectionPanelProps) {
  const [view, setView] = useState<"mine" | "all">("mine");
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set(["genesis-hoodie"]));
  const [myZodiacId, setMyZodiacId] = useState<string | null>(null);

  useEffect(() => {
    const profile = loadProfile();
    const owned = new Set<string>();

    // Genesis Hoodie — siempre aparece como poseído (placeholder)
    owned.add("genesis-hoodie");

    // NFT zodiacal reclamado
    if (profile.zodiacClaimed && profile.birthday) {
      const zodiacId = getZodiacIdFromBirthday(profile.birthday);
      if (zodiacId) owned.add(zodiacId);
    }

    // Zodiac libre desbloqueado (profileRewardClaimed + birthday + no zodiacClaimed)
    if (profile.birthday) {
      setMyZodiacId(getZodiacIdFromBirthday(profile.birthday));
    }

    setOwnedIds(owned);
  }, [walletAddress]);

  function getStatus(nft: CatalogNFT): NFTStatus {
    if (ownedIds.has(nft.id)) return "owned";
    if (nft.lockDate) return "locked";
    return "available";
  }

  const allNfts = NFT_CATALOG;
  const myNfts = allNfts.filter((n) => getStatus(n) === "owned");
  const displayNfts = view === "mine" ? myNfts : allNfts;

  const totalOmmy = myNfts.reduce((s, n) => s + n.ommyReward, 0);
  const availableCount = allNfts.filter((n) => getStatus(n) === "available").length;

  return (
    <div className="space-y-4">

      {/* ── Header stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center border border-slate-700/30">
          <p className="text-base font-black text-purple-300">{myNfts.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Mis NFTs</p>
        </div>
        <div className="glass rounded-xl p-3 text-center border border-slate-700/30">
          <p className="text-base font-black text-amber-300">{totalOmmy.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">OMMY earned</p>
        </div>
        <div className="glass rounded-xl p-3 text-center border border-slate-700/30">
          <p className="text-base font-black text-cyan-300">{allNfts.length - myNfts.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Por conseguir</p>
        </div>
      </div>

      {/* ── Toggle de vista ── */}
      <div className="flex rounded-xl overflow-hidden border border-slate-700/40 p-0.5 gap-0.5 bg-slate-900/40">
        <button
          onClick={() => setView("mine")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
            ${view === "mine"
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
        >
          <Layers size={12} /> Mi Colección
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
            ${view === "mine" ? "bg-white/20 text-white" : "bg-slate-700/60 text-slate-500"}`}>
            {myNfts.length}
          </span>
        </button>
        <button
          onClick={() => setView("all")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
            ${view === "all"
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
        >
          <Grid3X3 size={12} /> Todas
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
            ${view === "all" ? "bg-white/20 text-white" : "bg-slate-700/60 text-slate-500"}`}>
            {allNfts.length}
          </span>
        </button>
      </div>

      {/* ── Banner "disponibles para conseguir" (solo en vista Todas) ── */}
      <AnimatePresence>
        {view === "all" && availableCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-3 border border-amber-500/20 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-300">
                {availableCount} NFTs disponibles para conseguir
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Pasa el cursor sobre cualquier NFT opacado para ver precio y cómo obtenerlo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid de NFTs ── */}
      <AnimatePresence mode="wait">
        {displayNfts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto">
              <Layers size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-400 text-sm">Aún no tienes NFTs</p>
            <div className="flex flex-col items-center gap-2">
              <a
                href="/claim-zodiac"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Sparkles size={12} /> Reclamar NFT Zodiacal gratis
              </a>
              <a
                href="https://www.omdomo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <ShoppingCart size={12} /> Comprar en omdomo.com
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Drops */}
            {(view === "all" || displayNfts.some((n) => n.category === "drop")) && (
              <div className="mb-4">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-px bg-slate-700" /> Drops exclusivos <span className="w-4 h-px bg-slate-700" />
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {(view === "mine" ? displayNfts : allNfts).filter((n) => n.category === "drop").map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      status={getStatus(nft)}
                      isMyZodiac={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Zodiacales */}
            {(view === "all" || displayNfts.some((n) => n.category === "zodiac")) && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-px bg-slate-700" /> Colección Zodiacal · 500 OMMY COIN c/u <span className="w-4 h-px bg-slate-700" />
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(view === "mine" ? displayNfts : allNfts).filter((n) => n.category === "zodiac").map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      status={getStatus(nft)}
                      isMyZodiac={nft.id === myZodiacId && getStatus(nft) === "available"}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA wallet ── */}
      {!walletAddress && (
        <div className="glass rounded-xl p-4 border border-purple-500/20 text-center space-y-2">
          <p className="text-xs text-slate-400">Conecta tu wallet para sincronizar tu colección real on-chain</p>
          <a
            href="/claim"
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
          >
            → Reclamar NFT de compra
          </a>
        </div>
      )}
    </div>
  );
}
