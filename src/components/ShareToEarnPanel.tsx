"use client";

import { useState, useEffect, useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2, Twitter, Instagram, CheckCircle2, Loader2,
  Coins, Flame, ExternalLink, RefreshCw, TrendingUp,
  Sparkles, AlertCircle,
} from "lucide-react";
import { REWARDS, BURN } from "@/lib/tokenomics";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Platform = "twitter" | "instagram" | "tiktok" | "whatsapp";

interface PlatformConfig {
  id: Platform;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  reward: number;
  shareText: string;
  shareUrl: (text: string) => string;
}

interface ShareStatus {
  [platform: string]: "idle" | "opening" | "registering" | "done" | "error" | "already";
}

interface ShareRecord {
  platform: Platform;
  orderId: string;
  ommyReward: number;
  createdAt: string;
}

// ─── Configuración de plataformas ────────────────────────────────────────────

const BASE_TEXT =
  "Descubrí @omdomocom — moda sostenible + NFTs en Avalanche + comunidad Web3 🌱🔥 " +
  "Gana OMMY COIN solo por ser parte. Únete antes del lanzamiento de Agosto 2026. " +
  "#OmDomo #OMMY #Avalanche #Web3 #Sostenible";

const PLATFORMS: PlatformConfig[] = [
  {
    id: "twitter",
    label: "Twitter / X",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    icon: <Twitter size={18} />,
    reward: REWARDS.shareTwitter,
    shareText: BASE_TEXT,
    shareUrl: (t) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent("https://web3.omdomo.com")}`,
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    reward: REWARDS.shareInstagram,
    shareText: BASE_TEXT,
    shareUrl: () => "https://www.instagram.com/om.domo/",
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.86 4.86 0 01-1.01-.1z" />
      </svg>
    ),
    reward: REWARDS.shareInstagram,
    shareText: BASE_TEXT,
    shareUrl: () => "https://www.tiktok.com/@omdomo.com",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    reward: REWARDS.shareInstagram,
    shareText: BASE_TEXT,
    shareUrl: (t) =>
      `https://wa.me/?text=${encodeURIComponent(t + "\n\nhttps://web3.omdomo.com")}`,
  },
];

// ─── Componente Principal ─────────────────────────────────────────────────────

