import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io('http://localhost:8000'); // Replace with your backend URL

export default socket;