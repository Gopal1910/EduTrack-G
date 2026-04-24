import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;
  
  const token = localStorage.getItem("edutrack_token");
  if (!token) return null;

  socket = io("http://localhost:5000", {
    auth: { token }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
