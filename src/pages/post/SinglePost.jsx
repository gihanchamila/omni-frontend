import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../../utils/axiosInstance.js';
import { profile } from '../../assets/index.js';
import Button from '../../component/button/Button.jsx';
import Comment from '../../component/comment/Comment.jsx';
import addCommentValidator from '../../validators/addCommentValidator.js';

const initialFormData = { content: "" };
const initialFormError = { content: "" };

const SinglePost = () => {
  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;

  const [post, setPost] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      const getPost = async () => {
        try {
          const response = await axios.get(`posts/${postId}`);
          const data = response.data.data;
          toast.success(data.message);
          setPost(data.post);
        } catch (error) {
          const response = error.response;
          const data = response.data.data;
          toast.error(data.message);
        }
      };
      getPost();
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
          const data = response.data.data;
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = addCommentValidator({ content: formData.content });
    if (errors.content) {
      setFormError(errors);
      return; // Exit early if there are validation errors
    }

    try {
      setLoading(true);
      const response = await axios.post(`/comments/${postId}`, formData);
      const newComment = response.data.data;
      setComments((prevComments) => [newComment, ...prevComments]);
      toast.success(response.data.message);
      setFormData(initialFormData);
    } catch (error) {
      setFormError({ content: error.message || 'An error occurred' });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
          <p className='text-lg space-y-4'>{post?.description}</p>
        </div>
        <section className="bg-white py-8 lg:py-16 antialiased">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Discussion ({comments.length})</h2>
            </div>
            <form className="mb-6" onSubmit={handleSubmit}>
              <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea
                  id="comment"
                  rows="6"
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Write a comment..."
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
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
              <Comment
                key={comment._id}
                comment={comment}
                toggleReplies={toggleReplies}
                visibleReplies={visibleReplies}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SinglePost;