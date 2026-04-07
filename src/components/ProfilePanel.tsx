"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Edit3, Wallet, Palette } from "lucide-react";

export interface BgTheme {
  label:       string;
  emoji:       string;
  preview:     string;   // gradient for preview thumbnail
  bg:          string;   // base bg class on root div (fallback colour)
  animatedBg:  "space" | "clouds" | "ocean" | "lava" | "forest" | "solid";
  solidColor?: string;   // only used when animatedBg === "solid"
}

export const BG_THEMES: Record<string, BgTheme> = {
  // ── Animated themes ──────────────────────────────────────────────────────
  space:      { label: "Espacio",    emoji: "🌌", preview: "from-[#07091a] to-[#0f1128]",   bg: "bg-[#07091a]",   animatedBg: "space"  },
  clouds:     { label: "Nubes",      emoji: "☁️",  preview: "from-[#0a1628] to-[#1a3a5c]",  bg: "bg-[#0a1628]",   animatedBg: "clouds" },
  ocean:      { label: "Océano",     emoji: "🌊",  preview: "from-[#020b18] to-[#031e38]",  bg: "bg-[#020b18]",   animatedBg: "ocean"  },
  lava:       { label: "Lava",       emoji: "🌋",  preview: "from-[#0e0300] to-[#1a0500]",  bg: "bg-[#0e0300]",   animatedBg: "lava"   },
  forest:     { label: "Bosque",     emoji: "🌲",  preview: "from-[#010a02] to-[#020e04]",  bg: "bg-[#010a02]",   animatedBg: "forest" },
  // ── Solid colours ────────────────────────────────────────────────────────
  midnight:   { label: "Midnight",   emoji: "⬛",  preview: "from-[#09090f] to-[#111118]",  bg: "bg-[#09090f]",   animatedBg: "solid", solidColor: "#09090f" },
  purpura:    { label: "Púrpura",    emoji: "🟣",  preview: "from-[#180522] to-[#0d0318]",  bg: "bg-[#180522]",   animatedBg: "solid", solidColor: "#180522" },
  esmeralda:  { label: "Esmeralda",  emoji: "💚",  preview: "from-[#011e0f] to-[#010e08]",  bg: "bg-[#011e0f]",   animatedBg: "solid", solidColor: "#011e0f" },
  cobre:      { label: "Cobre",      emoji: "🟤",  preview: "from-[#1e0e04] to-[#0f0702]",  bg: "bg-[#1e0e04]",   animatedBg: "solid", solidColor: "#1e0e04" },
  // ── Light mode ───────────────────────────────────────────────────────────
  luz:        { label: "Luz",        emoji: "☀️",  preview: "from-[#f5f0e8] to-[#ede5d8]",  bg: "bg-[#f5f0e8]",   animatedBg: "solid", solidColor: "#f5f0e8" },
};

const EMOJI_AVATARS = ["🧘", "🦁", "🌟", "🔮", "🌊", "🦋", "⚡", "🌺", "🏔️", "🐉", "🎯", "💎"];

export interface UserProfile {
  username: string;
  bio: string;
  avatar: string;
  avatarType: "emoji" | "image";
  bgTheme: string;
  joinDate: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  username: "",
  bio: "",
  avatar: "🧘",
  avatarType: "emoji",
  bgTheme: "space",
  joinDate: new Date().toISOString(),
};

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem("omdomo-profile");
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem("omdomo-profile", JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("omdomo-profile-update", { detail: p }));
}

// ─── Theme button ────────────────────────────────────────────────────────
function ThemeButton({ themeKey, theme, active, onSelect }: {
  themeKey: string; theme: BgTheme; active: boolean; onSelect: (k: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(themeKey)}
      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
        active ? "border-purple-500 scale-105 shadow-lg shadow-purple-500/30" : "border-slate-700/40 hover:border-slate-500/60"
      }`}
    >
      {/* Color preview */}
      <div className={`h-12 bg-gradient-to-br ${theme.preview} relative`}>
        <span className="absolute bottom-1 right-1.5 text-base drop-shadow">{theme.emoji}</span>
      </div>
      {/* Label */}
      <div className="py-1 bg-slate-900/80 text-center">
        <span className="text-xs text-slate-300">{theme.label}</span>
      </div>
      {active && (
        <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow">
          <Check size={10} className="text-white" />
        </div>
      )}
    </button>
  );
}

// ─── Avatar component (reutilizable) ─────────────────────────────────────
export function UserAvatar({ profile, size = "md" }: { profile: UserProfile; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-base", md: "w-12 h-12 text-2xl", lg: "w-20 h-20 text-4xl" };
  return profile.avatarType === "image" && profile.avatar.startsWith("data:") ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={profile.avatar} alt="avatar" className={`${sizes[size]} rounded-xl object-cover border-2 border-purple-500/40 flex-shrink-0`} />
  ) : (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-purple-900/60 to-cyan-900/60 border-2 border-purple-500/30 flex items-center justify-center flex-shrink-0`}>
      {profile.avatar || "🧘"}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────
