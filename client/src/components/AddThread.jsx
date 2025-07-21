import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function AddThread() {
  const [data, setData] = useState({
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/add-post`;
      const response = await axios.post(URL, data, {
        withCredentials: true,  // Include credentials such as cookies
      });
      if (response.status === 200) {
        toast.success('Thread uploaded successfully!');
        navigate('/all-threads');
      }
    } catch (error) {
      toast.error('Failed to upload thread. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center bg-gradient-to-br from-black via-[#232949] to-[#181325] py-10 px-3">
      <motion.div
        className="w-full max-w-lg mx-auto bg-gradient-to-tr from-black/60 via-[#231c37]/80 to-[#181325] shadow-2xl rounded-xl md:p-9 p-5 ring-1 ring-inset ring-white/10 backdrop-blur-xl"
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.44, ease: [0.39, 0.575, 0.565, 1] }}
      >
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-200 to-fuchsia-300 mb-7 tracking-tight">
          Add Thread
        </h2>
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="mb-4 bg-black/50 border border-white/12 text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-600 hover:text-white/90 transition-all duration-300"
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Home Page
        </motion.button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-white/85 font-semibold text-base">Question</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleOnChange}
              className="bg-black/25 text-white p-3 rounded-xl border border-white/10 font-medium focus:outline-none focus:border-orange-500 transition duration-300 resize-none min-h-[80px]"
              placeholder="Post your question"
              rows={4}
              required
              maxLength={600}
            />
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-900/10 text-yellow-300 p-4 rounded-lg border border-yellow-500/30 flex flex-col gap-1">
            <p className="text-sm font-bold">Warning:</p>
            <p className="text-sm">
              If you upload vulgar or inappropriate content, the content moderator will automatically delete it.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="bg-gradient-to-tr from-orange-500 via-fuchsia-500 to-indigo-600 text-white py-2 rounded-xl font-bold hover:from-orange-400 hover:to-fuchsia-400 transition-all duration-200 shadow-xl text-base"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-busy={loading}
          >
            {loading ? 'Posting...' : 'Submit'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AddThread;
