import React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from './DropdownMenu.jsx';
import { motion } from 'framer-motion';

const CommentFooter = ({ author, createdAt, dropdownId, actionHandlers, imageUrl, currentUser, authorId }) => {
  const authorName = (author?.firstName || author?.lastName) 
    ? `${author?.firstName || ''} ${author?.lastName || ''}`.trim() 
    : 'Anonymous';


    const MotionDropDownMenu = motion(DropdownMenu)
  return (
    <motion.footer 
      className="flex justify-between items-center mb-2"
      >
      <motion.div 
      className="flex items-center"
      >
        <motion.p 
        className="inline-flex items-center mr-3 text-sm text-slate-800 dark:text-white font-semibold sm:text-base xs:text-xs">
          <img
            className="mr-2 w-6 h-6 rounded-full dark:text-white "
            src={imageUrl}
            alt={authorName}
          />
          {authorName}
        </motion.p >
        <motion.p 
          className="text-sm text-gray-600"
        >
          <time dateTime={createdAt} className='dark:text-white sm:text-base xs:text-xs'>
            {new Date(createdAt).toLocaleDateString()}
          </time>
        </motion.p>
      </motion.div>
      <MotionDropDownMenu 
        dropdownId={dropdownId} 
        currentUser={currentUser} 
        author={author} 
        authorId={authorId} 
        actionHandlers={actionHandlers} />
    </motion.footer>
  );
};

CommentFooter.propTypes = {
  createdAt: PropTypes.string.isRequired,
  dropdownId: PropTypes.string.isRequired,
  actionHandlers: PropTypes.object.isRequired,
};

export default CommentFooter;