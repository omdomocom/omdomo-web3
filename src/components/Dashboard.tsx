"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, Zap, TrendingUp, Vote,
  Users, ShoppingBag, Flame, Coins,
  ChevronRight, ExternalLink, Menu, X, UserCircle,
  MessagesSquare, BookOpen, Heart, Info, Moon, Sun,
  PanelLeftClose, PanelLeftOpen, ChevronRight as Chevron, Share2,
} from "lucide-react";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { getNFTContract } from "@/lib/nft";
import NextImage from "next/image";

import { SpaceBackground }       from "@/components/SpaceBackground";
import { CloudsBackground, OceanBackground, LavaBackground, ForestBackground, SolidBackground } from "@/components/AnimatedBackground";
import { CryptoPanel }           from "@/components/CryptoPanel";
import { NFTCollectionPanel }    from "@/components/NFTCollectionPanel";
import { GamificationPanel }     from "@/components/GamificationPanel";
import { PurchasesPanel }        from "@/components/PurchasesPanel";
import { DAOPanel }              from "@/components/DAOPanel";
import { InviteFriendPanel }     from "@/components/InviteFriendPanel";
import { SocialCarousel }        from "@/components/SocialCarousel";
import { RoadmapPanel }          from "@/components/RoadmapPanel";
import { TokenomicsPanel }       from "@/components/TokenomicsPanel";
import { WalletPanel }           from "@/components/WalletPanel";
import { ProfilePanel, BG_THEMES, loadProfile, UserAvatar } from "@/components/ProfilePanel";
import { CommunityPanel }        from "@/components/CommunityPanel";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { OnboardingChecklist }   from "@/components/OnboardingChecklist";
import { ActivityTimeline }      from "@/components/ActivityTimeline";
import { Web3AcademyPanel }      from "@/components/Web3AcademyPanel";
import { ShareToEarnPanel }      from "@/components/ShareToEarnPanel";

type TabId = "overview" | "nosotros" | "nft" | "dapp" | "finanzas" | "dao" | "perfil" | "social" | "academy" | "share";

// Tabs shown in the LEFT SIDEBAR (full list, ordered by relevance)
const SIDEBAR_TABS: { id: TabId; label: string; icon: React.ReactNode; badge?: string; secondary?: boolean }[] = [
  { id: "overview",  label: "Overview",       icon: <LayoutDashboard size={15} /> },
  { id: "nosotros",  label: "Sobre nosotros",  icon: <Info size={15} /> },
  { id: "nft",       label: "NFTs",            icon: <Image size={15} /> },
  { id: "dao",       label: "DAO",             icon: <Vote size={15} />, badge: "1" },
  { id: "social",    label: "Comunidad",       icon: <MessagesSquare size={15} /> },
  { id: "share",     label: "Share & Earn 🪙", icon: <Share2 size={15} />,    badge: "+" },
  { id: "academy",   label: "Web3 Academy ✦", icon: <BookOpen size={15} />, badge: "🎓" },
  { id: "perfil",    label: "Mi Perfil",       icon: <UserCircle size={15} /> },
  // Secondary — lower priority, only in sidebar
  { id: "finanzas",  label: "Finanzas",        icon: <TrendingUp size={15} />, secondary: true },
  { id: "dapp",      label: "dApp",            icon: <Zap size={15} />,        secondary: true },
];

// Tabs shown in the TOP NAV (minimal, only the main ones)
const NAV_TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "nft",      label: "NFT" },
  { id: "dao",      label: "DAO" },
  { id: "social",   label: "Comunidad" },
  { id: "share",    label: "Share & Earn" },
  { id: "academy",  label: "Academy" },
];

