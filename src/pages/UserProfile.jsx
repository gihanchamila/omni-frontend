import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js';
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [profileKey, setProfileKey] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/user-profile/${id}`);
        const data = response.data;
        setUser(data.user);
        setProfileKey(data.user.profilePic.key);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, [id]);

  useEffect(() => {
    const getProfilePic = async () => {
      if (profileKey) {
        try {
          const response = await axios.get(`/file/signed-url?key=${profileKey}`);
          setProfilePic(response.data.data.url);
          // toast.success(response.data.message);
        } catch (error) {
          // toast.error(error.response?.data?.message || "Error loading profile picture");
        }
      }
    };
    getProfilePic();
  }, [profileKey]);

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const response = await axios.get(`/user/followers/${id}`);
        setFollowers(response.data.data.followersCount);
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error loading followers");
      }
    };
    getFollowers();
  }, [id]);

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const response = await axios.get(`/user/following/${id}`);
        setFollowing(response.data.data.followingCount);
      } catch (error) {
        // toast.error(error.response?.data?.message || "Error loading following count");
      }
    };
    getFollowing();
  }, [id]);

  return (
    <div className=" bg-slate-50 rounded-xl p-4 pb-28">
      <div className="relative">
        <div className="bg-gradient-to-b from-blue-500 to-indigo-700 h-48 w-full rounded-lg"></div>
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          {loading ? (
            <Skeleton circle={true} height={128} width={128} />
          ) : (
            <img
              src={profilePic}
              alt="Profile"
              className="w-52 h-52 rounded-full border-4 border-white"
            />
          )}
        </div>
      </div>

      <div className="text-center mt-20">
        {loading ? (
          <Skeleton width={150} height={24} />
        ) : (
          <h1 className="text-4xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</h1>
        )}
        {loading ? (
          <Skeleton width={200} height={18} />
        ) : (
          <p className="text-sm text-gray-500">{user?.email}</p>
        )}
      </div>

      {/* <div className="flex justify-center space-x-8 mt-4">
        <div className="text-center">
          {loading ? (
            <Skeleton width={60} height={18} />
          ) : (
            <span className="text-lg font-semibold text-gray-800">{followers}</span>
          )}
          <p className="text-gray-500 text-xs">Followers</p>
        </div>
        <div className="text-center">
          {loading ? (
            <Skeleton width={60} height={18} />
          ) : (
            <span className="text-lg font-semibold text-gray-800">{following}</span>
          )}
          <p className="text-gray-500 text-xs">Following</p>
        </div>
      </div> */}

      <div className="mt-6 mx-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">About </h2>
        {loading ? (
          <Skeleton count={3} />
        ) : (
          <p className="text-gray-600">{user?.about || "No information provided."}</p>
        )}
      </div>

      <div className="mt-4 mx-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <>
              <Skeleton width={70} height={20} className="rounded-full" />
              <Skeleton width={60} height={20} className="rounded-full" />
              <Skeleton width={100} height={20} className="rounded-full" />
            </>
          ) : user?.interests?.length ? (
            user.interests.map((interest, index) => (
              <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                {interest}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No interests listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
