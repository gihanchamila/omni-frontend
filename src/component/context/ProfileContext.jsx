import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useSocket } from '../../hooks/useSocket.jsx';
import { toast } from 'sonner';
import axios from "../../utils/axiosInstance.js";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const socket = useSocket();
    const [currentUser, setCurrentUser] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(null);

    const getCurrentUser = async () => {
        try {
            resetProfileState(); 
            const response = await axios.get(`/auth/current-user`);
            const user = response.data.data.user;
            if (user && user._id) {
                setCurrentUser(user);
                await fetchProfilePic(user.profilePic?.key);
            } else {
                toast.error('User data is incomplete');
            }
        } catch (error) {
            toast.error('Error getting user');
        }
    };

    const resetProfileState = () => {
        setProfilePicUrl(null);
        setCurrentUser(null);
    };

    const fetchProfilePic = async (key) => {
        if (!key) return; 
        try {
            const response = await axios.get(`/file/signed-url?key=${key}`);
            setProfilePicUrl(response.data.data.url);
        } catch (error) {
            toast.error('Error fetching profile picture');
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    // Handle socket events for profile picture updates
    useEffect(() => {
        if (!currentUser) return;

        const handleProfilePicUpdated = ({ userId, signedUrl }) => {
            if (userId === currentUser._id) {
                setProfilePicUrl(signedUrl);
            }
        };

        const handleProfilePicRemoved = ({ userId }) => {
            if (userId === currentUser._id) {
                setProfilePicUrl(null);
            }
        };

        socket.on('profilePicUpdated', handleProfilePicUpdated);
        socket.on('profilePicRemoved', handleProfilePicRemoved);

        return () => {
            socket.off('profilePicUpdated', handleProfilePicUpdated);
            socket.off('profilePicRemoved', handleProfilePicRemoved);
        };
    }, [currentUser, socket]);

    const value = useMemo(() => ({
        profilePicUrl,
        setProfilePicUrl,
        getCurrentUser,
    }), [profilePicUrl]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
