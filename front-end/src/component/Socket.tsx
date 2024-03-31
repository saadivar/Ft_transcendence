import { createContext, useContext } from 'react';
import socketIOClient from 'socket.io-client';

const socketInstance = socketIOClient(import.meta.env.VITE_url_socket, {
  withCredentials: true,
  transports: ['websocket']
});

const SocketContext = createContext(socketInstance);

export const useSocket = () => useContext(SocketContext);

