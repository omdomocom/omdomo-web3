// Colección: YOGA ASANAS — 21 NFTs, 3 temporadas (7 por temporada)
import type { Collection } from "./index";

export const YOGA_COLLECTION: Collection = {
  id: "yoga",
  name: "Yoga Asanas",
  nameEs: "Yoga Asanas",
  description: "Sacred postures of the yogic tradition — from foundation to transcendence.",
  emoji: "🧘",
  totalNFTs: 21,
  totalSeasons: 3,
  artStyle: "Silueta humana dorada sobre fondo cósmico oscuro, energía luminosa fluyendo por el cuerpo, geometría sagrada sutil en el fondo",
  replicateModel: "black-forest-labs/flux-1.1-pro",
  basePrompt: "golden human silhouette in yoga pose, cosmic dark background, flowing energy light, sacred geometry, spiritual art, om domo nft collection, 1:1 ratio, high quality",
  colorPalette: ["#FFD700", "#9333EA", "#0891B2", "#1A1A2E"],
  status: "upcoming",
  contractTokenIdRange: [27, 47],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 3, scheduledMonth: "2026-08", status: "upcoming",
      nfts: [
        { id: "yoga-sukhasana",    name: "Sukhasana",    nameEs: "Postura Fácil",       description: "The easy seat — foundation of stillness and inner peace.",          emoji: "🪷", rarityTier: "standard", attributes: { level: "Básico", element: "Tierra",   chakra: "Muladhara",   sanskrit: "सुखासन" }, promptHints: ["cross-legged sitting pose", "serene meditation", "lotus position", "peaceful stillness"] },
        { id: "yoga-tadasana",     name: "Tadasana",     nameEs: "Postura de Montaña",  description: "Mountain pose — stillness with the power of a mountain.",           emoji: "⛰️", rarityTier: "standard", attributes: { level: "Básico", element: "Tierra",   chakra: "Muladhara",   sanskrit: "ताड़ासन"  }, promptHints: ["standing tall mountain pose", "feet together arms at sides", "grounded strength", "vertical power"] },
        { id: "yoga-balasana",     name: "Balasana",     nameEs: "Postura del Niño",    description: "Child's pose — surrender, rest, return to innocence.",             emoji: "🌱", rarityTier: "standard", attributes: { level: "Básico", element: "Agua",     chakra: "Anahata",     sanskrit: "बालासन"  }, promptHints: ["child pose kneeling forehead down", "resting surrender", "fetal position yoga", "humble bow"] },
        { id: "yoga-shavasana",    name: "Shavasana",    nameEs: "Postura del Cadáver", description: "Corpse pose — the ultimate surrender into pure being.",             emoji: "🌑", rarityTier: "rare",    attributes: { level: "Básico", element: "Éter",     chakra: "Sahasrara",   sanskrit: "शवासन"   }, promptHints: ["lying flat corpse pose", "total relaxation", "death rebirth pose", "cosmic surrender"] },
        { id: "yoga-warrior1",     name: "Virabhadrasana I", nameEs: "Guerrero I",      description: "Warrior I — courage, strength, divine will.",                      emoji: "⚔️", rarityTier: "standard", attributes: { level: "Básico", element: "Fuego",    chakra: "Manipura",    sanskrit: "वीरभद्रासन"}, promptHints: ["warrior one pose arms raised", "lunge front knee bent", "powerful stance arms up", "warrior energy"] },
        { id: "yoga-trikonasana",  name: "Trikonasana",  nameEs: "Postura del Triángulo","Triangle pose — balance between earth and sky, body and mind.",             emoji: "🔺", rarityTier: "standard", attributes: { level: "Básico", element: "Aire",     chakra: "Anahata",     sanskrit: "त्रिकोणासन"}, promptHints: ["triangle pose side stretch", "arms extended wide stance", "lateral bend triangle", "geometric yoga"] },
        { id: "yoga-adhomukha",    name: "Adho Mukha Svanasana", nameEs: "Perro Boca Abajo", "description": "Downward dog — inversion of perspective, renewal.",       emoji: "🐕", rarityTier: "standard", attributes: { level: "Básico", element: "Tierra",   chakra: "Vishuddha",   sanskrit: "अधोमुखश्वानासन"}, promptHints: ["downward facing dog yoga pose", "inverted V shape", "arms legs straight hips up", "dog pose"] },
      ],
    },
    {
      seasonNumber: 2, totalSeasons: 3, scheduledMonth: "2026-12", status: "upcoming",
      nfts: [
        { id: "yoga-warrior2",     name: "Virabhadrasana II", nameEs: "Guerrero II",   description: "Warrior II — focus, expansion, presence in battle.",               emoji: "🛡️", rarityTier: "standard", attributes: { level: "Intermedio", element: "Fuego", chakra: "Manipura",  sanskrit: "वीरभद्रासन" }, promptHints: ["warrior two pose arms extended", "wide stance lateral arms", "focused gaze warrior"] },
        { id: "yoga-vrikshasana",  name: "Vrikshasana",  nameEs: "Postura del Árbol",  description: "Tree pose — rootedness and upward growth simultaneously.",          emoji: "🌳", rarityTier: "standard", attributes: { level: "Intermedio", element: "Tierra", chakra: "Muladhara", sanskrit: "वृक्षासन" }, promptHints: ["tree pose one leg balance", "foot on inner thigh", "arms raised above head", "rooted balance"] },
        { id: "yoga-sethubandha",  name: "Setu Bandha",  nameEs: "Postura del Puente", description: "Bridge pose — opening the heart, connecting earth and sky.",        emoji: "🌉", rarityTier: "standard", attributes: { level: "Intermedio", element: "Aire",   chakra: "Anahata",   sanskrit: "सेतुबंधासन"}, promptHints: ["bridge pose hips lifted", "lying back knees bent hips up", "backbend bridge", "heart opener"] },
        { id: "yoga-navasana",     name: "Navasana",     nameEs: "Postura del Bote",   description: "Boat pose — core strength, willpower, navigating life's currents.", emoji: "⛵", rarityTier: "standard", attributes: { level: "Intermedio", element: "Fuego",  chakra: "Manipura",  sanskrit: "नावासन"  }, promptHints: ["boat pose v-shape body", "legs arms raised balancing", "core strength boat", "V balance yoga"] },
        { id: "yoga-ustrasana",    name: "Ustrasana",    nameEs: "Postura del Camello", "description": "Camel pose — deep heart opening, vulnerability as strength.",    emoji: "🐪", rarityTier: "standard", attributes: { level: "Intermedio", element: "Fuego",  chakra: "Anahata",   sanskrit: "उष्ट्रासन"}, promptHints: ["camel pose deep backbend kneeling", "hands to heels", "chest open sky", "heart opening camel"] },
        { id: "yoga-bakasana",     name: "Bakasana",     nameEs: "Postura del Cuervo",  description: "Crow pose — arm balance, lightness of being, fearlessness.",       emoji: "🐦", rarityTier: "rare",    attributes: { level: "Intermedio", element: "Aire",   chakra: "Vishuddha", sanskrit: "बकासन"   }, promptHints: ["crow pose arm balance", "knees on upper arms lifting", "arm balance bird pose", "fearless balance"] },
        { id: "yoga-ardha-chandrasana", name: "Ardha Chandrasana", nameEs: "Media Luna","description": "Half moon — lunar balance, grace and radiance.",               emoji: "🌙", rarityTier: "standard", attributes: { level: "Intermedio", element: "Agua",   chakra: "Svadhisthana", sanskrit: "अर्धचंद्रासन"}, promptHints: ["half moon pose one leg up", "lateral balance standing", "moon pose yoga", "crescent balance"] },
      ],
    },
    {
      seasonNumber: 3, totalSeasons: 3, scheduledMonth: "2027-03", status: "upcoming",
      nfts: [
        { id: "yoga-sirsasana",    name: "Sirsasana",    nameEs: "Parada de Cabeza",   description: "Headstand — the king of asanas, world turned upside down.",         emoji: "👑", rarityTier: "legendary", attributes: { level: "Avanzado", element: "Éter",   chakra: "Sahasrara", sanskrit: "शीर्षासन" }, promptHints: ["headstand yoga king asana", "inverted upside down", "crown on floor legs up", "royal inversion"] },
        { id: "yoga-adho-vrksasana", name: "Adho Vrksasana", nameEs: "Parada de Manos","description": "Handstand — perfect balance of strength and surrender.",          emoji: "🤸", rarityTier: "rare",    attributes: { level: "Avanzado", element: "Aire",   chakra: "Vishuddha", sanskrit: "अधोवृक्षासन"}, promptHints: ["handstand yoga balance", "hands on floor legs straight up", "inverted handstand", "aerial balance"] },
        { id: "yoga-padmasana",    name: "Padmasana",    nameEs: "Loto",               description: "Lotus — the supreme meditative posture, blooming from the depths.",  emoji: "🪷", rarityTier: "rare",    attributes: { level: "Avanzado", element: "Agua",   chakra: "Sahasrara", sanskrit: "पद्मासन"  }, promptHints: ["full lotus pose cross-legged", "feet on thighs", "lotus flower meditation", "padmasana sacred"] },
        { id: "yoga-raja-kapotasana", name: "Raja Kapotasana", nameEs: "Rey Paloma",   description: "King pigeon — the deepest backbend, crown touched by foot.",        emoji: "🕊️", rarityTier: "rare",    attributes: { level: "Avanzado", element: "Fuego",  chakra: "Anahata",   sanskrit: "राजकपोतासन"}, promptHints: ["king pigeon deep backbend", "foot touching head", "extreme back arch", "pigeon king pose"] },
        { id: "yoga-vrischikasana", name: "Vrischikasana", nameEs: "Escorpión",        description: "Scorpion pose — the apex of arm balances, sting of transformation.", emoji: "🦂", rarityTier: "legendary", attributes: { level: "Avanzado", element: "Agua",   chakra: "Manipura", sanskrit: "वृश्चिकासन"}, promptHints: ["scorpion pose forearm balance", "legs curved over head", "scorpion yoga extreme", "forearm backbend"] },
        { id: "yoga-tittibhasana", name: "Tittibhasana", nameEs: "Luciérnaga",        description: "Firefly pose — luminous arm balance, flight of pure awareness.",     emoji: "✨", rarityTier: "rare",    attributes: { level: "Avanzado", element: "Fuego",  chakra: "Manipura",  sanskrit: "तित्तिभासन"}, promptHints: ["firefly pose arm balance", "legs extended arms", "floating horizontal yoga", "firefly balance"] },
        { id: "yoga-urdhva-dhanurasana", name: "Urdhva Dhanurasana", nameEs: "Rueda",  description: "Wheel pose — full circle of life, heart wide open to the sky.",     emoji: "⭕", rarityTier: "standard", attributes: { level: "Avanzado", element: "Fuego",  chakra: "Anahata",   sanskrit: "ऊर्ध्वधनुरासन"}, promptHints: ["wheel pose full backbend", "arch body hands feet on floor", "circle backbend yoga", "wheel of life"] },
      ],
    },
  ],
};
