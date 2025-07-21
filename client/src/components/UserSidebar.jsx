import React, { useEffect, useState } from 'react';
import { FaUserFriends } from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from 'axios';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

function UserSidebar() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const _id = useSelector(state => state.user._id);
  const navigate = useNavigate();

  const getUsers = async () => {
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-followers-following`;
      const response = await axios.post(URL, { _id }, { withCredentials: true });

      if (response.data.data.length === 0) {
        toast.success("Add friends by clicking on search at top right");
      } else {
        const uniqueUsers = Array.from(new Set(response.data.data.map(user => user._id)))
          .map(id => response.data.data.find(user => user._id === id));
        setUsers(uniqueUsers);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      navigate("/all-posts");
    }
  };

  useEffect(() => {
    if (_id) getUsers();
    // eslint-disable-next-line
  }, [_id]);

  return (
    <div className="w-full h-full px-0 pt-1 rounded-3xl shadow-inner">
      <div className="flex flex-col items-center justify-start h-full relative w-full">
        {/* Drawer opener for mobile */}
        <div className="flex lg:hidden w-full px-2 justify-center py-2">
          <span className="flex justify-center items-center gap-2 font-bold text-orange-400 text-xl cursor-pointer select-none">
            <FaUserFriends className="text-2xl" />
            Friends
          </span>
        </div>
        <motion.div
          className="bg-gradient-to-br from-black/70 via-[#232949]/85 to-[#181325]/95 text-white rounded-2xl shadow-2xl h-[79vh] w-full lg:w-[18vw] max-w-[92vw] overflow-y-auto py-4 px-2 border border-white/10"
          initial={{ x: -36, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        >
          <h2 className="text-xl font-bold px-1 mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-fuchsia-300">
            Friends
          </h2>
          <hr className="mb-3 border-white/10" />

          {loading ? (
            <Loading />
          ) : users.length === 0 ? (
            <p className="text-center text-white/50 text-sm py-4">
              No users found.
            </p>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <motion.li
                  key={user._id}
                  className="bg-black/25 hover:border-orange-500 hover:bg-gradient-to-bl hover:from-black/50 hover:to-orange-950/40 shadow-lg text-white rounded-xl px-2 py-2 flex items-center gap-4 overflow-hidden border border-white/5 transition-all duration-200"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar
                    width={44}
                    height={44}
                    imageUrl={user.profile_pic}
                    name={user.name}
                    userId={user._id}
                  />
                  <div
                    onClick={() => navigate(`/${user._id}`)}
                    className="flex-1 cursor-pointer overflow-hidden"
                    title={user.email}
                  >
                    <span className="block text-sm font-semibold truncate max-w-[110px] hover:text-orange-400">
                      {user.name}
                    </span>
                    <span className="block text-xs text-white/40 truncate max-w-[110px]">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/message/${user._id}`)}
                    className="cursor-pointer hover:text-orange-400 flex-shrink-0 p-1 hover:bg-orange-400/10 rounded-full transition"
                    title="Chat"
                    tabIndex={0}
                    aria-label={`Message ${user.name}`}
                    type="button"
                  >
                    <IoChatbubbleEllipsesSharp size={21} />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default UserSidebar;
