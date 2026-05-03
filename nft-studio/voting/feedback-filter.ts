// NFT Studio — Filtrado de Feedback con Claude API
// ─────────────────────────────────────────────────────────────────────────────
// Clasifica el feedback de la comunidad en: ACEPTADO / NEUTRAL / DESCARTADO
// Solo el feedback ACEPTADO se procesa para refinar los NFTs con Replicate.

import Anthropic from "@anthropic-ai/sdk";

export type FeedbackCategory = "ACEPTADO" | "NEUTRAL" | "DESCARTADO";

export interface RawFeedback {
  id: string;
  nftId: string;
  walletAddress: string;
  text: string;
  submittedAt: string;
  vote: "approve" | "reject";
}

export interface ClassifiedFeedback extends RawFeedback {
  category: FeedbackCategory;
  ommyReward: number;     // 100 si ACEPTADO, 0 si no
  classifiedAt: string;
  classificationReason?: string;
}

// ─── Prompt de clasificación ──────────────────────────────────────────────────

function buildClassificationPrompt(feedbackText: string, nftName: string): string {
  return `Eres un moderador de comunidad Web3 espiritual (Om Domo).
Clasifica este comentario sobre el diseño del NFT "${nftName}" en una de estas categorías:

ACEPTADO: Feedback constructivo y específico sobre el diseño visual. Menciona colores, composición, elementos, estilo, o da una sugerencia concreta y útil para mejorar el arte.

NEUTRAL: Expresión genérica de gusto o disgusto sin detalle visual útil. Ejemplos: "me gusta", "bonito", "no me convence", "podría ser mejor".

DESCARTADO: Spam, texto sin sentido, contenido inapropiado, off-topic, texto repetido, o caracteres aleatorios.

Feedback a clasificar: "${feedbackText}"

Responde SOLO con una de estas palabras exactas: ACEPTADO, NEUTRAL o DESCARTADO.`;
}

// ─── Clasificación individual ─────────────────────────────────────────────────

export async function classifyFeedback(
  feedback: RawFeedback,
  nftName: string
): Promise<ClassifiedFeedback> {
  // Validaciones rápidas antes de llamar a la API
  const text = feedback.text.trim();

  // Muy corto = NEUTRAL directamente (sin gastar tokens)
  if (text.length < 10) {
    return {
      ...feedback,
      category: "NEUTRAL",
      ommyReward: 0,
      classifiedAt: new Date().toISOString(),
      classificationReason: "Texto demasiado corto",
    };
  }

  // Demasiado largo = DESCARTADO (excede 280 chars)
  if (text.length > 280) {
    return {
      ...feedback,
      category: "DESCARTADO",
      ommyReward: 0,
      classifiedAt: new Date().toISOString(),
      classificationReason: "Excede el límite de 280 caracteres",
    };
  }

  // Llamada a Claude API
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001", // Haiku: rápido y barato para clasificación
      max_tokens: 10,
      messages: [
        {
          role: "user",
          content: buildClassificationPrompt(text, nftName),
        },
      ],
    });

    const response = (message.content[0] as { text: string }).text.trim().toUpperCase();
    const category: FeedbackCategory =
      response === "ACEPTADO" || response === "NEUTRAL" || response === "DESCARTADO"
        ? response
        : "NEUTRAL";

    return {
      ...feedback,
      category,
      ommyReward: category === "ACEPTADO" ? 100 : 0,
      classifiedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[Feedback Filter] Error clasificando feedback:", err);
    // En caso de error, clasificar como NEUTRAL (no penalizar al usuario)
    return {
      ...feedback,
      category: "NEUTRAL",
      ommyReward: 0,
      classifiedAt: new Date().toISOString(),
      classificationReason: "Error de clasificación — default NEUTRAL",
    };
  }
}

// ─── Clasificación batch ──────────────────────────────────────────────────────

export async function classifyFeedbackBatch(
  feedbacks: RawFeedback[],
  nftName: string
): Promise<{
  results: ClassifiedFeedback[];
  stats: {
    total: number;
    aceptados: number;
    neutrales: number;
    descartados: number;
    ommyDistribuidos: number;
  };
}> {
  const results: ClassifiedFeedback[] = [];

  // Procesar de a 5 en paralelo para no saturar la API
  for (let i = 0; i < feedbacks.length; i += 5) {
    const batch = feedbacks.slice(i, i + 5);
    const classified = await Promise.all(
      batch.map((fb) => classifyFeedback(fb, nftName))
    );
    results.push(...classified);
  }

  const stats = {
    total: results.length,
    aceptados: results.filter((r) => r.category === "ACEPTADO").length,
    neutrales: results.filter((r) => r.category === "NEUTRAL").length,
    descartados: results.filter((r) => r.category === "DESCARTADO").length,
    ommyDistribuidos: results.reduce((s, r) => s + r.ommyReward, 0),
  };

  console.log(
    `[Feedback Filter] ${nftName}: ${stats.aceptados} aceptados / ${stats.neutrales} neutrales / ${stats.descartados} descartados | ${stats.ommyDistribuidos} OMMY distribuidos`
  );

  return { results, stats };
}

// ─── Extraer insights para el refinamiento ────────────────────────────────────
// Convierte los feedbacks aceptados en instrucciones concretas para Replicate

export async function extractRefinementInstructions(
  acceptedFeedbacks: ClassifiedFeedback[],
  nftName: string
): Promise<string> {
  if (acceptedFeedbacks.length === 0) return "";

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const feedbackTexts = acceptedFeedbacks
    .map((f, i) => `${i + 1}. "${f.text}"`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 150,
    messages: [
      {
        role: "user",
        content: `Eres un director creativo de arte NFT espiritual.
Tienes estos feedbacks de la comunidad sobre el diseño de "${nftName}":

${feedbackTexts}

Resume en máximo 3 instrucciones concretas para mejorar el diseño con IA.
Formato: una instrucción por línea, sin numeración, en inglés (para el prompt de Replicate).
Sé específico sobre colores, composición, elementos o estilo.`,
      },
    ],
  });

  return (message.content[0] as { text: string }).text.trim();
}
