"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, Zap, TrendingUp, Vote,
  Bot, Users, ShoppingBag, Flame, Coins,
  ChevronRight, ExternalLink, Menu, X,
} from "lucide-react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "@/lib/thirdweb";

import { SpaceBackground }     from "@/components/SpaceBackground";
import { ChatInterface }        from "@/components/ChatInterface";
import { AgentsPanel }          from "@/components/AgentsPanel";
import { CryptoPanel }          from "@/components/CryptoPanel";
import { NFTCollectionPanel }   from "@/components/NFTCollectionPanel";
import { GamificationPanel }    from "@/components/GamificationPanel";
import { PurchasesPanel }       from "@/components/PurchasesPanel";
import { DAOPanel }             from "@/components/DAOPanel";
import { InviteFriendPanel }    from "@/components/InviteFriendPanel";
import { SocialCarousel }       from "@/components/SocialCarousel";
import { RoadmapPanel }         from "@/components/RoadmapPanel";
import { TokenomicsPanel }      from "@/components/TokenomicsPanel";
import { WalletPanel }          from "@/components/WalletPanel";

type TabId = "overview" | "nft" | "dapp" | "finanzas" | "dao" | "ai";

const TABS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "overview",  label: "Overview",   icon: <LayoutDashboard size={15} /> },
  { id: "nft",       label: "Mi Colección",icon: <Image size={15} /> },
  { id: "dapp",      label: "dApp",        icon: <Zap size={15} /> },
  { id: "finanzas",  label: "Finanzas",    icon: <TrendingUp size={15} /> },
  { id: "dao",       label: "DAO",         icon: <Vote size={15} />, badge: "1" },
  { id: "ai",        label: "AI Coordinator", icon: <Bot size={15} /> },
];

