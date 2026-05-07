// Colección: KUNDALINI — 7 NFTs, 1 temporada
import type { Collection } from "./index";

export const KUNDALINI_COLLECTION: Collection = {
  id: "kundalini",
  name: "Kundalini Rising",
  nameEs: "Kundalini",
  description: "The seven stages of kundalini awakening — from earth to pure consciousness.",
  emoji: "🐍",
  totalNFTs: 7,
  totalSeasons: 1,
  artStyle: "Serpiente de energía luminosa ascendiendo por la columna vertebral, colores por chakra, fondo negro, rayos de luz y geometría sagrada emergiendo, arte místico digital",
  replicateModel: "stability-ai/sdxl",
  basePrompt: "kundalini serpent energy rising spine, chakra colors glowing, black background, rays of sacred light, mystic digital art, coiled serpent awakening, om domo nft, 1:1 ratio",
  colorPalette: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"],
  status: "upcoming",
  contractTokenIdRange: [124, 130],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 1, scheduledMonth: "2027-06", status: "upcoming",
      nfts: [
        {
          id: "kundalini-tierra", name: "Earth Awakening", nameEs: "Despertar Tierra",
          description: "Stage 1 — the coiled serpent stirs. Instinctual awakening, urge to transcend.",
          emoji: "🌍", rarityTier: "standard",
          attributes: { stage: 1, chakra: "Muladhara", color: "Rojo", state: "Dormida → Inquieta" },
          promptHints: ["coiled sleeping serpent red energy", "kundalini earth awakening base", "dormant snake beginning to stir", "red glowing base chakra serpent"],
        },
        {
          id: "kundalini-agua", name: "Water Awakening", nameEs: "Despertar Agua",
          description: "Stage 2 — energy rises to the sacral. Creativity and sexuality amplified.",
          emoji: "💧", rarityTier: "standard",
          attributes: { stage: 2, chakra: "Svadhisthana", color: "Naranja", state: "Ascendiendo" },
          promptHints: ["kundalini rising orange water sacral", "creative energy serpent ascending", "orange spiral energy rising", "sacral chakra serpent awakened"],
        },
        {
          id: "kundalini-fuego", name: "Fire Awakening", nameEs: "Despertar Fuego",
          description: "Stage 3 — the solar plexus ignites. Personal power unleashed, the fire burns.",
          emoji: "🔥", rarityTier: "rare",
          attributes: { stage: 3, chakra: "Manipura", color: "Amarillo", state: "Ardiendo" },
          promptHints: ["kundalini fire solar plexus yellow", "burning serpent power center", "yellow fire energy rising spine", "solar plexus kundalini fire"],
        },
        {
          id: "kundalini-corazon", name: "Heart Opening", nameEs: "Apertura del Corazón",
          description: "Stage 4 — the heart breaks open. Unconditional love floods the being.",
          emoji: "💚", rarityTier: "legendary",
          attributes: { stage: 4, chakra: "Anahata", color: "Verde", state: "Expansión" },
          promptHints: ["kundalini heart opening green love", "serpent reaching heart explosion", "green heart chakra kundalini burst", "love energy flooding heart serpent"],
        },
        {
          id: "kundalini-voz", name: "Voice Liberation", nameEs: "Liberación de la Voz",
          description: "Stage 5 — truth speaks itself. The throat opens to divine expression.",
          emoji: "🔵", rarityTier: "standard",
          attributes: { stage: 5, chakra: "Vishuddha", color: "Azul", state: "Expresión" },
          promptHints: ["kundalini throat blue liberation", "voice sound serpent awakening", "blue throat energy expression", "truth speaking kundalini blue"],
        },
        {
          id: "kundalini-tercer-ojo", name: "Third Eye Opening", nameEs: "Apertura del Tercer Ojo",
          description: "Stage 6 — the veil lifts. Psychic vision, past lives, cosmic understanding.",
          emoji: "🔮", rarityTier: "rare",
          attributes: { stage: 6, chakra: "Ajna", color: "Índigo", state: "Visión" },
          promptHints: ["kundalini third eye indigo opening", "psychic vision serpent eye", "indigo cosmic vision kundalini", "third eye activation serpent"],
        },
        {
          id: "kundalini-corona", name: "Crown Dissolution", nameEs: "Disolución en la Corona",
          description: "Stage 7 — Samadhi. Individual self dissolves into universal consciousness.",
          emoji: "👑", rarityTier: "legendary",
          attributes: { stage: 7, chakra: "Sahasrara", color: "Violeta/Blanco", state: "Samadhi" },
          promptHints: ["kundalini crown samadhi dissolution", "serpent reaching crown violet white", "ego dissolution crown chakra", "cosmic consciousness kundalini peak"],
        },
      ],
    },
  ],
};
