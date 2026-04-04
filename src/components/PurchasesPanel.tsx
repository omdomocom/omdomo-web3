"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle, Clock, Flame, Coins, ExternalLink } from "lucide-react";
import type { Claim } from "@/lib/claims";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${days}d`;
}

const STATUS_STYLES = {
  pending: { icon: <Clock size={12} />, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", label: "Pendiente" },
  claimed: { icon: <CheckCircle size={12} />, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", label: "Reclamado" },
  failed:  { icon: <Clock size={12} />, color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20",    label: "Error"     },
};

export function PurchasesPanel() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, claimed: 0, totalOmmy: 0, totalBurn: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [burnRes] = await Promise.all([
          fetch("/api/burn/stats"),
        ]);
        const burnData = await burnRes.json();
        setStats({
          total: burnData.breakdown?.totalOrders ?? 0,
          claimed: burnData.breakdown?.claimedOrders ?? 0,
          totalOmmy: 0,
          totalBurn: burnData.totalBurned ?? 0,
        });
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Compras totales",  value: loading ? "—" : stats.total,   icon: <ShoppingBag size={14} />,  color: "text-purple-300" },
          { label: "NFTs reclamados",  value: loading ? "—" : stats.claimed,  icon: <CheckCircle size={14} />,  color: "text-green-400"  },
          { label: "OMMY quemados",    value: loading ? "—" : stats.totalBurn.toLocaleString(), icon: <Flame size={14} />, color: "text-orange-400" },
          { label: "OMMY distribuidos",value: loading ? "—" : "—",            icon: <Coins size={14} />,        color: "text-cyan-300"   },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-3 border border-slate-700/30">
            <div className={`mb-1.5 ${s.color}`}>{s.icon}</div>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Purchases table header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
          Compras recientes en omdomo.com
        </p>
        <a
          href="https://www.omdomo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          Ver tienda <ExternalLink size={10} />
        </a>
      </div>

      {/* Purchases list */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : claims.length > 0 ? (
        <div className="space-y-2">
          {claims.map((claim, i) => {
            const s = STATUS_STYLES[claim.status];
            return (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/30 bg-slate-900/40 hover:bg-slate-800/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={14} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{claim.productTitle}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${s.bg} ${s.color} flex items-center gap-1`}>
                      {s.icon} {s.label}
                    </span>
                    <span className="text-xs text-slate-600">{timeAgo(claim.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-purple-300">+{claim.ommyReward.toLocaleString()} OMMY</p>
                  <p className="text-xs text-slate-600">${claim.orderTotal.toFixed(2)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="text-5xl">🛍️</div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Aún no hay compras registradas</p>
            <p className="text-slate-600 text-xs mt-1">Las compras de omdomo.com aparecen aquí automáticamente</p>
          </div>
          <a
            href="https://www.omdomo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ShoppingBag size={14} /> Comprar en omdomo.com
          </a>
          <p className="text-xs text-slate-600">
            Después de la compra, ve a{" "}
            <a href="/claim" className="text-purple-400 hover:underline">/claim</a>{" "}
            para mintear tu NFT
          </p>
        </div>
      )}

      {/* Funnel visual */}
      {!loading && (
        <div className="glass rounded-xl p-4 border border-slate-700/30">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Funnel de conversión</p>
          <div className="space-y-2">
            {[
              { step: "Compra en Shopify",  count: stats.total,   color: "from-purple-500 to-purple-600" },
              { step: "NFT Reclamado",       count: stats.claimed, color: "from-cyan-500 to-cyan-600"    },
              { step: "OMMY en Wallet",      count: stats.claimed, color: "from-green-500 to-green-600"  },
            ].map((f, i) => (
              <div key={f.step} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{f.step}</span>
                    <span className="text-slate-300 font-mono">{f.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${f.color}`}
                      style={{ width: stats.total > 0 ? `${(f.count / stats.total) * 100}%` : "2%" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
