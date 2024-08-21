import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance.js';
import Button from '../../component/button/Button.jsx'
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import moment from 'moment';
import { profile } from '../../assets/index.js';
import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';

const PostList = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postFiles, setPostFiles] = useState([])
  const [likedPosts, setLikedPosts] = useState({});
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/posts?page=${currentPage}&q=${searchValue}`);
        const data = response.data.data;

        setPosts(data.posts);
        setTotalPage(data.pages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message);
      }
    };
    getPosts();
  }, [currentPage, searchValue]);

  useEffect(() => {
    const getPostFiles = async () => {
      const files = {};
      await Promise.all(posts.map(async (post) => {
        if (post.file) {
          try {
            const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
            files[post._id] = response.data.data.url;
          } catch (error) {
            const response = error.response;
            const data = response.data;
            toast.error(data.message);
          }
        }
      }));
      setPostFiles(files);
    };

    if (posts.length > 0) {
      getPostFiles();
    }
  }, [posts]);

  useEffect(() => {
    const getLikedPosts = async () => {
      const response = await axios.get('/likes/posts/liked');
      const likedPostsData = response.data.data.reduce((acc, post) => {
        acc[post?._id] = true;
        return acc;
      }, {});
      setLikedPosts(likedPostsData);
    }
    getLikedPosts();
  }, []);

  useEffect(() => {
    const latestPosts = async () => {
      try {

        setLoading(true)

        const response = await axios.get('/posts/features/latest-posts')
        const data = response.data.data
        
        setLatestPosts(data)
          
      } catch (error) {
        setLoading(false)
        const response = error.response;
        const data = response.data;
        toast.error(data.message)          
      }
    }
    latestPosts()
  }, []);

  useEffect(() => {
    const popularPosts = async () => {
      try{
        setLoading(true)

        const response = await axios.get('/posts/features/popular-posts')
        const data = response.data.data

        setPopularPosts(data)

      }catch(error){
        const response = error.response
        const data = response.data.data
        toast.error(data.message)
      }
    }
    popularPosts()
  }, []);
  
  useEffect(() => {
    if (totalPage > 1) {
      let tempPageCount = [];
      for (let i = 1; i <= totalPage; i++) {
        tempPageCount = [...tempPageCount, i];
      }
      setPageCount(tempPageCount);
    } else {
      setPageCount([]);
    }
  }, [totalPage]);

  const handleLike = async (postId) => {
    try {
      const isLiked = likedPosts[postId];
      let response;
      
      if (isLiked) {
        response = await axios.delete(`/likes/posts/${postId}`);
      } else {
        response = await axios.post(`/likes/posts/${postId}`);
      }
  
      const data = response.data;
      toast.success(data.message);
  
      setLikedPosts(prevLikedPosts => ({
        ...prevLikedPosts,
        [postId]: !isLiked
      }));
  
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likesCount: Math.max(0, post.likesCount + (isLiked ? -1 : 1))
              }
            : post
        )
      );
  
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  };

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async (e) => {
    try {
      const input = e.target.value;
      setSearchValue(input);
      const response = await axios.get(`/category?q=${input}&page=${currentPage}`);
      const data = response.data.data;

      setPosts(data.categories);
      setTotalPage(data.pages);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: 'top-right',
        autoClose: true,
      });
    }
  };

  const formatDate = (date) => {
    const updatedDate = moment(date);
    const now = moment();
    const diffDays = now.diff(updatedDate, 'days');
    
    return diffDays > 2 ? updatedDate.format('ll') : updatedDate.fromNow();
  };

  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 md:px-[10rem] py-10">

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {/* Left Section: Post List */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Dynamic Posts */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:transition-colors duration-100">
                <div className="flex flex-col md:flex-row">
                  <div onClick={() => {navigate(`posts/${post._id}`)}} className="flex-shrink-0 w-full md:w-[10rem] h-[11rem] hover:cursor-pointer">
                    <img
                      className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg"
                      onClick={() => {navigate(`posts/${post._id}`)}}
                      src={postFiles[post._id] || post.file}
                      alt={post.title}
                    />
                  </div>
                  <div className="flex flex-col justify-between p-3 w-full">
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center text-xs text-gray-500'>
                        <img className='rounded-full w-5 h-5 object-cover' src={profile} alt="" />
                        <span className='px-2 text-xs'>Gihan Chamila</span>
                        <span className='text-blue-500 hover:underline hover:cursor-pointer'>follow</span>
                      </div>
                      <span className='text-right  text-xs text-gray-500'>{formatDate(post.updatedAt)}</span>
                    </div>
                   
                    <h5 onClick={() => {navigate(`/posts/${post._id}`)}} className="text-lg font-bold tracking-tight text-gray-900 hover:underline hover:cursor-pointer line-clamp-2">
                      {post.title}
                    </h5>
                    <p className="text-gray-700 mb-2 text-sm line-clamp-2" >
                     <SanitizedContent htmlContent={post.description} allowedTags={['h1', 'strong', 'font']}/>
                    </p>
                    <div className="flex space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-gray-700" onClick={() => handleLike(post._id)}>
                        {likedPosts[post._id] ? (
                          <IoIosHeart className="iconSize text-red-500" />
                        ) : (
                          <IoIosHeartEmpty className="iconSize" />
                        )}
                        <span className="text-xs">{post.likesCount}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <IoChatbubblesOutline className='iconSize' />
                        <span className='text-xs'>{post.commentCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Section: Sidebar */}
        
        
        <div className="w-full md:w-1/3 space-y-4 overflow-hidden hidden md:block">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
              Latest Posts
            </h5>

            <div className="space-y-4">
              {latestPosts.map(post => (
                <div key={post._id} className="flex items-center space-x-4">
                  <img
                    className="cardImage"
                    src={postFiles[post._id] || post.file}
                    alt="Latest Post"
                  />
                  <div className="flex-1">
                    <h6 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    <SanitizedContent
                      htmlContent={post.title}
                      allowedTags={['h1', 'strong', 'font']}
                      
                    />
                    </h6>
                    <p className="text-xs text-gray-600 line-clamp-1">
                    <SanitizedContent
                      htmlContent={post.description}
                      allowedTags={['h1', 'strong', 'font']}
                      
                    />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
              Popular Posts
            </h5>
            <div className="space-y-4">
              {/* Popular Post Card */}
              
              {latestPosts.map(post => (
                <div key={post._id} className="flex items-center space-x-4">
                  <img
                    className="cardImage"
                    src={postFiles[post._id] || post.file}
                    alt="Latest Post"
                  />
                  <div className="flex-1 w-full overflow-hidden">
                    <h6 className="text-sm font-semibold  text-gray-900 line-clamp-2"> 
                      {post.title} 
                    </h6>
                    <p className="text-xs text-gray-600 line-clamp-1">
                    <SanitizedContent
                      htmlContent={post.description}
                      allowedTags={['h1', 'strong']}
                      
                    />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {pageCount.length > 0 && (
        <nav className='flex items-center justify-center pb-10 mt-5' aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button className="pageButton rounded-l-lg rounded-r-none" onClick={handlePrev} disabled={currentPage === 1}>
                previous
              </button>
            </li>
            {pageCount.map((pageNumber, index) => (
              <li key={index}>
                <button className={`pageButton rounded-none ${currentPage === pageNumber ? 'bg-gray-100 active:bg-gray-200' : ''}`} onClick={() => handlePage(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            ))}
            <li>
              <button className="pageButton rounded-r-lg rounded-l-none" onClick={handleNext} disabled={currentPage === totalPage}>
                next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default PostList;