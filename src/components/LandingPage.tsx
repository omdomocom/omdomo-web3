"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SpaceBackground } from "./SpaceBackground";
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
// ─── Official RRSS SVG logos ──────────────────────────────────────────────────
function IconInstagram({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function IconTikTok({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
    </svg>
  );
}

function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IconYouTube({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function IconPinterest({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const SOCIALS_PRIMARY = [
  { label: "Instagram",   href: "https://www.instagram.com/om.domo/",   Icon: IconInstagram, bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400", desc: "Lifestyle & drops" },
  { label: "TikTok",      href: "https://www.tiktok.com/@omdomo.com",    Icon: IconTikTok,    bg: "bg-black",                                                      desc: "Vídeos y retos" },
  { label: "X / Twitter", href: "https://twitter.com/omdomocom",         Icon: IconX,         bg: "bg-black",                                                      desc: "Web3 & noticias" },
  { label: "YouTube",     href: "https://www.youtube.com/@omdomocom",    Icon: IconYouTube,   bg: "bg-red-600",                                                    desc: "Guías y comunidad" },
];

const SOCIALS_SECONDARY = [
  { label: "Pinterest", href: "https://www.pinterest.es/omdomocom",  Icon: IconPinterest, bg: "bg-red-600" },
  { label: "Facebook",  href: "https://www.facebook.com/omdomocom",  Icon: IconFacebook,  bg: "bg-blue-600" },
];

// Keep for footer
const SOCIALS = [...SOCIALS_PRIMARY, ...SOCIALS_SECONDARY];

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

// ─── GSAP hero animations ────────────────────────────────────────────────────
function useGsapHero(
  titleRef: React.RefObject<HTMLHeadingElement | null>,
  orb1Ref: React.RefObject<HTMLDivElement | null>,
  orb2Ref: React.RefObject<HTMLDivElement | null>,
  orb3Ref: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const title = titleRef.current;
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    const orb3 = orb3Ref.current;

    if (!title) return;

    // Split "Spiritual" into letter spans and animate
    const spiritualEl = title.querySelector(".gsap-spiritual") as HTMLElement;
    if (spiritualEl) {
      const text = spiritualEl.textContent || "";
      spiritualEl.innerHTML = text
        .split("")
        .map((ch) =>
          ch === " "
            ? " "
            : `<span class="gsap-letter" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${ch}</span></span>`
        )
        .join("");

      gsap.fromTo(
        spiritualEl.querySelectorAll(".gsap-letter > span"),
        { y: "110%", opacity: 0, rotateZ: 4 },
        {
          y: "0%",
          opacity: 1,
          rotateZ: 0,
          duration: 0.7,
          stagger: 0.045,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }

    // Orb parallax on scroll
    const orbAnimations: gsap.core.Tween[] = [];
    if (orb1) {
      orbAnimations.push(
        gsap.to(orb1, {
          y: -120,
          scrollTrigger: { trigger: orb1, start: "top bottom", end: "bottom top", scrub: 1.5 },
        })
      );
    }
    if (orb2) {
      orbAnimations.push(
        gsap.to(orb2, {
          y: -80,
          scrollTrigger: { trigger: orb2, start: "top bottom", end: "bottom top", scrub: 2 },
        })
      );
    }
    if (orb3) {
      orbAnimations.push(
        gsap.to(orb3, {
          y: -60,
          x: 30,
          scrollTrigger: { trigger: orb3, start: "top bottom", end: "bottom top", scrub: 1 },
        })
      );
    }

    return () => {
      orbAnimations.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [titleRef, orb1Ref, orb2Ref, orb3Ref]);
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

// ─── Donut chart — tokenomics distribution ────────────────────────────────────
const DISTRIBUTION = [
  { label: "Ecosistema & Rewards", pct: 25, color: "#9333ea" },
  { label: "Pre-compra (lock 30d)",pct: 10, color: "#f59e0b" },
  { label: "Quema programada",     pct: 25, color: "#f97316" },
  { label: "Liquidez DEX",         pct: 15, color: "#0891b2" },
  { label: "Equipo (4yr vesting)", pct: 10, color: "#10b981" },
  { label: "Marketing",            pct:  7, color: "#eab308" },
  { label: "DAO Treasury",         pct:  5, color: "#6366f1" },
  { label: "Reserva drops",        pct:  3, color: "#ec4899" },
];

function DonutChart() {
  const R = 70;
  const STROKE = 18;
  const C = 2 * Math.PI * R;
  const cx = 100;
  const cy = 100;

  let cumulative = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width="200" height="200" viewBox="0 0 200 200" className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={STROKE} />
        {DISTRIBUTION.map((seg) => {
          const dash = (seg.pct / 100) * C;
          const gap = C - dash;
          const offset = C * 0.25 - (cumulative / 100) * C;
          cumulative += seg.pct;
          return (
            <circle
              key={seg.label}
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          );
        })}
        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
          29,979M
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#64748b" fontSize="7.5">
          OMMY supply
        </text>
      </svg>

      <div className="flex flex-col gap-2 flex-1 w-full">
        {DISTRIBUTION.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-slate-300 flex-1 leading-tight">{seg.label}</span>
            <span className="text-xs font-bold font-mono" style={{ color: seg.color }}>{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Socials carousel ─────────────────────────────────────────────────────────
const ALL_SOCIALS = [
  ...SOCIALS_PRIMARY,
  ...SOCIALS_SECONDARY.map((s) => ({ ...s, desc: "" })),
];

function SocialsCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  // Duplicate items for infinite loop
  const items = [...ALL_SOCIALS, ...ALL_SOCIALS];

  return (
    <div
      className="relative overflow-hidden mb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--cream-bg-2), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--cream-bg-2), transparent)" }} />

      <motion.div
        ref={track}
        className="flex gap-4 w-max"
        animate={{ x: paused ? undefined : ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        style={paused ? { animationPlayState: "paused" } : {}}
      >
        {items.map((s, i) => (
          <motion.a
            key={`${s.label}-${i}`}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 bg-white rounded-2xl p-5 border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all flex flex-col items-center gap-3 text-center w-36"
          >
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center text-white shadow-md`}>
              <s.Icon size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800 leading-tight">{s.label}</p>
              {"desc" in s && s.desc ? (
                <p className="text-xs text-stone-400 mt-0.5 leading-tight">{s.desc}</p>
              ) : null}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Discord & GitHub icons ───────────────────────────────────────────────────
function IconDiscord({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

function IconGitHub({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

// ─── Om Domo Logo + Disney 3-star animation ───────────────────────────────────
function OmDomoLogo({ size = 32, showStars = false }: { size?: number; showStars?: boolean }) {
  // SVG overlay is 2.4× the logo size, centered on it
  const S = Math.round(size * 2.4);
  const cx = S / 2;
  const cy = S / 2;
  const r = size * 0.6;
  // Arc: lower-left → over top → lower-right
  const path = `M ${cx - r} ${cy + r * 0.4} Q ${cx} ${cy - r * 0.85} ${cx + r} ${cy + r * 0.4}`;
  const dur = "4s";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-xl overflow-hidden bg-white flex items-center justify-center"
        style={{ padding: size * 0.06 }}
      >
        <Image
          src="/logo-negro.png"
          alt="Om Domo"
          width={size}
          height={size}
          className="object-contain w-full h-full"
        />
      </div>

      {showStars && (
        <svg
          width={S}
          height={S}
          viewBox={`0 0 ${S} ${S}`}
          className="absolute pointer-events-none"
          style={{
            left: `${(size - S) / 2}px`,
            top: `${(size - S) / 2}px`,
            zIndex: 10,
            overflow: "visible",
          }}
          aria-hidden
        >
          <defs>
            <filter id="om-star-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[0, 1, 2].map((i) => (
            <g key={i} filter="url(#om-star-glow)">
              {/* Motion along arc */}
              <animateMotion
                dur={dur}
                begin={`${i * 0.42}s`}
                repeatCount="indefinite"
                path={path}
              />
              {/* Fade: appear, travel, disappear, wait */}
              <animate
                attributeName="opacity"
                values="0;0;1;1;0;0"
                keyTimes="0;0.03;0.1;0.42;0.5;1"
                dur={dur}
                begin={`${i * 0.42}s`}
                repeatCount="indefinite"
              />
              {/* 4-pointed sparkle like Disney */}
              <circle r="1.7" fill="white" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
              <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.55" />
              <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.55" />
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

// ─── Hero Logo — Om Domo con anillos + badge web3 ────────────────────────────
function HeroLogo() {
  const logoSize = 164;
  const W = 300;

  return (
    <div className="flex flex-col items-center gap-0" style={{ width: W }}>
      {/* ── Visual: glow + rings + logo ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: W, height: W }}
      >
        {/* Static background glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: logoSize + 90,
            height: logoSize + 90,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(8,145,178,0.10) 48%, transparent 72%)",
            filter: "blur(24px)",
          }}
        />

        {/* Pulsing glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: logoSize,
            height: logoSize,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(8,145,178,0.15) 55%, transparent 80%)",
            filter: "blur(20px)",
          }}
          animate={{ scale: [1, 1.38, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: logoSize + 6,
              height: logoSize + 6,
              border: "1px solid rgba(124,58,237,0.48)",
            }}
            animate={{ scale: [1, 2.2], opacity: [0.42, 0] }}
            transition={{ duration: 3.8, delay: i * 1.26, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        {/* Logo */}
        <div
          className="relative rounded-full overflow-hidden bg-white z-10 flex-shrink-0"
          style={{
            width: logoSize,
            height: logoSize,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.12), 0 0 52px rgba(124,58,237,0.30), 0 0 100px rgba(8,145,178,0.15)",
          }}
        >
          <Image
            src="/logo-negro.png"
            alt="Om Domo"
            width={logoSize}
            height={logoSize}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>

      {/* ── "web3 ecosystem" badge — debajo del logo ── */}
      <motion.div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border pointer-events-none -mt-8 z-20"
        style={{
          borderColor: "rgba(124,58,237,0.3)",
          background: "rgba(12,6,14,0.7)",
          backdropFilter: "blur(8px)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "linear-gradient(135deg,#9333ea,#06b6d4)" }}
        />
        <span
          className="gradient-text font-mono font-semibold tracking-[0.22em] uppercase"
          style={{ fontSize: "11px" }}
        >
          Web3 Ecosystem
        </span>
      </motion.div>
    </div>
  );
}

// ─── NFT Genesis Section ──────────────────────────────────────────────────────
const RARITY_TIERS = [
  { name: "Genesis", color: "#f59e0b", glow: "rgba(245,158,11,0.4)", desc: "Antes de Jun 2026 — rareza máxima", supply: "~200 NFTs" },
  { name: "Founder", color: "#9333ea", glow: "rgba(147,51,234,0.4)", desc: "Primer mes post-lanzamiento", supply: "~500 NFTs" },
  { name: "Community", color: "#0891b2", glow: "rgba(8,145,178,0.4)", desc: "Primeros 3 meses", supply: "~2.000 NFTs" },
  { name: "Standard", color: "#64748b", glow: "rgba(100,116,139,0.3)", desc: "Resto de la colección", supply: "Ilimitado" },
];

const NFT_BENEFITS = [
  { icon: "🔑", title: "Acceso DAO", desc: "Vota en las decisiones del proyecto" },
  { icon: "💎", title: "OMMY rewards", desc: "10.000 OMMY en el Genesis Drop" },
  { icon: "👕", title: "Certificado físico", desc: "Prueba de autenticidad on-chain" },
  { icon: "🚀", title: "Acceso anticipado", desc: "Primero en futuros drops y colecciones" },
  { icon: "🌙", title: "NFT dinámico", desc: "Evoluciona con tu actividad (Fase 2)" },
  { icon: "🏛️", title: "Gobernanza", desc: "Tu NFT = tu voz en la comunidad" },
];

function HolographicCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setRotate({ x: ((y - cy) / cy) * -12, y: ((x - cx) / cx) * 12 });
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
    setHovered(false);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "900px", cursor: "pointer" }}
      className="w-64 mx-auto select-none"
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y, scale: hovered ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d", borderRadius: "20px", position: "relative" }}
      >
        {/* Card body */}
        <div
          style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #1a0533 0%, #0c1a2e 50%, #0a0c1a 100%)",
            border: "1px solid rgba(147,51,234,0.4)",
            overflow: "hidden",
            boxShadow: hovered
              ? "0 30px 80px rgba(147,51,234,0.35), 0 0 40px rgba(245,158,11,0.15)"
              : "0 10px 40px rgba(0,0,0,0.5)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Holographic shimmer overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%),
                linear-gradient(105deg, transparent 20%, rgba(245,158,11,0.08) 40%, rgba(147,51,234,0.1) 60%, transparent 80%)`,
              transition: "background-image 0.05s",
              pointerEvents: "none",
              zIndex: 10,
              borderRadius: "20px",
            }}
          />

          {/* Header */}
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Om Domo</span>
              <span style={{
                fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                background: "linear-gradient(90deg, #f59e0b, #d97706)",
                color: "#000", letterSpacing: "0.08em",
              }}>GENESIS</span>
            </div>
          </div>

          {/* Art area */}
          <div style={{ height: "180px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a0533, #060308)" }}>
            {/* Animated rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: `${80 + i * 50}px`, height: `${80 + i * 50}px`,
                  borderRadius: "50%",
                  border: `1px solid rgba(${i === 0 ? "245,158,11" : i === 1 ? "147,51,234" : "8,145,178"},${0.6 - i * 0.15})`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 8 + i * 4, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              />
            ))}
            {/* Center symbol */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              fontSize: "48px", filter: "drop-shadow(0 0 20px rgba(245,158,11,0.8))",
            }}>
              <motion.span
                animate={{ scale: [1, 1.1, 1], filter: ["drop-shadow(0 0 12px rgba(245,158,11,0.6))", "drop-shadow(0 0 24px rgba(245,158,11,0.9))", "drop-shadow(0 0 12px rgba(245,158,11,0.6))"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "block" }}
              >🕉️</motion.span>
            </div>
            {/* Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  width: "3px", height: "3px", borderRadius: "50%",
                  background: i % 2 === 0 ? "#f59e0b" : "#9333ea",
                  left: `${15 + (i * 10)}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{ y: [-8, 8, -8], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              />
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "14px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>Om Domo Genesis #001</div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>Avalanche · ERC-1155</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>Reward</div>
                <div style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(90deg, #9333ea, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>+10K OMMY</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NFTGenesisSection() {
  return (
    <section id="nft" className="section-dark py-24 px-6 relative overflow-hidden">
      <Orb className="w-[600px] h-[600px] bg-purple-700 -top-40 left-1/2 -translate-x-1/2" />
      <Orb className="w-[400px] h-[400px] bg-amber-600 bottom-0 right-0 opacity-10" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="text-xs text-amber-500 uppercase tracking-widest font-medium">Colección NFT</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "var(--dark-text)" }}>
            Cada compra, un <span className="gradient-text-gold">NFT único</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--dark-muted)" }}>
            Compra ropa Om Domo y recibe automáticamente tu NFT de autenticidad en Avalanche.
            Cuanto antes entres, mayor rareza.
          </p>
        </FadeIn>

        {/* Main content: card + benefits */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">

          {/* Holographic card */}
          <FadeIn delay={0.1}>
            <div className="relative">
              <HolographicCard />
              {/* Label below */}
              <motion.p
                className="text-center text-xs mt-6"
                style={{ color: "var(--dark-muted)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦ Mueve el cursor sobre la carta
              </motion.p>
            </div>
          </FadeIn>

          {/* Benefits grid */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {NFT_BENEFITS.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    padding: "16px",
                    cursor: "default",
                  }}
                >
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>{b.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9", marginBottom: "4px" }}>{b.title}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>{b.desc}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Rarity tiers */}
        <FadeIn delay={0.3}>
          <div className="mb-6 text-center">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "var(--dark-muted)" }}>Sistema de rareza</span>
            <p className="text-sm mt-1" style={{ color: "var(--dark-muted)" }}>Cuanto antes compres, mayor será la rareza de tu NFT</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RARITY_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${tier.color}40`,
                  borderRadius: "16px",
                  padding: "20px 16px",
                  textAlign: "center",
                  boxShadow: i === 0 ? `0 0 30px ${tier.glow}` : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {i === 0 && (
                  <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    fontSize: "8px", fontWeight: 700, padding: "2px 6px",
                    borderRadius: "10px", background: tier.color, color: "#000",
                  }}>AHORA</div>
                )}
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", margin: "0 auto 12px",
                  background: `${tier.color}20`, border: `2px solid ${tier.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 16px ${tier.glow}`,
                }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: tier.color }} />
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: tier.color, marginBottom: "4px" }}>{tier.name}</div>
                <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", lineHeight: 1.3 }}>{tier.desc}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>{tier.supply}</div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.4} className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/drops"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000" }}
            >
              🔥 Ver Genesis Drop — €89
            </a>
            <a
              href="/claim"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
            >
              🎁 Ya compré — Reclamar NFT
            </a>
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--dark-muted)" }}>
            NFT automático · Sin gas para el cliente · Red Avalanche
          </p>
        </FadeIn>

      </div>
    </section>
  );
}

// ─── Pre-compra section ───────────────────────────────────────────────────────
function PreCompraSection() {
  const SUPPLY_PRECOMPRA = "2,997,924,580";
  return (
    <section id="precompra" className="section-dark-2 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn className="text-center mb-14">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-medium">Acceso anticipado</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "var(--dark-text)" }}>
            Pre-compra <span className="gradient-text-gold">OMMY</span>
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--dark-muted)" }}>
            El 10% del supply está reservado para early adopters antes del lanzamiento oficial en Junio 2026.
            Los tokens se bloquean 30 días para mantener la estabilidad del token al lanzamiento.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Supply disponible", value: `${SUPPLY_PRECOMPRA}`, sub: "OMMY — 10% del total", icon: "🪙", color: "border-amber-500/30" },
            { label: "Precio pre-compra", value: "$0.001", sub: "Precio de lanzamiento", icon: "💰", color: "border-green-500/30" },
            { label: "Lock post-lanzamiento", value: "30 días", sub: "Liberación Julio 2026", icon: "🔒", color: "border-purple-500/30" },
          ].map((item) => (
            <FadeIn key={item.label}>
              <div className={`glass rounded-2xl p-6 border ${item.color} text-center`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--dark-muted)" }}>{item.label}</p>
                <p className="text-2xl font-black font-mono gradient-text-gold">{item.value}</p>
                <p className="text-xs mt-1" style={{ color: "var(--dark-muted)" }}>{item.sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="glass rounded-2xl p-6 border border-amber-500/20 mb-6">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--dark-muted)" }}>¿Por qué el lock de 30 días?</p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[
                { icon: "📊", text: "Evita venta masiva inmediata que desestabiliza el precio al lanzar" },
                { icon: "🤝", text: "Premia a los early adopters que creen en el proyecto a largo plazo" },
                { icon: "💎", text: "Señal de confianza: el 60% del supply está en comunidad y quema" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <p style={{ color: "var(--dark-muted)" }} className="text-xs leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn className="text-center">
          <p className="text-xs mb-4" style={{ color: "var(--dark-muted)" }}>
            La pre-compra se activa al conectar tu wallet. El mecanismo de pago estará disponible próximamente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-amber-900/30"
            >
              <Unlock size={16} /> Conectar wallet
            </a>
            <a
              href="#waitlist"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ borderColor: "var(--dark-border)", color: "var(--dark-muted)" }}
            >
              Registrar interés →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Proyectos Sustentables ───────────────────────────────────────────────────
function ProyectosSustentables() {
  return (
    <section id="sustentable" className="section-cream py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <span className="text-xs text-green-600 uppercase tracking-widest font-medium">Impacto real</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4 text-cream-text">
            Proyectos <span className="gradient-text">Sustentables</span>
          </h2>
          <p className="text-cream-muted max-w-xl mx-auto text-sm">
            Om Domo integra sostenibilidad en cada capa del ecosistema — desde cómo fabricamos la ropa hasta cómo recompensamos tu bienestar diario.
            La DAO vota qué iniciativas apoyar cada trimestre.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {[
            {
              icon: "🌳",
              title: "Reforestación activa",
              desc: "Plantación de especies adaptadas al ecosistema local de cada zona de intervención, trabajando con comunidades y expertos en restauración ambiental.",
              tag: "Medioambiente",
              color: "border-green-300",
              tagColor: "bg-green-50 text-green-700 border-green-200",
            },
            {
              icon: "👕",
              title: "Moda con materiales renovables",
              desc: "Toda la ropa Om Domo se fabrica con algodón orgánico, fibras recicladas y tintes naturales. Cada prenda lleva su huella de carbono certificada.",
              tag: "Producto",
              color: "border-emerald-300",
              tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
            },
            {
              icon: "📦",
              title: "Producción bajo demanda",
              desc: "Sin stock masivo. Cada prenda se produce cuando se pide, eliminando el desperdicio textil y reduciendo emisiones de CO₂ en un 60% vs. moda tradicional.",
              tag: "CO₂ Reducción",
              color: "border-teal-300",
              tagColor: "bg-teal-50 text-teal-700 border-teal-200",
            },
            {
              icon: "🧘",
              title: "dApp Bienestar Consciente",
              desc: "Meditación, yoga, running, arte y música generan OMMY verificados on-chain. Incentivamos hábitos que mejoran la vida, no solo la economía.",
              tag: "Fase 3 · dApp",
              color: "border-purple-300",
              tagColor: "bg-purple-50 text-purple-700 border-purple-200",
            },
            {
              icon: "🎨",
              title: "Arte y creatividad",
              desc: "Actividades creativas — pintura, música, escritura — también generan recompensas. Creemos que la expresión artística es bienestar colectivo.",
              tag: "Comunidad",
              color: "border-pink-300",
              tagColor: "bg-pink-50 text-pink-700 border-pink-200",
            },
            {
              icon: "⚡",
              title: "Energía limpia",
              desc: "Apoyo a comunidades sin acceso a energía estable mediante instalaciones solares compartidas, financiadas parcialmente por el DAO Treasury.",
              tag: "Infraestructura",
              color: "border-yellow-300",
              tagColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
            },
          ].map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <div className={`card-cream-hover p-6 h-full border-t-4 ${p.color}`}>
                <div className="text-4xl mb-4">{p.icon}</div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${p.tagColor}`}>{p.tag}</span>
                <h3 className="text-base font-bold text-cream-text mt-3 mb-2">{p.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="text-3xl flex-shrink-0">🗳</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream-text mb-1">La comunidad decide qué construimos juntos</p>
                <p className="text-xs text-cream-muted">
                  Los proyectos se seleccionan por votación DAO cada trimestre. Cualquier holder NFT puede proponer iniciativas.
                  Fase 4 activa desde Jun 2027.
                </p>
              </div>
              <a
                href="#waitlist"
                className="flex-shrink-0 text-xs px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold hover:bg-green-100 transition-colors whitespace-nowrap"
              >
                Unirme →
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Guías Web3 ───────────────────────────────────────────────────────────────
const GUIAS = [
  {
    icon: "👛",
    title: "Cómo crear tu wallet",
    content: [
      "1. Descarga MetaMask en metamask.io (extensión Chrome o app móvil).",
      "2. Crea una nueva wallet y guarda las 12 palabras secretas (seed phrase) en un lugar físico seguro. Nunca las compartas.",
      "3. En MetaMask, añade la red Avalanche: Ajustes → Redes → Añadir red → busca 'Avalanche C-Chain'.",
      "4. Ya tienes tu wallet lista para conectar a Om Domo.",
    ],
  },
  {
    icon: "🔗",
    title: "Cómo conectar tu wallet",
    content: [
      "1. Ve a web3.omdomo.com/dashboard o haz clic en 'Conectar wallet' en la navegación.",
      "2. Selecciona tu wallet (MetaMask u otras compatibles).",
      "3. Aprueba la conexión en la ventana de MetaMask.",
      "4. Una vez conectada verás tu balance de OMMY y tus NFTs en el dashboard.",
    ],
  },
  {
    icon: "📖",
    title: "Glosario de términos",
    content: [
      "🔷 Avalanche — Blockchain rápida y de bajo costo donde vive OMMY Coin. Alternativa a Ethereum.",
      "🧪 Fuji Testnet — Red de pruebas de Avalanche. Permite probar sin dinero real antes del lanzamiento.",
      "🌐 Mainnet — La red real de producción. Cuando pases de Fuji a Mainnet, los tokens tienen valor real.",
      "🎨 NFT — Token no fungible. Un activo digital único. Cada compra en Om Domo genera tu propio NFT.",
      "🏛 DAO — Organización autónoma descentralizada. La comunidad vota decisiones del proyecto con sus NFTs.",
      "💱 DEX — Exchange descentralizado. Intercambia OMMY sin intermediarios, directo en la blockchain.",
      "⛏ Staking — Bloquear tokens para ganar recompensas pasivas (50 OMMY/día por NFT en stake).",
      "🔥 Burn — Quemar tokens para reducir el supply y aumentar la escasez de OMMY.",
    ],
  },
  {
    icon: "🖥",
    title: "Cómo usar el dashboard",
    content: [
      "1. Accede a web3.omdomo.com/dashboard con tu wallet conectada.",
      "2. Panel izquierdo: tu balance OMMY, NFTs, y estado de staking.",
      "3. Panel central: chat con los agentes AI del ecosistema Om Domo.",
      "4. Panel derecho: roadmap de las 5 fases y estado actual del proyecto.",
      "5. Desde /claim puedes reclamar tu NFT tras una compra en omdomo.com.",
    ],
  },
];

function GuiasWeb3() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="guias" className="section-cream-2 py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-14">
          <span className="text-xs text-purple-600 uppercase tracking-widest font-medium">Aprende Web3</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4 text-cream-text">
            Guías para <span className="gradient-text">empezar</span>
          </h2>
          <p className="text-cream-muted max-w-xl mx-auto text-sm">
            ¿Nuevo en crypto? No pasa nada. Aquí tienes todo lo que necesitas para entrar al ecosistema Om Domo desde cero.
          </p>
        </FadeIn>

        <div className="space-y-3">
          {GUIAS.map((g, i) => (
            <FadeIn key={g.title} delay={i * 0.07}>
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.icon}</span>
                    <span className="font-semibold text-cream-text text-sm">{g.title}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-stone-400 flex-shrink-0"
                  >
                    ▾
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-stone-100">
                        <ul className="mt-4 space-y-2.5">
                          {g.content.map((line, j) => (
                            <li key={j} className="text-sm text-cream-muted leading-relaxed">{line}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comunidad Dev — GitHub + Discord + Feedback ──────────────────────────────
function ComunidadDev() {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
  }

  return (
    <section id="comunidad-dev" className="section-dark py-24 px-6 relative overflow-hidden">
      <Orb className="w-[400px] h-[400px] bg-indigo-800 -top-20 -right-20" />
      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn className="text-center mb-14">
          <span className="text-xs text-indigo-400 uppercase tracking-widest font-medium">Open source</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "var(--dark-text)" }}>
            Construye con <span className="gradient-text">nosotros</span>
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--dark-muted)" }}>
            Om Domo es un proyecto abierto. Cualquier persona puede contribuir código, ideas o reportar mejoras.
            Las propuestas se publican en GitHub y Discord para que la comunidad las trabaje.
          </p>
        </FadeIn>

        {/* GitHub + Discord */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <FadeIn>
            <motion.a
              href="https://github.com/omdomocom/omdomo-web3"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-7 border border-slate-700/40 hover:border-slate-500/60 transition-all flex flex-col gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-md">
                  <IconGitHub size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--dark-text)" }}>GitHub</p>
                  <p className="text-xs" style={{ color: "var(--dark-muted)" }}>omdomocom/omdomo-web3</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--dark-muted)" }}>
                Código abierto. Crea un fork, propón mejoras con Pull Requests o reporta bugs en Issues. Cada contribución se revisa y se integra al proyecto.
              </p>
              <span className="text-xs text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">Ver repositorio →</span>
            </motion.a>
          </FadeIn>

          <FadeIn delay={0.1}>
            <motion.a
              href="https://discord.gg/xXezFXnpaX"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-7 border border-slate-700/40 hover:border-indigo-500/40 transition-all flex flex-col gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md shadow-indigo-900/40">
                  <IconDiscord size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--dark-text)" }}>Discord</p>
                  <p className="text-xs" style={{ color: "var(--dark-muted)" }}>Comunidad Om Domo</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--dark-muted)" }}>
                El hub de la comunidad. Discute ideas, coordina proyectos, conecta con otros builders y accede a canales exclusivos para holders NFT.
              </p>
              <span className="text-xs text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">Unirse al servidor →</span>
            </motion.a>
          </FadeIn>
        </div>

        {/* Feedback form */}
        <FadeIn>
          <div className="glass rounded-2xl p-7 border border-slate-700/40">
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-amber-400" />
              <span className="text-sm font-bold" style={{ color: "var(--dark-text)" }}>Enviar feedback</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-400 border border-indigo-800/40 ml-1">→ GitHub Issues + Discord</span>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--dark-muted)" }}>
              Tu mejora se publicará como Issue en GitHub y se compartirá en Discord para que la comunidad pueda trabajar en ella.
            </p>
            {feedbackSent ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 py-4">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-sm font-bold text-green-400">¡Gracias por tu feedback!</p>
                  <p className="text-xs" style={{ color: "var(--dark-muted)" }}>Se publicará en GitHub Issues y Discord en las próximas horas.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={submitFeedback} className="flex flex-col gap-3">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Describe tu sugerencia o mejora... (ej: 'Sería útil poder ver el historial de mis OMMY ganados')"
                  required
                  rows={3}
                  className="w-full glass rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-indigo-500/60"
                  style={{ color: "var(--dark-text)", borderColor: "var(--dark-border)" }}
                />
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Enviar mejora →
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function LandingPage() {
  const countdown = useCountdown();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);

  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  useGsapHero(heroTitleRef, orb1Ref, orb2Ref, orb3Ref);

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
            <OmDomoLogo size={32} />
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
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden" style={{ background: "#060308" }}>
        {/* Universe canvas — interactive space-time distortion */}
        <SpaceBackground />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Hero logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-0"
          >
            <HeroLogo />
          </motion.div>

          {/* Title — Om Domo right below logo */}
          <motion.h1
            ref={heroTitleRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-6xl md:text-8xl font-bold leading-[1.05] mb-6 tracking-tight"
          >
            <motion.span
              className="shimmer-omdomo italic block"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              style={{ display: "inline-block" }}
            >
              Om Domo
            </motion.span>
          </motion.h1>

          {/* Testnet badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "backOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-900/20 text-purple-300 text-xs font-medium mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"
            />
            Testnet Fuji activa — Prueba gratis ahora
          </motion.div>

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
      <section id="como-funciona" className="section-cream py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-xs text-purple-600 uppercase tracking-widest font-medium">El ecosistema</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4 text-cream-text">
              Compra. Gana. <span className="gradient-text">Pertenece.</span>
            </h2>
            <p className="text-cream-muted max-w-xl mx-auto">
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
                color: "from-cyan-600 to-blue-500",
                tag: "NFT + Token reward",
              },
              {
                step: "03",
                icon: <Users size={24} />,
                title: "Accede a la comunidad",
                desc: "Tu NFT te abre las puertas a una comunidad exclusiva, vota en la DAO y acceso anticipado a drops.",
                color: "from-green-500 to-emerald-500",
                tag: "DAO + Discord + Drops",
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15}>
                <div className="card-cream-hover p-6 h-full group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="text-4xl font-black font-mono" style={{ color: "var(--cream-border)", opacity: 0.6 }}>{item.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-cream-text mb-2">{item.title}</h3>
                  <p className="text-sm text-cream-muted leading-relaxed mb-4">{item.desc}</p>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cream-2 text-cream-muted border border-cream-border">{item.tag}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── REWARDS TABLE ────────────────────────────────────────────── */}
      <FadeIn>
        <section className="section-cream-2 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs text-cyan-600 uppercase tracking-widest font-medium">Gamificación</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 text-cream-text">Cada acción vale <span className="gradient-text">OMMY</span></h2>
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
                      ? "border-purple-400/40 bg-purple-50 shadow-sm"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    r.hot ? "bg-purple-100 text-purple-600" : "bg-stone-100 text-stone-500"
                  }`}>
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-700 truncate font-medium">{r.action}</p>
                    <p className={`text-xs font-bold ${r.hot ? "gradient-text" : "text-stone-500"}`}>{r.reward}</p>
                  </div>
                  {r.hot && <Flame size={12} className="text-orange-500 flex-shrink-0" />}
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

            {/* Donut chart — distribución del supply */}
            <FadeIn delay={0.2}>
              <div className="glass rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-5">
                  <Coins size={16} className="text-purple-400" />
                  <span className="text-sm font-bold text-purple-300">Distribución del supply</span>
                </div>
                <DonutChart />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PRE-COMPRA ───────────────────────────────────────────────── */}
      {/* ── NFT GENESIS ──────────────────────────────────────────────── */}
      <NFTGenesisSection />

      <PreCompraSection />

      {/* ── ECOSISTEMA ───────────────────────────────────────────────── */}
      <section id="ecosistema" className="section-cream py-24 px-6 relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-purple-700 top-0 left-1/2 -translate-x-1/2 opacity-10" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-xs text-purple-600 uppercase tracking-widest font-medium">Arquitectura</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4 text-cream-text">
              Un ecosistema <span className="gradient-text">completo</span>
            </h2>
            <p className="text-cream-muted max-w-xl mx-auto text-sm">
              Cada pieza está conectada. Comprar, crear, moverse y votar generan valor real en la blockchain.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                icon: "🛍",
                title: "Tienda física",
                desc: "Compra ropa consciente en omdomo.com y activa recompensas Web3 automáticamente.",
                badge: "Shopify + Avalanche",
                color: "border-purple-500/30 hover:border-purple-500/60",
                badgeColor: "bg-purple-900/30 text-purple-300",
                size: "md:col-span-1",
              },
              {
                icon: "🎨",
                title: "NFTs por compra",
                desc: "Cada prenda genera un NFT único del diseño. Arte digital que es tuyo.",
                badge: "ERC-1155 · Genesis NFT",
                color: "border-cyan-500/30 hover:border-cyan-500/60",
                badgeColor: "bg-cyan-900/30 text-cyan-300",
                size: "md:col-span-1",
              },
              {
                icon: "🪙",
                title: "OMMY Coin",
                desc: "Token deflacionario. Cada compra quema supply. Gana OMMY con cada acción.",
                badge: "ERC-20 · Avalanche",
                color: "border-orange-500/30 hover:border-orange-500/60",
                badgeColor: "bg-orange-900/30 text-orange-300",
                size: "md:col-span-1",
              },
              {
                icon: "🏛",
                title: "DAO — Vota diseños",
                desc: "Los holders NFT votan las próximas colecciones, precios y decisiones del proyecto.",
                badge: "Gobernanza on-chain",
                color: "border-green-500/30 hover:border-green-500/60",
                badgeColor: "bg-green-900/30 text-green-300",
                size: "md:col-span-1",
              },
              {
                icon: "📱",
                title: "App Conscious",
                desc: "Medita, corre, practica yoga. Cada actividad verificada genera OMMY y NFT achievements.",
                badge: "Proof of Activity · Fase 3",
                color: "border-pink-500/30 hover:border-pink-500/60",
                badgeColor: "bg-pink-900/30 text-pink-300",
                size: "md:col-span-1",
              },
              {
                icon: "⚡",
                title: "Intercambia OMMY",
                desc: "Liquidez en DEX de Avalanche. Compra, vende o haz staking de tus tokens.",
                badge: "DEX · 15% liquidez",
                color: "border-amber-500/30 hover:border-amber-500/60",
                badgeColor: "bg-amber-900/30 text-amber-300",
                size: "md:col-span-1",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`glass rounded-2xl p-5 border ${item.color} transition-all h-full flex flex-col gap-3`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Connecting line visual */}
          <FadeIn delay={0.5}>
            <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
              {["Compra", "→", "NFT", "→", "OMMY", "→", "DAO", "→", "App", "→", "DEX"].map((item, i) => (
                <span
                  key={i}
                  className={item === "→"
                    ? "text-stone-400 font-bold text-sm"
                    : "text-xs px-3 py-1.5 rounded-full bg-white text-stone-900 font-semibold border border-stone-200 shadow-sm"
                  }
                >
                  {item}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PROYECTOS SUSTENTABLES ───────────────────────────────────── */}
      <ProyectosSustentables />

      {/* ── GUÍAS WEB3 ───────────────────────────────────────────────── */}
      <GuiasWeb3 />

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
      <section id="comunidad" className="section-cream-2 py-24 px-6 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-cyan-600 -bottom-40 -left-20" />

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-xs text-cyan-600 uppercase tracking-widest font-medium">Comunidad</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4 text-cream-text">
              Únete. <span className="gradient-text">Crece. Gana.</span>
            </h2>
            <p className="text-cream-muted max-w-xl mx-auto">
              Síguenos para no perderte drops, premios, guías de wallet,
              avances del proyecto y acceso anticipado.
            </p>
          </FadeIn>

          {/* RRSS Carrusel — todas del mismo tamaño */}
          <SocialsCarousel />

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

      {/* ── COMUNIDAD DEV ────────────────────────────────────────────── */}
      <ComunidadDev />

      {/* ── WAITLIST ─────────────────────────────────────────────────── */}
      <section id="waitlist" className="section-cream py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <div className="bg-white rounded-3xl p-10 border border-stone-200 shadow-xl relative overflow-hidden">
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-t-3xl" />

              <div className="relative z-10">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="font-serif text-3xl font-bold mb-3 text-stone-900">
                  Acceso <span className="gradient-text">anticipado</span>
                </h2>
                <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                  Entra en la lista de espera. Serás de los primeros en comprar OMMY
                  al precio de lanzamiento y recibir el drop Genesis con máxima rareza.
                </p>

                <div className="flex items-center gap-3 justify-center flex-wrap mb-6">
                  {[
                    "NFT Genesis (rareza máxima)",
                    "Precio lanzamiento $0.001",
                    "+1,000 OMMY bonus",
                  ].map((b) => (
                    <span key={b} className="text-xs px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-medium">
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
                    <p className="text-green-600 font-bold text-lg">¡Estás en la lista!</p>
                    <p className="text-stone-400 text-sm">
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
                      className="flex-1 rounded-xl px-5 py-4 text-sm text-stone-800 placeholder-stone-400 border border-stone-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 bg-stone-50"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap shadow-md shadow-purple-200"
                    >
                      Unirme →
                    </motion.button>
                  </form>
                )}
                <p className="text-xs text-stone-400 mt-4">
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
              <OmDomoLogo size={36} />
              <div>
                <p className="font-bold text-sm gradient-text">Om Domo</p>
                <p className="text-xs text-slate-600">Web3 Om Domo</p>
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

            <div className="flex items-center gap-3 text-xs flex-wrap justify-center">
              <a href="/claim" className="text-slate-500 hover:text-slate-300 transition-colors">Reclamar NFT</a>
              <a href="/drops" className="text-orange-500 hover:text-orange-300 transition-colors">Drops</a>
              <a href="/dashboard" className="text-slate-600 hover:text-slate-400 transition-colors">Dashboard</a>
              <a href="https://github.com/omdomocom/omdomo-web3" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-300 transition-colors flex items-center gap-1"><IconGitHub size={12} /> GitHub</a>
              <a href="https://discord.gg/xXezFXnpaX" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-400 transition-colors flex items-center gap-1"><IconDiscord size={12} /> Discord</a>
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
