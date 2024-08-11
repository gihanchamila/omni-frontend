import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance.js';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { post } from '../../assets/index.js';
import { toast } from 'sonner';

const PostList = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postFiles, setPostFiles] = useState([])
  const [likedPosts, setLikedPosts] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [latestPosts, setLatestPosts] = useState([])
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
        acc[post._id] = true;
        return acc;
      }, {});
      setLikedPosts(likedPostsData);
    };
    getLikedPosts();
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
  
      // Optionally update the post's likes count in the UI
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likesCount: post.likesCount + (isLiked ? -1 : 1) }
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
              <div key={post._id} className="bg-white border border-gray-200 rounded-lg hover:bg-gray-100">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-shrink-0 w-full md:w-[10rem] h-[10rem]">
                    <img
                      className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg"
                      src={postFiles[post._id] || post.file}
                      alt={post.title}
                    />
                  </div>
                  <div className="flex flex-col justify-between p-3 w-full">
                    <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-2">
                      {post.title}
                    </h5>
                    <p className="text-gray-700 mb-4 text-sm">
                      {post.description}
                    </p>
                    <div className="flex space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-gray-700" onClick={() => handleLike(post._id)}>
                        {likedPosts[post._id] ? (
                          <IoIosHeart className="w-35 h-3.5" />
                        ) : (
                          <IoIosHeartEmpty className="w-35 h-3.5" />
                        )}
                        <span className="text-xs pl-0.5">{post.likesCount}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <IoChatbubblesOutline className='w-35 h-3.5' />
                        <span className='text-xs pl-0.5'>10</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Section: Sidebar */}
        <div className="w-full md:w-1/3 space-y-6 hidden md:block">
          {/* Latest Posts */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
              Latest Posts
            </h5>
            <div className="space-y-4">
              {/* Latest Post Card */}
              <div className="flex items-center space-x-4">
                <img
                  className="w-14 h-14 object-cover rounded-lg"
                  src={post}
                  alt="Latest Post"
                />
                <div>
                  <h6 className="text-sm font-semibold text-gray-900">
                    Latest Post Title
                  </h6>
                  <p className="text-xs text-gray-600">Short description here...</p>
                </div>
              </div>
              {/* Add more latest posts here if needed */}
            </div>
          </div>

          {/* Popular Posts */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
              Popular Posts
            </h5>
            <div className="space-y-4">
              {/* Popular Post Card */}
              <div className="flex items-center space-x-4">
                <img
                  className="w-10 h-10 object-cover rounded-lg"
                  src={post}
                  alt="Popular Post"
                />
                <div>
                  <h6 className="text-sm font-semibold text-gray-900">
                    Popular Post Title
                  </h6>
                  <p className="text-xs text-gray-600">Short description here...</p>
                </div>
              </div>
              {/* Add more popular posts here if needed */}
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