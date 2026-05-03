// Colección: MANTRAS & FRECUENCIAS — 9 NFTs, 2 temporadas
import type { Collection } from "./index";

export const MANTRAS_COLLECTION: Collection = {
  id: "mantras",
  name: "Mantras & Frequencies",
  nameEs: "Mantras & Frecuencias",
  description: "Sacred sounds and healing frequencies — the vibration that shapes reality.",
  emoji: "🎵",
  totalNFTs: 9,
  totalSeasons: 2,
  artStyle: "Visualización de onda de sonido, cimáticas (patrones formados por vibración), texto sánscrito luminoso, espectro de frecuencia visible, fondo negro, colores por frecuencia",
  replicateModel: "stability-ai/sdxl",
  basePrompt: "sound wave visualization cymatics pattern, glowing Sanskrit text, visible frequency spectrum, dark background, sacred mantra art, healing vibration pattern, om domo nft, 1:1 ratio",
  colorPalette: ["#9333EA", "#FFD700", "#00CED1", "#0A0A1E"],
  status: "upcoming",
  contractTokenIdRange: [140, 148],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 2, scheduledMonth: "2027-10", status: "upcoming",
      nfts: [
        { id: "mantra-om",         name: "OM",                    nameEs: "OM",                    description: "The primordial sound — the vibration of the universe before creation. 136.1 Hz.",         emoji: "🕉️", rarityTier: "legendary", attributes: { hz: 136.1,  tradition: "Universal",    language: "Sánscrito" }, promptHints: ["om aum sacred sound waves", "primordial vibration cymatics", "om symbol golden glow", "universe creation sound"] },
        { id: "mantra-so-hum",     name: "So Hum",                nameEs: "So Hum",                description: "'I am that' — the breath mantra, identity with universal consciousness.",                  emoji: "💫", rarityTier: "standard", attributes: { hz: 528,    tradition: "Vedanta",      language: "Sánscrito" }, promptHints: ["so hum breath mantra wave", "i am that consciousness cymatics", "inhale exhale sound visualization", "identity consciousness waves"] },
        { id: "mantra-om-mani",    name: "Om Mani Padme Hum",     nameEs: "Om Mani Padme Hum",     description: "Tibetan jewel mantra — compassion of all Buddhas condensed into six syllables.",          emoji: "💎", rarityTier: "rare",    attributes: { hz: 639,    tradition: "Budismo Tibetano", syllables: 6 }, promptHints: ["om mani padme hum tibetan mantra", "6 syllable compassion waves", "buddhist mantra cymatics gold", "tibetan sacred sound pattern"] },
        { id: "mantra-gayatri",    name: "Gayatri Mantra",        nameEs: "Gayatri",               description: "Mother of the Vedas — illumination mantra, awakens divine intelligence.",                 emoji: "☀️", rarityTier: "rare",    attributes: { hz: 852,    tradition: "Vedas",        words: 24 }, promptHints: ["gayatri mantra sun light waves", "veda mother sacred sound", "solar illumination mantra cymatics", "divine intelligence sound"] },
        { id: "mantra-om-namah",   name: "Om Namah Shivaya",      nameEs: "Om Namah Shivaya",      description: "Shiva's mantra — the five elements, transformation, surrender to the divine.",            emoji: "🌀", rarityTier: "standard", attributes: { hz: 741,    tradition: "Shaivismo",    syllables: 5 }, promptHints: ["om namah shivaya shiva mantra waves", "five elements sound visualization", "shiva transformation cymatics", "5 elements mantra pattern"] },
        { id: "mantra-lokah",      name: "Lokah Samastah",        nameEs: "Lokah Samastah",        description: "May all beings be free — the universal prayer of peace and liberation.",                  emoji: "🕊️", rarityTier: "standard", attributes: { hz: 432,    tradition: "Jainismo/Yoga", type: "Plegaria universal" }, promptHints: ["lokah samastah peace prayer waves", "all beings free universal sound", "peace liberation mantra cymatics", "world peace sound waves"] },
        { id: "mantra-maha-mrityunjaya", name: "Maha Mrityunjaya", nameEs: "Maha Mrityunjaya",    description: "The great death-conquering mantra — healing, protection, transcendence of death.",        emoji: "💀", rarityTier: "legendary", attributes: { hz: 528, tradition: "Shaivismo", type: "Sanación suprema" }, promptHints: ["maha mrityunjaya death conquering mantra", "healing protection sound waves", "shiva life death mantra cymatics", "transcendence death sound"] },
      ],
    },
    {
      seasonNumber: 2, totalSeasons: 2, scheduledMonth: "2028-03", status: "upcoming",
      nfts: [
        { id: "freq-528", name: "528 Hz — Love Frequency", nameEs: "528 Hz — Frecuencia del Amor", description: "The miracle tone — repairs DNA, associated with love and miracles.",                    emoji: "💚", rarityTier: "rare",    attributes: { hz: 528,  solfeggio: true, effect: "Reparación ADN" }, promptHints: ["528 hz frequency wave visualization", "love frequency solfeggio green", "DNA repair sound wave art", "miracle tone green cymatics"] },
        { id: "freq-432", name: "432 Hz — Universal Harmony", nameEs: "432 Hz — Armonía Universal", description: "Natural tuning — mathematically resonates with the universe, Schumann resonance.",     emoji: "🌍", rarityTier: "rare",    attributes: { hz: 432,  natural: true,   effect: "Armonía natural" }, promptHints: ["432 hz natural frequency harmony", "universal tuning sound waves", "schumann resonance earth frequency", "nature harmony sound art"] },
      ],
    },
  ],
};
