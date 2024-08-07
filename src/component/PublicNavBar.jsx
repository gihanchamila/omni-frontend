import { NavLink, useLocation } from "react-router-dom";
import { omni } from "../assets/Navigation/index.js";
import Button from "./button/Button.jsx";
import { useState, useEffect } from "react";
import { HiBars3, HiOutlineXMark } from "react-icons/hi2";

const PublicNavBar = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const location = useLocation();

  const toggleNavigation = () => {
    setOpenNavigation(prev => !prev);
  };

  // Close navigation when the route changes
  useEffect(() => {
    setOpenNavigation(false);
  }, [location]);

  return (
    <div className="container mx-auto px-4">
      <nav className="relative flex items-center justify-between w-full py-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <img className="w-20 h-20" src={omni} alt="Logo" />
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={toggleNavigation}
          className="lg:hidden absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center p-2 text-gray-500 z-50"
        >
          {openNavigation ? <HiOutlineXMark /> : <HiBars3 />}
        </button>
        
        {/* Navigation Links */}
        <div
          className={`lg:flex lg:items-center lg:space-x-4 lg:static lg:bg-transparent lg:backdrop-blur-none fixed inset-0 ${openNavigation ? "flex flex-col items-center justify-center backdrop-blur-sm bg-white/60 z-40" : "hidden lg:flex"}`}
        >
          <NavLink className="navlink" to="/our-story">Our Story</NavLink>
          <NavLink className="navlink" to="/write">Write</NavLink>
          <NavLink className="navlink" to="/login">Sign in</NavLink>
          <Button to="/signup" className="">Get Started</Button>
        </div>
      </nav>
    </div>
  );
};

export default PublicNavBar;