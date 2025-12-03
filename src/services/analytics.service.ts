import api from './api';

export interface AnalyticsStats {
  totalConversations: number;
  activeConversations: number;
  resolvedConversations: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  aiResolutionRate: number;
  escalationRate: number;
}

export interface ConversationTrend {
  date: string;
  count: number;
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

export const analyticsService = {
  // Get overall stats for a company or agent
  async getStats(companyId: string, agentId?: string): Promise<AnalyticsStats> {
    const params = agentId ? { agentId } : {};
    const response = await api.get(`/analytics/stats/${companyId}`, { params });
    return response.data.data;
  },

  // Get conversation trends over time
  async getConversationTrends(companyId: string, days = 30): Promise<ConversationTrend[]> {
    const response = await api.get(`/analytics/trends/${companyId}`, {
      params: { days },
    });
    return response.data.data;
  },

  // Get category distribution
  async getCategoryStats(companyId: string): Promise<CategoryStats[]> {
    const response = await api.get(`/analytics/categories/${companyId}`);
    return response.data.data;
  },

  // Get agent performance (if admin/super admin)
  async getAgentPerformance(companyId: string): Promise<any[]> {
    const response = await api.get(`/analytics/agents/${companyId}`);
    return response.data.data;
  },
};
