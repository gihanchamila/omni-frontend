import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTh, FaUsers, FaCogs } from 'react-icons/fa'; // Import icons
import Button from '../component/button/Button.jsx';
import axios from '../utils/axiosInstance.js';
import { toast } from 'sonner';
import { useProfile } from '../component/context/useProfilePic.jsx';

const Home = () => {

  const navigate = useNavigate()

  const [loadingProfile, setLoadingProfile] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const [profileKey, setProfileKey] = useState("")
  const { profilePicUrl } = useProfile();
  const [roleText, setRoleText] = useState("")

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

  const handleNavigateCategories = () => {
    navigate('/categories')
  }

  const handleNavigateUsers = () => {
    navigate('/users')
  }



  return (
    <div className="grid grid-cols-12 min-h-[60vh] gap-8 rounded-lg">
      {/* Left Column: Welcome User */}
      <div className="flex items-center justify-center col-start-1 col-end-8 bg-gray-50 rounded-lg p-12">
        <div className='flex flex-col items-center justify-center space-y-4'> 
          <img src={profilePicUrl} className='rounded-full h-[15rem] w-[15rem]' alt="" />
          
          <div className='flex flex-col items-center justify-center space-y-1'>
            <h1 className="text-3xl font-bold text-gray-700">{currentUser.firstName} {currentUser.lastName}</h1>
            <h1 className="text-xs font-light text-gray-700">{currentUser._id}</h1>
            <h1 className="bg-gray-700 text-xs font-light text-white py-1 px-3 rounded-full">{roleText}</h1>
          </div>
        </div>
      </div>

      {/* Right Column: Links Section */}
      <div className="col-start-8 col-end-13 gap-4 bg-gray-50 rounded-lg p-8">
        {/* First Row: Profile and Settings Links */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className='relative group'>
            <div className='absolute w-10 h-10 right-4 top-4 bg-black rounded-lg flex items-center justify-center'>
              <FaTh className="text-xl text-gray-800 group-hover:text-white" />
            </div>
            <div onClick={handleNavigateCategories} className="bg-white h-[15rem] rounded-lg p-4 flex items-center justify-center group-hover:bg-gray-800 transition duration-200">
              {/* <FaTh className="text-4xl text-gray-800 group-hover:text-white mb-4" /> */}
              <span className='text-gray-800 text-2xl font-bold left-4 bottom-8 group-hover:text-white'>Categories</span>
            </div>
          </div>
          <div className='relative group'>
            <div onClick={handleNavigateUsers} className="bg-white h-[15rem] rounded-lg p-4 flex items-center justify-center group-hover:bg-gray-800 transition duration-200">
              <div className='flex items-center space-x-4'>
                {/* <FaUsers className="text-xl text-gray-800 group-hover:text-white mb-4" /> */}
                <span className='text-gray-800 text-2xl font-bold  left-4 bottom-8 group-hover:text-white'>Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Admins Link */}
        <div className='grid  gap-4'>
          <div className='relative group'>
            <div className="bg-white h-[15rem] rounded-lg p-4 flex items-center justify-center group-hover:bg-gray-800 transition duration-200">
              {/* <FaCogs className="text-4xl text-gray-800 group-hover:text-white mb-4" /> */}
              <span className='text-gray-800 text-2xl font-bold left-4 bottom-8 group-hover:text-white'>Admin Panel</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Home;
