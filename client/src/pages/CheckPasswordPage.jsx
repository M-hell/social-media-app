import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';
import logo from '../assets/logo.png';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: ""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    }
  }, [location, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      });

      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem('token', response?.data?.token);

        setData({ password: "" });
        navigate('/');
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
          <div className="bg-orange-500 p-4 rounded-full">
            <img src={logo} alt="Laugh Daily logo" className="w-32" />
          </div>
        </div>
        
        {/* User Avatar and Name */}
        <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
          <Avatar
            width={80}
            height={80}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-xl mt-2 text-gray-200">{location?.state?.name}</h2>
        </div>

        {/* Password Form */}
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
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

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-2 rounded font-bold text-white hover:bg-orange-500 transition-colors duration-300 mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
