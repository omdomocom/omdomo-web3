// Colección: MUDRAS — 21 NFTs, 3 temporadas
import type { Collection } from "./index";

export const MUDRAS_COLLECTION: Collection = {
  id: "mudras",
  name: "Mudras",
  nameEs: "Mudras",
  description: "Sacred hand gestures — seals that direct the flow of prana in the body.",
  emoji: "🙏",
  totalNFTs: 21,
  totalSeasons: 3,
  artStyle: "Mano humana perfecta sobre fondo oscuro, luz suave lateral dorada, geometría sutil de energía emanando de los dedos, fotografía artística + digital",
  replicateModel: "black-forest-labs/flux-1.1-pro",
  basePrompt: "sacred mudra hand gesture, dark background, soft golden side lighting, subtle energy geometry from fingers, artistic photography digital art, spiritual healing hands, om domo nft, 1:1 ratio",
  colorPalette: ["#FFD700", "#F5DEB3", "#1A1A2E", "#9333EA"],
  status: "upcoming",
  contractTokenIdRange: [89, 109],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 3, scheduledMonth: "2027-02", status: "upcoming",
      nfts: [
        { id: "mudra-gyan",    name: "Gyan Mudra",    nameEs: "Mudra del Conocimiento", description: "Knowledge — index finger to thumb. Increases wisdom and concentration.", emoji: "🤏", rarityTier: "standard", attributes: { element: "Aire", benefit: "Sabiduría", fingers: "Índice + Pulgar" }, promptHints: ["gyan mudra index thumb touching", "knowledge mudra meditation hand", "consciousness mudra gesture", "ok sign spiritual mudra"] },
        { id: "mudra-chin",    name: "Chin Mudra",    nameEs: "Mudra de la Conciencia", description: "Consciousness — palms up, thumb to index. Receptivity to universal energy.", emoji: "☝️", rarityTier: "standard", attributes: { element: "Éter", benefit: "Receptividad", fingers: "Índice + Pulgar palma arriba" }, promptHints: ["chin mudra palms up meditation", "consciousness gesture hands open", "receptive mudra upward palms", "chin mudra energy receiving"] },
        { id: "mudra-dhyana",  name: "Dhyana Mudra",  nameEs: "Mudra de la Meditación", description: "Meditation — bowl of the hands, thumbs touching. The gesture of deep meditation.", emoji: "🧘", rarityTier: "rare",    attributes: { element: "Éter", benefit: "Meditación profunda", fingers: "Ambas manos en cuenco" }, promptHints: ["dhyana mudra both hands bowl", "meditation bowl gesture", "Buddha meditation hands", "contemplation mudra cupped hands"] },
        { id: "mudra-anjali",  name: "Anjali Mudra",  nameEs: "Namaste",                description: "Salutation — prayer hands at heart. 'The divine in me honors the divine in you'.", emoji: "🙏", rarityTier: "rare",    attributes: { element: "Fuego", benefit: "Gratitud", fingers: "Palmas juntas" }, promptHints: ["anjali namaste prayer hands together", "gratitude prayer gesture", "palms pressed together heart", "namaste sacred greeting"] },
        { id: "mudra-apana",   name: "Apana Mudra",   nameEs: "Mudra de la Purificación", description: "Purification — middle and ring fingers to thumb. Eliminates toxins.", emoji: "🌿", rarityTier: "standard", attributes: { element: "Tierra", benefit: "Purificación", fingers: "Medio + Anular + Pulgar" }, promptHints: ["apana mudra three fingers touching thumb", "purification detox mudra", "downward energy hand gesture", "apana vayu mudra"] },
        { id: "mudra-vayu",    name: "Vayu Mudra",    nameEs: "Mudra del Viento",       description: "Wind — index finger folded to thumb base. Reduces excess air in body.", emoji: "🌬️", rarityTier: "standard", attributes: { element: "Aire", benefit: "Equilibrio del Viento", fingers: "Índice doblado bajo pulgar" }, promptHints: ["vayu mudra index folded thumb", "wind element balance hand", "air reduction mudra gesture", "vayu wind mudra"] },
        { id: "mudra-shuni",   name: "Shuni Mudra",   nameEs: "Mudra de la Paciencia",  description: "Patience — middle finger to thumb. Purifies emotions, deepens intuition.", emoji: "⚡", rarityTier: "standard", attributes: { element: "Éter", benefit: "Paciencia e Intuición", fingers: "Medio + Pulgar" }, promptHints: ["shuni mudra middle finger thumb touching", "patience intuition gesture", "saturn mudra spiritual hand", "shuni purification mudra"] },
      ],
    },
    {
      seasonNumber: 2, totalSeasons: 3, scheduledMonth: "2027-09", status: "upcoming",
      nfts: [
        { id: "mudra-surya",   name: "Surya Mudra",   nameEs: "Mudra del Sol",   description: "Sun — ring finger to thumb. Increases solar energy, metabolism, vitality.", emoji: "☀️", rarityTier: "standard", attributes: { element: "Fuego", benefit: "Vitalidad Solar" }, promptHints: ["surya mudra ring finger thumb", "sun energy vitality hand", "solar fire mudra gesture", "surya sun mudra"] },
        { id: "mudra-buddhi",  name: "Buddhi Mudra",  nameEs: "Mudra de la Intuición", description: "Intuition — little finger to thumb. Enhances communication and intuition.", emoji: "💫", rarityTier: "standard", attributes: { element: "Agua", benefit: "Intuición" }, promptHints: ["buddhi mudra pinky thumb touching", "intuition communication hand", "mercury mudra gesture", "water element buddhi"] },
        { id: "mudra-prana",   name: "Prana Mudra",   nameEs: "Mudra de la Vida",  description: "Life force — ring and little fingers to thumb. Activates dormant energy.", emoji: "⚡", rarityTier: "rare",    attributes: { element: "Fuego", benefit: "Fuerza vital" }, promptHints: ["prana mudra two fingers thumb", "life force activation hand", "vitality awakening mudra", "prana energy mudra"] },
        { id: "mudra-mushti",  name: "Mushti Mudra",  nameEs: "Mudra del Puño",   description: "Fist — fingers curled, thumb over ring finger. Anger release, strength.", emoji: "✊", rarityTier: "standard", attributes: { element: "Fuego", benefit: "Fuerza y Liberación" }, promptHints: ["mushti fist mudra thumb over ring", "strength fist sacred gesture", "anger release power hand", "mushti power mudra"] },
        { id: "mudra-rudra",   name: "Rudra Mudra",   nameEs: "Mudra del Poder",  description: "Power — index and ring fingers to thumb. Increases personal power and confidence.", emoji: "💪", rarityTier: "standard", attributes: { element: "Tierra", benefit: "Poder Personal" }, promptHints: ["rudra mudra index ring thumb", "personal power confidence hand", "earth strengthening mudra", "rudra shiva mudra"] },
        { id: "mudra-hakini",  name: "Hakini Mudra",  nameEs: "Mudra del Cerebro", description: "Brain — fingertips of both hands touching. Enhances memory and intuition.", emoji: "🧠", rarityTier: "rare",    attributes: { element: "Éter", benefit: "Memoria e Intuición" }, promptHints: ["hakini mudra fingertips touching both hands", "brain power memory gesture", "both hands fingertip touching", "hakini intuition mudra"] },
        { id: "mudra-kali",    name: "Kali Mudra",    nameEs: "Mudra de Kali",    description: "Kali — interlaced fingers, index pointing down. Transformation through fire.", emoji: "🔥", rarityTier: "legendary", attributes: { element: "Fuego", benefit: "Transformación Radical" }, promptHints: ["kali mudra interlaced index pointing", "goddess kali hand transformation", "fierce transformation mudra", "kali power sacred gesture"] },
      ],
    },
    {
      seasonNumber: 3, totalSeasons: 3, scheduledMonth: "2028-02", status: "upcoming",
      nfts: [
        { id: "mudra-lotus",   name: "Padma Mudra",   nameEs: "Mudra del Loto",   description: "Lotus — hands open like a lotus flower. Purity, beauty emerging from mud.", emoji: "🪷", rarityTier: "rare",    attributes: { element: "Agua", benefit: "Pureza y Apertura" }, promptHints: ["padma lotus mudra hands open flower", "lotus blossom hand gesture", "open heart lotus hands", "flower opening mudra"] },
        { id: "mudra-garuda",  name: "Garuda Mudra",  nameEs: "Mudra del Águila", description: "Eagle — thumbs interlaced, hands spreading like wings. Freedom and vision.", emoji: "🦅", rarityTier: "standard", attributes: { element: "Aire", benefit: "Libertad y Visión" }, promptHints: ["garuda mudra thumbs interlaced wings", "eagle bird hand gesture", "wing spread mudra vision", "garuda eagle sacred"] },
        { id: "mudra-bhairava", name: "Bhairava Mudra", nameEs: "Mudra de Shiva", description: "Shiva-Shakti union — right hand over left, divine masculine-feminine union.", emoji: "☯️", rarityTier: "legendary", attributes: { element: "Éter", benefit: "Unión Divina" }, promptHints: ["bhairava mudra right over left hands", "shiva shakti union mudra", "masculine feminine divine hands", "cosmic union mudra"] },
        { id: "mudra-pushan",  name: "Pushan Mudra",  nameEs: "Mudra de la Nutrición", description: "Nourishment — digestion, intake and release of experiences.", emoji: "🌱", rarityTier: "standard", attributes: { element: "Tierra", benefit: "Nutrición" }, promptHints: ["pushan mudra nourishment digestion", "nutrient intake gesture hands", "digestion mudra different hands", "pushan food mudra"] },
        { id: "mudra-ushas",   name: "Ushas Mudra",   nameEs: "Mudra del Amanecer", description: "Dawn — interlaced fingers, thumbs side by side. Awakening, new beginnings.", emoji: "🌅", rarityTier: "standard", attributes: { element: "Fuego", benefit: "Nuevo Comienzo" }, promptHints: ["ushas mudra interlaced dawn awakening", "sunrise awakening hand gesture", "new beginning dawn mudra", "morning awakening ushas"] },
        { id: "mudra-mahasirs", name: "Mahasirs Mudra", nameEs: "Mudra de la Cabeza", "description": "Great head — relieves tension, clears mind. Ring finger in thumb's base.", emoji: "🧘", rarityTier: "standard", attributes: { element: "Éter", benefit: "Claridad Mental" }, promptHints: ["mahasirs mudra head clarity", "tension relief head gesture", "mental clarity hand mudra", "mahasirs great head"] },
        { id: "mudra-uttarabodhi", name: "Uttarabodhi Mudra", nameEs: "Mudra de la Iluminación", description: "Supreme enlightenment — index fingers and thumbs touching, others interlaced.", emoji: "💡", rarityTier: "legendary", attributes: { element: "Éter", benefit: "Iluminación" }, promptHints: ["uttarabodhi enlightenment mudra", "index thumbs diamond gesture", "supreme awakening hand mudra", "enlightenment diamond mudra"] },
      ],
    },
  ],
};
