"use client";

import { AgentDefinition } from "@/lib/agents/definitions";

interface AgentCardProps {
  agent: AgentDefinition;
  isActive?: boolean;
  response?: string;
}

export function AgentCard({ agent, isActive, response }: AgentCardProps) {
  return (
    <div
      className={`glass rounded-xl p-4 border transition-all duration-300 ${
        isActive
          ? `${agent.borderColor} glow-purple`
          : "border-slate-800/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg`}
        >
          {agent.emoji}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">{agent.name}</p>
          <p className="text-xs text-slate-500">{agent.role}</p>
        </div>
        {isActive && (
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400">Active</span>
          </div>
        )}
      </div>

      {response && (
        <div className="mt-3 pt-3 border-t border-slate-700/40">
          <p className="text-xs text-slate-300 leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
}
