import { NavLink } from "react-router-dom";
import { omni } from "../assets/Navigation/index.js"
import Button from "./button/Button.jsx";
import { useState } from "react";

const PublicNavBar = () => {

  return (
    <div className="container flex items-center justify-between m-auto mt-[1rem] bg-white py-1 rounded-lg">
      <div className="flex items-center space-x-4">
        <img className="w-20 h-20" src={omni} alt="Logo" />
      </div>
      <nav>
        <div className="flex items-center justify-center space-x-4">
          <NavLink className="navlink" to="/login">Our Story</NavLink>
          <NavLink className="navlink" to="/login">Write</NavLink>
          <NavLink className="navlink" to="/login">Sign in</NavLink>
          <Button to="/signup">Get Started</Button>
        </div>
      </nav>
    </div>
  );
};

export default PublicNavBar;