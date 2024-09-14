import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Comments from './Comments';

function AllThreads() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null); // Track the post with an open comment section
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-posts`;
        const response = await axios.get(URL, { withCredentials: true });
        setPosts(response.data.data);
      } catch (error) {
        toast.error('Error fetching posts: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [openCommentsPostId]);

  const handleUpvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/upvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, upvotescount: post.upvotescount + 1 }
            : post
        )
      );
      toast.success('Upvote successful');
    } catch (error) {
      toast.error('Error upvoting post: ' + error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/downvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, downvotescount: post.downvotescount + 1 }
            : post
        )
      );
      toast.success('Downvote successful');
    } catch (error) {
      toast.error('Error downvoting post: ' + error.message);
    }
  };

  const handleToggleExpand = (postId) => {
    setExpandedPosts(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const toggleComments = (postId) => {
    setOpenCommentsPostId(prevPostId => prevPostId === postId ? null : postId);
  };

  if (loading) {
    return <p className="text-lg text-gray-200">Loading Threads...</p>;
  }

  return (
    <div className="p-4 bg-gray-900 text-gray-200 overflow-y-auto max-h-screen">
      <div className="mb-4 flex justify-end">
        <Link
          to="/add-thread"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Add Threads
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">All Threads</h1>
      {posts.length === 0 ? (
        <p className="text-lg">No posts available</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts
            .filter(post => !post.postimg && post.description) // Show only posts without images and with descriptions
            .map(post => {
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
                  <div className="flex items-center mb-4">
                    <img
                      src={post.author.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <span className="text-lg font-semibold text-gray-200">{post.author.name}</span>
                  </div>

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
                  <div className="flex flex-col mt-auto">
                    <button
                      onClick={() => handleUpvote(post._id)}
                      className="bg-green-500 text-white py-1 px-3 flex justify-center items-center rounded-md hover:bg-green-600 transition-colors duration-300"
                    >
                      <BiUpvote /> Upvote
                    </button>
                    <button
                      onClick={() => handleDownvote(post._id)}
                      className="bg-red-500 text-white py-1 px-3 flex justify-center items-center rounded-md hover:bg-red-600 transition-colors duration-300"
                    >
                      <BiDownvote /> Downvote
                    </button>
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="bg-blue-500 text-white py-1 flex justify-center items-center px-3 rounded-md hover:bg-blue-600 transition-colors duration-1000 mb-2"
                    >
                      <FaRegComment /> Comment
                    </button>

                    {isCommentsOpen && (
                      <Comments postId={post._id} previousComments={post.comments} onClose={() => setOpenCommentsPostId(null)} />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default AllThreads;
