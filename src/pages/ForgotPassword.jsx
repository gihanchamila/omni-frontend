import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../component/button/Button.jsx'
import axios from '../utils/axiosInstance.js'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { HiEye, HiEyeOff } from "react-icons/hi";
import BackButton from '../component/button/BackButton.jsx'

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef(null);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[\W_]/.test(password);
  const hasMinLength = password.length >= 8;
  const strengthScore = hasLowercase + hasUppercase + hasNumber + hasSymbol + hasMinLength;

  const MotionButton = motion(Button);

  const handleEmailSubmit = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/auth/forgot-password-code', { email })
      const data = response.data;
      console.log(response)
      toast.success(data.message)
      setStep("new-password")
      setLoading(false)
    } catch (error) {
      setLoading(false)
      const response = error.response;
      const data = response.data;
      console.log(response)
      toast.error(data.message);
    }
  }

  const handleSubmit = async (email, code, password) => {
    if (!code || !password || password.length < 6) {
      toast.error("Please enter a valid code and password (at least 6 characters).")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/auth/recover-password', { email, code, password })
      const data = response.data;
      toast.success(data.message)
      navigate('/login')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  }

  const getPasswordStrength = () => {
    if (strengthScore === 5) return { label: "Strong", color: "text-green-500" };
    if (strengthScore === 4) return { label: "Very Good", color: "text-blue-500" };
    if (strengthScore === 3) return { label: "Good", color: "text-yellow-500" };
    return { label: "Weak", color: "text-red-500" };
  };

  const { label, color } = getPasswordStrength();

  return (
    <motion.div className='flex items-center justify-center min-h-[70vh]'>
      <motion.div 
      className='container lg:bg-white sm:bg-gray-50 lg:border-2 lg:border-slate-800 sm:border-hidden w-[25rem] px-12 py-12 my-4 mt-[3rem] rounded-2xl space-y-4'
      initial={{ opacity: 0, scale : 0.8 }}
      animate={{ opacity: 1, scale : 1 }}
      transition={{ duration: 0.6 }}
      >
        <motion.div 
        className="body-1"
        initial={{ opacity: 0 }}
        animate={{opacity : 1}}
        transition={{delay : 0.2, duration: 0.6}}
        >
          <BackButton />
          <h1 className="text-3xl font-bold text-slate-800">Password Recovery</h1>
        </motion.div >

        {/* Step 1: Email Address */}
        {step === 'email' && (
          <motion.div 
          className="groupBox space-y-4"
          initial={{opacity : 0}}
          animate={{opacity : 1}}
          transition={{delay :0.6, duration : 0.6}}
          >
            <motion.span 
              className='text-gray-700 text-md'
              initial={{opacity : 0}}
              animate={{opacity : 1}}
              transition={{delay :0.5, duration : 0.6}}
            >Enter your email address to get a verification code for password reset.</motion.span>
            <motion.label 
              initial={{opacity : 0}}
              animate={{opacity : 1}}
              transition={{delay :0.7, duration : 0.6}}
              htmlFor="verify-email" 
              className="text-gray-700 font-medium">Enter Email Address</motion.label>
            <motion.input
              initial={{opacity : 0}}
              animate={{opacity : 1}}
              transition={{delay :0.7, duration : 0.6}}
              type="email"
              name="verify-email"
              id="verify-email"
              className="input-box px-4 py-2 pb-3 border rounded-lg focus:outline-none"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // Disable input while loading
            />
            <MotionButton
              type="submit"
              variant='info'
              className='mt-5'
              onClick={() => handleEmailSubmit(email)}
              disabled={loading || !email} // Disable if no email or while loading
            >
              {loading ? 'Sending...' : 'Send verification code'}
            </MotionButton>
          </motion.div>
        )}

        {step === 'new-password' && (
          <div className="groupBox space-y-4">
            <span className='text-gray-700 text-md'>Enter the verification code sent to your email, and choose a new password.</span>
            <fieldset className='flex flex-col space-y-4'>
              <label htmlFor="verify-code" className="text-gray-700 font-medium">Enter code</label>
              <input
                type="text"
                name="verify-code"
                id="verify-code"
                className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                autoFocus
                maxLength={6}
                
              />
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={isPasswordVisible ? 'text' : 'password'} 
                  name="new-password"
                  id="new-password"
                  className="input-box w-full px-4  border rounded-lg focus:outline-none"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordTouched(true)}
                  onBlur={() => setPasswordTouched(false)}
                  disabled={loading}
                />
                {password.length > 1 && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <HiEyeOff className="text-gray-500" /> : <HiEye className="text-gray-500" />}
                  </div>
                )}
              </div>
                <div className='flex'>
                  {passwordTouched && password.length > 0 && (
                    <p className={`text-xs font-light  ${color}`}>
                      Password Strength: {label}
                    </p>
                  )}
                </div>
            </fieldset>
            
            
            <MotionButton
              type="submit"
              variant='info'
              className='mt-5'
              onClick={() => handleSubmit(email, code, password)}
              disabled={loading || !code || password.length < 6} 
            >
              {loading ? 'Changing password...' : 'Change password'}
            </MotionButton>
          </div>
        )}

      </motion.div>
    </motion.div>
  )
}

export default ForgotPassword
