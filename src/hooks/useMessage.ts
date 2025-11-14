import { useState, useCallback, useEffect } from 'react';
import { useMessageStore } from '../stores/messageStore';
import { messageService } from '../services/message.service';
import { socketService } from '../services/socket';
import { Message } from '../types/message.types';

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // At the top of the file, add:

// Then in the hook, replace loadMessages with:
const loadMessages = useCallback(async () => {
  if (!conversationId) return;

  try {
    setIsLoading(true);
    // Get from store instead of API for testing
    const data = useMessageStore.getState().getMessages(conversationId);
    setMessages(data);
  } catch (error) {
    console.error('Failed to load messages:', error);
  } finally {
    setIsLoading(false);
  }
}, [conversationId]);

  // Load messages
//   const loadMessages = useCallback(async () => {
//     if (!conversationId) return;

//     try {
//       setIsLoading(true);
//       const data = await messageService.getConversationMessages(conversationId);
//       setMessages(data);
//     } catch (error) {
//       console.error('Failed to load messages:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [conversationId]);

  // Send message
  const sendMessage = useCallback(
    async (content: string, userId: string) => {
      if (!conversationId) return;

      try {
        setIsSending(true);
        const message = await messageService.sendMessage(conversationId, content, userId);
        setMessages((prev) => [...prev, message]);
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
    [conversationId]
  );

  // Add message to list (from socket)
  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

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
  }, [conversationId, loadMessages]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    loadMessages,
    addMessage,
  };
};