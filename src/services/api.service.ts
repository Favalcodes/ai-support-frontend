import axios, { AxiosInstance } from 'axios';
import type {
  StartConversationRequest,
  StartConversationResponse,
  Message,
} from '../types/chat.types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

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
    return this.baseURL;
  }
}

export const apiService = new ApiService();