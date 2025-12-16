import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Star } from 'lucide-react';
import { Conversation, ConversationStatus } from '../../../types/conversation.types';
import { Avatar, Badge } from '../../../components/ui';
import { formatRelativeTime } from '../../../utils/formatters';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
  onFilterChange?: (filters: Filters) => void;
}

export interface Filters {
  status: ConversationStatus | 'ALL';
  dateRange: 'all' | 'today' | 'week' | 'month';
  assignedOnly: boolean;
  escalatedOnly: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading = false,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: 'ALL',
    dateRange: 'all',
    assignedOnly: false,
    escalatedOnly: false,
  });

  // Notify parent component when filters change (for backend fetching)
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const isWithinDateRange = (date: string, range: string): boolean => {
    const conversationDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - conversationDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    switch (range) {
      case 'today':
        return diffDays < 1;
      case 'week':
        return diffDays < 7;
      case 'month':
        return diffDays < 30;
      default:
        return true;
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const userName = `${conv.user?.first_name} ${conv.user?.last_name}`.toLowerCase();
    const userEmail = conv.user?.email?.toLowerCase() || '';
    const matchesSearch = userName.includes(searchLower) || userEmail.includes(searchLower);

    if (!matchesSearch) return false;

    // Status filter
    if (filters.status !== 'ALL' && conv.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (!isWithinDateRange(conv.last_activity, filters.dateRange)) {
      return false;
    }

    // Assigned only filter
    if (filters.assignedOnly && !conv.assigned_staff_id) {
      return false;
    }

    // Escalated only filter
    if (filters.escalatedOnly && !conv.needs_human_agent) {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      dateRange: 'all',
      assignedOnly: false,
      escalatedOnly: false,
    });
  };

  const hasActiveFilters =
    filters.status !== 'ALL' ||
    filters.dateRange !== 'all' ||
    filters.assignedOnly ||
    filters.escalatedOnly;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'CLOSED':
        return <Badge variant="default" size="sm">Closed</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (categoryName?: string) => {
    if (!categoryName) return null;
    
    const colors: Record<string, 'info' | 'warning' | 'default'> = {
      'Technical': 'info',
      'Billing': 'warning',
      'General': 'default',
    };

    return (
      <Badge variant={colors[categoryName] || 'default'} size="sm">
        {categoryName}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">My Conversations</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-primary-100 text-primary-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {filteredConversations.length} of {conversations.length} conversations
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value as ConversationStatus | 'ALL' })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value as Filters['dateRange'] })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Checkbox Filters */}
            <div className="space-y-2">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.assignedOnly}
                  onChange={(e) => setFilters({ ...filters, assignedOnly: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2">Assigned to me only</span>
              </label>

              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.escalatedOnly}
                  onChange={(e) => setFilters({ ...filters, escalatedOnly: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2">Escalated only</span>
              </label>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4 text-center">
            <div>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`
                  p-4 border-b border-gray-200 cursor-pointer transition-colors
                  hover:bg-gray-50
                  ${
                    activeConversationId === conversation.id
                      ? 'bg-primary-50 border-l-4 border-l-primary-500'
                      : ''
                  }
                `}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <Avatar
                    name={`${conversation.user?.first_name} ${conversation.user?.last_name}`}
                    size="md"
                    className="flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name & Time */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conversation.user?.first_name} {conversation.user?.last_name}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatRelativeTime(conversation.last_activity)}
                      </span>
                    </div>

                    {/* Email */}
                    <p className="text-xs text-gray-600 truncate mb-2">
                      {conversation.user?.email}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {getCategoryBadge(conversation.category?.name)}
                      {getStatusBadge(conversation.status)}
                      {conversation.needs_human_agent && (
                        <Badge variant="warning" size="sm">Escalated</Badge>
                      )}
                      {conversation.status === 'CLOSED' && conversation.rating && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-yellow-700">{conversation.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Typing Indicator */}
                {/* This will be added later with real-time data */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};