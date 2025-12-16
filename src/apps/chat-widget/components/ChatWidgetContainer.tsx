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
//   primaryColor = '#713600',
//   companyName = 'getLync',
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
import { IntercomStyleWidget } from './IntercomStyleWidget';
import { useChatStore } from '@/stores/chatStore';
import { ChatWidgetState } from '@/types/widget-states';

interface ChatWidgetContainerProps {
  companyId: string;
  position?: 'bottom-right' | 'bottom-left';
  companyName?: string;
  user?: any; // User from company platform (for auto-sync)
}

export const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({
  companyId,
  position = 'bottom-right',
  companyName = 'Support',
  user,
}) => {
  const {
    widgetState,
    unreadCount,
    setWidgetState,
    resetUnreadCount,
  } = useChatStore();

  // Handle opening widget
  const handleOpenWidget = () => {
    setWidgetState(ChatWidgetState.CHAT_ACTIVE);
    resetUnreadCount();
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
    setWidgetState(ChatWidgetState.CHAT_ACTIVE);
    resetUnreadCount();
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

      {/* State: CHAT_ACTIVE - Show Intercom-style widget */}
      {widgetState === ChatWidgetState.CHAT_ACTIVE && (
        <div className="mb-4">
          <IntercomStyleWidget
            onClose={handleCloseWidget}
            onMinimize={handleMinimizeWidget}
            companyId={companyId}
            companyName={companyName}
            user={user}
          />
        </div>
      )}
    </div>
  );
};