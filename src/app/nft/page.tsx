"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Flame, ExternalLink, Gift, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Shared primitives ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Orb({ className }: { className: string }) {
  return (
    <div className={`absolute rounded-full pointer-events-none blur-3xl opacity-[0.07] ${className}`} />
  );
}

// ─── Scroll Carousel ──────────────────────────────────────────────────────────

function ScrollCarousel({
  children,
  cardMinWidth = 280,
  dotColor = "#9333ea",
  darkTheme = true,
}: {
  children: React.ReactNode[];
  cardMinWidth?: number;
  dotColor?: string;
  darkTheme?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const total = children.length;

  const scroll = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const scrollTo = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    const target = cards[i] as HTMLElement;
    if (target) el.scrollTo({ left: target.offsetLeft - 24, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.querySelectorAll("[data-card]")) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIdx(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const btnBase = `absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all
    ${darkTheme ? "bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white" : "bg-white/80 border border-stone-200 text-stone-600 hover:bg-white hover:text-stone-900"}
    backdrop-blur-sm shadow-lg`;

  return (
    <div className="relative">
      {/* Prev */}
      <button onClick={() => scroll(-1)} className={`${btnBase} -left-4 md:-left-6`} aria-label="Anterior">
        <ChevronLeft size={20} />
      </button>
      {/* Next */}
      <button onClick={() => scroll(1)} className={`${btnBase} -right-4 md:-right-6`} aria-label="Siguiente">
        <ChevronRight size={20} />
      </button>

      {/* Track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 px-1"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {children.map((child, i) => (
          <div
            key={i}
            data-card
            style={{ minWidth: `min(${cardMinWidth}px, 82vw)`, scrollSnapAlign: "center", flexShrink: 0 }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Ir a ${i + 1}`}
            style={{
              width: i === activeIdx ? 22 : 7,
              height: 7,
              borderRadius: 4,
              background: i === activeIdx ? dotColor : darkTheme ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
              transition: "width 0.3s, background 0.3s",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RARITY_TIERS = [
  { name: "Genesis",   color: "#FFD700", desc: "Antes de Jun 2026 — rareza máxima", supply: "~200 NFTs",   window: "Ahora mismo" },
  { name: "Founder",   color: "#C0C0C0", desc: "Primer mes post-lanzamiento",        supply: "~500 NFTs",   window: "Jul 2026" },
  { name: "Community", color: "#4FC3F7", desc: "Primeros 3 meses",                   supply: "~2.000 NFTs", window: "Ago–Sep 2026" },
  { name: "Standard",  color: "#81C784", desc: "Resto de la colección",               supply: "Ilimitado",   window: "Siempre" },
];

const NFT_BENEFITS = [
  { icon: "🔑", title: "Acceso DAO",       desc: "Vota en las decisiones del proyecto" },
  { icon: "💎", title: "OMMY rewards",     desc: "10.000 OMMY en el Genesis Drop" },
  { icon: "👕", title: "Certificado",      desc: "Autenticidad de prenda on-chain" },
  { icon: "🚀", title: "Acceso anticipado",desc: "Primero en futuros drops" },
  { icon: "🌙", title: "NFT dinámico",     desc: "Evoluciona con tu actividad (Fase 2)" },
  { icon: "🏛️", title: "Gobernanza",      desc: "Tu NFT = tu voz en la comunidad" },
];

interface NFTType {
  name: string; subtitle: string; rarity: string; rarityColor: string;
  glowColor: string; trigger: string; price: string; rewards: string;
  bonus: string; symbol: string; gradient: string; borderColor: string;
}

const NFT_TYPES: NFTType[] = [
  {
    name: "Om Hoodie Genesis", subtitle: "Edición Fundadora",
    rarity: "Genesis", rarityColor: "#FFD700", glowColor: "rgba(255,215,0,0.25)",
    trigger: "Compra hoodie €89+", price: "€89", rewards: "6.230 OMMY",
    bonus: "+1.000 OMMY al reclamar · NFT 1ª hora",
    symbol: "🧘", gradient: "linear-gradient(135deg,#1a1200,#3d2b00,#1a1200)",
    borderColor: "rgba(255,215,0,0.4)",
  },
  {
    name: "Yogi Jogger", subtitle: "Edición Fundadora",
    rarity: "Founder", rarityColor: "#C0C0C0", glowColor: "rgba(192,192,192,0.2)",
    trigger: "Compra jogger €69+", price: "€69", rewards: "4.830 OMMY",
    bonus: "+1.000 OMMY al reclamar",
    symbol: "🌿", gradient: "linear-gradient(135deg,#0d0d0d,#1e1e1e,#0d0d0d)",
    borderColor: "rgba(192,192,192,0.3)",
  },
  {
    name: "Conscious Tee", subtitle: "Edición Comunidad",
    rarity: "Community", rarityColor: "#4FC3F7", glowColor: "rgba(79,195,247,0.2)",
    trigger: "Compra tee €39+", price: "€39", rewards: "2.730 OMMY",
    bonus: "+1.000 OMMY al reclamar",
    symbol: "☀️", gradient: "linear-gradient(135deg,#001a2e,#002a45,#001a2e)",
    borderColor: "rgba(79,195,247,0.3)",
  },
  {
    name: "Ommie", subtitle: "Acceso Estándar",
    rarity: "Standard", rarityColor: "#81C784", glowColor: "rgba(129,199,132,0.2)",
    trigger: "Cualquier compra", price: "Desde €25", rewards: "1.750 OMMY",
    bonus: "+1.000 OMMY al reclamar",
    symbol: "🕉️", gradient: "linear-gradient(135deg,#001a00,#002a00,#001a00)",
    borderColor: "rgba(129,199,132,0.3)",
  },
];

const GUARDIANS = [
  { id: 1, name: "El Silencio", archetype: "Meditación",    emoji: "🌑", color: "#9B59B6" },
  { id: 2, name: "La Llama",    archetype: "Fuego interior", emoji: "🔥", color: "#E74C3C" },
  { id: 3, name: "El Agua",     archetype: "Fluidez",        emoji: "💧", color: "#3498DB" },
  { id: 4, name: "La Tierra",   archetype: "Arraigo",        emoji: "🌿", color: "#27AE60" },
  { id: 5, name: "El Viento",   archetype: "Libertad",       emoji: "🌬️", color: "#F39C12" },
  { id: 6, name: "La Luz",      archetype: "Consciencia",    emoji: "✨", color: "#F1C40F" },
];

// ─── Holographic NFT card ─────────────────────────────────────────────────────

function HolographicCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = cardRef.current!.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    setRotate({ x: ((y - r.height / 2) / (r.height / 2)) * -12, y: ((x - r.width / 2) / (r.width / 2)) * 12 });
    setGlowPos({ x: (x / r.width) * 100, y: (y / r.height) * 100 });
  }

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setRotate({ x: 0, y: 0 }); setHovered(false); }}
      style={{ perspective: "900px", cursor: "pointer" }} className="w-64 mx-auto select-none">
      <motion.div animate={{ rotateX: rotate.x, rotateY: rotate.y, scale: hovered ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d", borderRadius: "20px", position: "relative" }}>
        <div style={{ borderRadius: "20px", background: "linear-gradient(135deg,#1a0533,#0c1a2e,#0a0c1a)", border: "1px solid rgba(147,51,234,0.4)", overflow: "hidden", boxShadow: hovered ? "0 30px 80px rgba(147,51,234,0.35),0 0 40px rgba(245,158,11,0.15)" : "0 10px 40px rgba(0,0,0,0.5)", transition: "box-shadow 0.3s" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%,rgba(255,255,255,0.12) 0%,transparent 60%),linear-gradient(105deg,transparent 20%,rgba(245,158,11,0.08) 40%,rgba(147,51,234,0.1) 60%,transparent 80%)`, pointerEvents: "none", zIndex: 10, borderRadius: "20px" }} />
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Om Domo</span>
            <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: "linear-gradient(90deg,#f59e0b,#d97706)", color: "#000", letterSpacing: "0.08em" }}>GENESIS</span>
          </div>
          <div style={{ height: "180px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#1a0533,#060308)" }}>
            {[0, 1, 2].map((i) => (
              <motion.div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: `${80 + i * 50}px`, height: `${80 + i * 50}px`, borderRadius: "50%", border: `1px solid rgba(${i === 0 ? "245,158,11" : i === 1 ? "147,51,234" : "8,145,178"},${0.6 - i * 0.15})`, transform: "translate(-50%,-50%)" }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }} transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }} />
            ))}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "48px" }}>
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ display: "block" }}>🕉️</motion.span>
            </div>
          </div>
          <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>Om Domo Genesis #001</div>
              <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>Avalanche · ERC-1155</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#94a3b8" }}>Reward</div>
              <div style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(90deg,#9333ea,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>+10K OMMY</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── NFT Type Card ────────────────────────────────────────────────────────────

function NFTTypeCard({ nft, index }: { nft: NFTType; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: nft.gradient, border: `1px solid ${hovered ? nft.rarityColor : nft.borderColor}`, borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden", transition: "border-color 0.3s,box-shadow 0.3s", boxShadow: hovered ? `0 0 32px ${nft.glowColor},0 8px 32px rgba(0,0,0,0.4)` : "0 4px 16px rgba(0,0,0,0.3)" }}>
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.4 }}
        style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%,${nft.glowColor},transparent 70%)`, pointerEvents: "none" }} />

      {/* Rarity badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${nft.rarityColor}22`, border: `1px solid ${nft.rarityColor}66`, borderRadius: 20, padding: "3px 10px", marginBottom: 16 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: nft.rarityColor, boxShadow: `0 0 6px ${nft.rarityColor}` }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: nft.rarityColor, textTransform: "uppercase" }}>{nft.rarity}</span>
      </div>

      {/* Symbol + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <motion.div animate={{ scale: hovered ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 300 }} style={{ fontSize: 36, lineHeight: 1 }}>{nft.symbol}</motion.div>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f5f0e8", marginBottom: 2, lineHeight: 1.2 }}>{nft.name}</h3>
          <p style={{ fontSize: 12, color: "var(--dark-muted)", fontStyle: "italic" }}>{nft.subtitle}</p>
        </div>
      </div>

      <div style={{ height: 1, background: `linear-gradient(90deg,${nft.rarityColor}44,transparent)`, margin: "16px 0" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--dark-muted)" }}>Trigger</span>
          <span style={{ fontSize: 13, color: "#f5f0e8", fontWeight: 500 }}>{nft.trigger}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--dark-muted)" }}>OMMY rewards</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: nft.rarityColor }}>{nft.rewards}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--dark-muted)", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 10px", borderLeft: `2px solid ${nft.rarityColor}66` }}>{nft.bonus}</div>
      </div>

      <div style={{ position: "absolute", top: 20, right: 20, fontSize: 13, fontWeight: 800, color: nft.rarityColor, background: `${nft.rarityColor}18`, border: `1px solid ${nft.rarityColor}44`, borderRadius: 8, padding: "4px 10px" }}>{nft.price}</div>
    </motion.div>
  );
}

// ─── Guardian Card ────────────────────────────────────────────────────────────

function GuardianCard({ g, index }: { g: typeof GUARDIANS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "3/4", cursor: "pointer", border: `1px solid ${hovered ? g.color + "88" : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.4s,box-shadow 0.4s", boxShadow: hovered ? `0 0 40px ${g.color}44,0 8px 32px rgba(0,0,0,0.5)` : "0 4px 16px rgba(0,0,0,0.4)" }}>
      <motion.div animate={{ opacity: hovered ? 1 : 0.15 }} transition={{ duration: 0.5 }}
        style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%,${g.color}55,${g.color}11 50%,#0c0906)` }} />

      {/* Locked overlay */}
      <motion.div animate={{ opacity: hovered ? 0 : 1 }} transition={{ duration: 0.4 }}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, background: "rgba(12,9,6,0.6)", backdropFilter: "blur(12px)" }}>
        <div style={{ fontSize: 28, opacity: 0.5 }}>🔒</div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Jun 2026</p>
      </motion.div>

      {/* Revealed content */}
      <motion.div animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }} transition={{ duration: 0.4 }}
        style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <motion.div animate={{ scale: hovered ? 1 : 0.8 }} transition={{ type: "spring", stiffness: 200 }} style={{ fontSize: 52, marginBottom: 16 }}>{g.emoji}</motion.div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f5f0e8", textAlign: "center", marginBottom: 6 }}>{g.name}</h3>
        <p style={{ fontSize: 12, color: g.color, textAlign: "center", fontStyle: "italic" }}>{g.archetype}</p>
      </motion.div>

      <div style={{ position: "absolute", top: 12, left: 14, fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 700 }}>#{String(g.id).padStart(2, "0")}</div>
      <div style={{ position: "absolute", top: 12, right: 14, width: 8, height: 8, borderRadius: "50%", background: g.color, boxShadow: `0 0 8px ${g.color}`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }} />
    </motion.div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2026-06-01T00:00:00Z").getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {[["días", t.d], ["horas", t.h], ["min", t.m], ["seg", t.s]].map(([label, val]) => (
        <div key={label as string} className="glass rounded-xl p-3 text-center border border-slate-700/40 min-w-[70px]">
          <p className="text-2xl font-bold font-mono gradient-text">{String(val).padStart(2, "0")}</p>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main NFT Page ────────────────────────────────────────────────────────────

export default function NFTPage() {
  return (
    <div className="min-h-screen section-dark overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-white flex items-center justify-center">
              <Image src="/logo-negro.png" alt="Om Domo" width={32} height={32} className="object-contain w-full h-full" />
            </div>
            <span className="font-bold text-sm gradient-text tracking-wide">Om Domo</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/drops" className="text-xs px-4 py-2 rounded-xl border border-orange-500/30 text-orange-300 hover:bg-orange-900/20 transition-all">
              🔥 Drops
            </a>
            <a href="/claim" className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold hover:opacity-90 transition-opacity">
              Reclamar NFT
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden" style={{ background: "#060308" }}>
        <Orb className="w-[600px] h-[600px] bg-purple-700 -top-40 left-1/2 -translate-x-1/2" />
        <Orb className="w-[400px] h-[400px] bg-amber-600 bottom-0 right-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-xs text-amber-500 uppercase tracking-widest font-medium">Colección NFT · Avalanche</span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mt-3 mb-6 leading-tight">
              Cada compra,<br />un <span className="gradient-text-gold">NFT único</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto text-slate-400 leading-relaxed mb-8">
              Compra ropa Om Domo en omdomo.com y recibe automáticamente tu NFT de autenticidad en Avalanche.
              Cuanto antes entres, mayor rareza — los primeros siempre serán los más valiosos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://omdomo.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#000" }}>
                <ShoppingBag size={16} /> Comprar y conseguir mi NFT Genesis
              </a>
              <a href="/claim" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm border border-white/10 text-slate-200">
                <Gift size={16} /> Ya compré — Reclamar NFT
              </a>
            </div>
            <p className="text-xs mt-4 text-slate-600">NFT automático · Sin gas para el cliente · Red Avalanche</p>
          </FadeIn>

          {/* HolographicCard + benefits */}
          <div className="grid md:grid-cols-2 gap-16 items-center mt-12">
            <FadeIn delay={0.1}>
              <div className="relative">
                <HolographicCard />
                <motion.p className="text-center text-xs mt-6 text-slate-600"
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                  ✦ Mueve el cursor sobre la carta
                </motion.p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {NFT_BENEFITS.map((b, i) => (
                  <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.03 }}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{b.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{b.desc}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── SISTEMA DE RAREZA ── */}
      <section className="section-dark py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-12">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Sistema de rareza</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 mb-3" style={{ color: "var(--dark-text)" }}>
              Cuanto antes compres, <span className="gradient-text">mayor rareza</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">Las ventanas de rareza se cierran definitivamente. Una vez pasada, esa rareza no vuelve.</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RARITY_TIERS.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${tier.color}40`, borderRadius: 16, padding: "24px 16px", textAlign: "center", boxShadow: i === 0 ? `0 0 32px ${tier.color}33` : "none", position: "relative" }}>
                {i === 0 && (
                  <div style={{ position: "absolute", top: 10, right: 10, fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 10, background: tier.color, color: "#000" }}>AHORA</div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: "50%", margin: "0 auto 14px", background: `${tier.color}20`, border: `2px solid ${tier.color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${tier.color}55` }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: tier.color }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: tier.color, marginBottom: 4 }}>{tier.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, lineHeight: 1.3 }}>{tier.desc}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{tier.supply}</div>
                <div style={{ fontSize: 10, color: tier.color, marginTop: 6, fontWeight: 600 }}>{tier.window}</div>
              </motion.div>
            ))}
          </div>
          {/* Gradient bar */}
          <div style={{ marginTop: 28, height: 6, borderRadius: 3, background: "linear-gradient(90deg,#FFD700,#C0C0C0 33%,#4FC3F7 66%,#81C784)", boxShadow: "0 0 14px rgba(255,215,0,0.3)" }} />
          <p style={{ fontSize: 11, color: "#8B7355", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>← Más raro · Más común →</p>
        </div>
      </section>

      {/* ── 4 TIPOS DE NFT ── */}
      <section className="section-cream py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(180,160,120,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(180,160,120,0.06) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: 12 }}>Colección Om Domo</span>
            <h2 className="gradient-text-gold" style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
              4 Tipos de NFT
            </h2>
            <p style={{ fontSize: 18, color: "#5a4a3a", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
              Cada prenda que compras en omdomo.com genera un NFT único en Avalanche. La rareza depende de cuándo compras.
            </p>
          </FadeIn>
          <div className="mb-10">
            <ScrollCarousel cardMinWidth={280} dotColor="#c9973a" darkTheme={false}>
              {NFT_TYPES.map((nft, i) => <NFTTypeCard key={nft.rarity} nft={nft} index={i} />)}
            </ScrollCarousel>
          </div>
          <FadeIn className="text-center">
            <a href="https://omdomo.com" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#8B7355,#6B5B45)", color: "#f5f0e8", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(139,115,85,0.3)" }}>
              <ShoppingBag size={18} /> Compra y consigue tu NFT Genesis
            </a>
            <p style={{ fontSize: 12, color: "#8B7355", marginTop: 12, fontStyle: "italic" }}>Disponible antes del lanzamiento oficial · Máxima rareza garantizada</p>
          </FadeIn>
        </div>
      </section>

      {/* ── GUARDIANES DE LA CONCIENCIA ── */}
      <section className="section-dark py-20 px-6 relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-purple-900 top-0 right-0" />
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", width: 1, height: 1, borderRadius: "50%", background: "white", top: `${(i * 7.3) % 100}%`, left: `${(i * 13.7) % 100}%`, opacity: 0.3 + (i % 4) * 0.1 }} />
          ))}
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn className="text-center mb-6">
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--dark-muted)", marginBottom: 12 }}>Colección Artística · Junio 2026</span>
            <h2 className="gradient-text" style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
              Guardians of Consciousness
            </h2>
            <p style={{ fontSize: 17, color: "var(--dark-muted)", maxWidth: 520, margin: "0 auto 8px", lineHeight: 1.65 }}>
              6 arquetipos de consciencia, generados con AI y sagrados a mano. Cada Guardian representa un estado del ser — edición de 111 unidades.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Pasa el cursor para un preview exclusivo</p>
          </FadeIn>

          <div className="mb-12">
            <ScrollCarousel cardMinWidth={200} dotColor="#9333ea" darkTheme={true}>
              {GUARDIANS.map((g, i) => (
                <div key={g.id} style={{ aspectRatio: "3/4", minHeight: 280 }}>
                  <GuardianCard g={g} index={i} />
                </div>
              ))}
            </ScrollCarousel>
          </div>

          <FadeIn>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--dark-muted)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.12em" }}>Lanzamiento oficial en</p>
              <div style={{ marginBottom: 28 }}><Countdown /></div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://discord.gg/xXezFXnpaX" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, background: "linear-gradient(135deg,#5865F2,#4752C4)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 20px rgba(88,101,242,0.4)" }}>
                  💬 Lista de espera Discord
                </a>
                <a href="/drops"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, background: "transparent", color: "#f5f0e8", fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Flame size={16} /> Ver todos los Drops
                </a>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 16, fontStyle: "italic" }}>111 unidades · Holders Genesis tienen acceso prioritario · Avalanche Mainnet</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="section-dark border-t border-slate-800/40 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-white flex items-center justify-center">
              <Image src="/logo-negro.png" alt="Om Domo" width={24} height={24} className="object-contain" />
            </div>
            <span>Om Domo Web3 · Spiritual Lifestyle Ecosystem</span>
          </div>
          <div className="flex gap-4">
            <a href="/" className="hover:text-slate-300 transition-colors">← Inicio</a>
            <a href="/drops" className="hover:text-slate-300 transition-colors">Drops</a>
            <a href="/claim" className="hover:text-slate-300 transition-colors">Reclamar NFT</a>
            <a href="https://omdomo.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              Tienda <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
