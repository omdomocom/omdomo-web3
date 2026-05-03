// Colección: PRANAYAMA — 14 NFTs, 2 temporadas
import type { Collection } from "./index";

export const PRANAYAMA_COLLECTION: Collection = {
  id: "pranayama",
  name: "Pranayama",
  nameEs: "Pranayama",
  description: "The science of breath — 14 techniques that master the life force itself.",
  emoji: "🌬️",
  totalNFTs: 14,
  totalSeasons: 2,
  artStyle: "Visualización abstracta de la respiración, ondas de sonido y energía visibles, colores cian y blanco sobre negro profundo, arte generativo cinético",
  replicateModel: "stability-ai/sdxl",
  basePrompt: "breath visualization abstract art, sound waves energy visible, cyan white colors dark background, kinetic generative art, life force prana, spiritual breathing technique, om domo nft, 1:1 ratio",
  colorPalette: ["#00CED1", "#FFFFFF", "#9333EA", "#0A0A1E"],
  status: "upcoming",
  contractTokenIdRange: [110, 123],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 2, scheduledMonth: "2027-06", status: "upcoming",
      nfts: [
        { id: "prana-nadi-shodhana", name: "Nadi Shodhana", nameEs: "Respiración Alternada", description: "Alternate nostril breathing — purifies 72,000 nadis. Perfect balance of masculine and feminine.", emoji: "☯️", rarityTier: "rare", attributes: { rhythm: "4-4-4-4", type: "Equilibrio", effect: "Purificación nadis", tradition: "Hatha Yoga" }, promptHints: ["alternate nostril breathing visualization", "left right energy channels nadi", "dual spiral breath channels", "balanced yin yang breath waves"] },
        { id: "prana-kapalabhati", name: "Kapalabhati", nameEs: "Respiración del Cráneo", description: "Skull shining breath — rapid forceful exhales, passive inhales. Cleanses the mind.", emoji: "💨", rarityTier: "standard", attributes: { rhythm: "Explosivo", type: "Limpieza", effect: "Claridad mental", tradition: "Hatha Yoga" }, promptHints: ["kapalabhati forceful exhale visualization", "rapid burst breath waves", "skull cleansing energy pulses", "staccato breath energy"] },
        { id: "prana-ujjayi", name: "Ujjayi", nameEs: "Respiración Victoriosa", description: "Ocean breath — constricted throat creates ocean sound. Used in Ashtanga yoga.", emoji: "🌊", rarityTier: "standard", attributes: { rhythm: "Lento y controlado", type: "Calor interno", effect: "Focus y calor", tradition: "Ashtanga" }, promptHints: ["ujjayi ocean breath visualization", "constricted throat ocean sound waves", "victorious breath rolling waves", "ocean sound breath energy"] },
        { id: "prana-bhramari", name: "Bhramari", nameEs: "Respiración de la Abeja", description: "Bee breath — humming exhale, vibrates the entire skull. Instant calm.", emoji: "🐝", rarityTier: "standard", attributes: { rhythm: "Humming", type: "Vibración", effect: "Calmante inmediato", tradition: "Hatha Yoga" }, promptHints: ["bhramari bee humming breath", "vibration skull resonance waves", "bee sound frequency visualization", "humming breath sound waves"] },
        { id: "prana-sitali", name: "Sitali", nameEs: "Respiración Refrescante", description: "Cooling breath — inhale through curled tongue. Reduces body heat and anger.", emoji: "❄️", rarityTier: "standard", attributes: { rhythm: "Lento", type: "Enfriamiento", effect: "Reduce calor y enojo", tradition: "Hatha Yoga" }, promptHints: ["sitali cooling breath blue ice", "cold refreshing breath waves", "cooling blue energy visualization", "tongue curl breath cooling"] },
        { id: "prana-sitkari", name: "Sitkari", nameEs: "Respiración Silbante", description: "Hissing breath — inhale through teeth. Similar to Sitali but accessible to all.", emoji: "💨", rarityTier: "standard", attributes: { rhythm: "Agudo", type: "Enfriamiento", effect: "Reduce temperatura", tradition: "Hatha Yoga" }, promptHints: ["sitkari hissing breath silver", "teeth breath visualization", "hissing sound wave art", "cool silver breath waves"] },
        { id: "prana-bhastrika", name: "Bhastrika", nameEs: "Respiración del Fuelle", description: "Bellows breath — rapid equal inhales and exhales. Awakens kundalini fire.", emoji: "🔥", rarityTier: "legendary", attributes: { rhythm: "Rápido e igual", type: "Activación", effect: "Despierta kundalini", tradition: "Hatha Yoga" }, promptHints: ["bhastrika bellows breath fire", "rapid equal breath fire visualization", "kundalini fire awakening breath", "bellows forge fire waves"] },
      ],
    },
    {
      seasonNumber: 2, totalSeasons: 2, scheduledMonth: "2027-11", status: "upcoming",
      nfts: [
        { id: "prana-box", name: "Box Breathing", nameEs: "Respiración Cuadrada", description: "4-4-4-4 — equal parts inhale, hold, exhale, hold. Navy SEALs technique.", emoji: "⬛", rarityTier: "standard", attributes: { rhythm: "4-4-4-4", type: "Equilibrio", effect: "Control del estrés", tradition: "Moderno" }, promptHints: ["box breathing square visualization", "4 sides equal breath cycle", "geometric square breath pattern", "box breath calm waves"] },
        { id: "prana-478", name: "4-7-8 Breathing", nameEs: "Respiración 4-7-8", description: "Dr. Weil's technique — natural tranquilizer, activates parasympathetic response.", emoji: "😴", rarityTier: "standard", attributes: { rhythm: "4-7-8", type: "Relajación", effect: "Sueño profundo", tradition: "Moderno" }, promptHints: ["4-7-8 breathing wave cycles", "sleep relaxation breath visualization", "parasympathetic wave pattern", "calming breath pattern art"] },
        { id: "prana-wim-hof", name: "Wim Hof Method", nameEs: "Método Wim Hof", description: "30 deep breaths + retention. Accesses the autonomic nervous system voluntarily.", emoji: "🧊", rarityTier: "rare", attributes: { rhythm: "30x + retención", type: "Extremo", effect: "Sistema autónomo", tradition: "Moderno" }, promptHints: ["wim hof method ice breath", "extreme breath cycle visualization", "cold exposure breath power", "autonomic nervous breath waves"] },
        { id: "prana-tummo", name: "Tummo", nameEs: "Fuego Interior Tibetano", description: "Tibetan inner fire — generates intense body heat through visualization and breath.", emoji: "🔥", rarityTier: "legendary", attributes: { rhythm: "Vase breathing", type: "Calor extremo", effect: "Fuego interno", tradition: "Vajrayana" }, promptHints: ["tummo tibetan inner fire breath", "heat generating visualization", "inner fire belly breath", "tibetan warmth fire visualization"] },
        { id: "prana-kumbhaka", name: "Kumbhaka", nameEs: "Retención del Aliento", description: "Breath retention — the still point between inhale and exhale, peak of prana.", emoji: "⏸️", rarityTier: "rare", attributes: { rhythm: "Retención pura", type: "Retención", effect: "Acumulación de prana", tradition: "Hatha Yoga" }, promptHints: ["kumbhaka breath retention still", "pause breath stillness visualization", "held breath energy accumulation", "retention peak prana"] },
        { id: "prana-mula-bandha", name: "Mula Bandha", nameEs: "Cierre Raíz", description: "Root lock — contraction of the pelvic floor, seals prana at the base.", emoji: "🔒", rarityTier: "standard", attributes: { rhythm: "Contracción", type: "Bandha", effect: "Retiene prana", tradition: "Hatha Yoga" }, promptHints: ["mula bandha root lock energy", "pelvic floor contraction visualization", "energy seal root chakra", "bandha lock prana seal"] },
        { id: "prana-agni-sara", name: "Agni Sara", nameEs: "Lavado de Fuego", description: "Fire wash — rapid abdominal pumping with empty lungs. Stokes the digestive fire.", emoji: "🌊", rarityTier: "standard", attributes: { rhythm: "Ondulación abdominal", type: "Purificación", effect: "Fuego digestivo", tradition: "Hatha Yoga" }, promptHints: ["agni sara fire wash abdominal", "belly pumping fire visualization", "digestive fire activation waves", "abdominal pump fire waves"] },
      ],
    },
  ],
};
