import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({ email: "" });
        navigate('/password', { state: response?.data?.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-lg bg-gray-800 shadow-lg rounded-lg overflow-hidden p-8 mx-4">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 p-3 rounded-full">
            <img src={logo} alt="Laugh Daily logo" className="w-24" />
          </div>
        </div>
        
        <h3 className="text-center text-2xl font-semibold mb-6">Log in to your account!</h3>

        {/* Form */}
        <form className="grid gap-5" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-400 text-sm">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary text-lg px-4 py-2 rounded font-bold text-white hover:bg-orange-500 transition-colors duration-300"
          >
            Let's Go
          </button>
        </form>

        {/* Registration Link */}
        <p className="my-4 text-center text-gray-400">
          New User? 
          <Link to="/register" className="hover:text-primary text-white font-semibold ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
