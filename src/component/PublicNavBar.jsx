import { NavLink, useLocation } from "react-router-dom";
import Button from "./button/Button.jsx";
import { useState, useEffect } from "react";

import { HiBars3, HiOutlineXMark } from "react-icons/hi2";

const PublicNavBar = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    setOpenNavigation(false);
  }, [location]);

  return (
    <div>
      <nav className="relative flex items-center justify-between w-full py-4">

        <div className="flex-shrink-0 flex items-center">
         <p className="font-bold text-2xl text-slate-700 dark:text-white hover:cursor-pointer">Omniblogs</p>
        </div>
        
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center p-2 text-gray-500 z-50 dark:text-white"
        >
          {mobileMenuOpen ? <HiOutlineXMark className="w-6 h-6 dark:text-white" /> : <HiBars3 className="w-6 h-6 dark:text-white" />}
        </button>
         
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
            Sign Up
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50  bg-white dark:text-white dark:bg-slate-900 dark:hover:text-slate-800 dark:hover:bg-white flex flex-col py-5 px-6 text-black transition-transform duration-300 ease-in-out transform dark:xs:rounded-sm">
            <button
              onClick={toggleMobileMenu}
              className="self-end text-gray-500"
            >
              <HiOutlineXMark className="w-6 h-6 dark:text-white" />
            </button>
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
                className="block py-4 text-sm px-4 font-semibold hover:bg-slate-100 hover:rounded-lg dark:hover:bg-white dark:hover:text-slate-800 sm:bg-slate-800 sm:text-white sm:rounded-lg sm:hover:bg-slate-500 dark:bg-white dark:text-slate-700 dark:xs:rounded-lg"
                to="/signup"
                onClick={toggleMobileMenu}
              >
                Sign Up
              </NavLink>
            </div>
          </div>
      )}
    </div>
  );
};

export default PublicNavBar;
