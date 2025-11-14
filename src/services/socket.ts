import { io, Socket } from 'socket.io-client';
import { config } from '../config/env';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(config.socketUrl, {
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
}

export const socketService = new SocketService();