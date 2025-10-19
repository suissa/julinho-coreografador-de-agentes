export interface WorkflowGraph {
  id: string;
  version: string;
  description: string;
  exchange: string;
  session_store: SessionStore;
  entrypoint: string;
  nodes: { [key: string]: Node };
  edges: Edge[];
}

export interface SessionStore {
  type: string;
  key_pattern: string;
  ttl_seconds: number;
}

export interface Node {
  id: string;
  agent: string;
  type?: 'router' | 'decision' | 'terminal';
  context?: string[];
  actions?: Action[];
  subscribe_to?: string;
  validations?: string[];
  context_updates?: string[];
  decisions?: Decision[];
}

export interface Action {
  condition: string;
  publish_to: string;
  description: string;
}

export interface Decision {
  condition: string;
  publish_to: string;
}

export interface Edge {
  from: string;
  to: string;
}

export const parseGraph = (json: any): WorkflowGraph => {
  // Basic validation, can be extended
  if (!json.graph) {
    throw new Error('Invalid graph format: missing "graph" property');
  }
  return json.graph as WorkflowGraph;
};
