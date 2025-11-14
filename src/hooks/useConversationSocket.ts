import { useEffect, useCallback } from 'react';
import { socketService } from '@/services';

export const useConversationSocket = (conversationId: string | null, userId: string | null) => {
  // Join conversation room when conversation is selected
  useEffect(() => {
    if (!conversationId || !userId) return;

    console.log('🔌 Joining conversation:', conversationId);
    socketService.joinConversation(conversationId, userId);

    // Leave conversation on unmount
    return () => {
      console.log('👋 Leaving conversation:', conversationId);
      socketService.leaveConversation(conversationId);
    };
  }, [conversationId, userId]);

  // Send typing start indicator
  const startTyping = useCallback(
    (userName: string) => {
      if (!conversationId) return;
      socketService.startTyping(conversationId, userName);
    },
    [conversationId]
  );

  // Send typing stop indicator
  const stopTyping = useCallback(() => {
    if (!conversationId) return;
    socketService.stopTyping(conversationId);
  }, [conversationId]);

  return {
    startTyping,
    stopTyping,
  };
};