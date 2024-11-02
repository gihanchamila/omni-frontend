import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from '../utils/axiosInstance.js';
import { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { toast } from "sonner";
import { useProfile } from "./context/useProfilePic.jsx";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { HiOutlinePencilAlt, HiOutlineHome, HiOutlineTag, HiOutlineLogout, HiOutlineLogin, HiOutlineUserCircle, HiOutlineCog } from "react-icons/hi";
import { MdPostAdd } from "react-icons/md";
import { TbCategory2 } from "react-icons/tb";
import ScrollLock from "react-scrolllock";
import {useAuth} from '../component/context/useAuth.jsx'

const PrivateNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth()

  const { profilePicUrl, setProfilePicUrl } = useProfile();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileKey, setProfileKey] = useState(null);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    document.body.classList.remove('backdrop-blur'); // Remove blur on location change
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
      } catch (error) {
        toast.error('Error getting user');
        console.log(error);
      }
    };
    getCurrentUser();
  }, []);

/*useEffect(() => {
    const getProfilePic = async () => {
      if(profileKey){
        try{
          const response = await axios.get(`/file/signed-url?key=${profileKey}`)
          const data = response.data.data.url
          setProfileUrl(data)
        }catch(error){
          console.log("Failed to get profile picture");
        }
      }
    }
    getProfilePic()
  }) */

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogOut = () => {
    window.localStorage.removeItem('blogData');
    setCurrentUser(null)
    setProfilePicUrl(null)
    toast.success("Logout successful");
    navigate('/login');
  };

  return (
    <div>
      <nav className="flex items-center justify-between w-full py-4 md:px-0 sm:px-0 pr-0">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <span>Omni</span>
        </div>
        
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {mobileMenuOpen ? (
              <AiOutlineClose className="w-5 h-5" />
            ) : (
              <AiOutlineMenu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink 
            className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} 
            to="/"
          >
            <div className="navGroup">
              {/* <HiOutlineHome className="icon" /> */} Home
            </div>
            
          </NavLink>
          
          <NavLink 
            className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} 
            to="/posts"
            end
          >
            <div className="navGroup">
              {/* <MdPostAdd className="icon"/> */} Posts 
            </div>
          </NavLink>
          
          <NavLink 
            className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} 
            to="/posts/new-post"
          >
            <div className="navGroup">
              {/* <HiOutlinePencilAlt className="icon" /> */} Create
            </div>
            
          </NavLink>

          {(auth.role === 1 || auth.role === 2) && (
            <>
              <NavLink 
                className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="/categories">
                <div className="navGroup">
                  {/* <TbCategory2 className="icon" /> */} Categories
                </div>
              </NavLink>
    
              <NavLink 
                className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="/users">
                <div className="navGroup">
                  {/* <TbCategory2 className="icon" /> */} Users
                </div>
              </NavLink>
            </>
          )}

          {/* 
              <NavLink className={({ isActive }) => `dropdown ${isActive ? 'activeNavLink' : ''}`} to="/login"  onClick={handleLogOut}>
                  <div className="navGroup">
                    <HiOutlineLogout className="icon"/> Logout
                  </div>
              </NavLink> 
          */}
          
          {/*
              <NavLink 
                className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="">
                <IoMdNotificationsOutline className="w-5 h-5" />
              </NavLink>
         */}
  
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center ">
              <img src={profilePicUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 space-y-2 bg-white p-4 w-[12rem] h-[10rem] rounded-lg border border-slate-200 z-50">
                <NavLink 
                  className={({ isActive }) => `dropdown ${isActive ? 'activeNavLink' : ''}`} 
                  to={`${currentUser._id}`}
                >
                  <div className="navGroup">
                    {/* <HiOutlineUserCircle className="icon"/> */} Profile
                  </div>
                </NavLink>
                
                <NavLink 
                  className={({ isActive }) => `dropdown ${isActive ? 'activeNavLink' : ''}`} 
                  to="/settings"
                >
                  <div className="navGroup">
                    {/* <HiOutlineCog className="icon"/> */} Settings
                  </div>
                </NavLink>
                
                <NavLink 
                  className={({ isActive }) => `dropdown ${isActive ? 'activeNavLink' : ''}`} 
                  to="/login" 
                  onClick={handleLogOut}
                >
                   <div className="navGroup">
                    {/* <HiOutlineLogout className="icon"/> */} Logout
                  </div>
                </NavLink>
              </div>
            )}
          </div>
        </div>


        {/* Mobile dropdown with ScrollLock */}
        {mobileMenuOpen && (
          <ScrollLock>
            <div className={`md:hidden fixed inset-0 z-50 bg-white flex flex-col px-5 text-black transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="absolute flex justify-between top-4 left-5 right-5">
                <div className="flex items-center">
                  {/* Profile picture on the left */}
                  <img 
                    src={profilePicUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover ml-3" 
                  />
                  <span className="text-md pl-3 font-semibold">Hey, {currentUser?.name}</span> {/* Optionally show the user's name */}
                </div>
                <button onClick={toggleMobileMenu} className="text-slate-400">
                  <AiOutlineClose className="w-5 h-5" />
                </button>
              </div>
              <div className="pt-[5rem] mt-[2rem]">
                <NavLink className="mobile-nav-link" to="/" onClick={toggleMobileMenu}>Home</NavLink>
                <NavLink className="mobile-nav-link" to="/categories" onClick={toggleMobileMenu}>Categories</NavLink>
                <NavLink className="mobile-nav-link" to="/posts" onClick={toggleMobileMenu}>Posts</NavLink>
                <NavLink className="mobile-nav-link" to="/posts/new-post" onClick={toggleMobileMenu}>Write</NavLink>
                <NavLink className="mobile-nav-link" to="" onClick={toggleMobileMenu}>Notifications</NavLink>
                
                <div className="border-t mt-4 pt-4">
                  <NavLink className="mobile-nav-link" to={`${currentUser?._id}`} onClick={toggleMobileMenu}>Profile</NavLink>
                  <NavLink className="mobile-nav-link" to={`/settings`} onClick={toggleMobileMenu}>Settings</NavLink>
                  <NavLink className="mobile-nav-link" to="/login" onClick={handleLogOut}>Logout</NavLink>
                </div>
              </div>
            </div>
          </ScrollLock>
        )}
      </nav>
    </div>
  );
};

export default PrivateNavBar;
