"use client";

import { ConnectButton, useActiveAccount, useWalletBalance } from "thirdweb/react";
import { client, avalanche, OMMY_COIN_ADDRESS } from "@/lib/thirdweb";
import { OmmyCoinLogo } from "@/components/OmmyCoinLogo";

// ─── AVAX official logo (red circle + white A) ────────────────────────────
function AvaxLogo() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#E84142] flex items-center justify-center flex-shrink-0 shadow shadow-red-500/30">
      <svg width="16" height="14" viewBox="0 0 40 32" fill="none">
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
  const str = num.toLocaleString("en-US");
  const digits = str.replace(/,/g, "");
  if (digits.length > 8) {
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
function Balances({ address }: { address: string }) {
  const { data: avaxBalance } = useWalletBalance({ client, chain: avalanche, address });
  const { data: ommyBalance } = useWalletBalance({
    client,
    chain: avalanche,
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
        <OmmyCoinLogo size={32} />
      </div>

      {/* AVAX */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/35 border border-slate-700/25">
        <div>
          <p className="text-xs text-slate-500 leading-none mb-1">AVAX</p>
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

// ─── Main panel ──────────────────────────────────────────────────────────
export function WalletPanel() {
  const account = useActiveAccount();

  const shortAddress = account?.address
    ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}`
    : null;

  return (
    <div className="space-y-2">
      {/* Connect button */}
      <div className="glass rounded-xl p-3">
        <ConnectButton
          client={client}
          chain={avalanche}
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
      {account && <Balances address={account.address} />}
    </div>
  );
}
