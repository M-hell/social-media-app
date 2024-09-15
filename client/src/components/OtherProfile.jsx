import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import toast from 'react-hot-toast';
import Loading from './Loading';
import OtherProfileCard from './OtherProfileCard';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Comments from './Comments';

function OtherProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  
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
  }, [openCommentsPostId]);

  const handleUpvote = async (postId) => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/upvote`;
      await axios.post(URL, { postId }, { withCredentials: true });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, upvotescount: post.upvotescount + 1 } : post
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
          post._id === postId ? { ...post, downvotescount: post.downvotescount + 1 } : post
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
    setOpenCommentsPostId(prevPostId => prevPostId === postId ? null : postId);
  };

  const fetchUser = async () => {
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/other-user-details`;
    try {
      const response = await axios.post(URL, { userId }, { withCredentials: true });
      if (response.data && response.data.data) {
        setUser(response.data.data);
        console.log(response.data.message || 'User data fetched successfully');
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
  }, [userId]);

  if (loading) return <div><Loading /></div>;
  if (error) return <p>Error: {error}</p>;

  const visiblePosts = posts.filter((post) => user.posts.includes(post._id));

  return (
    <div>
      {user ? (
        <div>
          <OtherProfileCard user={user} />
          <div className="join mb-4 w-full lg:w-auto flex justify-center my-3">
            <button className='btn join-item bg-gray-600 text-gray-300'>
              Posts and Threads
            </button>
          </div>
          <div className="flex flex-col items-center mt-4">
            {visiblePosts.length === 0 ? (
              <p className="text-gray-400 text-lg mt-4">This user has no posts or threads.</p>
            ) : (
              visiblePosts.map((post) => {
                const isExpanded = expandedPosts[post._id];
                const truncatedDescription = post.description.slice(0, 100);
                const shouldTruncate = post.description.length > 100;
                const isCommentsOpen = openCommentsPostId === post._id;

                return (
                  <div
                    key={post._id}
                    className="bg-gray-800 my-5 shadow-lg rounded-lg overflow-hidden p-4 flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl duration-1000 mx-auto w-full sm:w-[600px] md:w-[800px]"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <span className="text-lg font-semibold text-gray-200">{post.author.name}</span>
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
              })
            )}
          </div>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}

export default OtherProfile;
