"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, ExternalLink } from "lucide-react";

interface Notification {
  id: string;
  type: "drop" | "dao" | "ommy" | "nft" | "social" | "system";
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: string;
  href?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "drop",   title: "Drop #1 Genesis Hoodie",        desc: "El drop se lanza en 72 días. Solo 100 unidades a €89.",         time: "1h",  read: false, icon: "🔥", href: "/drops"  },
  { id: "n2", type: "dao",    title: "Nueva propuesta en la DAO",      desc: "Propuesta #3: Cambio en distribución de treasury — vota ahora.", time: "3h",  read: false, icon: "🗳️", href: undefined },
  { id: "n3", type: "ommy",   title: "+500 OMMY COIN acreditados",          desc: "Recompensa por compartir en Twitter/X.",                        time: "5h",  read: false, icon: "💰", href: undefined },
  { id: "n4", type: "nft",    title: "NFT listo para reclamar",        desc: "Tu compra en omdomo.com tiene un NFT Genesis pendiente.",        time: "1d",  read: true,  icon: "🎁", href: "/claim"  },
  { id: "n5", type: "social", title: "Bienvenido a Om Domo",           desc: "Ya formas parte del ecosistema Web3 más consciente.",           time: "2d",  read: true,  icon: "🌟", href: undefined },
];

const TYPE_COLORS = {
  drop:   "from-orange-500 to-red-500",
  dao:    "from-green-500 to-emerald-500",
  ommy:   "from-yellow-400 to-amber-500",
  nft:    "from-purple-500 to-pink-500",
  social: "from-cyan-500 to-blue-500",
  system: "from-slate-400 to-slate-500",
};

const STORAGE_KEY = "omdomo-notifications";

export function NotificationsDropdown() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const readIds: string[] = JSON.parse(stored);
        setNotifs((ns) => ns.map((n) => ({ ...n, read: readIds.includes(n.id) })));
      } catch { /* */ }
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      // Close if clicking outside both the bell button and the dropdown panel
      const panel = document.getElementById("notif-panel");
      if (ref.current && !ref.current.contains(target) && panel && !panel.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const unread = notifs.filter((n) => !n.read).length;

  function markAllRead() {
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.map((n) => n.id)));
  }

  function markRead(id: string) {
    const updated = notifs.map((n) => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((n) => n.read).map((n) => n.id)));
  }

  function dismiss(id: string) {
    setNotifs((ns) => ns.filter((n) => n.id !== id));
  }

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          id="notif-panel"
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          style={{ position: "fixed", top: "60px", right: "16px", zIndex: 99999 }}
          className="w-80 rounded-2xl border border-slate-700/50 bg-slate-950 shadow-2xl shadow-black/70 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <Bell size={13} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-300">Notificaciones</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                  {unread} nuevas
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <Check size={10} /> Marcar leídas
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-8 text-center text-slate-600 text-sm">
                <Bell size={24} className="mx-auto mb-2 opacity-30" />
                Sin notificaciones
              </div>
            ) : (
              notifs.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={() => markRead(n.id)}
                  className={`relative flex gap-3 px-4 py-3 border-b border-slate-800/40 cursor-pointer transition-colors group ${
                    !n.read ? "bg-slate-800/30" : "hover:bg-slate-800/20"
                  }`}
                >
                  {!n.read && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
                  )}
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${TYPE_COLORS[n.type]} flex items-center justify-center text-sm flex-shrink-0`}>
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-semibold leading-tight ${!n.read ? "text-slate-100" : "text-slate-400"}`}>
                        {n.title}
                      </p>
                      <span className="text-xs text-slate-600 flex-shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.desc}</p>
                    {n.href && (
                      <a
                        href={n.href}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors"
                      >
                        Ver más <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/40 transition-all text-slate-600 hover:text-slate-400 flex-shrink-0"
                  >
                    <X size={11} />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {notifs.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-900/60 text-center">
              <span className="text-xs text-slate-600">
                {notifs.filter(n => n.read).length} de {notifs.length} leídas
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={ref} style={{ isolation: "isolate" }}>
      {/* Bell button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-xl border transition-all ${
          open ? "bg-purple-500/20 border-purple-500/40" : "border-slate-700/40 hover:bg-slate-800/40 hover:border-slate-600/50"
        }`}
      >
        <Bell size={16} className={unread > 0 ? "text-slate-200" : "text-slate-500"} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-black shadow"
          >
            {unread}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown rendered via portal — always above everything */}
      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}
