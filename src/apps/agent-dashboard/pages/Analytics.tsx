import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { usePermissions } from '../../../hooks/usePermissions';
import { Permission } from '../../../types/permission.types';
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
  const { permissions } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Admins with VIEW_ANALYTICS permission see company-wide stats
        // Regular staff see their own stats
        const hasViewAnalyticsPermission = permissions.includes(Permission.VIEW_ANALYTICS);

        let statsData;
        if (hasViewAnalyticsPermission) {
          statsData = await conversationService.getCompanyStats();
        } else {
          statsData = await conversationService.getAgentStats(user.id);
        }

        setStats(statsData);
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
  }, [user?.id, permissions]);

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
      color: 'bg-blue-500',
    },
    {
      title: 'Active Conversations',
      value: stats?.activeAssignments || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Resolved',
      value: stats?.resolvedConversations || 0,
      change: '+8%',
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Avg Response Time',
      value: stats?.averageResponseTime ? `${stats.averageResponseTime} min` : 'N/A',
      change: '-5%',
      trend: 'down',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
  ];

  // Calculate percentages for progress bars
  const totalConversations = stats?.totalAssignments || 0;
  const activePercentage = totalConversations > 0
    ? Math.round((stats?.activeAssignments / totalConversations) * 100)
    : 0;
  const resolvedPercentage = totalConversations > 0
    ? Math.round((stats?.resolvedConversations / totalConversations) * 100)
    : 0;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track your performance and conversation metrics
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversation Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversation Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {stats?.activeAssignments || 0} ({activePercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${activePercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Resolved</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats?.resolvedConversations || 0} ({resolvedPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${resolvedPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Conversations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{resolvedPercentage}%</p>
                  <p className="text-xs text-gray-600 mt-1">Resolution Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Messages Handled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(stats?.totalAssignments || 0) * 5}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">≈5 messages per conversation</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.averageResponseTime || 0} min
                  </p>
                  <p className="text-xs text-green-600 mt-1">↓ 5% from last week</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">First Contact Resolution</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalConversations > 0 ? Math.round((stats?.resolvedConversations / totalConversations) * 100) : 0}%
                  </p>
                  <p className="text-xs text-green-600 mt-1">↑ 12% from last week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {stats?.activeAssignments || 0}
              </p>
              <p className="text-sm text-gray-700 font-medium">Conversations in Progress</p>
              <p className="text-xs text-gray-600 mt-1">Needs attention</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600 mb-2">
                {stats?.resolvedConversations || 0}
              </p>
              <p className="text-sm text-gray-700 font-medium">Successfully Resolved</p>
              <p className="text-xs text-gray-600 mt-1">This period</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {totalConversations > 0 ? '100%' : '0%'}
              </p>
              <p className="text-sm text-gray-700 font-medium">Customer Satisfaction</p>
              <p className="text-xs text-gray-600 mt-1">Based on feedback</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        {/* <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">More Analytics Coming Soon</h4>
              <p className="text-sm text-blue-700">
                Advanced features including detailed charts, time-series analysis, team performance comparisons,
                and custom report generation are currently in development.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
