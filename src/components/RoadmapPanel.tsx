"use client";

const PHASES = [
  {
    number: 1,
    name: "Motor de Ventas",
    status: "active",
    date: "Jun 2026",
    items: ["NFT por compra", "Wallet connect", "OMMY rewards", "Share-to-earn", "Drops limitados"],
  },
  {
    number: 2,
    name: "Economía Ommy Coin",
    status: "pending",
    date: "Sep 2026",
    items: ["Staking NFT", "Burn automático", "Referral system"],
  },
  {
    number: 3,
    name: "App Recompensas",
    status: "pending",
    date: "Ene 2027",
    items: ["Proof of Conscious Activity", "Apple Health", "NFT achievements"],
  },
  {
    number: 4,
    name: "Comunidad DAO",
    status: "pending",
    date: "Jun 2027",
    items: ["Governance", "Foro holders", "Ambassadors"],
  },
  {
    number: 5,
    name: "Ommy Lab",
    status: "pending",
    date: "2028",
    items: ["NFT Art", "Fashion drops", "Creator collabs"],
  },
];

export function RoadmapPanel() {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
        Roadmap
      </p>
      <div className="space-y-2">
        {PHASES.map((phase) => (
          <div
            key={phase.number}
            className={`rounded-lg p-3 border transition-all ${
              phase.status === "active"
                ? "border-purple-500/40 bg-purple-900/10"
                : "border-slate-800/40"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  phase.status === "active"
                    ? "bg-purple-500 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {phase.number}
              </span>
              <span
                className={`text-xs font-semibold flex-1 ${
                  phase.status === "active" ? "text-purple-300" : "text-slate-500"
                }`}
              >
                {phase.name}
              </span>
              <span
                className={`text-xs flex-shrink-0 ${
                  phase.status === "active"
                    ? "text-green-400 font-medium"
                    : "text-slate-600"
                }`}
              >
                {phase.status === "active" ? "NOW" : phase.date}
              </span>
            </div>
            {phase.status === "active" && (
              <div className="flex flex-wrap gap-1 mt-1.5 pl-7">
                {phase.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs bg-purple-900/30 text-purple-300 px-1.5 py-0.5 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
