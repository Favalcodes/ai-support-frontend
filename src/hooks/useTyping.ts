import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services/socket';

export const useTyping = (conversationId: string | null, userName: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Send typing indicator
  const startTyping = useCallback(() => {
    if (!conversationId) return;

    socketService.startTyping(conversationId, userName);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop after 3 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [conversationId, userName]);

  const stopTyping = useCallback(() => {
    if (!conversationId) return;

    socketService.stopTyping(conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [conversationId]);

  // Listen for typing events from others
  useEffect(() => {
    if (!conversationId) return;

    const handleUserTyping = (data: { typing: boolean; userName: string }) => {
      if (data.typing) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.userName)) {
            return [...prev, data.userName];
          }
          return prev;
        });
      } else {
        setTypingUsers((prev) => prev.filter((name) => name !== data.userName));
      }
    };

    const handleAgentTyping = (data: { typing: boolean; agentName: string }) => {
      if (data.typing) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.agentName)) {
            return [...prev, data.agentName];
          }
          return prev;
        });
      } else {
        setTypingUsers((prev) => prev.filter((name) => name !== data.agentName));
      }
    };

    socketService.on('user_typing', handleUserTyping);
    socketService.on('agent_typing', handleAgentTyping);

    return () => {
      socketService.off('user_typing', handleUserTyping);
      socketService.off('agent_typing', handleAgentTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId]);

  return {
    isTyping,
    typingUsers,
    startTyping,
    stopTyping,
  };
};