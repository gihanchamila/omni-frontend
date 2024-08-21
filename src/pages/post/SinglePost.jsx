import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../../utils/axiosInstance.js';
import io from 'socket.io-client';
import BackButton from '../../component/button/BackButton.jsx';
import Modal from '../../component/modal/Modal.jsx'

import {profile} from '../../assets/index.js'
import Button from '../../component/button/Button.jsx'
import { IoChatbubblesOutline } from 'react-icons/io5';
import addCommentValidator from '../../validators/addCommentValidator.js';

import SanitizedContent from '../../component/quill/SanitizedContent.jsx';

const initialFormData = {content : ""}
const initialFormError = {content : ""}

const socket = io('http://localhost:8000');

const SinglePost = () => {

  const navigate = useNavigate()
  const params = useParams()
  const postId = params.id

  const [post,  setPost] = useState([])
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0);
  const [fileUrl, setFileUrl] = useState(null)
  const [visibleReplies, setVisibleReplies] = useState({})
  const [visibleNestedReplies, setVisibleNestedReplies] = useState({});
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState(initialFormError)
  const [replyFormdata, setReplyFormData] = useState(initialFormData)
  const [replyFormError, setReplyFormError] = useState(initialFormError)
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyToReply, setReplyToReply] = useState(null);
  const [replyToReplyFormData, setReplyToReplyFormData] = useState(initialFormData);
  const [replyToReplyFormError, setReplyToReplyFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false)
  const [dropdownOpenParent, setDropdownOpenParent] = useState({})
  const [dropdownOpenReply, setDropdownOpenReply] = useState({})
  const [dropdownOpenReplyToReply, setDropdownOpenReplyToReply] = useState({})
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Listen for the 'commentAdded' event
    socket.on('commentAdd', ({ postId: updatedPostId}) => {
        if (updatedPostId === postId) {
            setCommentCount(prevCount => prevCount + 1);
        }
    });

    return () => {
        socket.off('commentAdd');
    };
}, [postId]);

  useEffect(() => {
    // Listen for the 'commentAdded' event
    socket.on('replyAdd', ({ postId: updatedPostId}) => {
        if (updatedPostId === postId) {
            setCommentCount(prevCount => prevCount + 1);
        }
    });

    return () => {
        socket.off('replyAdd');
    };
  }, [postId]);

  useEffect(() => {
    // Listen for the 'commentAdded' event
    socket.on('nestedReplyAdd', ({ postId: updatedPostId}) => {
        if (updatedPostId === postId) {
            setCommentCount(prevCount => prevCount + 1);
        }
    });

    return () => {
        socket.off('nestedReplyAdd');
    };
  }, [postId]);

  useEffect(() => {
    socket.on('commentRemove', ({postId: updatedPostId }) => {
        if (updatedPostId === postId) { // Check if the postId matches
            setCommentCount(prevCount => prevCount - 1);
        }
    });

    return () => {
        socket.off('commentRemove');
    };
  }, [postId]);

  useEffect(() => {
    if (postId) {
        const getPost = async () => {
            try {
                const response = await axios.get(`/posts/${postId}`);
                const data = response.data.data;
                setPost(data.post);
            } catch (error) {
                const response = error.response;
                const data = response?.data?.data || {};
                toast.error(data.message || 'Failed to fetch post');
            }
        };

        const getCurrentUser = async () => {
          try {
              const response = await axios.get(`/auth/current-user`);
              const user = response.data.data.user; 
              console.log('Current User Data:', user); 
              if (user && user._id) {
                  setCurrentUser(user._id); 
                  toast.success(`Your name is ${user._id}`); 
              } else {
                  toast.error('User data is incomplete');
              }
          } catch (error) {
              toast.error('Error getting user');
          }
      };
       
        getPost();
        getCurrentUser();
    }
}, [postId]);

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
    }
    if (post) {
      getPostFiles();
    }
  }, [post]);

  useEffect(() => {
    const getComments = async () => {
      if (postId) {
        try {
          const response = await axios.get(`/comments/${postId}/comments`);
          const data = response.data.data;
          setComments(data);
        } catch (error) {
          toast.error(error.response.data.message || 'Failed to load comments');
        }
      }
    };
    getComments();
  }, [postId]);

  useEffect(() => {
    const getCommentCount = async () => {
      if(postId){
        try{
          const response = await axios.get(`/comments/${postId}/commentCount`)
          const data = response.data
          toast.success(data.message)
          console.log(data.data.count.commentCount)
          setCommentCount(data.data.count.commentCount)
        }catch(error){
          const response = error.response
          const data = response.data
          toast.error(data.message)
        }
      }
    }
    getCommentCount()
  }, [postId]) 

  const toggleReplies = (commentId) => {
    setVisibleReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };
    
  const getReplyText = (replies) => {
    return replies.length > 0 ? `${replies.length} ${replies.length > 1 ? 'replies' : 'reply'}` : 'Reply';
  };

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name] : e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = addCommentValidator({ content: formData.content });
    if (errors.content) {
      setFormError(errors);
      return; 
    }
  
    try {
      setLoading(true);
      const response = await axios.post(`/comments/${postId}`, formData);
      const newComment = response.data.data
      setComments((prevComments) => [newComment, ...prevComments]);
      setFormData(initialFormData);
    } catch (error) {
      setFormError({ content: error.message || 'An error occurred' });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleReplyForm = (commentId) => {
    setReplyingTo(prevId => (prevId === commentId ? null : commentId));
  };

  const handleClick = (commentId) => {
    toggleReplies(commentId);
    toggleReplyForm(commentId);
  };

  const handleReplyChange = (e) => {
    setReplyFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReplyToReplyChange = (e) => {
    setReplyToReplyFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();

    const errors = addCommentValidator({ content: replyFormdata.content });
    if (errors.content) {
        setReplyFormError(errors);
        return;
    }

    try {
        setLoading(true);
        const response = await axios.post(`/comments/${postId}/reply/${commentId}`, replyFormdata);
        const newReply = response.data.data.reply;

        // Update the state with the new reply
        setComments(prevComments => {
            const addReply = (comments) => {
                return comments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, replies: [newReply, ...comment.replies] }
                        : {
                            ...comment,
                            replies: addReply(comment.replies)
                        }
                );
            };
            return addReply(prevComments);
        });
        setReplyFormData(initialFormData);
    } catch (error) {
        setReplyFormError({ content: error.message || 'An error occurred' });
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  const handleReplyToReplySubmit = async (e, replyId) => {
    e.preventDefault();

    const errors = addCommentValidator({ content: replyToReplyFormData.content });
    if (errors.content) {
        setReplyToReplyFormError(errors);
        return;
    }

    try {
        setLoading(true);
        const response = await axios.post(`/comments/${postId}/reply/${replyId}`, replyToReplyFormData);
        const newReplyToReply = response.data.data.reply;  // Extracting the newly created reply

        setComments(prevComments => {
            const updateReplies = (replies) => {
                if (!Array.isArray(replies)) {
                    return [];
                }

                return replies.map(reply =>
                    reply._id === replyId
                        ? { ...reply, replies: [newReplyToReply, ...reply.replies] }  // Prepending the new reply
                        : { ...reply, replies: updateReplies(reply.replies) }  // Recursively updating replies
                );
            };

            const updatedComments = prevComments.map(comment =>
                comment.replies ? { ...comment, replies: updateReplies(comment.replies) } : comment
            );

            return updatedComments;
        });

        setReplyToReplyFormData(initialFormData);
    } catch (error) {
        setReplyToReplyFormError({ content: error.message || 'An error occurred' });
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  const toggleReplyToReplyForm = (replyId) => {
    console.log('Toggling reply form for ID:', replyId);
    setReplyToReply(prevId => {
      const newId = prevId === replyId ? null : replyId;
      return newId;
    });
  };

  const toggleNestedReplies = (replyId) => {
    setVisibleNestedReplies(prevState => {
      console.log('Previous state:', prevState);
      const newState = {
        ...prevState,
        [replyId]: !prevState[replyId],
      };
      console.log('New state:', newState);
      return newState;
    });
  };

  const toggleDropdownParent = (commentId) => {
    setDropdownOpenParent((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const toggleDropdownReply = (commentId, open = null) => {
    setDropdownOpenReply((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const toggleDropdownReplyToReply = (commentId) => {
    setDropdownOpenReplyToReply((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const handleDelete = async (commentId) => {
    try {
        // Perform delete request
        const response = await axios.delete(`/comments/${commentId}`);
        const data = response.data;
        toast.success(data.message);

        const response2 = await axios.get(`/comments/${postId}/comments`);
        const data2 = response2.data.data; 
        setComments(data2); 

    } catch (error) {

        const response = error.response;
        const data = response?.data || {};
        toast.error(data.message || 'An error occurred');
    }
  };

  const handlePostDelete = async (postId) => {
    try{
      const response = await axios.delete(`/posts/${postId}`)
      const data = response.data;
      toast.success(data.message)
      setShowModal(false)
      navigate('/posts')
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message)
    }
  }

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }


  return (

    /* Post Section */

    <div className='flex items-center justify-center'>
      <div className=' py-8 max-w-5xl z-auto space-y-3 m-0'>
        <div className='flex justify-between items-center'>
        <BackButton />
        <div className='flex space-x-4 z-auto'>
        {currentUser && post && currentUser === post?.author?._id ? (
            <>
            <Link to={`/posts/update-post/${post._id}`}>
                <div className='p-2 text-sm px-4 bg-gray-100 hover:bg-gray-200 rounded-full'>
                    Update
                </div>
            </Link>
            <button onClick={openModal}>
                <div className='p-2 text-sm px-4 text-white bg-red-500 hover:bg-red-600 rounded-full'>
                    Delete
                </div>
            </button>
            </>
            
        ) : null}
        </div>
        
        </div>
        <div className='h2 font-bold w-full'>{post?.title}</div>
        <div className='flex items-center py-4 mt-0'>
            <img className='w-[3rem] h-[3rem] rounded-full object-cover' src={profile} alt="" />
            <span className='m-0 px-4'>{post?.updatedBy?.name}</span>
            <span className='text-blue-500 hover:underline hover:cursor-pointer'>Follow</span>
        </div>
        <div>
            <img className='rounded-xl w-full h-[50rem] object-cover' src={fileUrl} alt="" />
        </div>
        <div>
            <p className='text-lg space-y-4 '>
              <SanitizedContent htmlContent={post?.description}/> 
            </p>
        </div>

        {/* Post comment  */}

        <section className="bg-white pt-0 py-8 lg:py-16 lg:pt-5 antialiased">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Discussion ({commentCount})</h2>
            </div>
            <form className="mb-6" onSubmit={handleSubmit}>
              <div className="py-4 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea
                  id="comment"
                  rows="6"
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Write a comment..."
                  name = "content"
                  value = {formData.content}
                  onChange = {handleChange}
                  required
                ></textarea>
              </div>
              <Button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700  hover:bg-primary-800">
                Post comment
              </Button>
            </form>

            {/* Parent comments  */}

            {comments.map((comment) => (
              <article key={comment._id} className="relative pt-4 px-0 text-base bg-white rounded-lg">
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                      <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                        alt="Michael Gough"
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
                    data-dropdown-toggle="dropdownComment2"
                    className="inline-flex items-center p-2 top-5 text-sm font-medium text-center text-gray-500"
                    type="button"
                    onClick={() => toggleDropdownParent(comment._id)}
                  >
                    <svg
                      className="w-4 h-4 text-end"
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
                  {dropdownOpenParent[comment._id] && (
                    <div key={comment._id} className="absolute  -top-50 left-[50rem] ">
                    <div id={comment._id} className="z-10 absolute py-2 w-36 bg-white rounded-lg border-2 border-gray-100">
                        <ul className="py-1 text-sm text-gray-700">
                            <li className='block py-1 px-4 hover:bg-gray-100 w-full text-left'>Edit</li>
                        </ul>
                        <ul className="py-1 text-sm text-gray-700">
                            <li onClick={() => handleDelete(comment._id)} className='block py-1 px-4 hover:bg-gray-100 w-full text-left cursor-pointer'>Remove</li>
                        </ul>
                        <ul className="py-1 text-sm text-gray-700">
                            <li className='block py-1 px-4 hover:bg-gray-100 w-full text-left'>Report</li>
                        </ul>
                    </div>
                    </div>
                  )}
                </footer>

              <p className="text-gray-500">{comment.content}</p>
              <div className="flex items-center mt-4 space-x-4">
                <button
                  type="button"
                  className="flex items-center text-sm text-gray-500 hover:underline font-medium"
                  onClick={() => {handleClick(comment._id);}}
                >
                  <IoChatbubblesOutline className='iconSize' />
                  {getReplyText(comment.replies)}
                </button>
              </div>

              {/* Reply Comment*/}

              {replyingTo === comment._id && (
                <form onSubmit={(e) => handleReplySubmit(e, comment._id)}>
                  <div className=" mt-4 ml-[4.5rem]  p-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                    <label htmlFor={`reply-${comment._id}`} className="sr-only">Your reply</label>
                    <textarea
                      id={`reply-${comment._id}`}
                      rows="4"
                      className="px-0 h-[2rem] w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                      placeholder="Write a reply..."
                      name="content"
                      value={replyFormdata.content}
                      onChange={handleReplyChange}
                      required
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    className="ml-[4.5rem] mt-4 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg  hover:bg-primary-800"
                  >
                    Reply
                  </Button>
                </form>
              )}

              {visibleReplies[comment._id] && comment.replies && comment.replies.map((reply) => (
                <article key={reply._id} className="p-6 pr-0 pb-0 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg">
                <footer className="flex justify-between  items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                      <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="{reply.author.name}"
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
                    data-dropdown-toggle="dropdownComment2"
                    className="inline-flex items-center p-2 top-5 text-sm font-medium text-center text-gray-500"
                    type="button"
                    onClick={() => toggleDropdownReply(reply._id)}
                  >
                    <svg
                      className="w-4 h-4 text-end"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 3"
                    >
                      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                    <span className="sr-only">Comment settings</span>
                  </button>
                  
                  {dropdownOpenReply[reply._id] && (
                    <div className="absolute  -top-50 left-[50rem] ">
                    <div id={reply._id} className="z-10 absolute py-2 w-36 bg-white rounded-lg border-2 border-gray-100">
                        <ul className="py-1 text-sm text-gray-700">
                            <li className='block py-1 px-4 hover:bg-gray-100 w-full text-left'>Edit</li>
                        </ul>
                        <ul className="py-1 text-sm text-gray-700">
                            <li onClick={() => handleDelete(reply._id)} className='block py-1 px-4 hover:bg-gray-100 w-full text-left cursor-pointer'>Remove</li>
                        </ul>
                        <ul className="py-1 text-sm text-gray-700">
                            <li className='block py-1 px-4 hover:bg-gray-100 w-full text-left'>Report</li>
                        </ul>
                    </div>
                    </div>
                  )}

                </footer>
                <p className="text-gray-500">{reply.content}</p>
                <div className="flex items-center mt-4 space-x-4">
                  <button
                    type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline font-medium"
                    onClick={() => {toggleNestedReplies(comment._id); toggleReplyToReplyForm(reply._id) }}
                  >
                    <IoChatbubblesOutline className='iconSize' />
                    {getReplyText(reply.replies)}
                  </button>
                </div>

                  {/* Reply to Reply */}

                  {replyToReply === reply._id && (
                  <form onSubmit={(e) => handleReplyToReplySubmit(e, reply._id)}>
                      <div className="mt-4 ml-[4.5rem] p-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                          <label htmlFor={`replyToReply-${reply._id}`} className="sr-only">Your reply</label>
                          <textarea
                              id={`replyToReply-${reply._id}`}
                              rows="4"
                              className="px-0 h-[2rem] w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                              placeholder="Write a reply..."
                              name="content"
                              value={replyToReplyFormData.content}
                              onChange={handleReplyToReplyChange}
                              required
                          ></textarea>
                      </div>
                      <Button
                          type="submit"
                          className="ml-[4.5rem] mt-4 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800"
                      >
                          Reply
                      </Button>
                  </form>
                  )}
                  {visibleNestedReplies[comment._id] && reply.replies && reply.replies.map((nestedReply) => (
                     <article key={nestedReply._id} className='ml-6 p-6 pr-0 pb-0 mb-3 lg:ml-12 text-base bg-white rounded-lg'>
                      <footer  className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                          <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                            alt="{reply.author.name}"
                          />
                          {nestedReply.author?.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <time dateTime={nestedReply.createdAt}>
                              {new Date(nestedReply.createdAt).toLocaleDateString()}
                          </time>
                        </p>
                      </div>

                      <button
                        data-dropdown-toggle="dropdownComment2"
                        className="inline-flex items-center p-2 top-5 text-sm font-medium text-center text-gray-500"
                        type="button"
                        onClick={() => toggleDropdownReplyToReply(nestedReply._id)}
                  >
                    <svg
                      className="w-4 h-4 text-end"
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

                      {dropdownOpenReplyToReply[nestedReply._id] && (
                        <div className="absolute  -top-50 left-[50rem] ">
                          <div id={nestedReply._id} className="z-10 absolute py-2 w-36 bg-white rounded-lg border-2 border-gray-100">
                              <ul className="py-1 text-sm text-gray-700">
                                  <li className='block py-1 px-4 hover:bg-gray-100 w-full text-left'>Edit</li>
                              </ul>
                              <ul className="py-1 text-sm text-gray-700">
                                  <li onClick={() => handleDelete(nestedReply._id)} className='block py-1 px-4 hover:bg-gray-100 w-full text-left cursor-pointer'>Remove</li>
                              </ul>
                              <ul className="py-1 text-sm text-gray-700">
                                  <li className='block py-1 px-4 hover:bg-gray-100 w-full text-left'>Report</li>
                              </ul>
                          </div>
                        </div>
                      )}
                      </footer>
                      <p className="text-gray-500 pb-4">{nestedReply.content}</p>
                    </article>
                  ))}
                </article>
              ))}
            <hr className="mt-6 border-t border-gray-200" />
            </article>
            ))}
          </div>
        </section>
        <Modal 
        className='z-auto'
        showModal={showModal}
        title="Are you sure you want to delete this post?"
        onConfirm={() => handlePostDelete(post._id)}
        onCancel={closeModal}/>
      </div>
    </div>
  )
  
}

export default SinglePost