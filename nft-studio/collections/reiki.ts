// Colección: REIKI — 28 NFTs, 4 temporadas (7 por temporada)
import type { Collection } from "./index";

export const REIKI_COLLECTION: Collection = {
  id: "reiki",
  name: "Reiki Symbols",
  nameEs: "Símbolos Reiki",
  description: "Sacred Reiki symbols — channels of universal life force energy.",
  emoji: "🌿",
  totalNFTs: 28,
  totalSeasons: 4,
  artStyle: "Símbolo sagrado luminoso sobre fondo negro profundo, trazo de luz dorada/blanca, aura de energía púrpura irradiando, estilo caligráfico espiritual",
  replicateModel: "stability-ai/sdxl",
  basePrompt: "sacred reiki symbol glowing light, dark background, golden white light strokes, purple energy aura, spiritual calligraphy art, healing energy, om domo nft, 1:1 ratio",
  colorPalette: ["#FFD700", "#FFFFFF", "#9333EA", "#0A0A0F"],
  status: "upcoming",
  contractTokenIdRange: [48, 75],
  seasons: [
    {
      seasonNumber: 1, totalSeasons: 4, scheduledMonth: "2026-11", status: "upcoming",
      nfts: [
        { id: "reiki-cho-ku-rei",    name: "Cho Ku Rei",    nameEs: "Cho Ku Rei",    description: "Power symbol — amplifies energy, activates all other symbols. 'Place the power of the universe here'.", emoji: "⚡", rarityTier: "rare",    attributes: { tradition: "Usui", type: "Poder",      level: "Primero"  }, promptHints: ["cho ku rei reiki power symbol", "spiral coil clockwise", "energy amplifier glyph", "universal power symbol"] },
        { id: "reiki-sei-he-ki",     name: "Sei He Ki",     nameEs: "Sei He Ki",     description: "Mental/emotional symbol — harmonizes mind and emotions, releases trauma.",                            emoji: "🧠", rarityTier: "standard", attributes: { tradition: "Usui", type: "Mental",     level: "Segundo"  }, promptHints: ["sei he ki reiki mental symbol", "wave mountain glyph", "emotional healing symbol", "mental harmony reiki"] },
        { id: "reiki-hon-sha",       name: "Hon Sha Ze Sho Nen", nameEs: "Hon Sha Ze Sho Nen", description: "Distance healing symbol — transcends time and space. 'The Buddha in me contacts the Buddha in you'.", emoji: "🌐", rarityTier: "legendary", attributes: { tradition: "Usui", type: "Distancia", level: "Segundo"  }, promptHints: ["hon sha ze sho nen distance symbol", "pagoda tower glyph", "space time transcendence reiki", "distance healing"] },
        { id: "reiki-dai-ko-myo",    name: "Dai Ko Myo",    nameEs: "Dai Ko Myo",    description: "Master symbol — highest vibration, soul healing, enlightenment.",                                    emoji: "☀️", rarityTier: "legendary", attributes: { tradition: "Usui", type: "Maestro",   level: "Maestro"  }, promptHints: ["dai ko myo reiki master symbol", "sun burst sacred glyph", "enlightenment master symbol", "highest vibration"] },
        { id: "reiki-raku",          name: "Raku",           nameEs: "Raku",          description: "Grounding symbol — seals attunements, grounds the energy into Earth.",                               emoji: "⚡", rarityTier: "standard", attributes: { tradition: "Usui", type: "Tierra",    level: "Maestro"  }, promptHints: ["raku reiki lightning bolt symbol", "zigzag lightning glyph", "grounding energy seal", "attunement symbol"] },
        { id: "reiki-zonar",         name: "Zonar",          nameEs: "Zonar",         description: "Karmic healing — works on karmic patterns, past life issues.",                                        emoji: "♾️", rarityTier: "standard", attributes: { tradition: "Karuna", type: "Karma",    level: "Karuna I" }, promptHints: ["zonar karuna reiki symbol", "infinity loop Z glyph", "karmic healing symbol", "past life reiki"] },
        { id: "reiki-halu",          name: "Halu",           nameEs: "Halu",          description: "Deep healing — restores balance, works on unconscious patterns and past life trauma.",               emoji: "🌊", rarityTier: "standard", attributes: { tradition: "Karuna", type: "Profundo", level: "Karuna I" }, promptHints: ["halu karuna reiki symbol", "pyramid Z healing glyph", "deep subconscious healing", "halu pyramid symbol"] },
      ],
    },
    {
      seasonNumber: 2, totalSeasons: 4, scheduledMonth: "2027-03", status: "upcoming",
      nfts: [
        { id: "reiki-harth",   name: "Harth",   nameEs: "Harth",   description: "Heart of the universe — opens the heart, compassion and unconditional love.", emoji: "💜", rarityTier: "rare",    attributes: { tradition: "Karuna", type: "Corazón", level: "Karuna I"  }, promptHints: ["harth karuna reiki heart symbol", "heart cross glyph", "unconditional love symbol", "heart universe reiki"] },
        { id: "reiki-rama",    name: "Rama",    nameEs: "Rama",    description: "Earth energy — grounds divine energy, clears negativity from the physical plane.", emoji: "🌍", rarityTier: "standard", attributes: { tradition: "Karuna", type: "Tierra",  level: "Karuna I"  }, promptHints: ["rama karuna reiki earth symbol", "grounding earth glyph", "physical plane clearing", "earth divine reiki"] },
        { id: "reiki-gnosa",   name: "Gnosa",   nameEs: "Gnosa",   description: "Higher consciousness — connects to higher self and divine wisdom.", emoji: "🔮", rarityTier: "standard", attributes: { tradition: "Karuna", type: "Sabiduría", level: "Karuna II" }, promptHints: ["gnosa karuna reiki wisdom symbol", "third eye connection glyph", "higher consciousness symbol", "divine wisdom reiki"] },
        { id: "reiki-kriya",   name: "Kriya",   nameEs: "Kriya",   description: "Manifestation — transforms goals into reality, balances chakras.", emoji: "✨", rarityTier: "standard", attributes: { tradition: "Karuna", type: "Manifestación", level: "Karuna II" }, promptHints: ["kriya karuna reiki action symbol", "spiral manifestation glyph", "creation manifestation symbol", "action reiki"] },
        { id: "reiki-motor-zanon", name: "Motor Zanon", nameEs: "Motor Zanon", description: "Life force activation — awakens kundalini energy, vitality.", emoji: "🔥", rarityTier: "standard", attributes: { tradition: "Karuna", type: "Vitalidad", level: "Karuna II" }, promptHints: ["motor zanon reiki vitality symbol", "life force activation glyph", "kundalini awakening symbol", "energy motor"] },
        { id: "reiki-mara",    name: "Mara",    nameEs: "Mara",    description: "Shadow integration — transforms fear and shadow into light and wisdom.", emoji: "🌑", rarityTier: "rare",    attributes: { tradition: "Karuna", type: "Sombra",  level: "Karuna II" }, promptHints: ["mara shadow reiki symbol", "dark to light transformation glyph", "shadow integration healing", "fear transformation"] },
        { id: "reiki-tor",     name: "Tor",     nameEs: "Tor",     description: "Breakthrough — removes blocks, opens new pathways of energy flow.", emoji: "🚪", rarityTier: "standard", attributes: { tradition: "Karuna", type: "Liberación", level: "Karuna II" }, promptHints: ["tor reiki breakthrough symbol", "door opening portal glyph", "energy block removal", "pathway opening reiki"] },
      ],
    },
    {
      seasonNumber: 3, totalSeasons: 4, scheduledMonth: "2027-07", status: "upcoming",
      nfts: [
        { id: "reiki-iava",    name: "Iava",    nameEs: "Iava",    description: "Nature healing — connects to Earth's healing forces and nature spirits.", emoji: "🌿", rarityTier: "standard", attributes: { tradition: "Tibetano", type: "Naturaleza", level: "Tibetano" }, promptHints: ["iava tibetan reiki nature symbol", "earth spirit glyph", "nature healing symbol", "earth spirits reiki"] },
        { id: "reiki-shanti",  name: "Shanti",  nameEs: "Shanti",  description: "Peace — instills deep peace in body, mind and soul. Sanskrit: peace.", emoji: "☮️", rarityTier: "rare",    attributes: { tradition: "Tibetano", type: "Paz",       level: "Tibetano" }, promptHints: ["shanti peace reiki symbol", "peace sign sacred glyph", "inner peace symbol", "shanti sanskrit peace"] },
        { id: "reiki-la-mer",  name: "La Mer",  nameEs: "La Mer",  description: "Ocean of consciousness — deep emotional healing through watery flow.", emoji: "🌊", rarityTier: "standard", attributes: { tradition: "Tibetano", type: "Agua",      level: "Tibetano" }, promptHints: ["la mer ocean reiki symbol", "wave ocean healing glyph", "water consciousness symbol", "ocean emotional healing"] },
        { id: "reiki-mer-ka-fa", name: "Mer Ka Fa Ka Lish Ma", nameEs: "Mer Ka Fa", description: "Divine feminine — awakens sacred feminine energy, nurturing and creation.", emoji: "🌺", rarityTier: "legendary", attributes: { tradition: "Tibetano", type: "Femenino", level: "Tibetano" }, promptHints: ["mer ka fa reiki feminine symbol", "divine feminine sacred glyph", "goddess energy symbol", "feminine power reiki"] },
        { id: "reiki-te-a-ra", name: "Te A Ra", nameEs: "Te A Ra", description: "Solar healing — channels solar energy for vitality and transformation.", emoji: "☀️", rarityTier: "standard", attributes: { tradition: "Tibetano", type: "Solar",     level: "Tibetano" }, promptHints: ["te a ra solar reiki symbol", "sun ray healing glyph", "solar energy channel", "sun transformation reiki"] },
        { id: "reiki-ai-e-ra", name: "Ai E Ra", nameEs: "Ai E Ra", description: "Air and breath — works with the breath, opens the throat and mind.", emoji: "🌬️", rarityTier: "standard", attributes: { tradition: "Tibetano", type: "Aire",      level: "Tibetano" }, promptHints: ["ai e ra air reiki symbol", "breath wind healing glyph", "throat opening symbol", "breath reiki"] },
        { id: "reiki-om",      name: "Om Symbol", nameEs: "Om",    description: "The primordial sound — AUM, the vibration of the universe itself.", emoji: "🕉️", rarityTier: "legendary", attributes: { tradition: "Universal", type: "Primordial", level: "Universal" }, promptHints: ["om aum sacred symbol glowing", "primordial sound universe glyph", "om sanskrit golden symbol", "aum vibration"] },
      ],
    },
    {
      seasonNumber: 4, totalSeasons: 4, scheduledMonth: "2027-10", status: "upcoming",
      nfts: [
        { id: "reiki-fire-serpent", name: "Fire Serpent", nameEs: "Serpiente de Fuego", description: "Kundalini activation — awakens the sleeping serpent fire at the base.", emoji: "🐍", rarityTier: "rare",    attributes: { tradition: "Tibetano", type: "Kundalini", level: "Avanzado" }, promptHints: ["fire serpent reiki symbol", "snake spiral upward glyph", "kundalini fire awakening", "serpent energy symbol"] },
        { id: "reiki-dumo",    name: "Dumo",    nameEs: "Dumo",    description: "Tibetan master symbol — heat of transformation, the inner fire.", emoji: "🔥", rarityTier: "legendary", attributes: { tradition: "Tibetano", type: "Maestro", level: "Maestro Tibetano" }, promptHints: ["dumo tibetan master reiki symbol", "inner fire master glyph", "tibetan heat transformation", "dumo fire symbol"] },
        { id: "reiki-tibetan-dai-ko", name: "Tibetan Dai Ko Myo", nameEs: "Dai Ko Myo Tibetano", description: "Tibetan master symbol — antahkarana, union of higher and lower self.", emoji: "⚛️", rarityTier: "legendary", attributes: { tradition: "Tibetano", type: "Maestro", level: "Maestro Tibetano" }, promptHints: ["tibetan dai ko myo antahkarana", "cross within square glyph", "higher lower self union", "tibetan master symbol"] },
        { id: "reiki-johre",   name: "Johre",   nameEs: "Johre",   description: "White light — purification symbol, cleanses negative energy.", emoji: "🤍", rarityTier: "standard", attributes: { tradition: "Johrei", type: "Purificación", level: "Johrei" }, promptHints: ["johre white light reiki symbol", "pure white light glyph", "purification cleansing symbol", "white light healing"] },
        { id: "reiki-antahkarana", name: "Antahkarana", nameEs: "Antahkarana", description: "The bridge — connects the personality to the Higher Self and soul.", emoji: "🌈", rarityTier: "rare",    attributes: { tradition: "Universal", type: "Puente", level: "Universal" }, promptHints: ["antahkarana bridge symbol", "3D cube cross geometry", "higher self bridge glyph", "rainbow bridge symbol"] },
        { id: "reiki-gyoshi",  name: "Gyoshi Ho", nameEs: "Gyoshi Ho", description: "Healing gaze — sending reiki through the eyes, visual healing.", emoji: "👁️", rarityTier: "standard", attributes: { tradition: "Usui", type: "Visual", level: "Avanzado" }, promptHints: ["gyoshi eye reiki healing symbol", "healing gaze third eye glyph", "visual healing symbol", "eye power reiki"] },
        { id: "reiki-koki-ho", name: "Koki Ho", nameEs: "Koki Ho",   description: "Breath healing — sending reiki through the breath, sacred exhalation.", emoji: "🌬️", rarityTier: "standard", attributes: { tradition: "Usui", type: "Aliento", level: "Avanzado" }, promptHints: ["koki ho breath reiki symbol", "sacred breath healing glyph", "exhalation healing symbol", "breath reiki symbol"] },
      ],
    },
  ],
};