// ─── DApp Panel ───────────────────────────────────────────────────────────
function DAppPanel() {
  const LIVE = [
    { icon: "🎁", label: "Reclamar NFT",    desc: "Conecta wallet y mintea tu NFT tras una compra.", href: "/claim",              cta: "Abrir" },
    { icon: "🔥", label: "Drops limitados", desc: "Ver próximos drops y su countdown en vivo.",      href: "/drops",              cta: "Ver drops" },
    { icon: "🛍", label: "Tienda",          desc: "Comprar ropa consciente en omdomo.com.",          href: "https://www.omdomo.com", cta: "Ir a tienda", external: true },
  ];
  const SOON = [
    { icon: "🧘", label: "Yoga & Meditación",   desc: "Sesiones guiadas que te recompensan con OMMY COIN.",       fase: "Fase 3" },
    { icon: "🏃", label: "Actividad Física",     desc: "Registra entrenamientos y gana tokens por tu esfuerzo.", fase: "Fase 3" },
    { icon: "🎨", label: "Arte Consciente",      desc: "Crea y comparte arte digital — mintea tu obra como NFT.", fase: "Fase 3" },
    { icon: "🏛",  label: "Staking NFT",         desc: "+50 OMMY/día por mantener tu NFT en staking.",         fase: "Fase 2" },
  ];
  return (
    <div className="space-y-5">

      {/* ── Pre-compra OMMY COIN banner ── */}
      <motion.a
        href="/#precompra"
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ duration: 0.18 }}
        className="block glass rounded-2xl p-5 border border-amber-500/30 hover:border-amber-400/50 transition-all cursor-pointer relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(124,58,237,0.08) 100%)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-t-2xl" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pre-lanzamiento
              </span>
              <span className="text-[10px] text-slate-500">Cambia a "Comprar" en Junio 2026</span>
            </div>
            <h3 className="text-sm font-bold text-amber-300 mb-0.5">Pre-compra OMMY COIN</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precio fijo $0.001 · 10% del supply reservado · Lock 30 días
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <span className="text-xl font-black text-amber-300">$0.001</span>
            <span className="text-[10px] text-slate-500">por OMMY COIN</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 mt-1">
              Participar <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </motion.a>

      {/* Live tools */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Disponible ahora</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LIVE.map((t) => (
            <motion.div
              key={t.label}
              whileHover={{ y: -3, scale: 1.01 }}
              className="glass rounded-2xl p-5 border border-slate-700/30 hover:border-purple-500/30 transition-all cursor-pointer"
            >
              <div className="text-3xl mb-3">{t.icon}</div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">{t.label}</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t.desc}</p>
              <a
                href={t.href}
                target={t.external ? "_blank" : "_self"}
                rel={t.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                {t.cta} <ChevronRight size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Próximamente</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOON.map((t) => (
            <div key={t.label} className="glass rounded-2xl p-5 border border-slate-800/40 opacity-60 relative overflow-hidden">
              {/* Próximamente badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-600/40 text-xs text-slate-500 font-semibold">
                {t.fase}
              </div>
              <div className="text-3xl mb-3 grayscale">{t.icon}</div>
              <h3 className="text-sm font-bold text-slate-400 mb-1">{t.label}</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{t.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 border border-slate-700/40 px-2 py-0.5 rounded-lg">
                ⏳ Próximamente
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 border border-slate-700/30 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-slate-500">Links:</span>
        {[
          { label: "omdomo.com",     href: "https://www.omdomo.com" },
          { label: "Snowtrace OMMY COIN", href: "https://snowtrace.io/token/0x70EdA9Bb95eeE2551261c37720933905f9425596" },
          { label: "Snowtrace Fuji", href: "https://testnet.snowtrace.io/token/0xd51de87FbC012b694922036C30E5C82e16594958" },
        ].map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            {l.label} <ExternalLink size={9} />
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Sobre Nosotros Panel ─────────────────────────────────────────────────
function SobreNosotrosPanel() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Hero */}
      <div className="glass rounded-3xl p-8 border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-t-3xl" />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-2xl">
              ☯️
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-100">Om Domo</h1>
              <p className="text-xs text-slate-500">Spiritual Web3 Lifestyle · Avalanche</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Om Domo es el primer ecosistema <strong className="text-purple-300">Spiritual Web3 Lifestyle</strong> de Europa.
            Unimos ropa consciente, tecnología blockchain y comunidad para crear un nuevo modelo donde
            cada compra tiene significado y recompensa.
          </p>
        </div>
      </div>

      {/* Misión + Visión */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 border border-purple-500/15">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-sm font-bold text-slate-100 mb-2">Nuestra Misión</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Democratizar el acceso a la economía Web3 a través de la moda consciente.
            Cada prenda que vistes activa recompensas reales en la blockchain y te conecta
            a una comunidad que comparte valores de bienestar, sostenibilidad y crecimiento personal.
          </p>
        </div>
        <div className="glass rounded-2xl p-6 border border-cyan-500/15">
          <div className="text-3xl mb-3">🌍</div>
          <h3 className="text-sm font-bold text-slate-100 mb-2">Nuestra Visión</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ser la comunidad de referencia en Europa donde el estilo de vida consciente
            y la tecnología blockchain se fusionan. Para 2028, una comunidad de más de
            55,000 personas en 4 países con su propio ecosistema económico autónomo.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="glass rounded-2xl p-6 border border-slate-700/30">
        <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Heart size={15} className="text-pink-400" /> Nuestros valores
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: "🧘", title: "Conciencia",      desc: "Cada decisión empresarial parte de la intención y el impacto positivo." },
            { icon: "🌱", title: "Sostenibilidad",  desc: "Materiales responsables, quema de tokens programada, comunidad sostenible." },
            { icon: "🤝", title: "Comunidad",       desc: "El 60% del supply está dedicado a la comunidad y al ecosistema." },
            { icon: "🔓", title: "Transparencia",   desc: "Tokenomics públicas, wallets verificables, roadmap abierto." },
            { icon: "⚡", title: "Innovación",      desc: "Lululemon + STEPN + DAO espiritual: un modelo nuevo en Europa." },
            { icon: "🏆", title: "Recompensa",      desc: "Cada acción consciente —comprar, meditar, correr— tiene recompensa real." },
          ].map((v) => (
            <div key={v.title} className="flex gap-3 items-start p-3 rounded-xl bg-slate-900/30">
              <span className="text-xl flex-shrink-0">{v.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-200">{v.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* El proyecto */}
      <div className="glass rounded-2xl p-6 border border-slate-700/30 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">El proyecto</h3>
        <div className="space-y-3">
          {[
            {
              icon: "🛍️",
              title: "omdomo.com — Tienda física + online",
              desc: "Colecciones de ropa que combinan estética minimalista con materiales sostenibles. Cada prenda incluye un código QR que activa tu recompensa Web3.",
            },
            {
              icon: "🪙",
              title: "OMMY Coin — Token en Avalanche",
              desc: "ERC-20 desplegado en Avalanche Mainnet. Supply de 29,979M tokens con mecánica deflacionaria: objetivo reducir el 70% del supply en 7-8 años.",
            },
            {
              icon: "🖼️",
              title: "NFTs — Certificados de pertenencia",
              desc: "Cada compra genera un NFT único en Avalanche. La rareza depende de cuándo compras: Genesis (antes del lanzamiento) es la máxima rareza.",
            },
            {
              icon: "🏛️",
              title: "DAO — Gobernanza comunitaria",
              desc: "La comunidad vota sobre nuevos diseños, drops y uso del Treasury. Tus NFTs y OMMY COIN en staking son tu poder de voto.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap resumen */}
      <div className="glass rounded-2xl p-6 border border-slate-700/30">
        <h3 className="text-sm font-bold text-slate-100 mb-4">Roadmap</h3>
        <div className="space-y-3">
          {[
            { fase: "1", nombre: "Motor de Ventas",              fecha: "Jun 2026", estado: "ACTIVA",    color: "border-green-500/50 text-green-400" },
            { fase: "2", nombre: "Economía Ommy Coin",           fecha: "Sep 2026", estado: "Pendiente", color: "border-slate-700/40 text-slate-500" },
            { fase: "3", nombre: "App Proof of Conscious Activity", fecha: "Ene 2027", estado: "Pendiente", color: "border-slate-700/40 text-slate-500" },
            { fase: "4", nombre: "Comunidad DAO",                fecha: "Jun 2027", estado: "Pendiente", color: "border-slate-700/40 text-slate-500" },
            { fase: "5", nombre: "Ommy Lab",                     fecha: "2028+",    estado: "Pendiente", color: "border-slate-700/40 text-slate-500" },
          ].map((f) => (
            <div key={f.fase} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${f.color} ${f.estado === "ACTIVA" ? "bg-green-900/10" : ""}`}>
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400">{f.fase}</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-200">{f.nombre}</p>
                <p className="text-xs text-slate-600">{f.fecha}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${f.color}`}>{f.estado}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Redes */}
      <div className="glass rounded-2xl p-4 border border-slate-700/30">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Comunidad</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Discord",    href: "https://discord.gg/xXezFXnpaX", icon: "💬" },
            { label: "Instagram",  href: "https://www.instagram.com/om.domo/", icon: "📸" },
            { label: "TikTok",    href: "https://www.tiktok.com/@omdomo.com", icon: "🎵" },
            { label: "X/Twitter", href: "https://twitter.com/omdomocom", icon: "𝕏" },
            { label: "YouTube",   href: "https://www.youtube.com/@omdomocom", icon: "▶️" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/40 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Finanzas panel (with wallet balances) ────────────────────────────────
function FinanzasPanel({ address }: { address?: string }) {
  return (
    <div className="space-y-6">
      {/* Wallet balances */}
      {address && (
        <div className="glass rounded-2xl p-5 border border-purple-500/15">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Tu wallet</p>
          <WalletPanel />
        </div>
      )}
      {!address && (
        <div className="glass rounded-2xl p-6 border border-slate-700/30 text-center">
          <p className="text-sm text-slate-400 mb-3">Conecta tu wallet para ver tus balances</p>
          <ConnectButton client={client} connectButton={{ label: "Conectar wallet", style: { fontSize: "12px" } }} />
        </div>
      )}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Mercados en vivo</p>
          <CryptoPanel />
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Tokenomics OMMY COIN</p>
            <TokenomicsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Animated stat ────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: string }) {
  return (
    <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {value}
    </motion.span>
  );
}

// ─── Drop countdown ───────────────────────────────────────────────────────
function DropCountdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const DROP = new Date("2026-06-15T10:00:00Z").getTime();
    function update() {
      const diff = DROP - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-1.5">
      {[{ v: time.d, u: "d" }, { v: time.h, u: "h" }, { v: time.m, u: "m" }, { v: time.s, u: "s" }].map(({ v, u }) => (
        <div key={u} className="flex items-baseline gap-0.5">
          <span className="text-sm font-black text-slate-100 tabular-nums w-7 text-center">{String(v).padStart(2, "0")}</span>
          <span className="text-xs text-slate-600">{u}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Overview Panel ───────────────────────────────────────────────────────
function OverviewPanel({ address }: { address?: string }) {
  const nftContract = getNFTContract();
  const { data: ownedNFTs } = useReadContract(
    getOwnedNFTs,
    address && nftContract
      ? { contract: nftContract, address }
      : { contract: nftContract!, address: "" }
  );
  const nftCount = address ? (ownedNFTs?.length ?? "…") : "—";
  const nftSub   = address
    ? (ownedNFTs && ownedNFTs.length > 0 ? "Genesis · Om Domo" : "Sin NFTs aún")
    : "Conecta wallet";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "OMMY Price",      value: "$0.001",      sub: "Lanzamiento Jun 2026",   icon: <Coins size={15} />, color: "from-purple-500 to-pink-500",   glow: "shadow-purple-500/20" },
          { label: "Mis NFTs",        value: String(nftCount), sub: nftSub,                 icon: <Image size={15} />, color: "from-cyan-500 to-blue-500",     glow: "shadow-cyan-500/20" },
          { label: "OMMY Acumulados", value: address ? "5,320" : "—", sub: address ? "≈ $5.32" : "Conecta wallet", icon: <Coins size={15} />, color: "from-yellow-400 to-amber-500", glow: "shadow-yellow-500/20" },
          { label: "Supply Quemado",  value: "0.001%",      sub: "objetivo 70%",           icon: <Flame size={15} />, color: "from-orange-500 to-red-500",    glow: "shadow-orange-500/20" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className={`glass rounded-2xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all shadow-lg ${s.glow} cursor-default`}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm`}>
              <span className="text-white">{s.icon}</span>
            </div>
            <p className="text-xl font-black text-slate-100"><AnimatedNumber value={s.value} /></p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-700 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Drop countdown */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-4 border border-orange-500/25 bg-gradient-to-r from-orange-900/10 to-red-900/10"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-lg flex-shrink-0">🔥</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate">Drop #1 Genesis Hoodie</p>
              <p className="text-xs text-slate-500 truncate">100 uds · €89 · 10,000 OMMY Bonus</p>
            </div>
          </div>
          <a href="/drops" className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-xs font-bold text-orange-300 hover:bg-orange-500/30 transition-colors whitespace-nowrap flex-shrink-0">
            Ver drop →
          </a>
        </div>
        <DropCountdown />
      </motion.div>

      <OnboardingChecklist walletConnected={!!address} />

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Actividad reciente</p>
          <div className="glass rounded-2xl p-4 border border-slate-700/30">
            <ActivityTimeline />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Gamificación</p>
          <GamificationPanel ommyBalance={address ? 5320 : 0} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Compras en omdomo.com</p>
        <PurchasesPanel />
      </div>
    </div>
  );
}

// ─── Nav drop countdown pill ──────────────────────────────────────────────
function NavDropPill() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0 });
  useEffect(() => {
    const DROP = new Date("2026-06-15T10:00:00Z").getTime();
    function update() {
      const diff = DROP - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000) });
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);
  return (
    <a href="/drops" className="hidden lg:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/15 transition-colors whitespace-nowrap font-medium">
      🔥 <span className="font-mono">{t.d}d {String(t.h).padStart(2,"0")}h</span>
    </a>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bgTheme, setBgTheme] = useState("space");
  const [lightMode, setLightMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [myProfile, setMyProfile] = useState(loadProfile());
  const account = useActiveAccount();
  const address = account?.address;

  useEffect(() => {
    const p = loadProfile();
    setMyProfile(p);
    setBgTheme(p.bgTheme || "space");
    const saved = localStorage.getItem("omdomo-sidebar-collapsed");
    if (saved) setSidebarCollapsed(saved === "true");
    const handler = (e: Event) => {
      const updated = (e as CustomEvent).detail;
      setMyProfile(updated);
      setBgTheme(updated.bgTheme || "space");
    };
    window.addEventListener("omdomo-profile-update", handler);
    return () => window.removeEventListener("omdomo-profile-update", handler);
  }, []);

  function toggleSidebar() {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem("omdomo-sidebar-collapsed", String(next));
  }

  const effectiveTheme = lightMode ? "luz" : bgTheme;
  const theme = BG_THEMES[effectiveTheme] ?? BG_THEMES.space;

  const tabContent: Record<TabId, React.ReactNode> = {
    overview:  <OverviewPanel address={address} />,
    nosotros:  <SobreNosotrosPanel />,
    nft:       <NFTCollectionPanel walletAddress={address} />,
    dapp:      <DAppPanel />,
    perfil:    <ProfilePanel walletAddress={address} onThemeChange={setBgTheme} />,
    social:    <CommunityPanel />,
    finanzas:  <FinanzasPanel address={address} />,
    dao:       <DAOPanel wallet={address} />,
    academy:   <Web3AcademyPanel />,
    share:     <ShareToEarnPanel />,
  };

  // Label map for tab header
  const TAB_LABELS: Record<TabId, string> = {
    overview: "Overview", nosotros: "Sobre Nosotros", nft: "NFTs",
    dapp: "dApp", finanzas: "Finanzas", dao: "DAO", perfil: "Mi Perfil",
    social: "Comunidad", academy: "Web3 Academy", share: "Share & Earn",
  };

  return (
    <div data-mode={lightMode ? "light" : "dark"} className={`min-h-screen text-slate-100 flex flex-col overflow-hidden relative ${theme.bg}`}>
      {/* Fixed animated background */}
      {theme.animatedBg === "space"  && <SpaceBackground />}
      {theme.animatedBg === "clouds" && <CloudsBackground />}
      {theme.animatedBg === "ocean"  && <OceanBackground />}
      {theme.animatedBg === "lava"   && <LavaBackground />}
      {theme.animatedBg === "forest" && <ForestBackground />}
      {theme.animatedBg === "solid"  && <SolidBackground color={theme.solidColor ?? "#09090f"} />}

      <div className="relative z-10 flex flex-col h-screen">

        {/* ── TOP NAV ─────────────────────────────────────────────────── */}
        <nav className="flex-shrink-0 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-xl" style={{ overflow: "visible" }}>
          <div className="max-w-[1700px] mx-auto px-4 flex items-center gap-2" style={{ height: "52px" }}>

            {/* Hamburger — toggle sidebar */}
            <button
              onClick={toggleSidebar}
              className="hidden xl:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all flex-shrink-0"
              title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <NextImage src="/logo-blanco.png" alt="Om Domo" width={28} height={28} className="object-contain" />
              <span className="font-black text-sm gradient-text hidden sm:block">Om Domo</span>
            </a>

            {/* Breadcrumb — desktop */}
            <div className="hidden xl:flex items-center gap-1 text-xs text-slate-600 ml-1">
              <Chevron size={12} />
              <span className="text-slate-400 font-medium">{TAB_LABELS[activeTab]}</span>
            </div>

            {/* Divider */}
            <div className="hidden xl:block w-px h-4 bg-slate-800/60 mx-1" />

            {/* Minimal nav pills — desktop only */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white/8 text-slate-100 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/4"
                  }`}
                >
                  {tab.label}
                  {tab.id === "dao" && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />}
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Drop pill */}
              <NavDropPill />

              {/* Tienda link — minimal text */}
              <a
                href="https://www.omdomo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap px-2 py-1.5"
              >
                <ShoppingBag size={11} className="opacity-70" /> Tienda
              </a>

              {/* Luna / Sol toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setLightMode(!lightMode)}
                title={lightMode ? "Modo oscuro" : "Modo claro"}
                className={`p-1.5 rounded-lg transition-all ${
                  lightMode
                    ? "text-amber-500 hover:bg-amber-100/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                }`}
              >
                {lightMode ? <Sun size={14} /> : <Moon size={14} />}
              </motion.button>

              {/* Notification bell */}
              <NotificationsDropdown />

              {/* Avatar */}
              <button
                onClick={() => setActiveTab("perfil")}
                className={`flex-shrink-0 p-0.5 rounded-xl border-2 transition-all ${activeTab === "perfil" ? "border-purple-500" : "border-slate-700/40 hover:border-purple-500/50"}`}
              >
                <UserAvatar profile={myProfile} size="sm" />
              </button>

              {/* Connect wallet */}
              <div className="scale-90 origin-right">
                <ConnectButton
                  client={client}
                  connectButton={{ label: "Conectar", style: { fontSize: "11px", padding: "5px 12px", borderRadius: "10px" } }}
                />
              </div>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-1.5 rounded-lg border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-slate-800/40 bg-slate-950/90 px-4 py-2.5 flex flex-wrap gap-1.5 overflow-hidden"
              >
                {SIDEBAR_TABS.map((tab) => (
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

        {/* ── MAIN LAYOUT ─────────────────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">

          {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
          <aside
            className="hidden xl:flex flex-col flex-shrink-0 border-r border-white/[0.05] bg-[#0c0c14]/95 backdrop-blur-xl overflow-y-auto overflow-x-hidden"
            style={{ width: sidebarCollapsed ? "64px" : "220px", transition: "width 0.28s ease" }}
          >

            {/* ── WALLET SECTION (top) ─────────────────────────────── */}
            {!sidebarCollapsed ? (
              <div className="border-b border-white/[0.05] p-3 flex-shrink-0">
                <WalletPanel />
              </div>
            ) : (
              /* Collapsed: only avatar + network dot */
              <button
                onClick={() => setActiveTab("perfil")}
                className="flex flex-col items-center gap-1 py-3 border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors w-full"
                title="Mi cuenta"
              >
                <UserAvatar profile={myProfile} size="sm" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </button>
            )}

            {/* ── MAIN NAV (bottom, fills remaining space) ─────────── */}
            <nav className="flex-1 flex flex-col py-2 overflow-hidden">

              {/* Profile row — only when expanded */}
              {!sidebarCollapsed && (
                <button
                  onClick={() => setActiveTab("perfil")}
                  className="flex items-center gap-3 px-3 py-2.5 mb-1 mx-2 rounded-lg hover:bg-white/[0.04] transition-colors group text-left"
                >
                  <UserAvatar profile={myProfile} size="sm" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-slate-200 truncate leading-tight">
                      {myProfile.username || (address ? `${address.slice(0, 6)}…` : "Mi cuenta")}
                    </p>
                    <p className="text-xs text-slate-600 group-hover:text-slate-500 transition-colors">Editar perfil</p>
                  </div>
                </button>
              )}

              {/* Separator */}
              {!sidebarCollapsed && <div className="mx-4 mb-2 border-t border-white/[0.05]" />}

              {/* Primary nav items */}
              <div className={`space-y-0.5 ${sidebarCollapsed ? "px-1.5" : "px-2"}`}>
                {SIDEBAR_TABS.filter((t) => !t.secondary).map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      title={sidebarCollapsed ? tab.label : undefined}
                      className={`relative w-full flex items-center gap-3 rounded-lg font-medium transition-all text-left group text-sm ${
                        sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                      } ${
                        active
                          ? "bg-purple-600/[0.18] text-white"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]"
                      }`}
                    >
                      {!sidebarCollapsed && (
                        <span className={`absolute left-0 w-0.5 h-5 rounded-r-full transition-all ${active ? "bg-purple-400" : "opacity-0"}`} />
                      )}
                      <span className={`transition-colors flex-shrink-0 ${active ? "text-purple-400" : "text-slate-600 group-hover:text-slate-400"}`}>
                        {tab.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 truncate">{tab.label}</span>
                          {tab.id === "dao" && (
                            <span className="w-5 h-5 rounded-full bg-green-500/90 text-white text-xs flex items-center justify-center font-black flex-shrink-0">1</span>
                          )}
                          {tab.id === "academy" && (
                            <span className="text-xs px-1.5 py-px rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 font-semibold flex-shrink-0">NEW</span>
                          )}
                        </>
                      )}
                      {sidebarCollapsed && tab.id === "dao" && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Herramientas separator */}
              {!sidebarCollapsed ? (
                <>
                  <div className="mx-4 my-3 border-t border-white/[0.05]" />
                  <p className="text-xs text-slate-700 uppercase tracking-widest font-semibold px-5 mb-1">Herramientas</p>
                </>
              ) : (
                <div className="my-2 mx-2 border-t border-white/[0.05]" />
              )}

              {/* Secondary items */}
              <div className={`space-y-0.5 ${sidebarCollapsed ? "px-1.5" : "px-2"}`}>
                {SIDEBAR_TABS.filter((t) => t.secondary).map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      title={sidebarCollapsed ? tab.label : undefined}
                      className={`w-full flex items-center gap-3 rounded-lg text-sm transition-all text-left ${
                        sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2"
                      } ${
                        active
                          ? "bg-slate-800/50 text-slate-300"
                          : "text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="flex-shrink-0">{tab.icon}</span>
                      {!sidebarCollapsed && <span className="flex-1 truncate">{tab.label}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Roadmap — expanded only */}
              {!sidebarCollapsed && (
                <>
                  <div className="mx-4 my-3 border-t border-white/[0.05]" />
                  <div className="px-2">
                    <RoadmapPanel />
                  </div>
                </>
              )}

              {/* Collapse toggle — pinned at bottom */}
              <div className="mt-auto pt-3 pb-1">
                <div className={`${sidebarCollapsed ? "px-1.5" : "px-2"}`}>
                  <button
                    onClick={toggleSidebar}
                    className={`w-full flex items-center gap-3 rounded-lg py-2 text-sm text-slate-700 hover:text-slate-400 hover:bg-white/[0.04] transition-all ${
                      sidebarCollapsed ? "justify-center" : "px-3"
                    }`}
                    title={sidebarCollapsed ? "Expandir" : "Colapsar"}
                  >
                    {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
                    {!sidebarCollapsed && <span className="text-xs">Colapsar menú</span>}
                  </button>
                </div>
              </div>
            </nav>
          </aside>

          {/* Center — content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* Tab header */}
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-base font-black text-slate-100">{TAB_LABELS[activeTab]}</h1>
                  <div className="flex items-center gap-2">
                    {activeTab === "nft" && (
                      <a href="/claim" className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-colors">
                        + Mintear NFT
                      </a>
                    )}
                    {activeTab === "overview" && !address && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        Conecta tu wallet
                      </p>
                    )}
                    {activeTab === "overview" && address && (
                      <p className="text-xs text-slate-600 font-mono">{address.slice(0, 8)}…{address.slice(-4)}</p>
                    )}
                  </div>
                </div>

                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Right sidebar */}
          <aside className="hidden 2xl:flex flex-col w-68 flex-shrink-0 border-l border-slate-800/40 bg-slate-950/30 backdrop-blur-sm overflow-y-auto p-3 gap-4" style={{ width: "272px" }}>
            <CryptoPanel />

            <div className="border-t border-slate-800/40" />

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-1">Referidos</p>
              <InviteFriendPanel walletAddress={address} />
            </div>

            <div className="border-t border-slate-800/40" />

            {/* Burn counter */}
            <div className="glass rounded-xl p-3 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={13} className="text-orange-400" />
                <span className="text-xs text-orange-400 font-bold">Burn en vivo</span>
              </div>
              <p className="text-xs text-slate-500">Por compra se queman</p>
              <p className="text-base font-black text-orange-300">500 OMMY COIN</p>
              <p className="text-xs text-slate-600 mt-0.5">+ 2% de rewards</p>
            </div>

            {/* Quick links */}
            <div className="glass rounded-xl p-3 border border-slate-700/30 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Accesos rápidos</p>
              {[
                { label: "Reclamar NFT",      href: "/claim",                     icon: "🎁" },
                { label: "Ver drops",          href: "/drops",                     icon: "🔥" },
                { label: "Comprar ropa",       href: "https://www.omdomo.com",     icon: "🛍", external: true },
                { label: "Discord",            href: "https://discord.gg/xXezFXnpaX", icon: "💬", external: true },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/40 transition-colors group"
                >
                  <span>{l.icon}</span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 flex-1">{l.label}</span>
                  <ChevronRight size={10} className="text-slate-700 group-hover:text-slate-400" />
                </a>
              ))}
            </div>

            {/* Pre-compra CTA */}
            <div className="glass rounded-xl p-4 border border-purple-500/20 text-center space-y-2">
              <p className="text-xs font-bold text-slate-100">Pre-compra OMMY COIN</p>
              <p className="text-xs text-slate-500">Precio: <strong className="text-purple-300">$0.001</strong> · Jun 2026</p>
              <a href="/#precompra" className="block w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                <ShoppingBag size={12} /> Reservar OMMY
              </a>
            </div>

            {/* Web3 Academy promo */}
            <button
              onClick={() => setActiveTab("academy")}
              className="glass rounded-xl p-3 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen size={13} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400">Web3 Academy</span>
                <span className="ml-auto text-xs bg-amber-900/40 border border-amber-500/30 text-amber-400 rounded-full px-1.5 py-0.5 font-bold">+OMMY</span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                Aprende sobre wallets, NFTs y blockchain y gana OMMY por cada lección.
              </p>
            </button>
          </aside>
        </div>

        {/* Social carousel */}
        <div className="flex-shrink-0">
          <SocialCarousel />
        </div>
      </div>
    </div>
  );
}
