import React, { useState } from 'react';
import axios from 'axios';
import uploadFile from '../helpers/uploadFile';
import { useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import * as nsfwjs from 'nsfwjs';

function AddPost() {
    const [data, setData] = useState({
        postimg: "",
        description: "",
    });

    const [uploadPhoto, setUploadPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            try {
                const uploadedFile = await uploadFile(file); // Assuming uploadFile returns the URL of the uploaded file
                setUploadPhoto(URL.createObjectURL(file)); // Set the preview of the uploaded image
                setData((prev) => ({
                    ...prev,
                    postimg: uploadedFile?.url // Storing the image URL in the form data
                }));
            } catch (error) {
                toast.error('Error uploading photo. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClearUploadPhoto = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setUploadPhoto(null);
        setData((prev) => ({
            ...prev,
            postimg: ""
        }));
    };

    // NSFW Check function
    const checkImageForNSFW = async (imageUrl) => {
        const model = await nsfwjs.load();
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;

        return new Promise((resolve, reject) => {
            img.onload = async () => {
                const predictions = await model.classify(img);
                console.log('NSFW Probability:', predictions);

                const pornPrediction = predictions.find(p => p.className === 'Porn');
                const hentaiPrediction = predictions.find(p => p.className === 'Hentai');

                const pornProbability = pornPrediction?.probability || 0;
                const hentaiProbability = hentaiPrediction?.probability || 0;

                // Return both probabilities
                resolve({ pornProbability, hentaiProbability });
            };
            img.onerror = reject;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.postimg) {
            toast.error('Please upload an image before submitting.');
            return;
        }

        if (!data.description.trim()) {
            toast.error('Please enter a description.');
            return;
        }

        setLoading(true);

        try {
            // Check the image for NSFW content before uploading
            const { pornProbability, hentaiProbability } = await checkImageForNSFW(data.postimg);

            if (pornProbability > 0.5 || hentaiProbability > 0.5) {
                toast.error('Image contains vulgar content. Please upload a different image.');
                setLoading(false);
                return;
            }

            const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/add-post`;
            const response = await axios.post(URL, data, {
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success('Post uploaded successfully!');
                navigate('/'); // Navigate to home after successful upload
            }
        } catch (error) {
            console.error('Error uploading post:', error);
            toast.error('Failed to upload post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Add Post</h2>
            
            {/* Back to Home Button */}
            <button 
                onClick={() => navigate('/')}
                className="mb-4 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-500"
            >
                Back to Home Page
            </button>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
                {/* Upload Photo Section */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='postimg' className='text-gray-400 text-sm'>Photo:</label>
                    <div
                        className='h-12 bg-gray-700 flex justify-center items-center border border-gray-600 rounded cursor-pointer hover:border-primary transition duration-500'
                        onClick={() => document.getElementById('postimg').click()} // Trigger file input click
                    >
                        <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                            {uploadPhoto ? "Photo selected" : "Upload post image"}
                        </p>
                        {uploadPhoto && (
                            <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto} aria-label="Clear photo">
                                <IoClose />
                            </button>
                        )}
                    </div>
                    <input
                        type='file'
                        id='postimg'
                        name='postimg'
                        className='hidden'
                        onChange={handleUploadPhoto}
                    />
                    {/* Preview Image */}
                    {uploadPhoto && (
                        <div className='mt-4'>
                            <img 
                                src={uploadPhoto} 
                                alt="Preview" 
                                className='w-64 h-64 object-cover rounded border border-gray-600' 
                            />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-gray-400 text-sm">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={handleOnChange}
                        className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition duration-500"
                        placeholder="Enter a description for your post"
                        rows={4}
                        required
                    />
                </div>

                {/* Warning Box */}
                <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-500">
                    <p className="text-sm font-bold">Warning:</p>
                    <p className="text-sm">If the image or description contains any vulgar content, the post will not be uploaded or deleted afterwards automatically by moderator.</p>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className={`bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Checking for inappropriate content...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default AddPost;
