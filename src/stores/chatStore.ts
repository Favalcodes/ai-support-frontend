import { create } from 'zustand';
import type { User, Conversation, Message } from '@/types/chat.types';
import { ChatWidgetState } from '../types/widget-states';

/**
 * Order messages by the time they were created.
 *
 * The transcript used to be whatever order events happened to arrive in: an
 * optimistic message was appended to the end, and a history load replaced the
 * array wholesale. Any late socket event or refetch could therefore render a
 * new message above an older one.
 *
 * Ties keep their existing relative order, so a message and its reply stamped
 * in the same second do not swap around on re-render.
 */
const byCreatedAt = (messages: Message[]): Message[] =>
  messages
    .map((message, index) => ({ message, index }))
    .sort((a, b) => {
      const left = new Date(a.message.created_at).getTime();
      const right = new Date(b.message.created_at).getTime();
      if (Number.isNaN(left) || Number.isNaN(right) || left === right) {
        return a.index - b.index;
      }
      return left - right;
    })
    .map(({ message }) => message);

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
  updateMessages: (updater: (messages: Message[]) => Message[]) => void;
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
    set((state) => {
      // Check if message already exists (prevent duplicates)
      const messageExists = state.messages.some((m) => m.id === message.id);
      if (messageExists) {
        return state; // No changes if message already exists
      }

      return {
        messages: byCreatedAt([...state.messages, message]),
        // Increment unread if widget is closed and message is not from user
        unreadCount:
          state.widgetState === ChatWidgetState.CLOSED && message.role !== 'USER'
            ? state.unreadCount + 1
            : state.unreadCount,
      };
    }),

  setMessages: (messages) => set({ messages: byCreatedAt(messages) }),

  updateMessages: (updater) =>
    set((state) => ({
      messages: byCreatedAt(updater(state.messages)),
    })),

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