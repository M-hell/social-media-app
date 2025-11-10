import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, setUser, setOnlineUser, setSocketConnection } from '../redux/userSlice';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';
import { Outlet } from 'react-router-dom';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHashtag, HiOutlineDocumentText, HiOutlineUsers, HiMenu, HiX } from 'react-icons/hi';

const gradientBg =
  'bg-gradient-to-br from-[#181325] via-[#221c41]/80 to-[#232949]/90';

const glassBg =
  'bg-white/6 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true
      });

      setData(response.data.data);
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      } else {
        dispatch(setUser(response.data.data));
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  const ContentModerator = async () => {
    try {
      console.log("Triggering content moderation from client side..................");
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/moderate-content`;
      await axios({
        url: URL,
        method: 'POST',
      });
    } catch (error) {
      console.log("Error moderating content:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    ContentModerator();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data) {
      // Optionally monitor redux user payload
      // console.log("User from Redux store:", user);
    }
  }, [data, user]);

  /*** Socket connection ***/
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token')
      },
    });

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('mobile-sidebar');
        const hamburger = document.getElementById('hamburger-button');
        
        if (sidebar && !sidebar.contains(event.target) && 
            hamburger && !hamburger.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const isPostsActive = location.pathname === '/all-posts';
  const isThreadsActive = location.pathname === '/all-threads';
  const isCommunityActive = location.pathname === '/community';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`${gradientBg} min-h-screen w-full flex flex-col relative overflow-hidden`}
      style={{
        backgroundImage:
          'radial-gradient(at 10% 5%,rgba(80,32,220,0.16) 0,transparent 55%), ' +
          'radial-gradient(at 85% 22%,rgba(94,61,186,0.18) 0,transparent 54%), ' +
          'radial-gradient(at 50% 105%,rgba(255,92,0,0.08) 0,transparent 70%), ' +
          'radial-gradient(at 75% 106%,rgba(246,177,2,0.07) 0,transparent 66%)',
      }}
    >
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto px-0 sm:px-3 relative z-10 mt-2">
        
        {/* Sidebar */}
        <motion.div
          className={`w-full lg:w-1/5 min-w-[220px] ${glassBg} pb-3 lg:pb-0 lg:rounded-tr-3xl rounded-none rounded-b-2xl lg:rounded-bl-2xl border-r border-white/5 shadow-xl select-none`}
          initial={{ x: -32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.44, ease: [0.39, 0.575, 0.565, 1] }}
        >
          <UserSidebar />
        </motion.div>

        {/* Content Section */}
        <div className={`
          w-full lg:w-4/5 flex flex-col items-center overflow-auto 
          p-4 md:p-8 xl:p-12 transition-all
          ${isSidebarOpen ? 'lg:ml-0' : ''}
          pt-16 lg:pt-4
        `}>
          
          {/* Tab buttons */}
          <motion.div
            className="mb-6 w-full max-w-lg mx-auto flex justify-center gap-2 sm:gap-4 flex-wrap"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            role="tablist"
            aria-label="Post/Threads navigation"
          >
            {/* Post Button */}
            <button
              className={`
                group relative flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl 
                transition-all duration-200 border-none outline-none 
                font-semibold text-sm sm:text-lg flex-1 sm:flex-none min-w-0
                ${
                  isPostsActive
                    ? "bg-gradient-to-r from-orange-500 via-fuchsia-600 to-indigo-600 shadow-lg text-white"
                    : "bg-black/30 text-white/60 hover:bg-black/60 hover:text-white/90"
                }
                focus:ring-2 focus:ring-primary/60
              `}
              aria-current={isPostsActive ? "page" : undefined}
              onClick={() => navigate("/all-posts")}
            >
              <HiOutlineDocumentText className="text-lg sm:text-2xl flex-shrink-0" aria-hidden />
              <span className="truncate">Posts</span>
              {isPostsActive && (
                <motion.span
                  className="absolute inset-x-1.5 -bottom-1.5 h-1 rounded-xl bg-gradient-to-r from-orange-400/70 via-orange-500/90 to-pink-500/60 blur-[1.5px] opacity-60"
                  layoutId="tab-active-indicator"
                />
              )}
            </button>

            {/* Threads Button */}
            <button
              className={`
                group relative flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl
                transition-all duration-200 border-none outline-none 
                font-semibold text-sm sm:text-lg flex-1 sm:flex-none min-w-0
                ${
                  isThreadsActive
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-lg text-white"
                    : "bg-black/30 text-white/60 hover:bg-black/60 hover:text-white/90"
                }
                focus:ring-2 focus:ring-primary/60
              `}
              aria-current={isThreadsActive ? "page" : undefined}
              onClick={() => navigate("/all-threads")}
            >
              <HiOutlineHashtag className="text-lg sm:text-2xl flex-shrink-0" aria-hidden />
              <span className="truncate">Threads</span>
              {isThreadsActive && (
                <motion.span
                  className="absolute inset-x-1.5 -bottom-1.5 h-1 rounded-xl bg-gradient-to-r from-purple-500/70 via-indigo-400/80 to-sky-400/70 blur-[1.5px] opacity-60"
                  layoutId="tab-active-indicator"
                />
              )}
            </button>

            {/* Community Button */}
            <button
              className={`
                group relative flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl 
                transition-all duration-200 border-none outline-none 
                font-semibold text-sm sm:text-lg flex-1 sm:flex-none min-w-0
                ${
                  isCommunityActive
                    ? "bg-gradient-to-r from-orange-500 via-fuchsia-600 to-indigo-600 shadow-lg text-white"
                    : "bg-black/30 text-white/60 hover:bg-black/60 hover:text-white/90"
                }
                focus:ring-2 focus:ring-primary/60
              `}
              aria-current={isCommunityActive ? "page" : undefined}
              onClick={() => navigate("/community")}
            >
              <HiOutlineUsers className="text-lg sm:text-2xl flex-shrink-0" aria-hidden />
              <span className="truncate">Community</span>
              {isCommunityActive && (
                <motion.span
                  className="absolute inset-x-1.5 -bottom-1.5 h-1 rounded-xl bg-gradient-to-r from-orange-400/70 via-orange-500/90 to-pink-500/60 blur-[1.5px] opacity-60"
                  layoutId="tab-active-indicator"
                />
              )}
            </button>
          </motion.div>

          {/* Content Outlet */}
          <motion.div
            className="w-full flex-1 overflow-y-auto bg-black/30 rounded-xl p-2 md:p-4 shadow-xl border border-white/5"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            id="main-content"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
      
      {/* Accessibility: skip main */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-3 left-3 z-40 bg-black/70 text-white/90 px-4 py-2 rounded transition-all">Skip to main content</a>
    </div>
  );
};

export default Home;
