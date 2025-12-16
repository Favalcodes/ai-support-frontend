import { useState, useCallback, useEffect } from 'react';
import { useMessageStore } from '../stores/messageStore';
import { messageService } from '../services/message.service';
import { socketService } from '../services/socket';
import { Message } from '../types/message.types';

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { setMessages: storeSetMessages, addMessage: storeAddMessage } = useMessageStore();

  // Load messages from API
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      const data = await messageService.getConversationMessages(conversationId);
      setMessages(data);
      storeSetMessages(conversationId, data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, storeSetMessages]);

  // Send message
  const sendMessage = useCallback(
    async (content: string, userId: string) => {
      if (!conversationId) return;

      try {
        setIsSending(true);
        const message = await messageService.sendMessage(conversationId, content, userId);
        setMessages((prev) => [...prev, message]);
        storeAddMessage(conversationId, message);
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to send message',
        };
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, storeAddMessage]
  );

  // Add message to list (from socket)
  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
    if (message.conversation_id) {
      storeAddMessage(message.conversation_id, message);
    }
  }, [storeAddMessage]);

  // Setup socket listeners for real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const handleNewMessage = (data: { message: Message }) => {
      addMessage(data.message);
    };

    socketService.on('new_message', handleNewMessage);

    return () => {
      socketService.off('new_message', handleNewMessage);
    };
  }, [conversationId, addMessage]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    loadMessages,
    addMessage,
  };
};
