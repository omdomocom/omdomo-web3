"use client";

import { WalletPanel } from "@/components/WalletPanel";
import { ChatInterface } from "@/components/ChatInterface";
import { AgentsPanel } from "@/components/AgentsPanel";
import { RoadmapPanel } from "@/components/RoadmapPanel";
import { TokenomicsPanel } from "@/components/TokenomicsPanel";

const IS_DEV = process.env.NODE_ENV === "development";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
              O
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text leading-none">
                Om Domo AI
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Ommy Coin · Avalanche · omdomo.com · Lanzamiento Jun 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              6 Agentes Online
            </span>
            <span className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-900/20 border border-purple-500/20 text-purple-300">
              Fase 1 · Motor de Ventas
            </span>
            <a
              href="/drops"
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-900/20 border border-orange-500/20 text-orange-300 hover:bg-orange-900/30 transition-colors"
            >
              🔥 Drops
            </a>
            <a
              href="/claim"
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-900/20 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-900/30 transition-colors"
            >
              Reclamar NFT
            </a>
          </div>
        </div>
      </header>

      {/* Main layout — 3 columns */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex gap-5 h-[calc(100vh-73px)]">

        {/* Left sidebar — Wallet + Agents */}
        <aside className="w-64 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          <WalletPanel />
          <AgentsPanel />
        </aside>

        {/* Center — Chat con Coordinator */}
        <main className="flex-1 glass rounded-2xl border border-slate-800/60 p-6 flex flex-col min-w-0">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xl">
              &#129302;
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Om Domo AI Project Coordinator
              </h2>
              <p className="text-xs text-slate-500">
                Web3 · Producto · App · Comunidad · Creativo · Lanzamiento Jun 2026
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatInterface />
          </div>
        </main>

        {/* Right sidebar — Roadmap + Tokenomics (o Test en dev) */}
        <aside className="w-64 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          <RoadmapPanel />
          <TokenomicsPanel />
          {IS_DEV && (
            <DevTestPanel />
          )}
        </aside>
      </div>
    </div>
  );
}

// Panel de test solo visible en desarrollo
function DevTestPanel() {
  return (
    <div className="glass rounded-xl p-3 border border-yellow-500/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <p className="text-xs text-yellow-400 uppercase tracking-wider font-medium">
          Dev Tools
        </p>
      </div>
      <div className="space-y-1.5">
        <a
          href="/claim"
          className="block text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800/40 transition-colors"
        >
          → /claim (test NFT claim)
        </a>
        <a
          href="/drops"
          className="block text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800/40 transition-colors"
        >
          → /drops (test drops page)
        </a>
        <a
          href="/api/burn/stats"
          target="_blank"
          className="block text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800/40 transition-colors"
        >
          → /api/burn/stats (JSON)
        </a>
      </div>
    </div>
  );
}
