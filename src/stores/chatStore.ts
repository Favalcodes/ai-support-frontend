import { create } from 'zustand';
import type { User, Conversation, Message } from '@/types/chat.types';
import { ChatWidgetState } from '../types/widget-states';

interface ChatState {
  // User state
  user: User | null;
  setUser: (user: User) => void;

  // Conversation state
  conversation: Conversation | null;
  setConversation: (conversation: Conversation) => void;

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;

  // Widget state
  widgetState: ChatWidgetState;
  setWidgetState: (state: ChatWidgetState) => void;

  // UI state (kept for backward compatibility)
  isOpen: boolean;
  isMinimized: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  toggleOpen: () => void;

  // Connection state
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;

  // Typing indicators
  isAiTyping: boolean;
  isAgentTyping: boolean;
  setIsAiTyping: (isTyping: boolean) => void;
  setIsAgentTyping: (isTyping: boolean) => void;

  // Agent state
  agentName: string | null;
  setAgentName: (name: string | null) => void;

  // Loading states
  isInitializing: boolean;
  isSendingMessage: boolean;
  setIsInitializing: (isInitializing: boolean) => void;
  setIsSendingMessage: (isSending: boolean) => void;

  // Unread messages
  unreadCount: number;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  user: null,
  conversation: null,
  messages: [],
  widgetState: ChatWidgetState.CLOSED,
  isOpen: false,
  isMinimized: false,
  isConnected: false,
  isAiTyping: false,
  isAgentTyping: false,
  agentName: null,
  isInitializing: false,
  isSendingMessage: false,
  unreadCount: 0,
};

export const useChatStore = create<ChatState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setConversation: (conversation) => set({ conversation }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      // Increment unread if widget is closed and message is not from user
      unreadCount:
        state.widgetState === ChatWidgetState.CLOSED && message.role !== 'USER'
          ? state.unreadCount + 1
          : state.unreadCount,
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [] }),

  setWidgetState: (widgetState) => set({ widgetState }),

  setIsOpen: (isOpen) =>
    set((state) => ({
      isOpen,
      // Reset unread count when opening
      unreadCount: isOpen ? 0 : state.unreadCount,
      // Reset minimized state when changing open state
      isMinimized: false,
    })),

  setIsMinimized: (isMinimized) => set({ isMinimized }),

  toggleOpen: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      unreadCount: !state.isOpen ? 0 : state.unreadCount,
      isMinimized: false,
    })),

  setIsConnected: (isConnected) => set({ isConnected }),

  setIsAiTyping: (isAiTyping) => set({ isAiTyping }),

  setIsAgentTyping: (isAgentTyping) => set({ isAgentTyping }),

  setAgentName: (agentName) => set({ agentName }),

  setIsInitializing: (isInitializing) => set({ isInitializing }),

  setIsSendingMessage: (isSendingMessage) => set({ isSendingMessage }),

  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  resetUnreadCount: () => set({ unreadCount: 0 }),

  reset: () => set(initialState),
}));