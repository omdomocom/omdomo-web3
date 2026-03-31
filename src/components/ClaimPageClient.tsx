"use client";

import { useState } from "react";
import { ConnectButton, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client, avalancheFuji } from "@/lib/thirdweb";
import {
  CheckCircle,
  Loader2,
  Gift,
  Coins,
  AlertCircle,
  ExternalLink,
  Twitter,
  Instagram,
  Users,
  Flame,
  Copy,
  Check,
} from "lucide-react";
import type { Claim } from "@/lib/claims";
import { REWARDS } from "@/lib/tokenomics";

type Step = "lookup" | "connect" | "mint" | "success";

interface ApprovalData {
  orderId: string;
  walletAddress: string;
  contractAddress: string;
  tokenId: number;
  quantity: number;
  ommyReward: number;
  productTitle: string;
}

const COMMUNITY_DISCORD = "https://discord.gg/omdomo";
const COMMUNITY_TELEGRAM = "https://t.me/omdomo";

export function ClaimPageClient() {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();

  const [step, setStep] = useState<Step>("lookup");
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [approval, setApproval] = useState<ApprovalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [totalOmmy, setTotalOmmy] = useState(0);
  const [shareStatus, setShareStatus] = useState<{ twitter: boolean; instagram: boolean }>({
    twitter: false,
    instagram: false,
  });
  const [shareLoading, setShareLoading] = useState<"twitter" | "instagram" | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [productTitle, setProductTitle] = useState("");

  // Step 1 — lookup order
  async function lookupOrder() {
    if (!orderId && !email) return;
    setLoading(true);
    setError("");
    try {
      const param = orderId
        ? `orderId=${orderId}`
        : `email=${encodeURIComponent(email)}`;
      const res = await fetch(`/api/nft/check-claim?${param}`);
      const data = await res.json();

      if (!data.found) {
        setError("No se encontraron claims pendientes. Verifica tu Order ID o email.");
        setLoading(false);
        return;
      }

      const foundClaims: Claim[] = data.claims || [data.claim];
      const pending = foundClaims.filter((c) => c.status === "pending");

      if (pending.length === 0) {
        setError("Este pedido ya fue reclamado.");
        setLoading(false);
        return;
      }

      setClaims(pending);
      setTotalOmmy(pending.reduce((s, c) => s + c.ommyReward, 0));
      setProductTitle(pending[0]?.productTitle || "");
      setStep("connect");
    } catch {
      setError("Error buscando el pedido. Inténtalo de nuevo.");
    }
    setLoading(false);
  }

  // Step 2 — approve claim (links wallet to order)
  async function approveClaim() {
    if (!account?.address || claims.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/nft/approve-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: claims[0].id, walletAddress: account.address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApproval(data);
      setStep("mint");
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  // Step 3 — customer mints from their own wallet
  async function mintNFT() {
    if (!approval || !account) return;
    setLoading(true);
    setError("");

    try {
      const contract = getContract({
        client,
        chain: avalancheFuji,
        address: approval.contractAddress,
      });

      const transaction = prepareContractCall({
        contract,
        method:
          "function claim(address receiver, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) allowlistProof, bytes data)",
        params: [
          account.address,
          BigInt(approval.tokenId),
          BigInt(approval.quantity),
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          BigInt(0),
          {
            proof: [],
            quantityLimitPerWallet: BigInt(0),
            pricePerToken: BigInt(0),
            currency: "0x0000000000000000000000000000000000000000",
          },
          "0x",
        ],
      });

      const receipt = await sendTx(transaction);
      const hash = receipt.transactionHash;
      setTxHash(hash);

      await fetch("/api/nft/confirm-claimed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: approval.orderId,
          txHash: hash,
          tokenId: String(approval.tokenId),
        }),
      });

      setStep("success");
    } catch (err) {
      setError("Mint fallido: " + String(err));
    }
    setLoading(false);
  }

  // Share to earn — registra share y otorga OMMY extra
  async function handleShare(platform: "twitter" | "instagram") {
    if (!account?.address || !approval) return;
    setShareLoading(platform);

    const shareText = encodeURIComponent(
      `Acabo de reclamar mi NFT de Om Domo y gané ${approval.ommyReward} OMMY 🔥\n\nCada compra en omdomo.com incluye un NFT exclusivo + recompensas en Ommy Coin.\n\n#OmDomo #OMMY #Avalanche #Web3 #NFT`
    );

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank");
    } else {
      await navigator.clipboard.writeText(
        `Acabo de reclamar mi NFT de Om Domo y gané ${approval.ommyReward} OMMY 🔥\nCada compra en omdomo.com incluye un NFT + recompensas OMMY.\n#OmDomo #OMMY #Avalanche`
      );
    }

    // Registrar share en el servidor
    try {
      await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account.address,
          platform,
          orderId: approval.orderId,
        }),
      });
      setShareStatus((prev) => ({ ...prev, [platform]: true }));
      setTotalOmmy((prev) => prev + (platform === "twitter" ? REWARDS.shareTwitter : REWARDS.shareInstagram));
    } catch {
      // Share went through even if reward registration failed
    }
    setShareLoading(null);
  }

  async function copyWallet() {
    if (!account?.address) return;
    await navigator.clipboard.writeText(account.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border glass">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
            O
          </div>
          <span className="text-sm font-bold gradient-text">Om Domo</span>
          <span className="text-slate-500 text-sm">· Reclamar NFT</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-4">

          {/* Step 1 — Lookup */}
          {step === "lookup" && (
            <div className="glass rounded-2xl p-8 border border-slate-800/60 space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl mb-3">🎁</div>
                <h1 className="text-xl font-bold text-slate-100">Reclama tu Om Domo NFT</h1>
                <p className="text-sm text-slate-500 mt-2">
                  Cada compra en omdomo.com incluye un NFT único + recompensas OMMY.
                </p>
              </div>

              {/* Badges de beneficios */}
              <div className="flex gap-2 flex-wrap justify-center">
                {[
                  { icon: "🎨", label: "NFT exclusivo" },
                  { icon: "🪙", label: "OMMY rewards" },
                  { icon: "🏛️", label: "Acceso DAO" },
                ].map((b) => (
                  <span key={b.label} className="text-xs px-2.5 py-1 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-300 flex items-center gap-1">
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID (del email de confirmación)"
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none"
                />
                <div className="text-center text-xs text-slate-600">o</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email usado en la compra"
                  type="email"
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <button
                onClick={lookupOrder}
                disabled={loading || (!orderId && !email)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Buscar mi NFT
              </button>
            </div>
          )}

          {/* Step 2 — Connect wallet */}
          {step === "connect" && (
            <div className="glass rounded-2xl p-8 border border-slate-800/60 space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl mb-3">🔗</div>
                <h2 className="text-xl font-bold text-slate-100">Conecta tu wallet</h2>
                <p className="text-sm text-slate-500 mt-2">
                  {claims.length} NFT{claims.length > 1 ? "s" : ""} + {totalOmmy.toLocaleString()} OMMY te esperan.
                </p>
              </div>

              <div className="space-y-2">
                {claims.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-purple-900/10 border border-purple-500/20">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">NFT</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{c.productTitle}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Coins size={10} className="text-purple-400" />
                        <span className="text-xs text-purple-300">+{c.ommyReward.toLocaleString()} OMMY</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <ConnectButton client={client} chain={avalancheFuji} />

              {account && (
                <button
                  onClick={approveClaim}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Continuar →
                </button>
              )}
            </div>
          )}

          {/* Step 3 — Mint */}
          {step === "mint" && account && approval && (
            <div className="glass rounded-2xl p-8 border border-slate-800/60 space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl mb-3">✨</div>
                <h2 className="text-xl font-bold text-slate-100">Mintea tu NFT</h2>
                <p className="text-sm text-slate-500 mt-2">
                  Tu wallet firma la transacción. Gas mínimo en Fuji.
                </p>
              </div>

              <div className="glass rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">NFT</span>
                  <span className="text-slate-200 truncate ml-4">{approval.productTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wallet</span>
                  <span className="font-mono text-slate-300 text-xs">
                    {account.address.slice(0, 8)}...{account.address.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Red</span>
                  <span className="text-cyan-400">Avalanche Fuji</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Precio</span>
                  <span className="text-green-400 font-semibold">GRATIS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">OMMY reward</span>
                  <span className="gradient-text font-bold">+{approval.ommyReward.toLocaleString()} OMMY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Flame size={11} className="text-orange-400" /> Quema
                  </span>
                  <span className="text-orange-400 text-xs">-500 OMMY del supply</span>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={mintNFT}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Minteando...</>
                ) : (
                  <><Gift size={16} /> Mintear mi NFT</>
                )}
              </button>
            </div>
          )}

          {/* Step 4 — Success + Share to Earn */}
          {step === "success" && (
            <div className="space-y-4 animate-fade-in">
              {/* Éxito principal */}
              <div className="glass rounded-2xl p-8 border border-green-500/20 space-y-5 text-center">
                <CheckCircle size={48} className="text-green-400 mx-auto" />
                <div>
                  <h2 className="text-xl font-bold text-slate-100">NFT reclamado</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Bienvenido a la comunidad Om Domo.
                  </p>
                </div>

                <div className="glass rounded-xl p-4 space-y-2 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">OMMY ganados</span>
                    <span className="gradient-text font-bold">+{totalOmmy.toLocaleString()} OMMY</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Flame size={11} className="text-orange-400" /> Supply quemado
                    </span>
                    <span className="text-orange-400 text-xs">-500 OMMY</span>
                  </div>
                  {txHash && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">TX</span>
                      <a
                        href={`https://testnet.snowtrace.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-cyan-400 text-xs hover:underline"
                      >
                        {txHash.slice(0, 10)}... <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                  {account?.address && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Tu wallet</span>
                      <button
                        onClick={copyWallet}
                        className="flex items-center gap-1 text-slate-400 text-xs hover:text-slate-200 transition-colors"
                      >
                        {account.address.slice(0, 8)}...{account.address.slice(-4)}
                        {copiedAddress ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Share to Earn */}
              <div className="glass rounded-2xl p-6 border border-purple-500/20 space-y-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-100">Comparte y gana más OMMY</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Cada share = +{REWARDS.shareTwitter.toLocaleString()} OMMY extra en tu wallet
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Twitter */}
                  <button
                    onClick={() => handleShare("twitter")}
                    disabled={shareStatus.twitter || shareLoading === "twitter"}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-xs font-medium transition-all ${
                      shareStatus.twitter
                        ? "border-green-500/40 bg-green-900/10 text-green-400"
                        : "border-slate-700/40 hover:border-purple-500/40 hover:bg-purple-900/10 text-slate-300"
                    }`}
                  >
                    {shareLoading === "twitter" ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : shareStatus.twitter ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Twitter size={18} />
                    )}
                    <span>{shareStatus.twitter ? `+${REWARDS.shareTwitter.toLocaleString()} OMMY` : "Twitter / X"}</span>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={() => handleShare("instagram")}
                    disabled={shareStatus.instagram || shareLoading === "instagram"}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-xs font-medium transition-all ${
                      shareStatus.instagram
                        ? "border-green-500/40 bg-green-900/10 text-green-400"
                        : "border-slate-700/40 hover:border-pink-500/40 hover:bg-pink-900/10 text-slate-300"
                    }`}
                  >
                    {shareLoading === "instagram" ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : shareStatus.instagram ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Instagram size={18} />
                    )}
                    <span>{shareStatus.instagram ? `+${REWARDS.shareInstagram.toLocaleString()} OMMY` : "Instagram"}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 text-center">
                  El texto ya está preparado. Solo toca y publica.
                </p>
              </div>

              {/* Comunidad */}
              <div className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} className="text-cyan-400" />
                  <p className="text-sm font-bold text-slate-100">Únete a la comunidad</p>
                </div>
                <p className="text-xs text-slate-500">
                  Tu NFT te da acceso exclusivo. Solo holders pueden entrar.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={COMMUNITY_DISCORD}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30 transition-all"
                  >
                    Discord
                  </a>
                  <a
                    href={COMMUNITY_TELEGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium hover:bg-cyan-600/30 transition-all"
                  >
                    Telegram
                  </a>
                </div>
              </div>

              <a
                href="/drops"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-sm font-semibold text-center hover:opacity-90 transition-opacity"
              >
                Ver próximos drops limitados →
              </a>

              <a
                href="/dashboard"
                className="block w-full py-3 rounded-xl border border-slate-700/40 text-sm text-slate-400 text-center hover:text-slate-200 hover:border-slate-600 transition-all"
              >
                Ir al Dashboard
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
