"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Users, Clock, CheckCircle, Lock, TrendingUp, Palette } from "lucide-react";
import { NFTStudioVoting } from "./NFTStudioVoting";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "active" | "passed" | "pending" | "locked";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endsIn?: string;
  reward: number;
  category: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    title: "Drop #2 — Colección Solsticio",
    description: "Votación para aprobar el diseño de la colección de verano 2026. 50 unidades, NFT animado incluido.",
    status: "active",
    votesFor: 342,
    votesAgainst: 28,
    totalVotes: 370,
    endsIn: "5 días",
    reward: 200,
    category: "Colección",
  },
  {
    id: "prop-2",
    title: "Añadir pool de liquidez en Trader Joe",
    description: "Propuesta para usar el 5% del DAO Treasury para crear un pool OMMY/AVAX en Trader Joe DEX.",
    status: "pending",
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    endsIn: "próximamente",
    reward: 200,
    category: "DeFi",
  },
  {
    id: "prop-3",
    title: "Programa Ambassador Tier 2",
    description: "Definir los beneficios del nivel Guardian: 3+ NFTs o 50K OMMY = badge especial + early access.",
    status: "passed",
    votesFor: 891,
    votesAgainst: 42,
    totalVotes: 933,
    reward: 200,
    category: "Comunidad",
  },
  {
    id: "prop-4",
    title: "Staking NFT — 50 OMMY/día",
    description: "Implementar staking de NFTs con recompensa de 50 OMMY por día. Requiere contrato en mainnet.",
    status: "locked",
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    reward: 200,
    category: "Token",
  },
];

const STATUS_CONFIG = {
  active:  { label: "Activa",      icon: <Vote size={10} />,        color: "text-green-400",  bg: "bg-green-400/10 border-green-400/30"   },
  passed:  { label: "Aprobada",    icon: <CheckCircle size={10} />, color: "text-cyan-400",   bg: "bg-cyan-400/10 border-cyan-400/30"     },
  pending: { label: "Próximamente",icon: <Clock size={10} />,       color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  locked:  { label: "Bloqueada",   icon: <Lock size={10} />,        color: "text-slate-500",  bg: "bg-slate-700/20 border-slate-700/30"   },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Colección": "text-pink-400",
  "DeFi":      "text-cyan-400",
  "Comunidad": "text-green-400",
  "Token":     "text-purple-400",
};

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [voted, setVoted] = useState<"for" | "against" | null>(null);
  const [localFor, setLocalFor] = useState(proposal.votesFor);
  const [localTotal, setLocalTotal] = useState(proposal.totalVotes);
  const status = STATUS_CONFIG[proposal.status];
  const pct = localTotal > 0 ? (localFor / localTotal) * 100 : 0;
  const canVote = proposal.status === "active" && !voted;

  function vote(dir: "for" | "against") {
    if (!canVote) return;
    setVoted(dir);
    if (dir === "for") { setLocalFor(v => v + 1); }
    setLocalTotal(v => v + 1);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 space-y-3 ${
        proposal.status === "active" ? "border-green-500/20 bg-green-900/5" : "border-slate-700/30 bg-slate-900/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded border ${status.bg} ${status.color} flex items-center gap-1`}>
              {status.icon} {status.label}
            </span>
            <span className={`text-xs font-medium ${CATEGORY_COLORS[proposal.category] ?? "text-slate-500"}`}>
              #{proposal.category}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-100">{proposal.title}</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-yellow-400">+{proposal.reward} OMMY</p>
          {proposal.endsIn && (
            <p className="text-xs text-slate-600 mt-0.5">{proposal.endsIn}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{proposal.description}</p>

      {/* Vote bar */}
      {localTotal > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span className="text-green-400">✓ {localFor} a favor</span>
            <span className="text-red-400">✗ {localTotal - localFor} en contra</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            />
          </div>
          <p className="text-xs text-slate-600 mt-1">{pct.toFixed(0)}% de aprobación · {localTotal} votos</p>
        </div>
      )}

      {/* Vote buttons */}
      {canVote && (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => vote("for")}
            className="flex-1 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-all"
          >
            ✓ Votar a favor
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => vote("against")}
            className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
          >
            ✗ En contra
          </motion.button>
        </div>
      )}

      {voted && (
        <p className="text-xs text-center text-slate-500">
          Voto registrado {voted === "for" ? "✓ a favor" : "✗ en contra"} · +{proposal.reward} OMMY pendientes
        </p>
      )}

      {proposal.status === "locked" && (
        <p className="text-xs text-slate-600 flex items-center gap-1">
          <Lock size={10} /> Disponible en Fase 2 (Sep 2026)
        </p>
      )}
    </motion.div>
  );
}

export function DAOPanel() {
  const [daoTab, setDaoTab] = useState<"proposals" | "nft-studio">("proposals");

  return (
    <div className="space-y-4">

      {/* Sub-tabs: Propuestas | NFT Studio */}
      <div className="flex gap-1 bg-slate-900/50 rounded-xl p-1 border border-slate-700/30">
        <button onClick={() => setDaoTab("proposals")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${daoTab === "proposals" ? "bg-purple-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
          <Vote size={11} /> Propuestas
        </button>
        <button onClick={() => setDaoTab("nft-studio")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${daoTab === "nft-studio" ? "bg-purple-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
          <Palette size={11} /> NFT Studio
        </button>
      </div>

      {daoTab === "nft-studio" && <NFTStudioVoting />}

      {daoTab === "proposals" && (
        <>
          {/* Header stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Propuestas",   value: PROPOSALS.length,  icon: <Vote size={14} />,       color: "text-purple-300" },
              { label: "Participantes",value: "1,247",            icon: <Users size={14} />,      color: "text-cyan-300"   },
              { label: "OMMY en DAO",  value: "1.5B",             icon: <TrendingUp size={14} />, color: "text-green-400"  },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-3 border border-slate-700/30 text-center">
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div className="glass rounded-xl p-3 border border-purple-500/20 text-xs text-slate-400 flex items-start gap-2">
            <Vote size={14} className="text-purple-400 flex-shrink-0 mt-0.5" />
            <span>
              Para votar necesitas al menos <strong className="text-purple-300">1 NFT Om Domo</strong> o{" "}
              <strong className="text-purple-300">10,000 OMMY</strong> en tu wallet. Cada voto gana +200 OMMY.
            </span>
          </div>

          {/* Proposals */}
          <div className="space-y-3">
            {PROPOSALS.map((p) => <ProposalCard key={p.id} proposal={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
