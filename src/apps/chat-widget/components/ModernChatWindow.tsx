import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Smile, MoreVertical, ArrowLeft } from 'lucide-react';
import { ConnectedChatWindow } from './ConnectedChatWindow';

interface ModernChatWindowProps {
  onClose: () => void;
  companyId: string;
  userId: string;
  conversationId?: string;
  companyName?: string;
}

export const ModernChatWindow: React.FC<ModernChatWindowProps> = ({
  onClose,
  companyId,
  userId,
  conversationId,
  companyName = 'Support',
}) => {
  const [view, setView] = useState<'welcome' | 'chat' | 'messages'>('welcome');

  return (
    <div className="w-[400px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view === 'chat' && (
            <button
              onClick={() => setView('welcome')}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div>
            <h2 className="text-white font-semibold text-lg">{companyName}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span className="text-white/90 text-sm">We're online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'welcome' && (
          <WelcomeView onStartChat={() => setView('chat')} companyName={companyName} />
        )}

        {view === 'chat' && (
          <ConnectedChatWindow
            companyId={companyId}
            userId={userId}
            conversationId={conversationId || ''}
          />
        )}
      </div>
    </div>
  );
};

// Welcome View Component
interface WelcomeViewProps {
  onStartChat: () => void;
  companyName: string;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStartChat, companyName }) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Welcome Message */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">👋</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Hi there!
          </h3>
          <p className="text-gray-600 mb-6">
            We're here to help. Ask us anything or browse the help center.
          </p>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onStartChat}
          className="w-full bg-white border-2 border-gray-200 hover:border-primary-500 rounded-xl py-3.5 px-4 text-gray-700 hover:text-primary-600 font-medium transition-all flex items-center justify-between group"
        >
          <span>Send us a message</span>
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary-50 rounded-lg flex items-center justify-center transition-colors">
            <Send className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
          </div>
        </button>

        {/* Quick Links */}
        <div className="mt-3 flex items-center justify-center gap-4 text-sm">
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Help Center
          </button>
          <span className="text-gray-300">•</span>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
