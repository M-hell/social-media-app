import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from './Loading';
import OtherProfileCard from './OtherProfileCard';
import uploadFile from '../helpers/uploadFile';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaRegComment, FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Comments from './Comments';
import { useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

function OtherProfile() {
  const userselector = useSelector((state) => state.user);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState({
    postimg: '',
    description: ''
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-posts`;
        const response = await axios({
          method: 'GET',
          url: URL,
          withCredentials: true
        });
        setPosts(response.data.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPosts();
    // eslint-disable-next-line
  }, [openCommentsPostId]);

  const handleUpvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/upvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, upvotescount: (typeof post.upvotescount === 'number' ? post.upvotescount + 1 : (Array.isArray(post.upvotescount) ? post.upvotescount.length + 1 : 1)) }
            : post
        )
      );
      toast.success('Upvote successful');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/downvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, downvotescount: (typeof post.downvotescount === 'number' ? post.downvotescount + 1 : (Array.isArray(post.downvotescount) ? post.downvotescount.length + 1 : 1)) }
            : post
        )
      );
      toast.success('Downvote successful');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/delete-post/${postId}`;
    try {
      await axios.delete(URL, { withCredentials: true });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleToggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleComments = (postId) => {
    setOpenCommentsPostId(prevPostId => prevPostId === postId ? null : postId);
  };

  const handleEditClick = (post) => {
    setEditingPost(post._id);
    setEditFormData({
      postimg: post.postimg || '',
      description: post.description || ''
    });
    setUploadPhoto(post.postimg || null);
  };

  const handleEditCancel = () => {
    setEditingPost(null);
    setEditFormData({
      postimg: '',
      description: ''
    });
    setUploadPhoto(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large (max 5MB)');
      return;
    }
    setIsUploading(true);
    try {
      const previewUrl = URL.createObjectURL(file);
      setUploadPhoto(previewUrl);
      const uploadedFile = await uploadFile(file);
      setEditFormData(prev => ({
        ...prev,
        postimg: uploadedFile.url
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading photo. Please try again.');
      setUploadPhoto(null);
      setEditFormData(prev => ({
        ...prev,
        postimg: ''
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setEditFormData(prev => ({
      ...prev,
      postimg: ""
    }));
  };

  const handleEditSubmit = async (postId) => {
    try {
      setLoading(true);
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/update-post`;
      const response = await axios.post(URL, {
        _id: postId,
        ...editFormData
      }, { withCredentials: true });

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? response.data.data : post
        )
      );
      toast.success('Post updated successfully');
      setEditingPost(null);
      setUploadPhoto(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/other-user-details`;
    try {
      const response = await axios.post(URL, { userId }, { withCredentials: true });
      if (response.data && response.data.data) {
        setUser(response.data.data);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [userId]);

  if (loading && !user) return <div><Loading /></div>;
  if (error) return <p>Error: {error}</p>;

  const visiblePosts = posts.filter((post) => user?.posts?.includes(post._id));

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#181325] via-[#191a30] to-black pb-16 md:pb-24">
      {user ? (
        <div>
          <OtherProfileCard user={user} />
          {user && (
            <div className="absolute top-5 right-8 bg-gradient-to-r from-red-700 via-orange-600 to-yellow-500 text-white text-lg font-bold px-5 py-2 rounded-full shadow-lg z-10">
              Warning: {user.warningcount || 0}
            </div>
          )}
          <div className="join my-8 w-full lg:w-auto flex justify-center">
            <button className="btn join-item bg-black/40 text-white tracking-wide shadow">
              Posts and Threads
            </button>
          </div>
          <div className="flex flex-col items-center mt-4">
            {visiblePosts.length === 0 ? (
              <p className="text-gray-400 text-lg mt-6">This user has no posts or threads.</p>
            ) : (
              visiblePosts.map((post) => {
                const isExpanded = expandedPosts[post._id];
                const truncatedDescription = post.description?.slice(0, 100) || '';
                const shouldTruncate = post.description?.length > 100;
                const isCommentsOpen = openCommentsPostId === post._id;

                return (
                  <div key={post._id} className="flex justify-center w-full">
                    <AnimatePresence>
                      {editingPost === post._id && (
                        <motion.div
                          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[130]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div
                            className="bg-gradient-to-br from-black/90 via-[#231c37]/90 to-[#161537] p-7 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto ring-1 ring-inset ring-white/10 shadow-2xl"
                            initial={{ scale: 0.96, y: 24 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.88, y: 24 }}
                          >
                            <h3 className="text-2xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-200 to-fuchsia-300">
                              Edit Post
                            </h3>
                            <div className="mb-5">
                              <label className="block text-white/80 font-semibold mb-2">Image</label>
                              <div className='flex flex-col gap-2'>
                                <div
                                  className='h-12 bg-black/30 flex justify-center items-center border border-white/15 rounded-xl cursor-pointer hover:border-orange-400 transition duration-300'
                                  onClick={() => document.getElementById(`edit-postimg-${post._id}`).click()}
                                >
                                  <span className='text-white/70 text-sm truncate max-w-[280px] select-none'>
                                    {uploadPhoto ? "Change image" : "Upload post image"}
                                  </span>
                                  {uploadPhoto && (
                                    <button
                                      className="ml-3 text-2xl hover:text-red-400"
                                      onClick={handleClearUploadPhoto}
                                      aria-label="Clear photo"
                                    >
                                      <IoClose />
                                    </button>
                                  )}
                                </div>
                                <input
                                  type='file'
                                  id={`edit-postimg-${post._id}`}
                                  className='hidden'
                                  onChange={handleUploadPhoto}
                                  accept="image/*"
                                />
                                {uploadPhoto && (
                                  <div className="mt-4 flex justify-center">
                                    <img
                                      src={uploadPhoto}
                                      alt="Preview"
                                      className="max-w-[350px] max-h-[330px] aspect-square object-contain rounded-lg border border-white/10"
                                    />
                                  </div>
                                )}
                                {isUploading && (
                                  <div className="text-orange-400 text-sm mt-1">Uploading image...</div>
                                )}
                              </div>
                            </div>
                            <div className="mb-5">
                              <label className="block text-white/80 font-semibold mb-2">Description</label>
                              <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-black/40 rounded-lg text-white font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                                rows="4"
                                maxLength={600}
                              />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                              <button
                                onClick={handleEditCancel}
                                className="px-5 py-2 text-orange-400 border border-orange-400 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition"
                                disabled={isUploading}
                                type="button"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditSubmit(post._id)}
                                className="px-5 py-2 bg-gradient-to-tr from-orange-500 to-fuchsia-500 text-white rounded-lg font-semibold shadow hover:from-orange-400 hover:to-fuchsia-400 transition"
                                disabled={isUploading}
                                type="button"
                              >
                                {isUploading ? 'Saving...' : 'Save Changes'}
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Post Card */}
                    <div className="bg-gradient-to-tr from-black/60 via-gray-800/60 to-black/80 my-5 shadow-2xl rounded-2xl overflow-hidden p-5 flex flex-col transition-transform hover:scale-[1.015] hover:shadow-orange-500/10 duration-300 mx-auto w-full sm:w-[600px] md:w-[800px] border border-white/10 relative">
                      <div className="flex items-center mb-4 gap-4">
                        <img
                          src={post.author?.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'}
                          alt={post.author?.name}
                          className="w-12 h-12 rounded-full object-cover mr-2 border-2 border-white/8"
                        />
                        <span className="text-lg font-semibold text-white/90">{post.author?.name}</span>
                        {post.author?._id === userselector?._id && (
                          <>
                            <button
                              onClick={() => handleEditClick(post)}
                              className="ml-4 text-orange-300 hover:text-white transition"
                              title="Edit"
                              type="button"
                            >
                              <FaEdit size={20} />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="ml-2 text-red-400 hover:text-red-600 transition"
                              title="Delete"
                              type="button"
                            >
                              <MdDelete size={20} />
                            </button>
                          </>
                        )}
                      </div>
                      {post.postimg && (
                        <div className="w-full mb-4 flex justify-center rounded-xl overflow-hidden">
                          <img
                            src={post.postimg}
                            alt="Post Image"
                            className="w-full max-h-60 object-contain rounded-xl border border-white/8"
                          />
                        </div>
                      )}
                      <p className="text-lg font-semibold mb-2 text-white/90">
                        {isExpanded ? post.description : truncatedDescription}
                        {shouldTruncate && !isExpanded && '...'}
                      </p>
                      {shouldTruncate && (
                        <button
                          onClick={() => handleToggleExpand(post._id)}
                          className="text-orange-400 mt-2 underline underline-offset-4 font-semibold focus:outline-none hover:text-orange-200 transition"
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                      <div className="flex gap-9 mb-2 text-base font-medium mt-2">
                        <span className="text-green-400">
                          Upvotes:{' '}
                          <span className="text-white font-mono">
                            {typeof post.upvotescount === 'number' ? post.upvotescount : (Array.isArray(post.upvotescount) ? post.upvotescount.length : 0)}
                          </span>
                        </span>
                        <span className="text-red-400">
                          Downvotes:{' '}
                          <span className="text-white font-mono">
                            {typeof post.downvotescount === 'number' ? post.downvotescount : (Array.isArray(post.downvotescount) ? post.downvotescount.length : 0)}
                          </span>
                        </span>
                        <span className="text-cyan-300">
                          Comments:{' '}
                          <span className="text-white font-mono">
                            {post.comments?.length || 0}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <button
                          onClick={() => handleUpvote(post._id)}
                          className="bg-gradient-to-tr from-green-400 via-green-600 to-emerald-800 text-white py-1 px-4 flex items-center justify-center rounded-lg hover:from-green-400 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/40 font-semibold"
                        >
                          <BiUpvote className="mr-2" /> Upvote
                        </button>
                        <button
                          onClick={() => handleDownvote(post._id)}
                          className="bg-gradient-to-tr from-red-400 via-red-600 to-rose-900 text-white py-1 px-4 flex items-center justify-center rounded-lg hover:from-red-400 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 font-semibold"
                        >
                          <BiDownvote className="mr-2" /> Downvote
                        </button>
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white py-1 px-4 flex items-center justify-center rounded-lg hover:from-blue-400 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/40 font-semibold"
                        >
                          <FaRegComment className="mr-2" /> Comment
                        </button>
                        {isCommentsOpen && (
                          <Comments postId={post._id} previousComments={post.comments} onClose={() => setOpenCommentsPostId(null)} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 min-h-[60vh]">
                <motion.div
                  className="rounded-full w-16 h-16 bg-gradient-to-br from-orange-500 via-fuchsia-600 to-indigo-600 flex items-center justify-center shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.04, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1, repeatType: "mirror", ease: "easeInOut" }}
                >
                  <svg className="animate-spin h-10 w-10 text-white opacity-85" viewBox="0 0 24 24">
                    <circle className="opacity-40" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-85" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </motion.div>
                <div className="mt-6 text-lg text-white/80 font-semibold">Loading</div>
              </div>
      )}
    </div>
  );
}

export default OtherProfile;
