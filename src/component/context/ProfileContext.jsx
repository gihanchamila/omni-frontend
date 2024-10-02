// ProfileContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket.jsx';
import { toast } from 'sonner';
import axios from "../../utils/axiosInstance.js"

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const socket = useSocket()
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const [currentUser, setCurrentUser] = useState();
    const [profileKey, setProfileKey] = useState()

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await axios.get(`/auth/current-user`); 
                const user = response.data.data.user;

                if (user && user._id) {
                    setCurrentUser(user);

                    if (!profilePicUrl && user.profilePic) {
                        setProfileKey(user.profilePic.key);
                        const response = await axios.get(`/file/signed-url?key=${profileKey}`) 
                        const data = response.data.data
                        setProfilePicUrl(data.url)
                    }
                } else {
                    toast.error('User data is incomplete');
                }
            } catch (error) {
                toast.error('Error getting user');
            }
        };

        getCurrentUser();
    }, [profileKey, profilePicUrl]);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            socket.on('profilePicUpdated', ({ userId, signedUrl }) => {
                console.log("Socket event received:", { userId, signedUrl });
                if (userId === currentUser._id) {
                    console.log("Updating profile picture URL to:", signedUrl); 
                    setProfilePicUrl(signedUrl);
                }
            });

            // Cleanup the socket listener
            return () => {
                socket.off('profilePicUpdated');
            };
        }
    }, [currentUser, socket]);

    return (
        <ProfileContext.Provider value={{ profilePicUrl, setProfilePicUrl }}>
            {children}
        </ProfileContext.Provider>
    );
};
