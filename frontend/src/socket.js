import { io } from "socket.io-client";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BASE, { transports: ["websocket"], autoConnect: true });
  }
  return socket;
};

export const API = BASE;
