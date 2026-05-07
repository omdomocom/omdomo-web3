"use client";

import { useState, useEffect } from "react";
import { Flame, Clock, Users, Coins, ExternalLink, Lock } from "lucide-react";

// Configuración del próximo drop
const NEXT_DROP = {
  name: "Om Domo Genesis Drop #1",
  subtitle: "La colección que inicia todo",
  description:
    "100 hoodies numeradas. Cada una incluye un NFT Genesis Edition con rarity exclusiva, 10.000 OMMY de recompensa y acceso permanente a la comunidad DAO de Om Domo.",
  date: new Date("2026-08-15T18:00:00Z"), // Lanzamiento Agosto 2026
  totalUnits: 100,
  unitsSold: 0,    // Se actualiza en tiempo real
  priceEUR: 89,
  ommyReward: 10_000,
  ommyBurn: 5_000_000, // OMMY quemados en este drop
  benefits: [
    "NFT Genesis Edition (rarity máxima)",
    "10.000 OMMY en tu wallet",
    "Acceso vitalicio a comunidad DAO",
    "Voto en las próximas colecciones",
    "Hoodie física numerada",
    "Acceso anticipado a futuros drops",
  ],
  shopifyUrl: "https://omdomo.com/collections/genesis-drop",
};

// Drops próximos (teaser)
const UPCOMING_DROPS = [
  {
    name: "Drop #2 — Solsticio",
    date: "Septiembre 2026",
    units: 50,
    teaser: "Colección de verano. NFT animado incluido.",
    locked: true,
  },
  {
    name: "Drop #3 — Ommy Lab Vol.1",
    date: "Diciembre 2026",
    units: 200,
    teaser: "Primera colaboración con artistas de la comunidad DAO.",
    locked: true,
  },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const now = Date.now();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function DropsPage() {
  const countdown = useCountdown(NEXT_DROP.date);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const remaining = NEXT_DROP.totalUnits - NEXT_DROP.unitsSold;
  const soldPercent = (NEXT_DROP.unitsSold / NEXT_DROP.totalUnits) * 100;

  function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!waitlistEmail) return;
    // TODO: integrar con Shopify/KV para lista de espera
    setWaitlistDone(true);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
              O
            </a>
            <span className="text-sm font-bold gradient-text">Om Domo</span>
            <span className="text-slate-500 text-sm">· Drops</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/claim"
              className="text-xs px-3 py-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-900/20 transition-colors"
            >
              Reclamar NFT
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Drop principal */}
        <div className="glass rounded-2xl p-8 border border-orange-500/20 space-y-6">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 font-medium">
              <Flame size={12} /> Drop Limitado — {NEXT_DROP.totalUnits} unidades
            </span>
          </div>

          {/* Título */}
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{NEXT_DROP.name}</h1>
            <p className="text-slate-400 mt-1">{NEXT_DROP.subtitle}</p>
          </div>

          {/* Countdown */}
          <div>
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
              <Clock size={12} /> Lanzamiento en
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "días", value: countdown.days },
                { label: "horas", value: countdown.hours },
                { label: "min", value: countdown.minutes },
                { label: "seg", value: countdown.seconds },
              ].map((t) => (
                <div key={t.label} className="glass rounded-xl p-3 text-center border border-slate-700/40">
                  <p className="text-2xl font-bold font-mono gradient-text">
                    {String(t.value).padStart(2, "0")}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Users size={10} />
                {NEXT_DROP.unitsSold} vendidas / {NEXT_DROP.totalUnits} total
              </span>
              <span className="text-orange-400 font-medium">{remaining} restantes</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                style={{ width: `${Math.max(soldPercent, 0.5)}%` }}
              />
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-slate-400 leading-relaxed">{NEXT_DROP.description}</p>

          {/* Beneficios */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Incluye</p>
            <div className="grid grid-cols-2 gap-2">
              {NEXT_DROP.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-purple-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Precio y rewards */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-purple-900/10 border border-purple-500/20">
            <div>
              <p className="text-sm text-slate-500">Precio</p>
              <p className="text-2xl font-bold text-slate-100">€{NEXT_DROP.priceEUR}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 flex items-center gap-1 justify-end">
                <Coins size={12} className="text-purple-400" /> OMMY reward
              </p>
              <p className="text-xl font-bold gradient-text">+{NEXT_DROP.ommyReward.toLocaleString()}</p>
              <p className="text-xs text-orange-400 flex items-center gap-1 justify-end mt-0.5">
                <Flame size={10} /> {(NEXT_DROP.ommyBurn / 1_000_000).toFixed(0)}M OMMY quemados
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <a
              href={NEXT_DROP.shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <Flame size={16} /> Comprar ahora — €{NEXT_DROP.priceEUR}
              <ExternalLink size={14} />
            </a>
            <p className="text-xs text-slate-600 text-center">
              Pago en omdomo.com (Shopify) · NFT automático tras la compra
            </p>
          </div>
        </div>

        {/* Lista de espera */}
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">Acceso anticipado</h2>
            <p className="text-sm text-slate-500 mt-1">
              Los de la lista tienen 1 hora de ventaja antes del drop público. Bonus: +1.000 OMMY extra.
            </p>
          </div>
          {waitlistDone ? (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              ✓ En la lista. Te avisamos 24h antes del drop.
            </div>
          ) : (
            <form onSubmit={joinWaitlist} className="flex gap-2">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-cyan-500/50 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Unirme
              </button>
            </form>
          )}
        </div>

        {/* Próximos drops */}
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            Próximos drops
          </p>
          {UPCOMING_DROPS.map((drop) => (
            <div
              key={drop.name}
              className="glass rounded-xl p-4 border border-slate-700/40 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-300">{drop.name}</p>
                <p className="text-xs text-slate-600 mt-0.5">{drop.teaser}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-500">{drop.date}</p>
                <p className="text-xs text-orange-400 mt-0.5">{drop.units} uds.</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pb-4">
          <p className="text-xs text-slate-600">
            Cada drop quema millones de OMMY del supply. Los holders ganan. El token sube.
          </p>
          <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
