


import { createContext, useContext } from 'react';
import socketIOClient from 'socket.io-client';

const socketInstance = socketIOClient("ws://10.14.55.85:3000/game", {
  withCredentials: true,
  transports: ['websocket']
});

const SocketContext = createContext(socketInstance);

export const useGameSocket = () => useContext(SocketContext);