import api from './api';
import type { User } from '../types/user.types';

export interface Staff {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  live_status: string;
  last_online: Date;
  created_at: Date;
  departments?: Array<{ id: string; name: string; color?: string; icon?: string }>;
  is_all_rounder?: boolean;
}

export interface CreateStaffDto {
  email: string;
  role: string;
  company_id: string;
  department_ids?: string[];
  is_all_rounder?: boolean;
}

export interface UpdateStaffDto {
  role?: string;
  live_status?: string;
  department_ids?: string[];
  is_all_rounder?: boolean;
}

export const staffService = {
  // Get all staff for a company
  async getCompanyStaff(companyId: string): Promise<Staff[]> {
    const response = await api.get(`/staff/company/${companyId}/agents`);
    return response.data.data;
  },

  // Onboard new staff member
  async onboardStaff(data: CreateStaffDto): Promise<User> {
    const response = await api.post('/auth/onboard-staff', data);
    return response.data.data;
  },

  // Update staff member
  async updateStaff(staffId: string, data: UpdateStaffDto): Promise<Staff> {
    const response = await api.patch(`/staff/${staffId}`, data);
    return response.data.data;
  },

  // Deactivate staff member
  async deactivateStaff(staffId: string): Promise<void> {
    await api.delete(`/staff/${staffId}`);
  },

  // Get staff statistics
  async getStaffStats(staffId: string): Promise<{
    activeConversations: number;
    totalConversationsHandled: number;
    resolvedConversations: number;
    currentLoad: number;
  }> {
    const response = await api.get(`/staff/agents/${staffId}/stats`);
    return response.data.data;
  },
};
