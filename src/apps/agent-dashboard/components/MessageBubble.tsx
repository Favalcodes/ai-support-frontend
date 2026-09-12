import React from 'react';
import { Message, MessageRole } from '../../../types/message.types';
import { Avatar, Badge } from '../../../components/ui';
import { formatTime } from '../../../utils/formatters';

interface MessageBubbleProps {
  message: Message;
  isAgent?: boolean;
  agentName?: string;
  userName?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isAgent = false,
  agentName,
  userName,
}) => {
  const isUser = message.role === MessageRole.USER;
  const isAssistant = message.role === MessageRole.AI;
  const isSystem = message.role === MessageRole.SYSTEM;

  // System messages (centered)
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-primary-50 border border-primary-200 px-4 py-2 rounded-full max-w-md">
          <p className="text-xs text-gray-700 text-center">{message.content}</p>
        </div>
      </div>
    );
  }

  // User messages (left side)
  if (isUser) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={userName || 'User'} size="sm" className="flex-shrink-0" />
        <div className="flex-1 max-w-lg">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">
              {userName || 'Customer'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(message.created_at)}
            </span>
          </div>
          <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AI Assistant messages (left side)
  if (isAssistant) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <div className="flex-1 max-w-lg">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">AI Assistant</span>
            <span className="text-xs text-gray-500">
              {formatTime(message.created_at)}
            </span>
          </div>
          <div className="bg-secondary-50 rounded-lg rounded-tl-none p-3 border border-secondary-200">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {message.content}
            </p>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.sources.map((source, idx) => (
                  <Badge key={idx} variant="info" size="sm">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {source.type === 'faq' ? 'FAQ' : 'Article'}
                  </Badge>
                ))}
              </div>
            )}

            {/* Confidence Score */}
            {message.confidence_score && (
              <div className="mt-2 text-xs text-gray-500">
                Confidence: {Math.round(message.confidence_score * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Agent messages (right side)
  return (
    <div className="flex items-start gap-3 mb-4 justify-end">
      <div className="flex-1 max-w-lg flex flex-col items-end">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs text-gray-500">
            {formatTime(message.created_at)}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {isAgent ? 'You' : agentName || 'Agent'}
          </span>
        </div>
        <div className="bg-primary-500 rounded-lg rounded-tr-none p-3 shadow-sm">
          <p className="text-sm text-white whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
      <Avatar
        name={agentName || 'Agent'}
        size="sm"
        className="flex-shrink-0"
      />
    </div>
  );
};