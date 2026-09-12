import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  Bot,
  Star,
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { usePermissions } from '../../../hooks/usePermissions';
import { Permission } from '../../../types/permission.types';
import { Spinner } from '../../../components/ui';
import {
  analyticsService,
  type AnalyticsStats,
  type ConversationTrend,
  type CategoryStats,
} from '../../../services/analytics.service';

interface StatCard {
  title: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  color: string;
}

/** Seconds to a compact human duration. The API reports seconds. */
const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return 'N/A';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
};

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { permissions } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [trends, setTrends] = useState<ConversationTrend[]>([]);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  const canViewCompanyWide = permissions.includes(Permission.VIEW_ANALYTICS);

  useEffect(() => {
    const load = async () => {
      if (!user?.company_id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Admins see the whole company; an agent sees only their own numbers.
        const agentId = canViewCompanyWide ? undefined : user.id;

        const [statsData, trendData, categoryData] = await Promise.all([
          analyticsService.getStats(user.company_id, agentId),
          analyticsService.getConversationTrends(user.company_id, 14),
          analyticsService.getCategoryStats(user.company_id),
        ]);

        setStats(statsData);
        setTrends(trendData);
        setCategories(categoryData);

        if (canViewCompanyWide) {
          setAgents(await analyticsService.getAgentPerformance(user.company_id));
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Could not load analytics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user?.id, user?.company_id, canViewCompanyWide]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const total = stats?.totalConversations ?? 0;
  const active = stats?.activeConversations ?? 0;
  const resolved = stats?.resolvedConversations ?? 0;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  // No fabricated deltas: the previous version hardcoded "+12%", "+8%", "-5%"
  // and a flat 100% satisfaction regardless of the underlying data.
  const statCards: StatCard[] = [
    {
      title: 'Total Conversations',
      value: total,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Active',
      value: active,
      hint: `${pct(active)}% of all`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Resolved',
      value: resolved,
      hint: `${pct(resolved)}% of all`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Avg Response Time',
      value: formatDuration(stats?.averageResponseTime ?? 0),
      hint: 'visitor message to reply',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Resolved by AI',
      value: `${stats?.aiResolutionRate ?? 0}%`,
      hint: `${stats?.escalationRate ?? 0}% escalated`,
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-cyan-500',
    },
    {
      title: 'Satisfaction',
      value: stats?.customerSatisfaction ? `${stats.customerSatisfaction} / 5` : 'No ratings',
      hint: 'average rating',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-amber-500',
    },
  ];

  const peakTrend = Math.max(1, ...trends.map((t) => t.count));

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            {canViewCompanyWide
              ? 'Company-wide conversation metrics'
              : 'Your personal conversation metrics'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.hint && <p className="text-xs text-gray-500 mt-1">{stat.hint}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversations per day */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversations, last 14 days</h3>
            {trends.length === 0 ? (
              <p className="text-sm text-gray-500">No conversations in this period.</p>
            ) : (
              <div className="flex items-end gap-1 h-40" role="img" aria-label="Conversations per day">
                {trends.map((t) => (
                  <div key={t.date} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <span className="text-[10px] text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.count}
                    </span>
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                      style={{ height: `${Math.max((t.count / peakTrend) * 100, 2)}%` }}
                      title={`${t.date}: ${t.count}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">By category</h3>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categorised conversations yet.</p>
            ) : (
              <div className="space-y-4">
                {categories.slice(0, 6).map((c) => (
                  <div key={c.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{c.category}</span>
                      <span className="text-sm text-gray-600">
                        {c.count} ({c.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Agent performance, admins only */}
        {canViewCompanyWide && agents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Agent performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b border-gray-200">
                    <th className="pb-3 font-medium">Agent</th>
                    <th className="pb-3 font-medium">Assigned</th>
                    <th className="pb-3 font-medium">Active</th>
                    <th className="pb-3 font-medium">Resolved</th>
                    <th className="pb-3 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a) => (
                    <tr key={a.staffId} className="border-b border-gray-100 last:border-0">
                      <td className="py-3">
                        <div className="font-medium text-gray-900">
                          {[a.firstName, a.lastName].filter(Boolean).join(' ') || a.email}
                        </div>
                        <div className="text-xs text-gray-500">{a.role}</div>
                      </td>
                      <td className="py-3 text-gray-700">{a.assignedConversations}</td>
                      <td className="py-3 text-gray-700">{a.activeConversations}</td>
                      <td className="py-3 text-gray-700">{a.resolvedConversations}</td>
                      <td className="py-3 text-gray-700">
                        {a.averageRating ? `${a.averageRating} / 5` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
