import React, { useState } from 'react';
import axios from 'axios';
import uploadFile from '../helpers/uploadFile';
import { useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import * as nsfwjs from 'nsfwjs';
import { motion, AnimatePresence } from 'framer-motion';

function AddPost() {
  const [data, setData] = useState({
    postimg: "",
    description: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const uploadedFile = await uploadFile(file); // API returns actual image url to check for moderation
        setUploadPhoto(file);
        setImgPreview(URL.createObjectURL(file));
        setData((prev) => ({
          ...prev,
          postimg: uploadedFile?.url // Cloud url (which NSFW will check)
        }));
      } catch (error) {
        toast.error('Error uploading photo. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setImgPreview(null);
    setData((prev) => ({
      ...prev,
      postimg: ""
    }));
  };

  // NSFW Check function
  const checkImageForNSFW = async (imageUrl) => {
    // Path "/nsfwjs/models/mobilenet_v2/" must contain nsfwjs model files in your public folder or a CDN
    const model = await nsfwjs.load("/nsfwjs/models/mobilenet_v2/");
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        const predictions = await model.classify(img);

        const pornPrediction = predictions.find(p => p.className === 'Porn');
        const hentaiPrediction = predictions.find(p => p.className === 'Hentai');
        const pornProbability = pornPrediction?.probability || 0;
        const hentaiProbability = hentaiPrediction?.probability || 0;
        resolve({ pornProbability, hentaiProbability });
      };
      img.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.postimg) {
      toast.error('Please upload an image before submitting.');
      return;
    }

    if (!data.description.trim()) {
      toast.error('Please enter a description.');
      return;
    }

    setLoading(true);

    try {
      // Check the image for NSFW content before uploading
      const { pornProbability, hentaiProbability } = await checkImageForNSFW(data.postimg);

      if (pornProbability > 0.5 || hentaiProbability > 0.5) {
        toast.error('Image contains vulgar content. Please upload a different image.');
        setLoading(false);
        return;
      }

      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/add-post`;
      const response = await axios.post(URL, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Post uploaded successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to upload post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center bg-gradient-to-br from-black via-[#232949] to-[#181325] py-10 px-3">
      <motion.div
        className="w-full max-w-lg mx-auto bg-gradient-to-tr from-black/60 via-[#231c37]/80 to-[#181325] shadow-2xl
        rounded-xl md:p-9 p-5 ring-1 ring-inset ring-white/10 backdrop-blur-xl"
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.44, ease: [0.39, 0.575, 0.565, 1] }}
      >
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-200 to-fuchsia-300 mb-7 tracking-tight">
          Add Post
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
          {/* Upload Photo Section */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='postimg' className='text-white/85 font-semibold text-base'>Photo</label>
            <div
              className="flex items-center gap-2 relative h-14 bg-black/30 border border-white/12 rounded-xl select-none cursor-pointer hover:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/60 transition-all"
              role="button"
              tabIndex={0}
              aria-label="Upload post image"
              onClick={() => document.getElementById('postimg').click()}
              onKeyDown={e => ['Enter',' '].includes(e.key) && document.getElementById('postimg').click()}
            >
              <span className="pl-3 text-white/80 truncate text-base pointer-events-none">
                {uploadPhoto ? (uploadPhoto.name || "Photo selected") : "Upload post image"}
              </span>
              <AnimatePresence>
                {uploadPhoto && (
                  <motion.button
                    type="button"
                    className="ml-2 text-lg text-red-400 hover:text-red-600 transition-colors duration-150 focus:outline-none"
                    onClick={handleClearUploadPhoto}
                    aria-label="Clear photo"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <IoClose />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <input
              type='file'
              id='postimg'
              name='postimg'
              className='hidden'
              accept="image/*"
              onChange={handleUploadPhoto}
              aria-hidden="true"
              tabIndex={-1}
            />
            {/* Preview Image */}
            <AnimatePresence>
              {imgPreview && (
                <motion.div
                  className='mt-4 flex justify-center'
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.22 }}
                >
                  <img
                    src={imgPreview}
                    alt="Preview"
                    className='w-56 h-56 object-cover rounded-xl border border-white/15 shadow-lg'
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-white/85 font-semibold text-base">Description</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleOnChange}
              className="bg-black/25 text-white p-3 rounded-xl border border-white/10 font-medium focus:outline-none focus:border-orange-500 transition duration-300 resize-none min-h-[80px]"
              placeholder="Enter a description for your post"
              rows={4}
              required
              maxLength={600}
            />
          </div>

          {/* Warning Box */}
          <div className="bg-red-900/10 text-red-300 p-4 rounded-lg border border-red-500/30 flex flex-col gap-1">
            <p className="text-sm font-bold">Warning:</p>
            <p className="text-sm">If the image or description contains any vulgar content, the post will not be uploaded or may be deleted later by moderators.</p>
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
            {loading ? 'Checking for inappropriate content...' : 'Submit'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AddPost;
