// User types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'USER';
}

// Conversation types
export interface Conversation {
  id: string;
  company_id: string;
  user_id: string;
  category_id?: string;
  status: 'OPEN' | 'ASSIGNED' | 'RESOLVED' | 'CLOSED';
  active: boolean;
  needs_human_agent: boolean;
  created_at: string;
  last_activity: string;
}

// Message types
export type MessageRole = 'USER' | 'ASSISTANT' | 'AGENT' | 'SYSTEM';

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: MessageRole;
  user_id?: string;
  staff_id?: string;
  confidence?: number;
  sources?: string[];
  created_at: string;
}

// API Request/Response types
export interface StartConversationRequest {
  email: string;
  first_name: string;
  last_name: string;
  company_id: string;
  category_id?: string;
}

export interface StartConversationResponse {
  conversation: Conversation;
  user: User;
  isNewConversation: boolean;
}

// Socket event types
export interface SocketMessage {
  message: Message;
}

export interface TypingEvent {
  typing: boolean;
  userName?: string;
  agentName?: string;
}

export interface AgentJoinedEvent {
  agentName: string;
  agentAvatar?: string;
}

export interface EscalationEvent {
  message: string;
  estimatedWait?: number;
}