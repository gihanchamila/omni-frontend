import { useState, useContext } from "react"
import axios from "../utils/axiosInstance.js"
import Button from '../component/button/Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { ProfileContext } from "../component/context/ProfileContext.jsx"
import { HiOutlineMail, HiLockClosed } from "react-icons/hi";

import { toast } from 'sonner'

import { useProfile } from "../component/context/useProfilePic.jsx"
import { useSocket } from "../hooks/useSocket.jsx"

import loginValidator from "../validators/LoginValidator.js"

const initialFormData = {email : "", password : ""}
const initialFormError = {email : "", password : ""}

const Login = () => {
  
  const socket = useSocket()
  const [isEmailTyping, setIsEmailTyping] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState(initialFormError)
  const [deviceType, setDeviceType] = useState('');
  const [loading, setLoading] = useState(false)
  const { profilePicUrl, setProfilePicUrl } = useProfile()
  const { getCurrentUser } = useContext(ProfileContext);


  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name] : value}))
    
    if (name === 'email') {
      setIsEmailTyping(value !== '');
    } else if (name === 'password') {
      setIsPasswordTyping(value!== '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = loginValidator({
      email: formData.email,
      password: formData.password,
    });
  
    if (errors.email || errors.password) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
  
        const userAgent = navigator.userAgent;
        const deviceType = getDeviceType(userAgent);
        const browser = getBrowserName(userAgent);
        const os = getOS(userAgent);
  
        const requestBody = {
          email: formData.email,
          password: formData.password,
          deviceType: deviceType || "Unknown Device",
          browser: browser || "Unknown Browser",
          os: os || "Unknown OS",
        };
  
        const response = await axios.post('/auth/signin', requestBody);
        const data = response.data;
        setDeviceType(data.data.deviceType);

        if(data.data.user.profilePic?.key){
          const profilePicKey = data.data.user.profilePic.key;
          window.localStorage.setItem('profilePicKey', profilePicKey);
          setProfilePicUrl(profilePicKey);
        }
        
        window.localStorage.setItem("blogData", JSON.stringify(data.data));
        toast.success(data.message);
  
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);


        navigate('/');
      } catch (error) {
        console.error("Error occurred:", error);
        setLoading(false);
        setFormError(initialFormError);
  
        let errorMessage = "An error occurred. Please try again.";
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        } else {
          errorMessage = "Network error. Please check your connection and try again.";
        }
  
        toast.error(errorMessage);
      }
    }
  };

  const getBrowserName = (userAgent) => {
    if (userAgent.includes("Chrome")) {
      return "Google Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Edge")) {
      return "Microsoft Edge";
    } else {
      return "Unknown Browser";
    }
  };

  const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent)) {
      return 'Mobile';
    } else if (/tablet/i.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Laptop'; // Assuming all other cases are laptops
    }
  };

  const getOS = (userAgent) => {
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("X11")) return "UNIX";
    if (userAgent.includes("Linux")) return "Linux";
    if (/android/i.test(userAgent)) return "Android";
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
    return "Unknown OS";
};

  return (
    <div className='container border-2 border-slate-800 w-[25rem] px-12 py-12 my-4 mt-[3rem] rounded-2xl'>
      <div className="body-1">
          <h1 className="text-4xl font-bold text-slate-800 pb-5">Welcome Back</h1>
      </div>

      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <div className="groupBox">
          <label htmlFor="email" className="label">Email address</label>
          <div className="relative input-wrapper">
            <HiOutlineMail className={`input-icon ${isEmailTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="someone@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none input-box-2"
            />
          </div>
        </div>
        <div className="groupBox">
          <label htmlFor="email" className="label">
            Password
          </label>
          <div className="relative input-wrapper">
          <HiLockClosed className={`input-icon ${isPasswordTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none input-box-2"
              autoComplete="new-password"
            />
          </div>
          
        </div>
        <div className='flex items-center justify-between'>
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 text-primary border-color-s accent-color-s border-2 checked:bg-color-s rounded focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-color-s ">
              Remember Me
            </label>
          </div>

          <div className="text-sm">
            <Link className="font-base text-sm text-blue-500 hover:underline" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

        </div>
        <Button variant="info" className={`w-full py-2.5`} disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
        <div>
          <span className='font-base text-sm text-color-s center'>Don't have an account? <Link className='hover:underline text-blue-500' to="/signup">Sign up</Link></span>
        </div>
      </form>
    </div>
  )
}

export default Login