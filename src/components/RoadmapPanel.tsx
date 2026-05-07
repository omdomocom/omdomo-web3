"use client";

import { useState } from "react";

const PHASES = [
  { n: 1, name: "Motor de Ventas",   date: "Ago 2026", emoji: "🚀", active: true,
    items: ["NFT por compra", "Wallet connect", "OMMY rewards", "Share-to-earn", "Drops limitados"] },
  { n: 2, name: "Economía OMMY",     date: "Sep 2026", emoji: "🪙", active: false, items: [] },
  { n: 3, name: "App Recompensas",   date: "Ene 2027", emoji: "📱", active: false, items: [] },
  { n: 4, name: "Comunidad DAO",     date: "Jun 2027", emoji: "🏛️", active: false, items: [] },
  { n: 5, name: "Ommy Lab",          date: "2028+",    emoji: "🔬", active: false, items: [] },
];

export function RoadmapPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-xl border border-slate-700/30 overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-800/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Roadmap</span>
          <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Fase 1
          </span>
        </div>
        <span className="text-slate-600 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Progress dots — always visible */}
      <div className="px-3 pb-2.5">
        <div className="relative flex items-center justify-between">
          {/* Connecting line */}
          <div className="absolute left-2.5 right-2.5 top-1/2 -translate-y-1/2 h-px bg-slate-700/50" />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: "12%" }} />

          {PHASES.map((p) => (
            <div key={p.n} className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                p.active
                  ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow shadow-purple-500/40"
                  : "bg-slate-800 border border-slate-700/60 text-slate-600"
              }`}>
                {p.n}
              </div>
              <span className={`text-xs leading-none font-mono ${p.active ? "text-green-400" : "text-slate-700"}`}>
                {p.active ? "NOW" : p.date.replace(" 20", " '")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-800/40">
          {PHASES.map((p) => (
            <div key={p.n} className={`flex gap-2.5 px-3 py-2 ${
              p.active ? "bg-purple-900/10" : ""
            }`}>
              <span className="text-sm flex-shrink-0 mt-px">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1">
                  <p className={`text-xs font-semibold truncate ${p.active ? "text-slate-100" : "text-slate-500"}`}>
                    {p.name}
                  </p>
                  <span className={`text-xs flex-shrink-0 font-mono ${p.active ? "text-green-400 font-bold" : "text-slate-700"}`}>
                    {p.active ? "NOW" : p.date}
                  </span>
                </div>
                {p.active && p.items.length > 0 && (
                  <div className="flex flex-col gap-0.5 mt-1.5">
                    {p.items.map((item) => (
                      <div key={item} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-purple-400/50 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
