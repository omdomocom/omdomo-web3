"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Flame,
  Coins,
  Users,
  ChevronDown,
  ExternalLink,
  Play,
  Zap,
  Heart,
  Globe,
  ShoppingBag,
  Gift,
  TrendingUp,
  Lock,
  Unlock,
  Star,
} from "lucide-react";

// ─── Social links ─────────────────────────────────────────────────────────────
const SOCIALS = [
  { label: "Instagram",  href: "https://www.instagram.com/om.domo/",            icon: "IG",  color: "from-pink-500 to-orange-500" },
  { label: "TikTok",     href: "https://www.tiktok.com/@omdomo.com",             icon: "TT",  color: "from-slate-200 to-slate-400" },
  { label: "X / Twitter",href: "https://twitter.com/omdomocom",                  icon: "X",   color: "from-slate-100 to-slate-300" },
  { label: "YouTube",    href: "https://www.youtube.com/@omdomocom",             icon: "YT",  color: "from-red-500 to-red-700" },
  { label: "Facebook",   href: "https://www.facebook.com/omdomocom",             icon: "FB",  color: "from-blue-500 to-blue-700" },
  { label: "LinkedIn",   href: "https://www.linkedin.com/company/omdomo",        icon: "LI",  color: "from-blue-400 to-cyan-500" },
  { label: "Pinterest",  href: "https://www.pinterest.es/omdomocom",             icon: "PI",  color: "from-red-400 to-pink-500" },
  { label: "Tienda",     href: "https://www.omdomo.com",                         icon: "🛍",  color: "from-purple-500 to-cyan-500" },
];

// ─── Countdown hook ───────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-06-15T18:00:00Z");

function useCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

