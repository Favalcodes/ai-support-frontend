import { useCallback } from 'react';
import { useConversationStore } from '../stores/conversationStore';
import { conversationService } from '../services/conversation.service';
import { Conversation } from '../types/conversation.types';

export const useConversation = () => {
  const {
    conversations,
    activeConversation,
    unassignedCount,
    isLoading,
    setConversations,
    addConversation,
    updateConversation,
    removeConversation,
    setActiveConversation,
    setUnassignedCount,
    setLoading,
  } = useConversationStore();

  const loadAgentConversations = useCallback(
    async (agentId: string, status?: string) => {
      try {
        setLoading(true);
        const data = await conversationService.getAgentConversations(agentId, status);
        setConversations(data);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    },
    [setConversations, setLoading]
  );

  const loadUnassignedConversations = useCallback(
    async (companyId: string) => {
      try {
        const data = await conversationService.getUnassignedConversations(companyId);
        setUnassignedCount(data.length);
        return data;
      } catch (error) {
        console.error('Failed to load unassigned conversations:', error);
        return [];
      }
    },
    [setUnassignedCount]
  );

  const assignToAgent = useCallback(
    async (conversationId: string, agentId: string) => {
      try {
        const updated = await conversationService.assignConversation(conversationId, agentId);
        updateConversation(conversationId, updated);
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to assign conversation',
        };
      }
    },
    [updateConversation]
  );

  const transferToAgent = useCallback(
    async (conversationId: string, newAgentId: string, currentAgentId: string) => {
      try {
        const updated = await conversationService.transferConversation(
          conversationId,
          newAgentId,
          currentAgentId
        );
        updateConversation(conversationId, updated);
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to transfer conversation',
        };
      }
    },
    [updateConversation]
  );

  const resolveConversation = useCallback(
    async (conversationId: string, agentId: string, notes?: string) => {
      try {
        const updated = await conversationService.resolveConversation(
          conversationId,
          agentId,
          notes
        );
        updateConversation(conversationId, updated);
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to resolve conversation',
        };
      }
    },
    [updateConversation]
  );

  const selectConversation = useCallback(
    (conversation: Conversation | null) => {
      setActiveConversation(conversation);
    },
    [setActiveConversation]
  );

  return {
    conversations,
    activeConversation,
    unassignedCount,
    isLoading,
    loadAgentConversations,
    loadUnassignedConversations,
    assignToAgent,
    transferToAgent,
    resolveConversation,
    selectConversation,
    addConversation,
    updateConversation,
  };
};