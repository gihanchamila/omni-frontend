import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js';
import { useSocket } from "../hooks/useSocket.jsx";
import { useParams } from "react-router-dom";
import { useProfile } from "../component/context/useProfilePic.jsx";
import { toast } from "sonner";
import { coverPhoto} from "../assets/index.js";
import Post from "../component/post/Post.jsx";

const Profile = () => {
  const { id } = useParams();
  const { profilePicUrl } = useProfile();
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
        const response = await axios.get(`/auth/current-user`); 
        const user = response.data.data.user;
  
        if (user && user._id) {
          setCurrentUser(user);
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

  console.log(currentUser)

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
  }

  return (
    <div className="min-h-screen">
  <div className="relative bg-white rounded-b-lg">
    <img
      src={coverPhoto}
      alt="Cover"
      className="w-full h-60 object-cover rounded-lg"
    />
    <img
      src={profilePicUrl}
      alt="Profile"
      className="absolute left-[10rem] bottom-[11rem] transform translate-y-1/2 w-48 h-48 rounded-full border-4 border-white md:left-[35rem] md:bottom-[14rem] sm:left-[8.2rem] sm:bottom-[14rem]"
    />
    <div className="static text-center mb-8 ">
      <div className=" flex flex-col mt-24 ">
        <h1 className="text-3xl font-bold text-gray-800">{currentUser?.name}</h1>
        <p className="text-sm text-gray-500">{currentUser?.email}</p>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="followers">
            <span className="text-gray-600 font-semibold">{followers}</span>
            <p className="text-gray-400 text-xs">Followers</p>
          </div>
          <div className="following">
            <span className="text-gray-600 font-semibold">{following}</span>
            <p className="text-gray-400 text-xs">Following</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
  <hr className="border-t border-gray-300 my-4" />
  <div>
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">About me</h2>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

      <span className="py-2 px-4 bg-blue-200 text-blue-500 rounded-full text-xs">coding</span>
    </div>
  </div>
  <hr className="border-t border-gray-300 my-4" />
  <div className="mt-8  mb-[5rem]">
    <h2 className="text-xl font-bold text-gray-700 mb-4">Your Posts</h2>
    {loading ? (
      <p>Loading posts...</p>
    ) : userPosts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userPosts.map((post) => (
          <Post key={post._id} post={post} postFile={postFiles[post._id]} />
        ))}
      </div>
    ) : (
      <p>No posts available</p>
    )}
  </div>
</div>

  );
};

export default Profile;
