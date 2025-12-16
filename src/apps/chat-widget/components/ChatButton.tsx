import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  isOpen,
  onClick,
  unreadCount = 0,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-16 h-16 rounded-full shadow-2xl
        bg-primary-500
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-out
        flex items-center justify-center
        ${!isOpen ? 'animate-bounce-slow' : ''}
      `}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {/* Icon */}
      <div className="relative">
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <MessageCircle className="w-8 h-8 text-white" />
        )}
      </div>

      {/* Unread Badge */}
      {!isOpen && unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </div>
      )}

      {/* Pulse Ring */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20"></span>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
};