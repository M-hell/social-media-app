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
  const handleDeletePost = async (postId) => {
    console.log('Deleting post with ID:', postId);
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/delete-post/${postId}`;
    try {
      await axios.delete(URL, { withCredentials: true });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  }

  const handleToggleExpand = (postId) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId]
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
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size too large (max 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      // Show preview while uploading
      const previewUrl = URL.createObjectURL(file);
      setUploadPhoto(previewUrl);
      
      // Upload to Cloudinary
      const uploadedFile = await uploadFile(file);
      
      // Update form data with the new URL
      setEditFormData(prev => ({
        ...prev,
        postimg: uploadedFile.url
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
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
      console.error('Update error:', error);
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
  }, [userId]);

  if (loading && !user) return <div><Loading /></div>;
  if (error) return <p>Error: {error}</p>;

  const visiblePosts = posts.filter((post) => user?.posts?.includes(post._id));

  return (
    <div>
      {user ? (
        <div>
          <OtherProfileCard user={user} />
          
          {user && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
              Warning: {user.warningcount || 0}
            </div>
          )}

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
                const truncatedDescription = post.description?.slice(0, 100) || '';
                const shouldTruncate = post.description?.length > 100;
                const isCommentsOpen = openCommentsPostId === post._id;

                return (
                  <div key={post._id} className="flex justify-center w-full">
                    {editingPost === post._id && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Edit Post</h3>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Image</label>
        <div className='flex flex-col gap-2'>
          <div
            className='h-12 bg-gray-700 flex justify-center items-center border border-gray-600 rounded cursor-pointer hover:border-blue-500 transition duration-500'
            onClick={() => document.getElementById(`edit-postimg-${post._id}`).click()}
          >
            <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
              {uploadPhoto ? "Change image" : "Upload post image"}
            </p>
            {uploadPhoto && (
              <button 
                className='text-lg ml-2 hover:text-red-600' 
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
            <div className='mt-4'>
              <div className="w-full overflow-x-auto">
                <div className="flex justify-center min-w-max">
                  <img 
                    src={uploadPhoto} 
                    alt="Preview" 
                    className='max-w-[500px] max-h-[500px] object-contain rounded border border-gray-600' 
                  />
                </div>
              </div>
            </div>
          )}
          {isUploading && (
            <div className="mt-2 text-blue-400 text-sm">Uploading image...</div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          value={editFormData.description}
          onChange={handleEditChange}
          className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          rows="4"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleEditCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          disabled={isUploading}
        >
          Cancel
        </button>
        <button
          onClick={() => handleEditSubmit(post._id)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isUploading}
        >
          {isUploading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
)}
                  <div
                    key={post._id}
                    className="bg-gray-800 my-5 shadow-lg rounded-lg overflow-hidden p-4 flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl duration-1000 mx-auto w-full sm:w-[600px] md:w-[800px]"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author?.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'}
                        alt={post.author?.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <span className="text-lg font-semibold text-gray-200">{post.author?.name}</span>
                      
                      {post.author?._id === userselector?._id && (
                        <button 
                          onClick={() => handleEditClick(post)}
                          className=" ml-3  text-gray-300 hover:text-white"
                        >
                          <FaEdit size={20} />
                        </button>
                      )}
                      {post.author?._id === userselector?._id && (
                        <button 
                          onClick={() => handleDeletePost(post._id)}
                          className=" text-red-300 "
                        >
                          <MdDelete size={20} />
                        </button>
                      )}
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
                      {shouldTruncate && !isExpanded && '...'}
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
                      <span>Comments: {post.comments?.length || 0}</span>
                    </div>
                    <div className="flex flex-col mt-auto gap-2">
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