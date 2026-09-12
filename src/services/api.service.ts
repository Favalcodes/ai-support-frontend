import { publicApi } from './api';
import type {
  StartConversationRequest,
  StartConversationResponse,
  Message,
} from '../types/chat.types';

/**
 * Conversation calls made by the embedded widget on behalf of an anonymous
 * visitor. Uses the shared public client rather than its own axios instance.
 */
class ApiService {
  private readonly api = publicApi;

  /**
   * Start a new conversation or resume existing one
   */
  async startConversation(data: StartConversationRequest): Promise<StartConversationResponse> {
    try {
      const response = await this.api.post('/conversation', data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw new Error('Unable to start conversation. Please try again.');
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<Message[]> {
    try {
      const response = await this.api.get(`/conversation/${conversationId}/messages`);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      return [];
    }
  }

  /**
   * Send a message via HTTP (fallback if socket fails)
   */
  async sendMessage(
    conversationId: string,
    message: string,
    userId: string
  ): Promise<Message> {
    try {
      // The DTO field is user_id; `userId` failed whitelist validation with a 422.
      const response = await this.api.post(`/conversation/${conversationId}/messages`, {
        message,
        user_id: userId,
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Unable to send message. Please try again.');
    }
  }

  getBaseURL(): string {
    return this.api.defaults.baseURL ?? '';
  }
}

export const apiService = new ApiService();