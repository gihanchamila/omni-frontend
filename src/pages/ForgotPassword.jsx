import React, { useState } from 'react'
import Button from '../component/button/Button.jsx'

const ForgotPassword = () => {

  const [email, setEmail] = useState("")

  return (
    <div className='flex items-center justify-center min-h-[70vh]'>
      
      <div className='container border-2 border-slate-800 w-[25rem] px-12 py-12 my-4 mt-[3rem] rounded-2xl space-y-4'>
        <div className="body-1">
            <h1 className="text-4xl font-bold text-slate-800 pb-5">Password Reset</h1>
        </div>
        <div className="groupBox space-y-4">
          <span className='text-gray-700 text-md'>Enter your account email address to reset your password</span>
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
          />
          <Button type="submit" variant='info' className='mt-5'>
          Send verification code
          </Button>
        </div>
      </div>
    </div>
    
  )
}

export default ForgotPassword