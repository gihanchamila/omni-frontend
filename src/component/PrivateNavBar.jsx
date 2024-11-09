import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from '../utils/axiosInstance.js';
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useProfile } from "./context/useProfilePic.jsx";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import ScrollLock from "react-scrolllock";
import { useAuth } from '../component/context/useAuth.jsx';

const PrivateNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const { profilePicUrl, setProfilePicUrl } = useProfile();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileKey, setProfileKey] = useState(null);

  // Close dropdowns and reset classes on location change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    document.body.classList.remove('backdrop-blur');
  }, [location]);

  // Fetch current user data
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

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  // Handle user logout
  const handleLogOut = () => {
    window.localStorage.removeItem('blogData');
    setCurrentUser(null);
    setProfilePicUrl(null);
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
        
        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {mobileMenuOpen ? <AiOutlineClose className="w-5 h-5 font-bold" /> : <AiOutlineMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-5">
          <NavLink className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="/" end>
            <div className="navGroup">Home</div>
          </NavLink>

          <NavLink className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="/posts/new-post">
            <div className="navGroup">Create</div>
          </NavLink>

          {(auth.role === 1 || auth.role === 2) && (
            <NavLink className={({ isActive }) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="/dashboard">
              <div className="navGroup">Dashboard</div>
            </NavLink>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center">
              <img src={profilePicUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 space-y-2 bg-white p-4 w-[12rem] h-[10rem] rounded-lg border border-slate-200 z-50">
                <NavLink className={({ isActive }) => `dropdown ${isActive ? 'activeNavLink' : ''}`} to={`${currentUser._id}`}>
                  <div className="navGroup">Profile</div>
                </NavLink>
                <NavLink className={({ isActive }) => `dropdown ${isActive ? 'activeNavLink' : ''}`} to="/settings">
                  <div className="navGroup">Settings</div>
                </NavLink>
                <NavLink className={({ isActive }) => `dropdown ${isActive ? 'activeNavLink' : ''}`} to="/login" onClick={handleLogOut}>
                  <div className="navGroup">Logout</div>
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <ScrollLock>
            <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col px-5 text-black transition-transform duration-300 ease-in-out transform">
              <div className="absolute flex justify-between top-4 left-5 right-5">
                <div className="flex items-center">
                  <img src={profilePicUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover ml-3" />
                  <span className="text-md pl-3 font-semibold">Hey, {currentUser?.firstName} {currentUser?.lastName}</span>
                </div>
                <button onClick={toggleMobileMenu} className="text-slate-400">
                  <AiOutlineClose className="w-5 h-5" />
                </button>
              </div>
              <div className="pt-[5rem] mt-[2rem]">
                <NavLink className="mobile-nav-link" to="/" onClick={toggleMobileMenu}>Home</NavLink>
                <NavLink className="mobile-nav-link" to="/posts" onClick={toggleMobileMenu}>Posts</NavLink>
                <NavLink className="mobile-nav-link" to="/posts/new-post" onClick={toggleMobileMenu}>Write</NavLink>
                <NavLink className="mobile-nav-link" to="" onClick={toggleMobileMenu}>Notifications</NavLink>
                
                <div className="border-t mt-4 pt-4">
                  <NavLink className="mobile-nav-link" to={`${currentUser?._id}`} onClick={toggleMobileMenu}>Profile</NavLink>
                  <NavLink className="mobile-nav-link" to="/settings" onClick={toggleMobileMenu}>Settings</NavLink>
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
