"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveAccount, ConnectButton, useSendTransaction } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc1155";
import { client, avalanche, avalancheFuji } from "@/lib/thirdweb";
import { getNFTContract, isMainnet } from "@/lib/nft";

// ─── Constantes ────────────────────────────────────────────────────────────────
// (precio gestionado por Claim Conditions en Thirdweb — 0.5 AVAX)

// ─── Configuración Zodiacal ────────────────────────────────────────────────────

const ZODIAC_CONFIG: Record<string, { tokenId: bigint; emoji: string; element: string; dates: string }> = {
  "Aries":       { tokenId: BigInt(1),  emoji: "♈", element: "Fuego",   dates: "21 Mar – 19 Abr" },
  "Tauro":       { tokenId: BigInt(2),  emoji: "♉", element: "Tierra",  dates: "20 Abr – 20 May" },
  "Géminis":     { tokenId: BigInt(3),  emoji: "♊", element: "Aire",    dates: "21 May – 20 Jun" },
  "Cáncer":      { tokenId: BigInt(4),  emoji: "♋", element: "Agua",    dates: "21 Jun – 22 Jul" },
  "Leo":         { tokenId: BigInt(5),  emoji: "♌", element: "Fuego",   dates: "23 Jul – 22 Ago" },
  "Virgo":       { tokenId: BigInt(6),  emoji: "♍", element: "Tierra",  dates: "23 Ago – 22 Sep" },
  "Libra":       { tokenId: BigInt(7),  emoji: "♎", element: "Aire",    dates: "23 Sep – 22 Oct" },
  "Escorpio":    { tokenId: BigInt(8),  emoji: "♏", element: "Agua",    dates: "23 Oct – 21 Nov" },
  "Sagitario":   { tokenId: BigInt(9),  emoji: "♐", element: "Fuego",   dates: "22 Nov – 21 Dic" },
  "Capricornio": { tokenId: BigInt(10), emoji: "♑", element: "Tierra",  dates: "22 Dic – 19 Ene" },
  "Acuario":     { tokenId: BigInt(11), emoji: "♒", element: "Aire",    dates: "20 Ene – 18 Feb" },
  "Piscis":      { tokenId: BigInt(12), emoji: "♓", element: "Agua",    dates: "19 Feb – 20 Mar" },
};

// ─── Colores por elemento ──────────────────────────────────────────────────────

