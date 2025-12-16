import React, { useState } from 'react';
import { X, Minimize2, Menu } from 'lucide-react';
import { ConnectedChatWindow } from './ConnectedChatWindow';
import { ConversationHistory } from './ConversationHistory';
import { TabbedChatInterface } from './TabbedChatInterface';
import { FAQTab } from './FAQTab';
import { KnowledgeTab } from './KnowledgeTab';

interface ChatWindowWithHistoryProps {
  onClose: () => void;
  onMinimize?: () => void;
  companyId: string;
  userId: string;
  currentConversationId?: string;
  departmentId?: string;
}

export const ChatWindowWithHistory: React.FC<ChatWindowWithHistoryProps> = ({
  onClose,
  onMinimize,
  companyId,
  userId,
  currentConversationId,
  departmentId,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(
    currentConversationId
  );

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // In a real implementation, this would load the conversation messages
    console.log('Selected conversation:', conversationId);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(undefined);
    // In a real implementation, this would start a new conversation
    console.log('Starting new conversation');
  };

  const handleStartChatFromTab = () => {
    // Switch back to chat tab - in real implementation would focus input
    console.log('Switching to chat tab');
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
      {/* Conversation History Sidebar - Desktop */}
      {showHistory && (
        <div className="hidden md:block">
          <ConversationHistory
            companyId={companyId}
            userId={userId}
            currentConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>
      )}

      {/* Main Chat Window with Tabs */}
      <div className="w-96 h-[600px] flex flex-col relative">
        {/* Header */}
        <div className="bg-primary-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* History Toggle Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title={showHistory ? 'Hide history' : 'Show history'}
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Support Assistant</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-xs">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-5 h-5 text-white" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabbed Content */}
        <TabbedChatInterface
          children={{
            chatTab: (
              <ConnectedChatWindow
                companyId={companyId}
                userId={userId}
                conversationId={selectedConversationId || currentConversationId || ''}
              />
            ),
            faqTab: (
              <FAQTab
                companyId={companyId}
                departmentId={departmentId}
                onStartChat={handleStartChatFromTab}
              />
            ),
            knowledgeTab: (
              <KnowledgeTab
                companyId={companyId}
                departmentId={departmentId}
                onStartChat={handleStartChatFromTab}
              />
            ),
          }}
        />
      </div>

      {/* Mobile History Overlay */}
      {showHistory && (
        <div className="md:hidden absolute inset-0 bg-white z-20 flex flex-col">
          <div className="p-4 bg-primary-500 text-white flex items-center justify-between">
            <h3 className="font-semibold">Conversations</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ConversationHistory
              companyId={companyId}
              userId={userId}
              currentConversationId={selectedConversationId}
              onSelectConversation={(id) => {
                handleSelectConversation(id);
                setShowHistory(false);
              }}
              onNewConversation={() => {
                handleNewConversation();
                setShowHistory(false);
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
