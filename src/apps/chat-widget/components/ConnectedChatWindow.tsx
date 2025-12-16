import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useChat } from '@/hooks/useChat';

interface ConnectedChatWindowProps {
  companyId: string;
  userId: string;
  conversationId: string;
}

export const ConnectedChatWindow: React.FC<ConnectedChatWindowProps> = ({
  companyId,
  userId,
  conversationId,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isConnected,
    isAiTyping,
    isAgentTyping,
    agentName,
    isSendingMessage,
    sendMessage,
    handleTyping,
  } = useChat(companyId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSendingMessage) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    handleTyping();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Connection Status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 flex-shrink-0">
          <p className="text-xs text-yellow-800">
            Reconnecting to server...
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={{
              id: message.id,
              role: message.role.toLowerCase() as 'user' | 'assistant' | 'system',
              content: message.content,
              timestamp: new Date(message.created_at),
            }}
          />
        ))}

        {/* Typing Indicators */}
        {isAiTyping && (
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}

        {isAgentTyping && agentName && (
          <div className="text-sm text-gray-500 italic">
            {agentName} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            disabled={isSendingMessage || !isConnected}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSendingMessage || !isConnected}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
