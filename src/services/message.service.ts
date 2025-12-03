import api from './api';
import { Message } from '../types/message.types';

export const messageService = {
  // Get all messages for a conversation
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get(`/conversation/${conversationId}/messages`);
    return response.data.data;
  },

  // Send a message from agent
  async sendAgentMessage(conversationId: string, content: string): Promise<Message> {
    const response = await api.post(`/staff/conversations/${conversationId}/agent-message`, {
      message: content,
    });
    return response.data.data;
  },

  // Send a message (general - for users)
  async sendMessage(conversationId: string, content: string, userId: string): Promise<Message> {
    const response = await api.post(`/conversation/${conversationId}/messages`, {
      message: content,
      userId,
    });
    return response.data.data;
  },

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await api.post(`/conversation/${conversationId}/messages/read`, { userId });
  },

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    const response = await api.get(`/messages/unread/${userId}`);
    return response.data.count || 0;
  },
};