// ─── DApp Panel (inline) ──────────────────────────────────────────────────
function DAppPanel() {
  const TOOLS = [
    { icon: "🎁", label: "Reclamar NFT",    desc: "Conecta wallet y mintea tu NFT",  href: "/claim",   cta: "Abrir" },
    { icon: "🔥", label: "Drops limitados", desc: "Ver próximos drops y countdown",   href: "/drops",   cta: "Ver drops" },
    { icon: "🤝", label: "Invitar amigos",  desc: "+2,000 OMMY por referido",         href: undefined,  cta: "Compartir" },
    { icon: "🛍", label: "Tienda",          desc: "Comprar en omdomo.com",            href: "https://www.omdomo.com", cta: "Ir a tienda", external: true },
    { icon: "🏛", label: "Staking NFT",     desc: "+50 OMMY/día — Fase 2",            href: undefined,  cta: "Próximamente", disabled: true },
    { icon: "📊", label: "Portafolio",      desc: "Ver tus OMMY y NFTs",              href: undefined,  cta: "Ver colección" },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TOOLS.map((t) => (
          <motion.div
            key={t.label}
            whileHover={!t.disabled ? { y: -3, scale: 1.01 } : {}}
            className={`glass rounded-2xl p-5 border transition-all ${
              t.disabled ? "border-slate-800/30 opacity-50 cursor-not-allowed" : "border-slate-700/30 hover:border-purple-500/30 cursor-pointer"
            }`}
          >
            <div className="text-3xl mb-3">{t.icon}</div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">{t.label}</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t.desc}</p>
            {t.href ? (
              <a
                href={t.href}
                target={t.external ? "_blank" : "_self"}
                rel={t.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                {t.cta} <ChevronRight size={12} />
              </a>
            ) : (
              <span className={`text-xs font-semibold ${t.disabled ? "text-slate-600" : "text-purple-400"}`}>
                {t.cta}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick links bar */}
      <div className="glass rounded-2xl p-4 border border-slate-700/30 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-slate-500">Links rápidos:</span>
        {[
          { label: "omdomo.com", href: "https://www.omdomo.com" },
          { label: "/claim",     href: "/claim" },
          { label: "/drops",     href: "/drops" },
          { label: "Snowtrace (Fuji)", href: "https://testnet.snowtrace.io/token/0xd51de87FbC012b694922036C30E5C82e16594958" },
          { label: "Snowtrace (OMMY)", href: "https://snowtrace.io/token/0x70EdA9Bb95eeE2551261c37720933905f9425596" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {l.label} <ExternalLink size={9} />
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Panel (inline) ─────────────────────────────────────────────
function OverviewPanel({ address }: { address?: string }) {
  return (
    <div className="space-y-5">
      {/* Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "OMMY Price",   value: "$0.001",  sub: "Jun 2026",        icon: <Coins size={16} />,       color: "from-purple-500 to-pink-500"  },
          { label: "NFTs",         value: address ? "1" : "—",  sub: "Colección",  icon: <Image size={16} />,        color: "from-cyan-500 to-blue-500"    },
          { label: "Supply Burn",  value: "0%",      sub: "de 90% objetivo", icon: <Flame size={16} />,       color: "from-orange-500 to-red-500"   },
          { label: "Comunidad",    value: "2,000",   sub: "target 2026",     icon: <Users size={16} />,       color: "from-green-500 to-emerald-500"},
        ].map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -2 }}
            className="glass rounded-2xl p-4 border border-slate-700/30"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-xl font-black text-slate-100">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* 2 cols */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Compras recientes</p>
          <PurchasesPanel />
        </div>
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Gamificación</p>
          <GamificationPanel ommyBalance={address ? 5320 : 0} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const account = useActiveAccount();
  const address = account?.address;

  const tabContent: Record<TabId, React.ReactNode> = {
    overview:  <OverviewPanel address={address} />,
    nft:       <NFTCollectionPanel walletAddress={address} />,
    dapp:      <DAppPanel />,
    finanzas:  (
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Mercados en vivo</p>
          <CryptoPanel />
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Tokenomics OMMY</p>
            <TokenomicsPanel />
          </div>
        </div>
      </div>
    ),
    dao:  <DAOPanel />,
    ai:   (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-700/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xl">🤖</div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Om Domo AI Project Coordinator</h2>
            <p className="text-xs text-slate-500">Web3 · Producto · App · Comunidad · Creativo</p>
          </div>
          <div className="ml-auto">
            <AgentsPanel />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#07091a] text-slate-100 flex flex-col overflow-hidden relative">
      {/* Space background — fixed, fills screen */}
      <div className="fixed inset-0 z-0">
        <SpaceBackground />
      </div>

      {/* Content — above background */}
      <div className="relative z-10 flex flex-col h-screen">

        {/* ── TOP NAV ────────────────────────────────────────────────── */}
        <nav className="flex-shrink-0 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl">
          <div className="max-w-[1700px] mx-auto px-4 h-14 flex items-center gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-black text-sm">O</div>
              <span className="font-black text-sm gradient-text hidden sm:block">Om Domo</span>
            </a>

            {/* Desktop tabs */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right: status + wallet + mobile menu */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Fuji live
              </div>
              <a href="/drops" className="hidden md:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-colors">
                <Flame size={11} /> Drops
              </a>
              <div className="scale-90 origin-right">
                <ConnectButton
                  client={client}
                  connectButton={{ label: "Conectar wallet", style: { fontSize: "12px", padding: "6px 12px", borderRadius: "10px" } }}
                />
              </div>
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-1.5 rounded-lg border border-slate-700/40 text-slate-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile tab bar */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-slate-800/40 bg-slate-950/80 px-4 py-2 flex flex-wrap gap-1.5 overflow-hidden"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id ? "bg-purple-500/20 text-purple-300" : "text-slate-400"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ── MAIN LAYOUT ────────────────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left sidebar */}
          <aside className="hidden xl:flex flex-col w-56 flex-shrink-0 border-r border-slate-800/40 bg-slate-950/30 backdrop-blur-sm overflow-y-auto p-3 gap-3">
            <WalletPanel />

            {/* Quick nav links */}
            <div className="glass rounded-xl p-2 border border-slate-700/30">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-purple-500/15 text-purple-300"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  }`}
                >
                  <span className={activeTab === tab.id ? "text-purple-400" : "text-slate-600"}>{tab.icon}</span>
                  {tab.label}
                  {tab.badge && <span className="ml-auto text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-black">{tab.badge}</span>}
                </button>
              ))}
            </div>

            <RoadmapPanel />
          </aside>

          {/* Center — tab content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={activeTab === "ai" ? "h-full flex flex-col" : ""}
              >
                {/* Tab header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{TABS.find(t => t.id === activeTab)?.icon}</span>
                    <h1 className="text-lg font-black text-slate-100">
                      {TABS.find(t => t.id === activeTab)?.label}
                    </h1>
                  </div>
                  {activeTab === "nft" && (
                    <a href="/claim" className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-colors">
                      + Mintear NFT
                    </a>
                  )}
                  {activeTab === "dapp" && (
                    <a href="/drops" className="text-xs px-3 py-1.5 rounded-lg bg-orange-600/20 border border-orange-500/30 text-orange-300 hover:bg-orange-600/30 transition-colors flex items-center gap-1.5">
                      <Flame size={11} /> Ver drops
                    </a>
                  )}
                  {activeTab === "overview" && !address && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      Conecta tu wallet para datos personalizados
                    </p>
                  )}
                  {activeTab === "overview" && address && (
                    <p className="text-xs text-slate-500 font-mono">
                      {address.slice(0, 8)}...{address.slice(-6)}
                    </p>
                  )}
                </div>

                {/* Content */}
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Right sidebar */}
          <aside className="hidden 2xl:flex flex-col w-72 flex-shrink-0 border-l border-slate-800/40 bg-slate-950/30 backdrop-blur-sm overflow-y-auto p-3 gap-4">
            {/* Crypto prices */}
            <CryptoPanel />

            <div className="border-t border-slate-800/40" />

            {/* Invite friend */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-1">Referidos</p>
              <InviteFriendPanel walletAddress={address} />
            </div>

            <div className="border-t border-slate-800/40" />

            {/* Burn live counter */}
            <div className="glass rounded-xl p-3 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={14} className="text-orange-400" />
                <span className="text-xs text-orange-400 font-bold">Burn en vivo</span>
              </div>
              <p className="text-xs text-slate-500">Cada compra quema</p>
              <p className="text-base font-black text-orange-300">500 OMMY</p>
              <p className="text-xs text-slate-500 mt-1">+ 2% de rewards distribuidos</p>
              <a href="/api/burn/stats" target="_blank" className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1 mt-2">
                Ver stats <ExternalLink size={9} />
              </a>
            </div>

            {/* Quick links */}
            <div className="glass rounded-xl p-3 border border-slate-700/30 space-y-1.5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Accesos rápidos</p>
              {[
                { label: "Reclamar NFT",     href: "/claim",                              icon: "🎁" },
                { label: "Ver drops",         href: "/drops",                              icon: "🔥" },
                { label: "Comprar ropa",      href: "https://www.omdomo.com",             icon: "🛍", external: true },
                { label: "Unirte al Discord", href: "https://discord.gg/omdomo",          icon: "💬", external: true },
                { label: "Telegram",          href: "https://t.me/omdomo",                icon: "📲", external: true },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/40 transition-colors group"
                >
                  <span>{l.icon}</span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex-1">{l.label}</span>
                  <ChevronRight size={10} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                </a>
              ))}
            </div>

            {/* Buy OMMY CTA */}
            <div className="glass rounded-xl p-4 border border-purple-500/20 text-center space-y-2">
              <p className="text-xs font-bold text-slate-100">Pre-compra OMMY</p>
              <p className="text-xs text-slate-500">Precio lanzamiento: <strong className="text-purple-300">$0.001</strong></p>
              <div className="text-xs text-slate-600">Jun 2026</div>
              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                <ShoppingBag size={12} /> Unirme a la lista
              </button>
            </div>
          </aside>
        </div>

        {/* ── SOCIAL CAROUSEL ────────────────────────────────────────── */}
        <div className="flex-shrink-0">
          <SocialCarousel />
        </div>
      </div>
    </div>
  );
}
