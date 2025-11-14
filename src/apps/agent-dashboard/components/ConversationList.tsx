import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Conversation } from '../../../types/conversation.types';
import { Avatar, Badge } from '../../../components/ui';
import { formatRelativeTime } from '../../../utils/formatters';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    const userName = `${conv.user?.first_name} ${conv.user?.last_name}`.toLowerCase();
    const userEmail = conv.user?.email?.toLowerCase() || '';
    return userName.includes(searchLower) || userEmail.includes(searchLower);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'RESOLVED':
        return <Badge variant="default" size="sm">Resolved</Badge>;
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
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          My Conversations
        </h2>
        <p className="text-xs text-gray-500">{conversations.length} active</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
          />
        </div>
      </div>

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
                      ? 'bg-cyan-50 border-l-4 border-l-cyan-500'
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