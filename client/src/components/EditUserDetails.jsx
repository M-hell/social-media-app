import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name || '',
    profile_pic: user?.profile_pic || '',
    email: user?.email || '',
  });

  const [loading, setLoading] = useState(false);
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setData((prev) => ({
        ...prev,
        ...user,
      }));
    }
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const uploadPhoto = await uploadFile(file);
      setData((prev) => ({
        ...prev,
        profile_pic: uploadPhoto?.url || '',
      }));
      toast.success('Photo updated');
    } catch (err) {
      toast.error('Upload failed. Try a different image.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/update-user`;
      const { name, profile_pic, email } = data;
      const response = await axios.post(
        URL,
        { name, profile_pic, email },
        { withCredentials: true }
      );
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      toast.error('Failed to update user details');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="edit-user-modal"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          className="relative bg-gradient-to-br from-black/80 via-[#221c32]/80 to-black/95 w-full max-w-md rounded-2xl shadow-2xl ring-1 ring-inset ring-white/10 p-0"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.21 }}
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 p-2 text-white/80 hover:text-red-400 rounded-full bg-black/20 hover:bg-black/40 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Close"
            type="button"
          >
            <IoClose size={22} />
          </button>
          <div className="p-8 pb-5 rounded-2xl flex flex-col gap-3 bg-black/60">
            <h2 className="font-extrabold text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-fuchsia-200 to-yellow-400 mb-1">
              Profile Details
            </h2>
            <p className="text-white/60 text-sm font-medium mb-3">Edit user details</p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-white/70 font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-black/25 rounded-lg border border-white/10 px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition"
                  value={data.name}
                  onChange={handleOnChange}
                  autoComplete="off"
                  required
                  maxLength={64}
                />
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-white/70 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-black/25 rounded-lg border border-white/10 px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition"
                  value={data.email}
                  onChange={handleOnChange}
                  autoComplete="off"
                  required
                  maxLength={128}
                />
              </div>
              {/* Profile Avatar Photo */}
              <div className="flex items-center gap-5">
                <span className="font-medium text-white/80">Photo:</span>
                <Avatar
                  width={48}
                  height={48}
                  imageUrl={data?.profile_pic}
                  name={data?.name}
                />
                <button
                  onClick={handleOpenUploadPhoto}
                  className="font-semibold px-4 py-2 bg-gradient-to-tr from-orange-500 to-pink-500 text-white rounded-lg shadow hover:from-orange-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition text-sm"
                  type="button"
                  disabled={loading}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
              {/* Actions */}
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-orange-400 text-orange-300 font-semibold px-5 py-2 rounded-lg hover:bg-orange-400 hover:text-white transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-tr from-orange-500 to-pink-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:from-orange-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(EditUserDetails);
