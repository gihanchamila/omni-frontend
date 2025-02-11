import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useSocket } from './useSocket.jsx';
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
        let isMounted = true; // Flag to prevent state update if unmounted

        const fetchUser = async () => {
            try {
                const response = await axios.get(`/auth/current-user`);
                const user = response.data.data.user;

                if (user && user._id && isMounted) {
                    setCurrentUser(user);
                    if (user.profilePic?.key) {
                        await fetchProfilePic(user.profilePic.key);
                    } else {
                        setProfilePicUrl(`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&font-size=0.33`);
                    }
                } else if (isMounted) {
                    toast.error('User data is incomplete');
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.response?.data?.message || 'Error getting user');
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [fetchProfilePic]);

    useEffect(() => {
        const cleanup = getCurrentUser();
        return cleanup;
    }, [getCurrentUser]);

    useEffect(() => {
        if (!currentUser) return;

        const handleProfilePicUpdated = ({ userId, signedUrl }) => {
            if (userId === currentUser._id) {
                setProfilePicUrl(signedUrl);
            }
        };

        const handleProfilePicRemoved = ({ userId }) => {
            if (userId === currentUser._id && profilePicUrl !== null) {
                setProfilePicUrl(`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&font-size=0.33`);
            }
        };

        socket.on('profilePicUpdated', handleProfilePicUpdated);
        socket.on('profilePicRemoved', handleProfilePicRemoved);

        return () => {
            socket.off('profilePicUpdated', handleProfilePicUpdated);
            socket.off('profilePicRemoved', handleProfilePicRemoved);
        };
    }, [currentUser, socket, profilePicUrl]);

    const value = useMemo(() => ({
        profilePicUrl,
        setProfilePicUrl,
        fetchProfilePic,
        getCurrentUser
    }), [profilePicUrl, fetchProfilePic, getCurrentUser]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
