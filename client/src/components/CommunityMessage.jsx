import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import Loading from './Loading';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosVideocam } from "react-icons/io";

const CommunityMessage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const communityId = params.communityId;
  const navigate = useNavigate();

  const [communityData, setCommunityData] = useState({
    name: "",
    createdBy: {},
    participants: [],
    participantCount: 0,
    _id: ""
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessages]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const uploadPhoto = await uploadFile(file);
      setMessage(prev => ({
        ...prev,
        imageUrl: uploadPhoto.url
      }));
    } catch {
      toast.error("Failed to upload image");
    }
    setOpenImageVideoUpload(false);
    setLoading(false);
  };

  const handleClearUploadImage = () => {
    setMessage(prev => ({
      ...prev,
      imageUrl: ""
    }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const uploadPhoto = await uploadFile(file);
      setMessage(prev => ({
        ...prev,
        videoUrl: uploadPhoto.url
      }));
    } catch {
      toast.error("Failed to upload video");
    }
    setOpenImageVideoUpload(false);
    setLoading(false);
  };

  const handleClearUploadVideo = () => {
    setMessage(prev => ({
      ...prev,
      videoUrl: ""
    }));
  };
    const handleCreateConference = async () => {
        
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/group-call`;
      const response = await axios.post(URL, {
        communityId: communityId,
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        const roomId = response.data.data.roomId;
        navigate(`/meetingroom/${roomId}`);
      }
    } catch (error) {
      toast.error("Error creating conference");
    }
  };

  useEffect(() => {
    if (socketConnection && communityId) {
      // Join community chat
      socketConnection.emit('message-page-community', communityId);
      
      // Listen for community details
      socketConnection.on('community-details', (data) => {
        console.log('Community details received:', data);
        setCommunityData(data);
      });
      
      // Listen for community messages
      socketConnection.on('community-messages', (data) => {
        console.log('Community messages received:', data);
        setAllMessages(data);
      });
      
      // Listen for new messages
      socketConnection.on('new-community-message-received', (data) => {
        console.log('New community message received:', data);
        if (data.communityId === communityId) {
          setAllMessages(prev => [...prev, data.message]);
        }
      });

      // Listen for errors
      socketConnection.on('error', (error) => {
        toast.error(error.message || 'Something went wrong');
      });
    }

    // Cleanup listeners
    return () => {
      if (socketConnection) {
        socketConnection.off('community-details');
        socketConnection.off('community-messages');
        socketConnection.off('new-community-message-received');
        socketConnection.off('error');
        // Leave community room when component unmounts
        if (communityId) {
          socketConnection.emit('leave-community', communityId);
        }
      }
    };
  }, [socketConnection, communityId]);

  const handleOnChange = (e) => {
    setMessage(prev => ({
      ...prev,
      text: e.target.value
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new-community-message', {
          communityId: communityId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
          name: user.name
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        });
      }
    }
  };

  // Helper function to get message sender info
  const getMessageSender = (msg) => {
    if (msg.msgByUserId?._id === user._id) {
      return { name: user.name, profile_pic: user.profile_pic };
    }
    
    // If message has populated user data
    if (msg.msgByUserId?.name) {
      return { 
        name: msg.msgByUserId.name, 
        profile_pic: msg.msgByUserId.profile_pic 
      };
    }
    
    // Fallback to message name
    return { name: msg.name, profile_pic: "" };
  };

  if (!communityId) {
    return (
      <div className="bg-gradient-to-br from-[#181325] via-[#191a30] to-black min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-center text-white">
          No community selected
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#181325] via-[#191a30] to-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 h-20 bg-black/70 flex justify-between items-center px-5 shadow-xl z-[2] ring-1 ring-white/10">
        <div className="flex items-center gap-4 relative w-full">
          <Link to={"/community"} className="lg:hidden">
            <FaAngleLeft size={25} className="text-white" />
          </Link>
          
          {/* Community Avatar */}
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
            <MdGroups size={24} className="text-white" />
          </div>
          
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1 text-white">
              {communityData?.name || 'Loading...'}
            </h3>
            <p className="-my-2 text-sm text-gray-400">
              {communityData.participantCount} participants
            </p>
          </div>
          
          {/* Create Conference Button */}
          <div className="absolute right-0 top-0 p-1 flex flex-col items-center">
                      <IoIosVideocam
                        size={24}
                        className="text-blue-500 cursor-pointer hover:scale-110 transition"
                        title="Create Conference"
                        onClick={handleCreateConference}
                      />
                      <span className="text-xs text-gray-400">Conference Call</span>
                    </div>
        </div>
      </header>

      {/* Chat Section */}
      <section className="h-[calc(100vh-180px)] overflow-x-hidden overflow-y-auto bg-black/60 px-2 md:px-8 py-5 relative">
        <div className="flex flex-col gap-3 pb-4" ref={currentMessage}>
          <AnimatePresence>
            {allMessages.map((msg, index) => {
              const sender = getMessageSender(msg);
              const isOwnMessage = msg.msgByUserId?._id === user._id || msg.msgByUserId === user._id;
              
              return (
                <motion.div
                  key={msg._id || index}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className={`p-3 rounded-2xl w-fit max-w-[320px] md:max-w-sm lg:max-w-md break-all ${
                    isOwnMessage
                      ? "ml-auto bg-gradient-to-r from-teal-800 via-teal-700 to-slate-800 text-white"
                      : "bg-gradient-to-r from-zinc-800 via-gray-800 to-black text-white"
                  } shadow-lg relative`}
                >
                  {/* Sender Avatar and Name */}
                  {!isOwnMessage && (
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar
                        width={24}
                        height={24}
                        imageUrl={sender.profile_pic}
                        name={sender.name}
                      />
                      <span className="text-teal-300 font-bold text-sm">
                        {sender.name}
                      </span>
                    </div>
                  )}
                  
                  {isOwnMessage && (
                    <h1 className="text-teal-300 font-bold text-sm mb-1">
                      You
                    </h1>
                  )}

                  <div className="w-full relative">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-auto mt-2 max-h-56 object-cover rounded-xl ring-1 ring-white/20"
                        alt="sent"
                      />
                    )}
                    {msg?.videoUrl && (
                      <video
                        src={msg.videoUrl}
                        className="w-full h-auto mt-2 max-h-56 object-cover rounded-xl ring-1 ring-white/20"
                        controls
                        muted
                        autoPlay
                      />
                    )}
                  </div>
                  
                  {msg.text && <p className="px-2">{msg.text}</p>}
                  
                  <p className="text-xs ml-auto w-fit text-white/40 pt-1">
                    {moment(msg.createdAt).format('hh:mm A')}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Image Upload Preview */}
        <AnimatePresence>
          {message.imageUrl && (
            <motion.div
              className="fixed left-0 right-0 bottom-[96px] z-50 bg-black/80 flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative bg-black/80 rounded-xl p-3 flex flex-col items-center shadow-lg">
                <button
                  className="absolute -top-3 -right-3 bg-black/90 rounded-full p-1 hover:text-red-500 text-white/70"
                  onClick={handleClearUploadImage}
                  aria-label="Remove image"
                  type="button"
                >
                  <IoClose size={25} />
                </button>
                <img 
                  src={message.imageUrl} 
                  alt="upload preview" 
                  className="max-w-xs max-h-60 object-contain rounded-lg border border-zinc-700" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Upload Preview */}
        <AnimatePresence>
          {message.videoUrl && (
            <motion.div
              className="fixed left-0 right-0 bottom-[96px] z-50 bg-black/80 flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative bg-black/80 rounded-xl p-3 flex flex-col items-center shadow-lg">
                <button
                  className="absolute -top-3 -right-3 bg-black/90 rounded-full p-1 hover:text-red-500 text-white/70"
                  onClick={handleClearUploadVideo}
                  aria-label="Remove video"
                  type="button"
                >
                  <IoClose size={25} />
                </button>
                <video 
                  src={message.videoUrl} 
                  className="max-w-xs max-h-60 object-contain rounded-lg border border-zinc-700" 
                  controls 
                  autoPlay 
                  muted 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loader */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className='fixed left-0 right-0 bottom-[96px] z-[51] flex justify-center items-center'
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.14 }}
            >
              <Loading />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Chat Input */}
      <section className="h-20 bg-black/80 flex items-center px-5 shadow-xl border-t border-white/10">
        {/* Attach Button */}
        <div className="relative mr-2">
          <motion.button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full bg-gradient-to-tr from-teal-600 to-sky-700 shadow-lg hover:from-teal-500 hover:to-teal-600 text-white"
            whileTap={{ scale: 0.93 }}
            aria-label="Attach"
            type="button"
          >
            <FaPlus size={20} />
          </motion.button>
          
          <AnimatePresence>
            {openImageVideoUpload && (
              <motion.div
                key="upload-popup"
                className="absolute -top-32 left-0 mb-1 bg-black/95 shadow-xl rounded-xl w-36 p-2 border border-white/15 z-40 flex flex-col gap-2"
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.97 }}
                transition={{ duration: 0.16 }}
              >
                <form>
                  <label htmlFor='uploadImage' className='flex items-center gap-3 p-2 hover:bg-gray-700/85 cursor-pointer rounded-lg'>
                    <FaImage size={18} className="text-teal-300" />
                    <span className='text-white font-medium'>Image</span>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center gap-3 p-2 hover:bg-gray-700/85 cursor-pointer rounded-lg'>
                    <FaVideo size={18} className="text-teal-300" />
                    <span className='text-white font-medium'>Video</span>
                  </label>
                  <input 
                    type="file" 
                    id="uploadImage" 
                    className='hidden' 
                    accept="image/*" 
                    onChange={handleUploadImage} 
                  />
                  <input 
                    type="file" 
                    id="uploadVideo" 
                    className='hidden' 
                    accept="video/*" 
                    onChange={handleUploadVideo} 
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text box and send button */}
        <form className="w-full flex items-center gap-2" onSubmit={handleSendMessage} autoComplete="off">
          <input
            name="text"
            type="text"
            placeholder="Type a message in the community..."
            className="w-full text-sm placeholder-gray-400 focus:outline-none p-3 rounded-xl bg-black/30 text-white focus:ring-2 focus:ring-teal-500/60 transition-all"
            onChange={handleOnChange}
            value={message.text}
            disabled={loading}
            autoFocus
          />
          <motion.button
            type="submit"
            className="flex justify-center items-center w-12 h-12 rounded-full bg-gradient-to-tr from-teal-600 to-blue-500 shadow-lg text-white hover:bg-teal-700 focus:ring-2 focus:ring-blue-400/90"
            whileTap={{ scale: 0.93 }}
            aria-label="Send Message"
            disabled={loading || (!message.text && !message.imageUrl && !message.videoUrl)}
          >
            <IoMdSend size={25} />
          </motion.button>
        </form>
      </section>
    </div>
  );
};

export default CommunityMessage;
