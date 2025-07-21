import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos, MdEdit } from "react-icons/md";
import EditUserDetails from './EditUserDetails';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

function OtherProfileCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const owner = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState(false);

  const handleFollow = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/increase-following`;
      const response = await axios.post(URL, { followingid: user._id }, { withCredentials: true });
      if (response.data.success) {
        setIsFollowing(true);
        toast.success("Followed successfully");
      }
    } catch (error) {
      toast.error("Error following user");
    }
  };

  useEffect(() => {
    const checkIfFollowing = () => {
      if (user?.followers?.includes(owner._id)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    };
    if (user && owner._id) {
      checkIfFollowing();
    }
  }, [user, owner._id]);

  const isCurrentUser = owner._id === user._id;

  return (
    <motion.div
      className="bg-gradient-to-tr from-black/60 via-gray-900/60 to-slate-900/75 text-white shadow-2xl rounded-2xl max-w-2xl w-full mx-auto flex flex-col items-center px-8 py-7 my-8 border border-white/10"
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.44, ease: [0.39, 0.575, 0.565, 1] }}
    >
      <div className="w-full flex justify-between items-center mb-5">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1 text-white font-semibold py-1 px-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-md"
        >
          <MdArrowBackIos /> Back to Home
        </button>
        {isCurrentUser && (
          <motion.button
            onClick={() => setEditUser(true)}
            className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-tr from-orange-500 to-fuchsia-500 text-white rounded-lg text-base font-semibold hover:from-orange-400 hover:to-fuchsia-400 transition-all duration-150 shadow"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Edit Profile <MdEdit className="text-xl" />
          </motion.button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <Avatar
          width={120}
          height={120}
          imageUrl={user.profile_pic}
          name={user.name}
          userId={user._id}
          className="mb-4"
        />
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-fuchsia-200 to-yellow-400 mb-1">
            {user?.name}
          </h2>
          <p className="text-base text-white/70">{user?.email}</p>
          <div className="flex justify-center mt-6 gap-9 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-lg">{user?.followers.length || 0}</span>
              <span className="text-sm text-white/60">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-lg">{user?.following.length || 0}</span>
              <span className="text-sm text-white/60">Following</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-lg">{user?.upvotes ?? 0}</span>
              <span className="text-sm text-white/60">Upvotes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-lg">{user?.downvotes ?? 0}</span>
              <span className="text-sm text-white/60">Downvotes</span>
            </div>
          </div>
          {!isCurrentUser && (
            <div className="mt-6 flex justify-center">
              {isFollowing ? (
                <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-orange-700 transition-all duration-200">
                  Following
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-orange-700 transition-all duration-200"
                >
                  Follow
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editUser && (
          <EditUserDetails onClose={() => setEditUser(false)} user={user} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default OtherProfileCard;
