"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles, Coins, Lock } from "lucide-react";

interface NFTItem {
  id: string;
  name: string;
  rarity: "Genesis" | "Founder" | "Community" | "Standard";
  tokenId: string;
  txHash?: string;
  claimedAt?: string;
  ommyReward: number;
  image?: string;
}

const RARITY_STYLES = {
  Genesis:   { border: "border-yellow-400/50",  bg: "from-yellow-900/20 to-orange-900/20", badge: "bg-yellow-400/20 text-yellow-300",   glow: "shadow-yellow-500/20"  },
  Founder:   { border: "border-purple-400/50",  bg: "from-purple-900/20 to-pink-900/20",   badge: "bg-purple-400/20 text-purple-300",   glow: "shadow-purple-500/20"  },
  Community: { border: "border-cyan-400/50",    bg: "from-cyan-900/20 to-blue-900/20",     badge: "bg-cyan-400/20 text-cyan-300",       glow: "shadow-cyan-500/20"    },
  Standard:  { border: "border-slate-600/50",   bg: "from-slate-900/20 to-slate-800/20",   badge: "bg-slate-700/40 text-slate-400",     glow: "shadow-slate-700/20"   },
};

// Placeholder NFTs para mostrar cuando no hay claims reales
const PLACEHOLDER_NFTS: NFTItem[] = [
  {
    id: "genesis-1",
    name: "Om Domo Genesis Hoodie",
    rarity: "Genesis",
    tokenId: "0",
    ommyReward: 5320,
    image: undefined,
  },
];

const LOCKED_SLOTS = [
  { label: "Drop #2 Solsticio", date: "Sep 2026" },
  { label: "Drop #3 Ommy Lab",  date: "Dic 2026" },
  { label: "Conquest NFT",      date: "2027"      },
];

function NFTCard({ nft }: { nft: NFTItem }) {
  const style = RARITY_STYLES[nft.rarity];
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`rounded-2xl border ${style.border} bg-gradient-to-br ${style.bg} cursor-pointer shadow-lg ${style.glow} overflow-hidden`}
      onClick={() => setFlipped(!flipped)}
    >
      <AnimatePresence mode="wait">
        {!flipped ? (
          <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* NFT Image / Placeholder */}
            <div className="aspect-square relative overflow-hidden bg-slate-800/50">
              {nft.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-4xl"
                  >
                    ✦
                  </motion.div>
                  <span className="text-xs text-slate-500 text-center px-2">Om Domo</span>
                </div>
              )}
              {/* Rarity badge */}
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
                {nft.rarity}
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-xs font-bold text-slate-100 truncate">{nft.name}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-slate-500">Token #{nft.tokenId}</span>
                <span className="text-xs text-purple-300 flex items-center gap-0.5">
                  <Coins size={10} />
                  {nft.ommyReward.toLocaleString()} OMMY
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-3 min-h-[180px]">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={12} className="text-purple-400" />
              <span className="text-xs font-bold text-slate-300">Detalles NFT</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Rareza</span>
                <span className={style.badge + " px-1.5 py-0.5 rounded text-xs"}>{nft.rarity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">OMMY reward</span>
                <span className="text-purple-300">+{nft.ommyReward.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Red</span>
                <span className="text-red-400">Avalanche</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acceso DAO</span>
                <span className="text-green-400">✓ Sí</span>
              </div>
            </div>
            {nft.txHash && nft.txHash !== "0xDEV_MODE" && (
              <a
                href={`https://testnet.snowtrace.io/tx/${nft.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
              >
                Ver en Snowtrace <ExternalLink size={10} />
              </a>
            )}
            <p className="text-xs text-slate-600 text-center mt-2">Toca para girar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface NFTCollectionPanelProps {
  walletAddress?: string;
}

export function NFTCollectionPanel({ walletAddress }: NFTCollectionPanelProps) {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setNfts(PLACEHOLDER_NFTS);
      return;
    }
    setLoading(true);
    // Fetch real NFTs from claims by wallet
    // TODO: endpoint /api/nft/by-wallet cuando esté en mainnet
    // Por ahora mostramos placeholder
    setTimeout(() => {
      setNfts(PLACEHOLDER_NFTS);
      setLoading(false);
    }, 500);
  }, [walletAddress]);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "NFTs",       value: nfts.length, color: "text-purple-300" },
          { label: "OMMY total", value: nfts.reduce((s, n) => s + n.ommyReward, 0).toLocaleString(), color: "gradient-text" },
          { label: "Rarity",     value: nfts[0]?.rarity ?? "—", color: "text-yellow-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-3 text-center border border-slate-700/30">
            <p className={`text-base font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* NFT Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-slate-800/40 animate-pulse aspect-square" />
          ))}
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {nfts.map((nft) => <NFTCard key={nft.id} nft={nft} />)}

          {/* Locked upcoming slots */}
          {LOCKED_SLOTS.map((slot) => (
            <div
              key={slot.label}
              className="rounded-2xl border border-slate-800/40 bg-slate-900/20 flex flex-col items-center justify-center gap-2 p-4 aspect-square opacity-50"
            >
              <Lock size={20} className="text-slate-600" />
              <p className="text-xs text-slate-600 text-center leading-tight">{slot.label}</p>
              <p className="text-xs text-slate-700">{slot.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 space-y-3">
          <div className="text-4xl">🎁</div>
          <p className="text-slate-400 text-sm">Aún no tienes NFTs</p>
          <a
            href="https://www.omdomo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Comprar en omdomo.com →
          </a>
        </div>
      )}

      {/* Claim CTA */}
      {!walletAddress && (
        <div className="glass rounded-xl p-4 border border-purple-500/20 text-center space-y-2">
          <p className="text-xs text-slate-400">Conecta tu wallet para ver tu colección real</p>
          <a
            href="/claim"
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 transition-colors"
          >
            → Ir a /claim para mintear tu NFT
          </a>
        </div>
      )}
    </div>
  );
}
