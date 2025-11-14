import api from './api';
import { Message } from '../types/message.types';

export const messageService = {
  // Get all messages for a conversation
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Send a message (agent)
  async sendMessage(
    conversationId: string,
    content: string,
    userId: string
  ): Promise<Message> {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
      message: content,
      userId,
    });
    return response.data;
  },

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await api.post(`/conversations/${conversationId}/messages/read`, { userId });
  },

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    const response = await api.get(`/messages/unread/${userId}`);
    return response.data.count;
  },
};