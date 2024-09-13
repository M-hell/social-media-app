import React, { useState } from 'react';
import axios from 'axios';
import uploadFile from '../helpers/uploadFile';
import { useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function AddThread() {
    const [data, setData] = useState({
        postimg: "",
        description: "",
    });
    const navigate = useNavigate();


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/add-post`;
            const response = await axios.post(URL, data, {
                withCredentials: true,  // Include credentials such as cookies
            });
            if (response.status === 200) {
                toast.success('Post uploaded successfully!');
                navigate('/all-threads'); // Navigate to home after successful upload
            }
        } catch (error) {
            console.error('Error uploading post:', error);
            toast.error('Failed to upload post. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Add Threads</h2>
            
            {/* Back to Home Button */}
            <button 
                onClick={() => navigate('/')}
                className="mb-4 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-500"
            >
                Back to Home Page
            </button>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
                

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-gray-400 text-sm">Enter your question:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={handleOnChange}
                        className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition duration-500"
                        placeholder="Post your question"
                        rows={4}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default AddThread;
