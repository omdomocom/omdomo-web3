// API — DAO Season
// GET /api/dao/season
// Devuelve la temporada activa del NFT Studio con conteos en vivo desde Redis.
//
// La definición de la temporada (NFTs, fechas, colección) está en SEASON_DEF.
// Los conteos de feedback y votos vienen de Redis y se sobreescriben encima.
//
// Redis schema:
//   dao:fb:{seasonId}:{nftId}:total  → number (total feedbacks)
//   dao:fb:{seasonId}:{nftId}:pos    → number (feedbacks positivos)
//   dao:vote:{seasonId}:{nftId}:yes  → number
//   dao:vote:{seasonId}:{nftId}:no   → number

import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";

// ─── Definición base de la temporada activa ───────────────────────────────────
// Cambiar este objeto para configurar la temporada en curso.

const SEASON_ID = "chakras-s1";

const SEASON_DEF = {
  id: SEASON_ID,
  collectionName: "Chakras",
  collectionEmoji: "🔴",
  seasonNumber: 1,
  totalSeasons: 1,
  scheduledMonth: "2026-09",
  phase: "feedback2" as const,           // fase actual (ajustar manualmente)
  feedback1End:   "2026-09-08",
  refinementDate: "2026-09-09",
  feedback2End:   "2026-09-12",
  finalVoteEnd:   "2026-09-19",
  launchDate:     "2026-09-23",
  colorPalette: ["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#4B0082","#8B00FF"],
  nfts: [
    { id:"chakra-muladhara",   name:"Muladhara",    nameEs:"Chakra Raíz",    emoji:"🔴", rarityTier:"standard"  as const, description:"The root chakra — foundation of survival, security, and trust. Red energy at the base of the spine.",         communityScore:87, feedbackCount:34, attributes:{ color:"Rojo",    hz:396, element:"Tierra"     } },
    { id:"chakra-svadhisthana",name:"Svadhisthana", nameEs:"Chakra Sacro",   emoji:"🟠", rarityTier:"standard"  as const, description:"The sacral chakra — creativity, sexuality, and emotional fluidity. Orange below the navel.",                 communityScore:73, feedbackCount:28, attributes:{ color:"Naranja", hz:417, element:"Agua"       } },
    { id:"chakra-manipura",    name:"Manipura",     nameEs:"Plexo Solar",    emoji:"🟡", rarityTier:"rare"      as const, description:"Solar plexus — personal power, will, and transformation. Yellow fire above the navel.",                      communityScore:91, feedbackCount:42, attributes:{ color:"Amarillo",hz:528, element:"Fuego"      } },
    { id:"chakra-anahata",     name:"Anahata",      nameEs:"Corazón",        emoji:"💚", rarityTier:"legendary" as const, description:"Heart chakra — unconditional love, compassion, and harmony. Green center of the body.",                       communityScore:95, feedbackCount:61, attributes:{ color:"Verde",   hz:639, element:"Aire"       } },
    { id:"chakra-vishuddha",   name:"Vishuddha",    nameEs:"Garganta",       emoji:"🔵", rarityTier:"standard"  as const, description:"Throat chakra — authentic expression, truth, and communication. Blue at the throat.",                        communityScore:68, feedbackCount:22, attributes:{ color:"Azul",    hz:741, element:"Éter"       } },
    { id:"chakra-ajna",        name:"Ajna",         nameEs:"Tercer Ojo",     emoji:"🔮", rarityTier:"rare"      as const, description:"Third eye chakra — intuition, psychic vision, and higher wisdom. Indigo between the eyebrows.",               communityScore:88, feedbackCount:47, attributes:{ color:"Índigo",  hz:852, element:"Luz"        } },
    { id:"chakra-sahasrara",   name:"Sahasrara",    nameEs:"Corona",         emoji:"👑", rarityTier:"legendary" as const, description:"Crown chakra — universal consciousness, spiritual connection, and enlightenment. Violet at the top.",         communityScore:97, feedbackCount:78, attributes:{ color:"Violeta", hz:963, element:"Conciencia" } },
  ],
};

export async function GET() {
  try {
    const redis = await getRedis();

    // Si no hay Redis, devolvemos la definición base tal cual
    if (!redis) {
      return NextResponse.json({ season: SEASON_DEF });
    }

    // Obtener conteos en vivo para cada NFT
    const nftsWithLiveCounts = await Promise.all(
      SEASON_DEF.nfts.map(async (nft) => {
        try {
          const [fbTotalStr, fbPosStr, votesYesStr, votesNoStr] = await Promise.all([
            redis.get(`dao:fb:${SEASON_ID}:${nft.id}:total`),
            redis.get(`dao:fb:${SEASON_ID}:${nft.id}:pos`),
            redis.get(`dao:vote:${SEASON_ID}:${nft.id}:yes`),
            redis.get(`dao:vote:${SEASON_ID}:${nft.id}:no`),
          ]);

          const fbTotal   = parseInt(fbTotalStr  ?? "0") || 0;
          const fbPos     = parseInt(fbPosStr    ?? "0") || 0;
          const votesYes  = parseInt(votesYesStr ?? "0") || 0;
          const votesNo   = parseInt(votesNoStr  ?? "0") || 0;

          // Si hay datos en Redis, usamos esos; si no, los datos base del seed
          const feedbackCount  = fbTotal  > 0 ? fbTotal : nft.feedbackCount;
          const communityScore = fbTotal  > 0
            ? Math.round((fbPos / fbTotal) * 100)
            : nft.communityScore;

          return { ...nft, feedbackCount, communityScore, votesYes, votesNo };
        } catch {
          return { ...nft, votesYes: 0, votesNo: 0 };
        }
      })
    );

    return NextResponse.json({ season: { ...SEASON_DEF, nfts: nftsWithLiveCounts } });
  } catch (error) {
    console.error("[DAO/season]", error);
    return NextResponse.json({ season: SEASON_DEF });
  }
}
