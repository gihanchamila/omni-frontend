import React from 'react';
import DropdownMenu from './DropdownMenu.jsx';

const CommentFooter = ({ author, createdAt, dropdownId, actionHandlers, imageUrl }) => {
  return (
    <footer className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
          <img
            className="mr-2 w-6 h-6 rounded-full"
            src={imageUrl || 'https://default-image-url.com/default-profile.jpg'}
            alt={author?.name || 'Anonymous'}
          />
          {author?.name || 'Anonymous'}
        </p>
        <p className="text-sm text-gray-600">
          <time dateTime={createdAt}>
            {new Date(createdAt).toLocaleDateString()}
          </time>
        </p>
      </div>
      <DropdownMenu dropdownId={dropdownId} actionHandlers={actionHandlers} />
    </footer>
  );
};

export default CommentFooter;
