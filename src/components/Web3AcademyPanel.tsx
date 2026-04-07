"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, Coins, Lock, Zap, Star } from "lucide-react";

const LESSONS = [
  {
    id: "wallet",
    icon: "🦊",
    title: "¿Qué es una wallet?",
    reward: 25,
    time: "2 min",
    level: "Básico",
    content: `Una **wallet** (billetera digital) es tu identidad en Web3. No guarda tus criptomonedas directamente — guarda las **claves privadas** que prueban que eres el dueño de tus activos en la blockchain.

**Tipos de wallets:**
• **MetaMask** — la más popular. Se instala como extensión del navegador
• **Coinbase Wallet** — simple, ideal para principiantes
• **Hardware Wallet** (Ledger) — la más segura para grandes cantidades

**La regla de oro:** Nunca compartas tu frase de recuperación (seed phrase) de 12-24 palabras con nadie. Ni con soporte técnico.

En Om Domo usas tu wallet para recibir NFTs y OMMY Coin automáticamente tras cada compra.`,
    quiz: {
      question: "¿Qué guarda realmente una wallet?",
      options: [
        "Las criptomonedas directamente",
        "Las claves privadas que prueban tu propiedad",
        "Tu nombre y apellidos",
        "El historial de compras",
      ],
      correct: 1,
    },
  },
  {
    id: "blockchain",
    icon: "⛓️",
    title: "¿Qué es la blockchain?",
    reward: 25,
    time: "3 min",
    level: "Básico",
    content: `La **blockchain** es una base de datos pública e inmutable donde se registran todas las transacciones. Imagina un libro de contabilidad que miles de ordenadores comparten y verifican simultáneamente.

**Características clave:**
• **Descentralizada** — no hay un servidor central que pueda ser atacado
• **Inmutable** — una vez registrado, ningún dato puede borrarse
• **Transparente** — cualquiera puede verificar cualquier transacción
• **Sin intermediarios** — no necesitas un banco para enviar dinero

**Avalanche** es la blockchain que usa Om Domo: procesa más de 4,500 transacciones por segundo con comisiones de céntimos.

Cada vez que recibes un NFT o OMMY Coin tras una compra, queda registrado para siempre en Avalanche.`,
    quiz: {
      question: "¿Cuál es la blockchain que usa Om Domo?",
      options: ["Ethereum", "Bitcoin", "Avalanche", "Solana"],
      correct: 2,
    },
  },
  {
    id: "nft",
    icon: "🖼️",
    title: "¿Qué son los NFTs?",
    reward: 25,
    time: "3 min",
    level: "Básico",
    content: `Un **NFT** (Non-Fungible Token) es un certificado digital único e irrepetible registrado en la blockchain. "No fungible" significa que cada uno es único — no intercambiable.

**Diferencia clave:**
• 1 OMMY = cualquier otro OMMY (fungible, como el dinero)
• NFT Genesis #001 ≠ NFT Genesis #002 (no fungible, cada uno es único)

**En Om Domo los NFTs sirven para:**
• Probar que compraste una prenda antes del lanzamiento (rareza Genesis)
• Acceder a zonas exclusivas de la comunidad
• Staking: mantener tu NFT = ganar 50 OMMY/día (Fase 2)
• Votación en la DAO con peso proporcional a tu rareza

**Rareza en Om Domo:**
Genesis > Founder > Community > Standard`,
    quiz: {
      question: "¿Cuánto OMMY/día genera el staking de un NFT (Fase 2)?",
      options: ["10 OMMY", "25 OMMY", "50 OMMY", "100 OMMY"],
      correct: 2,
    },
  },
  {
    id: "ommy",
    icon: "🪙",
    title: "OMMY Coin explicado",
    reward: 50,
    time: "4 min",
    level: "Intermedio",
    content: `**OMMY Coin** es el token nativo del ecosistema Om Domo, desplegado en Avalanche Mainnet.

**Supply total:** 29,979,245,800 OMMY

**Distribución principal:**
• 25% Ecosistema & Rewards — para ti y la comunidad
• 25% Quema programada — reduce la oferta y aumenta el valor
• 15% Liquidez DEX — para poder comprar y vender
• 10% Pre-compra — early adopters al precio $0.001

**Mecánicas de quema (deflatoria):**
Cada compra en omdomo.com quema 500 OMMY + 2% de los rewards. Objetivo: reducir el supply un 90% en 7-8 años.

**¿Cómo ganar OMMY?**
• Compra física: 70 OMMY × USD gastado
• NFT claim bonus: +1,000 OMMY
• Compartir en redes: +500 OMMY
• Votar en la DAO: +200 OMMY
• Referir un amigo: +2,000 OMMY

**Proyección de precio:**
$0.001 (2026) → $0.003 (2027) → $0.01 (2028) → $0.035 (2029) → $0.10 (2030)`,
    quiz: {
      question: "¿Cuántos OMMY ganas por cada USD gastado en omdomo.com?",
      options: ["10 OMMY", "35 OMMY", "70 OMMY", "100 OMMY"],
      correct: 2,
    },
  },
  {
    id: "dao",
    icon: "🏛️",
    title: "¿Qué es una DAO?",
    reward: 25,
    time: "3 min",
    level: "Intermedio",
    content: `Una **DAO** (Organización Autónoma Descentralizada) es una comunidad que se gobierna mediante votaciones en la blockchain. Nadie tiene el control total — las decisiones las toma la comunidad.

**En la DAO de Om Domo puedes:**
• Votar sobre nuevos diseños de ropa y drops
• Proponer iniciativas de la comunidad
• Decidir destinos de los fondos del Treasury
• Ganar +200 OMMY por cada voto emitido

**¿Cómo funciona el voto?**
El peso de tu voto depende de la rareza de tus NFTs y la cantidad de OMMY en staking. Los Genesis tienen mayor peso que los Community.

El Treasury DAO tiene 1,498,962,290 OMMY para financiar el ecosistema y está protegido por un multisig 2/2 (dos firmas requeridas).`,
    quiz: {
      question: "¿Cuántos OMMY ganas por votar en la DAO?",
      options: ["+50 OMMY", "+100 OMMY", "+200 OMMY", "+500 OMMY"],
      correct: 2,
    },
  },
  {
    id: "avalanche",
    icon: "🔺",
    title: "Por qué Avalanche",
    reward: 25,
    time: "2 min",
    level: "Avanzado",
    content: `**Avalanche** es la red blockchain elegida para Om Domo por razones técnicas y económicas claras.

**Ventajas vs Ethereum:**
• Velocidad: 4,500 tx/seg vs 15 tx/seg de Ethereum
• Comisiones: céntimos vs $10-50 en Ethereum
• Finalidad: 1-2 segundos vs 10-15 minutos
• Eco-friendly: Proof of Stake (consume 99.9% menos energía)

**Ecosistema:**
• Snowtrace: explorador de transacciones (como Etherscan)
• Pangolin / Trader Joe: DEXs donde se podrá comprar OMMY
• Core Wallet: wallet oficial de Avalanche
• Fuji Testnet: red de prueba gratuita (donde probamos ahora)

**Testnet Fuji:** Actualmente en fase de pruebas. Los NFTs y OMMY que ves son "de prueba". En Junio 2026 migramos a Mainnet y recibirás los tokens reales.`,
    quiz: {
      question: "¿Cuántas transacciones por segundo procesa Avalanche?",
      options: ["15 tx/seg", "1,000 tx/seg", "4,500 tx/seg", "10,000 tx/seg"],
      correct: 2,
    },
  },
];

