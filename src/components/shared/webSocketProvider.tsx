import React, { useEffect } from 'react';
import { useAuth, useSocket } from '../../hooks';
import { useConversationStore, useMessageStore } from '../../stores';
import { useTypingStore } from '../../stores/typingStore';
import { SOCKET_EVENTS } from '../../utils/constants';
import { Message } from '../../types/message.types';
import { ConversationStatus } from '@/types/conversation.types';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { socket, on, off } = useSocket();
  const { updateConversation } = useConversationStore();
  const { addMessage } = useMessageStore();
  const { addTypingUser, removeTypingUser } = useTypingStore();

  useEffect(() => {
    if (!isAuthenticated || !socket || !user) return;

    // Handler for new messages
    const handleNewMessage = (data: { message: Message }) => {
      console.log('📨 New message received:', data);
      addMessage(data.message.conversation_id, data.message);
      
      // Update conversation last activity
      updateConversation(data.message.conversation_id, {
        last_activity: data.message.created_at,
      });
    };

    // Handler for AI thinking
    const handleAIThinking = (data: { conversationId: string; thinking: boolean }) => {
      console.log('🤖 AI thinking:', data);
      // You can show/hide typing indicator here
    };

    // Handler for escalation to human
    const handleEscalatedToHuman = (data: { conversationId: string }) => {
      console.log('🚨 Escalated to human:', data);
      updateConversation(data.conversationId, {
        needs_human_agent: true,
      });
    };

    // Handler for agent joined
    const handleAgentJoined = (data: {
      conversationId: string;
      agentId: string;
      agentName: string;
      message: Message;
    }) => {
      console.log('👤 Agent joined:', data);
      addMessage(data.conversationId, data.message);
      updateConversation(data.conversationId, {
        assigned_staff_id: data.agentId,
        needs_human_agent: false,
      });
    };

    // Handler for agent assignment (when YOU are assigned)
    const handleAgentAssignment = (data: {
      conversationId: string;
      userName: string;
      companyName: string;
    }) => {
      console.log('✅ You were assigned to conversation:', data);
      // Show notification
      // You can add a toast notification here
    };

    // Handler for conversation transferred
    const handleConversationTransferred = (data: {
      conversationId: string;
      newAgentId: string;
      newAgentName: string;
      message: Message;
    }) => {
      console.log('🔄 Conversation transferred:', data);
      addMessage(data.conversationId, data.message);
      updateConversation(data.conversationId, {
        assigned_staff_id: data.newAgentId,
      });
    };

    // Handler for conversation resolved
    const handleConversationResolved = (data: { conversationId: string }) => {
      console.log('✅ Conversation resolved:', data);
      updateConversation(data.conversationId, {
        status: ConversationStatus.RESOLVED,
        active: false,
      });
    };

    // Handler for typing indicators
    const handleUserTyping = (data: { conversationId: string; typing: boolean; userName: string }) => {
      console.log('⌨️ User typing:', data);
      if (data.typing) {
        addTypingUser(data.conversationId, data.userName);
      } else {
        removeTypingUser(data.conversationId, data.userName);
      }
    };

    const handleAgentTyping = (data: { conversationId: string; typing: boolean; agentName: string }) => {
      console.log('⌨️ Agent typing:', data);
      if (data.typing) {
        addTypingUser(data.conversationId, data.agentName);
      } else {
        removeTypingUser(data.conversationId, data.agentName);
      }
    };

    // Register all event listeners
    on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    on(SOCKET_EVENTS.AI_THINKING, handleAIThinking);
    on(SOCKET_EVENTS.ESCALATED_TO_HUMAN, handleEscalatedToHuman);
    on(SOCKET_EVENTS.AGENT_JOINED, handleAgentJoined);
    on(SOCKET_EVENTS.AGENT_ASSIGNMENT, handleAgentAssignment);
    on(SOCKET_EVENTS.CONVERSATION_TRANSFERRED, handleConversationTransferred);
    on(SOCKET_EVENTS.CONVERSATION_RESOLVED, handleConversationResolved);
    on(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
    on(SOCKET_EVENTS.AGENT_TYPING, handleAgentTyping);

    // Cleanup on unmount
    return () => {
      off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      off(SOCKET_EVENTS.AI_THINKING, handleAIThinking);
      off(SOCKET_EVENTS.ESCALATED_TO_HUMAN, handleEscalatedToHuman);
      off(SOCKET_EVENTS.AGENT_JOINED, handleAgentJoined);
      off(SOCKET_EVENTS.AGENT_ASSIGNMENT, handleAgentAssignment);
      off(SOCKET_EVENTS.CONVERSATION_TRANSFERRED, handleConversationTransferred);
      off(SOCKET_EVENTS.CONVERSATION_RESOLVED, handleConversationResolved);
      off(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
      off(SOCKET_EVENTS.AGENT_TYPING, handleAgentTyping);
    };
  }, [isAuthenticated, socket, user, on, off, addMessage, updateConversation]);

  return <>{children}</>;
};