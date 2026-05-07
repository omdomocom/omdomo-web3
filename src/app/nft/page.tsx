"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Flame, ExternalLink, Gift, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { SpaceBackground } from "@/components/SpaceBackground";

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

// ─── Crystal Sphere ───────────────────────────────────────────────────────────

interface CrystalSphereProps {
  color: string;
  size?: number;
  children?: React.ReactNode;
  glowIntensity?: "low" | "medium" | "high";
  frosted?: boolean;
  animated?: boolean;
  sweepDelay?: number;
}

function CrystalSphere({ color, size = 140, children, glowIntensity = "medium", frosted = false, animated = false, sweepDelay = 0 }: CrystalSphereProps) {
  const glowPx = glowIntensity === "high" ? size * 0.45 : glowIntensity === "medium" ? size * 0.28 : size * 0.16;

  const sphereBackground = frosted
    ? `radial-gradient(circle at 34% 26%, rgba(200,225,255,0.78) 0%, rgba(160,195,255,0.35) 9%, transparent 28%),
       radial-gradient(circle at 66% 70%, rgba(180,210,255,0.18) 0%, transparent 22%),
       radial-gradient(circle at 50% 50%, rgba(140,170,240,0.38) 0%, rgba(90,120,200,0.18) 38%, rgba(20,28,80,0.88) 72%)`
    : `radial-gradient(circle at 32% 27%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.38) 7%, transparent 22%),
       radial-gradient(circle at 67% 71%, rgba(255,255,255,0.20) 0%, transparent 17%),
       radial-gradient(circle at 50% 50%, ${color}dd 0%, ${color}88 22%, ${color}33 48%, rgba(6,4,2,0.93) 74%)`;

  const sphereShadow = frosted
    ? `inset -10px -10px 30px rgba(0,0,0,0.38),
       inset 5px 5px 22px rgba(150,185,255,0.22),
       0 0 ${glowPx}px rgba(140,170,255,0.32),
       0 ${size * 0.13}px ${size * 0.36}px rgba(0,0,0,0.65)`
    : `inset -${size * 0.09}px -${size * 0.09}px ${size * 0.26}px rgba(0,0,0,0.55),
       inset ${size * 0.04}px ${size * 0.04}px ${size * 0.18}px rgba(255,255,255,0.11),
       0 0 ${glowPx}px ${color}70,
       0 ${size * 0.13}px ${size * 0.42}px rgba(0,0,0,0.72)`;

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto", flexShrink: 0 }}>
      {/* Ambient outer glow */}
      <div style={{
        position: "absolute",
        inset: `-${size * 0.12}px`,
        borderRadius: "50%",
        background: frosted
          ? `radial-gradient(circle, rgba(150,185,255,0.22) 0%, transparent 70%)`
          : `radial-gradient(circle, ${color}38 0%, transparent 68%)`,
        filter: `blur(${glowPx * 0.55}px)`,
        pointerEvents: "none",
        animation: animated ? "spherePulse 3s ease-in-out infinite" : undefined,
      }} />

      {/* Main glass sphere */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        position: "relative", overflow: "hidden",
        background: sphereBackground,
        boxShadow: sphereShadow,
      }}>
        {/* Refraction shimmer */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "linear-gradient(128deg, transparent 0%, rgba(255,255,255,0.07) 32%, transparent 52%, rgba(255,255,255,0.04) 72%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Periodic light sweep — luz pasando por el cristal */}
        <div style={{
          position: "absolute",
          top: "-15%",
          left: 0,
          width: "38%",
          height: "130%",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.58) 50%, transparent 100%)",
          filter: "blur(3px)",
          transform: "skewX(-18deg)",
          animation: `crystalLightSweep 7s ease-in-out infinite`,
          animationDelay: `${sweepDelay}s`,
          pointerEvents: "none",
          zIndex: 5,
          borderRadius: "40%",
        }} />

        {/* Secondary faint sweep — a destiempo */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: 0,
          width: "22%",
          height: "60%",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)",
          filter: "blur(5px)",
          transform: "skewX(-12deg)",
          animation: `crystalLightSweep 7s ease-in-out infinite`,
          animationDelay: `${sweepDelay + 0.35}s`,
          pointerEvents: "none",
          zIndex: 5,
        }} />

        {/* Bottom color reflection */}
        <div style={{
          position: "absolute", bottom: "8%", left: "18%", right: "18%", height: "22%",
          borderRadius: "50%",
          background: frosted
            ? `radial-gradient(ellipse at 50% 100%, rgba(140,170,255,0.22) 0%, transparent 70%)`
            : `radial-gradient(ellipse at 50% 100%, ${color}30 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2,
        }}>
          {children}
        </div>

        {/* Rim highlight ring */}
        <div style={{
          position: "absolute", inset: 1, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.22)",
          pointerEvents: "none", zIndex: 3,
        }} />
      </div>

      {/* Floor shadow ellipse */}
      <div style={{
        position: "absolute",
        bottom: -size * 0.07, left: "22%", right: "22%",
        height: size * 0.09, borderRadius: "50%",
        background: "rgba(0,0,0,0.48)",
        filter: `blur(${size * 0.07}px)`,
        pointerEvents: "none",
      }} />

      <style>{`
        @keyframes spherePulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes crystalLightSweep {
          0%   { transform: translateX(-220%) skewX(-18deg); opacity: 0; }
          4%   { opacity: 1; }
          26%  { opacity: 0.7; }
          34%  { transform: translateX(220%) skewX(-18deg); opacity: 0; }
          100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
        }
      `}</style>
    </div>
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
  { name: "Genesis",   color: "#FFD700", desc: "Antes de Ago 2026 — rareza máxima", supply: "~200 NFTs",   window: "Ahora mismo" },
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

// ─── 18 Colecciones Legendarias ───────────────────────────────────────────────

const LEGENDARY_COLLECTION = [
  // ─ Mythic (4) ─ Máxima rareza
  { id: 1,  name: "Om Primordial",      symbol: "🕉️", tradition: "Védico · 1500 a.C.",         color: "#FFD700", element: "Éter",           desc: "El sonido original del universo — la vibración de la existencia",      rarity: "Mythic"    },
  { id: 2,  name: "Cubo de Metatrón",   symbol: "⬡",   tradition: "Geometría Sagrada",           color: "#FF6B9D", element: "Fuego Divino",    desc: "Contiene todas las formas posibles del cosmos en perfecta armonía",    rarity: "Mythic"    },
  { id: 3,  name: "Sri Yantra",         symbol: "🔺",  tradition: "Tantra · Vedas",              color: "#FF4444", element: "Creación",        desc: "El mapa sagrado de la realidad total — 9 triángulos entrelazados",    rarity: "Mythic"    },
  { id: 4,  name: "Bindu",              symbol: "◎",   tradition: "Hinduismo · Tantra",          color: "#9B59B6", element: "Consciencia",     desc: "El punto sin dimensión — origen de todo lo que existe",               rarity: "Mythic"    },
  // ─ Legendary (14) ─
  { id: 5,  name: "Rueda del Dharma",   symbol: "☸",   tradition: "Budismo · 500 a.C.",          color: "#F39C12", element: "Tierra",          desc: "El Noble Óctuple Sendero hacia la iluminación plena",                 rarity: "Legendary" },
  { id: 6,  name: "Yin Yang",           symbol: "☯",   tradition: "Taoísmo · 1000 a.C.",         color: "#E8E8E8", element: "Equilibrio",      desc: "La dualidad en perfecta armonía — luz y sombra como uno",             rarity: "Legendary" },
  { id: 7,  name: "Ankh",               symbol: "☥",   tradition: "Egipto · 3000 a.C.",          color: "#D4AC0D", element: "Vida Eterna",     desc: "La llave de la inmortalidad — vida más allá de la muerte",            rarity: "Legendary" },
  { id: 8,  name: "Caduceo",            symbol: "⚕",   tradition: "Hermetismo · Grecia",         color: "#27AE60", element: "Aire",            desc: "Sabiduría, sanación y equilibrio de fuerzas opuestas",                rarity: "Legendary" },
  { id: 9,  name: "Espiral Áurea",      symbol: "🌀",  tradition: "Matemática Sagrada",          color: "#E67E22", element: "Aire",            desc: "La proporción divina φ = 1.618 — el ritmo de la naturaleza",          rarity: "Legendary" },
  { id: 10, name: "Ouroboros",          symbol: "♾️",  tradition: "Alquimia · Egipto",           color: "#8E44AD", element: "Éter",            desc: "La serpiente que se muerde la cola — el eterno retorno sin fin",      rarity: "Legendary" },
  { id: 11, name: "Flor de la Vida",    symbol: "🌸",  tradition: "Geometría Sagrada",           color: "#1ABC9C", element: "Agua",            desc: "El patrón fundacional de toda la creación visible e invisible",       rarity: "Legendary" },
  { id: 12, name: "Vajra",              symbol: "⚡",  tradition: "Budismo Vajrayana",           color: "#3498DB", element: "Rayo Divino",     desc: "El diamante indestructible — mente que no puede ser corrompida",      rarity: "Legendary" },
  { id: 13, name: "Ojo de Horus",       symbol: "👁",  tradition: "Egipto · 3100 a.C.",          color: "#2980B9", element: "Agua",            desc: "Protección divina, salud y visión espiritual más allá del velo",      rarity: "Legendary" },
  { id: 14, name: "Trisul de Shiva",    symbol: "🔱",  tradition: "Shivaísmo · Védico",          color: "#C0392B", element: "Fuego",           desc: "Creación, preservación y disolución — las tres fuerzas del cosmos",   rarity: "Legendary" },
  { id: 15, name: "Mandala Solar",      symbol: "☀️",  tradition: "Universal",                   color: "#F1C40F", element: "Fuego Solar",     desc: "Centro irradiante de energía cósmica — la fuente de toda vida",      rarity: "Legendary" },
  { id: 16, name: "Luna Sagrada",       symbol: "🌙",  tradition: "Universal",                   color: "#BDC3C7", element: "Agua Lunar",      desc: "Ciclos, intuición femenina y el misterio de lo invisible",            rarity: "Legendary" },
  { id: 17, name: "Merkaba",            symbol: "💎",  tradition: "Kabbalah · Geometría",        color: "#6C5CE7", element: "Luz",             desc: "Vehículo de luz interdimensional — el campo de energía del alma",     rarity: "Legendary" },
  { id: 18, name: "Vesica Piscis",      symbol: "🌊",  tradition: "Geometría Sagrada",           color: "#00B894", element: "Éter",            desc: "El origen de todas las formas — la intersección del cielo y la tierra", rarity: "Legendary" },
] as const;

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
          <div style={{ height: "200px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#100520,#060308)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Orbiting rings behind sphere */}
            {[0, 1].map((i) => (
              <motion.div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: `${170 + i * 44}px`, height: `${170 + i * 44}px`, borderRadius: "50%", border: `1px solid rgba(${i === 0 ? "245,158,11" : "147,51,234"},${0.22 - i * 0.06})`, transform: "translate(-50%,-50%)" }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }} transition={{ duration: 14 + i * 8, repeat: Infinity, ease: "linear" }} />
            ))}
            <CrystalSphere color="#f59e0b" size={138} glowIntensity="high" animated>
              <motion.span
                animate={{ scale: [1, 1.12, 1], filter: ["drop-shadow(0 0 10px #f59e0b)", "drop-shadow(0 0 26px #f59e0b)", "drop-shadow(0 0 10px #f59e0b)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ fontSize: "44px", display: "block" }}>🕉️</motion.span>
            </CrystalSphere>
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

      {/* Crystal Sphere with symbol */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <CrystalSphere
          color={nft.rarityColor}
          size={108}
          glowIntensity={nft.rarity === "Genesis" ? "high" : "medium"}
          animated={hovered}
        >
          <motion.span
            animate={{
              scale: hovered ? [1, 1.14, 1] : 1,
              filter: hovered
                ? [`drop-shadow(0 0 8px ${nft.rarityColor})`, `drop-shadow(0 0 22px ${nft.rarityColor})`, `drop-shadow(0 0 8px ${nft.rarityColor})`]
                : `drop-shadow(0 0 5px ${nft.rarityColor}99)`,
            }}
            transition={{ duration: 1.8, repeat: hovered ? Infinity : 0 }}
            style={{ fontSize: 36, display: "block" }}
          >{nft.symbol}</motion.span>
        </CrystalSphere>
      </div>

      {/* Name + subtitle centered */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h3 style={{ fontSize: 19, fontWeight: 700, color: "#f5f0e8", marginBottom: 3, lineHeight: 1.2 }}>{nft.name}</h3>
        <p style={{ fontSize: 12, color: "var(--dark-muted)", fontStyle: "italic" }}>{nft.subtitle}</p>
      </div>

      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${nft.rarityColor}44,transparent)`, margin: "16px 0" }} />

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

