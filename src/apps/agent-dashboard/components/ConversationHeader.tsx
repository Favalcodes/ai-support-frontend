import React, { useState } from 'react';
import { MoreVertical, UserCheck, X } from 'lucide-react';
import { Conversation } from '../../../types/conversation.types';
import { Avatar, Button, Badge } from '../../../components/ui';
import { useConversation } from '../../../hooks';

interface ConversationHeaderProps {
  conversation: Conversation;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
}) => {
  const { resolveConversation } = useConversation();
  const [showMenu, setShowMenu] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const userName = `${conversation.user?.first_name} ${conversation.user?.last_name}`;

  const handleResolve = async () => {
    if (!conversation.assigned_staff_id) return;
    
    setIsResolving(true);
    const result = await resolveConversation(
      conversation.id,
      conversation.assigned_staff_id
    );
    setIsResolving(false);
    
    if (result.success) {
      // Show success message
    }
  };

  return (
    <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
      {/* Left Side - User Info */}
      <div className="flex items-center gap-4">
        <Avatar name={userName} size="md" />
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{userName}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{conversation.user?.email}</p>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        {/* Status Badge */}
        {conversation.needs_human_agent && (
          <Badge variant="warning">Escalated</Badge>
        )}
        
        {conversation.status === 'OPEN' && (
          <>
            {/* Transfer Button */}
            <Button variant="ghost" size="sm">
              <UserCheck className="w-4 h-4 mr-2" />
              Transfer
            </Button>

            {/* Resolve Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleResolve}
              loading={isResolving}
              disabled={isResolving}
            >
              <X className="w-4 h-4 mr-2" />
              Resolve
            </Button>
          </>
        )}

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                View History
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                Export Chat
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                Block User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};