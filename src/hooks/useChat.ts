import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { apiService } from '@/services/api.service';
import { socketService } from '@/services/socket.service';
import type { StartConversationRequest } from '@/types/chat.types';

export const useChat = (companyId: string) => {
  const {
    user,
    conversation,
    messages,
    isConnected,
    isAiTyping,
    isAgentTyping,
    agentName,
    isInitializing,
    isSendingMessage,
    setUser,
    setConversation,
    addMessage,
    setMessages,
    updateMessages,
    setIsConnected,
    setIsAiTyping,
    setIsAgentTyping,
    setAgentName,
    setIsInitializing,
    setIsSendingMessage,
  } = useChatStore();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  /**
   * Initialize socket connection and event listeners
   */
  useEffect(() => {
    if (!conversation?.id || !user?.id || hasInitializedRef.current) return;

    const socket = socketService.connect();
    
    // Update connection status
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Join conversation room
    socketService.joinConversation(conversation.id, user.id);

    // Listen for conversation history
    socketService.onConversationHistory(({ messages }) => {
      setMessages(messages);
    });

    // Listen for new messages
    socketService.onNewMessage(({ message }) => {
      // If this is a user message echoed back, replace the optimistic temp message
      if (message.role === 'USER' && message.user_id === user.id) {
        updateMessages((prevMessages) => {
          // Find and replace temp message with real one
          const tempMsgIndex = prevMessages.findIndex(
            (m) => m.id.startsWith('temp-') && m.content === message.content
          );
          if (tempMsgIndex !== -1) {
            const newMessages = [...prevMessages];
            newMessages[tempMsgIndex] = message;
            return newMessages;
          }
          // If no temp message found, check if this exact message already exists
          const existingMsg = prevMessages.find((m) => m.id === message.id);
          if (existingMsg) {
            return prevMessages; // Don't add duplicate
          }
          // Otherwise add it
          return [...prevMessages, message];
        });
      } else {
        // For AI/Agent/System messages, just add them (addMessage has duplicate check)
        addMessage(message);
      }
      setIsAiTyping(false);
      setIsAgentTyping(false);
    });

    // Listen for AI thinking
    socketService.onAiThinking(({ thinking }) => {
      setIsAiTyping(thinking);
    });

    // Listen for human escalation
    socketService.onEscalatedToHuman(({ message, estimatedWait }) => {
      addMessage({
        id: `system-${Date.now()}`,
        conversation_id: conversation.id,
        content: message + (estimatedWait ? ` Estimated wait: ${estimatedWait} minutes.` : ''),
        role: 'SYSTEM',
        created_at: new Date().toISOString(),
      });
    });

    // Listen for agent joined
    socketService.onAgentJoined(({ agentName: name }) => {
      setAgentName(name);
      addMessage({
        id: `system-${Date.now()}`,
        conversation_id: conversation.id,
        content: `${name} has joined the conversation.`,
        role: 'SYSTEM',
        created_at: new Date().toISOString(),
      });
    });

    // Listen for agent typing
    socketService.onAgentTyping(({ typing }) => {
      setIsAgentTyping(typing);
    });

    // Listen for conversation resolved
    socketService.onConversationResolved(() => {
      addMessage({
        id: `system-${Date.now()}`,
        conversation_id: conversation.id,
        content: 'This conversation has been resolved. Thank you for contacting us!',
        role: 'SYSTEM',
        created_at: new Date().toISOString(),
      });
    });

    // Listen for errors
    socketService.onError(({ message }) => {
      console.error('Socket error:', message);
    });

    hasInitializedRef.current = true;

    // Cleanup on unmount
    return () => {
      if (conversation?.id) {
        socketService.leaveConversation(conversation.id);
      }
      socketService.removeAllListeners();
      hasInitializedRef.current = false;
    };
  }, [conversation?.id, user?.id]);

  /**
   * Start a new conversation
   */
  const startConversation = useCallback(
    async (userData: Omit<StartConversationRequest, 'company_id'>) => {
      try {
        setIsInitializing(true);

        const response = await apiService.startConversation({
          ...userData,
          company_id: companyId,
        });

        setUser(response.user);
        setConversation(response.conversation);

        // If resuming conversation, load history
        if (!response.isNewConversation) {
          const history = await apiService.getConversationHistory(response.conversation.id);
          setMessages(history);
        } else {
          // Add welcome message for new conversations
          setMessages([
            {
              id: 'welcome',
              conversation_id: response.conversation.id,
              content: "Hi! 👋 I'm here to help. What can I assist you with today?",
              role: 'ASSISTANT',
              created_at: new Date().toISOString(),
            },
          ]);
        }

        return response;
      } catch (error) {
        console.error('Failed to start conversation:', error);
        throw error;
      } finally {
        setIsInitializing(false);
      }
    },
    [companyId, setUser, setConversation, setMessages, setIsInitializing]
  );

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversation?.id || !user?.id || !content.trim()) return;

      try {
        setIsSendingMessage(true);

        // Stop typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        socketService.stopTyping(conversation.id);

        // Add user message optimistically
        const userMessage = {
          id: `temp-${Date.now()}`,
          conversation_id: conversation.id,
          content: content.trim(),
          role: 'USER' as const,
          user_id: user.id,
          created_at: new Date().toISOString(),
        };
        addMessage(userMessage);

        // Send via socket for real-time
        if (isConnected) {
          socketService.sendMessage(conversation.id, user.id, content.trim());
        } else {
          // Fallback to HTTP if socket is disconnected
          await apiService.sendMessage(conversation.id, content.trim(), user.id);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        // Could add error handling UI here
      } finally {
        setIsSendingMessage(false);
      }
    },
    [conversation?.id, user?.id, isConnected, addMessage, setIsSendingMessage]
  );

  /**
   * Handle typing indicator
   */
  const handleTyping = useCallback(() => {
    if (!conversation?.id || !user) return;

    const userName = `${user.first_name} ${user.last_name}`;
    socketService.startTyping(conversation.id, userName);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(conversation.id);
    }, 3000);
  }, [conversation?.id, user]);

  return {
    // State
    user,
    conversation,
    messages,
    isConnected,
    isAiTyping,
    isAgentTyping,
    agentName,
    isInitializing,
    isSendingMessage,

    // Actions
    startConversation,
    sendMessage,
    handleTyping,
  };
};