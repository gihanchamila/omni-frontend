import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSocket } from './useSocket.jsx';
// import { toast } from 'sonner';
import axios from '../../utils/axiosInstance.js';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const socket = useSocket();
    const [currentUser, setCurrentUser] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const isMounted = useRef(true); // Use ref to track component mount status

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const getDefaultAvatarUrl = (user) => 
        `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random&font-size=0.33`;

    const resetProfileState = useCallback(() => {
        setProfilePicUrl(null);
        setCurrentUser(null);
    }, []);

    const fetchProfilePic = useCallback(async (key) => {
        if (!key) return;
        try {
            const { data } = await axios.get(`/file/signed-url?key=${key}`);
            if (isMounted.current) {
                setProfilePicUrl(data.data.url);
            }
        } catch (error) {
            // toast.error('Error fetching profile picture');
        }
    }, []);

    const getCurrentUser = useCallback(async () => {
        try {
            const { data } = await axios.get(`/auth/current-user`);
            const user = data.data.user;
    
            if (user && user._id && isMounted.current) {
                setCurrentUser(user);
    
                if (user.profilePic?.key) {
                    await fetchProfilePic(user.profilePic.key);
                } else {
                    setProfilePicUrl(getDefaultAvatarUrl(user)); 
                }
            } else if (isMounted.current) {
                // toast.error('User data is incomplete');
            }
        } catch (error) {
            if (isMounted.current) {
                // toast.error(error.response?.data?.message || 'Error getting user');
            }
        }
    }, [fetchProfilePic]);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

    useEffect(() => {
        if (!currentUser) return;

        const handleProfilePicUpdated = ({ userId, signedUrl }) => {
            if (userId === currentUser._id) {
                setProfilePicUrl(signedUrl);
            }
        };

        const handleProfilePicRemoved = ({ userId }) => {
            if (userId === currentUser._id) {
                setProfilePicUrl(getDefaultAvatarUrl(currentUser));
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
        getCurrentUser,
        resetProfileState
    }), [profilePicUrl, fetchProfilePic, getCurrentUser,resetProfileState]);

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
