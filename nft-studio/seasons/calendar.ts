// NFT Studio — Calendario de Temporadas 2026-2028
// ─────────────────────────────────────────────────────────────────────────────

import type { CollectionId } from "../collections/index";

export interface SeasonSchedule {
  month: string;               // "2026-09"
  collectionId: CollectionId;
  seasonNumber: number;
  totalSeasons: number;
  nftCount: number;
  label: string;               // "Chakras · T1/1"
  // Semana 1
  proposalDate: string;        // publicación propuesta DAO: "2026-09-01"
  // Semana 2 — Feedback en dos tiempos
  feedback1Start: string;      // inicio primer feedback (lunes): "2026-09-06"
  feedback1End: string;        // cierre primer feedback (miércoles noche): "2026-09-08"
  refinementDate: string;      // Replicate regenera + publica mejorado (jueves): "2026-09-09"
  feedback2Start: string;      // inicio segundo feedback (jueves): "2026-09-09"
  feedback2End: string;        // cierre segundo feedback (domingo): "2026-09-12"
  // Semana 3
  finalVoteStart: string;      // votación final de aprobación: "2026-09-13"
  finalVoteEnd: string;        // cierre votación final: "2026-09-19"
  // Semana 4
  launchDate: string;          // lanzamiento a venta: "2026-09-23"
  closeDate: string;           // cierre del mes: "2026-09-30"
  isCompleted: boolean;
  isActive: boolean;
}

export type SeasonPhase =
  | "generation"     // semana 1: generando diseños
  | "feedback1"      // semana 2a: primer feedback (lun-mié)
  | "refinement"     // procesando y regenerando (mié noche-jue)
  | "feedback2"      // semana 2b: segundo feedback complementario (jue-dom)
  | "final-vote"     // semana 3: votación final de aprobación
  | "launch"         // semana 4: en venta
  | "closed";        // temporada cerrada

