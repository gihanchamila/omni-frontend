import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// Toggle this to enable/disable WebSockets
const USE_SOCKET = false; 

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!USE_SOCKET) return; // Do not initialize if disabled

        const newSocket = io('https://omni-backend-production.up.railway.app', {
            transports: ["websocket", "polling"]
        });

        setSocket(newSocket);

        newSocket.emit('clientToServer', { message: 'Hello from client!' });

        newSocket.on('serverToClient', (data) => {
            console.log("Message from server:", data);
        });

        return () => {
            newSocket.off('serverToClient');
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
