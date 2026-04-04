"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink } from "lucide-react";
import type { CoinData } from "@/app/api/prices/route";

// ─── SVG Sparkline ─────────────────────────────────────────────────────────
function Sparkline({ data, color, positive }: { data: number[]; color: string; positive: boolean }) {
  if (!data || data.length < 2) return null;
  const W = 80; const H = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const fill = `${d} L${W},${H} L0,${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={d} fill="none" stroke={positive ? "#4ade80" : "#f87171"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Format helpers ────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  if (n < 0.01)  return `$${n.toFixed(6)}`;
  if (n < 1)     return `$${n.toFixed(4)}`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

// ─── Single coin card ────────────────────────────────────────────────────
function CoinCard({ coin, expanded, onToggle }: {
  coin: CoinData;
  expanded: boolean;
  onToggle: () => void;
}) {
  const pos24 = coin.change24h >= 0;
  const pos7d  = coin.change7d  >= 0;

  return (
    <motion.div
      layout
      onClick={onToggle}
      whileHover={{ scale: 1.01 }}
      className="rounded-xl border border-slate-700/30 bg-slate-900/50 backdrop-blur-sm cursor-pointer overflow-hidden"
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{ background: `${coin.color}22`, border: `1px solid ${coin.color}44`, color: coin.color }}
        >
          {coin.symbol.slice(0, 3)}
        </div>

        {/* Name + price */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-100 truncate">{coin.symbol}</p>
            <p className="text-xs font-bold text-slate-100 tabular-nums">{fmt(coin.price)}</p>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-xs text-slate-500 truncate">{coin.name}</p>
            <span className={`text-xs font-medium tabular-nums flex items-center gap-0.5 ${pos24 ? "text-green-400" : "text-red-400"}`}>
              {pos24 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {pos24 ? "+" : ""}{coin.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="flex-shrink-0">
          <Sparkline data={coin.sparkline} color={coin.color} positive={pos7d} />
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-700/30 px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1"
          >
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">7d</span>
              <span className={pos7d ? "text-green-400" : "text-red-400"}>
                {pos7d ? "+" : ""}{coin.change7d.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Mkt Cap</span>
              <span className="text-slate-300">{fmt(coin.marketCap)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Vol 24h</span>
              <span className="text-slate-300">{fmt(coin.volume24h)}</span>
            </div>
            {coin.isOmmy && (
              <div className="col-span-2 text-xs text-purple-400 mt-1">
                Precio estimado al lanzamiento · Jun 2026
              </div>
            )}
            {!coin.isOmmy && (
              <div className="flex justify-between text-xs col-span-2">
                <span className="text-slate-500">Fuente</span>
                <a
                  href={`https://www.coingecko.com/en/coins/${coin.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-cyan-400 flex items-center gap-0.5 hover:underline"
                >
                  CoinGecko <ExternalLink size={9} />
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────
export function CryptoPanel() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  async function fetchPrices() {
    setLoading(true);
    try {
      const res = await fetch("/api/prices");
      const data: CoinData[] = await res.json();
      setCoins(data);
      setLastUpdate(new Date());
    } catch {
      // keep existing data
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
          Mercados
        </p>
        <button
          onClick={fetchPrices}
          disabled={loading}
          className="text-slate-600 hover:text-slate-300 transition-colors"
        >
          <motion.div animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}>
            <RefreshCw size={12} />
          </motion.div>
        </button>
      </div>

      {/* Coins */}
      <div className="space-y-1.5">
        {loading && coins.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-800/40 animate-pulse" />
          ))
        ) : (
          coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              expanded={expanded === coin.id}
              onToggle={() => setExpanded(expanded === coin.id ? null : coin.id)}
            />
          ))
        )}
      </div>

      {lastUpdate && (
        <p className="text-xs text-slate-700 text-right px-1">
          Actualizado {lastUpdate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
}
