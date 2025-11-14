import api from './api';
import { User } from '../types/user.types';

export const userService = {
  // Get user by ID
  async getUser(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  // Get all agents for a company
  async getCompanyAgents(companyId: string): Promise<User[]> {
    const response = await api.get(`/companies/${companyId}/agents`);
    return response.data;
  },

  // Get agent statistics
  async getAgentStats(agentId: string): Promise<{
    openConversations: number;
    resolvedToday: number;
    totalResolved: number;
    averageResponseTime: number;
  }> {
    const response = await api.get(`/agent/stats/${agentId}`);
    return response.data;
  },
};