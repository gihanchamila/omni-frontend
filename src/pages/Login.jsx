import { useState } from "react"
import axios from "../utils/axiosInstance.js"
import { Link, useNavigate } from 'react-router-dom'

import { toast } from 'sonner'
import Button from '../component/button/Button.jsx'

import loginValidator from "../validators/LoginValidator.js"

const initialFormData = {email : "", password : ""}
const initialFormError = {email : "", password : ""}

const Login = () => {

  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState(initialFormError)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name] : e.target.value}))
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = loginValidator(
      {
        email : formData.email,
        password : formData.password
      }
    )

    if(errors.email || errors.password){
      setFormError(errors)
    }else{
      try{
        setLoading(true)

        {/* api request */}

        const requestbody = {
          name : formData.name,
          email : formData.email,
          password : formData.password
        }

        const response = await axios.post('/auth/signin', requestbody)
        const data = response.data

        window.localStorage.setItem("blogData", JSON.stringify(data.data))
        toast.success(data.message)

        setFormData(initialFormData)
        setFormError(initialFormError)
        setLoading(false)
        navigate('/')

      }catch(error){
        setLoading(false)
        setFormError(initialFormError)
        const response = error.response
        const data = response.data
        toast.error(data.message)
      }
    }
  }

  return (
    <div className='container border-2 border-slate-800 w-[25rem] bg-white px-12 py-12 my-4 mt-[5rem] rounded-2xl'>
      <div className="body-1">
          <h1 className="text-4xl font-bold text-slate-800 pb-5">Welcome Back</h1>
      </div>

      {/* Login form */}

      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <div className="groupBox">
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="someone@gmail.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none input-box"
          />
        </div>
        <div className="groupBox">
          <label htmlFor="email" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none input-box"
          />
        </div>
        <div className='flex items-center justify-between'>

            {/* Remember Me */}

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

          {/* Forgot Password */}

          <div className="text-sm">
            <Link className="font-base text-sm text-color-s hover:underline">
              Forgot Password?
            </Link>
          </div>

        </div>
        <Button variant="info" className={`w-full`} disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
        <div>
          <span className='font-base text-sm text-color-s center'>Don't have an account? <Link className='hover:underline text-blue-500' to="/signup">Sign up</Link></span>
        </div>
      </form>
    </div>
  )
}

export default Login