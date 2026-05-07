"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveAccount, ConnectButton, useSendTransaction } from "thirdweb/react";
import { prepareTransaction, toWei } from "thirdweb";
import { client, avalanche } from "@/lib/thirdweb";
import {
  Lock, CheckCircle, Sparkles, ChevronRight,
  ExternalLink, AlertCircle, Wallet, ArrowRight,
} from "lucide-react";

const PRECOMPRA_WALLET   = "0x7c7cd287e3901888d29218b4fDe00C9c6Bc0F1e2" as `0x${string}`;
const OMMY_PRICE_USD     = 0.001;
const TOTAL_OMMY         = 2_997_924_580;
const UNLOCK_DATE        = "21 Feb 2027";
const UNLOCK_LABEL       = "Solsticio de Invierno 🌙";
const LAUNCH_DATE        = "21 Ago 2026";
const MIN_AVAX           = 0.05;

// ─── Countdown ───────────────────────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800/80 border border-amber-500/20 rounded-xl px-3 py-2 min-w-[52px] text-center">
        <span className="text-2xl font-black text-amber-300 tabular-nums">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PreCompraClient() {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();

  const [email, setEmail]           = useState("");
  const [avaxAmount, setAvaxAmount] = useState("1");
  const [avaxPrice, setAvaxPrice]   = useState(20);
  const [step, setStep]             = useState<"form" | "sending" | "done" | "error">("form");
  const [txHash, setTxHash]         = useState("");
  const [errorMsg, setErrorMsg]     = useState("");
  const [reservation, setReservation] = useState<{ ommyReserved: number; avaxAmount: number } | null>(null);
  const [stats, setStats]           = useState({ totalOmmyReserved: 0, totalHolders: 0 });

  const avaxNum   = parseFloat(avaxAmount) || 0;
  const ommyGet   = Math.floor((avaxNum * avaxPrice) / OMMY_PRICE_USD);
  const usdValue  = avaxNum * avaxPrice;
  const pctSold   = Math.min(100, (stats.totalOmmyReserved / TOTAL_OMMY) * 100);

  const launchCountdown = useCountdown("2026-08-21T00:00:00Z");
  const unlockCountdown = useCountdown("2027-02-21T00:00:00Z");

  // Cargar precio AVAX y stats
  const loadData = useCallback(async () => {
    try {
      const [priceRes, statsRes] = await Promise.all([
        fetch("/api/prices").then((r) => r.json()),
        account ? fetch(`/api/precompra/register?wallet=${account.address}`).then((r) => r.json()) : Promise.resolve(null),
      ]);
      if (priceRes?.prices?.avalanche) setAvaxPrice(priceRes.prices.avalanche.usd ?? 20);
      if (statsRes?.stats) setStats(statsRes.stats);
      if (statsRes?.reservation) setReservation(statsRes.reservation);
    } catch {
      // fallback silencioso
    }
  }, [account]);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Enviar AVAX ───────────────────────────────────────────────────────────
  async function handleBuy() {
    if (!account) return;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Introduce un email válido para recibir tu confirmación.");
      return;
    }
    if (avaxNum < MIN_AVAX) {
      setErrorMsg(`Mínimo ${MIN_AVAX} AVAX`);
      return;
    }
    setErrorMsg("");
    setStep("sending");

    try {
      // 1. Enviar AVAX al wallet pre-compra
      const tx = prepareTransaction({
        to: PRECOMPRA_WALLET,
        value: toWei(avaxAmount),
        chain: avalanche,
        client,
      });

      const receipt = await sendTx(tx);
      const hash = receipt.transactionHash;
      setTxHash(hash);

      // 2. Registrar en API
      const res = await fetch("/api/precompra/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: account.address,
          email,
          avaxAmount: avaxNum,
          avaxPriceUSD: avaxPrice,
          txHash: hash,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al registrar");

      setStep("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setErrorMsg(msg.includes("User rejected") ? "Transacción cancelada." : msg.slice(0, 200));
      setStep("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0906] text-white">
      {/* ── Fondo ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 60%)" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <a href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2">
            ← Om Domo
          </a>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold">
            <Sparkles size={11} /> Pre-lanzamiento · Precio fijo $0.001
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif">
            Pre-compra{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              OMMY COIN
            </span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Asegura tu precio antes del lanzamiento oficial. Unlock el <strong className="text-amber-300">{UNLOCK_LABEL}</strong> · {UNLOCK_DATE}.
          </p>
        </div>

        {/* ── Countdowns ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-4 border border-amber-500/20 text-center space-y-2">
            <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">☀️ Lanzamiento {LAUNCH_DATE}</p>
            <div className="flex items-center justify-center gap-2">
              <CountdownUnit value={launchCountdown.d} label="días" />
              <span className="text-amber-500/60 font-black text-lg mb-4">:</span>
              <CountdownUnit value={launchCountdown.h} label="hrs" />
              <span className="text-amber-500/60 font-black text-lg mb-4">:</span>
              <CountdownUnit value={launchCountdown.m} label="min" />
            </div>
          </div>
          <div className="glass rounded-2xl p-4 border border-purple-500/20 text-center space-y-2">
            <p className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">🌙 Unlock {UNLOCK_DATE}</p>
            <div className="flex items-center justify-center gap-2">
              <CountdownUnit value={unlockCountdown.d} label="días" />
              <span className="text-purple-500/60 font-black text-lg mb-4">:</span>
              <CountdownUnit value={unlockCountdown.h} label="hrs" />
              <span className="text-purple-500/60 font-black text-lg mb-4">:</span>
              <CountdownUnit value={unlockCountdown.m} label="min" />
            </div>
          </div>
        </div>

        {/* ── Barra de progreso ── */}
        <div className="glass rounded-2xl p-5 border border-slate-700/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">OMMY reservados</span>
            <span className="text-amber-300 font-bold">{stats.totalOmmyReserved.toLocaleString()} / {TOTAL_OMMY.toLocaleString()}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800/60 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0.5, pctSold)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{stats.totalHolders} early believers</span>
            <span>{pctSold.toFixed(2)}% reservado</span>
          </div>
        </div>

        {/* ── Stats rápidas ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Precio OMMY", value: "$0.001", sub: "Precio de lanzamiento" },
            { label: "Lock hasta", value: "21 Feb", sub: "Invierno 2027" },
            { label: "AVAX precio", value: `$${avaxPrice.toFixed(0)}`, sub: "Precio actual" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-3 text-center border border-slate-700/30">
              <p className="text-base font-black text-amber-300">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
              <p className="text-[9px] text-slate-600">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Reserva existente ── */}
        {reservation && step !== "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-green-500/30"
            style={{ background: "rgba(34,197,94,0.05)" }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-300">Ya tienes una reserva activa</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {reservation.ommyReserved.toLocaleString()} OMMY · {reservation.avaxAmount.toFixed(4)} AVAX · Unlock {UNLOCK_DATE}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Puedes añadir más OMMY enviando otra transacción.</p>
          </motion.div>
        )}

        {/* ── Formulario ── */}
        <AnimatePresence mode="wait">

          {/* FORM */}
          {step === "form" || step === "error" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="glass rounded-2xl p-6 border border-amber-500/20 space-y-5"
              style={{ background: "rgba(245,158,11,0.03)" }}
            >
              <h2 className="text-sm font-bold text-slate-200">Reservar OMMY COIN</h2>

              {/* Wallet */}
              {!account ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Conecta tu wallet Avalanche para continuar</p>
                  <ConnectButton
                    client={client}
                    connectButton={{ label: "Conectar wallet", style: { fontSize: "13px", width: "100%", borderRadius: "12px" } }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Wallet size={13} className="text-green-400" />
                  <span className="text-xs text-green-300 font-mono">{account.address.slice(0, 8)}...{account.address.slice(-6)}</span>
                  <span className="ml-auto text-[10px] text-green-500">✓ Conectada</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Email para confirmación</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/40 transition-colors"
                />
              </div>

              {/* Cantidad AVAX */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Cantidad de AVAX</label>
                <div className="relative">
                  <input
                    type="number"
                    value={avaxAmount}
                    onChange={(e) => setAvaxAmount(e.target.value)}
                    min={MIN_AVAX}
                    step="0.1"
                    placeholder="1"
                    className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/40 transition-colors pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">AVAX</span>
                </div>
                {/* Botones rápidos */}
                <div className="flex gap-2">
                  {[0.5, 1, 5, 10].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAvaxAmount(String(v))}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer
                        ${avaxAmount === String(v)
                          ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                          : "bg-slate-800/40 text-slate-500 border border-slate-700/30 hover:text-slate-300"}`}
                    >
                      {v} AVAX
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {avaxNum >= MIN_AVAX && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Recibirás</span>
                    <span className="text-lg font-black text-amber-300">{ommyGet.toLocaleString()} OMMY</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Valor USD equivalente</span>
                    <span>${usdValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1"><Lock size={9} /> Unlock</span>
                    <span className="text-purple-400 font-semibold">{UNLOCK_LABEL} · {UNLOCK_DATE}</span>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">{errorMsg}</p>
                </div>
              )}

              {/* CTA */}
              <motion.button
                onClick={handleBuy}
                disabled={!account || avaxNum < MIN_AVAX}
                whileHover={account && avaxNum >= MIN_AVAX ? { scale: 1.02 } : {}}
                whileTap={account && avaxNum >= MIN_AVAX ? { scale: 0.98 } : {}}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer
                  ${account && avaxNum >= MIN_AVAX
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 hover:opacity-90 shadow-lg shadow-amber-500/20"
                    : "bg-slate-800/60 text-slate-600 cursor-not-allowed"}`}
              >
                <Sparkles size={15} />
                {!account ? "Conecta tu wallet primero" : `Reservar ${ommyGet.toLocaleString()} OMMY`}
                {account && avaxNum >= MIN_AVAX && <ArrowRight size={15} />}
              </motion.button>

              <p className="text-center text-[10px] text-slate-600 leading-relaxed">
                Envías {avaxNum.toFixed(4)} AVAX · Red Avalanche Mainnet · Precio fijo $0.001/OMMY
              </p>
            </motion.div>
          ) : null}

          {/* SENDING */}
          {step === "sending" && (
            <motion.div
              key="sending"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-10 border border-amber-500/20 text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 mx-auto"
              />
              <p className="text-sm font-bold text-slate-200">Procesando transacción…</p>
              <p className="text-xs text-slate-500">Confirma en tu wallet y espera la confirmación on-chain.</p>
            </motion.div>
          )}

          {/* DONE */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 border border-green-500/30 text-center space-y-5"
              style={{ background: "rgba(34,197,94,0.04)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto"
              >
                <CheckCircle size={28} className="text-green-400" />
              </motion.div>

              <div>
                <h2 className="text-xl font-bold text-green-300 mb-1">¡Reserva confirmada! 🌟</h2>
                <p className="text-sm text-slate-400">Eres un early believer de Om Domo.</p>
              </div>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">OMMY reservados</span>
                  <span className="font-black text-amber-300">{ommyGet.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Unlock</span>
                  <span className="text-purple-400 font-semibold">{UNLOCK_LABEL} · {UNLOCK_DATE}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">Revisa tu email — te enviamos la confirmación con los detalles.</p>

              {txHash && (
                <a
                  href={`https://snowtrace.io/tx/${txHash}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Ver en Snowtrace <ExternalLink size={11} />
                </a>
              )}

              <div className="flex gap-3">
                <a href="/dashboard"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  Ver en Dashboard <ChevronRight size={12} />
                </a>
                <button
                  onClick={() => { setStep("form"); setAvaxAmount("1"); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-pointer"
                >
                  Añadir más OMMY
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── Info lock ── */}
        <div className="glass rounded-2xl p-5 border border-slate-700/30 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">¿Cómo funciona?</h3>
          {[
            { n: "01", title: "Conecta tu wallet", desc: "Avalanche Mainnet — MetaMask, Coinbase Wallet o cualquier wallet compatible." },
            { n: "02", title: "Envías AVAX", desc: `Precio fijo: 1 AVAX = ${Math.floor(avaxPrice / OMMY_PRICE_USD).toLocaleString()} OMMY (≈ $${avaxPrice.toFixed(0)} USD).` },
            { n: "03", title: "Tokens reservados", desc: "Quedan bloqueados en el contrato hasta el 21 Feb 2027." },
            { n: "04", title: "Unlock y lanzamiento", desc: "El 21 Ago 2026 es el lanzamiento oficial. El 21 Feb 2027 puedes reclamar tus OMMY." },
          ].map((s) => (
            <div key={s.n} className="flex gap-3">
              <span className="text-[10px] font-black text-amber-500/60 w-5 flex-shrink-0 mt-0.5">{s.n}</span>
              <div>
                <p className="text-xs font-bold text-slate-300">{s.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
