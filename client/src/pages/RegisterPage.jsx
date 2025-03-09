import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadedPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData(prev => ({ ...prev, profile_pic: uploadedPhoto?.url }));
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
    setData(prev => ({ ...prev, profile_pic: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      setLoading(false);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({ name: "", email: "", password: "", profile_pic: "" });
        navigate('/email');
      }
    } catch (error) {
      setLoading(false);
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
        
        <h3 className="text-center text-2xl font-semibold mb-6">Welcome to Laugh Daily!</h3>

        {/* Form */}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          
          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-400 text-sm">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

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

          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-400 text-sm">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          {/* Profile Photo Upload */}
          <div className="flex flex-col">
            <label htmlFor="profile_pic" className="text-gray-400 text-sm">Photo:</label>
            <div
              className="h-12 bg-gray-700 flex justify-center items-center border border-gray-600 rounded cursor-pointer hover:border-primary transition duration-300"
              role="button"
              aria-label="Upload profile photo"
              onClick={() => document.getElementById('profile_pic').click()}
            >
              <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
              </p>
              {uploadPhoto?.name && (
                <button className="text-lg ml-2 hover:text-red-600" onClick={handleClearUploadPhoto}>
                  <IoClose />
                </button>
              )}
            </div>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary text-base px-3 py-2 rounded font-bold text-white hover:bg-orange-500 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="my-4 text-center text-gray-400 text-sm">
          Already have an account? 
          <Link to="/email" className="hover:text-primary text-white font-semibold ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;