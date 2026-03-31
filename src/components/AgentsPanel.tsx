"use client";

import { AGENTS } from "@/lib/agents/definitions";
import { AgentCard } from "./AgentCard";

export function AgentsPanel() {
  const agentList = Object.values(AGENTS);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium px-1">
        Active Agents
      </p>
      {agentList.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
