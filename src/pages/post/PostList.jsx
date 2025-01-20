import React, { useState, useEffect, useMemo } from 'react';
import { useSocket } from '../../component/context/useSocket.jsx';
import axios from '../../utils/axiosInstance.js';
import { toast } from 'sonner';


// Custom Components
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';
import Pagination from '../../component/pagination/Pagination.jsx';
import Post from '../../component/post/Post.jsx';
import PostSkeleton from '../../component/post/PostSkeleton.jsx';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';


const PostList = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  // Posts Data
  const [posts, setPosts] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  
  // Pagination
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  
  // Search and Filters
  const [searchValue, setSearchValue] = useState('');
  
  // Follow Status
  const [followStatuses, setFollowStatuses] = useState({});
  
  // User Info
  const [currentUser, setCurrentUser] = useState('');

  const authorIds = useMemo(() => posts
  .filter(post => post && post.author && post.author._id)
  .map(post => post.author._id), [posts]);
  
  const socket = useSocket()

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
    const getCurrentUser = async () => {
    try {
      const response = await axios.get(`/auth/current-user`);
      const user = response.data.data.user; 
      
      if (user && user._id) {
          setCurrentUser(user); 
      } else {
          toast.error('User data is incomplete');
      }
    }catch(error){
      toast.error('Error getting user');
    }
    };

    getCurrentUser();
  },[]);

  useEffect(() => {
    const getPostFiles = async () => {
      const files = {};
      await Promise.all(
        posts.map(async (post) => {
          if (post.file && !files[post._id]) {
            try {

              const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
              const data = response.data.data
              files[post._id] = data.url;
              //toast.success(response.data.message)
            } catch (error) {
              const response = error.response;
              const data = response?.data;
              toast.error(data?.message || "Failed to fetch file URL");
            }
          }
        })
      );
      setPostFiles(prevFiles => ({ ...prevFiles, ...files }));
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
        const data = response.data
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

  useEffect(() => {

    const handleFollowStatusUpdated = ({ followerId, followingId }) => {
      setFollowStatuses((prevStatuses) => ({
        ...prevStatuses,
        [followingId]: followerId === socket.id,
      }));
    };

    socket.on('follow-status-updated', handleFollowStatusUpdated);

    return () => {
      socket.off('follow-status-updated', handleFollowStatusUpdated);
    };
  }, [socket]);

  useEffect(() => {
    const fetchFollowStatuses = async () => {
      if (authorIds.length === 0) return; // Skip if there are no authors

      try {
        const responses = await Promise.all(
          authorIds.map(authorId => axios.get(`/user/follow-status/${authorId}`))
        );

        const statuses = {};
        responses.forEach((response, index) => {
          statuses[authorIds[index]] = response.data.data.isFollowing;
        });

        setFollowStatuses(statuses);
      } catch (error) {
        toast.error('Error fetching follow statuses');
      }
    };

    fetchFollowStatuses();
  }, [authorIds]);

  useEffect(() => {
    const checkFollowStatuses = async () => {
      const statuses = {};
      await Promise.all(posts.map(async (post) => {
        try {
          const response = await axios.get(`/user/follow-status/${post.author._id}`);
          statuses[post.author._id] = response.data.data.isFollowing;
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      }));
      setFollowStatuses(statuses);
    };
    checkFollowStatuses();
  }, [posts]);

  const handleFollow = async (authorId) => {
    try {
      
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
  
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  };

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
      toast.error(data.message);
    }
  };

  return (
    <div className="mx-auto  md:px-[10rem] py-10">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">

        {/* Left Section: Post List */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Dynamic Posts */}
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                postFile={postFiles[post._id]}
                liked={likedPosts[post._id]}
                handleLike={handleLike}
                followStatuses={followStatuses}
                currentUser={currentUser}
                handleFollow={handleFollow}
              />
            ))
          )}
        </div>

        {/* Right Section: Sidebar */}
        
        <div className="w-full md:w-1/3 space-y-4 overflow-hidden hidden md:block">
          <div className={`bg-white ${!loading && 'border border-gray-200'} rounded-lg p-4`}>
            {loading ? (
              <Skeleton width='8rem' height='1.5rem' className='mb-4 border-none'/>
              ) : (
              <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
              Latest Posts
              </h5>)}
            
              <div className="space-y-4">
              {loading ? (
                // Render skeletons when loading
                Array(2).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Render actual posts when data is available
                latestPosts.map((post) => (
                  <div key={post._id} className="flex items-center space-x-4">
                    <img
                      className="cardImage"
                      src={postFiles[post._id] || post.file}
                      alt="Latest Post"
                      onClick={() => navigate(`/posts/${post?._id}`)}
                    />
                    <div className="flex-1">
                      <h6 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline" onClick={() => navigate(`/posts/${post?._id}`)}>
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
                ))
              )}
            </div>
          </div>
        
          <div className={`bg-white ${!loading && 'border border-gray-200'} rounded-lg p-4`}>
          {loading ? (
              <Skeleton width='8rem' height='1.5rem' className='mb-4'/>
              ) : (
              <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
                Popular Posts
              </h5>)}
            <div className="space-y-4">
              {/* Popular Post Card */}
              {loading ? (
                Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4"
                    >
                      <div className="h-14 w-14 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))
              ) : (
                latestPosts.map((post) => (
                  <div key={post._id} className="flex items-center space-x-4">
                    <img
                      className="cardImage"
                      src={postFiles[post._id] || post.file}
                      alt="Latest Post"
                      onClick={() => navigate(`/posts/${post?._id}`)}
                    />
                    <div className="flex-1 w-full overflow-hidden">
                      <h6 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline" onClick={() => navigate(`/posts/${post?._id}`)}>
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPage={totalPage} pageCount={pageCount} onPageChange={setCurrentPage}/>
    </div>
  );
};

export default PostList;