export function ProfilePanel({
  walletAddress,
  onThemeChange,
}: {
  walletAddress?: string;
  onThemeChange?: (theme: string) => void;
}) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setDraft(p);
  }, []);

  function startEdit() {
    setDraft(profile);
    setEditing(true);
  }

  function handleSave() {
    saveProfile(draft);
    setProfile(draft);
    if (draft.bgTheme !== profile.bgTheme) onThemeChange?.(draft.bgTheme);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft((d) => ({ ...d, avatar: ev.target?.result as string, avatarType: "image" }));
    };
    reader.readAsDataURL(file);
  }

  function applyTheme(themeKey: string) {
    setDraft((d) => ({ ...d, bgTheme: themeKey }));
  }

  const displayName = profile.username || (walletAddress ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}` : "Explorador");

  return (
    <div className="space-y-6 pb-4">
      {/* ── Avatar + identity ── */}
      <div className="glass rounded-2xl p-5 border border-purple-500/20 text-center space-y-4">
        <div className="relative inline-block">
          {profile.avatarType === "image" && profile.avatar.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-500/50 mx-auto shadow-lg shadow-purple-500/20" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-900/60 to-cyan-900/40 border-2 border-purple-500/40 flex items-center justify-center text-5xl mx-auto shadow-lg shadow-purple-500/20">
              {profile.avatar || "🧘"}
            </div>
          )}
          {editing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              <Camera size={22} className="text-white" />
            </motion.button>
          )}
          {!editing && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={startEdit}
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg border border-purple-400/40"
            >
              <Edit3 size={12} className="text-white" />
            </motion.button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        <div>
          <p className="text-base font-bold text-slate-100">{displayName}</p>
          {profile.bio && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{profile.bio}</p>}
          {walletAddress && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg bg-green-900/20 border border-green-500/20">
              <Wallet size={10} className="text-green-400" />
              <span className="text-xs text-green-400 font-mono">{walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}</span>
              <span className="text-xs text-green-400">✓</span>
            </div>
          )}
        </div>

        {saved && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-400 flex items-center justify-center gap-1">
            <Check size={12} /> Perfil guardado
          </motion.p>
        )}
      </div>

      {/* ── Edit form ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Emoji grid */}
            <div className="glass rounded-2xl p-4 border border-slate-700/30 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Seleccionar avatar emoji</p>
              <div className="grid grid-cols-6 gap-2">
                {EMOJI_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setDraft((d) => ({ ...d, avatar: emoji, avatarType: "emoji" }))}
                    className={`h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      draft.avatar === emoji && draft.avatarType === "emoji"
                        ? "bg-purple-500/30 border border-purple-500/60 scale-110"
                        : "bg-slate-800/40 hover:bg-slate-700/40 border border-transparent"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-2 rounded-xl border border-dashed border-slate-600/50 text-xs text-slate-500 hover:text-slate-300 hover:border-purple-500/40 transition-colors flex items-center justify-center gap-2"
              >
                <Camera size={12} /> Subir foto desde tu dispositivo
              </button>
            </div>

            {/* Name + bio */}
            <div className="glass rounded-2xl p-4 border border-slate-700/30 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Datos del perfil</p>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Nombre / username</label>
                <input
                  value={draft.username}
                  onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
                  placeholder="Tu nombre en la comunidad"
                  maxLength={30}
                  className="w-full bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Bio <span className="text-slate-700">({draft.bio.length}/100)</span></label>
                <textarea
                  value={draft.bio}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  placeholder="Cuéntanos sobre ti…"
                  maxLength={100}
                  rows={2}
                  className="w-full bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Background themes */}
            <div className="glass rounded-2xl p-4 border border-slate-700/30 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Palette size={11} /> Fondo del dashboard
              </p>

              {/* Animated themes */}
              <p className="text-xs text-slate-600 px-0.5">Animados</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(BG_THEMES).filter(([,t]) => t.animatedBg !== "solid").map(([key, theme]) => (
                  <ThemeButton key={key} themeKey={key} theme={theme} active={draft.bgTheme === key} onSelect={applyTheme} />
                ))}
              </div>

              {/* Solid colours */}
              <p className="text-xs text-slate-600 px-0.5 pt-1">Colores lisos</p>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(BG_THEMES).filter(([,t]) => t.animatedBg === "solid").map(([key, theme]) => (
                  <ThemeButton key={key} themeKey={key} theme={theme} active={draft.bgTheme === key} onSelect={applyTheme} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-xl border border-slate-700/40 text-sm text-slate-400 hover:bg-slate-800/40 transition-colors"
              >
                Cancelar
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-sm text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Check size={14} /> Guardar cambios
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats rápidas (solo vista) ── */}
      {!editing && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "NFTs",   value: "1",  color: "text-purple-300" },
            { label: "OMMY",   value: "—",  color: "text-cyan-300"   },
            { label: "Nivel",  value: "Seeker", color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-3 text-center border border-slate-700/30">
              <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
