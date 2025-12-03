// import React, { useState } from 'react';
// import { ChatButton } from './ChatButton';
// import { ChatWindow } from './ChatWindow';

// interface ChatWidgetContainerProps {
//   position?: 'bottom-right' | 'bottom-left';
//   primaryColor?: string;
//   companyName?: string;
// }

// export const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({
//   position = 'bottom-right',
//   primaryColor = '#00D9DF',
//   companyName = 'SupportHub',
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const positionClasses = {
//     'bottom-right': 'bottom-6 right-6',
//     'bottom-left': 'bottom-6 left-6',
//   };

//   const handleToggle = () => {
//     setIsOpen(!isOpen);
//     if (!isOpen) {
//       setUnreadCount(0); // Clear unread when opening
//     }
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div className={`fixed ${positionClasses[position]} z-50`}>
//       {isOpen ? (
//         <div className="mb-4">
//           <ChatWindow onClose={handleClose} />
//         </div>
//       ) : (
//         <ChatButton
//           isOpen={isOpen}
//           onClick={handleToggle}
//           unreadCount={unreadCount}
//         />
//       )}
//     </div>
//   );
// };


import React, { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatWindowWithHistory } from './ChatWindowWithHistory';
import { PreChatForm } from './PreChatForm';
import { KnowledgeBaseView } from './KnowledgeBase';
import { DepartmentSelection } from './DepartmentSelection';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/chatStore';
import { ChatWidgetState } from '@/types/widget-states';
import type { Category } from '@/types/knowledge.types';

interface ChatWidgetContainerProps {
  companyId: string;
  categories?: Category[];
  position?: 'bottom-right' | 'bottom-left';
}

export const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({
  companyId,
  categories,
  position = 'bottom-right',
}) => {
  const {
    conversation,
    user,
    startConversation,
  } = useChat(companyId);

  const {
    widgetState,
    unreadCount,
    setWidgetState,
    resetUnreadCount,
  } = useChatStore();

  // Track selected department
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>();

  // Handle opening widget - goes to department selection first
  const handleOpenWidget = () => {
    setWidgetState(ChatWidgetState.DEPARTMENT_SELECT);
    resetUnreadCount();
  };

  // Handle department selection
  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setWidgetState(ChatWidgetState.PRE_CHAT_FORM);
  };

  // Handle closing widget (ends conversation)
  const handleCloseWidget = () => {
    setWidgetState(ChatWidgetState.CLOSED);
  };

  // Handle minimizing widget (preserves conversation)
  const handleMinimizeWidget = () => {
    setWidgetState(ChatWidgetState.MINIMIZED);
  };

  // Handle reopening minimized widget
  const handleReopenWidget = () => {
    // If there's an active conversation, reopen to chat active
    if (conversation && user) {
      setWidgetState(ChatWidgetState.CHAT_ACTIVE);
    } else {
      // Otherwise go to department selection
      setWidgetState(ChatWidgetState.DEPARTMENT_SELECT);
    }
    resetUnreadCount();
  };

  // Handle "Chat with Support" button from FAQ/Articles view
  const handleStartChatFlow = () => {
    setWidgetState(ChatWidgetState.PRE_CHAT_FORM);
  };

  // Handle pre-chat form submission
  const handleStartChat = async (userData: {
    email: string;
    first_name: string;
    last_name: string;
    category_id?: string;
  }) => {
    try {
      setWidgetState(ChatWidgetState.LOADING);
      // Include selected department as category_id
      await startConversation({
        ...userData,
        category_id: selectedDepartmentId || userData.category_id,
      });
      setWidgetState(ChatWidgetState.CHAT_ACTIVE);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start chat. Please try again.');
      setWidgetState(ChatWidgetState.PRE_CHAT_FORM);
    }
  };

  // Position class
  const positionClass = position === 'bottom-left' ? 'left-4' : 'right-4';

  return (
    <div className={`fixed bottom-4 ${positionClass} z-50`}>
      {/* State: CLOSED - Show only the button */}
      {widgetState === ChatWidgetState.CLOSED && (
        <ChatButton
          isOpen={false}
          onClick={handleOpenWidget}
          unreadCount={unreadCount}
        />
      )}

      {/* State: MINIMIZED - Show button with indicator if conversation exists */}
      {widgetState === ChatWidgetState.MINIMIZED && (
        <ChatButton
          isOpen={false}
          onClick={handleReopenWidget}
          unreadCount={unreadCount}
        />
      )}

      {/* State: DEPARTMENT_SELECT - Show department selection */}
      {widgetState === ChatWidgetState.DEPARTMENT_SELECT && (
        <DepartmentSelection
          companyId={companyId}
          onSelectDepartment={handleSelectDepartment}
          onClose={handleCloseWidget}
        />
      )}

      {/* State: FAQ_ARTICLES - Show knowledge base */}
      {widgetState === ChatWidgetState.FAQ_ARTICLES && (
        <KnowledgeBaseView
          companyId={companyId}
          onStartChat={handleStartChatFlow}
          onClose={handleCloseWidget}
        />
      )}

      {/* State: PRE_CHAT_FORM - Show user info form */}
      {widgetState === ChatWidgetState.PRE_CHAT_FORM && (
        <div className="w-96 h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-up">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 bg-cyan-500 text-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Start a Conversation</h3>
                <p className="text-xs opacity-90">We're here to help!</p>
              </div>
              <button
                onClick={() => setWidgetState(ChatWidgetState.DEPARTMENT_SELECT)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                ← Back
              </button>
            </div>

            {/* Form */}
            <PreChatForm
              onSubmit={handleStartChat}
              isLoading={false}
              categories={categories}
            />
          </div>
        </div>
      )}

      {/* State: LOADING - Show loading spinner */}
      {widgetState === ChatWidgetState.LOADING && (
        <div className="w-96 h-[600px] bg-white rounded-lg shadow-2xl flex items-center justify-center animate-slide-up">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Starting your chat...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
          </div>
        </div>
      )}

      {/* State: CHAT_ACTIVE - Show chat window with history */}
      {widgetState === ChatWidgetState.CHAT_ACTIVE && conversation && user && (
        <div className="mb-4">
          <ChatWindowWithHistory
            onClose={handleCloseWidget}
            onMinimize={handleMinimizeWidget}
            companyId={companyId}
            userId={user.id}
            currentConversationId={conversation.id}
            departmentId={selectedDepartmentId}
          />
        </div>
      )}
    </div>
  );
};