import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../../utils/axiosInstance.js';

import {profile} from '../../assets/index.js'
import Button from '../../component/button/Button.jsx'
import { IoChatbubblesOutline } from 'react-icons/io5';
import { comment } from 'postcss';

const SinglePost = () => {

  const navigate = useNavigate()
  const params = useParams()
  const postId = params.id

  const [post,  setPost] = useState([])
  const [postFiles, setPostFiles] = useState([])
  const [comments, setComments] = useState([])
  const [fileUrl, setFileUrl] = useState(null)
  const [visibleReplies, setVisibleReplies] = useState({})

  useEffect(() => {
    if(postId){
        const getPost = async () => {
          try{

            const response = await axios.get(`posts/${postId}`)
            const data = response.data.data
            toast.success(data.message)
            setPost(data.post)

          }catch(error){
            const response = error.response;
            const data = response.data.data
            toast.error(data.message)
          }
      }
      getPost()
    }
  }, [postId])

  useEffect(() => {
    const getPostFiles = async () => {
      if (post.file) {
        try {
          const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
          setFileUrl(response.data.data.url);
        } catch (error) {
          const response = error.response;
          const data = response.data;
          toast.error(data.message);
        }
      }
    };
  
    if (post) {
      getPostFiles();
    }
  }, [post]);

  useEffect(() => {
    const getComments = async () => {
      if (postId) {
        try {
          const response = await axios.get(`/comments/${postId}`);
          const data = response.data;
          setComments(data);
          toast.success('Comments loaded successfully');
        } catch (error) {
          toast.error(error.response.data.message || 'Failed to load comments');
        }
      }
    };
    getComments();
  }, [postId]);

  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const getReplyText = (replies) => {
    if (!replies || replies.length === 0) return 'Reply';
    return `${replies.length} repl${replies.length === 1 ? 'reply' : 'ies'}`;
  };


  return (
    <div className='flex items-center justify-center'>
      <div className='px-4 py-8 max-w-5xl space-y-3 m-0'>
        <div className='h2 font-bold'>{post?.title}</div>
        <div className='flex items-center py-4 mt-0'>
            <img className='w-[4rem] h-[4rem] rounded-full object-cover' src={profile} alt="" />
            <span className='m-0 px-4'>{post?.updatedBy?.name}</span>
            <span className='text-blue-500 hover:underline hover:cursor-pointer'>Follow</span>
        </div>
        <div>
            <img className='rounded-xl w-full h-[50rem] object-cover' src={fileUrl} alt="" />
        </div>
        <div>
            <p className='text-lg space-y-4 '>{post?.description}</p>
        </div>
        <section className="bg-white py-8 lg:py-16 antialiased">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Discussion (20)</h2>
            </div>
            <form className="mb-6">
              <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea
                  id="comment"
                  rows="6"
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Write a comment..."
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
              >
                Post comment
              </Button>
            </form>
            {comments.map((comment) => (
              <article key={comment._id} className="p-6 px-0 text-base bg-white rounded-lg">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                      alt="Michael Gough"
                    />
                    {comment.author?.name}
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
                {/* Dropdown menu */}
                <div
                  id="dropdownComment1"
                  className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow"
                >
                  <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownMenuIconHorizontalButton">
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
                      alt="{reply.author.name}"
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
                {/* Dropdown menu */}
                <div
                  id="dropdownComment2"
                  className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow"
                >
                  <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownMenuIconHorizontalButton">
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
            ))}
            <hr className="my-4 border-t border-gray-200" />
          </div>
        </section>
      </div>
    </div>
    

    
  )
}

export default SinglePost