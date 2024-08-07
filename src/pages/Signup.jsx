import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "../utils/axiosInstance.js"

import Button from '../component/button/Button.jsx'

import signUpValidator from '../validators/signUpValidator.js'

import { toast } from 'sonner'

const initialFormData = {name : "", email : "", password : "", confirmPassword : ""}
const initialFormError = {name : "", email : "", password : "", confirmPassword : ""}

const Signup = () => {

  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState(initialFormError)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name] : e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = signUpValidator({
      name : formData.name,
      email : formData.email,
      password : formData.password,
      confirmPassword : formData.confirmPassword
    })

    if(errors.name || errors.email || errors.password || errors.confirmPassword){
      setFormError(errors)
    }

    
  }

  return (
    <div className='container border-2 border-slate-800 w-[25rem] bg-white px-12 py-12 my-4  rounded-2xl'>
      <div className="body-1">
          <h1 className="text-4xl font-bold text-slate-800 pb-5">Welcome</h1>
      </div>

      {/* Login form */}

      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="name"
            autoComplete="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
            className="appearance-none input-box"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="label">
            email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="someone@gmail.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none input-box"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none input-box"
          />
        </div>
        <Button className="w-full bg-color-p" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</Button>
        <div>
          <span className='font-base text-sm text-color-s center'>Already have an account? <Link className='hover:underline' to="/login">Sign In</Link></span>
        </div>
      </form>
    </div>
  )
}

export default Signup