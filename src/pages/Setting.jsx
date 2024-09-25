import React, { useState } from 'react';
import { FiCamera } from "react-icons/fi";
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from '../component/button/Button.jsx';
import { useLocation } from 'react-router-dom';


const Setting = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150"); // Placeholder image
  const [activeTab, setActiveTab] = useState("general");
  const location = useLocation();


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
    <div className={`py-4 mx-auto rounded-lg grid lg:grid-cols-16 gap-6 transition-all duration-300 ${isSidebarOpen ? 'lg:grid-cols-16' : 'lg:grid-cols-12'}`}>
      {/* Sidebar and Toggle Button */}
      <div className='w-full'>
        <div className="flex justify-end p-4">
          <button
            className="text-3xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
        </div>
  
        {/* Sidebar - Works for both Mobile and Desktop */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white z-50 transition-transform transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 p-6`}
        >
          {/* Close button */}
          <div className="flex justify-end">
            <button
              className="text-3xl"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
  
          {/* Navigation Links */}
          <nav className="mt-8">
            <ul className="space-y-4">
              {['general', 'security'].map((tab) => (
                <li key={tab}>
                  <button
                    className={`block w-full text-left px-4 py-2 rounded ${
                      activeTab === tab
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setSidebarOpen(false); // Close sidebar after selection
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
  
      {/* Content Panel */}
      <div className={`lg:col-span-full lg:col-start-1 md:col-start-5 lg:col-end-16 bg-gray-50 p-8 rounded-lg transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
      {activeTab === "general" && (
    <div>
      <h2 className="title">General Settings</h2>
      <div className="grid gap-y-4 md:grid-cols-1">
        
        {/* Profile Picture Section - No Changes */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="h6">Profile Picture</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-x-0 md:space-x-6">
            <div className="relative flex flex-col items-center md:flex-row bg-white p-4 rounded-lg">
              <div>
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-20 h-20 md:w-28 md:h-28 group rounded-full object-cover border-2 border-gray-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
              <div className="flex flex-col items-center md:pl-6 md:items-start">
                <h2 className="text-lg font-semibold">John Doe</h2>
                <p className="text-gray-600">john.doe@example.com</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 md:mt-0 space-x-4">
              <Button variant="error" onClick={handleRemovePic}>
                Remove
              </Button>
              <Button variant="info">
                <label htmlFor="profile-pic">Update</label>
              </Button>
            </div>
          </div>
        </div>

        {/* Bento Box Layout for User Info and Login Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* User Information Section */}
          <div className="bg-white p-6 rounded-lg">
            <h2 className="subTitle">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-8 gap-x-4 gap-y-4">
              <div className="col-span-full md:col-start-1 md:col-end-5 space-y-4">
                {[
                  { id: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                  { id: "birthday", label: "Birth Day", type: "date" }
                ].map(({ id, label, type, placeholder }) => (
                  <div className="groupBox" key={id}>
                    <label htmlFor={id} className="label">{label}</label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      placeholder={placeholder}
                      className="input-box"
                    />
                  </div>
                ))}
              </div>
              <div className="col-span-full md:col-start-5 md:col-end-9 space-y-4">
                {[
                  { id: "email", label: "Email Address", type: "email", placeholder: "someone@gmail.com" },
                  { id: "interests", label: "Interests", type: "text", placeholder: "e.g. Reading, Coding" }
                ].map(({ id, label, type, placeholder }) => (
                  <div className="groupBox" key={id}>
                    <label htmlFor={id} className="label">{label}</label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      placeholder={placeholder}
                      className="input-box"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Login Section */}
          <div className="bg-white p-6 rounded-lg">
            <h2 className="subTitle">User Login</h2>
            <div className="space-y-4">
              <div className="groupBox">
                <label htmlFor="username" className="label">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  className="input-box"
                />
              </div>
              <div className="groupBox">
                <label htmlFor="password" className="label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  className="input-box"
                />
              </div>
              <div className="groupBox">
                <label htmlFor="confirm-password" className="label">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="********"
                  className="input-box"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Change Password Section */}
              <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="flex flex-col space-y-4">
                  <div className="groupBox">
                    <label htmlFor="current-password" className="text-gray-700 font-medium">Current Password</label>
                    <input
                      type="password"
                      name="current-password"
                      id="current-password"
                      className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="groupBox">
                    <label htmlFor="new-password" className="text-gray-700 font-medium">New Password</label>
                    <input
                      type="password"
                      name="new-password"
                      id="new-password"
                      className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="groupBox">
                    <label htmlFor="confirm-new-password" className="text-gray-700 font-medium">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm-new-password"
                      id="confirm-new-password"
                      className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                <Button variant="info">Change Password</Button>
              </div>

              {/* Additional Security Settings Section */}
              <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg ">
                <h3 className="text-lg font-semibold mb-4">Additional Security Settings</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="two-factor"
                    id="two-factor"
                    className="form-checkbox"
                  />
                  <label htmlFor="two-factor" className="text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <div className="groupBox">
                  <label htmlFor="backup-email" className="text-gray-700 font-medium">Backup Email Address</label>
                  <input
                    type="email"
                    name="backup-email"
                    id="backup-email"
                    className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                    placeholder="Enter backup email address"
                  />
                </div>
                <div className="groupBox">
                  <label htmlFor="security-questions" className="text-gray-700 font-medium">Security Questions</label>
                  <textarea
                    name="security-questions"
                    id="security-questions"
                    className="input-box px-4 border rounded-lg pb-5 focus:outline-none"
                    placeholder="Answer security questions"
                    rows="2"
                  />
                </div>
                <Button variant="info">Save Security Settings</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
  
}

export default Setting;
