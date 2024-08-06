import React from 'react'
import { toast } from 'sonner'

import Button from '../component/button/Button.jsx'

const Login = () => {
  return (
    <div className='container border-2 border-color-s w-[25rem] bg-white p-10 my-4 mt-[5rem] rounded-lg'>
      <div className="body-1">
          <h1 className="text-4xl font-bold text-color-s">Welcome Back</h1>
      </div>
      <form action="" className="space-y-4 py-5">
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none input-box"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="label">
            Password
          </label>
          <input
            id="email"
            name="Password"
            type="password"
            autoComplete="password"
            required
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
            <a className="font-base text-sm text-color-s hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
        <Button className="w-full"> Sign In</Button>
      </form>
    </div>
  )
}

export default Login