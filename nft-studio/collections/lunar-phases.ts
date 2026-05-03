// Colección: FASES LUNARES — 8 NFTs, 1 temporada
import type { Collection } from "./index";

export const LUNAR_PHASES_COLLECTION: Collection = {
  id: "lunar-phases",
  name: "Lunar Phases",
  nameEs: "Fases Lunares",
  description: "The eight faces of the moon — cycles of birth, growth, fullness and release.",
  emoji: "🌙",
  totalNFTs: 8,
  totalSeasons: 1,
  artStyle: "Luna ultrarrealista sobre cielo nocturno profundo, constelaciones visibles, reflejos en agua oscura, arte fotorrealista + pintura digital",
  replicateModel: "black-forest-labs/flux-1.1-pro",
  basePrompt: "ultra realistic moon phase, deep night sky, visible stars constellations, reflection in dark water, photorealistic digital painting, om domo spiritual nft, 1:1 ratio",
  colorPalette: ["#E8D5A3", "#1A1A2E", "#C0C0C0", "#4B0082"],
  status: "upcoming",
  contractTokenIdRange: [76, 83],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 1, scheduledMonth: "2026-10", status: "upcoming",
      nfts: [
        { id: "luna-nueva",       name: "New Moon",           nameEs: "Luna Nueva",          description: "New beginnings — the invisible moon, infinite potential in darkness.", emoji: "🌑", rarityTier: "rare",    attributes: { illumination: "0%",   energy: "Intención",  cycle: "Inicio",     day: 0  }, promptHints: ["new moon invisible dark sky", "total darkness night sky", "zero illumination moon", "new beginning potential"] },
        { id: "luna-creciente",   name: "Waxing Crescent",    nameEs: "Luna Creciente",      description: "Setting intentions — the first sliver of light returns.",             emoji: "🌒", rarityTier: "standard", attributes: { illumination: "25%",  energy: "Deseo",      cycle: "Creciente",  day: 3  }, promptHints: ["waxing crescent moon slim sliver", "thin crescent dark sky", "moon growing light", "intention crescent moon"] },
        { id: "luna-cuarto-creciente", name: "First Quarter", nameEs: "Cuarto Creciente",   description: "Taking action — the moon challenges us to act on our intentions.",     emoji: "🌓", rarityTier: "standard", attributes: { illumination: "50%",  energy: "Acción",     cycle: "Creciente",  day: 7  }, promptHints: ["first quarter half moon right side lit", "decision action moon", "half illuminated growing moon", "quarter moon precise"] },
        { id: "luna-gibosa-creciente", name: "Waxing Gibbous", nameEs: "Gibosa Creciente", description: "Refinement — almost full, refining and perfecting what we've built.",  emoji: "🌔", rarityTier: "standard", attributes: { illumination: "75%",  energy: "Refinamiento", cycle: "Creciente", day: 10 }, promptHints: ["waxing gibbous moon almost full", "three quarter lit moon", "nearly full bright moon", "refinement moon"] },
        { id: "luna-llena",       name: "Full Moon",          nameEs: "Luna Llena",          description: "Peak energy — full illumination, manifestation, emotional peak.", emoji: "🌕", rarityTier: "legendary", attributes: { illumination: "100%", energy: "Manifestación", cycle: "Plenitud",  day: 14 }, promptHints: ["full moon 100% illuminated", "bright large full moon night", "complete circle moon glow", "full moon reflection water"] },
        { id: "luna-gibosa-menguante", name: "Waning Gibbous", nameEs: "Gibosa Menguante", description: "Gratitude — sharing wisdom, expressing thanks for what was received.", emoji: "🌖", rarityTier: "standard", attributes: { illumination: "75%",  energy: "Gratitud",   cycle: "Menguante",  day: 17 }, promptHints: ["waning gibbous moon decreasing", "three quarter lit fading moon", "grateful release moon", "sharing wisdom moon"] },
        { id: "luna-cuarto-menguante", name: "Last Quarter",  nameEs: "Cuarto Menguante",   description: "Release — letting go of what no longer serves our growth.",           emoji: "🌗", rarityTier: "standard", attributes: { illumination: "50%",  energy: "Liberación", cycle: "Menguante",  day: 21 }, promptHints: ["last quarter half moon left side lit", "release letting go moon", "half dark fading moon", "third quarter moon"] },
        { id: "luna-creciente-menguante", name: "Waning Crescent", nameEs: "Creciente Menguante", "description": "Surrender — the final sliver, surrendering to the dark, rest.", emoji: "🌘", rarityTier: "rare",    attributes: { illumination: "10%",  energy: "Rendición",  cycle: "Menguante",  day: 26 }, promptHints: ["waning crescent thin sliver left", "almost dark surrendering moon", "last light crescent moon", "surrender darkness moon"] },
      ],
    },
  ],
};