function GuardianCard({ g, index, lightTheme = false }: { g: typeof GUARDIANS[0]; index: number; lightTheme?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "3/4", cursor: "pointer",
        border: `1px solid ${hovered ? g.color + "88" : lightTheme ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.4s,box-shadow 0.4s",
        boxShadow: hovered
          ? `0 0 40px ${g.color}44,0 8px 32px ${lightTheme ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.5)"}`
          : lightTheme ? "0 4px 16px rgba(0,0,0,0.07)" : "0 4px 16px rgba(0,0,0,0.4)",
        background: lightTheme ? `radial-gradient(ellipse at 50% 20%, ${g.color}16, #f5f0e8 65%)` : undefined,
      }}>
      <motion.div animate={{ opacity: hovered ? 1 : 0.12 }} transition={{ duration: 0.5 }}
        style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%,${g.color}50,${g.color}10 50%,${lightTheme ? "#f5f0e8" : "#0c0906"})` }} />

      {/* Locked overlay */}
      {/* Crystal sphere — frosted when locked, vivid on hover */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, gap: 12 }}>
        <motion.div animate={{ scale: hovered ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
          <CrystalSphere
            color={g.color}
            size={100}
            glowIntensity={hovered ? "high" : "low"}
            frosted={!hovered}
            animated={hovered}
          >
            <motion.span
              animate={{ scale: hovered ? [1, 1.12, 1] : 1, opacity: hovered ? 1 : 0.42 }}
              transition={{ duration: 1.8, repeat: hovered ? Infinity : 0 }}
              style={{ fontSize: hovered ? 38 : 26, display: "block", filter: hovered ? `drop-shadow(0 0 14px ${g.color})` : "none" }}
            >{hovered ? g.emoji : "🔒"}</motion.span>
          </CrystalSphere>
        </motion.div>

        <motion.div animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }} transition={{ duration: 0.35 }}
          style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: lightTheme ? "#1a1209" : "#f5f0e8", marginBottom: 4 }}>{g.name}</h3>
          <p style={{ fontSize: 11, color: g.color, fontStyle: "italic" }}>{g.archetype}</p>
        </motion.div>

        <motion.div animate={{ opacity: hovered ? 0 : 1 }} transition={{ duration: 0.3 }}
          style={{ position: "absolute", bottom: 16, textAlign: "center" }}>
          <p style={{ fontSize: 10, color: lightTheme ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ago 2026</p>
        </motion.div>
      </div>

      <div style={{ position: "absolute", top: 12, left: 14, fontSize: 11, color: lightTheme ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)", fontWeight: 700 }}>#{String(g.id).padStart(2, "0")}</div>
      <div style={{ position: "absolute", top: 12, right: 14, width: 8, height: 8, borderRadius: "50%", background: g.color, boxShadow: `0 0 8px ${g.color}`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }} />
    </motion.div>
  );
}

// ─── Symbol SVG — símbolos sagrados reales ────────────────────────────────────

function SymbolSVG({ id, color, size = 42 }: { id: number; color: string; size?: number }) {
  const s = { fill: "none" as const, stroke: color, strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const glow = { filter: `drop-shadow(0 0 5px ${color}cc)` };
  const clipId = `clip-sym-${id}`;

  const svg = (children: React.ReactNode) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={glow}>
      {children}
    </svg>
  );

  switch (id) {
    // 1 — Om ॐ (Devanagari auténtico)
    case 1: return svg(
      <text x="30" y="44" textAnchor="middle" fontSize="40" fill={color} stroke="none" fontFamily="serif">{`ॐ`}</text>
    );

    // 2 — Cubo de Metatrón: hexágono + estrella de 6 + radios al centro + círculos
    case 2: return svg(<>
      <circle cx="30" cy="30" r="25" {...s} strokeWidth="0.8"/>
      <polygon points="30,7 51,41 9,41" {...s}/>
      <polygon points="30,53 9,19 51,19" {...s}/>
      {[0,60,120,180,240,300].map((deg,i) => {
        const r=deg*Math.PI/180;
        return <><line key={i} x1="30" y1="30" x2={+(30+25*Math.cos(r)).toFixed(2)} y2={+(30+25*Math.sin(r)).toFixed(2)} {...s} strokeWidth="0.5"/></>;
      })}
      <circle cx="30" cy="30" r="2.5" fill={color} stroke="none"/>
    </>);

    // 3 — Sri Yantra: triángulos entrelazados + círculo + punto bindu
    case 3: return svg(<>
      <circle cx="30" cy="30" r="25" {...s} strokeWidth="0.8"/>
      <polygon points="30,7 53,47 7,47" {...s}/>
      <polygon points="30,12 49,45 11,45" {...s}/>
      <polygon points="30,18 45,42 15,42" {...s}/>
      <polygon points="30,53 7,13 53,13" {...s}/>
      <polygon points="30,47 11,17 49,17" {...s}/>
      <polygon points="30,41 15,20 45,20" {...s}/>
      <polygon points="30,35 19,22 41,22" {...s}/>
      <circle cx="30" cy="30" r="2" fill={color} stroke="none"/>
    </>);

    // 4 — Bindu: círculos concéntricos con punto central
    case 4: return svg(<>
      {[25,19,13,7].map((r,i) => <circle key={i} cx="30" cy="30" r={r} {...s}/>)}
      <circle cx="30" cy="30" r="2.5" fill={color} stroke="none"/>
    </>);

    // 5 — Rueda del Dharma: 8 radios
    case 5: return svg(<>
      <circle cx="30" cy="30" r="25" {...s}/>
      <circle cx="30" cy="30" r="7" {...s}/>
      {[0,22.5,45,67.5,90,112.5,135,157.5].map((deg,i) => {
        const r=deg*Math.PI/180;
        return <line key={i} x1={+(30+7*Math.cos(r)).toFixed(2)} y1={+(30+7*Math.sin(r)).toFixed(2)} x2={+(30+25*Math.cos(r)).toFixed(2)} y2={+(30+25*Math.sin(r)).toFixed(2)} {...s}/>;
      })}
    </>);

    // 6 — Yin Yang: mitad llena + S-curve + ojos pequeños
    case 6: return svg(<>
      <circle cx="30" cy="30" r="25" {...s} strokeWidth="1.2"/>
      <path d="M30,5 A25,25 0,0,0 30,55 A12.5,12.5 0,0,1 30,30 A12.5,12.5 0,0,0 30,5 Z" fill={color} stroke="none"/>
      <circle cx="30" cy="17.5" r="5" fill="none" stroke={color} strokeWidth="1"/>
      <circle cx="30" cy="42.5" r="5" fill={color} stroke="none"/>
    </>);

    // 7 — Ankh: óvalo + barra vertical + travesaño
    case 7: return svg(<>
      <ellipse cx="30" cy="21" rx="11" ry="13" {...s}/>
      <line x1="30" y1="34" x2="30" y2="57" {...s}/>
      <line x1="14" y1="38" x2="46" y2="38" {...s}/>
    </>);

    // 8 — Caduceo: vara + alas + serpientes entrelazadas
    case 8: return svg(<>
      <line x1="30" y1="6" x2="30" y2="56" {...s}/>
      <path d="M30,11 Q17,7 15,15 Q13,23 22,23" {...s}/>
      <path d="M30,11 Q43,7 45,15 Q47,23 38,23" {...s}/>
      <path d="M30,23 Q20,27 20,33 Q20,39 30,39 Q40,39 40,45 Q40,51 30,51" {...s}/>
      <path d="M30,23 Q40,27 40,33 Q40,39 30,39 Q20,39 20,45 Q20,51 30,51" {...s}/>
      <circle cx="30" cy="8" r="3" fill={color} stroke="none"/>
    </>);

    // 9 — Espiral Áurea (logarítmica de Fibonacci)
    case 9: return svg(
      <path d="M30,30 Q38,30 38,22 Q38,10 26,10 Q10,10 10,28 Q10,50 32,52 Q56,54 58,32 Q60,8 38,6" {...s} strokeWidth="2"/>
    );

    // 10 — Ouroboros: serpiente mordiéndose la cola
    case 10: return svg(<>
      <path d="M30,5 A25,25 0,1,1 48,45" {...s} strokeWidth="4" strokeLinecap="round"/>
      <ellipse cx="48.5" cy="47.5" rx="5" ry="4" transform="rotate(35,48.5,47.5)" fill={color} stroke={color} strokeWidth="0.8"/>
      <circle cx="51" cy="45" r="1.2" fill="#000" stroke="none"/>
      <path d="M30,5 L33,8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </>);

    // 11 — Flor de la Vida: 7 círculos superpuestos + 6 exteriores + círculo contenedor
    case 11: return svg(<>
      <defs><clipPath id={clipId}><circle cx="30" cy="30" r="23"/></clipPath></defs>
      <circle cx="30" cy="30" r="26" {...s} strokeWidth="1"/>
      <g clipPath={`url(#${clipId})`} {...s} strokeWidth="0.9">
        <circle cx="30" cy="30" r="9"/>
        <circle cx="39" cy="30" r="9"/><circle cx="21" cy="30" r="9"/>
        <circle cx="34.5" cy="22.2" r="9"/><circle cx="25.5" cy="22.2" r="9"/>
        <circle cx="34.5" cy="37.8" r="9"/><circle cx="25.5" cy="37.8" r="9"/>
        <circle cx="48" cy="30" r="9"/><circle cx="12" cy="30" r="9"/>
        <circle cx="43.5" cy="22.2" r="9"/><circle cx="16.5" cy="22.2" r="9"/>
        <circle cx="43.5" cy="37.8" r="9"/><circle cx="16.5" cy="37.8" r="9"/>
        <circle cx="34.5" cy="14.4" r="9"/><circle cx="25.5" cy="14.4" r="9"/>
        <circle cx="34.5" cy="45.6" r="9"/><circle cx="25.5" cy="45.6" r="9"/>
      </g>
    </>);

    // 12 — Vajra: vara con pétalos de loto en cada extremo + diamante central
    case 12: return svg(<>
      <line x1="30" y1="8" x2="30" y2="52" {...s}/>
      <polygon points="30,22 38,30 30,38 22,30" {...s}/>
      {[-20,0,20].map((angle,i) => {
        const r=angle*Math.PI/180;
        return <line key={i} x1="30" y1="8" x2={+(30+10*Math.sin(r)).toFixed(2)} y2={+(8-10*Math.abs(Math.cos(r))).toFixed(2)} {...s} strokeWidth="1"/>;
      })}
      {[-20,0,20].map((angle,i) => {
        const r=angle*Math.PI/180;
        return <line key={i} x1="30" y1="52" x2={+(30+10*Math.sin(r)).toFixed(2)} y2={+(52+10*Math.abs(Math.cos(r))).toFixed(2)} {...s} strokeWidth="1"/>;
      })}
      <circle cx="30" cy="6" r="3" fill={color} stroke="none"/>
      <circle cx="30" cy="54" r="3" fill={color} stroke="none"/>
    </>);

    // 13 — Ojo de Horus con gancho inferior característico
    case 13: return svg(<>
      <path d="M6,28 Q18,12 30,12 Q42,12 54,28 Q42,44 30,44 Q18,44 6,28 Z" {...s}/>
      <circle cx="30" cy="28" r="8" {...s}/>
      <circle cx="30" cy="28" r="3" fill={color} stroke="none"/>
      <path d="M30,44 Q38,52 36,58" {...s} strokeLinecap="round"/>
      <path d="M20,42 Q16,50 18,56" {...s} strokeLinecap="round"/>
      <path d="M8,24 Q18,14 30,14 Q42,14 52,24" {...s} strokeWidth="1"/>
    </>);

    // 14 — Trisul de Shiva: tridente con mango y ornamento
    case 14: return svg(<>
      <line x1="30" y1="32" x2="30" y2="56" {...s}/>
      <line x1="15" y1="40" x2="45" y2="40" {...s}/>
      <line x1="30" y1="40" x2="30" y2="6" {...s}/>
      <path d="M15,40 Q11,28 13,16 Q15,8 20,12 Q16,22 18,34" {...s}/>
      <path d="M45,40 Q49,28 47,16 Q45,8 40,12 Q44,22 42,34" {...s}/>
      <circle cx="30" cy="5" r="3" fill={color} stroke="none"/>
    </>);

    // 15 — Mandala Solar: círculos concéntricos + 16 rayos alternos
    case 15: return svg(<>
      <circle cx="30" cy="30" r="10" {...s}/>
      <circle cx="30" cy="30" r="22" {...s} strokeWidth="0.8"/>
      {Array.from({length:16}).map((_,i) => {
        const r=(i*22.5)*Math.PI/180, inner=i%2===0?11:14, outer=i%2===0?22:20;
        return <line key={i} x1={+(30+inner*Math.cos(r)).toFixed(2)} y1={+(30+inner*Math.sin(r)).toFixed(2)} x2={+(30+outer*Math.cos(r)).toFixed(2)} y2={+(30+outer*Math.sin(r)).toFixed(2)} {...s} strokeWidth={i%2===0?1.3:0.8}/>;
      })}
      <circle cx="30" cy="30" r="4" fill={color} stroke="none" style={{opacity:0.7}}/>
    </>);

    // 16 — Luna Sagrada: creciente lunar + estrellas
    case 16: return svg(<>
      <path d="M30,7 A23,23 0,1,1 30,53 A17,17 0,1,0 30,7 Z" fill={color} stroke={color} strokeWidth="0.8"/>
      {[[46,15,2],[50,27,1.2],[43,9,1]].map(([x,y,r],i) =>
        <circle key={i} cx={x} cy={y} r={r} fill={color} stroke="none"/>
      )}
    </>);

    // 17 — Merkaba: estrella de David + círculo
    case 17: return svg(<>
      <polygon points="30,5 53,45 7,45" {...s}/>
      <polygon points="30,55 7,15 53,15" {...s}/>
      <circle cx="30" cy="30" r="25" {...s} strokeWidth="0.8"/>
      <circle cx="30" cy="30" r="3" fill={color} stroke="none"/>
    </>);

    // 18 — Vesica Piscis: dos círculos superpuestos + almendra sagrada
    case 18: return svg(<>
      <circle cx="22" cy="30" r="18" {...s}/>
      <circle cx="38" cy="30" r="18" {...s}/>
      <circle cx="30" cy="30" r="26" {...s} strokeWidth="0.8"/>
    </>);

    default: return null;
  }
}

