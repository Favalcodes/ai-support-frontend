import { io, Socket } from 'socket.io-client';
import type {
  Message,
  TypingEvent,
  AgentJoinedEvent,
  EscalationEvent,
} from '../types/chat.types';

export type SocketEventCallback<T = any> = (data: T) => void;

class SocketService {
  private socket: Socket | null = null;
  private baseURL: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.baseURL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:4001';
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.baseURL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    return this.socket;
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string, userId: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    console.log('🔵 Joining conversation:', conversationId);
    this.socket.emit('join_conversation', {
      conversationId,
      userId,
    });
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string) {
    if (!this.socket) return;

    console.log('🔴 Leaving conversation:', conversationId);
    this.socket.emit('leave_conversation', {
      conversationId,
    });
  }

  /**
   * Send a message
   */
  sendMessage(conversationId: string, userId: string, message: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    console.log('📤 Sending message:', message.substring(0, 50));
    this.socket.emit('send_message', {
      conversationId,
      userId,
      message,
    });
  }

  /**
   * Notify that user started typing
   */
  startTyping(conversationId: string, userName: string) {
    if (!this.socket) return;

    this.socket.emit('typing_start', {
      conversationId,
      userName,
    });
  }

  /**
   * Notify that user stopped typing
   */
  stopTyping(conversationId: string) {
    if (!this.socket) return;

    this.socket.emit('typing_stop', {
      conversationId,
    });
  }

  /**
   * Listen for conversation history
   */
  onConversationHistory(callback: SocketEventCallback<{ messages: Message[] }>) {
    this.socket?.on('conversation_history', callback);
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: SocketEventCallback<{ message: Message }>) {
    this.socket?.on('new_message', callback);
  }

  /**
   * Listen for AI thinking indicator
   */
  onAiThinking(callback: SocketEventCallback<{ thinking: boolean }>) {
    this.socket?.on('ai_thinking', callback);
  }

  /**
   * Listen for escalation to human
   */
  onEscalatedToHuman(callback: SocketEventCallback<EscalationEvent>) {
    this.socket?.on('escalated_to_human', callback);
  }

  /**
   * Listen for agent joined event
   */
  onAgentJoined(callback: SocketEventCallback<AgentJoinedEvent>) {
    this.socket?.on('agent_joined', callback);
  }

  /**
   * Listen for user typing
   */
  onUserTyping(callback: SocketEventCallback<TypingEvent>) {
    this.socket?.on('user_typing', callback);
  }

  /**
   * Listen for agent typing
   */
  onAgentTyping(callback: SocketEventCallback<TypingEvent>) {
    this.socket?.on('agent_typing', callback);
  }

  /**
   * Listen for conversation resolved
   */
  onConversationResolved(callback: SocketEventCallback) {
    this.socket?.on('conversation_resolved', callback);
  }

  /**
   * Listen for errors
   */
  onError(callback: SocketEventCallback<{ message: string }>) {
    this.socket?.on('error', callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: SocketEventCallback) {
    this.socket?.off(event, callback);
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string) {
    if (event) {
      this.socket?.removeAllListeners(event);
    } else {
      this.socket?.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();