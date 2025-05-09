import { useState, useRef, useEffect } from "react"
import axios from "../utils/axiosInstance.js"
import Button from '../component/button/Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiLockClosed, HiEye, HiEyeOff  } from "react-icons/hi";
import { useProfile } from "../component/context/useProfilePic.jsx"
import { motion } from "framer-motion";
import { toastError, toastSuccess } from "../utils/toastMessages.js";

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
  
        const requestBody = {
          email: formData.email,
          password: formData.password,
        };
  
        const response = await axios.post('/auth/signin', requestBody);
        const data = response.data;
        getCurrentUser()

        if(data.data.user.profilePic?.key){
          const profilePicKey = data.data.user.profilePic.key;
          window.localStorage.setItem('profilePicKey', profilePicKey);
          fetchProfilePic(profilePicKey);
        }
        window.localStorage.setItem("blogData", JSON.stringify(data.data));
        
        toastSuccess(data);
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate('/');
      } catch (error) {
        setLoading(false);
        toastError(error);
      }
    }
  };


  return (
    <div className="xs:flex xs:justify-center xs:items-center sm:h-[93vh] xs:h-[90vh] lg:h-screen ">
      <motion.div
        className='lg:border-2 lg:bg-white sm:mb-10 xs:bg-gray-50 sm:rounded-2xl sm:px-8 sm:py-12 xs:px-6 xs:py-8   lg:border-slate-800 lg:w-[25rem] sm:w-[25rem] xs:w-full lg:px-12 lg:py-12 rounded-2xl'
        initial={{ opacity: 0, scale : 0.8 }} 
        animate={{ opacity: 1, scale : 1 }} 
        transition={{ duration: 0.6 }}
      >
        <div className="body-1">
            <h1 className="sm:text-4xl font-bold text-slate-800 pb-5 xs:text-2xl">Welcome Back</h1>
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
              <label htmlFor="remember-me" className="ml-2 sm:text-sm text-color-s xs:text-xs">
                Remember Me
              </label>
            </motion.div >

            <motion.div
              className="text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{delay : 0.8, duration: 0.6 }}
            >
              <Link className="font-base sm:text-sm text-blue-500 hover:underline xs:text-xs" to="/forgot-password">
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
            <span className='font-base sm:text-sm text-color-s center xs:text-xs'>
              Don't have an account? <Link className='hover:underline text-blue-500' to="/signup">Sign up</Link>
            </span>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
