import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket.jsx';
import { toast } from 'sonner';
import axios from "../../utils/axiosInstance.js";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const socket = useSocket();
    const [currentUser, setCurrentUser] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(null);

    const resetProfileState = useCallback(() => {
        setProfilePicUrl(null);
        setCurrentUser(null);
    }, []);

    const fetchProfilePic = useCallback(async (key) => {
        if (!key) return; 
        try {
            const response = await axios.get(`/file/signed-url?key=${key}`);
            setProfilePicUrl(response.data.data.url);
        } catch (error) {
            toast.error('Error fetching profile picture');
        }
    }, []);

    const getCurrentUser = useCallback(() => {
        const fetchUser = async () => {
            try {
                resetProfileState(); // Resetting the state
                const response = await axios.get(`/auth/current-user`);
                const user = response.data.data.user;

                if (user && user._id) {
                    setCurrentUser(user);
                    if (user.profilePic?.key) {
                        await fetchProfilePic(user.profilePic.key); // Fetch profile picture
                    }
                } else {
                    toast.error('User data is incomplete');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Error getting user';
                toast.error(errorMessage);
            }
        };

        fetchUser();
    }, [resetProfileState, fetchProfilePic]);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

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
        fetchProfilePic,
        getCurrentUser
    }), [profilePicUrl, fetchProfilePic, getCurrentUser, setProfilePicUrl]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};