export function ShareToEarnPanel() {
  const account = useActiveAccount();
  const wallet = account?.address ?? null;

  const [status, setStatus] = useState<ShareStatus>({});
  const [totalOmmy, setTotalOmmy] = useState(0);
  const [shareHistory, setShareHistory] = useState<ShareRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    msg: string;
  } | null>(null);

  // Carga historial del wallet
  const loadHistory = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/share?wallet=${wallet}`);
      if (res.ok) {
        const data = await res.json();
        setShareHistory(data.shares ?? []);
        setTotalOmmy(data.totalOmmy ?? 0);

        // Marcar plataformas ya compartidas como "done"
        const newStatus: ShareStatus = {};
        for (const share of data.shares ?? []) {
          // Solo marcar como done si es community share (scope sin orderId)
          if (share.orderId === "community") {
            newStatus[share.platform] = "done";
          }
        }
        setStatus(newStatus);
      }
    } catch {
      // sin historial disponible
    }
    setLoading(false);
  }, [wallet]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Notificación temporal
  function showNotification(type: "success" | "error" | "info", msg: string) {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  }

  async function handleShare(platform: PlatformConfig) {
    if (!wallet) {
      showNotification("info", "Conecta tu wallet para ganar OMMY");
      return;
    }
    if (status[platform.id] === "done" || status[platform.id] === "already") return;

    // 1. Abrir red social
    setStatus((prev) => ({ ...prev, [platform.id]: "opening" }));
    const shareUrl = platform.shareUrl(platform.shareText);
    window.open(shareUrl, "_blank", "noopener,noreferrer");

    // 2. Pequeña pausa (UX: el usuario ve el link abrirse)
    await new Promise((r) => setTimeout(r, 1500));

    // 3. Registrar share en la API
    setStatus((prev) => ({ ...prev, [platform.id]: "registering" }));
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: wallet, platform: platform.id }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus((prev) => ({ ...prev, [platform.id]: "done" }));
        setTotalOmmy((prev) => prev + data.ommyReward);
        showNotification(
          "success",
          `+${data.ommyReward.toLocaleString()} OMMY registrados 🎉`
        );
        await loadHistory();
      } else if (res.status === 409) {
        setStatus((prev) => ({ ...prev, [platform.id]: "already" }));
        showNotification("info", "Este share ya estaba registrado");
      } else {
        setStatus((prev) => ({ ...prev, [platform.id]: "error" }));
        showNotification("error", data.error ?? "Error al registrar el share");
      }
    } catch {
      setStatus((prev) => ({ ...prev, [platform.id]: "error" }));
      showNotification("error", "Error de conexión");
    }
  }

  const totalPlatforms = PLATFORMS.length;
  const doneCount = PLATFORMS.filter(
    (p) => status[p.id] === "done" || status[p.id] === "already"
  ).length;
  const maxEarnable = PLATFORMS.reduce((sum, p) => sum + p.reward, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Share2 size={18} className="text-purple-400" />
            Comparte y Gana OMMY
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Comparte Om Domo en tus redes y acumula OMMY COIN en tu wallet
          </p>
        </div>
        {wallet && (
          <button
            onClick={loadHistory}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>
        )}
      </div>

      {/* ── Notificación toast ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium border ${
              notification.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : notification.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-blue-500/10 border-blue-500/30 text-blue-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertCircle size={15} />
            )}
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: <Coins size={14} className="text-yellow-400" />,
            label: "OMMY ganados",
            value: totalOmmy.toLocaleString(),
            sub: "de tus shares",
          },
          {
            icon: <TrendingUp size={14} className="text-green-400" />,
            label: "Redes compartidas",
            value: `${doneCount}/${totalPlatforms}`,
            sub: "completadas",
          },
          {
            icon: <Sparkles size={14} className="text-purple-400" />,
            label: "Máximo posible",
            value: maxEarnable.toLocaleString(),
            sub: "OMMY por compartir",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-lg font-black text-slate-100">{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Barra de progreso ── */}
      {doneCount > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Progreso</span>
            <span>{doneCount} de {totalPlatforms} redes</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / totalPlatforms) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* ── Sin wallet ── */}
      {!wallet && (
        <div className="text-center py-8 space-y-2">
          <Share2 size={32} className="mx-auto text-slate-600" />
          <p className="text-slate-400 text-sm">Conecta tu wallet para ganar OMMY</p>
          <p className="text-slate-600 text-xs">
            Puedes ganar hasta {maxEarnable.toLocaleString()} OMMY compartiendo en{" "}
            {totalPlatforms} redes
          </p>
        </div>
      )}

      {/* ── Tarjetas de plataformas ── */}
      {wallet && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLATFORMS.map((platform) => {
            const st = status[platform.id] ?? "idle";
            const isDone = st === "done" || st === "already";
            const isLoading = st === "opening" || st === "registering";

            return (
              <motion.div
                key={platform.id}
                whileHover={!isDone && !isLoading ? { scale: 1.01 } : {}}
                className={`relative rounded-2xl border p-4 transition-all ${
                  isDone
                    ? "border-green-500/30 bg-green-500/5"
                    : `${platform.border} ${platform.bg}`
                }`}
              >
                {/* Badge hecho */}
                {isDone && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/30 rounded-full px-2 py-0.5">
                    <CheckCircle2 size={10} /> Completado
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDone ? "bg-green-500/10 text-green-400" : `${platform.bg} ${platform.color}`
                    }`}
                  >
                    {platform.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${isDone ? "text-green-300" : "text-slate-100"}`}>
                      {platform.label}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs font-bold text-yellow-400">
                        <Coins size={11} />
                        +{platform.reward.toLocaleString()} OMMY
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-orange-400/70">
                        <Flame size={9} />
                        -{BURN.perSocialShare} burn
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {isDone
                        ? "¡Share registrado! OMMY añadidos a tu saldo."
                        : "Abre la red social, comparte el post y recibe tu recompensa automáticamente."}
                    </p>
                  </div>
                </div>

                {/* Botón */}
                <button
                  onClick={() => handleShare(platform)}
                  disabled={isDone || isLoading}
                  className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${
                    isDone
                      ? "bg-green-500/10 text-green-400 cursor-default"
                      : isLoading
                      ? "bg-white/5 text-slate-400 cursor-wait"
                      : `${platform.bg} ${platform.color} border ${platform.border} hover:brightness-125 active:scale-95`
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 size={14} /> Compartido
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {st === "opening" ? "Abriendo..." : "Registrando..."}
                    </>
                  ) : (
                    <>
                      <ExternalLink size={14} /> Compartir y ganar
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Cómo funciona ── */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Cómo funciona
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { step: "1", icon: "🔗", title: "Conecta wallet", desc: "Necesitas tu wallet activa para acreditar el reward" },
            { step: "2", icon: "📣", title: "Comparte en RRSS", desc: "Haz clic en la plataforma — te abrimos el enlace listo para compartir" },
            { step: "3", icon: "🪙", title: "Recibe OMMY", desc: `+${REWARDS.shareTwitter.toLocaleString()} OMMY por plataforma, registrados automáticamente` },
          ].map((s) => (
            <div key={s.step} className="text-center space-y-1.5">
              <div className="text-2xl">{s.icon}</div>
              <p className="text-xs font-bold text-slate-300">{s.title}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Historial ── */}
      {wallet && shareHistory.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Historial de shares
          </p>
          <div className="space-y-2">
            {shareHistory.map((share, i) => {
              const cfg = PLATFORMS.find((p) => p.id === share.platform);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className={`${cfg?.color ?? "text-slate-400"}`}>
                      {cfg?.icon}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{cfg?.label ?? share.platform}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(share.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-yellow-400">
                    +{share.ommyReward.toLocaleString()} OMMY
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Nota informativa ── */}
      <p className="text-[11px] text-slate-600 text-center leading-relaxed">
        Un share por plataforma por wallet. Los OMMY se registran off-chain y se acreditan
        en el lanzamiento de Agosto 2026. Cada share quema {BURN.perSocialShare} OMMY del supply.
      </p>
    </div>
  );
}
