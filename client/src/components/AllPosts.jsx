import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Comments from './Comments';
import { useNavigate } from 'react-router-dom';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-posts`;
        const response = await axios.get(URL, { withCredentials: true });
        setPosts(response.data.data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPosts();
  }, [openCommentsPostId]);

  const handleUpvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/upvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, upvotescount: post.upvotescount + 1 }
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
            ? { ...post, downvotescount: post.downvotescount + 1 }
            : post
        )
      );
      toast.success('Downvote successful');
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

  return (
    <div className="p-4 bg-gray-900 text-gray-200 overflow-y-auto max-h-screen">
      <div className="mb-4 flex justify-end">
        <Link
          to="/add-post"
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-300"
        >
          Add Post
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      {posts.length === 0 ? (
        <p className="text-lg">No posts available</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts
            .filter((post) => post.postimg) // Filter out posts without images
            .map((post) => {
              const maxLength = 150;
              const shouldTruncate = post.description.length > maxLength;
              const truncatedDescription = shouldTruncate
                ? `${post.description.substring(0, maxLength)}...`
                : post.description;
              const isExpanded = expandedPosts[post._id] || false;
              const isCommentsOpen = openCommentsPostId === post._id;

              return (
                <div
                  key={post._id}
                  className="bg-gray-800 shadow-lg rounded-lg overflow-hidden p-4 flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl duration-1000 mx-auto w-full sm:w-[600px] md:w-[800px]"
                >
                  <div
                    onClick={() => navigate(`/${post?.author?._id}`)}
                    className="flex items-center cursor-pointer hover:bg-zinc-900 transition-all duration-1000 p-2 rounded-lg hover:text-blue-700 mb-4 text-gray-200"
                  >
                    <img
                      src={
                        post.author.profile_pic ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'
                      }
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <span className="text-lg font-semibold">{post.author.name}</span>
                  </div>

                  {post.postimg && (
                    <div className="w-full mb-4 flex justify-center">
                      <img
                        src={post.postimg}
                        alt="Post Image"
                        className="w-full max-h-60 object-contain"
                      />
                    </div>
                  )}

                  <p className="text-lg font-semibold mb-2">
                    {isExpanded ? post.description : truncatedDescription}
                  </p>

                  {shouldTruncate && (
                    <button
                      onClick={() => handleToggleExpand(post._id)}
                      className="text-blue-500 mt-2"
                    >
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}

                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span className="text-gray-400">Upvotes: {post.upvotescount}</span>
                    <span className="text-gray-400">Downvotes: {post.downvotescount}</span>
                  </div>
                  <div className="text-gray-400 mb-4 text-sm sm:text-base">
                    <span>Comments: {post.comments.length}</span>
                  </div>

                  {/* Responsive Buttons */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 mt-auto">
                    <button
                      onClick={() => handleUpvote(post._id)}
                      className="bg-green-500 text-white py-1 px-3 flex justify-center items-center rounded-md hover:bg-green-600 transition-colors duration-300 w-full sm:w-auto"
                    >
                      <BiUpvote className="mr-2" /> Upvote
                    </button>
                    <button
                      onClick={() => handleDownvote(post._id)}
                      className="bg-red-500 text-white py-1 px-3 flex justify-center items-center rounded-md hover:bg-red-600 transition-colors duration-300 w-full sm:w-auto"
                    >
                      <BiDownvote className="mr-2" /> Downvote
                    </button>
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="bg-blue-500 text-white py-1 px-3 flex justify-center items-center rounded-md hover:bg-blue-600 transition-colors duration-300 w-full sm:w-auto"
                    >
                      <FaRegComment className="mr-2" /> Comment
                    </button>
                  </div>

                  {isCommentsOpen && (
                    <Comments
                      postId={post._id}
                      previousComments={post.comments}
                      onClose={() => setOpenCommentsPostId(null)}
                    />
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default AllPosts;
