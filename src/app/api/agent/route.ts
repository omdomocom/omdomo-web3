import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/auth";
import { getRedis } from "@/lib/redis";

// ── Rate limiter Redis (persistente entre instancias Vercel) ─────────────────
const RATE_LIMIT = 10;
const RATE_WINDOW_S = 60;

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = await getRedis();

  if (!redis) {
    // Fallback in-memory si no hay Redis
    const now = Date.now();
    const windowKey = `${ip}:${Math.floor(now / 60000)}`;
    const entry = _memoryRateLimit.get(windowKey);
    if (!entry) { _memoryRateLimit.set(windowKey, 1); return true; }
    if (entry >= RATE_LIMIT) return false;
    _memoryRateLimit.set(windowKey, entry + 1);
    return true;
  }

  try {
    const windowMinute = Math.floor(Date.now() / 60000);
    const key = `rate-limit:agent:${ip}:${windowMinute}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_WINDOW_S);
    return count <= RATE_LIMIT;
  } catch {
    return true; // permitir si Redis falla (no bloquear por error de infra)
  }
}

const _memoryRateLimit = new Map<string, number>();

import {
  AGENTS,
  COORDINATOR_SYSTEM_PROMPT,
  AGENT_SELECTION_PROMPT,
} from "@/lib/agents/definitions";
import type { AgentResponse, CoordinatorResult } from "@/types/agents";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function callAgent(agentId: string, userMessage: string): Promise<string> {
  const agent = AGENTS[agentId];
  if (!agent) return "";

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 400,
    system: agent.systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function selectAgents(userMessage: string): Promise<{
  agents: string[];
  priority: string;
  directive: string;
}> {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 200,
    system: AGENT_SELECTION_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    return {
      agents: parsed.agents || ["productStrategist"],
      priority: parsed.priority || "MEDIUM",
      directive: parsed.directive || "Process request",
    };
  } catch {
    return {
      agents: ["productStrategist"],
      priority: "MEDIUM",
      directive: "Process request",
    };
  }
}

async function coordinatorSynthesize(
  userMessage: string,
  agentResponses: AgentResponse[],
  directive: string
): Promise<{ coordination: string; nextActions: string[] }> {
  const agentSummary = agentResponses
    .map((a) => `[${a.agentName}]: ${a.content}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 600,
    system: COORDINATOR_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `User request: "${userMessage}"

Directive: ${directive}

Agent inputs:
${agentSummary}

Synthesize a coordination summary and provide NEXT ACTIONS as a numbered list. Format your response as:
COORDINATION: [your synthesis]
NEXT ACTIONS:
1. [action]
2. [action]
3. [action]`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const coordinationMatch = text.match(/COORDINATION:\s*([\s\S]*?)(?=NEXT ACTIONS:|$)/i);
  const actionsMatch = text.match(/NEXT ACTIONS:\s*([\s\S]*)/i);

  const coordination = coordinationMatch
    ? coordinationMatch[1].trim()
    : text;

  const nextActions = actionsMatch
    ? actionsMatch[1]
        .split(/\n/)
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
    : [];

  return { coordination, nextActions };
}

export async function POST(req: NextRequest) {
  try {
    // API Key auth
    const denied = requireApiKey(req);
    if (denied) return denied;

    // Rate limiting por IP (Redis persistente)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!(await checkRateLimit(ip))) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Espera 1 minuto." },
        { status: 429 }
      );
    }

    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Límite de longitud para prevenir abusos de coste
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Mensaje demasiado largo (máx. 2000 caracteres)" },
        { status: 400 }
      );
    }

    // Step 1: Coordinator selects relevant agents
    const { agents, priority, directive } = await selectAgents(message);

    // Step 2: Call selected agents in parallel
    const agentResults = await Promise.all(
      agents.map(async (agentId) => {
        const agent = AGENTS[agentId];
        if (!agent) return null;
        const content = await callAgent(agentId, message);
        return {
          agentId,
          agentName: agent.name,
          emoji: agent.emoji,
          content,
        } as AgentResponse;
      })
    );

    const agentResponses = agentResults.filter(Boolean) as AgentResponse[];

    // Step 3: Coordinator synthesizes
    const { coordination, nextActions } = await coordinatorSynthesize(
      message,
      agentResponses,
      directive
    );

    const result: CoordinatorResult = {
      coordination,
      directive,
      priority,
      agentResponses,
      nextActions,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      { error: "Agent system error" },
      { status: 500 }
    );
  }
}
