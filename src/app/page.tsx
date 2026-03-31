"use client";

import dynamic from "next/dynamic";

const LandingPage = dynamic(
  () => import("@/components/LandingPage").then((m) => m.LandingPage),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-black text-lg mx-auto mb-3 animate-pulse">
            O
          </div>
          <p className="text-slate-500 text-sm">Om Domo...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <LandingPage />;
}
