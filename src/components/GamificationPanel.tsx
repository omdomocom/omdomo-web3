"use client";

import { motion } from "framer-motion";
import { Zap, Star, Flame, Trophy, Heart, Target } from "lucide-react";

const LEVELS = [
  { name: "Seeker",    minXP: 0,      color: "from-slate-400 to-slate-500",    icon: "🌱" },
  { name: "Explorer",  minXP: 5000,   color: "from-blue-400 to-cyan-500",      icon: "🌊" },
  { name: "Guardian",  minXP: 20000,  color: "from-green-400 to-emerald-500",  icon: "🛡️" },
  { name: "Luminary",  minXP: 75000,  color: "from-purple-400 to-pink-500",    icon: "✨" },
  { name: "Architect", minXP: 200000, color: "from-orange-400 to-yellow-400",  icon: "🏛️" },
  { name: "Ascended",  minXP: 500000, color: "from-yellow-300 to-orange-400",  icon: "👁️" },
];

const BADGES = [
  { id: "genesis",    icon: "🎁", label: "Genesis Holder",   unlocked: true,  desc: "Reclamaste un NFT Genesis" },
  { id: "sharer",     icon: "📣", label: "Amplifier",        unlocked: false, desc: "Comparte 5 veces en redes" },
  { id: "connector",  icon: "🤝", label: "Connector",        unlocked: false, desc: "Refiere 3 amigos" },
  { id: "meditator",  icon: "🧘", label: "Inner Peace",      unlocked: false, desc: "10 días de meditación" },
  { id: "runner",     icon: "🏃", label: "50km Runner",      unlocked: false, desc: "Corre 50km verificados" },
  { id: "voter",      icon: "🗳️", label: "DAO Voter",        unlocked: false, desc: "Participa en 3 votaciones" },
  { id: "dropper",    icon: "⚡", label: "Early Dropper",    unlocked: false, desc: "Compra en la 1ª hora de un drop" },
  { id: "staker",     icon: "💎", label: "Diamond Hands",    unlocked: false, desc: "Staking 30 días seguidos" },
];

const MISSIONS = [
  { label: "Conecta tu wallet",    xp: 500,   done: false, icon: <Zap size={12} /> },
  { label: "Haz tu primera compra",xp: 1000,  done: false, icon: <Star size={12} /> },
  { label: "Comparte en Twitter",  xp: 300,   done: false, icon: <Flame size={12} /> },
  { label: "Refiere un amigo",     xp: 1500,  done: false, icon: <Heart size={12} /> },
  { label: "Vota en la DAO",       xp: 800,   done: false, icon: <Target size={12} /> },
];

function getLevelInfo(xp: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length - 1; i++) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? LEVELS[LEVELS.length - 1];
    }
  }
  const progress = next.minXP > current.minXP
    ? ((xp - current.minXP) / (next.minXP - current.minXP)) * 100
    : 100;
  return { current, next, progress: Math.min(progress, 100) };
}

interface GamificationPanelProps {
  ommyBalance?: number;
}

export function GamificationPanel({ ommyBalance = 0 }: GamificationPanelProps) {
  const xp = ommyBalance; // XP = OMMY earned
  const { current, next, progress } = getLevelInfo(xp);

  return (
    <div className="space-y-4">
      {/* Level card */}
      <div className={`rounded-2xl p-4 border border-slate-700/30 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm`}>
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl"
          >
            {current.icon}
          </motion.div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Nivel actual</p>
            <p className={`text-lg font-black bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}>
              {current.name}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500">XP</p>
            <p className="text-sm font-bold text-slate-100">{xp.toLocaleString()}</p>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="mb-1.5">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{current.name}</span>
            <span>{next.name} ({next.minXP.toLocaleString()} XP)</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${current.color}`}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1 text-right">
            {Math.max(0, next.minXP - xp).toLocaleString()} XP para {next.name}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-1">Badges</p>
        <div className="grid grid-cols-4 gap-2">
          {BADGES.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.1 }}
              title={badge.desc}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border text-center cursor-default ${
                badge.unlocked
                  ? "border-purple-500/40 bg-purple-900/20"
                  : "border-slate-800/40 bg-slate-900/20 opacity-40 grayscale"
              }`}
            >
              <span className="text-xl">{badge.icon}</span>
              <span className="text-xs text-slate-400 leading-tight" style={{ fontSize: "10px" }}>
                {badge.label}
              </span>
              {badge.unlocked && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400 border border-slate-900"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Misiones diarias */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Misiones</p>
          <span className="text-xs text-slate-600">0 / {MISSIONS.length}</span>
        </div>
        <div className="space-y-1.5">
          {MISSIONS.map((m) => (
            <motion.div
              key={m.label}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${
                m.done
                  ? "border-green-500/30 bg-green-900/10"
                  : "border-slate-700/30 bg-slate-900/30"
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                m.done ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-400"
              }`}>
                {m.done ? "✓" : m.icon}
              </div>
              <span className="text-xs text-slate-300 flex-1">{m.label}</span>
              <span className="text-xs font-bold text-yellow-400 flex items-center gap-0.5">
                <Trophy size={9} />
                +{m.xp.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
