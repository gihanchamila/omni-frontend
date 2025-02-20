import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    // This is used for vercel

    //  const socket = io('https://omni-backend-production.up.railway.app', {
    //     transports: ["websocket", "polling"]
    // }); 

    // This is used for localhost
    const socket = io('http://localhost:8000');
      
    useEffect(() => {
        // Emit an event to the server
        socket.emit('clientToServer', { message: 'Hello from client!' });
    
        // Listen for a response from the server
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