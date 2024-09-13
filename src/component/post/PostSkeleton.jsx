import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostSkeleton = () => {
  return (
    <div className="bg-white  rounded-lg hover:bg-gray-50 hover:transition-colors duration-100">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 w-full md:w-[10rem] h-[11rem] hover:cursor-pointer">
          <Skeleton height="100%" width="100%" className="rounded-t-lg md:rounded-l-lg" />
        </div>
        <div className="flex flex-col justify-between p-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Skeleton circle height={20} width={20} className="mr-2" />
              <Skeleton width={100} height={20} />
            </div>
            <Skeleton width={80} height={20} />
          </div>
          <h5 className="text-lg leading-6 sm:py-2 lg:pb-0 lg:pt-0 font-bold tracking-tight text-gray-900 hover:underline hover:cursor-pointer line-clamp-2">
            <Skeleton width={200} height={20} />
          </h5>
          <p className="text-gray-700 lg:mb-0 sm:mb-4 text-sm line-clamp-2">
            <Skeleton count={2} width={200} height={20} />
          </p>
          <div className="flex space-x-4">
            <Skeleton width={50} height={20} className="mr-2" />
            <Skeleton width={50} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
