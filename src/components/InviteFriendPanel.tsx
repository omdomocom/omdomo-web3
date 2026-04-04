"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Users, Gift, TrendingUp, Share2 } from "lucide-react";

const SOCIALS = [
  { label: "Instagram",  href: "https://www.instagram.com/om.domo/",          icon: "IG", color: "from-pink-500 to-orange-500"  },
  { label: "TikTok",     href: "https://www.tiktok.com/@omdomo.com",           icon: "TT", color: "from-slate-300 to-slate-500"  },
  { label: "X / Twitter",href: "https://twitter.com/omdomocom",                icon: "X",  color: "from-slate-100 to-slate-400"  },
  { label: "YouTube",    href: "https://www.youtube.com/@omdomocom",           icon: "YT", color: "from-red-500 to-red-700"      },
  { label: "Facebook",   href: "https://www.facebook.com/omdomocom",           icon: "FB", color: "from-blue-500 to-blue-700"    },
  { label: "LinkedIn",   href: "https://www.linkedin.com/company/omdomo",      icon: "LI", color: "from-blue-400 to-cyan-500"    },
  { label: "Pinterest",  href: "https://www.pinterest.es/omdomocom",           icon: "PI", color: "from-red-400 to-pink-500"     },
];

const REFERRAL_TIERS = [
  { refs: 1,  reward: 2_000,  label: "1 amigo",    unlocked: false },
  { refs: 3,  reward: 7_500,  label: "3 amigos",   unlocked: false },
  { refs: 5,  reward: 15_000, label: "5 amigos",   unlocked: false },
  { refs: 10, reward: 35_000, label: "10 amigos",  unlocked: false },
];

export function InviteFriendPanel({ walletAddress }: { walletAddress?: string }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const refCode = walletAddress
    ? `ref=${walletAddress.slice(2, 10).toUpperCase()}`
    : "ref=XXXXXXXX";

  const referralLink = `https://web3.omdomo.com/claim?${refCode}`;

  const shareText = encodeURIComponent(
    `🌟 Descubrí Om Domo — ropa consciente que te recompensa con NFTs y OMMY Coin en Avalanche.\n\nCompra en omdomo.com, reclama tu NFT y empieza a ganar crypto.\n\n${referralLink}\n\n#OmDomo #OMMY #Avalanche #Web3`
  );

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">🤝</div>
        <h2 className="text-base font-bold text-slate-100">Invita y gana OMMY</h2>
        <p className="text-xs text-slate-500 mt-1">
          Cada amigo que compra en omdomo.com = <strong className="text-purple-300">+2,000 OMMY</strong> para ti y para él.
        </p>
      </div>

      {/* Referral link */}
      <div className="glass rounded-xl p-4 border border-purple-500/20 space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Tu link de referido</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-800/60 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono truncate border border-slate-700/40">
            {referralLink}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={copyLink}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              copied
                ? "border-green-500/40 bg-green-900/20 text-green-400"
                : "border-purple-500/30 bg-purple-900/20 text-purple-300 hover:bg-purple-900/30"
            }`}
          >
            <AnimatePresence mode="wait">
              {copied
                ? <motion.span key="check" initial={{scale:0}} animate={{scale:1}}><Check size={12} /></motion.span>
                : <motion.span key="copy" initial={{scale:0}} animate={{scale:1}}><Copy size={12} /></motion.span>
              }
            </AnimatePresence>
            {copied ? "Copiado" : "Copiar"}
          </motion.button>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-300 text-center hover:border-purple-500/40 hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Share2 size={12} /> Compartir en X
          </a>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-lg bg-green-900/20 border border-green-500/20 text-xs text-green-400 text-center hover:bg-green-900/30 transition-all flex items-center justify-center gap-1.5"
          >
            <Share2 size={12} /> WhatsApp
          </a>
        </div>
      </div>

      {/* Email invite */}
      <div className="glass rounded-xl p-4 border border-slate-700/30 space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Invitar por email</p>
        {sent ? (
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="text-center py-2">
            <p className="text-green-400 text-sm">✓ Invitación enviada</p>
          </motion.div>
        ) : (
          <form onSubmit={sendInvite} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amigo@email.com"
              required
              className="flex-1 bg-slate-800/60 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Enviar
            </button>
          </form>
        )}
      </div>

      {/* Reward tiers */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-1">Recompensas por nivel</p>
        {REFERRAL_TIERS.map((tier) => (
          <div
            key={tier.refs}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
              tier.unlocked
                ? "border-green-500/30 bg-green-900/10"
                : "border-slate-700/30 bg-slate-900/20 opacity-60"
            }`}
          >
            <Users size={14} className={tier.unlocked ? "text-green-400" : "text-slate-600"} />
            <div className="flex-1">
              <p className="text-xs text-slate-300">{tier.label}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Gift size={12} className="text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">
                +{tier.reward.toLocaleString()} OMMY
              </span>
            </div>
          </div>
        ))}
        <p className="text-xs text-slate-600 text-center">
          0 referidos activos · Empieza compartiendo tu link
        </p>
      </div>

      {/* Seguir RRSS */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-1">Síguenos en redes</p>
        <div className="grid grid-cols-4 gap-2">
          {SOCIALS.slice(0, 4).map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -2 }}
              className={`aspect-square rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xs font-black text-white shadow-lg`}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SOCIALS.slice(4).map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="py-2 rounded-xl border border-slate-700/40 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              <span className={`font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.icon}</span>
              {s.label}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bonus viral */}
      <div className="glass rounded-xl p-3 border border-orange-500/20 flex items-center gap-3">
        <TrendingUp size={20} className="text-orange-400 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-slate-100">Bonus viral</p>
          <p className="text-xs text-slate-400">Si tu referido compra en la 1ª hora de un drop: +5,000 OMMY extra para ti</p>
        </div>
      </div>
    </div>
  );
}
