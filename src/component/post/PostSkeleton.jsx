import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg animate-pulse">
  <div className="flex flex-col md:flex-row">
    <div className="flex-shrink-0 w-full md:w-[10rem] h-[11rem] bg-gray-300 rounded-t-lg md:rounded-l-lg"></div>
    <div className="flex flex-col justify-between p-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <div className="rounded-full w-5 h-5 bg-gray-300"></div>
          <div className="px-2 w-20 h-4 bg-gray-300"></div>
          <div className="w-16 h-4 bg-gray-300"></div>
        </div>
        <div className="w-16 h-4 bg-gray-300"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-3/4 my-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full my-2"></div>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-4 bg-gray-300"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-4 bg-gray-300"></div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default PostSkeleton;
