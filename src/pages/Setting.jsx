import React from 'react'
import { useState } from 'react';
import { FiCamera } from "react-icons/fi";
import Button from '../component/button/Button.jsx';

const Setting = () => {

  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150" // Placeholder image
  );

  const [activeTab, setActiveTab] = useState("general")

  const handleRemovePic = () => {
    setProfilePic("https://via.placeholder.com/150");
  };

  const handleUpdatePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
  
    <div className="py-4 mx-auto bg-white rounded-lg grid grid-cols-16 gap-6">
  {/* Navigation Panel */}
  <div className="col-span-4 col-start-1 col-end-5 pt-14">
    <nav className="rounded-lg">
      <ul className="space-y-4">
        <li>
          <button
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "general"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
        </li>
        <li>
          <button
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "security"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </li>
      </ul>
    </nav>
  </div>

  {/* Content Panel */}
  <div className="col-span-12">
    {activeTab === "general" && (
      <div>
        <h2 className="text-2xl font-bold mb-6">General Settings</h2>

        <div className="grid gap-x-12 gap-y-8 md:grid-cols-1">

          {/* Profile Picture and Name in One Row */}

          <div className="flex items-center justify-between space-x-6 p-6 bg-gray-100 rounded-lg">

            {/* Profile Picture */}

            <div className="relative flex">
              <div className=''>
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-28 h-28 group rounded-full object-cover border-2 border-gray-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100  transition-opacity cursor-pointer">
                  <label htmlFor="profile-pic" className="cursor-pointer">
                    <FiCamera className="text-white" />
                  </label>
                  <input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpdatePic}
                  />
                </div>
              </div>
              <div className='flex items-center justify-between pl-6'>
                <div className='flex-col'>
                  <h2 className="text-lg font-semibold">John Doe</h2>
                  <p className="text-gray-600">john.doe@example.com</p>
                </div>
              </div>
            </div>

             {/* Buttons */}

            <div className='flex-col'>
              <div className="mt-4 space-x-4">
                <Button className="" variant='error' onClick={handleRemovePic}>Remove</Button>
                <Button variant='info'>
                  <label
                    htmlFor="profile-pic"
                    className=""
                  >
                    Update
                  </label>
                </Button>
                
              </div>
            </div>
          </div>

          {/* Input Fields for Name and Email */}

          <div className="mt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-gray-700 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="input-box px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your name"
                  required
                />
                <p className="text-red-500 text-sm">{/* Error message */}</p>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input-box px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your email"
                  required
                />
                <p className="text-red-500 text-sm">{/* Error message */}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === "security" && (
      <div>
        <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
        <div className="space-y-6">
          {/* Add your security-related settings fields here */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-gray-700 font-medium">
              Change Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="input-box px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="two-factor" className="text-gray-700 font-medium">
              Two-Factor Authentication
            </label>
            <input
              type="checkbox"
              name="two-factor"
              id="two-factor"
              className="form-checkbox"
            />
            <label htmlFor="two-factor" className="ml-2 text-gray-700">
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

);
};


export default Setting