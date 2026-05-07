"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, avalanche } from "@/lib/thirdweb";
import { WALLET_DISTRIBUTION } from "@/lib/tokenomics";
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
  Activity,
  Music,
  Palette,
  ArrowLeftRight,
  CheckCircle2,
  Circle,
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

// ─── SmartJoinCTA ─────────────────────────────────────────────────────────────
function SmartJoinCTA({ className }: { className?: string }) {
  const account = useActiveAccount();
  const router = useRouter();
  if (account) {
    return (
      <button
        onClick={() => router.push("/dashboard")}
        className={className ?? "flex-shrink-0 text-xs px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-semibold hover:bg-orange-100 transition-colors whitespace-nowrap cursor-pointer"}
      >
        Ir al Dashboard →
      </button>
    );
  }
  return (
    <ConnectButton
      client={client}
      chain={avalanche}
      connectButton={{
        label: "Conectar",
        className: "!flex-shrink-0 !text-xs !px-4 !py-2 !rounded-xl !bg-gradient-to-r !from-orange-500 !to-amber-500 !text-white !font-semibold hover:!opacity-90 !transition-opacity !whitespace-nowrap !cursor-pointer",
      }}
      onConnect={() => router.push("/dashboard")}
    />
  );
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-08-15T18:00:00Z");

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
  const inView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
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
// Colores en el mismo orden que WALLET_DISTRIBUTION en tokenomics.ts
const DONUT_COLORS = ["#9333ea", "#f97316", "#0891b2", "#f59e0b", "#10b981", "#eab308", "#6366f1", "#ec4899"];
const DISTRIBUTION = WALLET_DISTRIBUTION.map((seg, i) => ({
  label: seg.label,
  pct:   seg.percent,
  color: DONUT_COLORS[i] ?? "#9333ea",
}));

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
  { name: "Genesis", color: "#f59e0b", glow: "rgba(245,158,11,0.4)", desc: "Antes de Ago 2026 — rareza máxima", supply: "~200 NFTs" },
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

// ─── NFT Types Section ────────────────────────────────────────────────────────

interface NFTType {
  name: string;
  subtitle: string;
  rarity: string;
  rarityColor: string;
  glowColor: string;
  trigger: string;
  price: string;
  rewards: string;
  bonus: string;
  symbol: string;
  gradient: string;
  borderColor: string;
}

const NFT_TYPES: NFTType[] = [
  {
    name: "Om Hoodie Genesis",
    subtitle: "Edición Fundadora",
    rarity: "Genesis",
    rarityColor: "#FFD700",
    glowColor: "rgba(255,215,0,0.25)",
    trigger: "Compra hoodie €89+",
    price: "€89",
    rewards: "6.230 OMMY",
    bonus: "+1.000 OMMY claim + NFT 1ª hora",
    symbol: "🧘",
    gradient: "linear-gradient(135deg, #1a1200 0%, #3d2b00 50%, #1a1200 100%)",
    borderColor: "rgba(255,215,0,0.4)",
  },
  {
    name: "Yogi Jogger Founder",
    subtitle: "Edición Fundadora",
    rarity: "Founder",
    rarityColor: "#C0C0C0",
    glowColor: "rgba(192,192,192,0.2)",
    trigger: "Compra jogger €69+",
    price: "€69",
    rewards: "4.830 OMMY",
    bonus: "+1.000 OMMY al reclamar",
    symbol: "🌿",
    gradient: "linear-gradient(135deg, #0d0d0d 0%, #1e1e1e 50%, #0d0d0d 100%)",
    borderColor: "rgba(192,192,192,0.3)",
  },
  {
    name: "Conscious Tee",
    subtitle: "Edición Comunidad",
    rarity: "Community",
    rarityColor: "#4FC3F7",
    glowColor: "rgba(79,195,247,0.2)",
    trigger: "Compra tee €39+",
    price: "€39",
    rewards: "2.730 OMMY",
    bonus: "+1.000 OMMY al reclamar",
    symbol: "☀️",
    gradient: "linear-gradient(135deg, #001a2e 0%, #002a45 50%, #001a2e 100%)",
    borderColor: "rgba(79,195,247,0.3)",
  },
  {
    name: "Ommie",
    subtitle: "Acceso Estándar",
    rarity: "Standard",
    rarityColor: "#81C784",
    glowColor: "rgba(129,199,132,0.2)",
    trigger: "Cualquier compra",
    price: "Desde €25",
    rewards: "1.750 OMMY",
    bonus: "+1.000 OMMY al reclamar",
    symbol: "🕉️",
    gradient: "linear-gradient(135deg, #001a00 0%, #002a00 50%, #001a00 100%)",
    borderColor: "rgba(129,199,132,0.3)",
  },
];

function NFTTypeCard({ nft, index }: { nft: NFTType; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: nft.gradient,
        border: `1px solid ${hovered ? nft.rarityColor : nft.borderColor}`,
        borderRadius: 16,
        padding: "28px 24px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: hovered
          ? `0 0 32px ${nft.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`
          : `0 4px 16px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Glow pulse on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 0%, ${nft.glowColor} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Rarity badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: `${nft.rarityColor}22`,
          border: `1px solid ${nft.rarityColor}66`,
          borderRadius: 20,
          padding: "3px 10px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: nft.rarityColor,
            boxShadow: `0 0 6px ${nft.rarityColor}`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: nft.rarityColor,
            textTransform: "uppercase",
          }}
        >
          {nft.rarity}
        </span>
      </div>

      {/* Symbol + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <motion.div
          animate={{ scale: hovered ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ fontSize: 36, lineHeight: 1 }}
        >
          {nft.symbol}
        </motion.div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 20,
              fontWeight: 700,
              color: "#f5f0e8",
              marginBottom: 2,
              lineHeight: 1.2,
            }}
          >
            {nft.name}
          </h3>
          <p style={{ fontSize: 12, color: "var(--dark-muted)", fontStyle: "italic" }}>
            {nft.subtitle}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${nft.rarityColor}44, transparent)`,
          margin: "16px 0",
        }}
      />

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--dark-muted)" }}>Trigger</span>
          <span style={{ fontSize: 13, color: "#f5f0e8", fontWeight: 500 }}>{nft.trigger}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--dark-muted)" }}>OMMY rewards</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: nft.rarityColor }}>
            {nft.rewards}
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--dark-muted)",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 8,
            padding: "6px 10px",
            borderLeft: `2px solid ${nft.rarityColor}66`,
          }}
        >
          {nft.bonus}
        </div>
      </div>

      {/* Price tag */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          fontSize: 13,
          fontWeight: 800,
          color: nft.rarityColor,
          background: `${nft.rarityColor}18`,
          border: `1px solid ${nft.rarityColor}44`,
          borderRadius: 8,
          padding: "4px 10px",
        }}
      >
        {nft.price}
      </div>
    </motion.div>
  );
}

function NFTTypesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-cream py-24 px-6 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,160,120,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(180,160,120,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <span
              style={{
                display: "inline-block",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B7355",
                marginBottom: 12,
              }}
            >
              Colección NFT
            </span>
            <h2
              className="gradient-text-gold"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              4 Tipos de NFT Om Domo
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "#5a4a3a",
                maxWidth: 560,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Cada prenda que compras en omdomo.com genera un NFT único en Avalanche.
              La rareza depende de cuándo compras — los primeros siempre serán los más valiosos.
            </p>
          </div>
        </FadeIn>

        {/* 4 cards grid */}
        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {NFT_TYPES.map((nft, i) => (
            <NFTTypeCard key={nft.rarity} nft={nft} index={i} />
          ))}
        </div>

        {/* Rareza timeline */}
        <FadeIn>
          <div
            style={{
              background: "rgba(139,115,85,0.08)",
              border: "1px solid rgba(139,115,85,0.2)",
              borderRadius: 16,
              padding: "28px 32px",
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8B7355",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Ventana de Rareza
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {[
                { label: "Genesis", window: "Antes Ago 2026", color: "#FFD700" },
                { label: "Founder", window: "Primer mes", color: "#C0C0C0" },
                { label: "Community", window: "Primeros 3 meses", color: "#4FC3F7" },
                { label: "Standard", window: "Siempre", color: "#81C784" },
              ].map((tier) => (
                <div
                  key={tier.label}
                  style={{ textAlign: "center", padding: "12px 8px" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `${tier.color}22`,
                      border: `2px solid ${tier.color}`,
                      margin: "0 auto 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: tier.color,
                        boxShadow: `0 0 8px ${tier.color}`,
                      }}
                    />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: tier.color, marginBottom: 4 }}>
                    {tier.label}
                  </p>
                  <p style={{ fontSize: 12, color: "#8B7355" }}>{tier.window}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div
              style={{
                marginTop: 20,
                height: 6,
                borderRadius: 3,
                background:
                  "linear-gradient(90deg, #FFD700 0%, #C0C0C0 33%, #4FC3F7 66%, #81C784 100%)",
                boxShadow: "0 0 12px rgba(255,215,0,0.3)",
              }}
            />
            <p
              style={{
                fontSize: 11,
                color: "#8B7355",
                textAlign: "center",
                marginTop: 10,
                fontStyle: "italic",
              }}
            >
              ← Más raro · Más común →
            </p>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn>
          <div style={{ textAlign: "center" }}>
            <a
              href="https://www.omdomo.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #8B7355 0%, #6B5B45 100%)",
                color: "#f5f0e8",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(139,115,85,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 28px rgba(139,115,85,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(139,115,85,0.3)";
              }}
            >
              🛍️ Compra y consigue tu NFT Genesis
            </a>
            <p style={{ fontSize: 12, color: "#8B7355", marginTop: 12, fontStyle: "italic" }}>
              Disponible antes del lanzamiento oficial · Máxima rareza garantizada
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Guardians of Consciousness ───────────────────────────────────────────────

const GUARDIANS = [
  { id: 1, name: "El Silencio", archetype: "Meditación", emoji: "🌑", color: "#9B59B6" },
  { id: 2, name: "La Llama", archetype: "Fuego interior", emoji: "🔥", color: "#E74C3C" },
  { id: 3, name: "El Agua", archetype: "Fluidez", emoji: "💧", color: "#3498DB" },
  { id: 4, name: "La Tierra", archetype: "Arraigo", emoji: "🌿", color: "#27AE60" },
  { id: 5, name: "El Viento", archetype: "Libertad", emoji: "🌬️", color: "#F39C12" },
  { id: 6, name: "La Luz", archetype: "Consciencia", emoji: "✨", color: "#F1C40F" },
];

function GuardianCard({ g, index }: { g: typeof GUARDIANS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        aspectRatio: "3/4",
        cursor: "pointer",
        border: `1px solid ${hovered ? g.color + "88" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.4s, box-shadow 0.4s",
        boxShadow: hovered
          ? `0 0 40px ${g.color}44, 0 8px 32px rgba(0,0,0,0.5)`
          : "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* Background — blurred gradient that "reveals" on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.15 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${g.color}55 0%, ${g.color}11 50%, #0c0906 100%)`,
        }}
      />

      {/* Noise texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Locked overlay — hidden on hover */}
      <motion.div
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          background: "rgba(12,9,6,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.5 }}>🔒</div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Ago 2026
        </p>
      </motion.div>

      {/* Revealed content */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 1 : 0.8, rotate: hovered ? 0 : -10 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ fontSize: 52, marginBottom: 16 }}
        >
          {g.emoji}
        </motion.div>
        <h3
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 20,
            fontWeight: 700,
            color: "#f5f0e8",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          {g.name}
        </h3>
        <p style={{ fontSize: 12, color: g.color, textAlign: "center", fontStyle: "italic" }}>
          {g.archetype}
        </p>
      </motion.div>

      {/* Always-visible index number */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 14,
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}
      >
        #{String(g.id).padStart(2, "0")}
      </div>

      {/* Color dot top right */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: g.color,
          boxShadow: `0 0 8px ${g.color}`,
          opacity: hovered ? 1 : 0.3,
          transition: "opacity 0.3s",
        }}
      />
    </motion.div>
  );
}

function GuardiansCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-08-01T00:00:00Z").getTime();
    function update() {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "días", value: timeLeft.days },
    { label: "horas", value: timeLeft.hours },
    { label: "min", value: timeLeft.minutes },
    { label: "seg", value: timeLeft.seconds },
  ];

  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      {units.map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "14px 18px",
            minWidth: 70,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#f5f0e8",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 11, color: "var(--dark-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function GuardiansSection() {
  return (
    <section className="section-dark py-24 px-6 relative overflow-hidden">
      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() > 0.8 ? 2 : 1,
              height: Math.random() > 0.8 ? 2 : 1,
              borderRadius: "50%",
              background: "white",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-6">
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--dark-muted)",
                marginBottom: 12,
              }}
            >
              Colección Artística · Agosto 2026
            </span>
            <h2
              className="gradient-text"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              Guardians of Consciousness
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "var(--dark-muted)",
                maxWidth: 520,
                margin: "0 auto 8px",
                lineHeight: 1.65,
              }}
            >
              6 arquetipos de consciencia, generados con AI y sagrados a mano.
              Cada Guardian representa un estado del ser — edición de 111 unidades.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
              Pasa el cursor para un preview exclusivo
            </p>
          </div>
        </FadeIn>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {GUARDIANS.map((g, i) => (
            <GuardianCard key={g.id} g={g} index={i} />
          ))}
        </div>

        {/* Countdown + CTA */}
        <FadeIn>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "var(--dark-muted)",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Lanzamiento oficial en
            </p>
            <div style={{ marginBottom: 28 }}>
              <GuardiansCountdown />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://discord.gg/xXezFXnpaX"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(88,101,242,0.4)",
                }}
              >
                💬 Únete a la lista de espera
              </a>
              <a
                href="/drops"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  borderRadius: 12,
                  background: "transparent",
                  color: "#f5f0e8",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                Ver todos los Drops →
              </a>
            </div>

            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                marginTop: 16,
                fontStyle: "italic",
              }}
            >
              111 unidades · Holders Genesis tienen acceso prioritario · Avalanche Mainnet
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Pre-compra section ───────────────────────────────────────────────────────
function PreCompraSection() {
  const account = useActiveAccount();
  const [ommyAmount, setOmmyAmount] = useState(10000);
  const [payMethod, setPayMethod] = useState<"avax" | "card">("avax");
  const [step, setStep] = useState<"idle" | "confirm" | "done">("idle");
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const AVAX_PRICE = 25; // USD aproximado — se actualizará con feed en Fase 2
  const OMMY_PRICE = 0.001;
  const usdTotal = ommyAmount * OMMY_PRICE;
  const avaxTotal = (usdTotal / AVAX_PRICE).toFixed(4);
  const PRECOMPRA_WALLET = "0x7c7cd287e3901888d29218b4fDe00C9c6Bc0F1e2";

  async function handleAvaxPay() {
    if (!account) return;
    setStep("confirm");
    try {
      const { sendTransaction, prepareTransaction } = await import("thirdweb");
      const tx = prepareTransaction({
        to: PRECOMPRA_WALLET as `0x${string}`,
        value: BigInt(Math.round(parseFloat(avaxTotal) * 1e18)),
        chain: avalanche,
        client,
      });
      await sendTransaction({ transaction: tx, account });
      setStep("done");
    } catch {
      setStep("idle");
    }
  }

  async function handleCardPay() {
    setCardLoading(true);
    setCardError("");
    try {
      const res = await fetch("/api/precompra/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ommyAmount, wallet: account?.address }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCardError(data.error || "Error al iniciar el pago. Inténtalo de nuevo.");
      }
    } catch {
      setCardError("Error de conexión. Comprueba tu internet e inténtalo de nuevo.");
    } finally {
      setCardLoading(false);
    }
  }

  const precompraRef = useRef<HTMLElement>(null);
  const { scrollYProgress: pcScroll } = useScroll({ target: precompraRef, offset: ["start end", "end start"] });
  const pcBgY = useTransform(pcScroll, [0, 1], ["-8%", "8%"]);
  const pcOrb1Scale = useTransform(pcScroll, [0, 0.5, 1], [0.8, 1.2, 0.9]);
  const pcOrb2X = useTransform(pcScroll, [0, 1], ["-20px", "20px"]);
  const pcTitleY = useTransform(pcScroll, [0, 0.4], [40, 0]);
  const pcTitleOpacity = useTransform(pcScroll, [0, 0.25], [0, 1]);

  return (
    <section ref={precompraRef} id="precompra" className="relative py-28 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #0c0906 0%, #1a0a2e 40%, #0c1a10 70%, #0c0906 100%)" }}>
      {/* Animated background orbs */}
      <motion.div
        style={{ y: pcBgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          style={{ scale: pcOrb1Scale, background: "radial-gradient(circle, rgba(251,146,60,0.18) 0%, transparent 70%)" }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        />
        <motion.div
          style={{ x: pcOrb2X, background: "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 70%)" }}
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)" }}
        />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Golden shimmer line top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, #f59e0b 20%, #fbbf24 50%, #f59e0b 80%, transparent 100%)" }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div style={{ y: pcTitleY, opacity: pcTitleOpacity }} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="w-8 h-[1px] bg-amber-500/60" />
            <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">Acceso anticipado · Exclusivo</span>
            <span className="w-8 h-[1px] bg-amber-500/60" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-bold mt-2 mb-5 text-white leading-tight"
          >
            Pre-compra{" "}
            <span className="relative inline-block">
              <span className="gradient-text-gold">OMMY COIN</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f97316)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm max-w-xl mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            El 10% del supply está reservado exclusivamente para early adopters al precio de lanzamiento.
            Entra ahora y asegura tu posición antes de Agosto 2026.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Supply disponible", value: "2,997,924,580", sub: "OMMY — 10% del total",   borderColor: "rgba(251,146,60,0.4)", glowColor: "rgba(251,146,60,0.08)" },
            { label: "Precio pre-compra",  value: "$0.001",        sub: "Precio de lanzamiento",  borderColor: "rgba(34,197,94,0.4)",  glowColor: "rgba(34,197,94,0.08)" },
            { label: "Lock pre-compra", value: "6 meses",   sub: "Liberación 21 Dic 2026 · Solsticio",   borderColor: "rgba(147,51,234,0.4)", glowColor: "rgba(147,51,234,0.08)" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{ border: `1px solid ${item.borderColor}`, background: `linear-gradient(135deg, ${item.glowColor} 0%, rgba(255,255,255,0.02) 100%)` }}
            >
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 50%, ${item.glowColor}, transparent 70%)` }} />
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
              <p className="text-2xl font-black font-mono gradient-text-gold leading-tight">{item.value}</p>
              <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Payment widget */}
        <FadeIn>
          <div className="glass rounded-3xl border border-amber-500/20 p-8 max-w-lg mx-auto">
            {step === "done" ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">¡Pre-compra registrada!</h3>
                <p className="text-sm" style={{ color: "var(--dark-muted)" }}>
                  Recibirás {ommyAmount.toLocaleString()} OMMY en tu wallet. Lock hasta el Solsticio de Invierno — 21 Diciembre 2026.
                </p>
              </div>
            ) : !account ? (
              <div className="text-center">
                <p className="text-sm mb-5 font-medium" style={{ color: "var(--dark-muted)" }}>
                  Conecta tu wallet para participar en la pre-compra
                </p>
                <ConnectButton
                  client={client}
                  chain={avalanche}
                  connectButton={{
                    label: "Conectar wallet para pre-comprar",
                    className: "!w-full !bg-gradient-to-r !from-amber-500 !to-orange-500 !text-white !rounded-2xl !py-4 !text-sm !font-bold hover:!opacity-90 !transition-opacity",
                  }}
                />
                <p className="text-xs mt-4" style={{ color: "var(--dark-muted)" }}>
                  Compatible con MetaMask, Coinbase Wallet y más
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 rounded-xl px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {account.address.slice(0, 6)}...{account.address.slice(-4)} conectada
                </div>

                {/* Amount */}
                <div>
                  <label className="text-xs uppercase tracking-widest mb-2 block" style={{ color: "var(--dark-muted)" }}>
                    Cantidad de OMMY (mínimo 10,000)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={1000}
                    value={ommyAmount}
                    onChange={(e) => setOmmyAmount(Math.max(10000, Number(e.target.value)))}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-amber-500/60"
                  />
                  <div className="flex justify-between mt-1.5 text-xs" style={{ color: "var(--dark-muted)" }}>
                    <span>= ${usdTotal.toFixed(2)} USD</span>
                    <span>= {avaxTotal} AVAX</span>
                  </div>
                </div>

                {/* Pay method */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPayMethod("avax")}
                    className={`rounded-xl py-3 text-sm font-semibold border transition-all ${payMethod === "avax" ? "border-amber-500 bg-amber-900/20 text-amber-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
                  >
                    Pagar con AVAX
                  </button>
                  <button
                    onClick={() => setPayMethod("card")}
                    className={`rounded-xl py-3 text-sm font-semibold border transition-all ${payMethod === "card" ? "border-amber-500 bg-amber-900/20 text-amber-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
                  >
                    Pagar con tarjeta
                  </button>
                </div>

                {payMethod === "avax" ? (
                  <button
                    onClick={handleAvaxPay}
                    disabled={step === "confirm"}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {step === "confirm" ? "Confirmando..." : `Pagar ${avaxTotal} AVAX`}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCardPay}
                      disabled={cardLoading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {cardLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Abriendo pago seguro...
                        </>
                      ) : (
                        `Pagar $${usdTotal.toFixed(2)} con tarjeta →`
                      )}
                    </button>
                    {cardError && (
                      <p className="text-xs text-red-400 text-center mt-1 px-2">{cardError}</p>
                    )}
                  </>
                )}

                <p className="text-xs text-center" style={{ color: "var(--dark-muted)" }}>
                  🔒 Lock 6 meses · Liberación 21 Dic 2026 · Token en Avalanche
                </p>
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn>
          <div className="rounded-2xl p-6 mt-6" style={{ border: "1px solid rgba(245,158,11,0.15)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>¿Por qué el lock hasta Diciembre 2026?</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { text: "Evita venta masiva que desestabiliza el precio al lanzar" },
                { text: "Premia a early adopters que creen en el proyecto a largo plazo" },
                { text: "60% del supply dedicado a comunidad y quema — token sólido" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 text-xs flex items-center justify-center font-bold" style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>{i + 1}</span>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Proyectos Sustentables ───────────────────────────────────────────────────
const PROYECTOS = [
  { icon: "👕", title: "Moda con materiales renovables", desc: "Ropa fabricada con algodón orgánico, fibras recicladas y tintes naturales. Cada prenda lleva su huella de carbono certificada.", tag: "Producto",  topColor: "#10b981", tagBg: "#ecfdf5", tagText: "#065f46", from: "left" as const, comingSoon: false },
  { icon: "📦", title: "Producción bajo demanda",    desc: "Sin stock masivo. Cada prenda se produce cuando se pide, eliminando el desperdicio textil y reduciendo CO₂ un 60%.",       tag: "CO₂ Reducción",    topColor: "#14b8a6", tagBg: "#f0fdfa", tagText: "#0f766e", from: "right" as const, comingSoon: false },
  { icon: "🧘", title: "dApp Bienestar Consciente",  desc: "Meditación, yoga, running, arte y música generan OMMY verificados on-chain. Incentivamos hábitos que mejoran la vida.",   tag: "Fase 3 · dApp",    topColor: "#9333ea", tagBg: "#faf5ff", tagText: "#7e22ce", from: "left" as const, comingSoon: false },
  { icon: "🎨", title: "Arte y creatividad",         desc: "Actividades creativas — pintura, música, escritura — también generan recompensas. La expresión artística es bienestar.",   tag: "Comunidad",        topColor: "#ec4899", tagBg: "#fdf2f8", tagText: "#be185d", from: "right" as const, comingSoon: false },
  { icon: "🌳", title: "Reforestación activa",       desc: "Plantación de especies adaptadas al ecosistema local, trabajando con comunidades y expertos en restauración ambiental.",  tag: "Próximamente",     topColor: "#22c55e", tagBg: "#f0fdf4", tagText: "#15803d", from: "left" as const, comingSoon: true },
  { icon: "⚡", title: "Energía limpia",             desc: "Instalaciones solares para comunidades sin acceso a energía estable, financiadas parcialmente por el DAO Treasury.",       tag: "Próximamente",     topColor: "#eab308", tagBg: "#fefce8", tagText: "#a16207", from: "right" as const, comingSoon: true },
];

function ProyectoCard({ p, i }: { p: typeof PROYECTOS[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: p.from === "left" ? -40 : 40, y: 16 }}
      animate={inView ? { opacity: p.comingSoon ? 0.5 : 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={p.comingSoon ? {} : { y: -6, transition: { duration: 0.2 } }}
      className={`card-cream-hover p-6 h-full relative overflow-hidden group cursor-default ${p.comingSoon ? "grayscale" : ""}`}
      style={{ borderTop: `3px solid ${p.topColor}` }}
    >
      {/* Coming soon overlay */}
      {p.comingSoon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest border border-stone-300 px-3 py-1 rounded-full bg-white/80">
            Próximamente
          </span>
        </div>
      )}
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${p.topColor}10, transparent 65%)` }}
      />
      <div className="relative z-10">
        <div className="text-4xl mb-4">{p.icon}</div>
        <span
          className="text-xs px-2.5 py-1 rounded-full border font-medium"
          style={{ background: p.tagBg, color: p.tagText, borderColor: `${p.topColor}40` }}
        >
          {p.tag}
        </span>
        <h3 className="text-base font-bold text-cream-text mt-3 mb-2 group-hover:text-purple-700 transition-colors">{p.title}</h3>
        <p className="text-sm text-cream-muted leading-relaxed">{p.desc}</p>
      </div>
    </motion.div>
  );
}

