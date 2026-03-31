"use client";

import { ConnectButton, useActiveAccount, useWalletBalance } from "thirdweb/react";
import { client, avalanche, OMMY_COIN_ADDRESS } from "@/lib/thirdweb";

export function WalletPanel() {
  const account = useActiveAccount();

  const { data: avaxBalance } = useWalletBalance({
    client,
    chain: avalanche,
    address: account?.address,
  });

  const { data: ommyBalance } = useWalletBalance({
    client,
    chain: avalanche,
    address: account?.address,
    tokenAddress: OMMY_COIN_ADDRESS || undefined,
  });

  const shortAddress = account?.address
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : null;

  return (
    <div className="space-y-4">
      {/* Connect Button */}
      <div className="glass rounded-xl p-4">
        <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-medium">
          Wallet
        </p>
        <ConnectButton
          client={client}
          chain={avalanche}
          connectButton={{
            label: "Connect Wallet",
            className:
              "w-full !bg-gradient-to-r !from-purple-600 !to-cyan-600 !text-white !rounded-lg !py-2.5 !text-sm !font-medium hover:!opacity-90 !transition-opacity",
          }}
          detailsButton={{
            className:
              "w-full !bg-surface !border !border-border !rounded-lg !py-2.5 !text-sm",
          }}
        />
        {account && (
          <p className="text-xs text-slate-500 mt-2 text-center font-mono">
            {shortAddress}
          </p>
        )}
      </div>

      {/* Balances */}
      {account && (
        <div className="glass rounded-xl p-4 space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            Balances
          </p>

          {/* Ommy Coin */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                O
              </div>
              <span className="text-sm font-medium">OMMY</span>
            </div>
            <span className="text-sm font-mono text-purple-300">
              {ommyBalance
                ? Number(ommyBalance.displayValue).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : "—"}
            </span>
          </div>

          {/* AVAX */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-xs font-bold">
                A
              </div>
              <span className="text-sm font-medium">AVAX</span>
            </div>
            <span className="text-sm font-mono text-slate-300">
              {avaxBalance
                ? Number(avaxBalance.displayValue).toFixed(4)
                : "—"}
            </span>
          </div>
        </div>
      )}

      {/* Network Badge */}
      <div className="glass rounded-xl p-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-slate-400">Avalanche Mainnet</span>
      </div>
    </div>
  );
}
