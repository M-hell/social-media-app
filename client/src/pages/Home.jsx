import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, setUser, setOnlineUser, setSocketConnection } from '../redux/userSlice';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';
import { Outlet } from 'react-router-dom';
import io from 'socket.io-client';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);

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
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/moderate-content`;
      const response = await axios({
        url: URL,
        method: 'POST',
      });
      console.log("Content moderated successfully");
    } catch (error) {
      console.log("Error moderating content:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    ContentModerator();
  }, []);

  useEffect(() => {
    if (data) {
      console.log("User from Redux store:", user);
    }
  }, [data]);

  /*** Socket connection ***/
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token')
      },
    });

    socketConnection.on('onlineUser', (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const isPostsActive = location.pathname === '/all-posts';
  const isThreadsActive = location.pathname === '/all-threads';

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/5 bg-gray-800 p-4 shadow-lg">
          <UserSidebar />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-4/5 p-4 lg:p-6 flex flex-col items-center overflow-auto transition-all duration-1000">
          
          {/* Tab buttons */}
          <div className="join mb-4 w-full lg:w-auto flex justify-center">
            <button
              className={`btn join-item transition-all duration-1000 ease-in-out hover:bg-orange-600 rounded-lg mx-2 p-2 ${
                isPostsActive ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}
              onClick={() => navigate("/all-posts")}
            >
              Posts
            </button>
            <button
              className={`btn join-item transition-all duration-1000 ease-in-out hover:bg-orange-600 rounded-lg mx-2 p-2 ${
                isThreadsActive ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}
              onClick={() => navigate("/all-threads")}
            >
              Threads
            </button>
          </div>

          {/* Content Outlet */}
          <div className="w-full flex-1 overflow-y-auto bg-gray-800 rounded-lg p-4 shadow-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