function ProyectosSustentables() {
  return (
    <section id="sustentable" className="section-cream py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-xs text-green-600 uppercase tracking-widest font-medium">Impacto real</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4 text-cream-text">
            Proyectos <span className="gradient-text">Sustentables</span>
          </h2>
          <p className="text-cream-muted max-w-xl mx-auto text-sm">
            Om Domo integra sostenibilidad en cada capa del ecosistema — desde cómo fabricamos la ropa hasta cómo recompensamos tu bienestar diario.
            La DAO vota qué iniciativas apoyar cada trimestre.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {PROYECTOS.map((p, i) => (
            <ProyectoCard key={p.title} p={p} i={i} />
          ))}
        </div>

        <FadeIn>
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
                🗳
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream-text mb-1">La comunidad decide qué construimos juntos</p>
                <p className="text-xs text-cream-muted">
                  Los proyectos se seleccionan por votación DAO cada trimestre. Cualquier holder NFT puede proponer iniciativas.
                  Fase 4 activa desde Jun 2027.
                </p>
              </div>
              <SmartJoinCTA />
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
      "🌐 Mainnet — La red real de Avalanche donde vive OMMY Coin. Todas las transacciones tienen valor real.",
      "🔷 Avalanche C-Chain — La cadena compatible con Ethereum de Avalanche. Rápida, barata y eficiente.",
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

function GuiasWeb3Accordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      {GUIAS.map((g, i) => (
        <div key={g.title} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{g.icon}</span>
              <span className="font-semibold text-cream-text text-sm">{g.title}</span>
            </div>
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-stone-400 flex-shrink-0">▾</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
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
      ))}
    </>
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

// ─── Ecosistema Section ────────────────────────────────────────────────────────
function EcosistemaSection() {
  const [activeNodo, setActiveNodo] = useState<string | null>(null);

  const nodos = [
    {
      id: "tienda",
      emoji: "🛍️",
      color: "#10b981",
      glow: "rgba(16,185,129,0.18)",
      border: "rgba(16,185,129,0.28)",
      tag: "Live · Shopify",
      title: "Tienda de Productos Físicos",
      desc: "Ropa consciente, hoodies Genesis y accesorios Om Domo. Cada compra te recompensa con OMMY y un NFT de autenticidad on-chain.",
      features: [
        "70 OMMY por USD gastado",
        "NFT de autenticidad incluido",
        "Drops limitados exclusivos",
        "Envío con certificado blockchain",
      ],
      cta: { label: "Ir a omdomo.com", href: "https://omdomo.com", external: true },
    },
    {
      id: "nfts",
      emoji: "🖼️",
      color: "#9333ea",
      glow: "rgba(147,51,234,0.18)",
      border: "rgba(147,51,234,0.32)",
      tag: "Fase 1 · Activo",
      title: "NFTs",
      desc: "Genesis Hoodies, Guardianes de la Conciencia y arte espiritual on-chain. Cada NFT es tu pasaporte a todo el ecosistema.",
      features: [
        "Genesis Hoodie — 100 unidades",
        "Guardianes de la Conciencia",
        "Staking 50 OMMY/día",
        "Acceso DAO + drops anticipados",
      ],
      cta: { label: "Ver colecciones", href: "/nft", external: false },
    },
    {
      id: "ommy",
      emoji: "🪙",
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.15)",
      border: "rgba(245,158,11,0.28)",
      tag: "Mainnet · Avalanche",
      title: "Ommy Coin",
      desc: "El token deflacionario del ecosistema. Cada compra quema OMMY y recompensa a la comunidad. 70% quemado en 7-8 años.",
      features: [
        "70 OMMY por cada USD gastado",
        "Deflación 70% programada",
        "Pre-compra · lock 21 Dic 2026",
        "Liquidez DEX Avalanche",
      ],
      cta: { label: "Conectar wallet", href: "/dashboard", external: false },
    },
    {
      id: "dao",
      emoji: "🏛",
      color: "#6366f1",
      glow: "rgba(99,102,241,0.15)",
      border: "rgba(99,102,241,0.28)",
      tag: "Fase 4 · Jun 2027",
      title: "DAO",
      desc: "La comunidad vota el rumbo del ecosistema. Los holders de NFT tienen poder de gobernanza real sobre el treasury y las propuestas.",
      features: ["+200 OMMY por cada voto", "Propuestas en GitHub", "Discord governance", "Treasury descentralizado"],
      progress: [
        { label: "Fase 1: Motor de Ventas", pct: 80 },
        { label: "Fase 2: Economía OMMY", pct: 5 },
        { label: "Fase 3: App Bienestar", pct: 0 },
        { label: "Fase 4: DAO", pct: 0 },
        { label: "Fase 5: Ommy Lab", pct: 0 },
      ],
      links: [
        { label: "GitHub", href: "https://github.com/omdomocom/omdomo-web3" },
        { label: "Discord", href: "https://discord.gg/xXezFXnpaX" },
      ],
      cta: { label: "Conectar wallet", href: "/dashboard", external: false },
    },
    {
      id: "dapp",
      emoji: "⚡",
      color: "#0891b2",
      glow: "rgba(8,145,178,0.15)",
      border: "rgba(8,145,178,0.28)",
      tag: "Fase 3 · Ene 2027",
      title: "dApp Bienestar",
      desc: "Proof of Conscious Activity — gana OMMY por meditación, deporte, arte y música. La primera dApp de bienestar consciente en blockchain.",
      activities: [
        { icon: "🏃", label: "Running", reward: "+250/5km" },
        { icon: "🧘", label: "Yoga", reward: "por posición" },
        { icon: "🚴", label: "Ciclismo", reward: "+OMMY/km" },
        { icon: "🏊", label: "Natación", reward: "+OMMY/largo" },
        { icon: "🛼", label: "Patines", reward: "+OMMY/ruta" },
        { icon: "🧠", label: "Meditación", reward: "+50/20min" },
        { icon: "🎨", label: "Arte → NFT", reward: "mintear" },
        { icon: "🎵", label: "Música", reward: "compartir" },
      ],
      features: [
        "Reto Meditación + Running combinado con bonus",
        "Arte consciente → mint NFT directo",
        "Música: sube y gana OMMY",
      ],
      cta: { label: "Ver roadmap", href: "#roadmap", external: false },
    },
    {
      id: "dex",
      emoji: "💱",
      color: "#ec4899",
      glow: "rgba(236,72,153,0.15)",
      border: "rgba(236,72,153,0.28)",
      tag: "Fase 2 · Sep 2026",
      title: "DEX",
      desc: "Intercambia OMMY sin intermediarios en los mejores DEXes de Avalanche. Conecta tu wallet y accede al ecosistema DeFi.",
      dexes: [
        { name: "Trader Joe", desc: "DEX líder Avalanche", tag: "★ Recomendado" },
        { name: "Pangolin", desc: "AMM nativo Avalanche", tag: "Avalanche" },
        { name: "Uniswap v3", desc: "Máxima liquidez", tag: "Multi-chain" },
      ],
      features: [
        "Bonus OMMY al comprar por primera vez",
        "Slippage optimizado para OMMY",
        "Historial de transacciones on-chain",
      ],
      cta: { label: "Conectar wallet", href: "/dashboard", external: false },
    },
  ] as const;

  return (
    <section id="ecosistema" className="section-dark py-24 px-6 relative overflow-hidden">
      <Orb className="w-[600px] h-[600px] bg-purple-900 -top-60 left-1/2 -translate-x-1/2" />
      <Orb className="w-[400px] h-[400px] bg-cyan-900 bottom-0 right-0 opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <span className="text-xs text-purple-400 uppercase tracking-widest font-medium">Ecosistema</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4">
            Un ecosistema <span className="gradient-text">completo</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Seis pilares que conectan el mundo físico con el Web3. Desde la tienda hasta el DAO, cada pieza te recompensa con OMMY.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {nodos.map((nodo, i) => {
            const isActive = activeNodo === nodo.id;
            return (
              <FadeIn key={nodo.id} delay={i * 0.07}>
                <motion.div
                  layout
                  className="rounded-2xl p-6 flex flex-col gap-4 h-full cursor-pointer"
                  style={{
                    background: "rgba(14,10,20,0.7)",
                    border: `1px solid ${isActive ? nodo.border : "rgba(255,255,255,0.06)"}`,
                    boxShadow: isActive ? `0 0 32px ${nodo.glow}` : "none",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                  onClick={() => setActiveNodo(isActive ? null : nodo.id)}
                  whileHover={{ y: -3 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${nodo.color}18`, border: `1px solid ${nodo.color}33` }}
                    >
                      {nodo.emoji}
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: `${nodo.color}18`, color: nodo.color, border: `1px solid ${nodo.color}44` }}
                    >
                      {nodo.tag}
                    </span>
                  </div>

                  {/* Title + desc */}
                  <div>
                    <h3 className="font-bold text-base mb-1.5" style={{ color: "var(--dark-text)" }}>{nodo.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--dark-muted)" }}>{nodo.desc}</p>
                  </div>

                  {/* Special content per nodo */}
                  {"progress" in nodo && (
                    <div className="flex flex-col gap-2 mt-1">
                      {(nodo as typeof nodos[3]).progress.map((p) => (
                        <div key={p.label}>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span style={{ color: "var(--dark-muted)" }}>{p.label}</span>
                            <span style={{ color: nodo.color }}>{p.pct}%</span>
                          </div>
                          <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: nodo.color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${p.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        {(nodo as typeof nodos[3]).links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] px-2.5 py-1 rounded-full border flex items-center gap-1 hover:opacity-80 transition-opacity"
                            style={{ borderColor: `${nodo.color}44`, color: nodo.color }}
                          >
                            <ExternalLink size={9} /> {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {"activities" in nodo && (
                    <div className="grid grid-cols-4 gap-1.5 mt-1">
                      {(nodo as typeof nodos[4]).activities.map((a) => (
                        <div
                          key={a.label}
                          className="rounded-xl p-2 flex flex-col items-center gap-0.5 text-center"
                          style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.14)" }}
                        >
                          <span className="text-base leading-none">{a.icon}</span>
                          <span className="text-[9px] font-medium text-slate-300 leading-tight">{a.label}</span>
                          <span className="text-[8px]" style={{ color: nodo.color }}>{a.reward}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {"dexes" in nodo && (
                    <div className="flex flex-col gap-2 mt-1">
                      {(nodo as typeof nodos[5]).dexes.map((d) => (
                        <div
                          key={d.name}
                          className="flex items-center justify-between px-3 py-2 rounded-xl"
                          style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.14)" }}
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-200">{d.name}</p>
                            <p className="text-[10px]" style={{ color: "var(--dark-muted)" }}>{d.desc}</p>
                          </div>
                          <span
                            className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${nodo.color}18`, color: nodo.color }}
                          >
                            {d.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="flex flex-col gap-1.5 flex-1">
                    {nodo.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--dark-muted)" }}>
                        <span className="mt-0.5 flex-shrink-0" style={{ color: nodo.color }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={nodo.cta.href}
                    target={nodo.cta.external ? "_blank" : undefined}
                    rel={nodo.cta.external ? "noopener noreferrer" : undefined}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-auto flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                    style={{
                      background: `linear-gradient(135deg, ${nodo.color}cc, ${nodo.color}88)`,
                      color: "#fff",
                    }}
                  >
                    {nodo.cta.label}
                    {nodo.cta.external ? <ExternalLink size={11} /> : <ArrowLeftRight size={11} />}
                  </a>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Join / Perfil section ───────────────────────────────────────────────────

// Signos zodiacales para preview client-side
const ZODIAC_PREVIEW_DATA: Array<{ name: string; emoji: string; dates: string; mStart: number; dStart: number; mEnd: number; dEnd: number }> = [
  { name: "Capricornio", emoji: "♑", dates: "22 Dic – 19 Ene", mStart: 12, dStart: 22, mEnd: 1,  dEnd: 19 },
  { name: "Acuario",     emoji: "♒", dates: "20 Ene – 18 Feb", mStart: 1,  dStart: 20, mEnd: 2,  dEnd: 18 },
  { name: "Piscis",      emoji: "♓", dates: "19 Feb – 20 Mar", mStart: 2,  dStart: 19, mEnd: 3,  dEnd: 20 },
  { name: "Aries",       emoji: "♈", dates: "21 Mar – 19 Abr", mStart: 3,  dStart: 21, mEnd: 4,  dEnd: 19 },
  { name: "Tauro",       emoji: "♉", dates: "20 Abr – 20 May", mStart: 4,  dStart: 20, mEnd: 5,  dEnd: 20 },
  { name: "Géminis",     emoji: "♊", dates: "21 May – 20 Jun", mStart: 5,  dStart: 21, mEnd: 6,  dEnd: 20 },
  { name: "Cáncer",      emoji: "♋", dates: "21 Jun – 22 Jul", mStart: 6,  dStart: 21, mEnd: 7,  dEnd: 22 },
  { name: "Leo",         emoji: "♌", dates: "23 Jul – 22 Ago", mStart: 7,  dStart: 23, mEnd: 8,  dEnd: 22 },
  { name: "Virgo",       emoji: "♍", dates: "23 Ago – 22 Sep", mStart: 8,  dStart: 23, mEnd: 9,  dEnd: 22 },
  { name: "Libra",       emoji: "♎", dates: "23 Sep – 22 Oct", mStart: 9,  dStart: 23, mEnd: 10, dEnd: 22 },
  { name: "Escorpio",    emoji: "♏", dates: "23 Oct – 21 Nov", mStart: 10, dStart: 23, mEnd: 11, dEnd: 21 },
  { name: "Sagitario",   emoji: "♐", dates: "22 Nov – 21 Dic", mStart: 11, dStart: 22, mEnd: 12, dEnd: 21 },
];

function getZodiacPreview(birthday: string): { name: string; emoji: string; dates: string } | null {
  if (!birthday) return null;
  const d = new Date(birthday);
  if (isNaN(d.getTime())) return null;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  for (const z of ZODIAC_PREVIEW_DATA) {
    if (z.mStart === z.mEnd) continue; // Capricornio tiene meses separados
    if (m === z.mStart && day >= z.dStart) return z;
    if (m === z.mEnd && day <= z.dEnd) return z;
  }
  // Capricornio (dic 22+ o ene 1-19)
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) {
    return ZODIAC_PREVIEW_DATA[0];
  }
  return null;
}

function JoinSection() {
  const account = useActiveAccount();
  const router = useRouter();
  const [profileDone, setProfileDone] = useState(false);
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);

  const zodiacPreview = getZodiacPreview(birthday);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!account || !email || !birthday) return;
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: account.address, email, birthday }),
      });
      setProfileDone(true);
    } finally {
      setSaving(false);
    }
  }

  if (profileDone) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-4">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-green-600 font-bold text-lg mb-2">¡Perfil guardado!</p>
        <p className="text-stone-500 text-sm">
          Revisa tu email para verificar tu cuenta y reclamar tu NFT del zodíaco.
        </p>
      </motion.div>
    );
  }

  if (!account) {
    return (
      <>
        <div className="text-4xl mb-4">✨</div>
        <h2 className="font-serif text-3xl font-bold mb-3 text-stone-900">
          Empieza tu <span className="gradient-text">viaje</span>
        </h2>
        <p className="text-stone-500 text-sm mb-6 leading-relaxed">
          Conecta tu wallet para acceder al ecosistema Om Domo, reclamar tu NFT del zodíaco gratis
          y participar en la pre-compra de OMMY al precio de lanzamiento.
        </p>
        <div className="flex items-center gap-3 justify-center flex-wrap mb-6">
          {["NFT zodiacal gratis", "Precio lanzamiento $0.001", "+1,000 OMMY bonus"].map((b) => (
            <span key={b} className="text-xs px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-medium">
              ✓ {b}
            </span>
          ))}
        </div>
        <div className="flex justify-center">
          <ConnectButton
            client={client}
            chain={avalanche}
            connectButton={{
              label: "Conectar wallet → Comenzar",
              className: "!px-8 !py-4 !rounded-xl !bg-gradient-to-r !from-purple-600 !to-cyan-600 !text-white !font-bold !text-sm hover:!opacity-90 !transition-opacity !shadow-md !shadow-purple-200",
            }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-4">Compatible con MetaMask, Coinbase Wallet y más.</p>
      </>
    );
  }

  return (
    <>
      <div className="text-4xl mb-4">🌟</div>
      <h2 className="font-serif text-3xl font-bold mb-2 text-stone-900">
        Completa tu <span className="gradient-text">perfil</span>
      </h2>

      {/* Opción 1: Ir al Dashboard */}
      <div className="mb-5">
        <motion.button
          onClick={() => router.push("/dashboard")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md shadow-purple-200"
        >
          Ir al Dashboard →
        </motion.button>
      </div>

      {/* Separador */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-xs text-stone-400">o completa tu perfil para tu NFT zodiacal gratis:</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-xl px-3 py-2 mb-5 justify-center">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        {account.address.slice(0, 6)}...{account.address.slice(-4)} conectada
      </div>
      <form onSubmit={saveProfile} className="space-y-3 text-left">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          className="w-full rounded-xl px-5 py-4 text-sm text-stone-800 placeholder-stone-400 border border-stone-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 bg-stone-50"
        />
        <div>
          <label className="text-xs text-stone-400 mb-1 block">Fecha de nacimiento (para tu NFT zodiacal)</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className="w-full rounded-xl px-5 py-4 text-sm text-stone-800 border border-stone-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 bg-stone-50"
          />
          {birthday && zodiacPreview && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-sm font-medium mt-2"
            >
              <span className="text-xl">{zodiacPreview.emoji}</span>
              <span>Tu signo: <strong>{zodiacPreview.name}</strong> · {zodiacPreview.dates}</span>
            </motion.div>
          )}
        </div>
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar perfil y reclamar NFT →"}
        </motion.button>
      </form>
      <p className="text-xs text-stone-400 mt-4">Verificarás el email y te llegará tu NFT zodiacal.</p>
      <a
        href="/claim-zodiac"
        className="block text-center text-xs text-purple-500 hover:text-purple-700 hover:underline mt-3 transition-colors"
      >
        ¿Ya tienes un NFT zodiacal? Reclamarlo →
      </a>
    </>
  );
}

// ─── Nuevo en Web3 — collapsible ─────────────────────────────────────────────
function NuevoEnWeb3Section() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <FadeIn delay={0.2}>
      <div className="divider-cream mb-10" />
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-center mb-2 cursor-pointer group"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 text-xs text-purple-600 uppercase tracking-widest font-medium bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200 mb-3">
          ✦ Nuevo en cripto
        </span>
        <div className="flex items-center justify-center gap-3">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-cream-text group-hover:text-purple-700 transition-colors">
            Guía para <span className="gradient-text">empezar</span>
          </h3>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={22} className="text-purple-400" />
          </motion.div>
        </div>
        <p className="text-cream-muted text-sm mt-2">Sin jerga. Sin complicaciones. En 4 pasos.</p>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="nuevo-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { step: "01", icon: "🦊", title: "Instala MetaMask", desc: "Una wallet gratuita en tu navegador o móvil. Es tu identidad digital en Web3.", link: "https://metamask.io", cta: "Instalar gratis" },
                { step: "02", icon: "🔗", title: "Añade Avalanche", desc: "La red donde vive Ommy Coin. Rápida y económica. Se añade en 1 clic.", link: "https://chainlist.org/chain/43114", cta: "Añadir red" },
                { step: "03", icon: "🛍️", title: "Compra en Om Domo", desc: "Cualquier prenda activa automáticamente tu recompensa en NFT y OMMY.", link: "https://www.omdomo.com", cta: "Ver tienda" },
                { step: "04", icon: "🎁", title: "Reclama tus OMMY", desc: "Entra en web3.omdomo.com, conecta tu wallet y reclama tu NFT y tokens.", link: "/claim", cta: "Reclamar NFT" },
              ].map((item) => (
                <motion.a
                  key={item.step}
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                  rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Number(item.step) * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  className="group bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-black text-stone-200 font-mono">{item.step}</span>
                  </div>
                  <h4 className="font-bold text-stone-800 mb-2 group-hover:text-purple-700 transition-colors">{item.title}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4">{item.desc}</p>
                  <span className="text-xs font-semibold gradient-text group-hover:underline">{item.cta} →</span>
                </motion.a>
              ))}
            </div>
            <div className="max-w-2xl mx-auto space-y-3 mb-8">
              <GuiasWeb3Accordion />
            </div>
            {/* Academy CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-center"
            >
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-purple-50 via-white to-cyan-50 border border-purple-200 rounded-2xl px-6 py-5 shadow-sm max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
                  🎓
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-sm font-bold text-stone-800 leading-tight">Sigue ganando y aprendiendo en nuestra Academy</p>
                  <p className="text-xs text-stone-500 mt-1">Artículos Web3 · Gana OMMY por leer · Totalmente gratis</p>
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex-shrink-0 text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                >
                  Ir a la Academy →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeIn>
  );
}

// ─── Gamificación — collapsible carousel ─────────────────────────────────────
function GamificacionSection() {
  const [open, setOpen] = useState(false);
  const enabled = [
    { action: "Compra física",           reward: "5,000+ OMMY",  icon: <ShoppingBag size={15} /> },
    { action: "Drop limitado (1ª hora)", reward: "+10,000 OMMY", icon: <Flame size={15} /> },
    { action: "Referir un amigo",        reward: "+2,000 OMMY",  icon: <Users size={15} /> },
    { action: "Evento Om Domo",          reward: "+3,000 OMMY",  icon: <Globe size={15} /> },
    { action: "Reto Medita + Running",   reward: "+500 OMMY",    icon: <Activity size={15} /> },
  ];
  const upcoming = [
    { action: "Share Twitter / X",  reward: "+500 OMMY",    icon: <Globe size={15} /> },
    { action: "Share TikTok",       reward: "+500 OMMY",    icon: <Activity size={15} /> },
    { action: "Share Instagram",    reward: "+500 OMMY",    icon: <Heart size={15} /> },
    { action: "Running 5km",        reward: "+250 OMMY",    icon: <Zap size={15} /> },
    { action: "Meditación 20 min",  reward: "+50 OMMY/día", icon: <Music size={15} /> },
    { action: "Staking de NFT",     reward: "+50 OMMY/día", icon: <Zap size={15} /> },
    { action: "Votación DAO",       reward: "+200 OMMY",    icon: <Star size={15} /> },
  ];
  return (
    <section className="section-cream-2 py-20 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-6">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full cursor-pointer group"
            aria-expanded={open}
          >
            <span className="text-xs text-cyan-600 uppercase tracking-widest font-medium">Gamificación</span>
            <div className="flex items-center justify-center gap-3 mt-1">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream-text group-hover:text-purple-700 transition-colors">
                Cada acción vale <span className="gradient-text">OMMY</span>
              </h2>
              <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={22} className="text-cyan-500" />
              </motion.div>
            </div>
            <p className="text-cream-muted text-sm mt-3 max-w-lg mx-auto">
              Gana tokens por comprar, compartir, meditar, correr o votar.
            </p>
          </button>
        </FadeIn>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="gamif-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                {/* Habilitadas */}
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Habilitadas ahora</p>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                    {enabled.map((r, i) => (
                      <motion.div
                        key={r.action}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        whileHover={{ scale: 1.04, y: -3, transition: { duration: 0.15 } }}
                        className="flex-shrink-0 flex items-center gap-3 p-4 rounded-2xl border border-purple-300/60 bg-gradient-to-br from-purple-50 to-cyan-50 shadow-md shadow-purple-100/60 w-56 cursor-default"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-sm">
                          {r.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-stone-700 font-semibold leading-tight">{r.action}</p>
                          <p className="text-sm font-black gradient-text mt-0.5">{r.reward}</p>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          className="flex-shrink-0"
                        >
                          <Flame size={13} className="text-orange-500" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Próximamente */}
                <div>
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Próximamente</p>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                    {upcoming.map((r, i) => (
                      <motion.div
                        key={r.action}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.06, duration: 0.4 }}
                        className="flex-shrink-0 flex items-center gap-3 p-4 rounded-2xl border border-stone-200 bg-white/80 w-48 cursor-default relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
                        <div className="absolute top-2 right-2 z-10">
                          <Lock size={10} className="text-stone-300" />
                        </div>
                        <div className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-stone-100 text-stone-300">
                          {r.icon}
                        </div>
                        <div className="relative z-10 min-w-0">
                          <p className="text-xs text-stone-400 font-semibold leading-tight">{r.action}</p>
                          <p className="text-xs font-bold text-stone-300 mt-0.5">{r.reward}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function LandingPage() {
  const countdown = useCountdown();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0.8, 0.98], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0.8, 0.98], [0, -40]);

  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  useGsapHero(heroTitleRef, orb1Ref, orb2Ref, orb3Ref);

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("om-theme");
    if (saved) setDarkMode(saved === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("om-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${darkMode ? "bg-background text-slate-100" : "bg-white text-slate-900"}`}>

      {/* ── NAV ───────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${darkMode ? "glass border-slate-800/40" : "bg-white/90 backdrop-blur-md border-slate-200/60 shadow-sm"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <OmDomoLogo size={32} />
            <span className="font-bold text-sm gradient-text tracking-wide">Om Domo</span>
          </a>

          <div className={`hidden md:flex items-center gap-6 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            <a href="#como-funciona" className={`transition-colors ${darkMode ? "hover:text-slate-100" : "hover:text-slate-900"}`}>Cómo funciona</a>
            <a href="/precompra" className={`transition-colors font-medium ${darkMode ? "hover:text-amber-300 text-amber-400" : "hover:text-amber-600 text-amber-500"}`}>Pre-compra</a>
            <a href="#token" className={`transition-colors ${darkMode ? "hover:text-slate-100" : "hover:text-slate-900"}`}>Token</a>
            <a href="#comunidad" className={`transition-colors ${darkMode ? "hover:text-slate-100" : "hover:text-slate-900"}`}>Comunidad</a>
            <a href="/drops" className="hover:text-orange-300 text-orange-400 transition-colors font-medium">🔥 Drops</a>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              aria-label="Cambiar tema"
            >
              {darkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <a
              href="/claim"
              className={`hidden md:flex text-xs px-4 py-2 rounded-xl border transition-all ${darkMode ? "border-purple-500/40 text-purple-300 hover:bg-purple-900/20" : "border-purple-400 text-purple-600 hover:bg-purple-50"}`}
            >
              Reclamar NFT
            </a>
            <ConnectButton
              client={client}
              chain={avalanche}
              connectButton={{
                label: "Conectar",
                className: "!text-xs !px-4 !py-2 !rounded-xl !bg-gradient-to-r !from-orange-500 !to-amber-500 !text-white !font-semibold hover:!opacity-90 !transition-opacity",
              }}
              onConnect={() => router.push("/dashboard")}
            />
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[210vh] md:min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-48 md:pb-16 overflow-hidden" style={{ background: "#060308" }}>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-900/20 text-amber-300 text-xs font-medium mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
            />
            Pre-compra abierta · Precio fijo $0.001 por OMMY COIN
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
              href="/precompra"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-amber-900/40 text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Pre-compra OMMY COIN
            </a>
            <a
              href="https://www.omdomo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/40"
            >
              <ShoppingBag size={16} /> Comprar en omdomo.com
            </a>
            <a
              href="/nft"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-purple-500/40 text-purple-300 font-semibold text-sm hover:border-purple-400/70 hover:text-purple-200 hover:bg-purple-500/10 transition-all"
            >
              <Gift size={16} /> NFT Zodiacal gratis
            </a>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
          >
            <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest">
              Lanzamiento oficial Ommy Coin · Agosto 2026
            </p>
            <div className="flex items-center justify-center gap-3 mb-6">
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

            {/* Pre-compra urgency */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a
                href="#precompra"
                className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >⚡</motion.span>
                Anticipa la pre-compra → precio $0.001
              </a>
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-400"
                />
                Stock exclusivo · Solo 2,997M OMMY disponibles
              </div>
            </motion.div>
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
              { label: "Burn objetivo",    value: 70,     suffix: "% supply", icon: <Flame size={14} /> },
              { label: "Mercado global",   value: 500,    suffix: "K objetivo",icon: <Users size={14} /> },
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

          <div className="grid md:grid-cols-3 gap-6 mb-16">
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

          <NuevoEnWeb3Section />
        </div>
      </section>

      {/* ── GAMIFICACIÓN ─────────────────────────────────────────────── */}
      <GamificacionSection />

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

      <PreCompraSection />

      {/* ── ECOSISTEMA ───────────────────────────────────────────────── */}
      <EcosistemaSection />

      {/* ── PROYECTOS SUSTENTABLES ───────────────────────────────────── */}
      <ProyectosSustentables />

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
