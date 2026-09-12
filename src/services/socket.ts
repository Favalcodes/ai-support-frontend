import { io, Socket } from 'socket.io-client';
import { config } from '../config/env';
import type {
  Message,
  TypingEvent,
  AgentJoinedEvent,
  EscalationEvent,
} from '../types/chat.types';

export type SocketEventCallback<T = any> = (data: T) => void;

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(config.socketUrl, {
      // The server authenticates the handshake; staff sockets must present their JWT
      // or they are treated as anonymous and refused on privileged events.
      auth: { token: localStorage.getItem('auth_token') ?? undefined },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();

    return this.socket;
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      console.error('WebSocket connection error:', error);
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ WebSocket reconnected after ${attemptNumber} attempts`);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected');
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Conversation-specific methods
  joinConversation(conversationId: string, userId: string): void {
    this.emit('join_conversation', { conversationId, userId });
  }

  leaveConversation(conversationId: string): void {
    this.emit('leave_conversation', { conversationId });
  }

  sendMessage(conversationId: string, userId: string, message: string): void {
    this.emit('send_message', { conversationId, userId, message });
  }

  startTyping(conversationId: string, userName: string): void {
    this.emit('typing_start', { conversationId, userName });
  }

  stopTyping(conversationId: string): void {
    this.emit('typing_stop', { conversationId });
  }

  // Agent-specific methods
  joinAgentRoom(agentId: string): void {
    this.emit('join_agent_room', { agentId });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // ---------------------------------------------------------------------
  // Typed listeners.
  //
  // Merged in from the widget's separate socket client. Two modules each
  // opening their own connection meant a dashboard page using both hooks held
  // two sockets to the same server, and only one of them was authenticated.
  // ---------------------------------------------------------------------

  onConversationHistory(callback: SocketEventCallback<{ messages: Message[] }>): void {
    this.on('conversation_history', callback);
  }

  onNewMessage(callback: SocketEventCallback<{ message: Message }>): void {
    this.on('new_message', callback);
  }

  onAiThinking(callback: SocketEventCallback<{ thinking: boolean }>): void {
    this.on('ai_thinking', callback);
  }

  onEscalatedToHuman(callback: SocketEventCallback<EscalationEvent>): void {
    this.on('escalated_to_human', callback);
  }

  onAgentJoined(callback: SocketEventCallback<AgentJoinedEvent>): void {
    this.on('agent_joined', callback);
  }

  onUserTyping(callback: SocketEventCallback<TypingEvent>): void {
    this.on('user_typing', callback);
  }

  onAgentTyping(callback: SocketEventCallback<TypingEvent>): void {
    this.on('agent_typing', callback);
  }

  onConversationResolved(callback: SocketEventCallback): void {
    this.on('conversation_resolved', callback);
  }

  onError(callback: SocketEventCallback<{ message: string }>): void {
    this.on('error', callback);
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.socket?.removeAllListeners(event);
    } else {
      this.socket?.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();