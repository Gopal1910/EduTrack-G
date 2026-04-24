const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandler = (io) => {
  // Middleware for Socket.io authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.role})`);

    // Let students join their class room
    if (socket.user.role === 'Student' && socket.user.class) {
      socket.join(socket.user.class);
      console.log(`Student joined room: ${socket.user.class}`);
    }

    // A teacher might want to join a specific class room if they teach multiple classes
    socket.on('joinRoom', (roomName) => {
      if (socket.user.role === 'Teacher') {
        socket.join(roomName);
        console.log(`Teacher joined room: ${roomName}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = socketHandler;
