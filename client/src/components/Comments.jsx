import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa'; // Example close icon

function Comments({ postId, onClose, previousComments = [] }) {
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState(previousComments); // Initialize comments state

  // Function to add comments
  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/add-comment`;
      const response = await axios.post(URL, { postId, commentContent }, { withCredentials: true });

      // Update the local comments list
      setComments(prevComments => [...prevComments, response.data.data]);
      setCommentContent(''); // Clear the comment input
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-md shadow-md relative w-4/5 max-w-2xl text-white">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          onClick={onClose}
          aria-label="Close comments"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {/* Render previous comments */}
        <div className="mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex items-center border-b border-gray-600 py-3">
                {/* Profile Picture */}
                <img
                  src={comment.msgbyuserid?.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'}
                  alt={comment.msgbyuserid?.name || 'User Avatar'}
                  className="w-10 h-10 rounded-full mr-4"
                />
                
                {/* Comment Details */}
                <div className="flex-1">
                  <div className="font-semibold">{comment.msgbyuserid?.name || 'Anonymous'}</div>
                  <p className="text-gray-400">{comment.commentcontent || 'No content available'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Input for new comment */}
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Add a comment"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            aria-label="New comment"
          />
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-all duration-200"
          onClick={handleAddComment}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Comments;
