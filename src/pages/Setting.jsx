import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../component/context/useSocket.jsx';
import { useNotification } from '../component/context/useNotification.jsx';
import { FiCamera } from "react-icons/fi";
import { FaBars} from 'react-icons/fa';
import { toast } from 'sonner';
import { FaShieldAlt, FaUserCircle } from 'react-icons/fa';
import Button from '../component/button/Button.jsx';
import axios from "../utils/axiosInstance.js"
import 'react-image-crop/dist/ReactCrop.css';
import UpdateProfilePictureModal from '../component/modal/UpdateProfilePictureModal.jsx';
import { RiCloseLargeFill } from "react-icons/ri";
import { useProfile } from '../component/context/useProfilePic.jsx';
import TwoFactorAuthentication from '../component/settings/TwoFactorAuthentication.jsx';
import Modal from '../component/modal/Modal.jsx';

const initialFormData = {name : "", email : "", dateOfBirth : "" , interests : [], about : "", gender : "" }
const initialFormError = {name : "", email : "", dateOfBirth : "", interests : [], about : "", gender : ""  }
const initialPasswordData = {oldPassword : "", newPassword : "", confirmNewPassword : ""}
const initialQuestionData = {securityQuestion : "", securityAnswer : ""}

const Setting = () => {
  const navigate = useNavigate()
  const socket = useSocket()
  const { setNotifications } = useNotification()
  const { profilePicUrl, setProfilePicUrl } = useProfile();
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState(initialFormError)
  const [showModal, setShowModal] = useState(false)

  const [passwordData, setPasswordData] = useState(initialPasswordData)
  const [securityQuestionData, setSecurityQuestionData] = useState(initialQuestionData)

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState()

  const tabs = [
    { icon: <FaUserCircle />, label: 'General' },
    { icon: <FaShieldAlt />, label: 'Security' },
  ];

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`/auth/current-user`); // Removed formData from GET request
        const user = response.data.data.user;
  
        if (user && user._id) {
          setCurrentUser(user);
  
          // Check if profilePic and key exist before setting
          /*
          if (user.profilePic && user.profilePic.key) {
            setProfileKey(user.profilePic.key);
          }
            */
  
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            dateOfBirth: user.dateOfBirth || '',
            interests: user.interests || [],
            about: user.about || '',
            gender : user.gender
          });
        } else {
          toast.error('User data is incomplete');
        }
      } catch (error) {
        toast.error('Error getting user');
      }
    };
  
    getCurrentUser();
  }, []);

  useEffect(() => {
    const getDevices = async() => {
      try{
        setLoading(true)
        const response = await axios.get("/user/devices")
        const data = response.data.data.devices
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
    if (!socket) return;

    // Listen for user update notifications
    const handleUserUpdate = (notification) => {
      setNotifications((prev) => [
        ...prev,
        {
          type: notification.type || "update",
          message: notification.message || "Your profile has been updated",
          isRead: notification.isRead || false,
          _id: notification._id,
        },
      ]);
    };

    socket.on("user-updated", handleUserUpdate);
    
    return () => {
      socket.off("user-updated", handleUserUpdate);
    };
  }, [socket, setNotifications]);

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    // If the name is 'interests', split the value into an array
    if (name === "interests") {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.split(",").map((interest) => interest.trim()), // Split and trim
        }));
    } else {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        
        
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData({...passwordData, [name] : value})
  }

  const handleSecurityQuestionChange = (event) => {
    const { name, value } = event.target;
    setSecurityQuestionData({...securityQuestionData, [name] : value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
        try{
            setLoading(true)
            const response = await axios.put(`/user/update-profile`, formData)
            const data = response.data
            const { notificationId, message } = response.data;

            if (socket) {
              socket.emit("update-user", {notificationId});
            }
    
            setNotifications(prev => [...prev, {
              type: "comment",
              message,
              isRead: false,
              _id : notificationId
            }]);

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

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`/auth/change-password`, passwordData);
      const data = response.data;
      toast.success(data.message);
      setPasswordData(initialPasswordData);
    } catch (error) {
      setLoading(false);
      const response = error.response;
      const data = response.data;
      toast.error(data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestionSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true)
      const response = await axios.post('/auth/security-question', securityQuestionData)
      const data = response.data;
      toast.success(data.message)
      setSecurityQuestionData(initialQuestionData)
    }catch(error){
      setLoading(false);
      const response = error.response;
      const data = response.data;
      toast.error(data?.message || "Something went wrong");
    }
  };

  const handleEmailSubmit = async (email) => {
    try{
      setLoading(true)
      const response = await axios.post('/auth/send-verification-email', {email})
      const data = response.data;
      toast.success(data.message)
    }catch(error){
      setLoading(false);
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  };

  const handleVerificationSubmit = async (email, verificationCode) => {
    try{
      setLoading(true)
      const response = await axios.post(`/auth/verify-user`, {email , code : verificationCode})
      const data = response.data;
      toast.success(data.message)
    }catch(error){
      setLoading(false);
      console.error('Verification error:', error);
      const response = error.response;
      const data = response.data;
        if (data?.message) {
          throw new Error(data.message); 
        } else {
          throw new Error('An unexpected error occurred');
        }
    } 
  };

  const handleDeleteAccount = async () => {
    try{
      const response = await axios.delete("/auth/delete-account");
      const data = response.data;window.localStorage.removeItem('blogData');
      setCurrentUser(null)
      setProfilePicUrl(null)
      toast.success(data.message)
      handleCloseModal()
      navigate("/login")
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
};

  return (
    <div className={`py-4 mx-auto rounded-xl grid lg:grid-cols-16 gap-6 transition-all duration-300 ${isSidebarOpen ? 'lg:grid-cols-16' : 'lg:grid-cols-12'}`}>

      <div className="relative w-full">

        <div className="flex justify-start text-black">
          <button
            className="text-3xl focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="w-5 h-5 hover:text-blue-500 transition-colors duration-200" />
          </button>
        </div>

        <div
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 p-6  rounded-r-2xl`}
        >

          <div className="flex justify-end">
            <button className="text-3xl focus:outline-none" onClick={() => setSidebarOpen(false)}>
              <RiCloseLargeFill className="w-5 h-5 transition-colors duration-200" />
            </button>
          </div>

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

      { currentUser && ( <div className={`lg:col-span-full lg:col-start-1 md:col-start-5 lg:col-end-16 bg-gray-50 p-8 rounded-xl transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {activeTab === "general" && (
          <div>
            <h2 className="title">General Settings</h2>
            <div className="grid gap-y-7 md:grid-cols-1">
              
              <div className="bg-white p-6 rounded-lg">
                <h2 className="h6">Profile Picture</h2>
                <div className="flex flex-col md:flex-row items-center justify-between space-x-0 md:space-x-6">
                  <div className="relative flex flex-col items-center md:flex-row bg-white p-4 rounded-lg">
                    <div>
                      <img
                        src={profilePicUrl}
                        alt="Profile pic"
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
                      <h2 className="text-lg font-semibold">{currentUser.firstName} {currentUser.lastName}</h2>
                      <p className="text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 md:mt-0 space-x-4">
                    <UpdateProfilePictureModal />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">

                <div className="bg-white p-6 rounded-lg">

                  <h2 className="subTitle">User Information</h2>
                  <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-8 gap-x-4 gap-y-4">

                    <div className="col-span-full md:col-start-1 md:col-end-5 space-y-4">
                      <div className="groupBox">
                        <label className="label">First Name</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="input-box"
                        />
                      </div>
                    </div>

                    <div className="col-span-full md:col-start-5 md:col-end-9 space-y-4">
                      <div className="groupBox">
                        <label className="label">Last Name</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="input-box"
                        />
                      </div>
                    </div>

                    <div className="col-span-full space-y-4">
                      <div className="groupBox">
                        <label className="label" htmlFor="about">About</label>
                        <textarea
                          id="about"
                          name="about"
                          placeholder="Tell us something about yourself"
                          value={formData.about}
                          onChange={handleChange}
                          className="input-box h-[7.5rem] resize-none"
                        />
                      </div>
                    </div>

                    <div className="col-span-full w-full md:col-start-1 md:col-end-5 space-y-4">
                      <div className="groupBox">
                        <label className="label">Birth Day</label>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          placeholder="2001-05-15"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md bg-white py-2 pl-4  text-sm active:border-blue-500 active:border focus:border focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="groupBox">
                        <label className="label">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleChange}
                          className="input-box"
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-full md:col-start-5 md:col-end-9 space-y-4">
                    {[
                      { id: "email", name: "email", label: "Email Address", type: "email", placeholder: "someone@gmail.com", value: formData.email || "" },
                      { id: "interests", name: "interests", label: "Interests", type: "text", placeholder: "e.g. Reading, Coding", value: formData.interests.join(", ") || "" }
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

              {/* User Device Information Section */}
              {/* <div className="bg-white p-6 rounded-lg">
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
                              <img src={imageUrl} alt={device.deviceType} className="w-42 h-auto object-cover" />
                            </div>
                            <div>
                              <div className='flex py-1'><p className="text-sm">Device Type: </p><p className="text-sm pl-1"> {device.deviceType}</p></div>
                              <div className='flex py-1'><p className="text-sm">Browser: </p> <p className="text-sm pl-1"> {device.browser}</p></div>
                              <div className='flex py-1'><p className="text-sm">OS: </p><p className="text-sm pl-1"> {device.os}</p></div>
                              <div className='flex py-1'><p className="text-sm">Login Time: </p> <p className="text-sm pl-1"> {new Date(device.loggedInAt).toLocaleString()}</p></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div> */}

                {/* Account Deactivation/Deletion Section */}
                <div className="bg-white p-8 rounded-lg  space-y-8">
                  <h2 className="h6">Account Management</h2>

                  {/* Account Deletion Section */}
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h3 className="text-xl font-semibold mb-3 text-red-600 pb-7">Account Deletion</h3>
                    <div className="space-y-3">
                      <p className="text-gray-700 space-y-2" >Deleting your Omi account is a permanent action.</p>
                      <p className="text-gray-700">You're about to delete your Omi account, which grants you access to all our services. Once you proceed, you will lose access to your account, and all your data will be permanently deleted.</p>
                      <p className="text-gray-700 pb-10 mb-2">Additionally, if you've used your Omi account email for other services outside of Omi, you might lose access to them as well. For example, if your Omi email is linked as a recovery option for other accounts, you may face challenges in resetting passwords or managing those services. Before you continue, make sure to update your email details wherever you use it outside of Omi.</p>
                      <Button onClick={() => {setShowModal(true); }} variant="error" className="mt-4">Delete Account</Button>
                    </div>
                  </div>

                  {showModal && (
                    <Modal showModal={showModal} title={"Are you sure want tp delete your account?"} onConfirm={() => handleDeleteAccount()} onCancel={() => handleCloseModal()} />
                  )}


                 {/*  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-xl font-semibold mb-3 text-yellow-600">Account Deactivation</h3>
                    <p className="text-gray-700 mb-4">
                      Temporarily deactivate your account to hide your profile and information. Your data will be preserved, and you can reactivate it at any time by logging back in.
                    </p>
                    <Button variant="warning">Deactivate Account</Button>
                  </div> */}


                  {/* <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-semibold mb-3 text-blue-600">Download Your Data</h3>
                    <p className="text-gray-700 mb-4">
                      It's a good idea to download a copy of your account data before proceeding with deactivation or deletion. This file will include your profile, posts, and activity.
                    </p>
                    <Button variant="primary">Export Data</Button>
                  </div> */}


                  {/* <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-xl font-semibold mb-3 text-green-600">Account Recovery</h3>
                    <p className="text-gray-700 mb-4">
                      If you deactivate your account, you can easily recover it at any time by logging back in. All your data will be restored automatically.
                    </p>
                    <Button variant="info">Learn More</Button>
                  </div> */}
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
                <form className='' onSubmit={handleChangePasswordSubmit}>
                  <div className="flex flex-col space-y-6">
                    <div className="groupBox">
                      <label htmlFor="oldPassword" className="text-gray-700 font-medium">Current Password</label>
                      <input
                        type="password"
                        name="oldPassword"
                        id="oldPassword"
                        className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                        placeholder="Enter current password"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="groupBox">
                      <label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <div className="groupBox">
                      <label htmlFor="confirmNewPassword" className="text-gray-700 font-medium">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        className="input-box px-4 py-2 border rounded-lg focus:outline-none mb-5"
                        placeholder="Confirm new password"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                      <Button className="" type="submit" variant="info" >
                        Change Password
                      </Button>                
                  </div>
                </form>
              </div>

              {/* Additional Security Settings Section */}
              <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Additional Security Settings</h3>
                <form onSubmit={handleSecurityQuestionSubmit}>
                  <div className='flex flex-col space-y-6'>
                    <div className="groupBox">
                      <label htmlFor="securityQuestion" className="text-gray-700 font-medium">Security Question</label>
                      <input
                        name="securityQuestion"
                        id="securityQuestion"
                        onChange={handleSecurityQuestionChange}
                        value={securityQuestionData.securityQuestion}
                        className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                        placeholder="Enter your security question"
                      />
                    </div>
                    <div className="groupBox">
                      <label htmlFor="securityAnswer" className="text-gray-700 font-medium">Security Answer</label>
                      <textarea
                        name="securityAnswer"
                        id="securityAnswer"
                        onChange={handleSecurityQuestionChange}
                        value={securityQuestionData.securityAnswer}
                        className="input-box px-4 border rounded-lg pb-[1.35rem] focus:outline-none"
                        placeholder="Enter your answer"
                        rows="5"
                      />
                    </div>
                    <Button type='submit' variant="info">Save Security Settings</Button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Authentication Section */}

              {
              /* <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                <p className='pb-4'>Two Factor Authentication boosts security by requiring both your password and a code sent to your email, ensuring extra protection against unauthorized access</p>
                <form>
                  <div className='flex flex-col space-y-6'>
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
                        className="input-box px-4 py-2 border  rounded-lg focus:outline-none"
                        placeholder="Enter verification email"
                      />
                    </div>
                    {
                    /*
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
                    
                    <Button variant="info">Verify Email Address</Button>
                  </div>
                </form>
              </div> */}

              <TwoFactorAuthentication onEmailSubmit={handleEmailSubmit} onCodeSubmit={handleVerificationSubmit}/>

            </div>
          </div>
        )}
      </div>)}
    </div>
  );
}

export default Setting
