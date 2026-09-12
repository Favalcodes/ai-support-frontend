import React, { useEffect, useState } from 'react';
import { CheckCircle, Calendar, User, MessageSquare, Search } from 'lucide-react';
import { useAuth, useConversation } from '../../../hooks';
import { usePermissions } from '../../../hooks/usePermissions';
import { Permission } from '../../../types/permission.types';
import { Conversation } from '../../../types/conversation.types';
import { formatDate } from '../../../utils/formatters';
import { Badge, Button, Input, Spinner } from '../../../components/ui';

export const ResolvedPage: React.FC = () => {
  const { user } = useAuth();
  const { permissions } = usePermissions();
  const { loadAgentConversations, loadCompanyConversations } = useConversation();
  const [resolvedConversations, setResolvedConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    const loadResolvedConversations = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Admins with VIEW_ALL_CONVERSATIONS permission see all company resolved conversations
        // Regular staff see only their resolved conversations
        const hasViewAllPermission = permissions.includes(Permission.VIEW_ALL_CONVERSATIONS);

        let conversations;
        if (hasViewAllPermission) {
          const result = await loadCompanyConversations({ status: 'CLOSED' });
          conversations = result.data;
        } else {
          conversations = await loadAgentConversations(user.id, 'CLOSED');
        }

        setResolvedConversations(conversations || []);
      } catch (error) {
        console.error('Failed to load resolved conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResolvedConversations();
  }, [user?.id, permissions, loadAgentConversations, loadCompanyConversations]);

  // Filter conversations based on search and period
  const filteredConversations = resolvedConversations.filter((conv) => {
    // Search filter
    const matchesSearch = searchQuery
      ? conv.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Period filter
    const now = new Date();
    const resolvedDate = new Date(conv.updated_at);
    let matchesPeriod = true;

    if (filterPeriod === 'today') {
      matchesPeriod = resolvedDate.toDateString() === now.toDateString();
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = resolvedDate >= weekAgo;
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesPeriod = resolvedDate >= monthAgo;
    }

    return matchesSearch && matchesPeriod;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resolved Conversations</h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage your resolved support conversations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              {filteredConversations.length} Resolved
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search by customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterPeriod === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterPeriod('all')}
            >
              All Time
            </Button>
            <Button
              variant={filterPeriod === 'today' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterPeriod('today')}
            >
              Today
            </Button>
            <Button
              variant={filterPeriod === 'week' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterPeriod('week')}
            >
              This Week
            </Button>
            <Button
              variant={filterPeriod === 'month' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterPeriod('month')}
            >
              This Month
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filterPeriod !== 'all'
                ? 'No conversations found'
                : 'No resolved conversations yet'}
            </h3>
            <p className="text-gray-600 max-w-md">
              {searchQuery || filterPeriod !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Resolved conversations will appear here after you close support tickets'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {conversation.user?.first_name} {conversation.user?.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{conversation.user?.email}</p>
                      {conversation.category && (
                        <Badge variant="info" className="mt-2">
                          {conversation.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolved
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Created {formatDate(conversation.created_at, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Resolved {formatDate(conversation?.last_activity, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {conversation.message_count || 0} messages
                    </span>
                  </div>
                </div>

                {conversation.resolution_notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Resolution Notes
                    </p>
                    <p className="text-sm text-gray-700">{conversation.resolution_notes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" size="sm">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Reopen
                  </Button>
                  <Button variant="ghost" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
