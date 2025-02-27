import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Middleware for authentication
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as any;
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Join user's room for private messages
    socket.join(`user:${socket.userId}`);
    
    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content } = data;
        
        // Save message to database (implementation needed)
        // const message = await Message.create({
        //   senderId: socket.userId,
        //   receiverId,
        //   content,
        //   read: false
        // });
        
        // Emit to receiver
        io.to(`user:${receiverId}`).emit('message', {
          id: 'temp-id', // Replace with actual message ID
          senderId: socket.userId,
          content,
          createdAt: new Date().toISOString(),
          read: false
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
    
    // Handle appointment notifications
    socket.on('appointment_update', (data) => {
      const { appointmentId, status, userId } = data;
      
      // Emit to specific user
      io.to(`user:${userId}`).emit('notification', {
        type: 'appointment_update',
        appointmentId,
        status,
        message: `Your appointment has been ${status}`,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};