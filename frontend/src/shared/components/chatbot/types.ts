export type MessageRole = "user" | "assistant" | "system";

export interface ActionButton {
  label: string;
  href?: string;
  action?: "navigate" | "donate" | "external";
  icon?: string;
}

export interface SourceLink {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: (string | SourceLink)[];
  actions?: ActionButton[];
  suggestedFollowUps?: string[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category:
    | "about"
    | "education"
    | "women"
    | "microfinance"
    | "skills"
    | "health"
    | "model_village"
    | "donation"
    | "contact"
    | "governance";
  keywords: string[];
  summary: string;
  content: string;
  url?: string;
  actions?: ActionButton[];
  suggestedFollowUps?: string[];
}

export interface ChatResponse {
  reply: string;
  sources?: (string | SourceLink)[];
  actions?: ActionButton[];
  suggestedFollowUps?: string[];
}
