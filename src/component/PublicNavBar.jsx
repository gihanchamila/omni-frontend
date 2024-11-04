import { NavLink, useLocation } from "react-router-dom";
import Button from "./button/Button.jsx";
import { useState, useEffect } from "react";
import { HiOutlineLogin } from "react-icons/hi";
import { HiBars3, HiOutlineXMark } from "react-icons/hi2";
import { FcAbout } from "react-icons/fc";
import ScrollLock from "react-scrolllock";

const PublicNavBar = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleNavigation = () => {
    setOpenNavigation(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    setOpenNavigation(false);
  }, [location]);

  return (
    <div>
      <nav className="relative flex items-center justify-between w-full py-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <img className="w-20 h-20" alt="Logo" />
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center p-2 text-gray-500 z-50"
        >
          {mobileMenuOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
        </button>
         
        {/* Navigation Links */}
        <div
          className={`lg:flex lg:items-center lg:space-x-4 lg:static lg:bg-transparent lg:backdrop-blur-none fixed inset-0 ${openNavigation ? "flex flex-col items-center justify-center backdrop-blur-sm bg-white/60 z-40" : "hidden lg:flex"}`}
        >
          <NavLink className={({isActive}) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="/our-story">
            <div className="flex items-center justify-center space-x-2">
              {/* <FcAbout className="icon text-blue-500" /> */} Our Story
            </div>
          </NavLink>
          <NavLink className={({isActive}) => `navlink ${isActive ? 'activeNavLink' : ''}`} to="/login">
            <div className="flex items-center justify-center space-x-2">
              {/* <HiOutlineLogin className="icon" /> */} Sign in
            </div>
          </NavLink>
          <Button variant="primary" to="/signup">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ScrollLock>
          <div className="md:hidden fixed inset-0 z-50 pt-10 mr-2 bg-white flex flex-col p-5 text-black transition-transform duration-300 ease-in-out transform">
            {/* Close Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="self-end text-gray-500"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>

            {/* Menu Links */}
            <div className="mt-10 space-y-4">
              <NavLink
                className="mobile-nav-link"
                to="/our-story"
                onClick={toggleMobileMenu}
              >
                Our Story
              </NavLink>
              <NavLink
                className="mobile-nav-link"
                to="/login"
                onClick={toggleMobileMenu}
              >
                Sign In
              </NavLink>
              <NavLink
                className="mobile-nav-link"
                to="/signup"
                onClick={toggleMobileMenu}
              >
                Get Started
              </NavLink>

            </div>
          </div>
        </ScrollLock>
      )}
    </div>
  );
};

export default PublicNavBar;
