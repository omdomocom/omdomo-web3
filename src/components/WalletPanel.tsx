"use client";

import { useState } from "react";
import { ConnectButton, useActiveAccount, useWalletBalance } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { client, avalanche, avalancheFuji, OMMY_COIN_ADDRESS } from "@/lib/thirdweb";
import { OmmyCoinLogo } from "@/components/OmmyCoinLogo";

type NetworkMode = "mainnet" | "fuji";

// ─── OMMY logo ────────────────────────────────────────────────────────────
function OmmyLogo() {
  return <OmmyCoinLogo size={32} />;
}

// ─── AVAX official logo (red circle + white A) ────────────────────────────
function AvaxLogo() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#E84142] flex items-center justify-center flex-shrink-0 shadow shadow-red-500/30">
      {/* Simplified AVAX "A" chevron shape */}
      <svg width="16" height="14" viewBox="0 0 40 32" fill="none">
        <path
          d="M17.5 4.5c1.1-1.9 3.9-1.9 5 0L38 28c1.1 1.9-.3 4.2-2.5 4.2H4.5C2.3 32.2.9 29.9 2 28L17.5 4.5z"
          fill="white"
        />
        <path
          d="M17.5 4.5c1.1-1.9 3.9-1.9 5 0L38 28c1.1 1.9-.3 4.2-2.5 4.2H4.5C2.3 32.2.9 29.9 2 28L17.5 4.5z"
          fill="white"
        />
        <rect x="14" y="19" width="12" height="4" rx="2" fill="#E84142" />
      </svg>
    </div>
  );
}

// ─── Format OMMY: show 8 digits then ... ──────────────────────────────────
function fmtOmmy(v: string | undefined): string {
  if (!v) return "—";
  const num = Math.floor(Number(v));
  if (isNaN(num)) return "—";
  const str = num.toLocaleString("en-US"); // e.g. "1,234,567,890"
  // Count actual digits (no commas)
  const digits = str.replace(/,/g, "");
  if (digits.length > 8) {
    // Keep first 8 digits with their commas
    let kept = "";
    let digitCount = 0;
    for (const ch of str) {
      if (ch !== ",") digitCount++;
      kept += ch;
      if (digitCount === 8) break;
    }
    return kept + "...";
  }
  return str;
}

