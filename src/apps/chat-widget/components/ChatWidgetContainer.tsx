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


import React from 'react';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';
import { PreChatForm } from './PreChatForm';
import { KnowledgeBaseView } from './KnowledgeBase';
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
    startConversation,
    isInitializing,
  } = useChat(companyId);

  const {
    widgetState,
    unreadCount,
    setWidgetState,
    resetUnreadCount,
  } = useChatStore();

  // Handle opening widget - goes to FAQ/Articles first
  const handleOpenWidget = () => {
    setWidgetState(ChatWidgetState.FAQ_ARTICLES);
    resetUnreadCount();
  };

  // Handle closing widget
  const handleCloseWidget = () => {
    setWidgetState(ChatWidgetState.CLOSED);
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
      await startConversation(userData);
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
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-sky-400 text-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Start a Conversation</h3>
                <p className="text-xs opacity-90">We're here to help!</p>
              </div>
              <button
                onClick={() => setWidgetState(ChatWidgetState.FAQ_ARTICLES)}
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

      {/* State: CHAT_ACTIVE - Show chat window */}
      {widgetState === ChatWidgetState.CHAT_ACTIVE && conversation && (
        <div className="mb-4">
          <ChatWindow
            onClose={handleCloseWidget}
            companyId={companyId}
          />
        </div>
      )}
    </div>
  );
};