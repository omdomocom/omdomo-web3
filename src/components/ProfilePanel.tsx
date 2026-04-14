"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Edit3, Wallet, Palette, Sparkles, Star } from "lucide-react";

// ─── Zodiac helper ───────────────────────────────────────────────────────────
const ZODIAC_SIGNS: { name: string; emoji: string; start: [number, number]; end: [number, number] }[] = [
  { name: "Capricornio", emoji: "♑", start: [12, 22], end: [1,  19] },
  { name: "Acuario",     emoji: "♒", start: [1,  20], end: [2,  18] },
  { name: "Piscis",      emoji: "♓", start: [2,  19], end: [3,  20] },
  { name: "Aries",       emoji: "♈", start: [3,  21], end: [4,  19] },
  { name: "Tauro",       emoji: "♉", start: [4,  20], end: [5,  20] },
  { name: "Géminis",     emoji: "♊", start: [5,  21], end: [6,  20] },
  { name: "Cáncer",      emoji: "♋", start: [6,  21], end: [7,  22] },
  { name: "Leo",         emoji: "♌", start: [7,  23], end: [8,  22] },
  { name: "Virgo",       emoji: "♍", start: [8,  23], end: [9,  22] },
  { name: "Libra",       emoji: "♎", start: [9,  23], end: [10, 22] },
  { name: "Escorpio",    emoji: "♏", start: [10, 23], end: [11, 21] },
  { name: "Sagitario",   emoji: "♐", start: [11, 22], end: [12, 21] },
];

function getZodiacSign(birthday: string): { name: string; emoji: string } | null {
  if (!birthday) return null;
  const d = new Date(birthday + "T12:00:00");
  if (isNaN(d.getTime())) return null;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  for (const z of ZODIAC_SIGNS) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm === 12) {
      if ((m === 12 && day >= sd) || (m === 1 && day <= ed)) return z;
    } else {
      if ((m === sm && day >= sd) || (m === em && day <= ed)) return z;
    }
  }
  return null;
}

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
  email: string;
  birthday: string;
  gender: "masculino" | "femenino" | "no-binario" | "prefiero-no-decir" | "";
  profileRewardClaimed: boolean;
  zodiacClaimed: boolean;
}

