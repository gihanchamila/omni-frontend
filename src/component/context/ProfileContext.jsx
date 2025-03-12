import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useSocket } from './useSocket.jsx';
import axios from '../../utils/axiosInstance.js';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const socket = useSocket();
    const [currentUser, setCurrentUser] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(null);

    const getDefaultAvatarUrl = (user) =>
        `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random&font-size=0.33`;

    const resetProfileState = () => {
        setCurrentUser(null);
        setProfilePicUrl(null);
    };

    const fetchProfilePic = async (key) => {
        if (!key) return;
        try {
            const { data } = await axios.get(`/file/signed-url?key=${key}`);
            setProfilePicUrl(data.data.url);
        } catch (error) {
            console.error('Error fetching profile picture', error);
        }
    };

    const getCurrentUser = async () => {
        try {
            const { data } = await axios.get(`/auth/current-user`);
            const user = data.data.user;

            if (user && user._id) {
                setCurrentUser(user);
                user.profilePic?.key
                    ? await fetchProfilePic(user.profilePic.key)
                    : setProfilePicUrl(getDefaultAvatarUrl(user));
            }
        } catch (error) {
            console.error('Error getting user', error.response?.data?.message);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

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
    }, [currentUser]);

    const value = useMemo(() => ({
        profilePicUrl,
        setProfilePicUrl,
        fetchProfilePic,
        getCurrentUser,
        resetProfileState
    }), [profilePicUrl]);

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
