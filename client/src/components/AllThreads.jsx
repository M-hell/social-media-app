import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BiUpvote, BiDownvote, BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Comments from './Comments';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AllThreads() {
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
        toast.error('Error fetching posts: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [openCommentsPostId]);

  const hasUpvoted = (post) => {
    return post.upvotescount.some(userId => userId.toString() === currentUserId.toString());
  };

  const hasDownvoted = (post) => {
    return post.downvotescount.some(userId => userId.toString() === currentUserId.toString());
  };

  const handleUpvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/upvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id !== postId) return post;
          
          // If already upvoted, remove the vote
          if (hasUpvoted(post)) {
            return {
              ...post,
              upvotescount: post.upvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          
          // If downvoted, switch to upvote
          if (hasDownvoted(post)) {
            return {
              ...post,
              upvotescount: [...post.upvotescount, currentUserId],
              downvotescount: post.downvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          
          // Add new upvote
          return {
            ...post,
            upvotescount: [...post.upvotescount, currentUserId]
          };
        })
      );
      
      toast.success('Upvote updated');
    } catch (error) {
      toast.error('Error upvoting post: ' + error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/downvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id !== postId) return post;
          
          // If already downvoted, remove the vote
          if (hasDownvoted(post)) {
            return {
              ...post,
              downvotescount: post.downvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          
          // If upvoted, switch to downvote
          if (hasUpvoted(post)) {
            return {
              ...post,
              downvotescount: [...post.downvotescount, currentUserId],
              upvotescount: post.upvotescount.filter(id => id.toString() !== currentUserId.toString())
            };
          }
          
          // Add new downvote
          return {
            ...post,
            downvotescount: [...post.downvotescount, currentUserId]
          };
        })
      );
      
      toast.success('Downvote updated');
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
    return <div className="p-4 bg-gray-900 text-gray-200">Loading threads...</div>;
  }

  return (
    <div className="p-4 bg-gray-900 text-gray-200 overflow-y-auto max-h-screen">
      <div className="mb-4 flex justify-end">
        <Link
          to="/add-thread"
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-300"
        >
          Add Thread
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">All Threads</h1>
      {posts.length === 0 ? (
        <p className="text-lg">No threads available</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts
            .filter(post => !post.postimg && post.description)
            .map(post => {
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
                        post.author?.profile_pic ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'
                      }
                      alt={post.author?.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <span className="text-lg font-semibold">{post.author?.name || 'Unknown User'}</span>
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
                    <span className="text-gray-400">Upvotes: {post.upvotescount?.length || 0}</span>
                    <span className="text-gray-400">Downvotes: {post.downvotescount?.length || 0}</span>
                  </div>
                  <div className="text-gray-400 mb-4 text-sm sm:text-base">
                    <span>Comments: {post.comments?.length || 0}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 mt-auto">
                    <button
                      onClick={() => handleUpvote(post._id)}
                      className={`${userUpvoted ? 'bg-green-700' : 'bg-green-500'} text-white py-1 px-3 flex justify-center items-center rounded-md hover:bg-green-600 transition-colors duration-300 w-full sm:w-auto`}
                    >
                      {userUpvoted ? <BiSolidUpvote className="mr-2" /> : <BiUpvote className="mr-2" />}
                      {userUpvoted ? 'Upvoted' : 'Upvote'}
                    </button>
                    <button
                      onClick={() => handleDownvote(post._id)}
                      className={`${userDownvoted ? 'bg-red-700' : 'bg-red-500'} text-white py-1 px-3 flex justify-center items-center rounded-md hover:bg-red-600 transition-colors duration-300 w-full sm:w-auto`}
                    >
                      {userDownvoted ? <BiSolidDownvote className="mr-2" /> : <BiDownvote className="mr-2" />}
                      {userDownvoted ? 'Downvoted' : 'Downvote'}
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

export default AllThreads;