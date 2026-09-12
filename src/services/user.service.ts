import api from './api';
import { User } from '../types/user.types';

export interface UpdateProfileDto {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await api.get('/user/profile');
    return response.data.data;
  },

  // Update current user profile
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.patch('/user/profile', data);
    return response.data.data.user || response.data.data;
  },

  // Change password
  async changePassword(data: ChangePasswordDto): Promise<void> {
    await api.post('/auth/change-password', data);
  },

  // Delete account
  async deleteAccount(): Promise<void> {
    await api.delete('/user/delete');
  },

  // Get user by ID (no such endpoint on the API; /user/profile only returns self)
  async getUser(_userId: string): Promise<User> {
    console.warn('getUser: Backend endpoint not implemented yet');
    throw new Error('Get user by ID functionality not yet implemented');
  },

  // Get all agents for a company
  async getCompanyAgents(companyId: string): Promise<User[]> {
    const response = await api.get(`/staff/company/${companyId}/agents`);
    return response.data.data;
  },

  // Get agent statistics
  async getAgentStats(agentId: string): Promise<{
    activeConversations: number;
    totalConversationsHandled: number;
    resolvedConversations: number;
    currentLoad: number;
  }> {
    const response = await api.get(`/staff/agents/${agentId}/stats`);
    return response.data.data;
  },
};