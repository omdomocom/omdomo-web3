import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
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
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
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