const STORAGE_KEY = "omdomo-academy";

interface AcademyState {
  read: string[];    // lesson IDs read
  quizDone: string[]; // lesson IDs with quiz completed
  totalEarned: number;
}

function loadState(): AcademyState {
  if (typeof window === "undefined") return { read: [], quizDone: [], totalEarned: 0 };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") ?? { read: [], quizDone: [], totalEarned: 0 };
  } catch {
    return { read: [], quizDone: [], totalEarned: 0 };
  }
}

function saveState(s: AcademyState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function Web3AcademyPanel() {
  const [state, setState] = useState<AcademyState>({ read: [], quizDone: [], totalEarned: 0 });
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);
  const [reward, setReward] = useState<number | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  function openLessonFn(id: string) {
    setOpenLesson(id);
    setQuizAnswer(null);
    setQuizResult(null);
    setReward(null);

    // Mark as read and earn reward if first time
    setState((prev) => {
      if (prev.read.includes(id)) return prev;
      const lesson = LESSONS.find((l) => l.id === id)!;
      const earned = Math.floor(lesson.reward / 2); // reading = half reward
      const next = {
        ...prev,
        read: [...prev.read, id],
        totalEarned: prev.totalEarned + earned,
      };
      saveState(next);
      setReward(earned);
      return next;
    });
  }

  function submitQuiz(lessonId: string, selectedIdx: number) {
    const lesson = LESSONS.find((l) => l.id === lessonId)!;
    setQuizAnswer(selectedIdx);
    const correct = selectedIdx === lesson.quiz.correct;
    setQuizResult(correct ? "correct" : "wrong");

    if (correct && !state.quizDone.includes(lessonId)) {
      const earned = Math.ceil(lesson.reward / 2); // quiz = other half
      setState((prev) => {
        const next = {
          ...prev,
          quizDone: [...prev.quizDone, lessonId],
          totalEarned: prev.totalEarned + earned,
        };
        saveState(next);
        return next;
      });
      setReward(earned);
    }
  }

  const totalPossible = LESSONS.reduce((a, l) => a + l.reward, 0);
  const progress = Math.round((state.totalEarned / totalPossible) * 100);

  const currentLesson = LESSONS.find((l) => l.id === openLesson);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass rounded-2xl p-5 border border-purple-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Web3 Academy</h2>
              <p className="text-xs text-slate-500">Aprende y gana OMMY Coin</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total ganado</p>
            <p className="text-base font-black gradient-text">+{state.totalEarned} OMMY</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>{state.read.length}/{LESSONS.length} lecciones leídas</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Reward hint */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-900/20 border border-amber-500/20">
        <Coins size={14} className="text-amber-400 flex-shrink-0" />
        <p className="text-xs text-amber-300">
          Lee cada lección → <strong>+{LESSONS[0].reward / 2} OMMY</strong> · Completa el quiz → <strong>+{Math.ceil(LESSONS[0].reward / 2)} OMMY</strong>
        </p>
      </div>

      {/* Lesson list */}
      <div className="space-y-2">
        {LESSONS.map((lesson, i) => {
          const isRead = state.read.includes(lesson.id);
          const quizDone = state.quizDone.includes(lesson.id);
          const isOpen = openLesson === lesson.id;
          const locked = i > 0 && !state.read.includes(LESSONS[i - 1].id);

          return (
            <div key={lesson.id}>
              <motion.button
                onClick={() => !locked && (isOpen ? setOpenLesson(null) : openLessonFn(lesson.id))}
                whileHover={!locked ? { x: 2 } : {}}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left ${
                  isOpen
                    ? "border-purple-500/40 bg-purple-900/15"
                    : locked
                    ? "border-slate-800/30 opacity-40 cursor-not-allowed"
                    : "border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/20"
                }`}
              >
                <span className="text-2xl flex-shrink-0">{locked ? "🔒" : lesson.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold truncate ${isOpen ? "text-purple-200" : "text-slate-200"}`}>
                      {lesson.title}
                    </p>
                    {isRead && !quizDone && (
                      <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-amber-900/30 border border-amber-500/30 text-amber-400">
                        Quiz pendiente
                      </span>
                    )}
                    {quizDone && (
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span>{lesson.level}</span>
                    <span>·</span>
                    <span>{lesson.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-bold text-amber-400">+{lesson.reward} OMMY</span>
                  {locked ? (
                    <Lock size={12} className="text-slate-600" />
                  ) : (
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={14} className="text-slate-500" />
                    </motion.span>
                  )}
                </div>
              </motion.button>

              {/* Lesson content expanded */}
              <AnimatePresence>
                {isOpen && currentLesson && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border border-purple-500/20 border-t-0 rounded-b-2xl bg-slate-950/40 space-y-4">
                      {/* Reward earned toast */}
                      <AnimatePresence>
                        {reward !== null && !state.quizDone.includes(lesson.id) && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-900/30 border border-green-500/30"
                          >
                            <Star size={14} className="text-green-400" />
                            <span className="text-xs text-green-400 font-semibold">
                              +{reward} OMMY ganados por leer esta lección
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Content */}
                      <div className="prose-sm space-y-2">
                        {currentLesson.content.split("\n\n").map((para, pi) => (
                          <p key={pi} className="text-xs text-slate-400 leading-relaxed">
                            {para.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                              j % 2 === 1
                                ? <strong key={j} className="text-slate-200 font-semibold">{part}</strong>
                                : <span key={j}>{part}</span>
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Quiz */}
                      {isRead && (
                        <div className="border-t border-slate-800/40 pt-4 space-y-3">
                          <p className="text-xs font-bold text-slate-200 flex items-center gap-2">
                            <BookOpen size={13} className="text-purple-400" />
                            {quizDone ? "Quiz completado ✓" : `Quiz · +${Math.ceil(currentLesson.reward / 2)} OMMY`}
                          </p>

                          {!quizDone ? (
                            <>
                              <p className="text-xs text-slate-300">{currentLesson.quiz.question}</p>
                              <div className="space-y-2">
                                {currentLesson.quiz.options.map((opt, idx) => {
                                  const selected = quizAnswer === idx;
                                  const correct = quizResult === "correct" && selected;
                                  const wrong = quizResult === "wrong" && selected;
                                  const showCorrect = quizResult === "wrong" && idx === currentLesson.quiz.correct;

                                  return (
                                    <button
                                      key={idx}
                                      disabled={quizResult !== null}
                                      onClick={() => submitQuiz(lesson.id, idx)}
                                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${
                                        correct
                                          ? "border-green-500/60 bg-green-900/20 text-green-300"
                                          : wrong
                                          ? "border-red-500/60 bg-red-900/20 text-red-300"
                                          : showCorrect
                                          ? "border-green-500/40 bg-green-900/10 text-green-400"
                                          : quizResult !== null
                                          ? "border-slate-700/30 text-slate-500 cursor-not-allowed"
                                          : "border-slate-700/40 text-slate-300 hover:border-purple-500/40 hover:bg-purple-900/10"
                                      }`}
                                    >
                                      <span className="font-mono mr-2 text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {quizResult === "correct" && (
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-900/30 border border-green-500/30"
                                >
                                  <CheckCircle size={14} className="text-green-400" />
                                  <span className="text-xs text-green-400 font-semibold">
                                    ¡Correcto! +{Math.ceil(currentLesson.reward / 2)} OMMY ganados
                                  </span>
                                </motion.div>
                              )}
                              {quizResult === "wrong" && (
                                <p className="text-xs text-red-400 px-1">
                                  Incorrecto. La respuesta correcta está marcada en verde. ¡Sigue leyendo!
                                </p>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-900/20 border border-green-500/20">
                              <CheckCircle size={14} className="text-green-400" />
                              <span className="text-xs text-green-400">Quiz superado · +{Math.ceil(currentLesson.reward / 2)} OMMY ya ganados</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Completion bonus */}
      {state.quizDone.length === LESSONS.length && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-5 border border-amber-500/30 text-center"
        >
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-sm font-bold text-slate-100">¡Academia completada!</p>
          <p className="text-xs text-slate-500 mt-1">Has ganado un total de <strong className="text-amber-400">{state.totalEarned} OMMY</strong></p>
        </motion.div>
      )}
    </div>
  );
}
