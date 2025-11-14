import api from './api';
import { Conversation } from '../types/conversation.types';

export const conversationService = {
    // Get all conversations for an agent
    async getAgentConversations(agentId: string, status?: string): Promise<Conversation[]> {
        const params = status ? { status } : {};
        const response = await api.get(`/agents/${agentId}/conversations`, { params });
        return response.data;
    },

    // Get unassigned conversations
    async getUnassignedConversations(companyId: string): Promise<Conversation[]> {
        const response = await api.get(`/conversations/unassigned/${companyId}`);
        return response.data;
    },

    // Get single conversation by ID
    async getConversation(conversationId: string): Promise<Conversation> {
        const response = await api.get(`/conversations/${conversationId}`);
        return response.data;
    },

    // Assign conversation to agent
    async assignConversation(conversationId: string, agentId: string): Promise<Conversation> {
        const response = await api.post(`/conversations/assign`, {
            conversationId,
            agentId,
        });
        return response.data;
    },

    // Transfer conversation to another agent
    async transferConversation(
        conversationId: string,
        newAgentId: string,
        currentAgentId: string
    ): Promise<Conversation> {
        const response = await api.post(`/agent/conversations/${conversationId}/transfer`, {
            newAgentId,
            currentAgentId,
        });
        return response.data;
    },

    // Resolve conversation
    async resolveConversation(
        conversationId: string,
        agentId: string,
        resolutionNotes?: string
    ): Promise<Conversation> {
        const response = await api.post(`/agent/conversations/${conversationId}/resolve`, {
            agentId,
            resolutionNotes,
        });
        return response.data;
    },

    // Reopen conversation
    async reopenConversation(conversationId: string): Promise<Conversation> {
        const response = await api.post(`/agent/conversations/${conversationId}/reopen`);
        return response.data;
    },

    // Get conversation history for a user
    async getUserConversationHistory(
        userId: string,
        companyId: string,
        limit = 10
    ): Promise<Conversation[]> {
        const response = await api.get(`/conversations/history/${userId}/${companyId}`, {
            params: { limit },
        });
        return response.data;
    },

    // Start new conversation (for chat widget)
    async startConversation(data: {
        email: string;
        first_name: string;
        last_name: string;
        company_id: string;
        category_id?: string;
    }): Promise<{ conversation: Conversation; user: any; isNewConversation: boolean }> {
        const response = await api.post('/conversations/start', data);
        return response.data;
    },
};