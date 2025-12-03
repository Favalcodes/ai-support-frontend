import { create } from 'zustand';
import { Message } from '../types/message.types';

interface MessageState {
  messagesByConversation: Record<string, Message[]>;
  
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  clearMessages: (conversationId: string) => void;
  getMessages: (conversationId: string) => Message[];
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messagesByConversation: {},

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [
          ...(state.messagesByConversation[conversationId] || []),
          message,
        ],
      },
    })),

  clearMessages: (conversationId) =>
    set((state) => {
      const { [conversationId]: _, ...rest } = state.messagesByConversation;
      return { messagesByConversation: rest };
    }),

  getMessages: (conversationId) => {
    return get().messagesByConversation[conversationId] || [];
  },
}));
