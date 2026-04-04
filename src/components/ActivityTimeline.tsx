"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type EventType = "mint" | "ommy" | "drop" | "dao" | "share" | "referral" | "level" | "purchase";

interface ActivityEvent {
  id: string;
  type: EventType;
  title: string;
  desc: string;
  amount?: string;
  time: string;
  mine: boolean;
}

const EVENTS: ActivityEvent[] = [
  { id: "e1",  type: "drop",     title: "Drop #1 anunciado",             desc: "Genesis Hoodie — 100 unidades · €89",           amount: undefined,       time: "hace 1h",  mine: false },
  { id: "e2",  type: "dao",      title: "Propuesta DAO aprobada",         desc: "Prop. #2: Staking NFT activado en Fase 2",      amount: undefined,       time: "hace 2h",  mine: false },
  { id: "e3",  type: "share",    title: "SolGuardian compartió en X",     desc: "Suma +500 OMMY al ecosistema",                  amount: "+500 OMMY",     time: "hace 3h",  mine: false },
  { id: "e4",  type: "mint",     title: "NFT Genesis minteado",           desc: "GenesisHolder #0x1234 — Token ID: 0",           amount: undefined,       time: "hace 4h",  mine: false },
  { id: "e5",  type: "ommy",     title: "Recompensa de compra",           desc: "AvaRunner compró en omdomo.com",                amount: "+6,230 OMMY",   time: "hace 5h",  mine: false },
  { id: "e6",  type: "referral", title: "Nuevo referido",                 desc: "NomadConscius se unió por tu link",             amount: "+2,000 OMMY",   time: "hace 6h",  mine: true  },
  { id: "e7",  type: "level",    title: "¡Subiste de nivel!",             desc: "Ahora eres Explorer en Om Domo",               amount: "⬆️ Explorer",    time: "hace 1d",  mine: true  },
  { id: "e8",  type: "purchase", title: "Compra registrada",              desc: "Om Domo Hoodie — €89.00",                      amount: "+6,230 OMMY",   time: "hace 1d",  mine: true  },
  { id: "e9",  type: "share",    title: "Share en Instagram",             desc: "Compartiste tu NFT Genesis",                   amount: "+500 OMMY",     time: "hace 2d",  mine: true  },
  { id: "e10", type: "mint",     title: "NFT Genesis reclamado",          desc: "Om Domo Genesis · Rareza máxima",              amount: "+1,000 OMMY",   time: "hace 2d",  mine: true  },
];

const EVENT_CONFIG: Record<EventType, { icon: string; color: string; dot: string }> = {
  mint:     { icon: "🎁", color: "from-purple-500 to-pink-500",    dot: "bg-purple-400" },
  ommy:     { icon: "💰", color: "from-yellow-400 to-amber-500",   dot: "bg-yellow-400" },
  drop:     { icon: "🔥", color: "from-orange-500 to-red-500",     dot: "bg-orange-400" },
  dao:      { icon: "🗳️", color: "from-green-500 to-emerald-400",  dot: "bg-green-400"  },
  share:    { icon: "📣", color: "from-cyan-500 to-blue-500",      dot: "bg-cyan-400"   },
  referral: { icon: "🤝", color: "from-blue-400 to-violet-500",    dot: "bg-blue-400"   },
  level:    { icon: "⬆️", color: "from-indigo-400 to-purple-500",  dot: "bg-indigo-400" },
  purchase: { icon: "🛍️", color: "from-teal-400 to-cyan-500",      dot: "bg-teal-400"   },
};

type Filter = "all" | "mine" | "community";

export function ActivityTimeline() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = EVENTS.filter((e) => {
    if (filter === "mine") return e.mine;
    if (filter === "community") return !e.mine;
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex gap-1.5 p-1 glass rounded-xl border border-slate-700/30">
        {(["all", "mine", "community"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {f === "all" ? "Todo" : f === "mine" ? "Mis acciones" : "Comunidad"}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-500/40 via-slate-700/30 to-transparent" />

        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => {
              const cfg = EVENT_CONFIG[event.type];
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12, height: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="flex gap-3 group"
                >
                  {/* Timeline dot + icon */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-1">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center text-sm shadow-sm z-10`}>
                      {cfg.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-3 border-b border-slate-800/30 last:border-0 ${event.mine ? "" : "opacity-80"}`}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className={`text-xs font-semibold ${event.mine ? "text-slate-200" : "text-slate-400"}`}>
                          {event.title}
                          {event.mine && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs border border-cyan-500/20">
                              yo
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{event.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {event.amount && (
                          <p className="text-xs font-bold text-green-400">{event.amount}</p>
                        )}
                        <p className="text-xs text-slate-700">{event.time}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-600 text-sm">
          No hay actividad en este filtro
        </div>
      )}
    </div>
  );
}
