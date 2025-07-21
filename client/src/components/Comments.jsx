import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from './Avatar';

function Comments({ postId, onClose, previousComments = [] }) {
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState(previousComments);
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/add-comment`;
      const response = await axios.post(URL, { postId, commentContent }, { withCredentials: true });
      setComments(prev => [...prev, response.data.data]);
      setCommentContent('');
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        className="fixed inset-0 z-[111] flex items-center justify-center bg-black/70 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.97, y: 38 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.26 }}
          className="relative bg-gradient-to-br from-black/80 via-[#221c32]/80 to-black/90 w-full max-w-xl md:max-w-2xl rounded-2xl ring-1 ring-inset ring-white/10 shadow-2xl p-0"
        >
          {/* Close Button */}
          <button
            className="absolute right-2 top-2 z-30 p-2 text-white/70 hover:text-red-400 rounded-full bg-black/20 hover:bg-black/40 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={onClose}
            aria-label="Close comments"
          >
            <IoClose size={24} />
          </button>
          {/* Content */}
          <div className="flex flex-col bg-black/60 rounded-2xl p-6 pt-8">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-fuchsia-200 to-yellow-400 tracking-tight">
              Comments
            </h2>
            {/* Comments List */}
            <div className="mb-4 max-h-[32vh] md:max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700/60 scrollbar-track-black/10 px-1">
              {comments.length > 0 ? (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                  className="flex flex-col gap-2"
                >
                  {comments.map((comment, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, scale: 0.97, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-start gap-3 py-3 px-2 rounded-xl hover:bg-white/2 transition-all"
                    >
                      <Avatar
                        width={40}
                        height={40}
                        name={comment.msgbyuserid?.name}
                        imageUrl={comment.msgbyuserid?.profile_pic}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white/90 truncate">
                          {comment.msgbyuserid?.name || 'Anonymous'}
                        </div>
                        <p className="text-white/70 break-words max-w-full mt-0.5 text-base">
                          {comment.commentcontent || 'No content available'}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <div className="text-white/70 p-4 text-center text-base">No comments yet. Be the first to comment!</div>
              )}
            </div>

            {/* New Comment Input */}
            <div className="mb-2">
              <textarea
                className="w-full px-3 py-2 border-none rounded-lg bg-black/40 text-white font-semibold placeholder-white/40 resize-none outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-orange-400/60 transition-all"
                placeholder="Add a comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                aria-label="New comment"
                maxLength={500}
                rows={3}
                disabled={loading}
              />
            </div>
            <motion.button
              className="w-full bg-gradient-to-r from-orange-500 via-fuchsia-600 to-indigo-600 font-bold text-white py-2 rounded-xl shadow-lg mt-2 hover:from-orange-400 hover:to-indigo-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 active:scale-97"
              onClick={handleAddComment}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              aria-busy={loading}
            >
              {loading ? 'Posting...' : 'Submit'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Comments;
