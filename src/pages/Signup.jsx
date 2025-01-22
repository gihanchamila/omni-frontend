import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../utils/axiosInstance.js";
import Button from '../component/button/Button.jsx';
import signUpValidator from '../validators/signUpValidator.js';
import { HiOutlineMail, HiLockClosed, HiOutlineUserCircle } from "react-icons/hi";
import { toast } from 'sonner';
import UserIcon from '../component/icons/UserIcon.jsx';
import { useSocket } from '../component/context/useSocket.jsx';
import { motion } from 'framer-motion';

const initialFormData = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };
const initialFormError = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

const Signup = () => {
  const [isFirstNameTyping, setIsFirstNameTyping] = useState(false);
  const [isLastNameTyping, setIsLastNameTyping] = useState(false);
  const [isEmailTyping, setIsEmailTyping] = useState(false);
  const [isConfirmEmailTyping, setIsConfirmEmailTyping] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);
  const [isConfirmPasswordTyping, setIsConfirmPasswordTyping] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const socket = useSocket()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'firstName') {
      setIsFirstNameTyping(value !== '');
    } else if (name === 'lastName') {
      setIsLastNameTyping(value !== '');
    } else if (name === 'email') {
      setIsEmailTyping(value !== '');
    } else if (name === 'confirmEmail') {
      setIsConfirmEmailTyping(value !== '');
    } else if (name === 'password') {
      setIsPasswordTyping(value !== '');
    } else if (name === 'confirmPassword') {
      setIsConfirmPasswordTyping(value !== '');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('User-registered', (data) => {
      });
    }
    return () => {
      if (socket) {
        socket.off('User-registered');
      }
    };
  }, [socket]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = signUpValidator({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      confirmEmail: formData.confirmEmail,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    if (errors.firstName || errors.lastName || errors.email || errors.confirmEmail || errors.password || errors.confirmPassword) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        // API request
        const requestBody = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          confirmEmail: formData.confirmEmail,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

        const response = await axios.post('/auth/signup', requestBody);
        const data = response.data;
        toast.success(data.message);

        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate('/login');
        if (socket) {
          socket.emit('User-registered', { id: data.newUser._id });
        } else {
          console.error('Socket is undefined');
        }
      } catch (error) {
        setLoading(false);
        setFormError(initialFormError);
        const response = error.response;
        if (response) {
          const data = response.data;
          toast.error(data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <motion.div 
      className='lg:flex lg:items-center lg:justify-center sm:block' 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className='border-2 border-slate-800 lg:w-[38rem] sm:m-5 sm:w-6/6 bg-white px-12 py-12 mt-[3rem] mb-[5rem] rounded-2xl'
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
              <label htmlFor="firstName" className="label">First Name</label>
              <div className='relative input-wrapper'>
                <HiOutlineUserCircle className={`input-icon ${isFirstNameTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none input-box-2"
                />
              </div>
              {formError.firstName && <p className="validateError">{formError.firstName}</p>}
            </div>
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="lastName" className="label">Last Name</label>
              <div className='relative input-wrapper'>
                <HiOutlineUserCircle className={`input-icon ${isLastNameTyping ? 'text-blue-500' : 'text-gray-300'}`}/>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none input-box-2"
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
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none input-box-2"
                  autoComplete='email'
                />
              </div>
              {formError.email && <p className="validateError">{formError.email}</p>}
            </div>
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="confirmEmail" className="label">Confirm Email</label>
              <div className='relative input-wrapper'>
                <HiOutlineMail className={`input-icon ${isConfirmEmailTyping ? 'text-blue-500' : 'text-gray-300'}`} />
                <input
                  id="confirmEmail"
                  name="confirmEmail"
                  type="email"
                  placeholder="Re-enter your email"
                  required
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className="appearance-none input-box-2"
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
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none input-box-2"
                  autoComplete='new-password'
                />
              </div>
              {formError.password && <p className="validateError">{formError.password}</p>}
            </div>
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className='relative input-wrapper'>
                <HiLockClosed className={`input-icon ${isConfirmPasswordTyping ? 'text-blue-500' : 'text-gray-300'}`} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none input-box-2"
                  autoComplete='current-password'
                />
              </div>
              {formError.confirmPassword && <p className="validateError">{formError.confirmPassword}</p>}
            </div>
          </motion.div>

          {/* Sign Up button */}
          <motion.div 
            className="flex flex-col-reverse items-center justify-between lg:w-full lg:flex-row md:flex-row sm:w-full mt-6 space-y-4 lg:space-y-0 sm:space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex-grow sm:text-center lg:text-left">
              <span className='font-base text-sm text-color-s'>
                Already have an account? <Link className='hover:underline text-blue-500' to="/login">Sign In</Link>
              </span>
            </div>
            <Button className="w-full sm:w-auto" variant='info' primary={false} disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Signup;
