import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {

    // import.meta.env.VITE_SOCKET_URL is the URL of the socket server in backend on railway "https://omni-backend-production.up.railway.app"
    // The URL is stored in the .env file in the root directory of the frontend project
    // VITE is used only for frontend environment variables

     const socket = io(import.meta.env.VITE_SOCKET_URL , {
        transports: ["websocket", "polling"]
    }); 
      
    useEffect(() => {
        socket.emit('clientToServer', { message: 'Hello from client!' });
        socket.on('serverToClient', (data) => {
        });
    
        return () => {
            socket.off('serverToClient'); // Cleanup event listener
        };
    }, [socket]);
     
    useEffect(() => {
        return () => {
            socket.disconnect(); 
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};