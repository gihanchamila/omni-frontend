import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../utils/axiosInstance.js";
import Button from '../component/button/Button.jsx';
import signUpValidator from '../validators/signUpValidator.js'
import { HiOutlineMail, HiLockClosed, HiOutlineUserCircle,  HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from 'sonner';
import UserIcon from '../component/icons/UserIcon.jsx';
import { useSocket } from '../component/context/useSocket.jsx';
import { motion } from 'framer-motion';

const initialFormData = { firstName: "", lastName: "", email: "", confirmEmail : "", password: "", confirmPassword: "" };
const initialFormError = { firstName: "", lastName: "", email: "", confirmEmail : "", password: "", confirmPassword: "" };

const Signup = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setconfirmPasswordTouched] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const [isFirstNameTyping, setIsFirstNameTyping] = useState(false);
  const [isLastNameTyping, setIsLastNameTyping] = useState(false);
  const [isEmailTyping, setIsEmailTyping] = useState(false);
  const [isConfirmEmailTyping, setIsConfirmEmailTyping] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);
  const [isConfirmPasswordTyping, setIsConfirmPasswordTyping] = useState(false);

  const navigate = useNavigate();
  const socket = useSocket();

  const inputRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const confirmEmailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const signUpRef = useRef(null);
  
  const password = formData.password;
  const confirmPassword = formData.confirmPassword
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[\W_]/.test(password);
  const hasMinLength = password.length >= 8;
  const strengthScore = hasLowercase + hasUppercase + hasNumber + hasSymbol + hasMinLength;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('User-registered', (data) => {});
    }
    return () => {
      if (socket) {
        socket.off('User-registered');
      }
    };
  }, [socket]);

  const handleKeyDown = (e, nextInputRef, value) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      if (value.trim() !== "" && nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({...prev, [name] : ""}))

    if (name === 'firstName') setIsFirstNameTyping(value !== '');
    if (name === 'lastName') setIsLastNameTyping(value !== '');
    if (name === 'email') setIsEmailTyping(value !== '');
    if (name === 'confirmEmail') setIsConfirmEmailTyping(value !== '');
    if (name === 'password') setIsPasswordTyping(value !== '');
    if (name === 'confirmPassword') setIsConfirmPasswordTyping(value !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hel")
    const errors = signUpValidator(
      { 
        firstName :formData.firstName,
        lastName : formData.lastName,
        email: formData.email, 
        confirmEmail : formData.confirmEmail,
        password: formData.password, 
        confirmPassword: formData.confirmPassword
      }
    )

    console.log(formData)

    if(errors.firstName || errors.lastName || errors.email || errors.password || errors.confirmPassword){
      setFormError(errors);
      return
    }
    try {
      setLoading(true);
      const response = await axios.post('/auth/signup', formData);
      toast.success(response.data.message);
      setFormData(initialFormData);
      setFormError(initialFormError);
      setLoading(false);
      navigate('/login');
  
      if (socket) {
        socket.emit('User-registered', { id: response.data.newUser._id });
      }
    } catch (error) {
      setLoading(false);
      setFormError(initialFormError);
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };
  

  const getPasswordStrength = () => {
    if (strengthScore === 5) return { label: "Strong", color: "text-green-500" };
    if (strengthScore === 4) return { label: "Very Good", color: "text-blue-500" };
    if (strengthScore === 3) return { label: "Good", color: "text-yellow-500" };
    return { label: "Weak", color: "text-red-500" };
  };

  const { label, color } = getPasswordStrength();

  return (
    <div className='sm:h-[90.6vh] dark:sm:h-[100vh]'>
          <motion.div 
            className='lg:flex lg:items-center lg:justify-center sm:block lg:bg-white dark:bg-slate-900  sm:bg-gray-50 sm:rounded-2xl' 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className='md:border-2 md:border-slate-800 dark:bg-white lg:w-[38rem]  lg:px-12 lg:py-12 sm:px-8  sm:py-12 mt-[3rem] mb-[5rem] rounded-2xl sm:flex sm:flex-col '
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="body-1">
                <h1 className="text-4xl font-bold text-slate-800 pb-5">Welcome</h1>
              </div>

              {/* Sign up form */}
              <form onSubmit={handleSubmit}>
                {/* Name fields */}
                <motion.div 
                  className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="groupBox lg:w-[35rem]">
                    <label htmlFor="firstName" className="label" >First Name</label>
                    <div className='relative input-wrapper'>
                      <HiOutlineUserCircle className={`input-icon ${isFirstNameTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
                      <input
                        ref={inputRef}
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="e.g.John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="appearance-none input-box-2"
                        onKeyDown={(e) => {handleKeyDown(e, lastNameRef, formData.firstName)}}
                      />
                    </div>
                    {formError.firstName && <p className="validateError">{formError.firstName}</p>}
                  </div>
                  <div className="groupBox lg:w-[35rem]">
                    <label htmlFor="lastName" className="label">Last Name</label>
                    <div className='relative input-wrapper'>
                      <HiOutlineUserCircle className={`input-icon ${isLastNameTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
                      <input
                        ref={lastNameRef}
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="e.g.Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="appearance-none input-box-2"
                        onKeyDown={(e) => {handleKeyDown(e, emailRef, formData.lastName)}}
                      />
                    </div>
                    {formError.lastName && <p className="validateError">{formError.lastName}</p>}
                  </div>
                </motion.div>

                {/* Email and Confirm Email fields */}
                <motion.div 
                  className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="groupBox lg:w-[35rem]">
                    <label htmlFor="email" className="label">Email</label>
                    <div className='relative input-wrapper'>
                      <HiOutlineMail className={`input-icon ${isEmailTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
                      <input
                        ref={emailRef}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. johndoe@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="appearance-none input-box-2"
                        autoComplete='email'
                        onKeyDown={(e) => {handleKeyDown(e, confirmEmailRef, formData.email)}}
                      />
                    </div>
                    {formError.email && <p className="validateError">{formError.email}</p>}
                  </div>
                  <div className="groupBox lg:w-[35rem]">
                    <label htmlFor="confirmEmail" className="label">Confirm Email</label>
                    <div className='relative input-wrapper'>
                      <HiOutlineMail className={`input-icon ${isConfirmEmailTyping ? 'text-blue-500' : 'text-gray-300'}`} />
                      <input
                        ref={confirmEmailRef}
                        id="confirmEmail"
                        name="confirmEmail"
                        type="email"
                        placeholder="e.g. johndoe@gmail.com"
                        value={formData.confirmEmail}
                        onChange={handleChange}
                        className="appearance-none input-box-2"
                        onKeyDown={(e) => {handleKeyDown(e, passwordRef, formData.confirmEmail)}}
                      />
                    </div>
                    {formError.confirmEmail && <p className="validateError">{formError.confirmEmail}</p>}
                  </div>
                </motion.div>

                {/* Password and Confirm Password fields */}
                <motion.div 
                  className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="groupBox lg:w-[35rem]">
                    <label htmlFor="password" className="label">Password</label>
                    <div className='relative input-wrapper'>
                      <HiLockClosed className={`input-icon ${isPasswordTyping ? 'text-blue-500' : 'text-gray-300'}`} />
                      <input
                        ref={passwordRef}
                        id="password"
                        name="password"
                        type={isPasswordVisible ? 'text' : 'password'} 
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none input-box-2"
                        autoComplete='new-password'
                        onKeyDown={(e) => {handleKeyDown(e, confirmPasswordRef, formData.password)}}
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
                    {passwordTouched && password.length > 0 && (
                      <p className={`text-xs font-light ${color}`}>
                        Password Strength: {label}
                      </p>
                    )}
                    {formError.password && <p className="validateError">{formError.password}</p>}
                  </div>
                  <div className="groupBox lg:w-[35rem]">
                    <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                    <div className='relative input-wrapper'>
                      <HiLockClosed className={`input-icon ${isConfirmPasswordTyping ? 'text-blue-500' : 'text-gray-300'}`} />
                      <input
                        ref={confirmPasswordRef}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={isConfirmPasswordVisible ? 'text' : 'password'} 
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none input-box-2"
                        autoComplete='current-password'
                        onKeyDown={(e) => {handleKeyDown(e, signUpRef, formData.confirmPassword)}}
                        onFocus={() => setconfirmPasswordTouched(true)}
                        onBlur={() => setconfirmPasswordTouched(false)}
                      />
                      {confirmPassword.length > 1 && (
                        <div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                          >
                          {isConfirmPasswordVisible ? <HiEyeOff className="text-gray-500" /> : <HiEye className="text-gray-500" />}
                        </div>
                      )}
                    </div>
                    {formError.confirmPassword && <p className="validateError">{formError.confirmPassword}</p>}
                  </div>
                </motion.div>

                {/* Sign Up button */}
                <motion.div 
                  className="flex flex-col-reverse items-center justify-between lg:w-full lg:flex-row md:flex-row sm:w-full mt-6 space-y-4 lg:space-y-0 "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="flex-grow lg:block sm:mt-5 lg:mt-0  sm:flex sm:flex-col sm:space-y-4 sm:text-center lg:text-left">
                    <span className='font-base text-sm text-color-s'>
                      Already have an account? <Link className='hover:underline text-blue-500' to="/login">Sign In</Link>
                    </span>
                  </div>
                  <Button ref={signUpRef} type="submit" className=" lg:w-[5rem] sm:w-full" variant='info' primary={false}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
    </div>
    
  );
}

export default Signup;
