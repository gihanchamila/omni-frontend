import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js';
import { useSocket } from "../hooks/useSocket.jsx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { coverPhoto, profilePic } from "../assets/index.js";
import { FaLinkedin, FaFacebookSquare, FaInstagramSquare} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
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
      <div className="flex flex-col ">
        <div className="flex relative flex-col items-center">
          <img src={coverPhoto} className=" object-cover h-[27rem] w-full rounded-lg flex   justify-center" />
          <img src={profilePic} className="absolute  object-cover rounded-full h-[10rem] w-[10rem] left-1/2 transform -translate-x-1/2 bottom-[-4.5rem] border-4 border-white" />  
        </div>
      </div>
      <div className="relative flex flex-col justify-center items-center mt-[5rem] space-y-2">
        <div className="flex items-center justify-center space-y-2">
          <div>
          {currentUser ? (
              <div className="flex items-center justify-center space-y-2">
                <div>
                  <span className="text-4xl font-bold align-middle mb-0 relative">{currentUser.name}</span>
                </div>
              </div>
            ) : (
              <p>Loading user data...</p>
          )}
            {/*<GoVerified className="absolute lg:right-[31.5rem] lg:top-1 sm:right-[7.2rem] sm:top-[0.08rem] ml-2 mt-1 w-5 h-5 text-blue-500" /> */}
          </div>
        </div>
         {/*<div className="absolute lg:top-[2.5rem] sm:top-[2.2rem] flex space-x-3">
          <FaLinkedin className="social " />
          <FaFacebookSquare className="social " />
          <FaInstagramSquare className="social "/>
          <FaSquareXTwitter className="social "/>
         </div> */}
           
      </div>
      {/*<p className="lg:mt-9 sm:mt-10 text-md text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>*/}
      <div className="flex justify-center items-center space-y-2">
        <p>algihanchamila@gmail.com</p>
      </div>
      <div className="flex lg:space-x-2 mt-2 justify-between lg:px-[27.1rem]  sm:mx-[8.8rem]">
        <p className="profile-details">followers : {followers}</p>
        <p className="profile-details">following : {following}</p>
      </div>
      <hr className="mt-10 border-t border-gray-200" />
      <div className="h4 my-5 font-semibold">Your posts</div>
      <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-4'>
      {loading ? (
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