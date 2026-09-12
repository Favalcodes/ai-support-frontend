import React, { useEffect, useState, useCallback } from 'react';
import { ConversationList, Filters } from '../components/ConversationList';
import { MessageView } from '../components/MessageView';
import { CustomerInfoPanel } from '../components/CustomerInfoPanel';
import { ConversationHeader } from '../components/ConversationHeader';
import { useConversationSocket } from '../../../hooks/useConversationSocket';
import { useAuth, useConversation, useMessages, useSocket } from '../../../hooks';
import { useTypingStore } from '../../../stores/typingStore';
import { Conversation } from '../../../types/conversation.types';
import { socketService } from '../../../services/socket';
import { usePermissions } from '../../../hooks/usePermissions';
import { Permission } from '../../../types/permission.types';

export const ConversationsPage: React.FC = () => {
  const { user } = useAuth();
  const { permissions } = usePermissions();
  const { conversations, activeConversation, loadAgentConversations, loadCompanyConversations, selectConversation } =
    useConversation();
  const { messages, sendMessage, isLoading: messagesLoading, isSending } = useMessages(
    activeConversation?.id || null
  );
  const { isConnected } = useSocket();
  const { startTyping, stopTyping } = useConversationSocket(
    activeConversation?.id || null,
    user?.id || null
  );
  const { getTypingUsers } = useTypingStore();
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    status: 'ALL',
    dateRange: 'all',
    assignedOnly: false,
    escalatedOnly: false,
  });

  // Load conversations when component mounts or filters change
  useEffect(() => {
    if (user) {
      // Admins with VIEW_ALL_CONVERSATIONS permission see all company conversations
      // Regular staff only see their assigned conversations
      const hasViewAllPermission = permissions.includes(Permission.VIEW_ALL_CONVERSATIONS);

      const status = currentFilters.status === 'ALL' ? undefined : currentFilters.status;

      setIsLoadingConversations(true);
      if (hasViewAllPermission) {
        loadCompanyConversations({ status }).finally(() => {
          setIsLoadingConversations(false);
        });
      } else {
        loadAgentConversations(user.id, status).finally(() => {
          setIsLoadingConversations(false);
        });
      }
    }
  }, [user?.id, permissions, currentFilters.status, loadAgentConversations, loadCompanyConversations]);

  // Handle filter changes from ConversationList component
  const handleFilterChange = useCallback((filters: Filters) => {
    setCurrentFilters(filters);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    selectConversation(conversation);
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !activeConversation) return;
    
    // Stop typing indicator when sending
    stopTyping();
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    // Send via WebSocket
    socketService.sendMessage(activeConversation.id, user.id, content);
    
    // Also call the hook method for optimistic update
    await sendMessage(content, user.id);
  };

  const handleTyping = () => {
    if (!user) return;

    const agentName = `${user.first_name} ${user.last_name}`;
    startTyping(agentName);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Auto-stop after 3 seconds
    const timeout = setTimeout(() => {
      stopTyping();
    }, 3000);

    setTypingTimeout(timeout);
  };

  // Get typing users for active conversation
  const typingUsers = activeConversation
    ? getTypingUsers(activeConversation.id)
    : [];

  return (
    <div className="h-full flex">
      {/* Conversation List */}
      <div className="w-80 border-r border-gray-200">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoadingConversations}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Conversation Header */}
            <ConversationHeader conversation={activeConversation} />

            {/* Messages */}
            <MessageView
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              isLoading={messagesLoading}
              isSending={isSending}
              typingUsers={typingUsers}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list to start chatting
              </p>
              {!isConnected && (
                <p className="text-red-500 text-sm mt-4">
                  ⚠️ WebSocket disconnected - Reconnecting...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Customer Info Panel */}
      {activeConversation && <CustomerInfoPanel conversation={activeConversation} />}
    </div>
  );
};