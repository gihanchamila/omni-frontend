import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../utils/axiosInstance.js";
import Button from '../component/button/Button.jsx';
import signUpValidator from '../validators/signUpValidator.js';
import { toast } from 'sonner';

const initialFormData = { name: "", email: "", password: "", confirmPassword: "" };
const initialFormError = { name: "", email: "", password: "", confirmPassword: "" };

const Signup = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = signUpValidator({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    if (errors.name || errors.email || errors.password || errors.confirmPassword) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        // API request
        const requestBody = {
          name: formData.name,
          email: formData.email,
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
    <div className='container border-2 border-slate-800 lg:w-1/2 sm:w-5/6 bg-white px-12 py-12 my-4 mt-[5rem] rounded-2xl'>
      <div className="body-1">
        <h1 className="text-4xl font-bold text-slate-800 pb-5">Welcome</h1>
      </div>

      {/* Sign up form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name and Email in one row on larger screens, stacked on smaller screens */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex flex-col w-full md:w-1/2 space-y-1">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
              className="appearance-none input-box"
            />
            {formError.name && <p className="validateError">{formError.name}</p>}
          </div>
          <div className="flex flex-col w-full md:w-1/2 space-y-1 mt-4 md:mt-0">
            <label htmlFor="email" className="label">
              Email
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
            {formError.email && <p className="validateError">{formError.email}</p>}
          </div>
        </div>
        
        {/* Password and Confirm Password in one row on larger screens, stacked on smaller screens */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex flex-col w-full md:w-1/2 space-y-1">
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
            {formError.password && <p className="validateError">{formError.password}</p>}
          </div>
          <div className="flex flex-col w-full md:w-1/2 space-y-1 mt-4 md:mt-0">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none input-box"
            />
            {formError.confirmPassword && <p className="validateError">{formError.confirmPassword}</p>}
          </div>
        </div>

        {/* Align Sign Up button to the right and "Already have an account?" to the left */}
        <div className="flex justify-between items-center mt-6">
          <div>
            <span className='font-base text-sm text-color-s'>
              Already have an account? <Link className='hover:underline text-blue-600' to="/login">Sign In</Link>
            </span>
          </div>
          <Button primary={true} disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Signup;