import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { profile } from "../assets/index.js";
import axios from '../utils/axiosInstance.js'
import { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { toast } from "sonner";
import { useSocket } from "../hooks/useSocket.jsx";

const PrivateNavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [profileKey, setProfileKey] = useState(null)
  const socket = useSocket()
  const location = useLocation();
  const navigate = useNavigate()

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogOut = () => {
    window.localStorage.removeItem('blogData');
    toast.success("Logout successfull")
    navigate('/login')
  }

  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

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
    }catch(error){
      toast.error('Error getting user');
      console.log(error)
    }
    };
    getCurrentUser();
},[]);

useEffect(() => {
  const getprofilePic = async () => {
     try{
       const response = await axios.get(`/file/signed-url?key=${profileKey}`)
       const data = response.data.data
       setProfilePic(data.url)
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
  socket.on('profilePicUpdated', ({ userId, profilePic }) => {
      if (userId === currentUser?._id) {
          setProfilePic(profilePic); 
      }
  });

  return () => {
      socket.off('profilePicUpdated');
  };
}, [socket, currentUser]); 


  return (
    <div className="">
      <nav className="relative flex items-center justify-between w-full py-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <span>Omni</span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-4 px-5 rounded-full">
          <NavLink className="navlink" to="/">Home</NavLink>
          <NavLink className="navlink" to="/categories">Categories</NavLink>
          <NavLink className="navlink" to="/posts">Posts</NavLink>
          <NavLink className="navlink" to="/posts/new-post">Write</NavLink>
          <NavLink className="navlink " to=""><IoMdNotificationsOutline className="w-5 h-5" /></NavLink>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center">
              <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white p-5 border-2 border-color-s rounded-lg z-50">
                <NavLink className="dropdown" to={`${currentUser._id}`}>Profile</NavLink>
                <NavLink className="dropdown" to={`/settings`}>Settings</NavLink>
                <div className="my-2 border-t border-color-s opacity-20 "></div>
                <NavLink className="dropdown" to="/login" onClick={handleLogOut}>Logout</NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
};

export default PrivateNavBar;