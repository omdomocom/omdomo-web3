// Colección: GEOMETRÍA SAGRADA — 9 NFTs, 2 temporadas
import type { Collection } from "./index";

export const SACRED_GEOMETRY_COLLECTION: Collection = {
  id: "sacred-geometry",
  name: "Sacred Geometry",
  nameEs: "Geometría Sagrada",
  description: "The mathematical language of creation — patterns that underlie all of existence.",
  emoji: "🌀",
  totalNFTs: 9,
  totalSeasons: 2,
  artStyle: "Geometría perfecta matemáticamente, oro metálico brillante sobre negro profundo, líneas precisas con reflejos de luz, estilo técnico-espiritual",
  replicateModel: "stability-ai/sdxl",
  basePrompt: "perfect sacred geometry mathematical, metallic gold on deep black background, precise light-reflecting lines, technical spiritual art, divine mathematics, om domo nft, 1:1 ratio",
  colorPalette: ["#FFD700", "#C0A000", "#1A1A1A", "#FFFFFF"],
  status: "upcoming",
  contractTokenIdRange: [131, 139],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 2, scheduledMonth: "2027-07", status: "upcoming",
      nfts: [
        { id: "geo-flor-de-la-vida", name: "Flower of Life", nameEs: "Flor de la Vida", description: "The most ancient symbol — 19 overlapping circles containing all patterns of existence.", emoji: "🌸", rarityTier: "rare", attributes: { circles: 19, origin: "Egipto 10,000 AC", contains: "Todos los patrones" }, promptHints: ["flower of life overlapping circles gold", "19 circles sacred geometry pattern", "ancient egypt sacred symbol", "flower life golden blueprint"] },
        { id: "geo-arbol-de-la-vida", name: "Tree of Life", nameEs: "Árbol de la Vida", description: "Kabbalah's map — 10 sefirot connected by 22 paths, mapping creation itself.", emoji: "🌳", rarityTier: "rare", attributes: { sefirot: 10, paths: 22, tradition: "Kabbalah" }, promptHints: ["tree of life kabbalah sefirot gold", "10 nodes 22 paths sacred geometry", "kabbalah tree diagram gold", "sephirot cosmic tree"] },
        { id: "geo-metatron", name: "Metatron's Cube", nameEs: "Cubo de Metatrón", description: "Contains all Platonic solids — the architect's blueprint of the universe.", emoji: "⬡", rarityTier: "legendary", attributes: { contains: "5 sólidos platónicos", circles: 13, tradition: "Angelología" }, promptHints: ["metatron cube sacred geometry gold", "13 circles all platonic solids", "archangel metatron blueprint", "complex sacred geometry cube"] },
        { id: "geo-tetraedro", name: "Tetrahedron", nameEs: "Tetraedro", description: "Fire Platonic solid — 4 triangular faces, the simplest 3D sacred form.", emoji: "🔺", rarityTier: "standard", attributes: { faces: 4, element: "Fuego", solid: "Platónico I" }, promptHints: ["tetrahedron sacred geometry gold", "4 triangular faces platonic solid", "fire element 3d geometry", "tetrahedron floating gold"] },
        { id: "geo-cubo", name: "Hexahedron (Cube)", nameEs: "Cubo Sagrado", description: "Earth Platonic solid — 6 faces of perfect squares, stability and matter.", emoji: "⬛", rarityTier: "standard", attributes: { faces: 6, element: "Tierra", solid: "Platónico II" }, promptHints: ["sacred cube hexahedron gold geometry", "6 square faces platonic solid earth", "perfect cube sacred art", "cube earth element geometry"] },
        { id: "geo-toroide", name: "Torus", nameEs: "Toroide", description: "The shape of energy fields — all living systems express toroidal flow.", emoji: "⭕", rarityTier: "rare", attributes: { type: "Campo energético", found_in: "Corazón, tierra, sol, galaxias" }, promptHints: ["torus energy field sacred geometry", "donut shape energy flow lines", "toroidal field gold lines", "torus field pattern black"] },
        { id: "geo-sri-yantra", name: "Sri Yantra", nameEs: "Sri Yantra", description: "The mother of all yantras — 9 interlocking triangles forming 43 sub-triangles.", emoji: "🔯", rarityTier: "legendary", attributes: { triangles: 9, sub_triangles: 43, tradition: "Tantra" }, promptHints: ["sri yantra sacred geometry gold", "9 interlocking triangles mandala", "tantra yantra ancient symbol", "sri yantra complex pattern"] },
      ],
    },
    {
      seasonNumber: 2, totalSeasons: 2, scheduledMonth: "2028-01", status: "upcoming",
      nfts: [
        { id: "geo-fibonacci", name: "Fibonacci Spiral", nameEs: "Espiral de Fibonacci", description: "The golden ratio in motion — 1,1,2,3,5,8,13... the pattern of life itself.", emoji: "🐚", rarityTier: "rare", attributes: { ratio: "φ = 1.618033...", found_in: "Conchas, galaxias, flores, ADN" }, promptHints: ["fibonacci spiral golden ratio sacred", "nautilus shell spiral pattern gold", "phi golden ratio geometry spiral", "fibonacci nature spiral art"] },
        { id: "geo-vesica-piscis", name: "Vesica Piscis", nameEs: "Vesica Piscis", description: "Two circles intersecting — the womb of creation, source of all sacred geometry.", emoji: "👁️", rarityTier: "rare", attributes: { tradition: "Universal", ratio: "√3 : 1", origin: "Origen de toda geometría" }, promptHints: ["vesica piscis two circles sacred", "almond shape intersection gold", "womb creation geometry circles", "vesica piscis sacred origin"] },
      ],
    },
  ],
};