// ─── Section fade-in ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Orb background ─────────────────────────────────────────────────────────
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function LandingPage() {
  const countdown = useCountdown();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function submitWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistDone(true);
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 overflow-x-hidden">

      {/* ── NAV ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-black text-sm">
              O
            </div>
            <span className="font-bold text-sm gradient-text tracking-wide">Om Domo</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#como-funciona" className="hover:text-slate-100 transition-colors">Cómo funciona</a>
            <a href="#token" className="hover:text-slate-100 transition-colors">Token</a>
            <a href="#comunidad" className="hover:text-slate-100 transition-colors">Comunidad</a>
            <a href="/drops" className="hover:text-orange-300 text-orange-400 transition-colors font-medium">🔥 Drops</a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/claim"
              className="hidden md:flex text-xs px-4 py-2 rounded-xl border border-purple-500/40 text-purple-300 hover:bg-purple-900/20 transition-all"
            >
              Reclamar NFT
            </a>
            <a
              href="#waitlist"
              className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold hover:opacity-90 transition-opacity"
            >
              Unirme
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background orbs */}
        <Orb className="w-[600px] h-[600px] bg-purple-600 -top-40 -left-40" />
        <Orb className="w-[500px] h-[500px] bg-cyan-600 -bottom-20 -right-20" />
        <Orb className="w-[300px] h-[300px] bg-pink-600 top-1/3 left-1/2 -translate-x-1/2" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-900/20 text-purple-300 text-xs font-medium mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"
            />
            Testnet Fuji activa — Prueba gratis ahora
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black leading-none mb-6"
          >
            <span className="gradient-text">Spiritual</span>
            <br />
            <span className="text-slate-100">Web3 Lifestyle</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Compra ropa consciente. Gana NFTs y OMMY Coin. Forma parte de una
            comunidad que une <span className="text-purple-300">moda</span>,{" "}
            <span className="text-cyan-300">Web3</span> y{" "}
            <span className="text-pink-300">vida consciente</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          >
            <a
              href="https://www.omdomo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/40"
            >
              <ShoppingBag size={16} /> Comprar en omdomo.com
            </a>
            <a
              href="/claim"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-600 text-slate-300 font-semibold text-sm hover:border-purple-500/60 hover:text-white transition-all"
            >
              <Gift size={16} /> Reclamar mi NFT Fuji
            </a>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
          >
            <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest">
              Lanzamiento oficial Ommy Coin
            </p>
            <div className="flex items-center justify-center gap-3">
              {[
                { label: "días",    val: countdown.days },
                { label: "horas",   val: countdown.hours },
                { label: "min",     val: countdown.minutes },
                { label: "seg",     val: countdown.seconds },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="glass rounded-2xl px-4 py-3 text-center border border-slate-700/50 min-w-[64px]">
                    <AnimatePresence mode="popLayout">
                      <motion.p
                        key={item.val}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl font-black font-mono gradient-text tabular-nums"
                      >
                        {String(item.val).padStart(2, "0")}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                  </div>
                  {i < 3 && <span className="text-slate-600 font-bold text-xl">:</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-slate-600" />
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <FadeIn>
        <section className="border-y border-slate-800/40 glass py-6">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Supply inicial",   value: 29979,  suffix: "M OMMY",  icon: <Coins size={14} /> },
              { label: "Precio lanzamiento",value: 0.001, suffix: "USD",     icon: <TrendingUp size={14} />, isFloat: true },
              { label: "Burn objetivo",    value: 90,     suffix: "% supply", icon: <Flame size={14} /> },
              { label: "Mercado Europa",   value: 104,    suffix: "K usuarios",icon: <Users size={14} /> },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                  {stat.icon} {stat.label}
                </div>
                <p className="text-2xl font-black gradient-text">
                  {stat.isFloat
                    ? `$${stat.value}`
                    : <><AnimatedNumber value={stat.value} />{stat.suffix}</>
                  }
                  {!stat.isFloat && null}
                </p>
                {stat.isFloat && (
                  <p className="text-xs text-slate-500">{stat.suffix}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-xs text-purple-400 uppercase tracking-widest font-medium">El ecosistema</span>
            <h2 className="text-4xl font-black mt-3 mb-4">
              Compra. Gana. <span className="gradient-text">Pertenece.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Cada prenda de omdomo.com activa una recompensa real en la blockchain de Avalanche.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: <ShoppingBag size={24} />,
                title: "Compra en omdomo.com",
                desc: "Elige tu prenda favorita. Cada compra activa automáticamente una recompensa Web3 ligada a tu pedido.",
                color: "from-purple-500 to-pink-500",
                tag: "Shopify + Avalanche",
              },
              {
                step: "02",
                icon: <Gift size={24} />,
                title: "Reclama tu NFT + OMMY",
                desc: "Conecta tu wallet en /claim, mintea el NFT de tu diseño y recibe miles de OMMY Coin en tu wallet.",
                color: "from-cyan-500 to-blue-500",
                tag: "NFT + Token reward",
              },
              {
                step: "03",
                icon: <Users size={24} />,
                title: "Accede a la comunidad",
                desc: "Tu NFT te abre las puertas a una comunidad exclusiva, votes en la DAO y acceso anticipado a drops.",
                color: "from-green-500 to-emerald-500",
                tag: "DAO + Discord + Drops",
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15}>
                <div className="glass rounded-2xl p-6 border border-slate-800/60 hover:border-slate-700/60 transition-all h-full group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="text-4xl font-black text-slate-800 font-mono">{item.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">{item.tag}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── REWARDS TABLE ────────────────────────────────────────────── */}
      <FadeIn>
        <section className="py-16 px-6 bg-slate-900/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Gamificación</span>
              <h2 className="text-3xl font-black mt-3">Cada acción vale <span className="gradient-text">OMMY</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { action: "Compra física",       reward: "5,000+ OMMY",  icon: <ShoppingBag size={14} />, hot: true },
                { action: "Compartir en Twitter", reward: "+500 OMMY",   icon: <Globe size={14} /> },
                { action: "Referir un amigo",     reward: "+2,000 OMMY", icon: <Users size={14} /> },
                { action: "Drop limitado (1ª h)", reward: "+10,000 OMMY",icon: <Flame size={14} />, hot: true },
                { action: "Staking de NFT/día",   reward: "+50 OMMY",    icon: <Zap size={14} /> },
                { action: "Meditación 20 min",    reward: "+50 OMMY",    icon: <Heart size={14} /> },
                { action: "Running 5km",          reward: "+250 OMMY",   icon: <Zap size={14} /> },
                { action: "Votación DAO",         reward: "+200 OMMY",   icon: <Star size={14} /> },
                { action: "Evento Om Domo",       reward: "+3,000 OMMY", icon: <Globe size={14} />, hot: true },
              ].map((r) => (
                <motion.div
                  key={r.action}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    r.hot
                      ? "border-purple-500/30 bg-purple-900/10"
                      : "border-slate-800/40 hover:border-slate-700/40"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    r.hot ? "bg-purple-500/20 text-purple-300" : "bg-slate-800 text-slate-400"
                  }`}>
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{r.action}</p>
                    <p className={`text-xs font-bold ${r.hot ? "gradient-text" : "text-slate-400"}`}>{r.reward}</p>
                  </div>
                  {r.hot && <Flame size={12} className="text-orange-400 flex-shrink-0" />}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── TOKEN ────────────────────────────────────────────────────── */}
      <section id="token" className="py-24 px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-purple-600 top-0 right-0" />

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-xs text-orange-400 uppercase tracking-widest font-medium">Tokenomics</span>
            <h2 className="text-4xl font-black mt-3 mb-4">
              Ommy Coin — <span className="gradient-text">Deflacionario</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Cada compra quema tokens. Menos supply + más usuarios = precio sube.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Burn visual */}
            <FadeIn delay={0.1}>
              <div className="glass rounded-2xl p-6 border border-orange-500/20 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-sm font-bold text-orange-300">Mecanismo de quema</span>
                </div>
                {[
                  { trigger: "Cada compra física",      burn: "500 OMMY",     pct: 40 },
                  { trigger: "Transacción on-chain",    burn: "2% automático", pct: 60 },
                  { trigger: "Evento drop limitado",    burn: "5M OMMY",       pct: 100 },
                  { trigger: "Share social verificado", burn: "50 OMMY",       pct: 20 },
                ].map((item) => (
                  <div key={item.trigger}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">{item.trigger}</span>
                      <span className="text-orange-300 font-mono font-bold">{item.burn}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Price projection */}
            <FadeIn delay={0.2}>
              <div className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-300">Proyección de precio</span>
                </div>
                {[
                  { year: "Jun 2026", price: "$0.001", users: "2K",    pct: 5,   now: true },
                  { year: "2027",     price: "$0.010", users: "12K",   pct: 30 },
                  { year: "2028",     price: "$0.035", users: "55K",   pct: 55 },
                  { year: "2029",     price: "$0.100", users: "200K",  pct: 80 },
                  { year: "2030",     price: "$0.250", users: "400K+", pct: 100 },
                ].map((item) => (
                  <div key={item.year} className={`flex items-center gap-3 ${item.now ? "opacity-100" : "opacity-70"}`}>
                    <span className={`text-xs font-mono w-16 flex-shrink-0 ${item.now ? "text-purple-300 font-bold" : "text-slate-500"}`}>
                      {item.year}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className={`h-full rounded-full ${item.now ? "bg-gradient-to-r from-purple-500 to-cyan-500" : "bg-slate-600"}`}
                      />
                    </div>
                    <span className={`text-xs font-bold w-14 text-right flex-shrink-0 ${item.now ? "gradient-text" : "text-slate-400"}`}>
                      {item.price}
                    </span>
                    <span className="text-xs text-slate-600 w-12 text-right">{item.users}</span>
                  </div>
                ))}
                <p className="text-xs text-slate-600 mt-2">* Proyección basada en usuarios activos y burn rate</p>
              </div>
            </FadeIn>
          </div>

          {/* Wallet distribution */}
          <FadeIn delay={0.3} className="mt-8">
            <div className="glass rounded-2xl p-6 border border-slate-800/60">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Distribución del supply</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Ecosistema & Rewards", pct: 35, color: "from-purple-500 to-pink-500" },
                  { label: "Quema programada",     pct: 25, color: "from-orange-500 to-red-500" },
                  { label: "Liquidez DEX",          pct: 15, color: "from-cyan-500 to-blue-500" },
                  { label: "Equipo (4yr vesting)",  pct: 10, color: "from-green-500 to-emerald-500" },
                  { label: "Marketing",             pct:  7, color: "from-yellow-500 to-orange-400" },
                  { label: "DAO Treasury",          pct:  5, color: "from-indigo-500 to-purple-500" },
                  { label: "Reserva drops",         pct:  3, color: "from-pink-500 to-rose-500" },
                ].map((w) => (
                  <div key={w.label} className="text-center">
                    <div className={`text-xl font-black bg-gradient-to-r ${w.color} bg-clip-text text-transparent`}>
                      {w.pct}%
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight">{w.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TESTNET FUJI ─────────────────────────────────────────────── */}
      <FadeIn>
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-8 border border-green-500/20 relative overflow-hidden">
              <Orb className="w-64 h-64 bg-green-500 -right-20 -top-20" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-green-400"
                  />
                  <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
                    Testnet Fuji activa — Sin coste
                  </span>
                </div>
                <h2 className="text-2xl font-black mb-3">
                  Prueba el sistema <span className="text-green-400">antes del lanzamiento</span>
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  La red de prueba Fuji está activa ahora mismo. Compra en omdomo.com,
                  reclama tu NFT gratis y familiarízate con las wallets crypto antes
                  del lanzamiento oficial en Junio 2026.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: <Unlock size={14} />, label: "NFT gratis en testnet" },
                    { icon: <Coins size={14} />,  label: "OMMY de prueba" },
                    { icon: <Users size={14} />,  label: "Acceso comunidad" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="text-green-400">{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.omdomo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    <ShoppingBag size={15} /> Comprar en omdomo.com
                  </a>
                  <a
                    href="/claim"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-green-500/30 text-green-300 font-semibold text-sm hover:bg-green-900/20 transition-all"
                  >
                    <Gift size={15} /> Reclamar NFT Fuji
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── COMUNIDAD + RRSS ─────────────────────────────────────────── */}
      <section id="comunidad" className="py-24 px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-cyan-600 -bottom-40 -left-20" />

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Comunidad</span>
            <h2 className="text-4xl font-black mt-3 mb-4">
              Únete. <span className="gradient-text">Crece. Gana.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Síguenos para no perderte drops, premios, guías de wallet,
              avances del proyecto y acceso anticipado.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {SOCIALS.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.06}>
                <motion.a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="glass rounded-xl p-4 border border-slate-800/60 hover:border-slate-600/60 transition-all flex flex-col items-center gap-2 text-center group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center font-bold text-sm text-white group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                    {s.label}
                  </span>
                  <ExternalLink size={10} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
                </motion.a>
              </FadeIn>
            ))}
          </div>

          {/* Community benefits */}
          <FadeIn delay={0.3}>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "🎁",
                  title: "Drops exclusivos",
                  desc: "Los seguidores reciben avisos 24h antes. Los holders NFT tienen acceso prioritario.",
                },
                {
                  icon: "🎓",
                  title: "Guías y cursos",
                  desc: "Aprende a usar wallets, entender Web3 y sacar el máximo a tus OMMY desde cero.",
                },
                {
                  icon: "🏆",
                  title: "Premios y torneos",
                  desc: "Retos de meditación, running y creatividad con OMMY y NFTs como recompensa.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  className="glass rounded-xl p-5 border border-slate-800/60 text-center"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-sm font-bold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── WAITLIST ─────────────────────────────────────────────────── */}
      <section id="waitlist" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <div className="glass rounded-3xl p-10 border border-purple-500/20 relative overflow-hidden">
              <Orb className="w-64 h-64 bg-purple-600 -top-20 left-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-3xl font-black mb-3">
                  Acceso <span className="gradient-text">anticipado</span>
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Entra en la lista de espera. Serás de los primeros en comprar OMMY
                  al precio de lanzamiento y recibir el drop Genesis con máxima rareza.
                </p>

                <div className="flex items-center gap-3 justify-center flex-wrap mb-6">
                  {[
                    "NFT Genesis (rareza máxima)",
                    "Precio lanzamiento $0.001",
                    "+1,000 OMMY bonus",
                  ].map((b) => (
                    <span key={b} className="text-xs px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/20 text-purple-300">
                      ✓ {b}
                    </span>
                  ))}
                </div>

                {waitlistDone ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-3 py-4"
                  >
                    <div className="text-5xl">🎉</div>
                    <p className="text-green-400 font-bold">¡Estás en la lista!</p>
                    <p className="text-slate-500 text-sm">
                      Te avisaremos 48h antes del lanzamiento con instrucciones para comprar.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={submitWaitlist} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="flex-1 glass rounded-xl px-5 py-4 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/60 focus:outline-none"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-purple-900/30"
                    >
                      Unirme →
                    </motion.button>
                  </form>
                )}
                <p className="text-xs text-slate-600 mt-4">
                  Sin spam. Solo novedades importantes del proyecto.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/40 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-black text-sm">
                O
              </div>
              <div>
                <p className="font-bold text-sm gradient-text">Om Domo</p>
                <p className="text-xs text-slate-600">Spiritual Web3 Lifestyle</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <a href="/claim" className="text-slate-500 hover:text-slate-300 transition-colors">Reclamar NFT</a>
              <a href="/drops" className="text-orange-500 hover:text-orange-300 transition-colors">Drops</a>
              <a href="/dashboard" className="text-slate-600 hover:text-slate-400 transition-colors">Dashboard</a>
            </div>
          </div>

          <div className="border-t border-slate-800/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
            <span>© 2026 Om Domo. Todos los derechos reservados.</span>
            <span>
              Token: OMMY · Avalanche · Contract:{" "}
              <a
                href="https://snowtrace.io/token/0x70EdA9Bb95eeE2551261c37720933905f9425596"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-slate-500 transition-colors"
              >
                0x70Ed...5596
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
