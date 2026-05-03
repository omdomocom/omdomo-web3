// NFT Studio — Registro Maestro de Colecciones Om Domo
// ─────────────────────────────────────────────────────────────────────────────
// Fuente de verdad para todas las colecciones, sus NFTs y temporadas.

export type CollectionId =
  | "chakras"
  | "yoga"
  | "reiki"
  | "lunar-phases"
  | "elements"
  | "mudras"
  | "pranayama"
  | "sacred-geometry"
  | "kundalini"
  | "mantras"
  | "sacred-plants"
  | "guardians"
  | "zodiac";

export interface NFTDefinition {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  emoji: string;
  attributes: Record<string, string | number>;
  promptHints: string[];          // palabras clave para el prompt de Replicate
  rarityTier: "standard" | "rare" | "legendary"; // standard=111u, rare=33u, legendary=11u
}

export interface SeasonDefinition {
  seasonNumber: number;           // 1, 2, 3...
  totalSeasons: number;           // cuántas temporadas tiene la colección
  nfts: NFTDefinition[];          // NFTs de esta temporada
  scheduledMonth: string;         // "2026-07" (año-mes)
  launchDate?: string;            // fecha exacta de lanzamiento
  status: "upcoming" | "voting" | "minting" | "launched" | "completed";
}

export interface Collection {
  id: CollectionId;
  name: string;
  nameEs: string;
  description: string;
  emoji: string;
  totalNFTs: number;
  totalSeasons: number;
  artStyle: string;               // descripción del estilo visual
  replicateModel: string;         // modelo de Replicate a usar
  basePrompt: string;             // prompt base para todos los NFTs de la colección
  colorPalette: string[];         // colores principales
  seasons: SeasonDefinition[];
  status: "active" | "upcoming" | "completed";
  contractTokenIdRange: [number, number]; // rango de tokenIds en el contrato
}

// ─── Importaciones de colecciones ────────────────────────────────────────────
export { CHAKRAS_COLLECTION } from "./chakras";
export { YOGA_COLLECTION } from "./yoga";
export { REIKI_COLLECTION } from "./reiki";
export { LUNAR_PHASES_COLLECTION } from "./lunar-phases";
export { ELEMENTS_COLLECTION } from "./elements";
export { MUDRAS_COLLECTION } from "./mudras";
export { PRANAYAMA_COLLECTION } from "./pranayama";
export { SACRED_GEOMETRY_COLLECTION } from "./sacred-geometry";
export { KUNDALINI_COLLECTION } from "./kundalini";
export { MANTRAS_COLLECTION } from "./mantras";
export { SACRED_PLANTS_COLLECTION } from "./sacred-plants";

import { CHAKRAS_COLLECTION } from "./chakras";
import { YOGA_COLLECTION } from "./yoga";
import { REIKI_COLLECTION } from "./reiki";
import { LUNAR_PHASES_COLLECTION } from "./lunar-phases";
import { ELEMENTS_COLLECTION } from "./elements";
import { MUDRAS_COLLECTION } from "./mudras";
import { PRANAYAMA_COLLECTION } from "./pranayama";
import { SACRED_GEOMETRY_COLLECTION } from "./sacred-geometry";
import { KUNDALINI_COLLECTION } from "./kundalini";
import { MANTRAS_COLLECTION } from "./mantras";
import { SACRED_PLANTS_COLLECTION } from "./sacred-plants";

// ─── Registro completo ────────────────────────────────────────────────────────

export const ALL_COLLECTIONS: Collection[] = [
  CHAKRAS_COLLECTION,
  YOGA_COLLECTION,
  REIKI_COLLECTION,
  LUNAR_PHASES_COLLECTION,
  ELEMENTS_COLLECTION,
  MUDRAS_COLLECTION,
  PRANAYAMA_COLLECTION,
  SACRED_GEOMETRY_COLLECTION,
  KUNDALINI_COLLECTION,
  MANTRAS_COLLECTION,
  SACRED_PLANTS_COLLECTION,
];

export function getCollection(id: CollectionId): Collection | undefined {
  return ALL_COLLECTIONS.find((c) => c.id === id);
}

export function getActiveCollection(): Collection | undefined {
  return ALL_COLLECTIONS.find((c) => c.status === "active");
}

export function getUpcomingCollections(): Collection[] {
  return ALL_COLLECTIONS.filter((c) => c.status === "upcoming");
}

export function getCurrentSeason(collectionId: CollectionId): SeasonDefinition | undefined {
  const col = getCollection(collectionId);
  if (!col) return undefined;
  return col.seasons.find((s) => s.status === "voting" || s.status === "minting");
}

export function getScheduledSeason(month: string): { collection: Collection; season: SeasonDefinition } | undefined {
  for (const col of ALL_COLLECTIONS) {
    const season = col.seasons.find((s) => s.scheduledMonth === month);
    if (season) return { collection: col, season };
  }
  return undefined;
}
