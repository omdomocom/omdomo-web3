"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("@/components/Dashboard").then((m) => m.Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-lg mx-auto mb-3">
            O
          </div>
          <p className="text-slate-500 text-sm">Loading Om Domo AI...</p>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  return <Dashboard />;
}
