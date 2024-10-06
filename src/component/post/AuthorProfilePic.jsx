// src/component/post/AuthorProfilePic.jsx

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance.js';
import { profile } from '../../assets/index.js';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';


const AuthorProfilePic = ({ author }) => {
  const [profilePic, setProfilePic] = useState();
  const [loading, setLoading] = useState(true); // Loading state for profile picture

  useEffect(() => {
    const getProfilePic = async () => {
      setLoading(true);
      try {
        const key = author.profilePic.key;
        
        const response = await axios.get(`/file/signed-url?key=${key}`);
        setProfilePic(response.data.data.url);
        console.log(profilePic)
        Cookies.set(`profilePic_${author._id}`, profilePic);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePic(profile); // Set default profile picture in case of error
      } finally {
        setLoading(false);
      }
    };

    if (author && author._id) {
        // Check if the profile picture URL is already stored in cookies
        const storedProfilePic = Cookies.get(`profilePic_${author._id}`);
        if (storedProfilePic) {
          setProfilePic(storedProfilePic);
          setLoading(false); // No need to load again if already present
        } else {
          getProfilePic(); // Fetch the picture if not in cookies
        }
      }

  }, [author, profilePic]);

  console.log(profilePic)

  return (
        <img
          className="w-5 h-5 rounded-full"
          src={profilePic}
          alt={`${author.name}'s profile`}
        />

  );
};


export default AuthorProfilePic;
