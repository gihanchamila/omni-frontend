import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { profile } from "../assets/index.js";
import axios from '../utils/axiosInstance.js'
import { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { toast } from "sonner";

const PrivateNavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation();
  const navigate = useNavigate()

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  //logout

  const handleLogOut = () => {
    window.localStorage.removeItem('blogData');
    toast.success("Logout successfull")
    navigate('/login')
  }

  // Close dropdown when the route changes
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


  return (
    <div className="">
      <nav className="relative flex items-center justify-between w-full py-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <span>Omni</span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <NavLink className="navlink" to="/">Home</NavLink>
          <NavLink className="navlink" to="/categories">Categories</NavLink>
          <NavLink className="navlink" to="/posts">Posts</NavLink>
          <NavLink className="navlink" to="/posts/new-post">Write</NavLink>
          <NavLink className="navlink " to=""><IoMdNotificationsOutline className="w-5 h-5" /></NavLink>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center">
              <img src={profile} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
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