// ─── Legendary Card ───────────────────────────────────────────────────────────

type LegendaryItem = typeof LEGENDARY_COLLECTION[number];

function LegendaryCard({ item, index }: { item: LegendaryItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isMythic = item.rarity === "Mythic";
  const sweepDelay = (index * 0.9) % 6.5;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        background: `radial-gradient(ellipse at 50% -10%, ${item.color}20 0%, #070504 68%)`,
        border: `1px solid ${hovered ? item.color + "80" : item.color + "25"}`,
        boxShadow: hovered
          ? `0 0 48px ${item.color}44, 0 12px 40px rgba(0,0,0,0.55)`
          : `0 4px 18px rgba(0,0,0,0.45)`,
        padding: "22px 16px 18px",
        cursor: "pointer",
        transition: "border-color 0.3s, box-shadow 0.35s",
        minHeight: 300,
      }}
    >
      {/* Mythic aura pulsante */}
      {isMythic && (
        <motion.div
          animate={{ opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% -15%, ${item.color}28, transparent 68%)`, pointerEvents: "none" }}
        />
      )}

      {/* Header row: rarity badge + id */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: isMythic ? "linear-gradient(90deg,rgba(255,215,0,0.14),rgba(255,107,157,0.14))" : `${item.color}18`,
          border: `1px solid ${isMythic ? "rgba(255,215,0,0.45)" : item.color + "44"}`,
          borderRadius: 20, padding: "2px 10px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: isMythic ? "#FFD700" : item.color, boxShadow: `0 0 6px ${isMythic ? "#FFD700" : item.color}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: isMythic ? "#FFD700" : item.color, textTransform: "uppercase" }}>{item.rarity}</span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", fontWeight: 600, letterSpacing: "0.05em" }}>#{String(item.id).padStart(2, "0")}</span>
      </div>

      {/* Crystal Sphere centrada */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <CrystalSphere
          color={item.color}
          size={112}
          glowIntensity={hovered ? (isMythic ? "high" : "medium") : "low"}
          animated={hovered || isMythic}
          sweepDelay={sweepDelay}
        >
          <motion.div
            animate={{ scale: hovered ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 1.9, repeat: hovered ? Infinity : 0 }}
          >
            <SymbolSVG id={item.id} color={item.color} size={42}/>
          </motion.div>
        </CrystalSphere>
      </div>

      {/* Nombre */}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f5f0e8", textAlign: "center", marginBottom: 3, lineHeight: 1.25 }}>{item.name}</h3>

      {/* Tradición */}
      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textAlign: "center", marginBottom: 9, letterSpacing: "0.04em" }}>{item.tradition}</p>

      {/* Elemento badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: item.color, background: `${item.color}14`, border: `1px solid ${item.color}30`,
          borderRadius: 20, padding: "2px 10px",
        }}>{item.element}</span>
      </div>

      {/* Descripción — aparece en hover */}
      <motion.div animate={{ opacity: hovered ? 1 : 0, maxHeight: hovered ? 60 : 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", textAlign: "center", lineHeight: 1.55 }}>{item.desc}</p>
      </motion.div>

      {/* Status bottom */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", padding: "2px 8px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
          {isMythic ? "✦ Drop exclusivo" : "Ago 2026"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2026-08-01T00:00:00Z").getTime();
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

// ─── Zodiac Data ──────────────────────────────────────────────────────────────

const ZODIAC_SIGNS = [
  { sign: "Aries",       symbol: "♈", emoji: "🔥", dates: "21 Mar – 19 Abr", element: "Fuego",  color: "#FF4444", archetype: "El Guerrero",       trait: "Valentía, impulso, liderazgo",             tokenId: 10 },
  { sign: "Tauro",       symbol: "♉", emoji: "🌿", dates: "20 Abr – 20 May", element: "Tierra", color: "#4CAF50", archetype: "El Guardián",       trait: "Estabilidad, sensualidad, perseverancia",  tokenId: 11 },
  { sign: "Géminis",     symbol: "♊", emoji: "🌬️", dates: "21 May – 20 Jun", element: "Aire",   color: "#FFEB3B", archetype: "El Mensajero",      trait: "Curiosidad, adaptabilidad, ingenio",       tokenId: 12 },
  { sign: "Cáncer",      symbol: "♋", emoji: "🌊", dates: "21 Jun – 22 Jul", element: "Agua",   color: "#90CAF9", archetype: "La Intuición",      trait: "Empatía, intuición, profundidad",          tokenId: 13 },
  { sign: "Leo",         symbol: "♌", emoji: "☀️", dates: "23 Jul – 22 Ago", element: "Fuego",  color: "#FF9800", archetype: "El Soberano",       trait: "Creatividad, generosidad, carisma",        tokenId: 14 },
  { sign: "Virgo",       symbol: "♍", emoji: "🌾", dates: "23 Ago – 22 Sep", element: "Tierra", color: "#8BC34A", archetype: "El Sabio",          trait: "Análisis, servicio, perfección",           tokenId: 15 },
  { sign: "Libra",       symbol: "♎", emoji: "⚖️", dates: "23 Sep – 22 Oct", element: "Aire",   color: "#E91E63", archetype: "El Equilibrio",     trait: "Armonía, justicia, belleza",               tokenId: 16 },
  { sign: "Escorpio",    symbol: "♏", emoji: "🦂", dates: "23 Oct – 21 Nov", element: "Agua",   color: "#9C27B0", archetype: "La Transformación", trait: "Intensidad, poder, regeneración",          tokenId: 17 },
  { sign: "Sagitario",   symbol: "♐", emoji: "🏹", dates: "22 Nov – 21 Dic", element: "Fuego",  color: "#FF5722", archetype: "El Viajero",        trait: "Expansión, filosofía, libertad",           tokenId: 18 },
  { sign: "Capricornio", symbol: "♑", emoji: "🏔️", dates: "22 Dic – 19 Ene", element: "Tierra", color: "#607D8B", archetype: "El Maestro",        trait: "Disciplina, ambición, sabiduría",          tokenId: 19 },
  { sign: "Acuario",     symbol: "♒", emoji: "⚡", dates: "20 Ene – 18 Feb", element: "Aire",   color: "#2196F3", archetype: "El Visionario",     trait: "Innovación, humanidad, revolución",        tokenId: 20 },
  { sign: "Piscis",      symbol: "♓", emoji: "🌙", dates: "19 Feb – 20 Mar", element: "Agua",   color: "#00BCD4", archetype: "El Místico",        trait: "Espiritualidad, compasión, sueños",        tokenId: 21 },
];

function getZodiacFromDate(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const m = d.getMonth() + 1, day = d.getDate();
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return ZODIAC_SIGNS[0];
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return ZODIAC_SIGNS[1];
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return ZODIAC_SIGNS[2];
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return ZODIAC_SIGNS[3];
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return ZODIAC_SIGNS[4];
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return ZODIAC_SIGNS[5];
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return ZODIAC_SIGNS[6];
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return ZODIAC_SIGNS[7];
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return ZODIAC_SIGNS[8];
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return ZODIAC_SIGNS[9];
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return ZODIAC_SIGNS[10];
  return ZODIAC_SIGNS[11];
}

// ─── Zodiac Card ──────────────────────────────────────────────────────────────

function ZodiacCard({ z, active = false }: { z: typeof ZODIAC_SIGNS[0]; active?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 20%, ${z.color}20 0%, #f5f0e8 70%)`,
        border: `1px solid ${active ? z.color : z.color + "33"}`,
        boxShadow: active
          ? `0 0 24px ${z.color}44, 0 8px 24px rgba(0,0,0,0.12)`
          : `0 4px 14px rgba(0,0,0,0.07)`,
        padding: "28px 20px 22px",
        minHeight: 220,
        cursor: "pointer",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Emoji top-left */}
      <span style={{ position: "absolute", top: 14, left: 16, fontSize: 20 }}>{z.emoji}</span>

      {/* Element badge top-right */}
      <span style={{
        position: "absolute", top: 14, right: 14, fontSize: 9, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "2px 8px", borderRadius: 20,
        background: z.color + "22", border: `1px solid ${z.color}66`,
        color: z.color,
      }}>{z.element}</span>

      {/* Crystal sphere mini with zodiac symbol */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 14 }}>
        <CrystalSphere color={z.color} size={72} glowIntensity={active ? "high" : "low"} animated={active}>
          <motion.span
            animate={{ textShadow: active ? [`0 0 8px ${z.color}`, `0 0 18px ${z.color}`, `0 0 8px ${z.color}`] : `0 0 6px ${z.color}88` }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ fontSize: 30, display: "block", color: z.color, lineHeight: 1 }}
          >
            {z.symbol}
          </motion.span>
        </CrystalSphere>
      </div>

      {/* Name */}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1209", textAlign: "center", marginBottom: 4, fontFamily: "serif" }}>{z.sign}</h3>

      {/* Archetype */}
      <p style={{ fontSize: 12, color: z.color, textAlign: "center", fontStyle: "italic", marginBottom: 8 }}>{z.archetype}</p>

      {/* Dates */}
      <p style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", textAlign: "center", marginBottom: 6 }}>{z.dates}</p>

      {/* Trait */}
      <p style={{ fontSize: 10, color: "rgba(0,0,0,0.25)", textAlign: "center", lineHeight: 1.4 }}>{z.trait}</p>
    </motion.div>
  );
}

// ─── Zodiac Section ───────────────────────────────────────────────────────────

function ZodiacSection() {
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [previewZodiac, setPreviewZodiac] = useState<typeof ZODIAC_SIGNS[0] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultZodiac, setResultZodiac] = useState<typeof ZODIAC_SIGNS[0] | null>(null);

  const today = new Date().toISOString().split("T")[0];

  function handleBirthdayChange(val: string) {
    setBirthday(val);
    setPreviewZodiac(getZodiacFromDate(val));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !birthday || !previewZodiac) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, birthday }),
      });
      if (!res.ok) throw new Error("Error");
      setResultZodiac(previewZodiac);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const canSubmit = email.includes("@") && birthday.length > 0 && previewZodiac !== null;

  return (
    <section className="section-cream py-24 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-14">
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 12 }}>
            NFTs Zodiacales · Gratis
          </span>
          <h2 className="gradient-text" style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Tu signo, tu NFT
          </h2>
          <p style={{ fontSize: 17, color: "#5a4a3a", maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
            Regístrate con tu email y fecha de nacimiento. Descubrimos tu signo y te enviamos tu NFT zodiacal Om Domo — gratis, en Avalanche.
          </p>
        </FadeIn>

        {/* Carrusel */}
        <div className="mb-14">
          <ScrollCarousel cardMinWidth={220} dotColor="#9333ea" darkTheme={true}>
            {ZODIAC_SIGNS.map((z) => (
              <ZodiacCard key={z.sign} z={z} active={previewZodiac?.sign === z.sign} />
            ))}
          </ScrollCarousel>
        </div>

        {/* Form panel */}
        <FadeIn>
          <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(147,51,234,0.18)", borderRadius: 24, padding: "40px 32px", maxWidth: 480, margin: "0 auto", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
            {status === "success" && resultZodiac ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ fontSize: 72, marginBottom: 16 }}>{resultZodiac.emoji}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f5f0e8", marginBottom: 8 }}>
                  ¡Tu NFT {resultZodiac.sign} está en camino!
                </h3>
                <p style={{ fontSize: 14, color: resultZodiac.color, fontStyle: "italic", marginBottom: 12 }}>
                  {resultZodiac.archetype}
                </p>
                <p style={{ fontSize: 13, color: "var(--dark-muted)", lineHeight: 1.6 }}>
                  Revisa tu email — te enviamos el link para reclamar tu NFT zodiacal gratis en Avalanche.
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 16 }}>
                  {resultZodiac.trait}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B7355", marginBottom: 8 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14,
                      background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.1)",
                      color: "#1a1209", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B7355", marginBottom: 8 }}>
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    max={today}
                    onChange={(e) => handleBirthdayChange(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14,
                      background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.1)",
                      color: "#1a1209", outline: "none", boxSizing: "border-box",
                      colorScheme: "light",
                    }}
                  />
                </div>

                {/* Live preview */}
                {previewZodiac && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ZodiacCard z={previewZodiac} active={true} />
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || status === "loading"}
                  style={{
                    width: "100%", padding: "14px 24px", borderRadius: 14, fontWeight: 700, fontSize: 15,
                    background: canSubmit ? "linear-gradient(135deg,#9333ea,#06b6d4)" : "rgba(255,255,255,0.07)",
                    color: canSubmit ? "#fff" : "rgba(255,255,255,0.3)",
                    border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
                    transition: "background 0.3s, color 0.3s",
                    boxShadow: canSubmit ? "0 4px 20px rgba(147,51,234,0.4)" : "none",
                  }}
                >
                  {status === "loading"
                    ? "Enviando…"
                    : previewZodiac
                      ? `Recibir mi NFT ${previewZodiac.sign} →`
                      : "Recibir mi NFT →"}
                </button>

                {status === "error" && (
                  <p style={{ fontSize: 12, color: "#f87171", textAlign: "center" }}>
                    Algo salió mal. Inténtalo de nuevo.
                  </p>
                )}
              </form>
            )}
          </div>
        </FadeIn>

        {/* Nota */}
        <FadeIn>
          <p style={{ fontSize: 12, color: "#8B7355", textAlign: "center", marginTop: 24, fontStyle: "italic" }}>
            12 signos · Edición de 111 NFTs por signo · Avalanche Mainnet
          </p>
        </FadeIn>
      </div>
    </section>
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
      <section className="section-dark py-20 px-6 relative overflow-hidden" style={{ background: "#060308" }}>
        {/* Fondo de estrellas — igual que la landing */}
        <div className="absolute inset-0 pointer-events-none">
          <SpaceBackground />
        </div>
        {/* Orbs de color sutil para dar profundidad */}
        <Orb className="w-[500px] h-[500px] bg-amber-900 top-0 right-0" />
        <Orb className="w-[400px] h-[400px] bg-purple-900 bottom-0 left-0" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 12 }}>Colección Om Domo</span>
            <h2 className="gradient-text-gold" style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
              4 Tipos de NFT
            </h2>
            <p style={{ fontSize: 18, color: "var(--dark-muted)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
              Cada prenda que compras en omdomo.com genera un NFT único en Avalanche. La rareza depende de cuándo compras.
            </p>
          </FadeIn>
          <div className="mb-10">
            <ScrollCarousel cardMinWidth={280} dotColor="#f59e0b" darkTheme={true}>
              {NFT_TYPES.map((nft, i) => <NFTTypeCard key={nft.rarity} nft={nft} index={i} />)}
            </ScrollCarousel>
          </div>
          <FadeIn className="text-center">
            <a href="https://omdomo.com" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#000", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}>
              <ShoppingBag size={18} /> Compra y consigue tu NFT Genesis
            </a>
            <p style={{ fontSize: 12, color: "var(--dark-muted)", marginTop: 12, fontStyle: "italic" }}>Disponible antes del lanzamiento oficial · Máxima rareza garantizada</p>
          </FadeIn>
        </div>
      </section>

      {/* ── GUARDIANES DE LA CONCIENCIA ── */}
      <section className="section-cream py-20 px-6 relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn className="text-center mb-6">
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B7355", marginBottom: 12 }}>Colección Artística · Agosto 2026</span>
            <h2 className="gradient-text-gold" style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
              Guardians of Consciousness
            </h2>
            <p style={{ fontSize: 17, color: "#5a4a3a", maxWidth: 520, margin: "0 auto 8px", lineHeight: 1.65 }}>
              6 arquetipos de consciencia, generados con AI y sagrados a mano. Cada Guardian representa un estado del ser — edición de 111 unidades.
            </p>
            <p style={{ fontSize: 13, color: "#8B7355", fontStyle: "italic" }}>Pasa el cursor para un preview exclusivo</p>
          </FadeIn>

          <div className="mb-12">
            <ScrollCarousel cardMinWidth={200} dotColor="#9333ea" darkTheme={true}>
              {GUARDIANS.map((g, i) => (
                <div key={g.id} style={{ aspectRatio: "3/4", minHeight: 280 }}>
                  <GuardianCard g={g} index={i} lightTheme />
                </div>
              ))}
            </ScrollCarousel>
          </div>

          <FadeIn>
            <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(139,115,85,0.15)", borderRadius: 20, padding: "32px 24px", textAlign: "center", backdropFilter: "blur(8px)" }}>
              <p style={{ fontSize: 13, color: "#8B7355", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.12em" }}>Lanzamiento oficial en</p>
              <div style={{ marginBottom: 28 }}><Countdown /></div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://discord.gg/xXezFXnpaX" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, background: "linear-gradient(135deg,#5865F2,#4752C4)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 20px rgba(88,101,242,0.3)" }}>
                  💬 Lista de espera Discord
                </a>
                <a href="/drops"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, background: "transparent", color: "#5a4a3a", fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1px solid rgba(139,115,85,0.25)" }}>
                  <Flame size={16} /> Ver todos los Drops
                </a>
              </div>
              <p style={{ fontSize: 11, color: "#8B7355", marginTop: 16, fontStyle: "italic" }}>111 unidades · Holders Genesis tienen acceso prioritario · Avalanche Mainnet</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── COLECCIÓN LEGENDARIA (18) ── */}
      <section className="section-dark py-24 px-6 relative overflow-hidden">
        <Orb className="w-[600px] h-[600px] bg-violet-950 -top-40 left-1/2 -translate-x-1/2" />
        <Orb className="w-[300px] h-[300px] bg-amber-900 bottom-0 right-0" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#FFD700", marginBottom: 14, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 20, padding: "3px 14px" }}>
              Colección Legendaria · 18 Símbolos Sagrados
            </span>
            <h2 className="gradient-text" style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 18 }}>
              Los 18 Símbolos del<br />
              <span style={{ background: "linear-gradient(90deg,#FFD700,#FF6B9D,#9B59B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Despertar</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--dark-muted)", maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              Cada símbolo es una puerta. Cada esfera de cristal, un universo. 18 NFTs legendarios que encarnan las tradiciones espirituales más poderosas de la humanidad — cada uno único en Avalanche.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 18, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(255,215,0,0.7)", background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 20, padding: "3px 12px" }}>4 Mythic · Edición 33</span>
              <span style={{ fontSize: 11, color: "rgba(147,51,234,0.8)", background: "rgba(147,51,234,0.07)", border: "1px solid rgba(147,51,234,0.2)", borderRadius: 20, padding: "3px 12px" }}>14 Legendary · Edición 111</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "3px 12px" }}>Avalanche Mainnet</span>
            </div>
          </FadeIn>

          {/* Grid 18 cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 16 }}>
            {LEGENDARY_COLLECTION.map((item, i) => (
              <LegendaryCard key={item.id} item={item} index={i} />
            ))}
          </div>

          {/* CTA */}
          <FadeIn className="text-center mt-16">
            <div style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.14)", borderRadius: 24, padding: "32px 28px", maxWidth: 520, margin: "0 auto" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>Acceso exclusivo</p>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f5f0e8", marginBottom: 10 }}>¿Cuál es tu símbolo?</h3>
              <p style={{ fontSize: 14, color: "var(--dark-muted)", marginBottom: 20, lineHeight: 1.6 }}>
                Los holders Genesis tienen acceso prioritario a la Colección Legendaria. Compra antes de Agosto 2026.
              </p>
              <a href="https://omdomo.com" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 14, background: "linear-gradient(135deg,#FFD700,#d97706)", color: "#000", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 20px rgba(255,215,0,0.35)" }}>
                <ShoppingBag size={16} /> Conseguir acceso Genesis
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── NFTs ZODIACALES ── */}
      <ZodiacSection />

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
