import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js';
import { useSocket } from "../hooks/useSocket.jsx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { coverPhoto} from "../assets/index.js";
import Post from "../component/post/Post.jsx";

const Profile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [postFiles, setPostFiles] = useState([]);

  const [currentUser, setCurrentUser] = useState();
  const [userPosts, setUserPosts] = useState([]);

  const [followers, setFollowers] = useState()
  const [following, setFollowing] = useState()

  const [likedPosts, setLikedPosts] = useState({});

  const [profileKey, setProfileKey] = useState(null)
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150"); // Placeholder image

  const socket = useSocket()

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`/auth/current-user`); // Removed formData from GET request
        const user = response.data.data.user;
  
        if (user && user._id) {
          setCurrentUser(user);
  
          // Check if profilePic and key exist before setting
          if (user.profilePic && user.profilePic.key) {
            setProfileKey(user.profilePic.key);
          }
        } else {
          toast.error('User data is incomplete');
        }
      } catch (error) {
        toast.error('Error getting user');
      }
    };
  
    getCurrentUser();
  }, []);

  useEffect(() => {
    const getprofilePic = async () => {
       try{
         const response = await axios.get(`/file/signed-url?key=${profileKey}`)
         const data = response.data.data
         setProfilePic(data.url)
         console.log(data)
         toast.success(response.data.message)
       }catch(error){
         const response = error.response;
         const data = response.data
         toast.error(data.message)
       }
    }
    if (profileKey) {
     getprofilePic();
   }
   },[profileKey])

  useEffect(() => {
  const getUserPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/user/user-posts/${id}`);
      const data =  response.data.data
      setUserPosts(data);
      toast.success("User posts fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch user posts");
    } finally {
      setLoading(false);
    }
  };

  getUserPosts();
  }, [id]);

  useEffect(() => {
  const getFollowers = async () => {
    try{
      const response = await axios.get(`/user/followers/${id}`)
      const followersCount = response.data.data.followersCount;
      setFollowers(followersCount);
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  }
  getFollowers()
  }, [id])

  useEffect(() => {
  const getFollowing = async () => {
    try{
      const response = await axios.get(`/user/following/${id}`)
      const followingCount = response.data.data.followingCount;
      setFollowing(followingCount);
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  }
  getFollowing()
  }, [id])

  useEffect(() => {
  const getPostFiles = async () => {
    const files = {};
    await Promise.all(
      userPosts.map(async (post) => {
        if (post.file && !files[post._id]) {
          try {
            const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
            const data = response.data.data
            files[post._id] = data.url;
            toast.success(response.data.message)
          } catch (error) {
            const response = error.response;
            const data = response.data;
            toast.error(data.message || "Failed to fetch file URL");
          }
        }
      })
    );
    setPostFiles(prevFiles => ({ ...prevFiles, ...files })); 
  };

  if (userPosts.length > 0) {
    getPostFiles();
  }
  }, [userPosts]);

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
    //toast.success(data.message);

    setLikedPosts(prevLikedPosts => ({
      ...prevLikedPosts,
      [postId]: !isLiked
    }));

    setUserPosts(prevPosts =>
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

  return (
    <div className="flex flex-col pb-[50rem]">
      <div className="flex flex-col pb-36">
        <div className="flex relative flex-col items-center p">
          <img src={coverPhoto} className=" object-cover h-[15rem] w-full rounded-lg flex   justify-center" />
          <img src={profilePic} className="absolute  object-cover rounded-full h-[10rem] w-[10rem] transform left-5 -bottom-[7rem] border-4 border-white" />  
        </div>
      </div>
      <div className="absolute left-[16rem] top-[22rem] w-[calc(100%-18.5rem)]">
        <div className="static flex justify-between items-center">
          {currentUser ? (
            <>
              <div className="flex flex-col">
                <span className="text-4xl font-bold mb-0">{currentUser.name}</span>
                <p className="text-base">algihanchamila@gmail.com</p>
              </div>
              <div className="flex left-0 space-x-4 items-center">
                <p className="profile-details">Followers: {followers}</p>
                <p className="profile-details">Following: {following}</p>
              </div>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>


      <hr className="mt-10 border-t border-gray-200" />
      <div className="h4 my-5 font-semibold">Your posts</div>
      <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-4'>
      {loading && userPosts ? (
        <p>Loading...</p>
      ) : (
        userPosts.length > 0 ? (
          userPosts.map(post => (
            <Post
              key={post._id}
              post={post}
              postFile={postFiles[post._id]}
              currentUser={currentUser}
              liked={likedPosts[post._id]}
              handleLike={handleLike}
            />
          ))
        ) : (
          <p>No posts found for this user.</p>
        )
      )}
      </div>
    </div>
    
  );
}

export default Profile;