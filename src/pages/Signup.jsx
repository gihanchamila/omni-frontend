import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../utils/axiosInstance.js";
import Button from '../component/button/Button.jsx';
import signUpValidator from '../validators/signUpValidator.js';
import { toast } from 'sonner';

const initialFormData = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };
const initialFormError = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

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
    <div className='lg:flex lg:items-center lg:justify-center sm:block'>
      <div className='border-2 border-slate-800 lg:w-[38rem] sm:w-6/6 bg-white px-12 py-12 mt-[3rem]  mb-[5rem] rounded-2xl'>
        <div className="body-1">
          <h1 className="text-4xl font-bold text-slate-800 pb-5">Welcome</h1>
        </div>

        {/* Sign up form */}
        <form className="" onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="firstName" className="label">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="appearance-none input-box"
              />
              {formError.firstName && <p className="validateError">{formError.firstName}</p>}
            </div>
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="lastName" className="label">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="appearance-none input-box"
              />
              {formError.lastName && <p className="validateError">{formError.lastName}</p>}
            </div>
          </div>

          {/* Email and Confirm Email fields */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mt-4">
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="email" className="label">Email</label>
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
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="confirmEmail" className="label">Confirm Email</label>
              <input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                placeholder="someone@gmail.com"
                required
                value={formData.confirmEmail}
                onChange={handleChange}
                className="appearance-none input-box"
              />
              {formError.confirmEmail && <p className="validateError">{formError.confirmEmail}</p>}
            </div>
          </div>

          {/* Password and Confirm Password fields */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mt-4">
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="password" className="label">Password</label>
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
            <div className="groupBox lg:w-[35rem]">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
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
          <div className="flex flex-col-reverse items-center justify-between lg:flex-row md:flex-row sm:w-full mt-6 space-y-4 lg:space-y-0">
            <div className="flex-grow text-center lg:text-left">
              <span className='font-base text-sm text-color-s'>
                Already have an account? <Link className='hover:underline text-blue-600' to="/login">Sign In</Link>
              </span>
            </div>
            <Button className="w-full lg:w-auto" primary={true} disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>
    </div>
    
  );
}

export default Signup;
