import { NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from '../utils/axiosInstance.js';
import { useState, useEffect, useCallback, useRef} from "react";
import { toast } from "sonner";
import { useProfile } from "./context/useProfilePic.jsx";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useAuth } from '../component/context/useAuth.jsx';
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNotification } from "./context/useNotification.jsx";
import { useSocket } from "./context/useSocket.jsx";
import useClickOutside from "./context/useClickOutside.jsx";
import { motion } from "framer-motion";

const PrivateNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const socket = useSocket();
  const panelRef = useRef(null)
  const profileRef = useRef(null)
  const { notifications, setNotifications, markAsRead, deleteNotification, clearNotifications } = useNotification();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [loading, setLoading] = useState(false);
  const { profilePicUrl, setProfilePicUrl } = useProfile();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileKey, setProfileKey] = useState(null);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    document.body.classList.remove('backdrop-blur');
  }, [location]);

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
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      getCurrentUser();
    }
  }, [currentUser]);

  useEffect(() => {
    if (unreadCount > 0) {
      // Start animation every 5 seconds
      const interval = setInterval(() => {
        setShowAnimation(true);

        setTimeout(() => {
          setShowAnimation(false);
        }, 2000); // Animation duration (2 seconds)
      }, 5000);  // Trigger animation every 5 seconds

      return () => clearInterval(interval);
    }
  }, [unreadCount]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };
  
  const handleDelete = useCallback(async (e, id) => {
    e.stopPropagation(); 
    setLoading(true);
    try {

      if (!id) {
        console.error("Notification ID is missing");
        return;
      }
      if (socket) {
        socket.emit('notification-deleted', { notificationId: id });
      }

      await deleteNotification(id); 
      await setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );

    } catch (error) {
      console.error("Failed to delete notification", error);
      toast.error("Failed to delete notification");
    } finally {
      setLoading(false);
    }
  }, [deleteNotification, socket, setNotifications]);

  const handleLogOut = () => {
    window.localStorage.removeItem('blogData');
    setCurrentUser(null);
    setProfilePicUrl(null);
    toast.success("Logout successful");
    setTimeout(() => {
      navigate('/login');
    }, 0);
  };

  const handleViewAll = () => {
    navigate('/notifications');
    setNotificationDropdownOpen(false);
  }

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const toggleDropdownNotification = () => setNotificationDropdownOpen((prev) => !prev);

  return (
    <div>
      <nav className="flex items-center justify-between w-full py-4 md:px-0 sm:px-0 sm:m-0 sm:w-full pr-0">
        
        {/* Logo */}

        <div className="flex-shrink-0 flex items-center">
          <p onClick={() => navigate("/")} className="font-bold text-2xl text-slate-700 dark:text-white hover:cursor-pointer">Omniblogs</p>
          {/* <img onClick={() => navigate("/")} src={logo} className="h-16 w-20 text-gray-500 dark:text-white hover:cursor-pointer"  alt="logo"/> */}
        </div>
        
        {/* Mobile Menu Toggle Button */}

        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {mobileMenuOpen ? <AiOutlineClose className="w-6 h-6 font-bold dark:text-white" /> : <AiOutlineMenu className="w-6 h-6 dark:text-white" />}
            </motion.div>
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


          <div className="relative">
          <button onClick={toggleDropdownNotification} className="navGroup flex items-center relative">
              <IoMdNotificationsOutline className="relative w-6 h-6 dark:text-white" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute bg-red-500 left-1.5 top-3 text-white  text-xs w-2 h-2 rounded-full font-semibold"
                  animate={{
                    scale: [1, 1.3, 1],  // Pulse effect
                    opacity: [1, 0.7, 1], // Fading effect
                  }}
                  transition={{
                    duration: 0.5, // Continuous animation
                    ease: "easeInOut",
                  }}
                />
              )}
            </button>

            {notificationDropdownOpen && (
             <div ref={panelRef} className="absolute right-0 mt-4 bg-white p-4 w-[26.9rem] rounded-lg border border-slate-200 z-50">
             <h4 className="font-bold text-md mb-2 text-blue-500">Notifications</h4>
             <div className="flex justify-between items-center mb-2">
              
             </div>
             <div>
             <ul className="space-y-2">
              
              {/* Notifications */}

              {notifications.length > 0 ? (
                <>
                 {notifications.slice(0, 10).map((notification) => (
                    <motion.li
                      key={notification._id || `${notification.message}`}
                      className={`relative flex m-0 items-center justify-between rounded-lg text-gray-600 text-sm font-light cursor-pointer pt-2 ${
                        notification.isRead ? "font-light text-gray-500" : "font-medium text-gray-600"
                      }`}
                      onClick={() => handleMarkAsRead(notification._id)}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }} // Stay visible while in the list
                      exit={{ opacity: 0 }} // Fade out on removal
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <span className="w-full hover:underline truncate" title={notification.message}>
                        {notification.message}
                      </span>

                      <motion.button
                        className="text-gray-500 text-sm"
                        aria-label="Delete notification"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }} // Fade out on removal
                        exit={{ opacity: 0 }} // Fade out when button is clicked
                        transition={{ duration: 0.8 }}
                        layout
                        onClick={(e) => handleDelete(e, notification._id)}
                      >
                        <svg
                          className="w-2 h-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                      </motion.button>
                    </motion.li>
                  ))}
                  {notifications.length > 10 && (
                    <p className="text-blue-500 text-sm text-center cursor-pointer hover:underline pt-2" onClick={handleViewAll}>
                      View all
                    </p>
                  )}
                </>
              ) : (
                <li className="text-gray-500 text-center text-sm pt-2 pb-2">
                  No notifications available
                </li>
              )}
              </ul>
                <div className="flex justify-end">
                  <button className="notification-bottom mt-1">
                    Mark all as read
                  </button>
                  <button className="notification-bottom" onClick={clearNotifications}>
                    Clear all
                  </button> 
                  <button className="notification-bottom pr-0" onClick={handleViewAll}>
                    View all
                  </button>               
                </div>
             </div>
           </div>
            )}
          </div>

          {/* Profile Dropdown */}

          <div className="relative">
            <button onClick={toggleDropdown} ref={profileRef} className="flex items-center">
              <img height={40} width={40}  src={profilePicUrl} alt="Profile" className="w-[40px] h-[40px] rounded-full object-cover" />
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
            <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-slate-900 dark:text-white flex flex-col px-5 text-slate-800 transition-transform duration-300 ease-in-out transform">
              <div className="absolute flex justify-between mt-3 top-4 left-5 right-5">
                <div className="flex items-center">
                  <img src={profilePicUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover ml-3" />
                  <span className="text-md pl-3 font-semibold dark:text-white">Hey, {currentUser?.firstName} {currentUser?.lastName}</span>
                </div>
                <button onClick={toggleMobileMenu} className="text-slate-400">
                  <AiOutlineClose className="w-5 h-5 dark:text-white" />
                </button>
              </div>
              <div className="pt-[5rem] mt-[2rem]">
                <NavLink className="mobile-nav-link" to="/" onClick={toggleMobileMenu}>Home</NavLink>
                <NavLink className="mobile-nav-link" to="/posts/new-post" onClick={toggleMobileMenu}>Create post</NavLink>
                <NavLink className="mobile-nav-link" to="/notifications" onClick={toggleMobileMenu}>Notifications</NavLink>
                
                <div className="border-t mt-4 pt-4">
                  <NavLink className="mobile-nav-link" to={`${currentUser?._id}`} onClick={toggleMobileMenu}>Profile</NavLink>
                  <NavLink className="mobile-nav-link" to="/settings" onClick={toggleMobileMenu}>Settings</NavLink>
                  <NavLink className="mobile-nav-link" to="/login" onClick={handleLogOut}>Logout</NavLink>
                </div>
              </div>
            </div>
        )}
      </nav>
    </div>
  );
};

export default PrivateNavBar;
