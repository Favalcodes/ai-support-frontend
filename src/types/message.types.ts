export enum MessageRole {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
  HUMAN = 'HUMAN',
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id?: string;
  role: MessageRole;
  content: string;
  sources?: MessageSource[];
  confidence_score?: number;
  tokens_used?: number;
  created_at: string;
}

export interface MessageSource {
  type: 'faq' | 'article_chunk';
  id: string;
  content: string;
  similarity: number;
}