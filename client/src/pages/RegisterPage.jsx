import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAtSymbol, HiOutlineUser, HiOutlineLockClosed, HiOutlinePhotograph } from 'react-icons/hi';

// Custom theme colors (via Tailwind config) should ensure --color-primary class exists.
// If DaisyUI/Shadcn is in use, replace classNames accordingly.

const gradientBg =
  'bg-gradient-to-br from-[#1a1833] via-[#2d2a5a]/70 via-60% to-[#2c356c]/80';
const glassBg =
  'bg-white/6 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40';

const inputFocusRing =
  'focus:ring-2 focus:ring-primary/70 focus:border-primary/70';

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
    <div
      className={
        `${gradientBg} min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden`
      }
      style={{
        // Decorative radial gradient overlays (soft macOS Ventura style)
        backgroundImage:
          'radial-gradient(at 20% 0%,rgba(73,44,191,0.18) 0,transparent 54%), ' +
          'radial-gradient(at 82% 18%,rgba(91,64,186,0.22) 0,transparent 52%), ' +
          'radial-gradient(at 50% 115%,rgba(255,92,0,0.13) 0,transparent 65%), ' +
          'radial-gradient(at 40% 110%,rgba(250,176,4,0.09) 0,transparent 65%), ' +
          'radial-gradient(at 90% 90%,rgba(51,154,240,0.16) 0,transparent 74%)',
      }}
    >
      <AnimatePresence>
        <motion.div
          className={`relative w-full max-w-lg mx-auto ${glassBg} rounded-2xl p-8 md:p-10 xl:p-12 flex flex-col gap-6 shadow-lg border border-white/5`}
          style={{
            boxShadow: '0 8px 40px 0 rgba(0,0,0,0.32), 0 2px 10px rgba(73,44,191,0.05)',
            backdropFilter: 'blur(32px)',
          }}
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.39, 0.575, 0.565, 1] }}
        >

          {/* Logo */}
          <motion.div
            className="flex justify-center mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="p-2 bg-gradient-to-tr from-orange-500/80 to-yellow-400/80 rounded-full shadow-2xl shadow-orange-500/20 flex items-center justify-center ring-2 ring-white/15">
              <img
                src={logo}
                alt="Laugh Daily logo"
                className="w-16 h-16 object-contain pointer-events-none select-none"
                draggable="false"
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-center text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-purple-300/80 mb-1 tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            Welcome to Laugh Daily!
          </motion.h1>
          <p className="text-center text-base md:text-lg text-white/80 font-medium mb-2">
            Create your account to continue
          </p>

          {/* Form */}
          <form className="flex flex-col gap-5 mt-2" onSubmit={handleSubmit} autoComplete="off">
            {/* Name */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="name" className="pl-1 text-white/70 font-medium mb-[2px] text-sm">
                Name
              </label>
              <div className="relative flex items-center">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-lg pointer-events-none" aria-hidden />
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  maxLength={64}
                  className={`w-full pl-10 pr-3 py-3 bg-black/40 rounded-xl border border-white/7 text-white/90 placeholder-white/40 font-medium transition-all duration-200 outline-none ${inputFocusRing} focus:bg-black/70`}
                  placeholder="Enter your name"
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  aria-label="Name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="email" className="pl-1 text-white/70 font-medium mb-[2px] text-sm">
                Email
              </label>
              <div className="relative flex items-center">
                <HiOutlineAtSymbol className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-lg pointer-events-none" aria-hidden />
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  maxLength={80}
                  className={`w-full pl-10 pr-3 py-3 bg-black/40 rounded-xl border border-white/7 text-white/90 placeholder-white/40 font-medium transition-all duration-200 outline-none ${inputFocusRing} focus:bg-black/70`}
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  aria-label="Email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="password" className="pl-1 text-white/70 font-medium mb-[2px] text-sm">
                Password
              </label>
              <div className="relative flex items-center">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-lg pointer-events-none" aria-hidden />
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={64}
                  className={`w-full pl-10 pr-3 py-3 bg-black/40 rounded-xl border border-white/7 text-white/90 placeholder-white/40 font-medium transition-all duration-200 outline-none ${inputFocusRing} focus:bg-black/70`}
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  aria-label="Password"
                />
              </div>
            </div>

            {/* Profile Photo Upload */}
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="profile_pic" className="pl-1 text-white/70 font-medium mb-[2px] text-sm flex items-center gap-1">
                <HiOutlinePhotograph className="inline align-middle text-white/60" aria-hidden />
                Photo
              </label>
              <div
                tabIndex={0}
                role="button"
                aria-label="Upload profile photo"
                className={
                  `relative h-14 flex cursor-pointer items-center transition-all border border-white/10 hover:border-primary/80 hover:shadow-md focus:ring-2 focus:ring-primary/60 bg-black/40 rounded-xl group px-4 select-none
                   ${uploadPhoto ? "pr-12" : ""}
                  `
                }
                onClick={() => document.getElementById('profile_pic').click()}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('profile_pic').click();
                  }
                }}
              >
                <span className="truncate text-white/80 pointer-events-none text-base">
                  {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
                </span>
                <AnimatePresence>
                  {uploadPhoto?.name && (
                    <motion.button
                      type="button"
                      tabIndex={0}
                      aria-label="Remove profile photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-red-600 text-2xl transition-colors duration-150 z-10 focus:outline-none"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClearUploadPhoto}
                    >
                      <IoClose />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPhoto}
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`relative bg-gradient-to-r from-orange-500/80 to-purple-500/80 hover:from-orange-400 hover:to-purple-400 via-pink-600/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 px-4 py-3 rounded-xl font-bold text-white text-base shadow-md
                active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 select-none`}
              style={{
                boxShadow: '0px 4px 32px 0px rgba(250,176,4,0.08)',
                minHeight: 50,
              }}
              disabled={loading}
              whileHover={{ scale: 1.018, filter: "brightness(1.075)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 250, damping: 18 }}
              aria-busy={loading}
            >
              {loading && (
                <svg
                  className="animate-spin mr-2 h-5 w-5 fill-none text-white/80"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  aria-label="Loading"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-95" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          {/* Redirect to Login */}
          <motion.p
            className="mt-2 text-center text-sm text-white/65 font-medium"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Already have an account?
            <Link
              to="/email"
              className="ml-1 underline underline-offset-4 font-semibold text-white/95 hover:text-orange-500 transition-colors duration-125 focus:outline-none focus:shadow-outline"
            >Login</Link>
          </motion.p>
        </motion.div>
      </AnimatePresence>
      {/* A11y: skip to main content */}
      <a href="#mainform" className="sr-only focus:not-sr-only absolute top-4 left-4 z-40 bg-black/70 text-white/90 px-4 py-2 rounded transition-all">Skip to main content</a>
    </div>
  );
};

export default RegisterPage;
