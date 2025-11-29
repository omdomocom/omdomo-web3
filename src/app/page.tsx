'use client';

import { ConnectButton } from "thirdweb/react";
import { client } from "./client";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-purple-300 mb-3">
          Om Domo · Web3
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold mb-3">
          Bienvenid@ a la Comunidad <span className="text-purple-400">Om Domo</span>
        </h1>

        <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto">
          Conecta tu wallet, únete a la energía de Ommy y construyamos juntos
          una comunidad de amor, conciencia y recompensas digitales.
        </p>
      </div>

      <div className="mb-10">
        <ConnectButton client={client} />
      </div>

      <div className="text-center text-sm md:text-base text-gray-400 space-y-2 max-w-lg">
        <p>
          ✨ Cada conexión es un paso más hacia una red de personas que viven,
          crean y comparten desde el amor.
        </p>
        <p>
          Muy pronto podrás ver aquí tus tokens, recompensas y acceso a
          experiencias especiales de Om Domo Web3.
        </p>
      </div>
    </main>
  );
}
