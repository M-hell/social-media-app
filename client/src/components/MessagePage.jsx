import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import { IoMdSend } from "react-icons/io";
import moment from 'moment';
import nsfwjs from 'nsfwjs'; // Import nsfwjs for content moderation
import toast from 'react-hot-toast'; // Import react-hot-toast

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const checkImageForNSFW = async (imageFile) => {
    // Initialize NSFWJS model
    const model = await nsfwjs.load();

    // Create an image element and load the file
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);
    await new Promise((resolve) => { image.onload = resolve; }); // Wait for image to load

    // Get predictions from the model
    const predictions = await model.classify(image);

    // Extract pornographic and hentai probabilities
    const pornProbability = predictions.find(p => p.className === 'Porn')?.probability || 0;
    const hentaiProbability = predictions.find(p => p.className === 'Hentai')?.probability || 0;

    return { pornProbability, hentaiProbability };
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    // Check for NSFW content (porn and hentai)
    const { pornProbability, hentaiProbability } = await checkImageForNSFW(file);

    // If either of the probabilities is greater than 0.5, show a warning and prevent upload
    if (pornProbability > 0.5 || hentaiProbability > 0.5) {
      toast.error('Image contains vulgar content. Please upload a different image.');
      setLoading(false);
      return; // Prevent further action if NSFW content is detected
    }

    // Proceed with uploading the file if it's safe
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(prev => ({
      ...prev,
      imageUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadImage = () => {
    setMessage(prev => ({
      ...prev,
      imageUrl: ""
    }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(prev => ({
      ...prev,
      videoUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadVideo = () => {
    setMessage(prev => ({
      ...prev,
      videoUrl: ""
    }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage(prev => ({
      ...prev,
      text: value
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
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

  return (
    <div className='bg-gray-900 text-white min-h-screen'>
      <header className='sticky top-0 h-16 bg-gray-800 flex justify-between items-center px-4 shadow-md'>
        <div className='flex items-center gap-4'>
          <Link to={"/all-posts"} className='lg:hidden'>
            <FaAngleLeft size={25} className='text-white' />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1 text-white'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {
                dataUser.online ? <span className='text-green-400'>online</span> : <span className='text-gray-400'>offline</span>
              }
            </p>
          </div>
        </div>
      </header>

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-gray-800'>
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {
            allMessage.map((msg, index) => (
              <div key={index} className={`p-3 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-700 text-white" : "bg-gray-700 text-white"}`}>
                <div className='w-full relative'>
                  <h1 className='text-green-400'>
                    {user._id === msg?.msgByUserId ? user.name : dataUser?.name}
                  </h1>
                  {
                    msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className='w-full h-full object-scale-down rounded'
                      />
                    )
                  }
                  {
                    msg?.videoUrl && (
                      <video
                        src={msg.videoUrl}
                        className='w-full h-full object-scale-down rounded'
                        controls
                      />
                    )
                  }
                </div>
                <p className='px-2'>{msg.text}</p>
                <p className='text-xs ml-auto w-fit text-gray-400'>{moment(msg.createdAt).format('hh:mm A')}</p>
              </div>
            ))
          }
        </div>

        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-gray-900 bg-opacity-80 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
              <IoClose size={30} />
            </div>
            <div className='bg-gray-800 p-3'>
              <img
                src={message.imageUrl}
                alt='uploadImage'
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down rounded'
              />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-gray-900 bg-opacity-80 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
              <IoClose size={30} />
            </div>
            <div className='bg-gray-800 p-3'>
              <video
                src={message.videoUrl}
                controls
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down rounded'
              />
            </div>
          </div>
        )}
      </section>

      <section className={`relative bottom-0 w-full bg-gray-900 py-3 flex items-center gap-3 px-4 ${openImageVideoUpload ? "border-t-[1px] border-gray-700" : ""}`}>
        <div className="flex items-center gap-3 relative">
          <button onClick={handleUploadImageVideoOpen} className='bg-teal-700 rounded-full hover:bg-teal-600'>
            <FaPlus size={20} />
          </button>
          <input
            type="file"
            accept="image/*, video/*"
            onChange={handleUploadImageVideoOpen ? (message.imageUrl ? handleUploadVideo : handleUploadImage) : () => {}}
            className="absolute w-0 h-0 opacity-0"
          />
        </div>
        <textarea
          name="text"
          value={message.text}
          onChange={handleOnChange}
          placeholder="Type a message..."
          rows={1}
          className='w-full bg-gray-700 p-3 rounded text-white outline-none'
        />
        <button onClick={handleSendMessage} className='ml-3 text-white'>
          <IoMdSend size={30} />
        </button>
      </section>
    </div>
  );
};

export default MessagePage;
