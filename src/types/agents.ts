export interface AgentResponse {
  agentId: string;
  agentName: string;
  emoji: string;
  content: string;
}

export interface CoordinatorResult {
  coordination: string;
  directive: string;
  priority: string;
  agentResponses: AgentResponse[];
  nextActions: string[];
}
