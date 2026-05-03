// NFT Studio — Calendario de Temporadas 2026-2028
// ─────────────────────────────────────────────────────────────────────────────

import type { CollectionId } from "../collections/index";

export interface SeasonSchedule {
  month: string;               // "2026-07"
  collectionId: CollectionId;
  seasonNumber: number;
  totalSeasons: number;
  nftCount: number;
  label: string;               // "Chakras · T1/1"
  // Semana 1
  proposalDate: string;        // publicación propuesta DAO: "2026-07-01"
  // Semana 2 — Feedback en dos tiempos
  feedback1Start: string;      // inicio primer feedback (lunes): "2026-07-06"
  feedback1End: string;        // cierre primer feedback (miércoles noche): "2026-07-08"
  refinementDate: string;      // Replicate regenera + publica mejorado (jueves): "2026-07-09"
  feedback2Start: string;      // inicio segundo feedback (jueves): "2026-07-09"
  feedback2End: string;        // cierre segundo feedback (domingo): "2026-07-12"
  // Semana 3
  finalVoteStart: string;      // votación final de aprobación: "2026-07-13"
  finalVoteEnd: string;        // cierre votación final: "2026-07-19"
  // Semana 4
  launchDate: string;          // lanzamiento a venta: "2026-07-23"
  closeDate: string;           // cierre del mes: "2026-07-31"
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
    month: "2026-07", collectionId: "chakras", seasonNumber: 1, totalSeasons: 1, nftCount: 7,
    label: "🔴 Chakras · T1/1",
    proposalDate:   "2026-07-01",  // Semana 1: propuesta publicada
    feedback1Start: "2026-07-06",  // Semana 2a: lunes — primer feedback
    feedback1End:   "2026-07-08",  // Semana 2a: miércoles noche — cierre
    refinementDate: "2026-07-09",  // Jueves: Replicate regenera + publica mejorado
    feedback2Start: "2026-07-09",  // Semana 2b: jueves — segundo feedback
    feedback2End:   "2026-07-12",  // Semana 2b: domingo — cierre
    finalVoteStart: "2026-07-13",  // Semana 3: votación final
    finalVoteEnd:   "2026-07-19",
    launchDate:     "2026-07-23",  // Semana 4: lanzamiento
    closeDate:      "2026-07-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-08", collectionId: "yoga", seasonNumber: 1, totalSeasons: 3, nftCount: 7,
    label: "🧘 Yoga Asanas · T1/3",
    proposalDate:   "2026-08-01",
    feedback1Start: "2026-08-03",
    feedback1End:   "2026-08-05",
    refinementDate: "2026-08-06",
    feedback2Start: "2026-08-06",
    feedback2End:   "2026-08-09",
    finalVoteStart: "2026-08-10",
    finalVoteEnd:   "2026-08-16",
    launchDate:     "2026-08-23",
    closeDate:      "2026-08-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-09", collectionId: "reiki",          seasonNumber: 1, totalSeasons: 4,  nftCount: 7,
    label: "🌿 Reiki · T1/4",
    votingWeek1: "2026-09-01", votingWeek2: "2026-09-15", launchDate: "2026-09-23", closeDate: "2026-09-30",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-10", collectionId: "lunar-phases",   seasonNumber: 1, totalSeasons: 1,  nftCount: 8,
    label: "🌙 Fases Lunares · T1/1",
    votingWeek1: "2026-10-01", votingWeek2: "2026-10-15", launchDate: "2026-10-23", closeDate: "2026-10-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-11", collectionId: "elements",       seasonNumber: 1, totalSeasons: 1,  nftCount: 5,
    label: "🌊 Elementos Sagrados · T1/1",
    votingWeek1: "2026-11-01", votingWeek2: "2026-11-15", launchDate: "2026-11-23", closeDate: "2026-11-30",
    isCompleted: false, isActive: false,
  },
  {
    month: "2026-12", collectionId: "yoga",           seasonNumber: 2, totalSeasons: 3,  nftCount: 7,
    label: "🧘 Yoga Asanas · T2/3",
    votingWeek1: "2026-12-01", votingWeek2: "2026-12-15", launchDate: "2026-12-23", closeDate: "2026-12-31",
    isCompleted: false, isActive: false,
  },

  // ─── 2027 ─────────────────────────────────────────────────────────────────
  {
    month: "2027-01", collectionId: "reiki",          seasonNumber: 2, totalSeasons: 4,  nftCount: 7,
    label: "🌿 Reiki · T2/4",
    votingWeek1: "2027-01-01", votingWeek2: "2027-01-15", launchDate: "2027-01-23", closeDate: "2027-01-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-02", collectionId: "mudras",         seasonNumber: 1, totalSeasons: 3,  nftCount: 7,
    label: "🙏 Mudras · T1/3",
    votingWeek1: "2027-02-01", votingWeek2: "2027-02-15", launchDate: "2027-02-23", closeDate: "2027-02-28",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-03", collectionId: "yoga",           seasonNumber: 3, totalSeasons: 3,  nftCount: 7,
    label: "🧘 Yoga Asanas · T3/3 ✓ COMPLETO",
    votingWeek1: "2027-03-01", votingWeek2: "2027-03-15", launchDate: "2027-03-23", closeDate: "2027-03-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-04", collectionId: "kundalini",      seasonNumber: 1, totalSeasons: 1,  nftCount: 7,
    label: "🐍 Kundalini · T1/1",
    votingWeek1: "2027-04-01", votingWeek2: "2027-04-15", launchDate: "2027-04-23", closeDate: "2027-04-30",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-05", collectionId: "reiki",          seasonNumber: 3, totalSeasons: 4,  nftCount: 7,
    label: "🌿 Reiki · T3/4",
    votingWeek1: "2027-05-01", votingWeek2: "2027-05-15", launchDate: "2027-05-23", closeDate: "2027-05-31",
    isCompleted: false, isActive: false,
  },
  {
    month: "2027-06", collectionId: "pranayama",      seasonNumber: 1, totalSeasons: 2,  nftCount: 7,
    label: "🌬️ Pranayama · T1/2",
    votingWeek1: "2027-06-01", votingWeek2: "2027-06-15", launchDate: "2027-06-23", closeDate: "2027-06-30",
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
