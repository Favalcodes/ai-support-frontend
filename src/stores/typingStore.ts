import { create } from 'zustand';

interface TypingState {
  typingUsers: Record<string, string[]>; // conversationId -> array of user names
  
  // Actions
  addTypingUser: (conversationId: string, userName: string) => void;
  removeTypingUser: (conversationId: string, userName: string) => void;
  getTypingUsers: (conversationId: string) => string[];
  clearTypingUsers: (conversationId: string) => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  typingUsers: {},

  addTypingUser: (conversationId, userName) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      if (current.includes(userName)) return state;
      
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...current, userName],
        },
      };
    }),

  removeTypingUser: (conversationId, userName) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: current.filter((name) => name !== userName),
        },
      };
    }),

  getTypingUsers: (conversationId) => {
    return get().typingUsers[conversationId] || [];
  },

  clearTypingUsers: (conversationId) =>
    set((state) => {
      const { [conversationId]: _, ...rest } = state.typingUsers;
      return { typingUsers: rest };
    }),
}));