// Colección: ELEMENTOS SAGRADOS — 5 NFTs, 1 temporada
import type { Collection } from "./index";

export const ELEMENTS_COLLECTION: Collection = {
  id: "elements",
  name: "Sacred Elements",
  nameEs: "Elementos Sagrados",
  description: "The five primordial elements — the building blocks of all existence.",
  emoji: "🌊",
  totalNFTs: 5,
  totalSeasons: 1,
  artStyle: "Elemento en movimiento dinámico, partículas de energía visibles, fondo oscuro, paleta de color intensa y saturada por elemento, arte generativo digital",
  replicateModel: "stability-ai/sdxl",
  basePrompt: "primordial element in dynamic motion, visible energy particles, dark background, intense saturated colors, generative digital art, spiritual sacred element, om domo nft, 1:1 ratio",
  colorPalette: ["#8B4513", "#1E90FF", "#FF4500", "#87CEEB", "#9333EA"],
  status: "upcoming",
  contractTokenIdRange: [84, 88],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 1, scheduledMonth: "2027-01", status: "upcoming",
      nfts: [
        {
          id: "elemento-tierra", name: "Earth", nameEs: "Tierra",
          description: "Prithvi — foundation, stability, nourishment. The element that grounds all life.",
          emoji: "🌍", rarityTier: "standard",
          attributes: { sanskrit: "Prithvi", sense: "Olfato", chakra: "Muladhara", direction: "Norte", platonic: "Cubo", quality: "Sólido" },
          promptHints: ["earth element sacred", "brown golden soil rocks crystals", "stable ground foundation", "prithvi earth sacred geometry cube", "earth particles ground energy"],
        },
        {
          id: "elemento-agua", name: "Water", nameEs: "Agua",
          description: "Apas — flow, emotion, adaptability. The element that connects all living beings.",
          emoji: "💧", rarityTier: "standard",
          attributes: { sanskrit: "Apas", sense: "Gusto", chakra: "Svadhisthana", direction: "Oeste", platonic: "Icosaedro", quality: "Líquido" },
          promptHints: ["water element sacred fluid", "deep blue flowing waves", "fluid adaptable water energy", "apas water sacred geometry icosahedron", "droplet ocean flow"],
        },
        {
          id: "elemento-fuego", name: "Fire", nameEs: "Fuego",
          description: "Agni — transformation, will, purification. The sacred flame that burns away illusion.",
          emoji: "🔥", rarityTier: "rare",
          attributes: { sanskrit: "Agni", sense: "Vista", chakra: "Manipura", direction: "Sur", platonic: "Tetraedro", quality: "Transformador" },
          promptHints: ["fire element sacred flames", "orange red golden fire energy", "transformative purifying flames", "agni fire sacred geometry tetrahedron", "plasma fire sacred"],
        },
        {
          id: "elemento-aire", name: "Air", nameEs: "Aire",
          description: "Vayu — movement, breath, freedom. The invisible force that connects heaven and earth.",
          emoji: "🌬️", rarityTier: "standard",
          attributes: { sanskrit: "Vayu", sense: "Tacto", chakra: "Anahata", direction: "Este", platonic: "Octaedro", quality: "Gaseoso" },
          promptHints: ["air element sacred wind", "cyan white wind energy swirls", "invisible breath movement force", "vayu air sacred geometry octahedron", "wind currents energy"],
        },
        {
          id: "elemento-eter", name: "Ether", nameEs: "Éter",
          description: "Akasha — space, consciousness, the fifth element that holds all others. The rarest.",
          emoji: "✨", rarityTier: "legendary",
          attributes: { sanskrit: "Akasha", sense: "Oído", chakra: "Vishuddha", direction: "Centro", platonic: "Dodecaedro", quality: "Omnipresente" },
          promptHints: ["ether akasha fifth element sacred", "violet purple cosmic space", "consciousness void element", "akasha sacred geometry dodecahedron", "cosmic ether starfield"],
        },
      ],
    },
  ],
};
