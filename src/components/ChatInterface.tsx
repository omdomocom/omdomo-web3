"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { AGENTS } from "@/lib/agents/definitions";
import type { CoordinatorResult } from "@/types/agents";

interface Message {
  role: "user" | "coordinator";
  content: string;
  result?: CoordinatorResult;
  timestamp: number;
}

const SUGGESTED_PROMPTS = [
  "Define the roadmap for the next 90 days",
  "How should we grow the Ommy Coin community?",
  "What DeFi features should we build on Avalanche?",
  "Create a launch strategy for our token",
  "Design the brand identity for Ommy Coin",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput("");
    setLoading(true);

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      if (!res.ok) throw new Error("Agent error");

      const result: CoordinatorResult = await res.json();

      const coordMessage: Message = {
        role: "coordinator",
        content: result.coordination,
        result,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, coordMessage]);
      setExpandedMessages((prev) => {
        const next = new Set(prev);
        next.add(messages.length + 1);
        return next;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "coordinator",
          content: "Agent system temporarily unavailable. Check your ANTHROPIC_API_KEY.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(index: number) {
    setExpandedMessages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  const priorityColors: Record<string, string> = {
    HIGH: "text-red-400 bg-red-400/10 border-red-400/20",
    MEDIUM: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    LOW: "text-green-400 bg-green-400/10 border-green-400/20",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h2 className="text-xl font-bold gradient-text mb-2">
                Om Domo AI Coordinator
              </h2>
              <p className="text-slate-500 text-sm max-w-sm">
                Coordinating your Ommy Coin ecosystem. Ask me anything about strategy, development, community, or brand.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left p-3 glass rounded-lg border border-slate-700/40 hover:border-purple-500/40 hover:bg-purple-900/10 transition-all text-sm text-slate-400 hover:text-slate-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in">
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/20 rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm text-slate-200">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Coordinator header */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs">
                    🤖
                  </div>
                  <span className="text-xs font-semibold text-purple-300">
                    Om Domo Coordinator
                  </span>
                  {msg.result?.priority && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        priorityColors[msg.result.priority] || priorityColors.MEDIUM
                      }`}
                    >
                      {msg.result.priority}
                    </span>
                  )}
                </div>

                {/* Directive */}
                {msg.result?.directive && (
                  <div className="ml-9 text-xs text-cyan-400 font-mono bg-cyan-400/5 border border-cyan-400/10 rounded-lg px-3 py-1.5">
                    Directive: {msg.result.directive}
                  </div>
                )}

                {/* Coordination summary */}
                <div className="ml-9 glass rounded-xl p-4 border border-slate-700/40">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {msg.content}
                  </p>
                </div>

                {/* Agent responses */}
                {msg.result?.agentResponses && msg.result.agentResponses.length > 0 && (
                  <div className="ml-9">
                    <button
                      onClick={() => toggleExpand(i)}
                      className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2"
                    >
                      {expandedMessages.has(i) ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                      Agent inputs ({msg.result.agentResponses.length} agents involved)
                    </button>

                    {expandedMessages.has(i) && (
                      <div className="space-y-2 animate-fade-in">
                        {msg.result.agentResponses.map((ar) => (
                          <AgentCard
                            key={ar.agentId}
                            agent={AGENTS[ar.agentId]}
                            isActive={true}
                            response={ar.content}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Next actions */}
                {msg.result?.nextActions && msg.result.nextActions.length > 0 && (
                  <div className="ml-9 glass rounded-xl p-4 border border-slate-700/40">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                      Next Actions
                    </p>
                    <ol className="space-y-1.5">
                      {msg.result.nextActions.map((action, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-purple-400 font-mono font-bold text-xs mt-0.5">
                            {j + 1}.
                          </span>
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="animate-fade-in ml-9 flex items-center gap-3 text-slate-500">
            <Loader2 size={16} className="animate-spin text-purple-400" />
            <span className="text-sm">Coordinando agentes...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-slate-800/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the coordinator..."
            disabled={loading}
            className="flex-1 glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
