import React from 'react';
import { Avatar } from '../../../components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // System messages (centered)
  if (message.role === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-accent-50 border border-accent-200 px-4 py-2 rounded-full max-w-xs">
          <p className="text-xs text-gray-700 text-center">{message.content}</p>
        </div>
      </div>
    );
  }

  // User messages (right side)
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="bg-primary-500 text-white rounded-lg rounded-tr-none p-3 shadow-sm">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  // Assistant messages (left side)
  return (
    <div className="flex items-start gap-2">
      <Avatar
        name="AI"
        size="sm"
        className="bg-primary-500 flex-shrink-0"
      />
      <div className="max-w-[75%]">
        <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};