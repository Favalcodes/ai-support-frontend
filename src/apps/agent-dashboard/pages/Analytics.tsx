import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { Badge, Spinner } from '../../../components/ui';
import { conversationService } from '../../../services/conversation.service';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const agentStats = await conversationService.getAgentStats(user.id);
        setStats(agentStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({
          totalAssignments: 0,
          activeAssignments: 0,
          resolvedConversations: 0,
          averageResponseTime: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      title: 'Total Conversations',
      value: stats?.totalAssignments || 0,
      change: '+12%',
      trend: 'up',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Conversations',
      value: stats?.activeAssignments || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Resolved',
      value: stats?.resolvedConversations || 0,
      change: '+8%',
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Avg Response Time',
      value: stats?.averageResponseTime ? `${stats.averageResponseTime} min` : 'N/A',
      change: '-5%',
      trend: 'down',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track your performance and conversation metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                {stat.change && (
                  <Badge
                    variant={stat.trend === 'up' ? 'success' : 'default'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Analytics in Development</h4>
              <p className="text-sm text-blue-700">
                Full analytics features including charts, detailed reports, and advanced metrics
                are currently being developed. Currently showing basic statistics from your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
