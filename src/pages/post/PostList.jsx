import React, { useState, useEffect, useMemo } from 'react';
import { useSocket } from '../../component/context/useSocket.jsx';
import axios from '../../utils/axiosInstance.js';
import { motion } from 'framer-motion';
import { toastError, toastSuccess } from '../../utils/toastMessages.js';

// Custom Components
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';
import Pagination from '../../component/pagination/Pagination.jsx';
import Post from '../../component/post/Post.jsx';
import PostSkeleton from '../../component/post/PostSkeleton.jsx';
import Skeleton from 'react-loading-skeleton';
import LatestPost from './LatestPost.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PopularPost from './PopularPost.jsx';


const PostList = () => {

  const navigate = useNavigate()
  const socket = useSocket()

  const [loading, setLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Posts Data
  const [posts, setPosts] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});

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
  
  const getPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/posts?page=${currentPage}&q=${searchValue}`);
      const data = response.data.data;
      setPosts(data.posts);
      setTotalPage(data.pages);
      
      // Fetch post files after setting posts
      fetchPostFiles(data.posts);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastError(error);
    }
  };

  const fetchPostFiles = async (newPosts) => {
    const filesToFetch = newPosts.filter(post => post.file && !postFiles[post._id]);
    if (filesToFetch.length === 0) return;
  
    try {
      const filePromises = filesToFetch.map(post => 
        axios.get(`/file/signed-url?key=${post.file.key}`)
          .then(response => ({
            id: post._id,
            url: response.data.data.url
          }))
          .catch(error => {
            console.error("Failed to fetch file URL", error);
            return null;
          })
      );
  
      const fileResults = await Promise.all(filePromises);
      const newFiles = {};
      fileResults.forEach(result => {
        if (result) newFiles[result.id] = result.url;
      });
  
      setPostFiles(prevFiles => ({ ...prevFiles, ...newFiles }));
    } catch (error) {
      toastError(error);
    }
  };
 
  useEffect(() => {
    if (!loading) {
      getPosts();
    }
  }, [currentPage]);

  useEffect(() => {
    const getCurrentUser = async () => {
    try {
      const response = await axios.get(`/auth/current-user`);
      const user = response.data.data.user; 
      
      if (user && user._id) {
          setCurrentUser(user); 
      } else {
          toast.error('Error getting user');
      }
    }catch(error){
      toastError(error);
    }
    };
    getCurrentUser();
  },[]);

  const visiblePosts = useMemo(() => {
    return posts.slice((currentPage - 1) * 5, currentPage * 5); // Assuming 10 posts per page
  }, [posts, currentPage]);

  const filesToFetch = useMemo(() => {
    return visiblePosts.filter(post => post.file && !postFiles[post._id]);
  }, [visiblePosts, postFiles]);

  useEffect(() => {
    if (!filesToFetch.length) return;
  
    const getPostFiles = async () => {
      try {
        setLoading(true);
        const filePromises = filesToFetch.map(post =>
          axios.get(`/file/signed-url?key=${post.file.key}`).then(response => ({
            id: post._id,
            url: response.data.data.url,
          }))
        );
  
        const fileResults = await Promise.allSettled(filePromises);
        console.log(fileResults)
        const newFiles = {};
  
        fileResults.forEach(result => {
          if (result.status === 'fulfilled') {
            newFiles[result.value.id] = result.value.url;
          }
        });
  
        setPostFiles(prevFiles => ({ ...prevFiles, ...newFiles }));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toastError(error);
      }
    };
  
    getPostFiles();
  }, [filesToFetch]);

  useEffect(() => {
    const getLikedPosts = async () => {
      try{
        const response = await axios.get('/likes/posts/liked');
        const likedPostsData = response.data.data.reduce((acc, post) => {
          acc[post?._id] = true;
          return acc;
        }, {});
        setLikedPosts(likedPostsData);
      } catch(error){
        toastError(error);
      }
    }
    getLikedPosts();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      if (!posts.length) return;
      const totalImages = posts.length;
  
      const imagePromises = posts.map(post => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = postFiles[post._id] || post.file; 
          img.onload = resolve;
          img.onerror = resolve; 
        });
      });
  
      await Promise.all(imagePromises); 
      setImagesLoaded(true);
    };
  
    loadImages();
  }, [posts, postFiles]);
  
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
        // toast.error('Error fetching follow statuses');
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
  
      // toast.success(response.data.message);
      setFollowStatuses(prev => ({
        ...prev,
        [authorId]: !isFollowing
      }));
  
      socket.emit('follow-status-changed', { authorId, isFollowing: !isFollowing });
  
    } catch (error) {
      const response = error.response;
      const data = response.data;
      // toast.error(data.message);
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
      // toast.error(data.message);
    }
  };
/*   const handleSearch = async (e) => {
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
      // toast.error(data.message);
    }
  }; */

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="mx-auto md:px-[10rem] py-10">
      <div className="flex flex-col lg:space-x-4 md:flex-row space-y-4 md:space-y-0 md:space-x-2">

        {/* Left Section: Post List */}
        <div className="w-full space-y-4">
        {posts.length > 0 && loading || !imagesLoaded ? (
          Array.from({ length: 2 }).map((_, index) => <PostSkeleton key={index} />)
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              postFile={postFiles[post._id]}
              liked={likedPosts[post._id]}
              currentUser={currentUser}
              handleLike={handleLike}
              followStatuses={handleFollow}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">No posts available</p>
        )}
      </div>

        {/* Right Section: Sidebar */}
        <div className="w-full md:w-1/3 space-y-4 overflow-hidden hidden md:block">
          <LatestPost/>
          <PopularPost />
          
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPage={totalPage} pageCount={pageCount} onPageChange={setCurrentPage}/>
    </motion.div>
  );


};

export default PostList;