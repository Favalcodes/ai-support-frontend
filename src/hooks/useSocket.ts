import { useEffect, useState } from 'react';
import { socketService } from '../services/socket';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '@/types/user.types';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect socket
      const socket = socketService.connect();

      // Setup connection status listeners
      socket.on('connect', () => {
        setIsConnected(true);
        // Join agent room if user is staff
        if (user.role === UserRole.COMPANY_STAFF) {
          socketService.joinAgentRoom(user.id);
        }
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return {
    socket: socketService.getSocket(),
    isConnected,
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };
};