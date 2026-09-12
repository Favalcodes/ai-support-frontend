export const APP_NAME = 'rlayAi';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  CONVERSATIONS: '/dashboard/conversations',
  QUEUE: '/dashboard/queue',
  RESOLVED: '/dashboard/resolved',
  ANALYTICS: '/dashboard/analytics',
  KNOWLEDGE_BASE: '/dashboard/knowledge',
  SETTINGS: '/dashboard/settings',
};

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Conversation
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  CONVERSATION_HISTORY: 'conversation_history',
  
  // Messages
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  
  // Typing
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',
  AGENT_TYPING: 'agent_typing',
  
  // AI
  AI_THINKING: 'ai_thinking',
  
  // Agent
  ESCALATED_TO_HUMAN: 'escalated_to_human',
  AGENT_JOINED: 'agent_joined',
  AGENT_ASSIGNMENT: 'agent_assignment',
  CONVERSATION_TRANSFERRED: 'conversation_transferred',
  CONVERSATION_RESOLVED: 'conversation_resolved',
};

export const MESSAGE_ROLES = {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
  SYSTEM: 'SYSTEM',
} as const;

export const CONVERSATION_STATUS = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export const USER_ROLES = {
  USER: 'USER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
} as const;

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
} as const;