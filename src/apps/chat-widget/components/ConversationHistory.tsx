import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Loader2 } from 'lucide-react';
import { conversationService, Conversation } from '@/services/conversation.service';
import { formatDistanceToNow } from 'date-fns';

interface ConversationHistoryProps {
  companyId: string;
  userId: string;
  currentConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  companyId,
  userId,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [companyId, userId]);

  // Reload conversations when a new conversation is selected or created
  useEffect(() => {
    if (currentConversationId && userId) {
      loadConversations();
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await conversationService.getConversations({
        company_id: companyId,
        user_id: userId,
      });
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLastMessage = (conv: Conversation): string => {
    if (!conv.last_message) return 'No messages yet';
    const maxLength = 40;
    return conv.last_message.length > maxLength
      ? `${conv.last_message.substring(0, maxLength)}...`
      : conv.last_message;
  };

  const getTimeAgo = (date: string | Date): string => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">Conversations</h3>
          <button
            onClick={onNewConversation}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="New conversation"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin mb-2" />
            <p className="text-xs text-gray-500">Loading...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
            <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  conv.id === currentConversationId
                    ? 'bg-primary-100 border-l-4 border-primary-500'
                    : 'hover:bg-white border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {conv.department_name || 'General Support'}
                    </p>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {getLastMessage(conv)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getTimeAgo(conv.updated_at)}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                {conv.status && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        conv.status === 'CLOSED'
                          ? 'bg-green-100 text-green-800'
                          : conv.status === 'OPEN'
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {conv.status}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
