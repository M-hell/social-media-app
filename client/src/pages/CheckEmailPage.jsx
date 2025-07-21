import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAtSymbol } from 'react-icons/hi';

const gradientBg =
  'bg-gradient-to-br from-[#1a1833] via-[#2d2a5a]/70 via-60% to-[#2c356c]/80';
const glassBg =
  'bg-white/6 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40';

const inputFocusRing =
  'focus:ring-2 focus:ring-primary/70 focus:border-primary/70';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div
      className={`
        ${gradientBg} min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden
      `}
      style={{
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
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
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

          <motion.h1
            className="text-center text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-purple-300/80 mb-1 tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            Log in to your account!
          </motion.h1>
          <p className="text-center text-base md:text-lg text-white/80 font-medium mb-2">
            Enter your email to proceed
          </p>

          <form className="flex flex-col gap-6 mt-2" onSubmit={handleSubmit} autoComplete="off">
            {/* Email Input */}
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="relative bg-gradient-to-r from-orange-500/80 to-purple-500/80 hover:from-orange-400 hover:to-purple-400 via-pink-600/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 px-4 py-3 rounded-xl font-bold text-white text-lg shadow-md active:scale-98 disabled:opacity-60 flex items-center justify-center select-none"
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
              {loading ? "Processing..." : "Let's Go"}
            </motion.button>
          </form>
          {/* Registration Link */}
          <motion.p
            className="mt-2 text-center text-sm text-white/65 font-medium"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            New User?
            <Link
              to="/register"
              className="ml-1 underline underline-offset-4 font-semibold text-white/95 hover:text-orange-500 transition-colors duration-125 focus:outline-none focus:shadow-outline"
            >Register</Link>
          </motion.p>
        </motion.div>
      </AnimatePresence>
      <a href="#mainform" className="sr-only focus:not-sr-only absolute top-4 left-4 z-40 bg-black/70 text-white/90 px-4 py-2 rounded transition-all">Skip to main content</a>
    </div>
  );
};

export default CheckEmailPage;
