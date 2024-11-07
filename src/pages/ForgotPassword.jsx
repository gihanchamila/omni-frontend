import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../component/button/Button.jsx'
import axios from '../utils/axiosInstance.js'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle sending verification email with code
  const handleEmailSubmit = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/auth/forgot-password-code', { email })
      const data = response.data;
      toast.success(data.message)
      setStep("new-password")
      setLoading(false)
    } catch (error) {
      setLoading(false)
      const response = error.response;
      const data = response.data;
      toast.error(data.message);
    }
  }

  // Handle submitting the code and new password
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

  return (
    <div className='flex items-center justify-center min-h-[70vh]'>
      <div className='container border-2 border-slate-800 w-[25rem] px-12 py-12 my-4 mt-[3rem] rounded-2xl space-y-4'>
        <div className="body-1">
          <h1 className="text-3xl font-bold text-slate-800">Password Recovery</h1>
        </div>

        {/* Step 1: Email Address */}
        {step === 'email' && (
          <div className="groupBox space-y-4">
            <span className='text-gray-700 text-md'>Enter your email address to get a verification code for password reset.</span>
            <label htmlFor="verify-email" className="text-gray-700 font-medium">Enter Email Address</label>
            <input
              type="email"
              name="verify-email"
              id="verify-email"
              className="input-box px-4 py-2 pb-3 border rounded-lg focus:outline-none"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
            <Button
              type="submit"
              variant='info'
              className='mt-5'
              onClick={() => handleEmailSubmit(email)}
              disabled={loading || !email} // Disable if no email or while loading
            >
              {loading ? 'Sending...' : 'Send verification code'}
            </Button>
          </div>
        )}

        {/* Step 2: New Password & Code */}
        {step === 'new-password' && (
          <div className="groupBox space-y-4">
            <span className='text-gray-700 text-md'>Enter the verification code sent to your email, and choose a new password.</span>
            <label htmlFor="verify-code" className="text-gray-700 font-medium">Enter code</label>
            <input
              type="text"
              name="verify-code"
              id="verify-code"
              className="input-box px-4 py-2 pb-3 border rounded-lg focus:outline-none"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading} // Disable input while loading
              autoFocus // Automatically focus on this input when step changes
            />

            <label htmlFor="new-password" className="text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              name="new-password"
              id="new-password"
              className="input-box px-4 py-2 pb-3 border rounded-lg focus:outline-none"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
            <Button
              type="submit"
              variant='info'
              className='mt-5'
              onClick={() => handleSubmit(email, code, password)}
              disabled={loading || !code || password.length < 6} // Disable if code or password is invalid
            >
              {loading ? 'Changing password...' : 'Change password'}
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword
