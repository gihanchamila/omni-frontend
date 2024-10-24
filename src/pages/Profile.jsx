import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js';
import { useSocket } from "../hooks/useSocket.jsx";
import { useParams } from "react-router-dom";
import { useProfile } from "../component/context/useProfilePic.jsx";
import { toast } from "sonner";
import { coverPhoto} from "../assets/index.js";
import Post from "../component/post/Post.jsx";
import Skeleton from "react-loading-skeleton";
import PostSkeleton from "../component/post/PostSkeleton.jsx";

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

  useEffect(() => {
    const getprofilePic = async () => {
       try{
         const response = await axios.get(`/file/signed-url?key=${profileKey}`)
         const data = response.data.data
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

  console.log(userPosts)

  getUserPosts();
  }, [id]);

  useEffect(() => {
  const getFollowers = async () => {
    try{
      setLoading(true)
      const response = await axios.get(`/user/followers/${id}`)
      const followersCount = response.data.data.followersCount;
      setFollowers(followersCount);
      setLoading(false)
    }catch(error){
      setLoading(false)
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
      setLoading(true)
      const response = await axios.get(`/user/following/${id}`)
      const followingCount = response.data.data.followingCount;
      setFollowing(followingCount);
      setLoading(false)
    }catch(error){
      setLoading(false)
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
            setLoading(false)
            const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
            const data = response.data.data
            files[post._id] = data.url;
            toast.success(response.data.message)
            setLoading(false)
          } catch (error) {
            setLoading(false)
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
    setLoading(false)
  }
  }, [userPosts]);

  useEffect(() => {
  const getLikedPosts = async () => {
    setLoading(true)
    const response = await axios.get('/likes/posts/liked');
    const likedPostsData = response.data.data.reduce((acc, post) => {
      acc[post?._id] = true;
      return acc;
      
    }, {});
    setLikedPosts(likedPostsData);
    setLoading(false)
  }
  getLikedPosts();
  }, []);

  const handleLike = async (postId) => {
  try {
    const isLiked = likedPosts[postId];
    let response;
    setLoading(true)
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
    setLoading(false)

  } catch (error) {
    setLoading(false)
    const response = error.response;
    const data = response.data;
    toast.error(data.message);
  }
  }

  return (
    <div className="">
      <div className="relative bg-white rounded-b-lg mt-10">
       {/*  <img
          src={coverPhoto}
          alt="Cover"
          className="w-full h-[21rem] object-cover rounded-lg"
        /> */}

        {loading ? (
          <Skeleton className="absolute top-4 md:left-[35rem] md:bottom-[14rem] sm:left-[8.2rem] sm:bottom-[14rem]" circle={true} height={192} width={192} />
        ) : (
          <img
            src={profilePicUrl}
            alt="Profile"
            className="absolute top-4 w-48 h-48 rounded-full border-4 border-white md:left-[35rem] md:bottom-[14rem] sm:left-[8.2rem] sm:bottom-[14rem]"
          />
        )}
        
        <div className="text-center">
          <div className=" flex flex-col items-center space-y-2">
          {loading ? (
            <div className="mt-5">
              <Skeleton width={150} height={28} className="mb-2" />
              <Skeleton width={200} height={20} /> 
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mt-56">{currentUser?.firstName} {currentUser?.lastName}</h1>
              <p className="text-sm text-gray-500 mt-0">{currentUser?.email}</p>
            </div>
          )}
                      
            
            <div className="">
          
            <div className="">
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {/* Display multiple skeletons to represent the interests */}
                <Skeleton width={80} height={20} className="rounded-full" />
                <Skeleton width={60} height={20} className="rounded-full" />
                <Skeleton width={100} height={20} className="rounded-full" />
                <Skeleton width={70} height={20} className="rounded-full" />
                <Skeleton width={90} height={20} className="rounded-full" />
              </div>
            ) : (
              currentUser?.interests?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest, index) => (
                    <span key={index} className="spanLabel">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  <span className="spanLabel">Coding</span>
                  <span className="spanLabel">Dance</span>
                  <span className="spanLabel">Writing</span>
                  <span className="spanLabel">Walking</span>
                  <span className="spanLabel">Reading</span>
                </div>
              )
            )}
            </div>

            </div>
            <div className="flex justify-center space-x-6">
              <div className="followers">
                {loading ? (
                  <>
                    <Skeleton circle={true} width={25} height={25} />
                    <Skeleton width={70} height={10} className="mt-1" /> {/* Skeleton for "Followers" text */}
                  </>
                ) : (
                  <>
                    <span className="text-gray-600 font-semibold">{followers}</span>
                    <p className="text-gray-400 text-xs">Followers</p>
                  </>
                )}
              </div>
              <div className="following">
                {loading ? (
                  <>
                    <Skeleton circle={true} width={25} height={25} />
                    <Skeleton width={70} height={10} className="mt-1" /> {/* Skeleton for "Following" text */}
                  </>
                ) : (
                  <>
                    <span className="text-gray-600 font-semibold">{following}</span>
                    <p className="text-gray-400 text-xs">Following</p>
                  </>
                )}
              </div>
            </div>
          </div>  
        </div>
      </div>
      <hr className="border-t border-gray-300 my-4" />
      <div>   
        <div>
          {loading ? (
            <>
              <Skeleton width="30%" height={28} className="mb-4" /> {/* Skeleton for the "About me" title */}
              <div>
                <Skeleton width="100%" height={20} className="mb-1" />
                <Skeleton width="100%" height={20} className="mb-1" />
                <Skeleton width="100%" height={20} className="mb-1" />
                <Skeleton width="100%" height={20} className="mb-1" />
                <Skeleton width="100%" height={20} />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-700 mb-4">About me</h2>
              <p>
{/*                 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 */}                {currentUser?.about}
             </p>
            </>
          )}
        </div>
      </div>
      <hr className="border-t border-gray-300 my-4" />
      <div className="mt-8 mb-[5rem]">
        {loading ? (
          <>
            <Skeleton width="30%" height={28} className="mb-4" /> {/* Skeleton for the "Your Posts" title */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Display skeletons to simulate loading posts */}
              {Array(2)
                .fill()
                .map((_, index) => (
                  <PostSkeleton key={index} />
                ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-700 mb-4">Your Posts</h2>
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userPosts.map((post) => (
                  <Post key={post._id} post={post} currentUser={currentUser} postFile={postFiles[post._id]} />
                ))}
              </div>
            ) : (
              <p>No posts available</p>
            )}
          </>
        )}
      </div>
   </div>
  );
};

export default Profile;
