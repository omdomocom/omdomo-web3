"use client";

import { useEffect, useState } from "react";
import { Flame, Users, Coins } from "lucide-react";
import {
  SUPPLY,
  PRICE,
  WALLET_DISTRIBUTION,
  BURN_SCHEDULE,
} from "@/lib/tokenomics";

interface BurnStats {
  totalBurned: number;
  burnPercent: number;
  currentSupply: number;
  breakdown: {
    claimedOrders: number;
    totalOrders: number;
  };
}

const CURRENT_YEAR = 2026;

export function TokenomicsPanel() {
  const [burnStats, setBurnStats] = useState<BurnStats | null>(null);
  const [expanded, setExpanded] = useState<"wallets" | null>(null);

  useEffect(() => {
    fetch("/api/burn/stats")
      .then((r) => r.json())
      .then(setBurnStats)
      .catch(() => null);
  }, []);

  const burnPercent = burnStats?.burnPercent ?? 0;
  const currentSupply = burnStats?.currentSupply ?? SUPPLY.initial;
  const totalOrders = burnStats?.breakdown.totalOrders ?? 0;
  const currentPrice = PRICE.launch;

  // Usuarios estimados este año
  const thisYearSchedule = BURN_SCHEDULE.find((b) => b.year === CURRENT_YEAR);
  const estimatedUsers = thisYearSchedule?.users ?? 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="glass rounded-xl p-4 border border-orange-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} className="text-orange-400" />
          <p className="text-xs text-orange-400 uppercase tracking-wider font-medium">
            Tokenomics Live
          </p>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="glass rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-500 mb-0.5">Precio OMMY</p>
            <p className="text-sm font-bold text-cyan-300">${currentPrice.toFixed(4)}</p>
          </div>
          <div className="glass rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-500 mb-0.5">Market Cap</p>
            <p className="text-sm font-bold text-purple-300">
              ${(currentPrice * SUPPLY.circulatingAtLaunch / 1_000_000).toFixed(1)}M
            </p>
          </div>
          <div className="glass rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-500 mb-0.5">Orders</p>
            <p className="text-sm font-bold text-slate-200">{totalOrders}</p>
          </div>
          <div className="glass rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-500 mb-0.5">Target users {CURRENT_YEAR}</p>
            <p className="text-sm font-bold text-green-300">{estimatedUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Burn progress */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Flame size={10} className="text-orange-400" />
              Burn progress
            </span>
            <span className="font-mono">{burnPercent.toFixed(3)}% / 90%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(burnPercent / 90 * 100, 0.5)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0</span>
            <span>{(SUPPLY.burnTarget / 1e9).toFixed(1)}B objetivo</span>
          </div>
        </div>
      </div>

      {/* Supply info */}
      <div className="glass rounded-xl p-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Supply inicial</span>
            <span className="font-mono text-slate-400">{(SUPPLY.initial / 1e9).toFixed(2)}B</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Supply actual</span>
            <span className="font-mono text-slate-200">{(currentSupply / 1e9).toFixed(4)}B</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Supply final objetivo</span>
            <span className="font-mono text-cyan-300">{(SUPPLY.final / 1e9).toFixed(2)}B</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Flame size={10} className="text-orange-400" /> A quemar total
            </span>
            <span className="font-mono text-orange-400">
              {(SUPPLY.burnTarget / 1e9).toFixed(2)}B (90%)
            </span>
          </div>
        </div>
      </div>

      {/* Distribución wallets — expandible */}
      <div className="glass rounded-xl overflow-hidden">
        <button
          onClick={() => setExpanded(expanded === "wallets" ? null : "wallets")}
          className="w-full flex items-center justify-between p-3 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Coins size={12} className="text-purple-400" />
            Distribución wallets
          </span>
          <span className="text-slate-600">{expanded === "wallets" ? "▲" : "▼"}</span>
        </button>
        {expanded === "wallets" && (
          <div className="px-3 pb-3 space-y-2 animate-fade-in">
            {WALLET_DISTRIBUTION.map((w) => (
              <div key={w.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 truncate">{w.label}</span>
                  <span className="text-slate-300 ml-2 flex-shrink-0">{w.percent}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${w.color} rounded-full`}
                    style={{ width: `${w.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
