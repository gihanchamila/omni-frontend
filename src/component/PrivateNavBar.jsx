import { NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from '../utils/axiosInstance.js';
import { useState, useEffect, useCallback, useRef} from "react";
import { toast } from "sonner";
import { useProfile } from "./context/useProfilePic.jsx";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import ScrollLock from "react-scrolllock";
import { useAuth } from '../component/context/useAuth.jsx';
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNotification } from "./context/useNotification.jsx";
import { useSocket } from "./context/useSocket.jsx";
import useClickOutside from "./context/useClickOutside.jsx";

const PrivateNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const socket = useSocket();
  const panelRef = useRef(null)
  const { notifications, setNotifications, markAsRead, deleteNotification, clearNotifications } = useNotification();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [loading, setLoading] = useState(false);
  const { profilePicUrl, setProfilePicUrl } = useProfile();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileKey, setProfileKey] = useState(null);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    document.body.classList.remove('backdrop-blur');
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
        const response = error.response;
        const data = response.data;
        toast.error(data.message);
      }
    };
    getCurrentUser();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };
  
  const handleDelete = useCallback(async (e, id) => {
    e.stopPropagation(); // Prevent parent click handler
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

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const toggleDropdownNotification = () => setNotificationDropdownOpen((prev) => !prev);

  useClickOutside(panelRef, () => setNotificationDropdownOpen(false));

  return (
    <div>
      <nav className="flex items-center justify-between w-full py-4 md:px-0 sm:px-0 sm:m-0 sm:w-full pr-0">
        
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

          <div className="relative">
            <button onClick={toggleDropdownNotification} className="navGroup flex items-center">
              <IoMdNotificationsOutline className="relative w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute bg-red-500 left-1.5 top-3 text-white text-xs w-2 h-2 rounded-full font-semibold">
                </span>
              )}
            </button>

            {notificationDropdownOpen && (
             <div ref={panelRef} className="absolute right-0 mt-4 bg-white p-4 w-[26.9rem] rounded-lg border border-slate-200 z-50">
             <h4 className="font-bold text-xl mb-2 text-blue-500">Notifications</h4>
             <div className="flex justify-between items-center mb-2">
              
             </div>
             <div>
             <ul className="space-y-2">
              
              {/* Notifications */}
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li
                      key={notification._id || `${notification.message}`}
                      className={`relative flex m-0 items-center justify-between rounded-lg text-sm cursor-pointer ${
                        notification.isRead ? "font-light text-gray-500" : "font-regular text-gray-700"
                      }`}
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      <span className="w-full hover:underline truncate" title={notification.message}>
                        {notification.message}
                      </span>
                      <button
                        className="text-gray-700 text-xs"
                        aria-label="Delete notification"
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
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-center pt-2 pb-2">No notifications available</li>
                )}
              </ul>
                <div className="flex justify-end space">
                  <button className="notification-bottom">
                    Mark all as read
                  </button>
                  <button className="notification-bottom pr-0" onClick={clearNotifications}>
                    Clear all
                  </button>
                </div>
             </div>
           </div>
            )}
          </div>

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
