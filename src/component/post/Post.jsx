import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { IoChatbubblesOutline } from 'react-icons/io5';
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';
import { profile } from '../../assets/index.js';
import moment from 'moment';
import axios from '../../utils/axiosInstance.js';
import { useProfile } from "../context/useProfilePic.jsx";
import PropTypes from 'prop-types';
import ProfilePicSkeleton from './ProfilePicSkeleton'; // Import your skeleton loader component
import AuthorProfilePic from './AuthorProfilePic.jsx';
import { motion } from 'framer-motion';

const Post = ({ post, postFile, liked, handleLike, followStatuses, currentUser, handleFollow}) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState();
  const [loading, setLoading] = useState(true); // Loading state for profile picture
  const { profilePicUrl } = useProfile();
  const profilePicCache = useRef({});

  useEffect(() => {
    const getProfilePic = async () => {
      setLoading(true);
      try {
        const authorId = post.author._id;
        const key = post.author.profilePic.key;
        if (!authorId) return;

        if (profilePicCache.current[authorId]) {
          setProfilePic(profilePicCache.current[authorId]);
          return;
        }
        
        const response = await axios.get(`/file/signed-url?key=${key}`);
        const url = response.data.data.url;
        profilePicCache.current[authorId] = url; 
        setProfilePic(url);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePic(profile);
      } finally {
        setLoading(false);
      }
    };
    getProfilePic();
  }, [post.author]);

  const authorProfilePic = post.author?._id === currentUser?._id ? profilePicUrl : profilePic;
  
  const formatDate = (date) => {
    const updatedDate = moment(date);
    const now = moment();
    const diffDays = now.diff(updatedDate, 'days');
    return diffDays > 2 ? updatedDate.format('ll') : updatedDate.fromNow();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:transition-colors duration-100">
      <div className="flex flex-col md:flex-row">
        <div
          onClick={() => navigate(`/posts/${post._id}`)}
          className="flex-shrink-0 w-full md:w-[10rem] h-[11rem] hover:cursor-pointer"
        >
          <img
            className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg"
            src={postFile || post.file}
            alt={post.title}
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-between p-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <img className="rounded-full w-5 h-5 object-cover" src={authorProfilePic} alt="author-profile-pic" />

             {/*  <AuthorProfilePic author={post?.author} /> */}
              <span className="px-2 text-xs">{`${post?.author?.firstName} ${post?.author?.lastName}`}</span>
              {currentUser && post?.author?._id !== currentUser._id && (
                <span
                  className={`text-blue-500 hover:underline hover:cursor-pointer ${
                    followStatuses[post?.author?._id] ? 'text-red-500' : ''
                  }`}
                  onClick={() => handleFollow(post?.author?._id)}
                >
                  {followStatuses[post?.author?._id] ? 'Unfollow' : 'Follow'}
                </span>
              )}
            </div>
            <span className="text-right text-xs text-gray-500">{formatDate(post.createdAt)}</span>
          </div>
          <h5
            onClick={() => navigate(`/posts/${post._id}`)}
            className="text-lg leading-6 sm:py-2 lg:pb-0 lg:pt-0 font-bold tracking-tight text-gray-900 hover:underline hover:cursor-pointer line-clamp-2"
          >
            {post.title}
          </h5>
          <p className="text-gray-700 lg:mb-0 sm:mb-4 text-sm line-clamp-2">
            <SanitizedContent htmlContent={post.description} allowedTags={['h1', 'strong', 'font']} />
          </p>
          <div className="flex space-x-4">
            <motion.button
              className="flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => handleLike(post._id)}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: liked ? [1, 1.2, 1] : 1, rotate: liked ? [0, 10, -10, 0] : 0 }}
              transition={{ duration: 0.3 }}
            >
              {liked ? (
                <IoIosHeart className="iconSize text-red-500" />
              ) : (
                <IoIosHeartEmpty className="iconSize" />
              )}
              <span className="text-xs">{post.likesCount}</span>
            </motion.button>
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <IoChatbubblesOutline className="iconSize" />
              <span className="text-xs">{post.commentCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

/* Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      profilePic: PropTypes.shape({
        key: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    likesCount: PropTypes.number.isRequired,
    commentCount: PropTypes.number.isRequired,
    file: PropTypes.string,
  }).isRequired,
  postFile: PropTypes.string,
  liked: PropTypes.bool.isRequired,
  handleLike: PropTypes.func.isRequired,
  followStatuses: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  handleFollow: PropTypes.func.isRequired,
}; */


export default Post;
