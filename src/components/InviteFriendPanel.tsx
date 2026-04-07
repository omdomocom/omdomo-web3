"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Share2, Gift, Star, ChevronRight, ExternalLink } from "lucide-react";

const MAX_REWARDED = 3;
const REWARD_PER_INVITE = 2000;
const SOCIAL_REWARD = 500;

const STORAGE_KEY = "omdomo-referrals";

interface ReferralState {
  sent: string[];         // emails/codes sent
  socialShared: string[]; // "twitter" | "instagram" etc.
  totalEarned: number;
}

function loadReferrals(): ReferralState {
  if (typeof window === "undefined") return { sent: [], socialShared: [], totalEarned: 0 };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") ?? { sent: [], socialShared: [], totalEarned: 0 };
  } catch {
    return { sent: [], socialShared: [], totalEarned: 0 };
  }
}

function saveReferrals(s: ReferralState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function InviteFriendPanel({ walletAddress }: { walletAddress?: string }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [refs, setRefs] = useState<ReferralState>({ sent: [], socialShared: [], totalEarned: 0 });
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  useEffect(() => {
    setRefs(loadReferrals());
  }, []);

  const refCode = walletAddress
    ? walletAddress.slice(2, 10).toUpperCase()
    : "XXXXXXXX";

  const referralLink = `https://web3.omdomo.com/?ref=${refCode}`;

  const sentCount = refs.sent.length;
  const rewardedCount = Math.min(sentCount, MAX_REWARDED);
  const rewardsRemaining = Math.max(0, MAX_REWARDED - sentCount);
  const progressPct = Math.min(100, (rewardedCount / MAX_REWARDED) * 100);

  const shareText = encodeURIComponent(
    `🌟 Descubrí Om Domo — ropa consciente que te recompensa con NFTs y OMMY Coin.\n\nCompra en omdomo.com, reclama tu NFT y empieza a ganar crypto.\n\nÚsate mi link → ${referralLink}\n\n#OmDomo #OMMY #Avalanche`
  );

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function showToast(msg: string) {
    setRewardToast(msg);
    setTimeout(() => setRewardToast(null), 3000);
  }

  function sendEmailInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const isRewarded = sentCount < MAX_REWARDED;
    const earned = isRewarded ? REWARD_PER_INVITE : 0;
    const next: ReferralState = {
      ...refs,
      sent: [...refs.sent, email],
      totalEarned: refs.totalEarned + earned,
    };
    setRefs(next);
    saveReferrals(next);
    setEmailSent(true);
    setEmail("");
    if (isRewarded) showToast(`+${earned.toLocaleString()} OMMY ganados`);
    setTimeout(() => setEmailSent(false), 2500);
  }

  function handleSocialShare(platform: "twitter" | "instagram" | "whatsapp" | "tiktok") {
    const alreadyShared = refs.socialShared.includes(platform);
    const hasDuo = refs.socialShared.length >= 2;
    const earned = !alreadyShared && !hasDuo ? SOCIAL_REWARD : 0;

    const next: ReferralState = {
      ...refs,
      socialShared: alreadyShared ? refs.socialShared : [...refs.socialShared, platform],
      totalEarned: refs.totalEarned + earned,
    };
    setRefs(next);
    saveReferrals(next);
    if (earned > 0) showToast(`+${earned} OMMY por compartir en ${platform}`);
  }

  const SOCIALS = [
    {
      id: "twitter" as const,
      label: "X / Twitter",
      color: "from-slate-700 to-slate-900",
      href: `https://twitter.com/intent/tweet?text=${shareText}`,
      icon: "𝕏",
    },
    {
      id: "whatsapp" as const,
      label: "WhatsApp",
      color: "from-green-600 to-green-800",
      href: `https://wa.me/?text=${shareText}`,
      icon: "💬",
    },
    {
      id: "instagram" as const,
      label: "Instagram",
      color: "from-pink-600 to-orange-500",
      href: "https://www.instagram.com/om.domo/",
      icon: "📸",
    },
    {
      id: "tiktok" as const,
      label: "TikTok",
      color: "from-slate-800 to-slate-950",
      href: "https://www.tiktok.com/@omdomo.com",
      icon: "🎵",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Reward toast */}
      <AnimatePresence>
        {rewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 right-4 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-green-900/95 border border-green-500/40 shadow-xl backdrop-blur-sm text-sm font-bold text-green-300"
          >
            <Gift size={16} /> {rewardToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress: 3 invitaciones con recompensa */}
      <div className="glass rounded-2xl p-4 border border-purple-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-200">Invitaciones con recompensa</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {rewardedCount}/{MAX_REWARDED} · {rewardsRemaining > 0 ? `${rewardsRemaining} restante${rewardsRemaining > 1 ? "s" : ""}` : "¡Todas completadas!"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Ganado</p>
            <p className="text-sm font-black gradient-text">+{refs.totalEarned.toLocaleString()} OMMY</p>
          </div>
        </div>

        {/* Progress bar con 3 checkpoints */}
        <div className="relative">
          <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${
                rewardedCount >= MAX_REWARDED
                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                  : "bg-gradient-to-r from-purple-500 to-cyan-500"
              }`}
            />
          </div>
          {/* 3 checkpoints */}
          <div className="absolute inset-0 flex items-center justify-around pointer-events-none px-0.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  sentCount >= n
                    ? "bg-green-400 border-green-300"
                    : "bg-slate-800 border-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Checkpoint labels */}
        <div className="flex justify-around text-center">
          {[1, 2, 3].map((n) => (
            <div key={n} className="text-xs">
              <p className={sentCount >= n ? "text-green-400 font-bold" : "text-slate-600"}>
                {sentCount >= n ? "✓" : `${n}ª`}
              </p>
              <p className={`text-xs ${sentCount >= n ? "text-green-500" : "text-slate-600"}`}>
                +{REWARD_PER_INVITE.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {sentCount >= MAX_REWARDED && (
          <p className="text-xs text-slate-500 text-center">
            Puedes seguir invitando, pero las recompensas por referido se desbloquean en Fase 2. 🚀
          </p>
        )}
      </div>

      {/* Referral link */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-1">Tu link único</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-900/60 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-mono truncate border border-slate-700/40">
            web3.omdomo.com/?ref={refCode}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={copyLink}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              copied
                ? "border-green-500/40 bg-green-900/20 text-green-400"
                : "border-purple-500/30 bg-purple-900/20 text-purple-300 hover:bg-purple-900/30"
            }`}
          >
            <AnimatePresence mode="wait">
              {copied
                ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={12} /></motion.span>
                : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }}><Copy size={12} /></motion.span>
              }
            </AnimatePresence>
            {copied ? "Copiado" : "Copiar"}
          </motion.button>
        </div>
      </div>

      {/* Social share — 2 redes = bonus */}
      <div className="glass rounded-2xl p-4 border border-slate-700/30 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 font-semibold">Comparte en redes</p>
          {refs.socialShared.length < 2 ? (
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Star size={11} /> +{SOCIAL_REWARD} OMMY c/u (máx. 2)
            </span>
          ) : (
            <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
              <Check size={11} /> Bonus completado
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SOCIALS.map((s) => {
            const done = refs.socialShared.includes(s.id);
            const locked = refs.socialShared.length >= 2 && !done;
            return (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => !locked && handleSocialShare(s.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  done
                    ? "border-green-500/40 bg-green-900/15 text-green-400"
                    : locked
                    ? "border-slate-800/30 text-slate-600 opacity-50 pointer-events-none"
                    : "border-slate-700/40 text-slate-300 hover:border-purple-500/30 hover:bg-purple-900/10"
                }`}
              >
                <span>{s.icon}</span>
                <span className="flex-1">{s.label}</span>
                {done ? <Check size={11} /> : <ExternalLink size={10} className="text-slate-600" />}
              </a>
            );
          })}
        </div>
        <p className="text-xs text-slate-600 text-center">
          {refs.socialShared.length}/2 redes compartidas
          {refs.socialShared.length >= 2 ? " · Bonus +1,000 OMMY desbloqueado" : ""}
        </p>
      </div>

      {/* Email invite */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-1">
          Invitar por email
          {rewardsRemaining > 0 && (
            <span className="ml-2 text-purple-400 normal-case">· +{REWARD_PER_INVITE.toLocaleString()} OMMY si compra</span>
          )}
        </p>
        <form onSubmit={sendEmailInvite} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="amigo@email.com"
            required
            className="flex-1 bg-slate-900/60 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {emailSent ? "✓ Enviado" : "Enviar"}
          </motion.button>
        </form>
        {sentCount > 0 && (
          <p className="text-xs text-slate-600 px-1">
            {sentCount} invitaci{sentCount === 1 ? "ón" : "ones"} enviada{sentCount !== 1 ? "s" : ""}
            {sentCount > MAX_REWARDED && ` · Las primeras ${MAX_REWARDED} tienen recompensa`}
          </p>
        )}
      </div>

      {/* Bonus info */}
      <div className="glass rounded-xl p-3 border border-amber-500/20 space-y-2">
        <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Gift size={13} className="text-amber-400" /> Cómo funciona
        </p>
        <div className="space-y-1.5">
          {[
            { icon: "🔗", text: `Comparte tu link → amigo registra wallet` },
            { icon: "🛍️", text: `Amigo compra en omdomo.com` },
            { icon: "🎁", text: `Ambos recibís +${REWARD_PER_INVITE.toLocaleString()} OMMY (primeras ${MAX_REWARDED} invitaciones)` },
            { icon: "📱", text: `Comparte en 2 redes = +${SOCIAL_REWARD} OMMY adicionales c/u` },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
