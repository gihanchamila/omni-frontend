import React, { useEffect, useState } from 'react';
import { FiCamera } from "react-icons/fi";
import { FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { useSwipeable } from 'react-swipeable';
import { FaShieldAlt, FaUserCircle } from 'react-icons/fa';
import Button from '../component/button/Button.jsx';
import axios from "../utils/axiosInstance.js"
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import UpdateProfilePictureModal from '../component/modal/UpdateProfilePictureModal.jsx';
import { RiCloseLargeFill } from "react-icons/ri";


const initialFormData = {name : "", email : "", dateOfBirth : "" , interests : "" }
const initialFormError = {name : "", email : "", dateOfBirth : "", interests : "" }

const Setting = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState(initialFormError)
  const [fileId, setFileId] = useState(null);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150"); // Placeholder image
  const [activeTab, setActiveTab] = useState("general");

  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState()




  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeDeviceIndex < devices.length - 1) {
        setActiveDeviceIndex(activeDeviceIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (activeDeviceIndex > 0) {
        setActiveDeviceIndex(activeDeviceIndex - 1);
      }
    },
    preventDefaultTouchmoveEvent: true, 
    trackMouse: true,
  });

  const tabs = [
    { icon: <FaUserCircle />, label: 'General' },
    { icon: <FaShieldAlt />, label: 'Security' },
  ];

  useEffect(() => {
    const getDevices = async() => {
      try{
        setLoading(true)
        const response = await axios.get("/user/devices")
        const data = response.data.data.devices
        console.log(data)
        setDevices(data)
      }catch(error){
        const response = error.response
        const data = response.data.data
        toast.error(data.message)
      }
    }

    getDevices()
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
    try {
      const response = await axios.get(`/auth/current-user`, formData);
      const user = response.data.data.user;  
      if (user && user._id) {
          setCurrentUser(user); 
          setFormData({
            name : user.name,
            email : user.email,
            dateOfBirth : user.dateOfBirth,
            interests : user.interests
          })

      } else {
          toast.error('User data is incomplete');
      }
    }catch(error){
      toast.error('Error getting user');
    }
    };
    getCurrentUser();
  },[]);

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name] : e.target.value}))
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
        try{
            setLoading(true)
            const response = await axios.put(`/user/update-profile`, formData)
            const data = response.data
            toast.success(data.message)
            setFormData(initialFormData)
            setFormError(initialFormError)
            setLoading(false)
        }catch(error){
            setLoading(false)
            setFormError(initialFormError)
            const response = error.response
            const data = response.data
            toast.error(data.message)
        }
  };


  return (
    <div className={`py-4 mx-auto rounded-xl grid lg:grid-cols-16 gap-6 transition-all duration-300 ${isSidebarOpen ? 'lg:grid-cols-16' : 'lg:grid-cols-12'}`}>
      {/* Sidebar and Toggle Button */}
      <div className="relative w-full">
      {/* Top bar with menu button */}
        <div className="flex justify-start text-black">
          <button
            className="text-3xl focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="w-5 h-5 hover:text-blue-500 transition-colors duration-200" />
          </button>
        </div>

        {/* Sidebar - Works for both Mobile and Desktop */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 p-6  rounded-r-2xl`}
        >
          {/* Close button */}
          <div className="flex justify-end">
            <button
              className="text-3xl focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <RiCloseLargeFill className="w-5 h-5 transition-colors duration-200" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8">
            <ul className="space-y-4">
              {tabs.map((tab) => (
                <li key={tab.label}>
                  <button
                    className={`flex items-center justify-start w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === tab.label.toLowerCase() ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-700'}`}
                    onClick={() => {
                      setActiveTab(tab.label.toLowerCase());
                      setSidebarOpen(false); // Close sidebar after selection
                    }}
                  >
                    {tab.icon} <span className="ml-2">{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
  
      {/* Content Panel */}
      { currentUser && ( <div className={`lg:col-span-full lg:col-start-1 md:col-start-5 lg:col-end-16 bg-gray-50 p-8 rounded-lg transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {activeTab === "general" && (
          <div>
            <h2 className="title">General Settings</h2>
            <div className="grid gap-y-7 md:grid-cols-1">
              
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
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:pl-6 md:items-start">
                      <h2 className="text-lg font-semibold">{currentUser.name}</h2>
                      <p className="text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 md:mt-0 space-x-4">
                    <UpdateProfilePictureModal />
                  </div>
                </div>
              </div>

              {/* Bento Box Layout for User Info and Login Sections */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* User Information Section */}
                <div className="bg-white p-6 rounded-lg">
                  <h2 className="subTitle">User Information</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-x-4 gap-y-4">
                      <div className="col-span-full md:col-start-1 md:col-end-5 space-y-4">
                          <div className="groupBox" >
                            <label className="label">Full Name</label>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              className="input-box"
                            />
                          </div>
                          <div className="groupBox" >
                            <label className="label">Birth Day</label>
                            <input
                              id="dateOfBirth"
                              name="dateOfBirth"
                              type="date"
                              placeholder="2001-05-15"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              className="input-box"
                            />
                          </div>
                      </div>
                      <div className="col-span-full md:col-start-5 md:col-end-9 space-y-4">
                        {[
                          { id: "email", name : "email", label: "Email Address", type: "email", placeholder: "someone@gmail.com", value : formData.email || "" },
                          { id: "interests", name : "interests", label: "Interests", type: "text", placeholder: "e.g. Reading, Coding", value : formData.interests || ""}
                        ].map(({ id, label, type, placeholder, value, name }) => (
                          <div className="groupBox" key={id}>
                            <label htmlFor={id} className="label">{label}</label>
                            <input
                              id={id}
                              name={name}
                              type={type}
                              placeholder={placeholder}
                              value={value}
                              onChange={handleChange}
                              className="input-box"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='flex justify-end pt-6'>
                      <Button variant='info'>Update Details</Button>
                    </div>
                  </form>       
                </div>

                {/* User Login Section */}
                {/* User Device Information Section */}
                {/* Display the active device information */}

                <div className="bg-white p-6 rounded-lg">
                  <h2 className="subTitle">Devices Logged In</h2>
                  <div {...handlers} className="overflow-hidden">
                    <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${activeDeviceIndex * 100}%)` }}>
                      {devices.map((device, index) => {
                        let imageUrl = '';

                        switch (device.deviceType.toLowerCase()) {
                          case 'mobile':
                            imageUrl = '/images/mobile.png';  // Path to mobile image
                            break;
                          case 'tablet':
                            imageUrl = '/images/tablet.png';  // Path to tablet image
                            break;
                          case 'laptop':
                          default:
                            imageUrl = 'public/windows.png';  // Default to laptop image
                            break;
                        }

                        return (
                          <div key={index} className="min-w-full p-4 border rounded-lg">
                            <div className="grid grid-cols-2 gap-4 items-center">
                              <div>
                                {/* Display the image based on deviceType */}
                                <img src={imageUrl} alt={device.deviceType} className="w-42 h-auto object-cover" />
                              </div>
                              <div >
                                <div className='flex py-1'><p className="text-sm">Device Type : </p><p className="text-sm pl-1"> {device.deviceType}</p></div>
                                <div className='flex py-1'><p className="text-sm">Browser : </p> <p className="text-sm pl-1"> {device.browser}</p></div>
                                <div className='flex py-1'><p className="text-sm">OS  :</p> <p className="text-sm pl-1"> {device.os}</p></div>
                                <div className='flex py-1'><p className="text-sm">Login Time : </p> <p className="text-sm pl-1"> {new Date(device.loggedInAt).toLocaleString()}</p></div>  
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Additional Security Settings</h3>
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
                    className="input-box px-4 border rounded-lg pb-2 focus:outline-none"
                    placeholder="Answer security questions"
                    rows="5"
                  />
                </div>
                <Button variant="info">Save Security Settings</Button>
              </div>

              {/* Two-Factor Authentication Section */}
              <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                <p className='pb-1'>Two Factor Authentication boosts security by requiring both your password and a code sent to your email, ensuring extra protection against unauthorized access</p>
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
                  <label htmlFor="verify-email" className="text-gray-700 font-medium">Verify Email Address</label>
                  <input
                    type="email"
                    name="verify-email"
                    id="verify-email"
                    className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                    placeholder="Enter verification email"
                  />
                </div>
                {/*
                <div className="groupBox">
                  <label htmlFor="verify-mobile" className="text-gray-700 font-medium">Verify Mobile</label>
                  <input
                    type="tel"
                    name="verify-mobile"
                    id="verify-mobile"
                    className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                    placeholder="Enter verification mobile number"
                  />
                </div>
                */}
                <Button variant="info">Save Verification Settings</Button>
              </div>
            </div>
          </div>
        )}
      </div>)}
    </div>
  );
  
}

export default Setting;
