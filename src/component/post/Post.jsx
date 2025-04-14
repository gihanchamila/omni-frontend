import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { IoChatbubblesOutline } from 'react-icons/io5';
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';
import moment from 'moment';
import axios from '../../utils/axiosInstance.js';
import { useProfile } from "../context/useProfilePic.jsx";
import { motion } from 'framer-motion';

const Post = ({ post, postFile, liked, handleLike, followStatuses, currentUser, handleFollow }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState();
  const [loading, setLoading] = useState(true);
  const { profilePicUrl } = useProfile();
  const profilePicCache = useRef({});

  useEffect(() => {
    const fetchProfilePic = async () => {
      const authorId = post?.author?._id;
      const key = post?.author?.profilePic?.key;
      if (!authorId || profilePicCache.current[authorId]) return;

      setLoading(true);
      try {
        const response = await axios.get(`/file/signed-url?key=${key}`);
        const url = response.data.data.url;
        profilePicCache.current[authorId] = url;
        setProfilePic(url);
      } catch {
        setProfilePic(profile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePic();
  }, [post.author?._id]); // Only trigger if author ID changes

  const authorProfilePic = useMemo(() => {
    return post.author?._id === currentUser?._id ? profilePicUrl : profilePic;
  }, [post.author?._id, currentUser?._id, profilePicUrl, profilePic]);

  const formatDate = useMemo(() => {
    const updatedDate = moment(post.createdAt);
    const now = moment();
    const diffDays = now.diff(updatedDate, 'days');
    return diffDays > 2 ? updatedDate.format('ll') : updatedDate.fromNow();
  }, [post.createdAt]);

  return (
    <div className="bg-white border border-gray-300 dark:border-none rounded-lg hover:bg-gray-50 transition-colors duration-100">
      <div className="flex flex-col md:flex-row">
        <div onClick={() => navigate(`/posts/${post._id}`)} className="flex-shrink-0 w-full md:w-[10rem] lg:h-[11rem] cursor-pointer">
        <img
          className="object-cover lg:w-[160px] lg:h-[175px] xs:w-full sm:h-[250px] xs:h-[200px] rounded-t-lg md:rounded-l-lg"
          sizes="(max-width: 600px) 500px, (max-width: 1024px) 1000px, 2000px"
          src={postFile || post.file || 'fallback-image.jpg'}  
          alt={post.file || 'fallback-image.jpg'}
          loading="lazy"
        />
        </div>
        <div className="flex flex-col justify-between p-3 w-full xs:space-y-2 lg:space-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <img className="rounded-full w-5 h-5 object-cover" src={authorProfilePic} alt="author-profile-pic" loading="lazy" />
              <span className="px-2 xs:text-xs">{`${post?.author?.firstName} ${post?.author?.lastName}`}</span>
              {currentUser && post?.author?._id !== currentUser._id && (
                <span
                  className={`text-blue-500 hover:underline cursor-pointer ${
                    followStatuses[post?.author?._id] ? 'text-red-500' : ''
                  }`}
                  onClick={() => handleFollow(post?.author?._id)}
                >
                  {followStatuses[post?.author?._id] ? 'Unfollow' : 'Follow'}
                </span>
              )}
            </div>
            <span className="xs:text-xs text-gray-500">{formatDate}</span>
          </div>
          <h5 onClick={() => navigate(`/posts/${post._id}`)} className="sm:text-lg xs:text-sm font-bold tracking-tight text-gray-900 hover:underline cursor-pointer line-clamp-2 leading-6">
            {post.title}
          </h5>
          <p className="text-gray-700 sm:text-sm xs:text-xs line-clamp-2">
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
              {liked ? <IoIosHeart className="iconSize text-red-500" /> : <IoIosHeartEmpty className="iconSize" />}
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

export default Post;
