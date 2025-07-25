import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BiUpvote, BiDownvote, BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Comments from './Comments';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Users, Settings, Trash2, UserPlus, UserMinus, MessageCircle,
  Crown, Calendar, X, Search
} from 'lucide-react';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((state) => state.user._id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-posts`;
        const response = await axios.get(URL, { withCredentials: true });
        setPosts(response.data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const hasUpvoted = (post) =>
    post.upvotescount.some(userId => userId.toString() === currentUserId.toString());

  const hasDownvoted = (post) =>
    post.downvotescount.some(userId => userId.toString() === currentUserId.toString());

  const handleUpvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/upvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id !== postId) return post;
          if (hasUpvoted(post)) {
            return {
              ...post,
              upvotescount: post.upvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          if (hasDownvoted(post)) {
            return {
              ...post,
              upvotescount: [...post.upvotescount, currentUserId],
              downvotescount: post.downvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          return {
            ...post,
            upvotescount: [...post.upvotescount, currentUserId]
          };
        })
      );
      toast.success('Upvote updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/downvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id !== postId) return post;
          if (hasDownvoted(post)) {
            return {
              ...post,
              downvotescount: post.downvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          if (hasUpvoted(post)) {
            return {
              ...post,
              downvotescount: [...post.downvotescount, currentUserId],
              upvotescount: post.upvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          return {
            ...post,
            downvotescount: [...post.downvotescount, currentUserId]
          };
        })
      );
      toast.success('Downvote updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleExpand = (postId) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const toggleComments = (postId) => {
    setOpenCommentsPostId((prevPostId) => (prevPostId === postId ? null : postId));
  };

  if (loading) {
    return (
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
        <div className="mt-6 text-lg text-white/80 font-semibold">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="relative px-1 py-4 md:py-7 md:pb-32 bg-transparent min-h-full max-w-full overflow-x-hidden select-none">
      
      {/* Header */}
              <div className="flex justify-between items-center mb-8 flex-wrap">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-200 to-fuchsia-300 tracking-tight">
                    Explore Posts
                  </h1>
                  <p className="text-white/70 mt-2">share captures and moments</p>
                </div>
                <Link
                  to="/add-post"
                  className="bg-gradient-to-r from-orange-500 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-400 hover:to-fuchsia-500 transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} /> Create Post
                </Link>
              </div>



      {posts.length === 0 ? (
        <p className="text-lg text-white/60">No posts available</p>
      ) : (
        <div className="overflow-x-auto max-h-[100vh] pr-2">
          <motion.div
            className="flex flex-col gap-8 md:gap-10 pb-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07 }
              }
            }}
          >
            <AnimatePresence>
              {posts
                .filter((post) => post.postimg)
                .map((post, idx) => {
                  const maxLength = 150;
                  const shouldTruncate = post.description.length > maxLength;
                  const truncatedDescription = shouldTruncate
                    ? `${post.description.substring(0, maxLength)}...`
                    : post.description;
                  const isExpanded = expandedPosts[post._id] || false;
                  const isCommentsOpen = openCommentsPostId === post._id;
                  const userUpvoted = hasUpvoted(post);
                  const userDownvoted = hasDownvoted(post);

                  return (
                    <motion.div
                      key={post._id}
                      layout
                      className="relative card bg-black/30 ring-1 ring-inset ring-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-6 md:p-9 transition-transform duration-300 hover:scale-[1.012] hover:shadow-[0_6px_40px_0_rgba(255,118,36,0.12)] w-full max-w-3xl mx-auto"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.34, delay: idx * 0.06 }}
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/${post?.author?._id}`)}
                        className="flex items-center gap-3 group mb-5 focus:outline-none focus-visible:ring-2 ring-primary/90 rounded-full"
                      >
                        <img
                          src={
                            post.author?.profile_pic ||
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'
                          }
                          alt={post.author?.name || 'User'}
                          className="w-12 h-12 rounded-full object-cover border-none group-hover:shadow-md"
                          draggable={false}
                        />
                        <span className="text-lg font-bold text-white/90 group-hover:text-orange-400">{post.author?.name || 'Unknown User'}</span>
                      </button>

                      {post.postimg && (
                        <div className="w-full rounded-2xl overflow-hidden mb-6 relative shadow-lg ring-1 ring-inset ring-white/5">
                          <img
                            src={post.postimg}
                            alt="Post"
                            className="w-full mx-auto bg-black object-cover max-h-72 rounded-2xl transition-all duration-300 hover:scale-105"
                            draggable={false}
                          />
                        </div>
                      )}

                      <p className="text-lg font-semibold text-white/95 mb-2">
                        {isExpanded ? post.description : truncatedDescription}
                      </p>
                      {shouldTruncate && (
                        <button
                          onClick={() => handleToggleExpand(post._id)}
                          className="text-orange-400 font-semibold text-sm hover:underline focus:outline-none mt-2 ml-1"
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}

                      <div className="md:flex grid grid-cols-2 gap-x-4 mb-4 mt-4 text-base font-medium">
                        <span className="text-green-500/75">Upvotes: <span className="font-mono text-white">{post.upvotescount?.length || 0}</span></span>
                        <span className="text-red-500/70">Downvotes: <span className="font-mono text-white">{post.downvotescount?.length || 0}</span></span>
                        <span className="text-sky-300 col-span-2 md:col-span-1">Comments: <span className="font-mono text-white">{post.comments?.length || 0}</span></span>
                      </div>

                      <div className="flex gap-3 md:gap-5 mt-2 flex-wrap">
                        <motion.button
                          type="button"
                          onClick={() => handleUpvote(post._id)}
                          className={`
                            flex items-center gap-2 rounded-xl px-4 py-2 font-bold shadow-lg transition-all
                            outline-none border-none text-white focus:ring-2 focus:ring-green-500/60 select-none
                            ${userUpvoted
                              ? "bg-gradient-to-r from-green-400/80 via-green-600/80 to-emerald-700 ring-green-400/30"
                              : "bg-black/40 hover:bg-green-500/70"
                            }
                            active:scale-95
                          `}
                          whileHover={{ scale: userUpvoted ? 1 : 1.04 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {userUpvoted ? <BiSolidUpvote className="text-xl" /> : <BiUpvote className="text-xl" />}
                          <span>{userUpvoted ? 'Upvoted' : 'Upvote'}</span>
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={() => handleDownvote(post._id)}
                          className={`
                            flex items-center gap-2 rounded-xl px-4 py-2 font-bold shadow-lg transition-all
                            outline-none border-none text-white focus:ring-2 focus:ring-red-500/60 select-none
                            ${userDownvoted
                              ? "bg-gradient-to-r from-red-400/80 via-red-600/80 to-rose-700 ring-red-400/30"
                              : "bg-black/40 hover:bg-red-500/80"
                            }
                            active:scale-95
                          `}
                          whileHover={{ scale: userDownvoted ? 1 : 1.04 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {userDownvoted ? <BiSolidDownvote className="text-xl" /> : <BiDownvote className="text-xl" />}
                          <span>{userDownvoted ? 'Downvoted' : 'Downvote'}</span>
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={() => toggleComments(post._id)}
                          className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold transition duration-200 bg-black/40 text-white hover:bg-blue-500 hover:text-white active:scale-95 focus:ring-2 focus:ring-sky-500/60 shadow-lg select-none"
                          whileHover={{ scale: openCommentsPostId === post._id ? 1 : 1.04 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaRegComment className="text-lg" />
                          <span>Comment</span>
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {isCommentsOpen && (
                          <motion.div
                            key="comments"
                            className="mt-8"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ type: "spring", stiffness: 270, damping: 30 }}
                          >
                            <Comments
                              postId={post._id}
                              previousComments={post.comments}
                              onClose={() => setOpenCommentsPostId(null)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AllPosts;
