import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoChatbubblesOutline } from 'react-icons/io5';
import Button from '../../component/button/Button.jsx';
import { profile } from '../../assets/index.js';

const Comment = ({ comment, onReplySubmit, replyingTo, onToggleReplies }) => {
  const [replyFormData, setReplyFormData] = useState({ content: '' });
  const [replyFormError, setReplyFormError] = useState({ content: '' });

  const handleReplyChange = (e) => {
    setReplyFormData({ ...replyFormData, [e.target.name]: e.target.value });
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyFormData.content) {
      setReplyFormError({ content: 'Reply content is required' });
      return;
    }
    onReplySubmit(replyFormData);
    setReplyFormData({ content: '' });
    setReplyFormError({ content: '' });
  };

  return (
    <article key={comment._id} className="pt-4 px-0 text-base bg-white rounded-lg">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src={profile} // Update with actual profile picture URL
              alt="Profile"
            />
            {comment.author?.name || 'Anonymous'}
          </p>
          <p className="text-sm text-gray-600">
            <time dateTime={comment.createdAt}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </time>
          </p>
        </div>
        <button
          id="dropdownComment1Button"
          data-dropdown-toggle="dropdownComment1"
          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500"
          type="button"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
          <span className="sr-only">Comment settings</span>
        </button>
      </footer>

      <p className="text-gray-500">{comment.content}</p>
      <div className="flex items-center mt-4 space-x-4">
        <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:underline font-medium"
          onClick={() => onToggleReplies(comment._id)}
        >
          <IoChatbubblesOutline className='iconSize' />
          {comment.replies && comment.replies.length
            ? `${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
            : 'Reply'}
        </button>
      </div>

      {replyingTo === comment._id && (
        <form onSubmit={handleReplySubmit}>
          <div className="mt-4 ml-[4.5rem] p-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
            <label htmlFor={`reply-${comment._id}`} className="sr-only">Your reply</label>
            <textarea
              id={`reply-${comment._id}`}
              rows="4"
              className="px-0 h-[2rem] w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Write a reply..."
              name="content"
              value={replyFormData.content}
              onChange={handleReplyChange}
              required
            ></textarea>
          </div>
          <Button
            type="submit"
            className="ml-[4.5rem] mt-4 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
          >
            Reply
          </Button>
        </form>
      )}

      {comment.replies && comment.replies.map((reply) => (
        <article key={reply._id} className="p-6 pr-0 pb-0 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg">
          <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                <img
                  className="mr-2 w-6 h-6 rounded-full"
                  src={profile} // Update with actual profile picture URL
                  alt="Profile"
                />
                {reply.author?.name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-600">
                <time dateTime={reply.createdAt}>
                  {new Date(reply.createdAt).toLocaleDateString()}
                </time>
              </p>
            </div>
            <button
              id="dropdownComment2Button"
              data-dropdown-toggle="dropdownComment2"
              className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500"
              type="button"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 3"
              >
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
              <span className="sr-only">Comment settings</span>
            </button>
          </footer>
          <p className="text-gray-500">{reply.content}</p>
          <div className="flex items-center mt-4 space-x-4">
            <button
              type="button"
              className="flex items-center text-sm text-gray-500 hover:underline font-medium"
            >
              <IoChatbubblesOutline className='iconSize' />
              Reply
            </button>
          </div>
        </article>
      ))}
    </article>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string,
    }),
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        author: PropTypes.shape({
          name: PropTypes.string,
        }),
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onReplySubmit: PropTypes.func.isRequired,
  replyingTo: PropTypes.string,
  onToggleReplies: PropTypes.func.isRequired,
};

export default Comment;