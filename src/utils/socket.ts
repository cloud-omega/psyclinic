import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io({
    auth: {
      token,
    },
  });
  
  socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToNotifications = (callback: (data: any) => void): void => {
  if (!socket) return;
  
  socket.on('notification', callback);
};

export const subscribeToMessages = (callback: (data: any) => void): void => {
  if (!socket) return;
  
  socket.on('message', callback);
};

export const sendMessage = (data: any): void => {
  if (!socket) return;
  
  socket.emit('send_message', data);
};