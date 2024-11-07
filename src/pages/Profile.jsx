import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js';
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../component/context/useProfilePic.jsx";
import { toast } from "sonner";
import Post from "../component/post/Post.jsx";
import Skeleton from "react-loading-skeleton";
import { CameraIcon } from '@heroicons/react/outline'

const Profile = () => {
  const { id } = useParams();
  const { profilePicUrl } = useProfile();
  const navigate = useNavigate();

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  // User and content data
  const [currentUser, setCurrentUser] = useState();
  const [userPosts, setUserPosts] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [likedPosts, setLikedPosts] = useState({});
  const [profileKey, setProfileKey] = useState(null);


  // Fetch current user profile
  useEffect(() => {
    const fetchData = async () => {
      setLoadingProfile(true);
      try {
        const response = await axios.get(`/auth/current-user`);
        const user = response.data.data.user;
        setCurrentUser(user);
        if (user.profilePic?.key) {
          setProfileKey(user.profilePic.key);
        }
      } catch {
        toast.error("Error getting user");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchData();
  }, []);

  // Fetch profile picture URL
  useEffect(() => {
    if (profileKey) {
      const fetchProfilePic = async () => {
        try {
          const response = await axios.get(`/file/signed-url?key=${profileKey}`);
          toast.success(response.data.message);
        } catch {
          toast.error("Failed to fetch profile picture");
        }
      };
      fetchProfilePic();
    }
  }, [profileKey]);

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await axios.get(`/user/user-posts/${id}`);
        setUserPosts(response.data.data);
      } catch {
        toast.error("Failed to fetch user posts");
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchUserPosts();
  }, [id]);


 // Fetch followers or following
    const fetchFollowersOrFollowing = async (endpoint, setState, setLoadingState) => {
    setLoadingState(true);
    try {
      const response = await axios.get(`/user/${endpoint}/${id}`);
      setState(response.data.data[`${endpoint}Count`]);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchFollowersOrFollowing("followers", setFollowers, setLoadingFollowers);
    fetchFollowersOrFollowing("following", setFollowing, setLoadingFollowing);
  }, [id]);

  // Fetch post files
  useEffect(() => {
    const fetchPostFiles = async () => {
      const files = {};
      await Promise.all(
        userPosts.map(async (post) => {
          if (post.file && !files[post._id]) {
            try {
              const response = await axios.get(`/file/signed-url?key=${post.file.key}`);
              files[post._id] = response.data.data.url;
            } catch {
              toast.error("Failed to fetch file URL");
            }
          }
        })
      );
      setPostFiles(files);
    };
    if (userPosts.length > 0) {
      fetchPostFiles();
    }
  }, [userPosts]);

  // Fetch liked posts
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get("/likes/posts/liked");
        const likedPostsData = response.data.data.reduce((acc, post) => {
          acc[post?._id] = true;
          return acc;
        }, {});
        setLikedPosts(likedPostsData);
      } catch {
        toast.error("Failed to fetch liked posts");
      }
    };
    fetchLikedPosts();
  }, []);

  // Handle like/unlike action
  const handleLike = async (postId) => {
    try {
      const isLiked = likedPosts[postId];
      const response = isLiked
        ? await axios.delete(`/likes/posts/${postId}`)
        : await axios.post(`/likes/posts/${postId}`);

      setLikedPosts((prevLikedPosts) => ({
        ...prevLikedPosts,
        [postId]: !isLiked,
      }));

      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likesCount: Math.max(0, post.likesCount + (isLiked ? -1 : 1)) }
            : post
        )
      );
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleChangeProfile =() => {
    navigate('/setting')
  }

  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="relative">
        <div className="bg-gradient-to-b from-blue-500 to-indigo-700 h-48 w-full rounded-lg flex items-center justify-center relative">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            {loadingProfile ? (
              <Skeleton circle={true} height={128} width={128} />
            ) : (
              <div className="relative group w-52 h-52">
                {/* Profile Image */}
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full border-4 border-white object-cover"
                />

                {/* Camera Icon on Hover */}
                <div onClick={() =>handleChangeProfile()} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CameraIcon  className="h-10 w-10 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="flex flex-col items-center space-y-2 mt-16">
            {loadingProfile ? (
              <Skeleton width={150} height={24} />
            ) : (
              <h1 className="text-4xl font-bold text-gray-800">{currentUser?.firstName} {currentUser?.lastName}</h1>
            )}
            {loadingProfile ? (
              <Skeleton width={200} height={18} />
            ) : (
              <p className="text-sm text-gray-500">{currentUser?.email}</p>
            )}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="followers">
                {loadingFollowers ? (
                  <Skeleton width={70} height={20} />
                ) : (
                  <>
                    <span className="text-gray-600 font-semibold">{followers}</span>
                    <p className="text-gray-400 text-xs">Followers</p>
                  </>
                )}
              </div>
              <div className="following">
                {loadingFollowing ? (
                  <Skeleton width={70} height={20} />
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

      <div className="space-y-4 p-8">
        <div>
          {loadingProfile ? (
            <Skeleton width="100%" height={20} className="mb-4" />
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">About me</h2>
              <p>{currentUser?.about}</p>
            </div>
          )}
        </div>
        <div className="">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {loadingProfile ? (
              <>
                <Skeleton width={70} height={20} className="rounded-full" />
                <Skeleton width={60} height={20} className="rounded-full" />
                <Skeleton width={100} height={20} className="rounded-full" />
              </>
            ) : currentUser?.interests?.length ? (
              currentUser.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No interests listed.</p>
            )}
          </div>
        </div>
        <div className="mt-8 mb-[5rem]">
          {loadingPosts ? (
            <Skeleton width="100%" height={20} className="mb-4" />
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Posts</h2>
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userPosts.map((post) => (
                    <Post key={post._id} post={post} currentUser={currentUser} postFile={postFiles[post._id]} onLike={handleLike} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No posts available</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
