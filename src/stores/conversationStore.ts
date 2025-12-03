import { create } from 'zustand';
import { Conversation } from '../types/conversation.types';

interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  unassignedCount: number;
  isLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  removeConversation: (id: string) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setUnassignedCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversation: null,
  unassignedCount: 0,
  isLoading: false,

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
      activeConversation:
        state.activeConversation?.id === id
          ? { ...state.activeConversation, ...updates }
          : state.activeConversation,
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      activeConversation:
        state.activeConversation?.id === id ? null : state.activeConversation,
    })),

  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),

  setUnassignedCount: (count) => set({ unassignedCount: count }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
