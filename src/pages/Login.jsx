import { useState, useRef, useEffect } from "react"
import axios from "../utils/axiosInstance.js"
import Button from '../component/button/Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiLockClosed, HiEye, HiEyeOff  } from "react-icons/hi";
import { toast } from 'sonner'
import { useProfile } from "../component/context/useProfilePic.jsx"
import { motion } from "framer-motion";

import loginValidator from "../validators/LoginValidator.js"

const initialFormData = {email : "", password : ""}
const initialFormError = {email : "", password : ""}

const Login = () => {
  
  const [isEmailTyping, setIsEmailTyping] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState(initialFormError)
  const [deviceType, setDeviceType] = useState('');
  const [loading, setLoading] = useState(false)
  const {fetchProfilePic, getCurrentUser} = useProfile()

  const navigate = useNavigate()
  const inputRef = useRef(null)
  const passwordRef = useRef(null)
  const password = formData.password

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus()
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name] : value}))
    
    if (name === 'email') {
      setIsEmailTyping(value !== '');
    } else if (name === 'password') {
      setIsPasswordTyping(value!== '');
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef && nextRef.current) {
      e.preventDefault(); 
      nextRef.current.focus();
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
        getCurrentUser()

        if(data.data.user.profilePic?.key){
          const profilePicKey = data.data.user.profilePic.key;
          window.localStorage.setItem('profilePicKey', profilePicKey);
          fetchProfilePic(profilePicKey);
        }
        window.localStorage.setItem("blogData", JSON.stringify(data.data));
        // toast.success(data.message);
  
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
  
        // toast.error(errorMessage);
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
    <motion.div
      className='container lg:border-2 lg:bg-white sm:bg-gray-50 sm:rounded-2xl sm:px-8  sm:py-12 lg:border-slate-800 lg:w-[25rem] sm:w-auto lg:px-12 lg:py-12 my-4 mt-[3rem] rounded-2xl'
      initial={{ opacity: 0, scale : 0.8 }} 
      animate={{ opacity: 1, scale : 1 }} 
      transition={{ duration: 0.6 }}
    >
      <div className="body-1">
          <h1 className="text-4xl font-bold text-slate-800 pb-5">Welcome Back</h1>
      </div>

      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <motion.div
          className="groupBox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{delay : 0.4, duration: 0.6 }}
        >
          <label htmlFor="email" className="label">Email address</label>
          <div className="relative input-wrapper">
            <HiOutlineMail className={`input-icon ${isEmailTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
            <input
              ref={inputRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="someone@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="appearance-none input-box-2"
              onKeyDown={(e) => {handleKeyDown(e, passwordRef)}}
            />
          </div>
          {formError.email && <p className="validateError">{formError.email}</p>}
        </motion.div>

        <motion.div
          className="groupBox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{delay : 0.6, duration: 0.6 }}
        >
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative input-wrapper">
            <HiLockClosed className={`input-icon ${isPasswordTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type={isPasswordVisible ? 'text' : 'password'} 
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              className="appearance-none input-box-2"
              autoComplete="new-password"
              onKeyDown={(e) => {handleKeyDown(e, null, formData.password)}}
              onFocus={() => setPasswordTouched(true)}
              onBlur={() => setPasswordTouched(false)}
            />

            {password.length > 1 && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle password visibility
                >
                {isPasswordVisible ? <HiEyeOff className="text-gray-500" /> : <HiEye className="text-gray-500" />}
              </div>
            )}
          </div>
          {formError.password && <p className="validateError">{formError.password}</p>}
        </motion.div>

        <div className='flex items-center justify-between'>
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{delay : 0.8, duration: 0.6 }}>
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 text-primary border-color-s accent-color-s border-2 checked:bg-color-s rounded focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-color-s ">
              Remember Me
            </label>
          </motion.div >

          <motion.div
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{delay : 0.8, duration: 0.6 }}
          >
            <Link className="font-base text-sm text-blue-500 hover:underline" to="/forgot-password">
              Forgot Password?
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{delay : 0.8, duration: 0.6 }}
        >
          <Button variant="info" className={`w-full py-2.5`} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </motion.div>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{delay : 1, duration: 0.6 }}>
          <span className='font-base text-sm text-color-s center'>
            Don't have an account? <Link className='hover:underline text-blue-500' to="/signup">Sign up</Link>
          </span>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default Login
