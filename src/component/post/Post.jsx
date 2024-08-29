import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { IoChatbubblesOutline } from 'react-icons/io5';
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';
import { profile } from '../../assets/index.js';
import moment from 'moment';

const Post = ({ post, postFile, liked, handleLike, followStatuses, currentUser, handleFollow }) => {
  const navigate = useNavigate();

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
          />
        </div>
        <div className="flex flex-col justify-between p-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <img className="rounded-full w-5 h-5 object-cover" src={profile} alt="" />
              <span className="px-2 text-xs">{post.author.name}</span>
              <span
                className={`text-blue-500 hover:underline hover:cursor-pointer ${
                  followStatuses[post.author._id] ? 'text-red-500' : ''
                }`}
                onClick={() => handleFollow(post.author._id)}
              >
                {followStatuses[post.author._id]
                  ? post.author._id !== currentUser._id && 'Unfollow'
                  : post.author._id !== currentUser._id && 'Follow'}
              </span>
            </div>
            <span className="text-right text-xs text-gray-500">{formatDate(post.updatedAt)}</span>
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
            <button
              className="flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => handleLike(post._id)}
            >
              {liked ? (
                <IoIosHeart className="iconSize text-red-500" />
              ) : (
                <IoIosHeartEmpty className="iconSize" />
              )}
              <span className="text-xs">{post.likesCount}</span>
            </button>
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