// ─── Balance rows ─────────────────────────────────────────────────────────
function Balances({ address, mode }: { address: string; mode: NetworkMode }) {
  const chain = mode === "mainnet" ? avalanche : avalancheFuji;

  const { data: avaxBalance } = useWalletBalance({ client, chain, address });
  const { data: ommyBalance } = useWalletBalance({
    client,
    chain: avalanche, // OMMY only on mainnet
    address,
    tokenAddress: OMMY_COIN_ADDRESS || undefined,
  });

  const fmt = (v: string | undefined, dec = 2) =>
    v ? Number(v).toLocaleString(undefined, { maximumFractionDigits: dec }) : "—";

  return (
    <div className="space-y-1.5">
      {/* OMMY */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/25 to-cyan-900/15 border border-purple-500/20">
        <div>
          <p className="text-xs text-slate-500 leading-none mb-1">OMMY Coin</p>
          <p className="text-base font-black text-purple-200 leading-none">
            {fmtOmmy(ommyBalance?.displayValue)}
          </p>
        </div>
        <OmmyLogo />
      </div>

      {/* AVAX */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/35 border border-slate-700/25">
        <div>
          <p className="text-xs text-slate-500 leading-none mb-1">
            AVAX {mode === "fuji" && <span className="text-amber-500/80">· Test</span>}
          </p>
          <p className="text-base font-black text-slate-200 leading-none">
            {fmt(avaxBalance?.displayValue, 4)}
          </p>
        </div>
        <AvaxLogo />
      </div>

      {/* NFTs */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/25 border border-slate-700/20">
        <div>
          <p className="text-xs text-slate-500 leading-none mb-1">NFTs</p>
          <p className="text-base font-black text-cyan-300 leading-none">1</p>
        </div>
        <span className="text-xs text-slate-500 border border-slate-700/40 px-1.5 py-0.5 rounded-lg">Genesis</span>
      </div>
    </div>
  );
}

// ─── Fuji info accordion ──────────────────────────────────────────────────
function FujiInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-900/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-xs font-medium text-amber-400/90 flex items-center gap-1.5">
          ⚗️ ¿Cómo obtener AVAX de prueba?
        </span>
        {open
          ? <ChevronUp size={11} className="text-amber-500/60" />
          : <ChevronDown size={11} className="text-amber-500/60" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              <p className="text-xs text-slate-500 leading-relaxed">
                El Faucet oficial de Avalanche te da AVAX de prueba gratis para practicar:
              </p>
              <a
                href="https://core.app/tools/testnet-faucet/?subnet=c&token=c"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
              >
                core.app/tools/testnet-faucet <ExternalLink size={9} />
              </a>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recibirás 2 AVAX de prueba — suficiente para mintear NFTs, enviar transacciones y explorar la blockchain sin riesgo real.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Network toggle ────────────────────────────────────────────────────────
function NetworkToggle({ mode, onChange }: { mode: NetworkMode; onChange: (m: NetworkMode) => void }) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/40 border border-slate-700/30">
      {/* Test / Fuji */}
      <button
        onClick={() => onChange("fuji")}
        className={`flex-1 flex flex-col items-center py-1.5 rounded-lg transition-all ${
          mode === "fuji"
            ? "bg-amber-900/40 border border-amber-500/30"
            : "hover:bg-slate-800/30"
        }`}
      >
        <span className={`text-xs font-bold leading-tight ${mode === "fuji" ? "text-amber-300" : "text-slate-500"}`}>
          Test
        </span>
        <span className={`text-xs leading-none mt-0.5 ${mode === "fuji" ? "text-amber-500/70" : "text-slate-700"}`} style={{ fontSize: "10px" }}>
          Fuji
        </span>
      </button>

      {/* Real / Mainnet */}
      <button
        onClick={() => onChange("mainnet")}
        className={`flex-1 flex flex-col items-center py-1.5 rounded-lg transition-all ${
          mode === "mainnet"
            ? "bg-purple-900/40 border border-purple-500/30"
            : "hover:bg-slate-800/30"
        }`}
      >
        <span className={`text-xs font-bold leading-tight ${mode === "mainnet" ? "text-purple-300" : "text-slate-500"}`}>
          Real
        </span>
        <span className={`text-xs leading-none mt-0.5 ${mode === "mainnet" ? "text-purple-500/70" : "text-slate-700"}`} style={{ fontSize: "10px" }}>
          pro
        </span>
      </button>
    </div>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────
export function WalletPanel() {
  const account = useActiveAccount();
  const [mode, setMode] = useState<NetworkMode>("mainnet");

  const shortAddress = account?.address
    ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}`
    : null;

  return (
    <div className="space-y-2">
      {/* Connect button */}
      <div className="glass rounded-xl p-3">
        <ConnectButton
          client={client}
          chain={mode === "mainnet" ? avalanche : avalancheFuji}
          connectButton={{
            label: "Conectar wallet",
            className: "w-full !bg-gradient-to-r !from-purple-600 !to-cyan-600 !text-white !rounded-lg !py-2 !text-xs !font-medium hover:!opacity-90 !transition-opacity",
          }}
          detailsButton={{
            className: "w-full !rounded-lg !py-2 !text-xs",
          }}
        />
        {shortAddress && (
          <p className="text-xs text-slate-600 mt-1.5 text-center font-mono">{shortAddress}</p>
        )}
      </div>

      {/* Balances (when connected) */}
      {account && <Balances address={account.address} mode={mode} />}

      {/* Fuji info — below balances, above toggle */}
      {mode === "fuji" && <FujiInfo />}

      {/* Network toggle */}
      <NetworkToggle mode={mode} onChange={setMode} />
    </div>
  );
}
