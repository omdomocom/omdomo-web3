"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote, Clock, CheckCircle, Sparkles, ChevronRight,
  MessageSquare, ThumbsUp, ThumbsDown, Zap, Star, Eye, GitCompare,
  Calendar, Layers, ArrowRight, AlertCircle, Trophy, Loader2, Wallet,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type RarityTier = "standard" | "rare" | "legendary";
type SeasonPhase =
  | "generation" | "feedback1" | "refinement"
  | "feedback2" | "final-vote" | "launch" | "closed";
type Sentiment = "positive" | "neutral" | "negative";

interface NFTProposal {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  emoji: string;
  rarityTier: RarityTier;
  communityScore: number;
  feedbackCount: number;
  votesYes?: number;
  votesNo?: number;
  attributes: Record<string, string | number>;
}

interface ActiveSeason {
  id: string;
  collectionName: string;
  collectionEmoji: string;
  seasonNumber: number;
  totalSeasons: number;
  scheduledMonth: string;
  nfts: NFTProposal[];
  phase: SeasonPhase;
  feedback1End: string;
  refinementDate: string;
  feedback2End: string;
  finalVoteEnd: string;
  launchDate: string;
}

type NFTUserStatus = {
  feedback1?: Sentiment;
  feedback2?: Sentiment;
  finalVote?: "yes" | "no";
};

// ─── Configuración de fases ───────────────────────────────────────────────────

