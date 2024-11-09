import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTh, FaUsers } from 'react-icons/fa';
import { MdAdminPanelSettings } from "react-icons/md";
import axios from '../utils/axiosInstance.js';
import { toast } from 'sonner';
import { useProfile } from '../component/context/useProfilePic.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [profileKey, setProfileKey] = useState("");
  const { profilePicUrl } = useProfile();
  const [roleText, setRoleText] = useState("");

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
        if (currentUser.role === 1) {
          setRoleText("Super admin");
        } else if (currentUser.role === 2) {
          setRoleText("Admin");
        }
      } catch {
        toast.error("Error getting user");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchData();
  }, [currentUser.role]);

  const handleNavigateCategories = () => navigate('/categories');
  const handleNavigateUsers = () => navigate('/users');
  const handleNavigateAdmins = () => navigate('/admin-list');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[60vh] gap-4 md:gap-8 rounded-lg">
      {/* Left Column: Welcome User */}
      <div className="col-span-1 md:col-start-1 md:col-end-8 bg-gray-50 rounded-lg p-6 md:p-12 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2 text-center">
          <img src={profilePicUrl} className="rounded-full h-[10rem] w-[10rem] md:h-[15rem] md:w-[15rem]" alt="" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">{currentUser.firstName} {currentUser.lastName}</h1>
          {/* <p className="text-xs font-light text-gray-700">{currentUser._id}</p> */}
          <span className="bg-gray-700 text-xs font-light text-white py-1 px-3 rounded-full">{roleText}</span>
        </div>
      </div>

      {/* Right Column: Links Section */}
      <div className="col-span-1 md:col-start-8 md:col-end-13 gap-4 bg-gray-50 rounded-lg p-4 md:p-8">
        {/* First Row: Profile and Settings Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-8">
          <div className="relative group">
            {/* Half Circle */}
            <div className="absolute bottom-0 w-full h-auto bg-gray-800 group-hover:bg-white rounded-t-full"></div>
            <div className="absolute w-10 h-10 right-4 top-4 bg-gray-800 group-hover:bg-white rounded-lg flex items-center justify-center">
              <FaTh className="text-xl text-white group-hover:text-gray-800" />
            </div>
            <div onClick={handleNavigateCategories} className="bg-white h-[10rem] md:h-[15rem] rounded-lg p-4 flex items-center justify-center group-hover:bg-gray-800 transition duration-200">
              <span className="text-gray-800 text-xl md:text-2xl font-bold group-hover:text-white">Categories</span>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute w-10 h-10 right-4 top-4 bg-gray-800 group-hover:bg-white rounded-lg flex items-center justify-center">
              <FaUsers className="text-xl text-white group-hover:text-gray-800" />
            </div>
            <div onClick={handleNavigateUsers} className="bg-white h-[10rem] md:h-[15rem] rounded-lg p-4 flex items-center justify-center group-hover:bg-gray-800 transition duration-200">
              <span className="text-gray-800 text-xl md:text-2xl font-bold group-hover:text-white">Users</span>
            </div>
          </div>
        </div>

        {/* Second Row: Admins Link */}
        <div className="grid lg:grid-cols-1 w-full md:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute w-10 h-10 right-4 top-4 bg-white group-hover:bg-gray-800 rounded-lg flex items-center justify-center">
              <MdAdminPanelSettings className="text-xl text-gray-800 group-hover:text-white" />
            </div>
            <div onClick={handleNavigateAdmins} className="bg-gray-800 h-[10rem] md:h-[15rem] rounded-lg p-4 flex items-center justify-center group-hover:bg-white transition duration-200">
              <span className="text-white text-xl md:text-2xl font-bold group-hover:text-gray-800">Admin Panel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
