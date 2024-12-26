import { useState, useEffect, useRef  } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSocket } from '../../hooks/useSocket.jsx';
import { useNotification } from '../../component/context/useNotification.jsx';
import axios from '../../utils/axiosInstance.js';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import BackButton from '../../component/button/BackButton.jsx';
import Modal from '../../component/modal/Modal.jsx';
import CommentForm from '../../component/comment/CommentForm.jsx';
import CommentFooter from '../../component/comment/CommentFooter.jsx';
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';

import { useProfile } from '../../component/context/useProfilePic.jsx';

import { IoChatbubblesOutline } from 'react-icons/io5';

import addCommentValidator from '../../validators/addCommentValidator.js';

const initialFormData = {content : ""}
const initialFormError = {content : ""}


const SinglePost = () => {

  const navigate = useNavigate()
  const params = useParams()
  const socket = useSocket()
  const { setNotifications } = useNotification()
  const { profilePicUrl, fetchProfilePic, getCurrentUser } = useProfile();
  const postId = params.id
  const hasListeners = useRef(false);

  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState();
  const [fileUrl, setFileUrl] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);

  const [followStatuses, setFollowStatuses] = useState({});

  const [replyFormData, setReplyFormData] = useState(initialFormData);
  const [replyFormError, setReplyFormError] = useState(initialFormError);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyToReply, setReplyToReply] = useState(null);
  const [replyToReplyFormData, setReplyToReplyFormData] = useState(initialFormData);
  const [replyToReplyFormError, setReplyToReplyFormError] = useState(initialFormError);

  const [visibleReplies, setVisibleReplies] = useState({});
  const [visibleNestedReplies, setVisibleNestedReplies] = useState({});

  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [profileUrl, setProfileUrl] = useState()
  const [profilePic, setProfilePic] = useState();
  const [authorId, setAuthorId] = useState()

  const actionHandlers = {
    edit: (commentId) => {
      // handle edit
    },
    delete: (commentId) => {
      handleDelete(commentId)
    },
    report: (commentId) => {
      // handle report
    },
  };
  
  useEffect(() => {

    if (!hasListeners.current) {
      const handleCommentAdd = ({ postId: updatedPostId, profilePicKey }) => {
        if (updatedPostId === postId) {
          setCommentCount(prevCount => prevCount + 1);
            fetchProfilePic(profilePicKey)
            fetchSignedUrl(profilePicKey)
        }
      };
  
      const handleReplyAdd = ({ postId: updatedPostId, profilePicKey }) => {
        if (updatedPostId === postId) {
          setCommentCount(prevCount => prevCount + 1);
            fetchProfilePic(profilePicKey)
            fetchSignedUrl(profilePicKey)
        }
      };
  
      const handleNestedReplyAdd = ({ postId: updatedPostId, profilePicKey }) => {
        if (updatedPostId === postId) {
          setCommentCount(prevCount => prevCount + 1);
            fetchProfilePic(profilePicKey)
            fetchSignedUrl(profilePicKey)
        }
      };
      
      const handleCommentRemove = ({ postId: updatedPostId, count, deletedCommentIds }) => {
        if (updatedPostId === postId) {
          setCommentCount(prevCount => prevCount - count);
        }
        setComments(prevComments => prevComments.filter(comment => !deletedCommentIds.includes(comment._id)));
      };
     
  
      const handleFollowStatusUpdate = ({ followerId, followingId }) => {
        setFollowStatuses(prevStatuses => ({
          ...prevStatuses,
          [followingId]: followerId === socket.id,
        }));
      };
  
      if (!hasListeners.current) {
        socket.on('commentAdd', handleCommentAdd);
        socket.on('replyAdd', handleReplyAdd);
        socket.on('nestedReplyAdd', handleNestedReplyAdd);
        socket.on('commentRemove', handleCommentRemove);
        socket.on('follow-status-updated', handleFollowStatusUpdate);
    
        hasListeners.current = true;
      }
  
      return () => {
        socket.off('commentAdd', handleCommentAdd);
        socket.off('replyAdd', handleReplyAdd);
        socket.off('nestedReplyAdd', handleNestedReplyAdd);
        socket.off('commentRemove', handleCommentRemove);
        socket.off('follow-status-updated', handleFollowStatusUpdate);
    
        hasListeners.current = false;
      };
    }
  }, [socket, postId, fetchProfilePic,]);


  
  useEffect(() => {
    if (postId) {
        const getPost = async () => {
            try {
                const response = await axios.get(`/posts/${postId}`);
                const data = response.data.data;
                setPost(data.post);
                const url = data.post.author.profilePic.key;
                setAuthorId(data.post.author._id);
                setProfileUrl(url); 
            } catch (error) {
                const response = error.response;
                const data = response?.data?.data || {};
                toast.error(data.message || 'Failed to fetch post');
            }
        };

        /* const getCommentCount = async () => {
          try {
                setLoading(true)
                const response = await axios.get(`/comments/${postId}/commentCount}`);
                const data = response.data.data;
                setCommentCount(data.count.commentCount)
                setLoading(false)
          }catch(error){
                setLoading(false)
                const response = error.response;
                const data = response?.data.data || {};
                toast.error(data.message)
          }
        }; */

        const getCurrentUser = async () => {
            try {
                const response = await axios.get(`/auth/current-user`);
                const user = response.data.data.user;
                if (user && user._id) {
                    setCurrentUser(user._id);
                } else {
                    toast.error('User data is incomplete');
                }
            } catch (error) {
                toast.error('Error getting user');
            }
        };

        const getProfilePic = async () => {
          if (profileUrl) {  
              try {
                  const response = await axios.get(`/file/signed-url?key=${profileUrl}`);
                  const data = response.data.data;
                  setProfilePic(response.data.data.url)
                  toast.success(data.message);
              } catch (error) {
                  console.log("Failed to get profile picture");
              }
          }
        };

        const fetchData = async () => {
            setLoading(true); 
            try {
                await Promise.all([getPost(), getCurrentUser(), getProfilePic()]);  
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }
  }, [postId, profileUrl]); 

  const authorProfilePic = post.author?._id === currentUser?._id ? profilePicUrl : profilePic;

  useEffect(() => {
    const getPostFiles = async () => {
        if (post?.file) { 
            try {
                setLoading(true);
                const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
                const data = response.data.data;
                setFileUrl(data.url);
            } catch (error) {
                const response = error.response;
                const data = response.data;
                toast.error(data.message || "Failed to fetch file");
            } finally {
                setLoading(false);  // Always stop loading
            }
        }
    };

    if (post) {
        getPostFiles();
    }
  }, [post]);

  const fetchSignedUrl = async (key) => {
    try {
      const response = await axios.get(`/file/signed-url?key=${key}`);
      return response.data.data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get signed URL');
      return null; // Return null if failed to get URL
    }
  };

  useEffect(() => {
    const getComments = async () => {
      if (postId) {
        try {
          setLoading(true);
          const response = await axios.get(`/comments/${postId}/comments`);
          const data = response.data.data;
          console.log(data)
  
          const formattedComments = await Promise.all(data.map(async (comment) => {
            let commenterProfilePicUrl = null;
  
            if (comment.author && comment.author.profilePic) {
              try {
                commenterProfilePicUrl = await fetchSignedUrl(comment.author.profilePic.key);
              } catch (error) {
                console.error('Failed to fetch profile picture URL', error);
              }
            }
  
          /*   const authorFullName = `${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`.trim(); */
  
            return {
              ...comment,
              author: {
                ...comment.author,
                profilePic: commenterProfilePicUrl
              }
            };
          }));
  
          setComments(formattedComments);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load comments');
        } finally {
          setLoading(false);
        }
      }
    };

    getComments();
  }, [postId]);
  
  useEffect(() => {
    const getCommentCount = async () => {
      if(postId){
        try{
          setLoading(true)
          const response = await axios.get(`/comments/${postId}/commentCount`)
          const data = response.data
          setCommentCount(data.data.count.commentCount)

          setLoading(false)
        }catch(error){
          setLoading(false)
          const response = error.response
          const data = response.data
          toast.error(data.message)
        }
      }
    }
    getCommentCount()
  }, [postId]) 

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (post && post.author && post.author._id) {
        try {  
          // Fetch follow status from API
          setLoading(true)
          const response = await axios.get(`/user/follow-status/${post.author._id}`);
          setLoading(false)
          setFollowStatuses((prevStatuses) => ({
            ...prevStatuses,
            [post.author._id]: response.data.data.isFollowing,
            
          }));
        } catch (error) {
          setLoading(false)
          console.error(`Error fetching follow status for author ${post.author._id}:`, error);
          toast.error(`Error fetching follow status for author ${post.author._id}:`, error)
        }
      }
      
    };
    fetchFollowStatus()
  }, [post]);

  const handleFollow = async (authorId) => {
    try {
      setLoading(true)
      const isFollowing = followStatuses[authorId];
      const response = isFollowing 
        ? await axios.delete(`/user/follow/${authorId}`) 
        : await axios.post(`/user/follow/${authorId}`);
  
      toast.success(response.data.message);
      setFollowStatuses(prev => ({
        ...prev,
        [authorId]: !isFollowing
      }));
  
      socket.emit('follow-status-changed', { authorId, isFollowing: !isFollowing });
      setLoading(false)
    } catch (error) {
      setLoading(false)
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  };

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
      const newComment = response.data.data;
      const { notificationId } = response.data;
  
      if (socket) {
        socket.emit("newComment", {notificationId});
      }
  
      setNotifications(prev => [...prev, {
        type: "comment",
        message: `New comment on post ${postId}`,
        isRead: false,
        _id : notificationId
      }]);
  
      setComments((prevComments) => [newComment, ...prevComments]);
      setFormData(initialFormData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to submit comment', error);
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

    const errors = addCommentValidator({ content: replyFormData.content });
    if (errors.content) {
        setReplyFormError(errors);
        return;
    }
    try {
        setLoading(true);
        const response = await axios.post(`/comments/${postId}/reply/${commentId}`, replyFormData);
        const newReply = response.data.data;

        // Update the state with the new reply
        setComments(prevComments => {
            const addReply = (comments) => {
                return comments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, replies
                          : [newReply, ...comment.replies
                          ] }  // Prepending the new reply
                        : {
                            ...comment,
                            replies: addReply(comment.replies
                            )
                        }
                );
            };
            return addReply(prevComments);
        });
        setReplyFormData(initialFormData);
        setLoading(false)
    } catch (error) {
        setLoading(false)
        setReplyFormError({ content: error.message || 'An error occurred' });
        toast.error(error.message);
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
        const newReplyToReply = response.data.data  // Extracting the newly created reply
        console.log(newReplyToReply);
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
        setLoading(false)
    } catch (error) {
        setLoading(false)
        setReplyToReplyFormError({ content: error.message || 'An error occurred' });
        toast.error(error.message);
    }
  };

  const toggleReplyToReplyForm = (replyId) => {
    setReplyToReply(prevId => {
      const newId = prevId === replyId ? null : replyId;
      return newId;
    });
  };

  const toggleNestedReplies = (replyId) => {
    setVisibleNestedReplies(prevState => {
      const newState = {
        ...prevState,
        [replyId]: !prevState[replyId],
      };
      return newState;
    });
  };

  const handleDelete = async (commentId) => {
    try {
        // Perform delete request
        setLoading(true)
        const response = await axios.delete(`/comments/${commentId}`);
        const data = response.data;
        toast.success(data.message);

        const response2 = await axios.get(`/comments/${postId}/comments`);
        const data2 = response2.data.data; 
        setComments(data2); 
    } catch (error) {
        setLoading(false)
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

      <div className=' mx-auto md:px-[10rem]'>
          <div className=' py-8 max-w-5xl z-auto space-y-3 m-0'>
            <div className='flex justify-between items-center'>

              {!isLoaded ? (
                <Skeleton circle={true} width="2rem" height="2rem" />
              ) : (
                <BackButton />
              )}
              
              <div className='flex space-x-4 z-auto'>
                {currentUser && post && currentUser === post?.author?._id ? (
                  <>
                  {!isLoaded  ? (
                    <div className="flex space-x-2">
                      <Skeleton width={80} height={30}/> 
                      <Skeleton width={80} height={30}/> 
                    </div>
                  ) : (
                    // Actual Update and Delete buttons
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
                  )}
                </>
                ) : null}
              </div>
            </div>
            <div className='h2 font-bold w-full'>
              {!isLoaded ? (
                <Skeleton height="2rem" width="80%" />
              ) : (
                post?.title
              )}
            </div>
            <div className='flex items-center py-4 mt-0'>
              <div>
              {!isLoaded ? (
                <Skeleton circle={true} height="3rem" width="3rem" />
              ) : (
                <img className='w-[3rem] h-[3rem] rounded-full object-cover' src={authorProfilePic} alt="Image" />
              )}
              </div>
              <Link to={`/user-profile/${post?.author?._id}`}>
              <span className='m-0 px-4'>
                {!isLoaded ? (
                  <Skeleton height="1.5rem" width="8rem" />
                ) : (
                  `${post?.updatedBy?.firstName} ${post?.updatedBy?.lastName}`
                )}
              </span>
              </Link>
              

              {post?.author?._id !== currentUser && (
                <span
                  className={`hover:underline hover:cursor-pointer ${
                    followStatuses[post?.author?._id] ? 'text-red-500' : 'text-blue-500'
                  }`}
                  onClick={() => handleFollow(post?.author?._id)}
                >
                  {!isLoaded ? (
                  <Skeleton height="1.5rem" width="5rem" />
                ) : (
                  followStatuses[post?.author?._id] ? 'Unfollow' : 'Follow'
                )}
                </span>
              )}
            </div>
            <div>
          {/* Skeleton will be displayed while image is loading */}
          {!isLoaded && (
            <Skeleton
              height="50rem"
              width="100%"
              borderRadius="1rem"
            />
          )}
            <img
            className={`rounded-xl w-full h-[50rem] mb-24 object-cover ${isLoaded ? 'block' : 'hidden'}`}
            src={fileUrl}
            alt="Post Image"
            onLoad={() => setIsLoaded(true)} 
            />
            </div>
            <div>
              <p className='text-lg space-y-4'>
                {!isLoaded ? (
                  <Skeleton height="2rem" width='full' />
                  ) : (
                  <SanitizedContent htmlContent={post?.description} />
                  )}
              </p>
            </div>

            {/* Post comment */}

            <section className="bg-white pt-0 py-8 lg:py-16 lg:pt-5 antialiased">
              <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  {!isLoaded ? (
                    <Skeleton width="15rem" height="2rem" />
                  ) : (
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Discussion ({commentCount})</h2>
                  )}
                </div>

                {!isLoaded ? (
                  <Skeleton width="full" height="8rem" />
                ) : (
                  <CommentForm
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    formData={formData}
                    formError={formError}
                    placeholder="Write a comment..."
                    buttonText="Post comment"
                  />
                )}

                {/* Parent comments */}
                {!isLoaded ? (
                  <div>
                    {/* Skeletons for comments */}
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="mb-6">
                        <Skeleton width="full" height="2rem" />
                        <Skeleton width="80%" height="1.5rem" className="mt-2" />
                        <Skeleton width="60%" height="1rem" className="mt-1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  comments.map((comment) => (
                    <article key={comment._id} className="relative pt-4 px-0 text-base bg-white rounded-lg">
                      <CommentFooter
                        author={comment.author}
                        authorId={comment.author._id}
                        createdAt={comment.createdAt}
                        dropdownId={comment._id}
                        actionHandlers={actionHandlers}
                        currentUser ={currentUser._id}
                        imageUrl={comment.author._id === currentUser? profilePicUrl : comment.author.profilePic}
                      />
                      <p className="text-gray-500">{comment.content}</p>
                      <div className="flex items-center mt-4 space-x-4">
                        <button
                          type="button"
                          className="flex items-center text-sm text-gray-500 hover:underline font-medium"
                          onClick={() => {
                            handleClick(comment._id);
                          }}
                        >
                          <IoChatbubblesOutline className="iconSize" />
                          {getReplyText(comment.replies)}
                        </button>
                      </div>

                      {/* Reply Comment */}
                      {replyingTo === comment._id && (
                        <CommentForm
                          handleSubmit={(e) => handleReplySubmit(e, comment._id)}
                          handleChange={handleReplyChange}
                          formData={replyFormData}
                          formError={replyFormError}
                          placeholder="Write a reply..."
                          buttonText="Reply"
                          className="mt-4 ml-[4.5rem]"
                        />
                      )}
                      {visibleReplies[comment._id] &&
                        comment.replies &&
                        comment.replies.map((reply) => (
                          <article key={reply._id} className="p-6 pr-0 pb-0 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg">
                            {reply && reply.author && (
                              <>
                                <CommentFooter
                                  author={reply.author}
                                  createdAt={reply.createdAt}
                                  dropdownId={reply._id}
                                  actionHandlers={actionHandlers}
                                  imageUrl={reply.author._id === currentUser? profilePicUrl : comment.author.profilePic}
                                />
                                <p className="text-gray-500">{reply.content}</p>
                                <div className="flex items-center mt-4 space-x-4">
                                <button
                                  type="button"
                                  className="flex items-center text-sm text-gray-500 hover:underline font-medium"
                                  onClick={() => {toggleNestedReplies(comment._id); toggleReplyToReplyForm(reply._id)}}
                                  >
                                  <IoChatbubblesOutline className='iconSize' />
                                  {getReplyText(reply.replies)}
                              </button>
                                </div>
                              </>
                            )}

                            {/* Reply to Reply */}
                            {replyToReply === reply._id && (
                              <CommentForm
                                handleSubmit={(e) => handleReplyToReplySubmit(e, reply._id)}
                                handleChange={handleReplyToReplyChange}
                                formData={replyToReplyFormData}
                                formError={replyToReplyFormError}
                                placeholder="Write a reply..."
                                buttonText="Reply"
                                className="mt-4 ml-[4.5rem]"
                              />
                            )}
                            {/* Nested reply */}
                            {visibleNestedReplies[comment._id] &&
                              reply.replies &&
                              reply.replies.map((nestedReply) => (
                                <article key={nestedReply._id} className="ml-6 p-6 pr-0 pb-0 mb-3 lg:ml-12 text-base bg-white rounded-lg">
                                  <CommentFooter
                                    author={nestedReply.author}
                                    createdAt={nestedReply.createdAt}
                                    dropdownId={nestedReply._id}
                                    actionHandlers={actionHandlers}
                                    imageUrl={nestedReply.author._id === currentUser? profilePicUrl : comment.author.profilePic}
                                  />
                                  <p className="text-gray-500 pb-4">{nestedReply.content}</p>
                                </article>
                              ))}
                          </article>
                        ))}
                      <hr className="mt-6 border-t border-gray-200" />
                    </article>
                  ))
                )}
              </div>
            </section>

            <Modal className='z-auto' showModal={showModal} title="Are you sure you want to delete this post?" onConfirm={() => handlePostDelete(post._id)} onCancel={closeModal} />
          </div>
      </div>
  )
}

export default SinglePost