export const DEFAULT_PROFILE: UserProfile = {
  username: "",
  bio: "",
  avatar: "🧘",
  avatarType: "emoji",
  bgTheme: "space",
  joinDate: new Date().toISOString(),
  email: "",
  birthday: "",
  gender: "",
  profileRewardClaimed: false,
  zodiacClaimed: false,
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
  const [rewardEarned, setRewardEarned] = useState(false);
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
    const isNewReward = draft.email && draft.birthday && !draft.profileRewardClaimed;
    const updatedDraft = isNewReward ? { ...draft, profileRewardClaimed: true } : draft;
    saveProfile(updatedDraft);
    setProfile(updatedDraft);
    if (updatedDraft.bgTheme !== profile.bgTheme) onThemeChange?.(updatedDraft.bgTheme);
    setEditing(false);
    setSaved(true);
    if (isNewReward) {
      setRewardEarned(true);
      setTimeout(() => { setSaved(false); setRewardEarned(false); }, 4000);
    } else {
      setTimeout(() => setSaved(false), 2500);
    }
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
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {walletAddress && (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-900/20 border border-green-500/20">
                <Wallet size={10} className="text-green-400" />
                <span className="text-xs text-green-400 font-mono">{walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}</span>
                <span className="text-xs text-green-400">✓</span>
              </div>
            )}
            {profile.email && (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-900/20 border border-purple-500/20">
                <span className="text-xs text-purple-400">✉ {profile.email}</span>
              </div>
            )}
            {profile.profileRewardClaimed && (() => {
              const z = getZodiacSign(profile.birthday);
              return z ? (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-900/20 border border-amber-500/20">
                  <span className="text-xs text-amber-400 font-semibold">{z.emoji} {z.name}</span>
                </div>
              ) : null;
            })()}
          </div>
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
            <p className="text-xs text-green-400 flex items-center justify-center gap-1">
              <Check size={12} /> Perfil guardado
            </p>
            {rewardEarned && (
              <p className="text-xs text-amber-400 flex items-center justify-center gap-1 font-semibold">
                ✨ ¡NFT Zodiacal desbloqueado! Reclámalo abajo
              </p>
            )}
          </motion.div>
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

            {/* Email + birthday + gender — recompensa NFT zodiacal */}
            <div className="glass rounded-2xl p-4 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Contacto & NFT Zodiacal</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold flex items-center gap-1">
                  <Sparkles size={10} /> NFT gratis
                </span>
              </div>
              <p className="text-xs text-amber-300 font-semibold tracking-wide uppercase">✦ Obtén tu recompensa · Edición Limitada</p>
              <p className="text-xs text-slate-600 leading-relaxed">Completa tus datos y recibe tu <span className="text-amber-400 font-semibold">NFT Zodiacal gratis</span> — Genesis exclusivo, solo disponible ahora.</p>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Email</label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  placeholder="tu@email.com"
                  className="w-full bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={draft.birthday}
                  onChange={(e) => setDraft((d) => ({ ...d, birthday: e.target.value }))}
                  className="w-full bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-200 border border-slate-700/40 focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Sexo</label>
                <select
                  value={draft.gender}
                  onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value as UserProfile["gender"] }))}
                  className="w-full bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-200 border border-slate-700/40 focus:border-amber-500/50 focus:outline-none"
                >
                  <option value="">Seleccionar…</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="no-binario">No binario</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>
              {(() => {
                const z = getZodiacSign(draft.birthday);
                if (z && draft.birthday) return (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-500/20">
                    <span className="text-xl">{z.emoji}</span>
                    <div>
                      <p className="text-xs text-purple-300 font-semibold">{z.name}</p>
                      <p className="text-xs text-slate-600">Tu signo zodiacal detectado</p>
                    </div>
                  </div>
                );
                return null;
              })()}
              {draft.email && draft.birthday && !draft.profileRewardClaimed && (
                <p className="text-xs text-amber-400 flex items-center gap-1.5">
                  <Sparkles size={10} /> Al guardar desbloqueas tu NFT Zodiacal gratis
                </p>
              )}
              {draft.profileRewardClaimed && (
                <p className="text-xs text-green-400 flex items-center gap-1.5">
                  <Check size={12} /> NFT Zodiacal desbloqueado — reclámalo abajo
                </p>
              )}
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

      {/* ── NFT Zodiacal card (solo vista) ── */}
      {!editing && (() => {
        const z = getZodiacSign(profile.birthday);
        if (!profile.email || !profile.birthday) {
          // Prompt para completar perfil
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 border border-dashed border-amber-500/30 space-y-2"
            >
              <div className="flex items-center gap-2">
                <Star size={14} className="text-amber-400" />
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">NFT Zodiacal gratis</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Completa tu email y fecha de nacimiento en <strong className="text-slate-400">Editar perfil</strong> para desbloquear tu NFT zodiacal gratis.</p>
              <button
                onClick={startEdit}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                Completar perfil →
              </button>
            </motion.div>
          );
        }
        if (profile.profileRewardClaimed && !profile.zodiacClaimed && z) {
          // Botón para reclamar NFT
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 border border-amber-500/40 space-y-3"
              style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(139,92,246,0.08) 100%)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Tu NFT Zodiacal</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Desbloqueado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-900/60 to-amber-900/40 border border-amber-500/30 flex items-center justify-center text-3xl flex-shrink-0">
                  {z.emoji}
                </div>
                <div>
                  <p className="text-base font-bold text-white">{z.name}</p>
                  <p className="text-xs text-slate-500">Om Domo Zodiac Collection</p>
                  <p className="text-xs text-amber-400 mt-0.5">Genesis · Gratis</p>
                </div>
              </div>
              <a
                href={`/claim-zodiac?zodiac=${encodeURIComponent(z.name)}&email=${encodeURIComponent(profile.email)}&birthday=${encodeURIComponent(profile.birthday)}${walletAddress ? `&wallet=${encodeURIComponent(walletAddress)}` : ""}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles size={14} /> Reclamar NFT {z.emoji} {z.name}
              </a>
            </motion.div>
          );
        }
        if (profile.zodiacClaimed && z) {
          // NFT ya reclamado
          return (
            <div className="glass rounded-2xl p-4 border border-green-500/20 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-900/40 to-purple-900/40 border border-green-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {z.emoji}
              </div>
              <div>
                <p className="text-sm font-bold text-green-400">{z.name} — NFT reclamado</p>
                <p className="text-xs text-slate-500">Om Domo Zodiac Collection · Genesis</p>
              </div>
              <Check size={16} className="text-green-400 ml-auto flex-shrink-0" />
            </div>
          );
        }
        return null;
      })()}

      {/* ── Stats rápidas (solo vista) ── */}
      {!editing && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "NFTs",   value: profile.zodiacClaimed ? "1" : "0",  color: "text-purple-300" },
            { label: "OMMY COIN",   value: "—",  color: "text-cyan-300"   },
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
