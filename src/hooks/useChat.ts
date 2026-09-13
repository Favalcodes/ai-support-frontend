import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { apiService } from '@/services/api.service';
import { socketService } from '@/services/socket';
import {
  clearVisitorSession,
  loadVisitorSession,
  saveVisitorSession,
} from '@/utils/visitorSession';
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
   * Initialize socket connection early (even without conversation)
   */
  useEffect(() => {
    const socket = socketService.connect();

    // Update connection status
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  /**
   * Join conversation room when conversation and user are available
   */
  useEffect(() => {
    if (!conversation?.id || !user?.id || hasInitializedRef.current) return;

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

        /**
         * Remember the visitor so a reload resumes instead of starting over.
         * The server matches on email and reuses a conversation that is still
         * active, so storing the address is what makes the resume possible.
         */
        saveVisitorSession(companyId, {
          userId: response.user.id,
          conversationId: response.conversation.id,
          email: response.user.email,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
        });

        // If resuming conversation, load history
        if (!response.isNewConversation) {
          const history = await apiService.getConversationHistory(
            response.conversation.id,
            response.user.id
          );
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
   * Resume the conversation this visitor was already in, if we remember them.
   *
   * Returns false when there is nothing stored, or when the stored visitor no
   * longer resolves, so the caller can fall back to the pre-chat form.
   */
  const resumeStoredConversation = useCallback(async () => {
    const stored = loadVisitorSession(companyId);
    if (!stored) return false;

    try {
      await startConversation({
        first_name: stored.firstName,
        last_name: stored.lastName,
        email: stored.email,
      } as Omit<StartConversationRequest, 'company_id'>);
      return true;
    } catch (error) {
      // Stale record: the company or visitor is gone. Forget it and start clean.
      console.error('Failed to resume stored conversation:', error);
      clearVisitorSession(companyId);
      return false;
    }
  }, [companyId, startConversation]);

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
        const optimisticId = `temp-${Date.now()}`;
        const userMessage = {
          id: optimisticId,
          conversation_id: conversation.id,
          content: content.trim(),
          role: 'USER' as const,
          user_id: user.id,
          created_at: new Date().toISOString(),
        };
        addMessage(userMessage);

        /**
         * Prefer the socket, because the reply arrives on the `new_message`
         * listener above. Fall back to HTTP when it is not connected.
         *
         * Ask the socket directly rather than trusting the `isConnected` flag in
         * the store: that flag is set by an event handler and is still false for
         * the first moments after mount, so an early send took the HTTP branch.
         */
        const socketReady = socketService.isConnected();

        if (socketReady) {
          socketService.sendMessage(conversation.id, user.id, content.trim());
        } else {
          setIsAiTyping(true);
          try {
            /**
             * The HTTP reply has to be rendered here. Nothing is listening for
             * it on this path, so previously the response was awaited and then
             * dropped: the visitor saw their own message appear and never got an
             * answer, which looked exactly like the AI ignoring them.
             */
            const { userMessage: savedUserMessage, aiMessage } =
              await apiService.sendMessage(conversation.id, content.trim(), user.id);

            /**
             * Swap the optimistic bubble for the stored row. Without this the
             * temp message survived with its own client-side timestamp, and the
             * next history load brought the real row back alongside it, so the
             * visitor saw their question twice at two different times.
             */
            if (savedUserMessage) {
              updateMessages((prevMessages) =>
                prevMessages.map((m) => (m.id === optimisticId ? savedUserMessage : m))
              );
            }

            if (aiMessage) addMessage(aiMessage);
          } finally {
            setIsAiTyping(false);
          }
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        // Could add error handling UI here
      } finally {
        setIsSendingMessage(false);
      }
    },
    [conversation?.id, user?.id, addMessage, updateMessages, setIsAiTyping, setIsSendingMessage]
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
    resumeStoredConversation,
    sendMessage,
    handleTyping,
  };
};