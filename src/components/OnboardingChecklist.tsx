"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Rocket, ExternalLink } from "lucide-react";

interface Step {
  id: string;
  label: string;
  desc: string;
  cta: string;
  href?: string;
  xp: number;
  icon: string;
}

const STEPS: Step[] = [
  { id: "wallet",   label: "Conecta tu wallet",          desc: "Vincula MetaMask u otra wallet compatible con Avalanche.",          cta: "Conectar",      href: undefined,                    xp: 500,  icon: "🔗" },
  { id: "buy",      label: "Haz tu primera compra",       desc: "Compra en omdomo.com y gana 70 OMMY por cada dólar gastado.",       cta: "Ir a la tienda",href: "https://www.omdomo.com",     xp: 1000, icon: "🛍️" },
  { id: "claim",    label: "Reclama tu NFT",              desc: "Tras la compra, mintea tu NFT Genesis en /claim.",                  cta: "Ir a /claim",   href: "/claim",                     xp: 2000, icon: "🎁" },
  { id: "share",    label: "Comparte en redes sociales",  desc: "Comparte tu NFT en Twitter o Instagram y gana +500 OMMY.",          cta: "Compartir",     href: undefined,                    xp: 300,  icon: "📣" },
  { id: "dao",      label: "Vota en tu primera propuesta",desc: "Participa en la DAO y recibe +200 OMMY por cada voto.",             cta: "Ver propuestas",href: undefined,                    xp: 800,  icon: "🗳️" },
];

const STORAGE_KEY = "omdomo-onboarding";

export function OnboardingChecklist({ walletConnected }: { walletConnected?: boolean }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setCompleted(new Set(JSON.parse(stored))); } catch { /* */ }
    }
  }, []);

  // Auto-complete wallet step when connected
  useEffect(() => {
    if (walletConnected && !completed.has("wallet")) {
      const next = new Set([...completed, "wallet"]);
      setCompleted(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    }
  }, [walletConnected, completed]);

  function toggle(id: string) {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompleted(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }

  const progress = Math.round((completed.size / STEPS.length) * 100);
  const totalXP = STEPS.filter(s => completed.has(s.id)).reduce((s, step) => s + step.xp, 0);
  const allDone = completed.size === STEPS.length;

  if (allDone && collapsed) return null;

  return (
    <motion.div
      layout
      className="glass rounded-2xl border border-purple-500/25 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-800/20 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
          <Rocket size={14} className="text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-bold text-slate-200">
            {allDone ? "¡Todo listo! 🎉" : "Primeros pasos en Om Domo"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {completed.size}/{STEPS.length} completados · +{totalXP.toLocaleString()} XP ganados
          </p>
        </div>
        {/* Progress ring */}
        <div className="relative w-9 h-9 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke="url(#pg)" strokeWidth="3"
              strokeDasharray={`${progress * 0.879} 87.9`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-300">
            {progress}%
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform flex-shrink-0 ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      {/* Progress bar */}
      {!collapsed && (
        <div className="px-4 pb-1">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Steps */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-2">
              {STEPS.map((step, i) => {
                const done = completed.has(step.id);
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      done
                        ? "border-green-500/30 bg-green-900/10"
                        : "border-slate-700/30 hover:border-slate-600/50"
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(step.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        done ? "border-green-500 bg-green-500" : "border-slate-600 hover:border-purple-500"
                      }`}
                    >
                      {done && <Check size={12} className="text-white" strokeWidth={3} />}
                    </button>

                    {/* Icon + text */}
                    <span className="text-base flex-shrink-0">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${done ? "text-slate-500 line-through" : "text-slate-200"}`}>
                        {step.label}
                      </p>
                      {!done && <p className="text-xs text-slate-600 leading-tight mt-0.5 hidden sm:block">{step.desc}</p>}
                    </div>

                    {/* XP badge + CTA */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-bold ${done ? "text-green-400" : "text-yellow-400"}`}>
                        +{step.xp.toLocaleString()} XP
                      </span>
                      {!done && step.href && (
                        <a
                          href={step.href}
                          target={step.href.startsWith("http") ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hidden sm:flex items-center gap-0.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {step.cta} <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {allDone && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-3 space-y-1"
                >
                  <p className="text-sm font-bold text-slate-200">¡Eres un Om Domo Explorer! 🌟</p>
                  <p className="text-xs text-slate-500">Has completado todos los primeros pasos. ¡Sigue sumando OMMY!</p>
                  <button
                    onClick={() => setCollapsed(true)}
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors mt-1"
                  >
                    Ocultar checklist
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
