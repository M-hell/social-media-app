import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, setUser } from '../redux/userSlice';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';
import { Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location
  const [data, setData] = useState(null);

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true
      });
      
      setData(response.data.data);

      // Check if the user is logged out
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      } else {
        dispatch(setUser(response.data.data));  // Set user in Redux store
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

      console.log("deleted moderated content");
      toast.success("content moderated successfully");
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  }

  // Fetch user details when component mounts
  useEffect(() => {
    fetchUserDetails();
    ContentModerator();
  }, []);

  // Log whenever the data state changes
  useEffect(() => {
    if (data) {
      console.log("User from Redux store:", user);
    }
  }, [data]);

  // Determine active tab based on the current path
  const isPostsActive = location.pathname === '/all-posts';
  const isThreadsActive = location.pathname === '/all-threads';

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/5 bg-gray-800 p-4">
          <UserSidebar />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-4/5 p-4 lg:p-6 flex flex-col items-center overflow-auto">
          
          {/* Tab buttons */}
          <div className="join mb-4 w-full lg:w-auto flex justify-center">
            <button
              className={`btn join-item ${isPostsActive ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
              onClick={() => navigate("/all-posts")}
            >
              Posts
            </button>
            <button
              className={`btn join-item ${isThreadsActive ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
              onClick={() => navigate("/all-threads")}
            >
              Threads
            </button>
          </div>

          {/* Content Outlet */}
          <div className="w-full flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
