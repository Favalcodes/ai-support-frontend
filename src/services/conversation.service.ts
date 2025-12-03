import api from './api';
import { Conversation } from '../types/conversation.types';

export type { Conversation } from '../types/conversation.types';

export const conversationService = {
    // Get all conversations for an agent
    async getAgentConversations(agentId: string, status?: string): Promise<Conversation[]> {
        const params = status ? { status } : {};
        const response = await api.get(`/staff/agents/${agentId}/conversations`, { params });
        return response.data.data;
    },

    // Get unassigned conversations
    async getUnassignedConversations(companyId: string): Promise<Conversation[]> {
        const response = await api.get(`/staff/conversations/unassigned/${companyId}`);
        return response.data.data;
    },

    // Get single conversation by ID
    async getConversation(conversationId: string): Promise<Conversation> {
        const response = await api.get(`/conversation/${conversationId}`);
        return response.data.data;
    },

    // Assign conversation to agent
    async assignConversation(conversationId: string, staffId: string): Promise<Conversation> {
        const response = await api.post(`/staff/conversations/assign`, {
            conversationId,
            staffId,
        });
        return response.data.data;
    },

    // Transfer conversation to another agent
    async transferConversation(
        conversationId: string,
        newStaffId: string
    ): Promise<Conversation> {
        const response = await api.post(`/staff/conversations/reassign`, {
            conversationId,
            newStaffId,
        });
        return response.data.data;
    },

    // Resolve conversation
    async resolveConversation(
        conversationId: string,
        resolutionNotes?: string
    ): Promise<Conversation> {
        const response = await api.post(`/staff/conversations/${conversationId}/resolve`, {
            resolutionNotes,
        });
        return response.data.data;
    },

    // Reopen conversation  
    async reopenConversation(conversationId: string): Promise<Conversation> {
        const response = await api.patch(`/conversation/${conversationId}`, {
            status: 'OPEN',
        });
        return response.data.data;
    },

    // Get conversation history for a user
    async getUserConversationHistory(
        userId: string,
        companyId: string,
        limit = 10
    ): Promise<Conversation[]> {
        const response = await api.get(`/conversation`, {
            params: { userId, companyId, limit },
        });
        return response.data.data;
    },

    // Get conversations with filters
    async getConversations(params: {
        company_id?: string;
        user_id?: string;
        status?: string;
        limit?: number;
    }): Promise<Conversation[]> {
        const response = await api.get(`/conversation`, { params });
        return response.data.data;
    },

    // Start new conversation (for chat widget)
    async startConversation(data: {
        email: string;
        first_name: string;
        last_name: string;
        company_id: string;
        category_id?: string;
    }): Promise<{ conversation: Conversation; user: any; isNewConversation: boolean }> {
        const response = await api.post('/conversation', data);
        return response.data.data;
    },

    // Get assignment history
    async getAssignmentHistory(conversationId: string): Promise<any[]> {
        const response = await api.get(`/staff/conversations/${conversationId}/assignment-history`);
        return response.data.data;
    },

    // Get agent stats
    async getAgentStats(staffId: string): Promise<any> {
        const response = await api.get(`/staff/agents/${staffId}/stats`);
        return response.data.data;
    },

    // Save conversation notes
    async saveConversationNotes(conversationId: string, notes: string): Promise<void> {
        await api.patch(`/conversation/${conversationId}`, {
            notes,
        });
    },

    // Get conversation notes
    async getConversationNotes(conversationId: string): Promise<string> {
        const response = await api.get(`/conversation/${conversationId}`);
        return response.data.data.notes || '';
    },
};
