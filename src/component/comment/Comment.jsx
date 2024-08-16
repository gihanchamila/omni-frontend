import React from 'react';
import PropTypes from 'prop-types';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { toast } from 'sonner';

const Comment = ({ comment, toggleReplies, visibleReplies }) => {
  const getReplyText = (replies) => {
    if (!replies || replies.length === 0) return 'Reply';
    return `${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}`;
  };

  return (
    <article key={comment._id} className="pt-4 px-0 text-base bg-white rounded-lg">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
              alt={comment.author?.name || 'Anonymous'}
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
          id={`dropdownComment${comment._id}Button`}
          data-dropdown-toggle={`dropdownComment${comment._id}`}
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
        {/* Dropdown menu */}
        <div
          id={`dropdownComment${comment._id}`}
          className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow"
        >
          <ul className="py-1 text-sm text-gray-700" aria-labelledby={`dropdownComment${comment._id}Button`}>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                Edit
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                Remove
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                Report
              </a>
            </li>
          </ul>
        </div>
      </footer>
      <p className="text-gray-500">{comment.content}</p>
      <div className="flex items-center mt-4 space-x-4">
        <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:underline font-medium"
          onClick={() => toggleReplies(comment._id)}
        >
          <IoChatbubblesOutline className='iconSize' />
          {getReplyText(comment.replies)}
        </button>
      </div>
      {visibleReplies[comment._id] && comment.replies && comment.replies.map((reply) => (
        <article key={reply._id} className="p-6 pr-0 pb-0 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg">
          <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                <img
                  className="mr-2 w-6 h-6 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt={reply.author.name}
                />
                {reply.author.name}
              </p>
              <p className="text-sm text-gray-600">
                <time dateTime={reply.createdAt}>
                    {new Date(reply.createdAt).toLocaleDateString()}
                </time>
              </p>
            </div>
            <button
              id={`dropdownReply${reply._id}Button`}
              data-dropdown-toggle={`dropdownReply${reply._id}`}
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
              <span className="sr-only">Reply settings</span>
            </button>
            {/* Dropdown menu */}
            <div
              id={`dropdownReply${reply._id}`}
              className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow"
            >
              <ul className="py-1 text-sm text-gray-700" aria-labelledby={`dropdownReply${reply._id}Button`}>
                <li>
                  <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                    Edit
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                    Remove
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-4 hover:bg-gray-100">
                    Report
                  </a>
                </li>
              </ul>
            </div>
          </footer>
          <p className="text-gray-500">{reply.content}</p>
        </article>
      ))}
    </article>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string,
    }),
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        author: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
  }).isRequired,
  toggleReplies: PropTypes.func.isRequired,
  visibleReplies: PropTypes.objectOf(PropTypes.bool).isRequired,
};

export default Comment;
