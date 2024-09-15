import React, { useState } from 'react';
import { FiCamera } from "react-icons/fi";
import Button from '../component/button/Button.jsx';

const Setting = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150"); // Placeholder image
  const [activeTab, setActiveTab] = useState("general");

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
    <div className="py-4 mx-auto rounded-lg grid lg:grid-cols-16 md:grid-cols-16 gap-6">
      {/* Sidebar and Toggle Button */}
      <div className='lg:col-start-1 lg:col-end-5'>
        {/* Sidebar Toggle Button for Mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block col-span-4 col-start-1 col-end-5 pt-4 bg-gray-50 p-6 h-auto md:h-48 rounded-lg md:pt-14`}
        >
          <nav className="rounded-lg">
            <ul className="space-y-4">
              {["general", "security"].map(tab => (
                <li key={tab}>
                  <button
                    className={`block w-full text-left px-4 py-2 rounded ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setSidebarOpen(false); // Close sidebar on mobile
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
      <div className="col-span-12 col-start-1 md:col-start-5 col-end-17 bg-gray-50 p-8 rounded-lg">
        {activeTab === "general" && (
          <div>
            <h2 className="title">General Settings</h2>
            <div className="grid gap-y-4 md:grid-cols-1">
              <h2 className="h6">Profile</h2>

              {/* Profile Picture and Name */}
              <div className="flex flex-col md:flex-row items-center justify-between space-x-0 md:space-x-6 p-6 border border-gray-200 rounded-lg">
                <div className="relative flex flex-col items-center md:flex-row">
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

              {/* Input Fields for Name and Email */}
              <div>
                <h2 className="subTitle">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-8 gap-x-4 gap-y-4">
                  <div className="col-span-full md:col-start-1 md:col-end-5 space-y-4">
                    {[
                      { id: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                      { id: "birthday", label: "Birth Day", type: "date" }
                    ].map(({ id, label, type, placeholder }) => (
                      <div className="flex flex-col space-y-1" key={id}>
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
                      <div className="flex flex-col space-y-1" key={id}>
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

                  {/* Save Changes Button */}
                  <div className="col-span-full md:col-start-7 md:col-span-2 flex justify-center md:justify-end">
                    <Button variant="info">Save Changes</Button>
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
              {/* Security settings fields */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="password" className="text-gray-700 font-medium">Change Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="flex items-center">
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
}

export default Setting;