const ELEMENT_COLORS: Record<string, { glow: string; gradient: string; badge: string }> = {
  "Fuego":  { glow: "rgba(249,115,22,0.4)",  gradient: "from-orange-500 to-red-500",    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
  "Tierra": { glow: "rgba(34,197,94,0.4)",   gradient: "from-green-500 to-amber-500",   badge: "bg-green-500/20 text-green-300 border-green-500/40" },
  "Aire":   { glow: "rgba(6,182,212,0.4)",   gradient: "from-cyan-500 to-blue-500",     badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  "Agua":   { glow: "rgba(139,92,246,0.4)",  gradient: "from-blue-500 to-purple-600",   badge: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Step = "loading" | "preview" | "claim" | "buy" | "done" | "error";

interface ZodiacInfo {
  name: string;
  tokenId: bigint;
  emoji: string;
  element: string;
  dates: string;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ClaimZodiacClient() {
  const searchParams = useSearchParams();
  const account = useActiveAccount();

  const emailParam  = searchParams.get("email")  ?? "";
  const walletParam = searchParams.get("wallet") ?? "";
  const zodiacParam = searchParams.get("zodiac") ?? "";

  const [step, setStep] = useState<Step>("loading");
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);
  const [isFreeClaimAvailable, setIsFreeClaimAvailable] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [minting, setMinting] = useState(false);
  const [zodiacInput, setZodiacInput] = useState<string>("");

  const activeChain = isMainnet ? avalanche : avalancheFuji;

  const { mutateAsync: sendTx } = useSendTransaction();

  // ─── Cargar zodíaco del perfil o parámetros URL ─────────────────────────────

  const loadZodiac = useCallback(async () => {
    // Si hay zodíaco en URL, usarlo directamente
    if (zodiacParam && ZODIAC_CONFIG[zodiacParam]) {
      const cfg = ZODIAC_CONFIG[zodiacParam];
      setZodiacInfo({ name: zodiacParam, ...cfg });
      setIsFreeClaimAvailable(true);
      setStep("preview");
      return;
    }

    // Si hay email o wallet, consultar el perfil
    if (emailParam || walletParam) {
      try {
        const qs = walletParam
          ? `wallet=${walletParam}`
          : `email=${encodeURIComponent(emailParam)}`;
        const res = await fetch(`/api/profile?${qs}`);
        const profile = await res.json();
        if (profile?.zodiac && ZODIAC_CONFIG[profile.zodiac]) {
          const cfg = ZODIAC_CONFIG[profile.zodiac];
          setZodiacInfo({ name: profile.zodiac, ...cfg });
          setIsFreeClaimAvailable(!profile.nftClaimed);
          setStep("preview");
          return;
        }
      } catch {
        // ignorar error de red, pasar a selección manual
      }
    }

    // Sin datos suficientes: mostrar selector de signo
    setStep("claim");
  }, [zodiacParam, emailParam, walletParam]);

  useEffect(() => {
    loadZodiac();
  }, [loadZodiac]);

  // ─── Cuando el usuario elige su signo manualmente ───────────────────────────

  function selectZodiac(name: string) {
    const cfg = ZODIAC_CONFIG[name];
    if (!cfg) return;
    setZodiacInfo({ name, ...cfg });
    setIsFreeClaimAvailable(false); // compra, no claim gratis
    setStep("buy");
  }

  // ─── Claim gratuito (perfil completo → servidor mintea gratis) ──────────────

  async function handleFreeClaim() {
    if (!account || !zodiacInfo) return;
    // Necesitamos email y birthday del perfil — están en los searchParams o localStorage
    const birthdayParam = searchParams.get("birthday") ?? "";
    setMinting(true);
    try {
      const res = await fetch("/api/nft/claim-zodiac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: account.address,
          email: emailParam,
          birthday: birthdayParam,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al mintear");

      setTxHash(data.devMode ? "" : (data.txHash || ""));
      setStep("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStep("error");
    } finally {
      setMinting(false);
    }
  }

  // ─── Compra con 0.5 AVAX (claimTo directo al contrato) ──────────────────────
  // El precio viene de la Claim Condition configurada en Thirdweb Dashboard (0.5 AVAX)

  async function handleBuyWithAvax() {
    if (!account || !zodiacInfo) return;
    setMinting(true);
    try {
      const nftContract = getNFTContract();
      if (!nftContract) throw new Error("Contrato NFT no configurado");

      const transaction = claimTo({
        contract: nftContract,
        to: account.address,
        tokenId: zodiacInfo.tokenId,
        quantity: BigInt(1),
      });

      const receipt = await sendTx(transaction);
      setTxHash(receipt.transactionHash);
      setStep("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStep("error");
    } finally {
      setMinting(false);
    }
  }

  // ─── Colores del elemento ───────────────────────────────────────────────────

  const elementColors = zodiacInfo
    ? ELEMENT_COLORS[zodiacInfo.element] ?? ELEMENT_COLORS["Aire"]
    : ELEMENT_COLORS["Aire"];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
        {zodiacInfo && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{ background: elementColors.glow }}
          />
        )}
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl font-serif font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Om Domo
          </span>
          <span className="text-slate-500 text-sm">· NFT Zodiacal</span>
        </div>

        <AnimatePresence mode="wait">

          {/* ── LOADING ─────────────────────────────────────────────────────── */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-20"
            >
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
              <p className="text-slate-400 text-sm">Cargando tu perfil zodiacal...</p>
            </motion.div>
          )}

          {/* ── PREVIEW + CLAIM/BUY ──────────────────────────────────────────── */}
          {(step === "preview" || step === "buy") && zodiacInfo && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Tarjeta NFT */}
              <div className="relative glass border border-slate-700/50 rounded-3xl p-8 mb-6 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 rounded-3xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${elementColors.glow} 0%, transparent 70%)` }}
                />

                {/* Emoji zodiacal */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-8xl text-center mb-4 relative z-10"
                >
                  {zodiacInfo.emoji}
                </motion.div>

                {/* Info */}
                <div className="text-center relative z-10">
                  <h1 className="text-3xl font-serif font-bold text-white mb-1">{zodiacInfo.name}</h1>
                  <p className="text-slate-400 text-sm mb-3">{zodiacInfo.dates}</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${elementColors.badge}`}>
                    {zodiacInfo.element === "Fuego" ? "🔥" : zodiacInfo.element === "Tierra" ? "🌱" : zodiacInfo.element === "Aire" ? "💨" : "💧"}
                    {zodiacInfo.element}
                  </span>
                  <p className="text-slate-600 text-xs mt-3 font-medium uppercase tracking-widest">Om Domo Zodiac Collection</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { label: "Precio", value: isFreeClaimAvailable ? "Gratis" : "0.5 AVAX" },
                  { label: "Tipo",   value: "ERC-1155" },
                  { label: "Red",    value: "Avalanche" },
                  { label: "Rareza", value: "Genesis" },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-3 text-center border border-slate-700/40">
                    <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-xs font-bold text-slate-200">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {!account ? (
                <div className="flex justify-center">
                  <ConnectButton
                    client={client}
                    chain={activeChain}
                    connectButton={{
                      label: "Conectar wallet para reclamar",
                      className: "!w-full !px-6 !py-4 !rounded-2xl !bg-gradient-to-r !from-purple-600 !to-cyan-600 !text-white !font-bold !text-sm hover:!opacity-90 !transition-opacity",
                    }}
                  />
                </div>
              ) : isFreeClaimAvailable ? (
                <motion.button
                  onClick={handleFreeClaim}
                  disabled={minting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-green-900/40"
                >
                  {minting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Minteando NFT...
                    </span>
                  ) : (
                    "✨ Reclamar gratis →"
                  )}
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleBuyWithAvax}
                  disabled={minting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-red-900/40"
                >
                  {minting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    "Comprar · 0.5 AVAX →"
                  )}
                </motion.button>
              )}

              {account && !isFreeClaimAvailable && (
                <p className="text-xs text-slate-500 text-center mt-3">
                  También puedes obtenerlo gratis completando tu perfil con email y fecha de nacimiento.
                  <a href="/dashboard" className="text-purple-400 hover:underline ml-1">Ir al perfil →</a>
                </p>
              )}
            </motion.div>
          )}

          {/* ── SELECTOR DE SIGNO MANUAL ─────────────────────────────────────── */}
          {step === "claim" && (
            <motion.div
              key="claim"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass border border-slate-700/50 rounded-3xl p-6 mb-4">
                <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Elige tu signo zodiacal</h2>
                <p className="text-slate-400 text-sm text-center mb-6">
                  Selecciona tu signo para comprar tu NFT zodiacal por 0.5 AVAX.
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(ZODIAC_CONFIG).map(([name, cfg]) => {
                    const colors = ELEMENT_COLORS[cfg.element] ?? ELEMENT_COLORS["Aire"];
                    return (
                      <motion.button
                        key={name}
                        onClick={() => { setZodiacInput(name); selectZodiac(name); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                          zodiacInput === name
                            ? `border-purple-400 bg-purple-500/20`
                            : `border-slate-700/50 hover:border-slate-600 bg-slate-800/40`
                        }`}
                      >
                        <span className="text-2xl">{cfg.emoji}</span>
                        <span className="text-xs text-slate-300 font-medium">{name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${colors.badge}`}>
                          {cfg.element}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {!account && (
                <div className="flex justify-center">
                  <ConnectButton
                    client={client}
                    chain={activeChain}
                    connectButton={{
                      label: "Conectar wallet →",
                      className: "!px-6 !py-3 !rounded-xl !bg-gradient-to-r !from-purple-600 !to-cyan-600 !text-white !font-bold !text-sm hover:!opacity-90 !transition-opacity",
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* ── ÉXITO ────────────────────────────────────────────────────────── */}
          {step === "done" && zodiacInfo && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-center"
            >
              {/* Celebración */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.6 }}
                className="text-7xl mb-4"
              >
                {zodiacInfo.emoji}
              </motion.div>

              {/* Partículas de celebración */}
              <div className="relative mb-6">
                {["✨", "🎉", "⭐", "💫", "🌟"].map((p, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: -60,
                      x: (i - 2) * 30,
                    }}
                    transition={{ duration: 1.5, delay: i * 0.1 }}
                    className="absolute text-xl"
                    style={{ left: "50%", top: 0 }}
                  >
                    {p}
                  </motion.span>
                ))}
              </div>

              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                ¡NFT {zodiacInfo.name} reclamado!
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Tu NFT zodiacal de la colección Genesis Om Domo ya está en tu wallet.
              </p>

              <div className="glass border border-green-500/30 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs text-slate-500 mb-2">Detalles del NFT</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Signo</span>
                  <span className="text-white font-medium">{zodiacInfo.name} {zodiacInfo.emoji}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-slate-400">Elemento</span>
                  <span className="text-white font-medium">{zodiacInfo.element}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-slate-400">Rareza</span>
                  <span className="text-purple-300 font-medium">Genesis</span>
                </div>
                {txHash && txHash !== "DEV_MODE" && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <a
                      href={`https://testnet.snowtrace.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                    >
                      Ver en Snowtrace →
                    </a>
                  </div>
                )}
                {txHash === "DEV_MODE" && (
                  <p className="text-xs text-amber-400/70 mt-2">Modo desarrollo — sin transacción real</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="/dashboard"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm text-center hover:opacity-90 transition-opacity"
                >
                  Ir a mi Dashboard →
                </a>
                <a
                  href="/"
                  className="w-full py-3 rounded-2xl border border-slate-700/50 text-slate-400 font-medium text-sm text-center hover:border-slate-600 hover:text-slate-300 transition-all"
                >
                  Volver al inicio
                </a>
              </div>
            </motion.div>
          )}

          {/* ── ERROR ────────────────────────────────────────────────────────── */}
          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center glass border border-red-500/30 rounded-3xl p-8"
            >
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Ha ocurrido un error</h2>
              <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
              <button
                onClick={() => { setStep("preview"); setErrorMsg(""); }}
                className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors"
              >
                Reintentar →
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-8">
          Om Domo Zodiac Collection · Avalanche {isMainnet ? "Mainnet" : "Fuji Testnet"} · ERC-1155
        </p>
      </div>
    </div>
  );
}