export const SEASON_CALENDAR: SeasonSchedule[] = [
  // ─── 2026 ─────────────────────────────────────────────────────────────────
  {
    month: "2026-09", collectionId: "chakras", seasonNumber: 1, totalSeasons: 1, nftCount: 7,
    label: "🔴 Chakras · T1/1",
    proposalDate:   "2026-09-01",  // Semana 1: propuesta publicada
    feedback1Start: "2026-09-06",  // Semana 2a: lunes — primer feedback
    feedback1End:   "2026-09-08",  // Semana 2a: miércoles noche — cierre
    refinementDate: "2026-09-09",  // Jueves: Replicate regenera + publica mejorado
    feedback2Start: "2026-09-09",  // Semana 2b: jueves — segundo feedback
    feedback2End:   "2026-09-12",  // Semana 2b: domingo — cierre
    finalVoteStart: "2026-09-13",  // Semana 3: votación final
    finalVoteEnd:   "2026-09-19",
    launchDate:     "2026-09-23",  // Semana 4: lanzamiento
    closeDate:      "2026-09-30",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-10", collectionId: "yoga", seasonNumber: 1, totalSeasons: 3, nftCount: 7,
    label: "🧘 Yoga Asanas · T1/3",
    proposalDate:   "2026-10-01",
    feedback1Start: "2026-10-03",
    feedback1End:   "2026-10-05",
    refinementDate: "2026-10-06",
    feedback2Start: "2026-10-06",
    feedback2End:   "2026-10-09",
    finalVoteStart: "2026-10-10",
    finalVoteEnd:   "2026-10-16",
    launchDate:     "2026-10-23",
    closeDate:      "2026-10-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-11", collectionId: "reiki",          seasonNumber: 1, totalSeasons: 4,  nftCount: 7,
    label: "🌿 Reiki · T1/4",
    proposalDate: "2026-11-01", feedback1Start: "2026-11-07", feedback1End: "2026-11-09",
    refinementDate: "2026-11-10", feedback2Start: "2026-11-10", feedback2End: "2026-11-13",
    finalVoteStart: "2026-11-14", finalVoteEnd: "2026-11-20", launchDate: "2026-11-23", closeDate: "2026-11-30",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-12", collectionId: "lunar-phases",   seasonNumber: 1, totalSeasons: 1,  nftCount: 8,
    label: "🌙 Fases Lunares · T1/1",
    proposalDate: "2026-12-01", feedback1Start: "2026-12-05", feedback1End: "2026-12-07",
    refinementDate: "2026-12-08", feedback2Start: "2026-12-08", feedback2End: "2026-12-11",
    finalVoteStart: "2026-12-12", finalVoteEnd: "2026-12-18", launchDate: "2026-12-23", closeDate: "2026-12-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-01", collectionId: "elements",       seasonNumber: 1, totalSeasons: 1,  nftCount: 5,
    label: "🌊 Elementos Sagrados · T1/1",
    proposalDate: "2027-01-01", feedback1Start: "2027-01-02", feedback1End: "2027-01-04",
    refinementDate: "2027-01-05", feedback2Start: "2027-01-05", feedback2End: "2027-01-08",
    finalVoteStart: "2027-01-09", finalVoteEnd: "2027-01-15", launchDate: "2027-01-23", closeDate: "2027-01-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-02", collectionId: "yoga",           seasonNumber: 2, totalSeasons: 3,  nftCount: 7,
    label: "🧘 Yoga Asanas · T2/3",
    proposalDate: "2027-02-01", feedback1Start: "2027-02-07", feedback1End: "2027-02-09",
    refinementDate: "2027-02-10", feedback2Start: "2027-02-10", feedback2End: "2027-02-13",
    finalVoteStart: "2027-02-14", finalVoteEnd: "2027-02-20", launchDate: "2027-02-23", closeDate: "2027-02-28",
    isCompleted: false, isActive: false,
  },

  // ─── 2027 ─────────────────────────────────────────────────────────────────
  {
    month: "2027-03", collectionId: "reiki",          seasonNumber: 2, totalSeasons: 4,  nftCount: 7,
    label: "🌿 Reiki · T2/4",
    proposalDate: "2027-03-01", feedback1Start: "2027-03-05", feedback1End: "2027-03-07",
    refinementDate: "2027-03-08", feedback2Start: "2027-03-08", feedback2End: "2027-03-11",
    finalVoteStart: "2027-03-12", finalVoteEnd: "2027-03-18", launchDate: "2027-03-23", closeDate: "2027-03-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-04", collectionId: "mudras",         seasonNumber: 1, totalSeasons: 3,  nftCount: 7,
    label: "🙏 Mudras · T1/3",
    proposalDate: "2027-04-01", feedback1Start: "2027-04-01", feedback1End: "2027-04-03",
    refinementDate: "2027-04-04", feedback2Start: "2027-04-04", feedback2End: "2027-04-07",
    finalVoteStart: "2027-04-08", finalVoteEnd: "2027-04-14", launchDate: "2027-04-23", closeDate: "2027-04-28",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-05", collectionId: "yoga",           seasonNumber: 3, totalSeasons: 3,  nftCount: 7,
    label: "🧘 Yoga Asanas · T3/3",
    proposalDate: "2027-05-01", feedback1Start: "2027-05-01", feedback1End: "2027-05-03",
    refinementDate: "2027-05-04", feedback2Start: "2027-05-04", feedback2End: "2027-05-07",
    finalVoteStart: "2027-05-08", finalVoteEnd: "2027-05-14", launchDate: "2027-05-23", closeDate: "2027-05-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-06", collectionId: "kundalini",      seasonNumber: 1, totalSeasons: 1,  nftCount: 7,
    label: "🐍 Kundalini · T1/1",
    proposalDate: "2027-06-01", feedback1Start: "2027-06-05", feedback1End: "2027-06-07",
    refinementDate: "2027-06-08", feedback2Start: "2027-06-08", feedback2End: "2027-06-11",
    finalVoteStart: "2027-06-12", finalVoteEnd: "2027-06-18", launchDate: "2027-06-23", closeDate: "2027-06-30",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-07", collectionId: "reiki",          seasonNumber: 3, totalSeasons: 4,  nftCount: 7,
    label: "🌿 Reiki · T3/4",
    proposalDate: "2027-07-01", feedback1Start: "2027-07-03", feedback1End: "2027-07-05",
    refinementDate: "2027-07-06", feedback2Start: "2027-07-06", feedback2End: "2027-07-09",
    finalVoteStart: "2027-07-10", finalVoteEnd: "2027-07-16", launchDate: "2027-07-23", closeDate: "2027-07-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-08", collectionId: "pranayama",      seasonNumber: 1, totalSeasons: 2,  nftCount: 7,
    label: "🌬️ Pranayama · T1/2",
    proposalDate: "2027-08-01", feedback1Start: "2027-08-02", feedback1End: "2027-08-04",
    refinementDate: "2027-08-05", feedback2Start: "2027-08-05", feedback2End: "2027-08-08",
    finalVoteStart: "2027-08-09", finalVoteEnd: "2027-08-15", launchDate: "2027-08-23", closeDate: "2027-08-30",
    isCompleted: false, isActive: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCurrentSeasonSchedule(): SeasonSchedule | undefined {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return SEASON_CALENDAR.find((s) => s.month === currentMonth);
}

export function getNextSeasonSchedule(): SeasonSchedule | undefined {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const upcoming = SEASON_CALENDAR.filter((s) => s.month > currentMonth && !s.isCompleted);
  return upcoming[0];
}

export function getSeasonPhase(schedule: SeasonSchedule): SeasonPhase {
  const now = new Date();

  if (now < new Date(schedule.feedback1Start))  return "generation";
  if (now < new Date(schedule.refinementDate))  return "feedback1";
  if (now < new Date(schedule.feedback2Start))  return "refinement";
  if (now < new Date(schedule.finalVoteStart))  return "feedback2";
  if (now < new Date(schedule.launchDate))      return "final-vote";
  if (now <= new Date(schedule.closeDate))      return "launch";
  return "closed";
}

export function formatSeasonForUI(schedule: SeasonSchedule): {
  phase: string;
  phaseEmoji: string;
  phaseDetail: string;
  daysLeft: number;
  hoursLeft: number;
  nextMilestone: string;
} {
  const phase = getSeasonPhase(schedule);
  const now = new Date();

  const phaseMap: Record<SeasonPhase, { label: string; detail: string; emoji: string; next: string }> = {
    generation:  { label: "Generando diseños",         detail: "La IA está creando los NFTs de esta temporada", emoji: "🎨", next: schedule.feedback1Start },
    feedback1:   { label: "Primer feedback",            detail: "Vota y deja tu opinión antes del miércoles",    emoji: "🗳️", next: schedule.feedback1End },
    refinement:  { label: "Refinando diseños",          detail: "La IA está mejorando con tu feedback",          emoji: "⚙️", next: schedule.feedback2Start },
    feedback2:   { label: "Segundo feedback",           detail: "¿Mejoraron los diseños? Tu opinión cuenta",     emoji: "✨", next: schedule.feedback2End },
    "final-vote":{ label: "Votación final",             detail: "Aprueba o rechaza las versiones definitivas",   emoji: "⚡", next: schedule.launchDate },
    launch:      { label: "En venta",                   detail: "Los NFTs están disponibles para comprar",       emoji: "🚀", next: schedule.closeDate },
    closed:      { label: "Temporada cerrada",          detail: "Esta temporada ya finalizó",                    emoji: "✅", next: "" },
  };

  const info = phaseMap[phase];
  const nextDate = info.next ? new Date(info.next) : now;
  const msLeft = Math.max(0, nextDate.getTime() - now.getTime());
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return {
    phase: info.label,
    phaseEmoji: info.emoji,
    phaseDetail: info.detail,
    daysLeft,
    hoursLeft,
    nextMilestone: info.next,
  };
}