const PHASE_CONFIG: Record<SeasonPhase, {
  label: string; emoji: string; detail: string;
  color: string; bg: string; border: string;
}> = {
  generation:   { label: "Generando",        emoji: "🎨", detail: "La IA está creando los diseños",        color: "text-blue-400",   bg: "bg-blue-900/20",   border: "border-blue-500/30"   },
  feedback1:    { label: "1er Feedback",      emoji: "🗳️", detail: "Tu opinión inicial (Lun–Mié)",         color: "text-yellow-400", bg: "bg-yellow-900/20", border: "border-yellow-500/30" },
  refinement:   { label: "Refinando",         emoji: "⚙️", detail: "IA mejora con tu feedback",             color: "text-orange-400", bg: "bg-orange-900/20", border: "border-orange-500/30" },
  feedback2:    { label: "2do Feedback",      emoji: "✨", detail: "¿Mejoraron? Feedback complementario",  color: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-500/30" },
  "final-vote": { label: "Votación Final",    emoji: "⚡", detail: "Aprueba la versión definitiva",        color: "text-green-400",  bg: "bg-green-900/20",  border: "border-green-500/30"  },
  launch:       { label: "En Venta",          emoji: "🚀", detail: "NFTs disponibles para comprar",        color: "text-cyan-400",   bg: "bg-cyan-900/20",   border: "border-cyan-500/30"   },
  closed:       { label: "Temporada Cerrada", emoji: "✅", detail: "Finalizó esta temporada",              color: "text-slate-400",  bg: "bg-slate-900/20",  border: "border-slate-700/30"  },
};

const PHASE_ORDER: SeasonPhase[] = ["generation","feedback1","refinement","feedback2","final-vote","launch","closed"];

const RARITY_CONFIG: Record<RarityTier, { label: string; color: string; bg: string; units: number }> = {
  standard:  { label: "Standard",  color: "text-slate-300",  bg: "bg-slate-700/40",  units: 111 },
  rare:      { label: "Rare",      color: "text-cyan-300",   bg: "bg-cyan-900/30",   units: 33  },
  legendary: { label: "Legendary", color: "text-yellow-300", bg: "bg-yellow-900/30", units: 11  },
};

// ─── NFT Placeholder visual ───────────────────────────────────────────────────

function NFTPlaceholder({ nft, size = "md", isRefined = false }: {
  nft: NFTProposal; size?: "sm" | "md" | "lg"; isRefined?: boolean;
}) {
  const dim = size === "lg" ? "h-48" : size === "md" ? "h-36" : "h-24";
  const rarity = RARITY_CONFIG[nft.rarityTier];
  return (
    <div className={`${dim} w-full rounded-xl overflow-hidden relative flex items-center justify-center`}
      style={{ background: `radial-gradient(circle at 40% 40%, ${nft.rarityTier === "legendary" ? "#4B0082" : nft.rarityTier === "rare" ? "#0c2340" : "#1a1a2e"}, #050510)` }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className={`rounded-full border ${nft.rarityTier === "legendary" ? "border-yellow-400/60 w-28 h-28" : nft.rarityTier === "rare" ? "border-cyan-400/60 w-24 h-24" : "border-slate-500/40 w-20 h-20"}`} />
      </div>
      <div className="relative z-10 text-center">
        <div className={size === "lg" ? "text-5xl mb-1" : size === "md" ? "text-4xl mb-1" : "text-2xl"}>{nft.emoji}</div>
        {size !== "sm" && <p className="text-xs text-slate-400 font-medium">{nft.nameEs}</p>}
      </div>
      {isRefined && (
        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">v2</div>
      )}
      <div className={`absolute bottom-2 left-2 text-xs px-1.5 py-0.5 rounded ${rarity.bg} ${rarity.color} font-medium`}>
        {rarity.label}
      </div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-end justify-center pb-8">
        <span className="text-xs text-slate-500 italic">preview pendiente</span>
      </div>
    </div>
  );
}

// ─── Barra de fases ───────────────────────────────────────────────────────────

function PhaseTimeline({ currentPhase }: { currentPhase: SeasonPhase }) {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1 scrollbar-hide">
      {PHASE_ORDER.map((phase, idx) => {
        const cfg = PHASE_CONFIG[phase];
        const done   = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={phase} className="flex items-center">
            <div className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
              active ? `${cfg.bg} ${cfg.border} border` : done ? "opacity-70" : "opacity-30"
            }`}>
              <span className="text-sm">{cfg.emoji}</span>
              <span className={`text-xs font-medium whitespace-nowrap ${active ? cfg.color : done ? "text-slate-400" : "text-slate-600"}`}>
                {cfg.label}
              </span>
              {done   && <CheckCircle size={8} className="text-green-400" />}
              {active && <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />}
            </div>
            {idx < PHASE_ORDER.length - 1 && (
              <ChevronRight size={12} className={`flex-shrink-0 ${idx < currentIdx ? "text-slate-500" : "text-slate-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tarjeta NFT ─────────────────────────────────────────────────────────────

interface NFTCardProps {
  nft: NFTProposal;
  phase: SeasonPhase;
  seasonId: string;
  wallet?: string;
  userStatus?: NFTUserStatus;
  onFeedbackSubmit: (nftId: string, sentiment: Sentiment) => void;
  onVoteSubmit: (nftId: string, vote: "yes" | "no") => void;
}

function NFTCard({ nft, phase, seasonId, wallet, userStatus, onFeedbackSubmit, onVoteSubmit }: NFTCardProps) {
  const [feedbackText, setFeedbackText]     = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [localError, setLocalError]         = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [expanded, setExpanded]             = useState(false);
  const [localScore, setLocalScore]         = useState(nft.communityScore);
  const [localCount, setLocalCount]         = useState(nft.feedbackCount);
  const [localVotes, setLocalVotes]         = useState({ yes: nft.votesYes ?? 0, no: nft.votesNo ?? 0 });

  const isFeedback  = phase === "feedback1" || phase === "feedback2";
  const isFinalVote = phase === "final-vote";
  const isLaunch    = phase === "launch";

  const alreadyFeedback = phase === "feedback1" ? !!userStatus?.feedback1 : !!userStatus?.feedback2;
  const finalVoteResult = userStatus?.finalVote ?? null;

  const rarity = RARITY_CONFIG[nft.rarityTier];
  const scoreColor = localScore >= 85 ? "text-green-400" : localScore >= 65 ? "text-yellow-400" : "text-red-400";

  async function submitFeedback(sentiment: Sentiment) {
    if (!wallet) { setLocalError("Conecta tu wallet para dar feedback."); return; }
    if (alreadyFeedback || submitting) return;
    setSubmitting(true);
    setLocalError("");
    try {
      const res = await fetch("/api/dao/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seasonId, nftId: nft.id, phase, wallet, sentiment, text: feedbackText }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.alreadySubmitted) { onFeedbackSubmit(nft.id, sentiment); return; }
        setLocalError(data.error ?? "Error al enviar feedback");
        return;
      }
      if (sentiment === "positive") setLocalScore(s => Math.min(100, s + 1));
      setLocalCount(c => c + 1);
      onFeedbackSubmit(nft.id, sentiment);
    } catch {
      setLocalError("Error de red. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitFinalVote(vote: "yes" | "no") {
    if (!wallet) { setLocalError("Conecta tu wallet para votar."); return; }
    if (finalVoteResult || voteSubmitting) return;
    setVoteSubmitting(true);
    setLocalError("");
    try {
      const res = await fetch("/api/dao/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seasonId, nftId: nft.id, wallet, vote }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.alreadyVoted) { onVoteSubmit(nft.id, data.previousVote ?? vote); return; }
        setLocalError(data.error ?? "Error al registrar voto");
        return;
      }
      setLocalVotes(v => ({ ...v, [vote]: v[vote] + 1 }));
      onVoteSubmit(nft.id, vote);
    } catch {
      setLocalError("Error de red. Intenta de nuevo.");
    } finally {
      setVoteSubmitting(false);
    }
  }

  const totalVotes = localVotes.yes + localVotes.no;
  const voteYesPct = totalVotes > 0 ? (localVotes.yes / totalVotes) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-slate-700/40 overflow-hidden"
    >
      {/* NFT Image */}
      <div className="relative">
        {phase === "feedback2" && showComparison ? (
          <div className="grid grid-cols-2 gap-1 p-2">
            <div>
              <p className="text-xs text-slate-500 text-center mb-1">Original</p>
              <NFTPlaceholder nft={nft} size="sm" />
            </div>
            <div>
              <p className="text-xs text-purple-400 text-center mb-1 font-medium">Refinado ✨</p>
              <NFTPlaceholder nft={nft} size="sm" isRefined />
            </div>
          </div>
        ) : (
          <NFTPlaceholder nft={nft} size="md" isRefined={phase === "feedback2" || phase === "final-vote" || isLaunch} />
        )}
        {phase === "feedback2" && (
          <button
            onClick={() => setShowComparison(v => !v)}
            className="absolute top-2 right-2 bg-black/60 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-purple-300 flex items-center gap-1 hover:bg-purple-900/40 transition-all"
          >
            <GitCompare size={10} /> {showComparison ? "Ver solo v2" : "Comparar"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-xs px-1.5 py-0.5 rounded ${rarity.bg} ${rarity.color} font-medium`}>
                {rarity.label} · {rarity.units}u
              </span>
              {nft.rarityTier === "legendary" && <Star size={10} className="text-yellow-400" />}
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-1">{nft.nameEs}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-lg font-black ${scoreColor}`}>{localScore}</p>
            <p className="text-xs text-slate-500">score</p>
          </div>
        </div>

        {/* Score bar */}
        <div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${localScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${localScore >= 85 ? "bg-gradient-to-r from-green-500 to-emerald-400" : localScore >= 65 ? "bg-gradient-to-r from-yellow-500 to-amber-400" : "bg-gradient-to-r from-red-500 to-rose-400"}`}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-0.5">
            <span>{localCount} opiniones</span>
            <span className="flex items-center gap-0.5"><Eye size={8} /> comunidad</span>
          </div>
        </div>

        {/* Votos finales */}
        {isFinalVote && totalVotes > 0 && (
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="text-green-400">✓ {localVotes.yes} a favor</span>
              <span className="text-red-400">✗ {localVotes.no} en contra</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${voteYesPct}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{voteYesPct.toFixed(0)}% aprobación · {totalVotes} votos</p>
          </div>
        )}

        {/* Description */}
        <button onClick={() => setExpanded(v => !v)} className="text-left w-full">
          <p className={`text-xs text-slate-400 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {nft.description}
          </p>
          {!expanded && <span className="text-xs text-purple-400">ver más</span>}
        </button>

        {/* Attributes */}
        {expanded && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(nft.attributes).map(([k, v]) => (
              <span key={k} className="text-xs bg-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded">
                {k}: <strong className="text-slate-300">{v}</strong>
              </span>
            ))}
          </div>
        )}

        {/* Error local */}
        {localError && (
          <p className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-2 py-1.5">{localError}</p>
        )}

        {/* Sin wallet */}
        {!wallet && (isFeedback || isFinalVote) && (
          <div className="border-t border-slate-700/40 pt-2.5">
            <div className="flex items-center gap-2 bg-slate-800/40 rounded-lg p-2.5 text-xs text-slate-400">
              <Wallet size={12} className="text-purple-400 flex-shrink-0" />
              <span>Conecta tu wallet para participar y ganar OMMY</span>
            </div>
          </div>
        )}

        {/* ── FASE: feedback1 / feedback2 ───────────────────────────────────── */}
        {isFeedback && wallet && (
          <div className="border-t border-slate-700/40 pt-2.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={11} className="text-purple-400" />
              <p className="text-xs font-semibold text-slate-300">
                {phase === "feedback1" ? "Primer feedback" : "Segundo feedback (tras refinamiento)"}
              </p>
            </div>
            {!alreadyFeedback ? (
              <>
                {phase === "feedback2" && (
                  <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-2 text-xs text-purple-300">
                    ✨ Este es el diseño mejorado. ¿Qué te parece la evolución?
                  </div>
                )}
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder={phase === "feedback1"
                    ? "¿Qué te parece? ¿Colores, composición, energía?"
                    : "¿Mejoró respecto al original? ¿Qué ajuste haría?"
                  }
                  rows={2}
                  maxLength={500}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg p-2 text-xs text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <div className="flex items-center gap-2">
                  {(["positive","neutral","negative"] as Sentiment[]).map(s => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      disabled={submitting}
                      onClick={() => submitFeedback(s)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                        s === "positive" ? "bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25"
                        : s === "neutral" ? "bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:bg-slate-700/50"
                        : "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      {submitting ? <Loader2 size={10} className="animate-spin" />
                        : s === "positive" ? <><ThumbsUp size={10} /> Me gusta</>
                        : s === "neutral"  ? <>— Neutral</>
                        : <><ThumbsDown size={10} /> Mejorar</>
                      }
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-slate-600 text-center">+100 OMMY por feedback válido</p>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-500/20 rounded-lg p-2 text-center">
                <CheckCircle size={14} className="text-green-400 mx-auto mb-1" />
                <p className="text-xs text-green-400 font-semibold">Feedback enviado</p>
                <p className="text-xs text-slate-500">+100 OMMY pendientes de verificación</p>
              </motion.div>
            )}
          </div>
        )}

        {/* ── FASE: final-vote ──────────────────────────────────────────────── */}
        {isFinalVote && wallet && (
          <div className="border-t border-slate-700/40 pt-2.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <Vote size={11} className="text-green-400" />
              <p className="text-xs font-semibold text-slate-300">¿Apruebas este NFT para mint?</p>
            </div>
            {!finalVoteResult ? (
              <div className="flex gap-2">
                {(["yes","no"] as const).map(v => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.97 }}
                    disabled={voteSubmitting}
                    onClick={() => submitFinalVote(v)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1 disabled:opacity-50 ${
                      v === "yes"
                        ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
                        : "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    {voteSubmitting ? <Loader2 size={12} className="animate-spin" />
                      : v === "yes" ? "✓ Aprobar" : "✗ Rechazar"}
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`rounded-lg p-2 text-center text-xs ${finalVoteResult === "yes" ? "bg-green-900/20 border border-green-500/20 text-green-400" : "bg-red-900/10 border border-red-500/20 text-red-400"}`}>
                {finalVoteResult === "yes" ? "✓ Votaste a favor · +200 OMMY" : "✗ Votaste en contra · gracias por participar"}
              </motion.div>
            )}
          </div>
        )}

        {/* ── FASE: launch ─────────────────────────────────────────────────── */}
        {isLaunch && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 hover:from-purple-500 hover:to-violet-400 transition-all shadow-lg shadow-purple-900/30"
          >
            <Zap size={12} /> Mintear NFT — 5€
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function NFTStudioVoting({ wallet }: { wallet?: string }) {
  const [season, setSeason]       = useState<ActiveSeason | null>(null);
  const [userStatus, setUserStatus] = useState<Record<string, NFTUserStatus>>({});
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState<"nfts" | "stats" | "calendar">("nfts");

  const fetchSeason = useCallback(async () => {
    try {
      const res = await fetch("/api/dao/season");
      const data = await res.json();
      if (data.season) setSeason(data.season);
    } catch {
      console.error("[NFTStudioVoting] error cargando temporada");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserStatus = useCallback(async (w: string, seasonId: string) => {
    try {
      const res = await fetch(`/api/dao/status?seasonId=${seasonId}&wallet=${w}`);
      const data = await res.json();
      if (data.status) setUserStatus(data.status);
    } catch {
      console.error("[NFTStudioVoting] error cargando estado usuario");
    }
  }, []);

  useEffect(() => { fetchSeason(); }, [fetchSeason]);

  useEffect(() => {
    if (wallet && season) fetchUserStatus(wallet, season.id);
  }, [wallet, season?.id, fetchUserStatus]);

  const handleFeedbackSubmit = useCallback((nftId: string, sentiment: Sentiment) => {
    const phase = season?.phase;
    if (!phase) return;
    setUserStatus(prev => ({
      ...prev,
      [nftId]: { ...prev[nftId], [phase === "feedback1" ? "feedback1" : "feedback2"]: sentiment },
    }));
  }, [season?.phase]);

  const handleVoteSubmit = useCallback((nftId: string, vote: "yes" | "no") => {
    setUserStatus(prev => ({ ...prev, [nftId]: { ...prev[nftId], finalVote: vote } }));
  }, []);

  const totalVoters = useMemo(() => season?.nfts.reduce((s, n) => s + n.feedbackCount, 0) ?? 0, [season?.nfts]);
  const avgScore    = useMemo(() => season ? Math.round(season.nfts.reduce((s, n) => s + n.communityScore, 0) / season.nfts.length) : 0, [season?.nfts]);
  const passedNFTs  = useMemo(() => season?.nfts.filter(n => n.communityScore >= 75).length ?? 0, [season?.nfts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-purple-400" />
        <span className="ml-2 text-sm text-slate-400">Cargando temporada...</span>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="glass rounded-2xl border border-slate-700/30 p-8 text-center">
        <p className="text-slate-400 text-sm">No hay temporada activa por el momento.</p>
      </div>
    );
  }

  const phaseCfg = PHASE_CONFIG[season.phase];
  const phaseIdx = PHASE_ORDER.indexOf(season.phase);

  return (
    <div className="space-y-4">

      {/* ── Banner fase activa ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border ${phaseCfg.border} ${phaseCfg.bg} p-4 space-y-3`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{season.collectionEmoji}</span>
              <div>
                <p className="text-xs text-slate-500">Temporada activa</p>
                <h2 className="text-sm font-black text-slate-100">
                  {season.collectionName} · T{season.seasonNumber}/{season.totalSeasons}
                </h2>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${phaseCfg.border} ${phaseCfg.bg} text-xs font-bold ${phaseCfg.color}`}>
              <span>{phaseCfg.emoji}</span>
              <span>{phaseCfg.label}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-slate-500">Score promedio</p>
            <p className={`text-2xl font-black ${avgScore >= 80 ? "text-green-400" : "text-yellow-400"}`}>{avgScore}</p>
            <p className="text-xs text-slate-600">{passedNFTs}/{season.nfts.length} aprobados</p>
          </div>
        </div>

        <p className="text-xs text-slate-400">{phaseCfg.detail}</p>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Progreso del ciclo</span>
            <span>{phaseIdx + 1}/{PHASE_ORDER.length} fases</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((phaseIdx + 1) / PHASE_ORDER.length) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-400"
            />
          </div>
        </div>

        {season.phase === "feedback2" && (
          <div className="bg-purple-900/30 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-300 flex items-start gap-2">
            <GitCompare size={13} className="flex-shrink-0 mt-0.5" />
            <span><strong>2do Feedback:</strong> La IA refinó los diseños. Compara original vs. mejorado y deja tu segunda opinión.</span>
          </div>
        )}
        {season.phase === "final-vote" && (
          <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-3 text-xs text-green-300 flex items-start gap-2">
            <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
            <span><strong>Votación Final:</strong> Necesitas NFT Om Domo o 10,000 OMMY para votar. ≥75% aprueba el mint.</span>
          </div>
        )}

        {wallet ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Wallet size={10} className="text-purple-400" />
            <span className="font-mono">{wallet.slice(0,6)}...{wallet.slice(-4)}</span>
            <span className="text-green-400">· activo</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-yellow-500/80">
            <Wallet size={10} />
            <span>Conecta tu wallet en el Dashboard para participar y ganar OMMY</span>
          </div>
        )}
      </motion.div>

      {/* ── Timeline de fases ────────────────────────────────────────────────── */}
      <div className="glass rounded-xl border border-slate-700/30 p-3">
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Clock size={10} /> Ciclo del mes</p>
        <PhaseTimeline currentPhase={season.phase} />
      </div>

      {/* ── Stats rápidas ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "NFTs",        value: season.nfts.length,                          color: "text-purple-300", icon: <Layers size={12} />   },
          { label: "Opiniones",   value: totalVoters,                                 color: "text-cyan-300",   icon: <Vote size={12} />     },
          { label: "Score avg",   value: avgScore,                                    color: "text-yellow-300", icon: <Star size={12} />     },
          { label: "Lanzamiento", value: season.launchDate.slice(5).replace("-","/"), color: "text-green-300",  icon: <Calendar size={12} /> },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl border border-slate-700/30 p-2 text-center">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-900/50 rounded-xl p-1 border border-slate-700/30">
        {(["nfts","stats","calendar"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab ? "bg-purple-600 text-white" : "text-slate-500 hover:text-slate-300"
            }`}>
            {tab === "nfts" ? "🎨 NFTs" : tab === "stats" ? "📊 Stats" : "📅 Calendario"}
          </button>
        ))}
      </div>

      {/* ── Tab: NFTs ────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === "nfts" && (
          <motion.div key="nfts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {(season.phase === "feedback1" || season.phase === "feedback2") && (
              <div className="glass rounded-xl border border-slate-700/30 p-3 mb-3">
                <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-purple-400" /> Cómo funciona el feedback
                </h3>
                <div className="space-y-1.5 text-xs text-slate-400">
                  {[
                    "Pulsa Me gusta, Neutral o Mejorar en cada NFT",
                    "Escribe sugerencias concretas en el texto libre (opcional)",
                    "Ganas +100 OMMY por cada feedback válido que envíes",
                    season.phase === "feedback2" ? "Usa el botón Comparar para ver original vs. refinado" : null,
                  ].filter(Boolean).map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">→</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {season.nfts.map(nft => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  phase={season.phase}
                  seasonId={season.id}
                  wallet={wallet}
                  userStatus={userStatus[nft.id]}
                  onFeedbackSubmit={handleFeedbackSubmit}
                  onVoteSubmit={handleVoteSubmit}
                />
              ))}
            </div>

            <div className="glass rounded-xl border border-slate-700/30 p-3 mt-3">
              <p className="text-xs text-slate-500 text-center">
                {season.phase === "generation"  && "Los diseños se publicarán el lunes. Vuelve para el primer feedback. 🎨"}
                {season.phase === "feedback1"   && `Primer feedback abierto hasta el ${season.feedback1End}. La IA mejora el ${season.refinementDate}.`}
                {season.phase === "refinement"  && "La IA está procesando tu feedback. Vuelve mañana. ⚙️"}
                {season.phase === "feedback2"   && `Segundo feedback abierto hasta el ${season.feedback2End}.`}
                {season.phase === "final-vote"  && `Votación final hasta el ${season.finalVoteEnd}. Necesitas NFT Om Domo o 10,000 OMMY.`}
                {season.phase === "launch"      && `NFTs en venta hasta el ${season.launchDate}. DAO voters tienen 50% de descuento. 🚀`}
                {season.phase === "closed"      && "Esta temporada ha finalizado. ¡Espera la siguiente colección! ✅"}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Tab: Stats ─────────────────────────────────────────────────────── */}
        {activeTab === "stats" && (
          <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3">
            <div className="glass rounded-2xl border border-slate-700/30 p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-400" /> Ranking NFTs esta temporada
              </h3>
              {[...season.nfts].sort((a, b) => b.communityScore - a.communityScore).map((nft, idx) => {
                const rarity = RARITY_CONFIG[nft.rarityTier];
                const score  = nft.communityScore;
                const col    = score >= 85 ? "text-green-400" : score >= 65 ? "text-yellow-400" : "text-red-400";
                return (
                  <div key={nft.id} className="flex items-center gap-3">
                    <span className={`text-sm font-black w-5 text-center ${idx === 0 ? "text-yellow-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-600" : "text-slate-600"}`}>{idx + 1}</span>
                    <span className="text-base">{nft.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-xs font-semibold text-slate-200 truncate">{nft.nameEs}</p>
                        <span className={`text-xs px-1 rounded ${rarity.bg} ${rarity.color}`}>{rarity.label}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.08 }}
                          className={`h-full rounded-full ${score >= 85 ? "bg-green-500" : score >= 65 ? "bg-yellow-500" : "bg-red-500"}`} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-black ${col}`}>{score}</p>
                      <p className="text-xs text-slate-600">{nft.feedbackCount}v</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glass rounded-2xl border border-slate-700/30 p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Trophy size={14} className="text-purple-400" /> Distribución por rareza
              </h3>
              {(["legendary","rare","standard"] as RarityTier[]).map(tier => {
                const cfg   = RARITY_CONFIG[tier];
                const count = season.nfts.filter(n => n.rarityTier === tier).length;
                const pct   = (count / season.nfts.length) * 100;
                return (
                  <div key={tier} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-16 ${cfg.color}`}>{cfg.label}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${tier === "legendary" ? "bg-yellow-500" : tier === "rare" ? "bg-cyan-500" : "bg-slate-500"}`} />
                    </div>
                    <span className="text-xs text-slate-500 w-16 text-right">{count} NFTs · {cfg.units}u/ea</span>
                  </div>
                );
              })}
            </div>

            <div className="glass rounded-2xl border border-slate-700/30 p-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Zap size={14} className="text-yellow-400" /> OMMY por participar
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { action: "Feedback válido (por NFT)",   reward: "+100 OMMY",  note: "feedback1 y feedback2 por separado" },
                  { action: "Votación final (por NFT)",    reward: "+200 OMMY",  note: "necesita NFT om Domo o 10k OMMY"   },
                  { action: "Feedback más útil (top 3)",   reward: "+500 OMMY",  note: "elegido por la comunidad"          },
                  { action: "Colección completa obtenida", reward: "+5,000 OMMY",note: "por tener todos los NFTs de T1"    },
                  { action: "DAO Voter — descuento mint",  reward: "50% OFF",    note: "5€ → 2.5€ por NFT"                },
                ].map(r => (
                  <div key={r.action} className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-700/30 last:border-0">
                    <div>
                      <p className="text-slate-300">{r.action}</p>
                      <p className="text-slate-600">{r.note}</p>
                    </div>
                    <p className="text-yellow-400 font-bold flex-shrink-0">{r.reward}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Tab: Calendario ──────────────────────────────────────────────────── */}
        {activeTab === "calendar" && (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3">
            <div className="glass rounded-2xl border border-slate-700/30 p-4 space-y-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Calendar size={14} className="text-cyan-400" /> Ciclo {season.scheduledMonth}
              </h3>
              {[
                { week:"Semana 1",  dates:"01–05", phase:"Generación IA",   detail:"Replicate genera NFTs con variantes",   statusIdx:0 },
                { week:"Semana 2a", dates:"06–08", phase:"1er Feedback",    detail:"Comunidad puntúa y comenta (Lun–Mié)",  statusIdx:1 },
                { week:"Jueves",    dates:"09",    phase:"Refinamiento IA", detail:"IA regenera con el feedback recibido",  statusIdx:2 },
                { week:"Semana 2b", dates:"09–12", phase:"2do Feedback",    detail:"Comparativa original vs. refinado",     statusIdx:3 },
                { week:"Semana 3",  dates:"13–19", phase:"Votación Final",  detail:"Aprobación o rechazo definitivo",       statusIdx:4 },
                { week:"Semana 4",  dates:"23+",   phase:"Lanzamiento",     detail:"Mint a 5€ · DAO voters 2.5€",          statusIdx:5 },
              ].map((row) => {
                const status = row.statusIdx < phaseIdx ? "done" : row.statusIdx === phaseIdx ? "active" : "upcoming";
                return (
                  <div key={row.phase} className={`flex items-start gap-3 p-2 rounded-lg ${status === "active" ? "bg-purple-900/20 border border-purple-500/20" : status === "done" ? "opacity-50" : "opacity-30"}`}>
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${status === "active" ? "bg-purple-500" : status === "done" ? "bg-green-500/50" : "bg-slate-700"}`}>
                      {status === "done"   ? <CheckCircle size={10} className="text-green-300" />
                       : status === "active" ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                       : <div className="w-2 h-2 rounded-full bg-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-300">{row.week}</span>
                        <span className="text-xs text-slate-600">días {row.dates}</span>
                        <span className={`text-xs font-semibold ${status === "active" ? "text-purple-300" : "text-slate-500"}`}>{row.phase}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{row.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glass rounded-2xl border border-slate-700/30 p-4 space-y-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ArrowRight size={14} className="text-slate-400" /> Próximas temporadas
              </h3>
              {[
                { month:"2026-08", label:"🧘 Yoga Asanas · T1/3",  nfts:7 },
                { month:"2026-09", label:"🌿 Reiki · T1/4",         nfts:7 },
                { month:"2026-10", label:"🌙 Fases Lunares · T1/1", nfts:8 },
                { month:"2026-11", label:"🌊 Elementos · T1/1",     nfts:5 },
              ].map(s => (
                <div key={s.month} className="flex items-center justify-between py-1.5 border-b border-slate-700/20 last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{s.label}</p>
                    <p className="text-xs text-slate-600">{s.month} · {s.nfts} NFTs</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Clock size={9} /> próxima
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
