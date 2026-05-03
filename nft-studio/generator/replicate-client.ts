// NFT Studio — Cliente Replicate para generación de imágenes IA
// ─────────────────────────────────────────────────────────────────────────────
// Genera 3 variantes por NFT. El curador Om Domo selecciona la mejor.
// Luego esa variante va a votación DAO.

import type { NFTDefinition } from "../collections/index";

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

export interface GenerationJob {
  nftId: string;
  nftName: string;
  model: string;
  prompt: string;
  negativePrompt: string;
  variants: number;  // cuántas variantes generar (default: 3)
}

export interface GenerationResult {
  nftId: string;
  nftName: string;
  variants: {
    index: number;
    imageUrl: string;
    predictionId: string;
    status: "pending" | "processing" | "succeeded" | "failed";
  }[];
  generatedAt: string;
}

// ─── Prompt Engine ────────────────────────────────────────────────────────────

export function buildPrompt(
  nft: NFTDefinition,
  basePrompt: string,
  artStyle: string,
  variantSeed?: number
): { prompt: string; negativePrompt: string } {
  const hints = nft.promptHints.join(", ");
  const variantMod = variantSeed
    ? ["ethereal soft light", "bold vibrant colors", "minimal elegant"][variantSeed % 3]
    : "";

  const prompt = [
    hints,
    basePrompt,
    artStyle,
    variantMod,
    "masterpiece, best quality, highly detailed, 4k, nft art",
  ]
    .filter(Boolean)
    .join(", ");

  const negativePrompt = [
    "ugly, blurry, low quality, distorted, watermark, text, signature",
    "realistic photo, 3d render, anime, cartoon",
    "nsfw, violence",
  ].join(", ");

  return { prompt, negativePrompt };
}

// ─── Generación con Replicate ─────────────────────────────────────────────────

export async function generateNFTVariants(
  job: GenerationJob
): Promise<GenerationResult> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) throw new Error("REPLICATE_API_TOKEN no configurado");

  const variantPromises = Array.from({ length: job.variants }, async (_, i) => {
    const seed = Math.floor(Math.random() * 1000000) + i * 1000;

    const response = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        Prefer: "wait",  // esperar resultado sincrónico (hasta 60s)
      },
      body: JSON.stringify({
        version: getModelVersion(job.model),
        input: {
          prompt: job.prompt,
          negative_prompt: job.negativePrompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          seed,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Replicate error (variant ${i}): ${err}`);
    }

    const prediction = await response.json() as {
      id: string;
      status: string;
      output?: string[];
    };

    return {
      index: i,
      predictionId: prediction.id,
      imageUrl: prediction.output?.[0] ?? "",
      status: prediction.status as "pending" | "processing" | "succeeded" | "failed",
    };
  });

  const variants = await Promise.all(variantPromises);

  return {
    nftId: job.nftId,
    nftName: job.nftName,
    variants,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Batch generation para toda una temporada ────────────────────────────────

export async function generateSeasonBatch(
  nfts: NFTDefinition[],
  basePrompt: string,
  artStyle: string,
  model: string,
  variantsPerNFT = 3,
  onProgress?: (done: number, total: number, nftName: string) => void
): Promise<GenerationResult[]> {
  const results: GenerationResult[] = [];

  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];
    const { prompt, negativePrompt } = buildPrompt(nft, basePrompt, artStyle, i);

    console.log(`[NFT Studio] Generando variantes para: ${nft.nameEs} (${i + 1}/${nfts.length})`);
    onProgress?.(i, nfts.length, nft.nameEs);

    const result = await generateNFTVariants({
      nftId: nft.id,
      nftName: nft.nameEs,
      model,
      prompt,
      negativePrompt,
      variants: variantsPerNFT,
    });

    results.push(result);

    // Esperar 2s entre generaciones para no saturar la API
    if (i < nfts.length - 1) await sleep(2000);
  }

  onProgress?.(nfts.length, nfts.length, "Completado");
  return results;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getModelVersion(model: string): string {
  // Versiones fijas de los modelos de Replicate
  const versions: Record<string, string> = {
    "stability-ai/sdxl": "7762fd07cf82c948538e41f63f77d685e02b063e37ec1375d-de09de8d3ec-e2c2d7c",
    "black-forest-labs/flux-1.1-pro": "80a09d66baa990429c2f5ae8a4306bf778a4e52e9536664c1bf24be8ad0e4d8d",
  };
  return versions[model] ?? model;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Verificar status de un prediction ───────────────────────────────────────

export async function getPredictionStatus(predictionId: string): Promise<{
  status: string;
  imageUrl?: string;
}> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) throw new Error("REPLICATE_API_TOKEN no configurado");

  const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });

  const prediction = await response.json() as {
    status: string;
    output?: string[];
  };

  return {
    status: prediction.status,
    imageUrl: prediction.output?.[0],
  };
}
