import React, { useState, useEffect } from 'react';
import Loading from './Loading'; // Ensure this is a valid component
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Ranking() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [sortby, setSortBy] = useState("upvotes");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/ranking`;
                const response = await axios({
                    url: URL,
                    method: "POST",
                    data: {
                        sortby
                    },
                    withCredentials: true
                });
                console.log(response.data.data);
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [sortby]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Rankings</h1>
                <button
                    onClick={() => navigate('/')}
                    className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-900 transition"
                >
                   &lt;  Back to Home
                </button>
            </div>
            <div className="mb-4">
                <label htmlFor="sortby" className="mr-2">Sort By:</label>
                <select
                    id="sortby"
                    value={sortby}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="upvotes">Upvotes</option>
                    <option value="followers">Followers</option>
                </select>
            </div>
            {isLoading ? (
                <Loading /> // Use the Loading component
            ) : users.length === 0 ? (
                <p>No users found</p>
            ) : (
                <div className="overflow-y-auto h-[80vh]">
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div
                                onClick={() => navigate(`/${user._id}`)}
                                key={user._id}
                                className="card bg-gray-700 cursor-pointer border border-gray-600 text-white shadow-lg rounded-lg flex items-center p-4 transition-transform duration-500 hover:scale-100 hover:bg-gray-800 hover:shadow-2xl"
                            >
                                <img
                                    src={user.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'}
                                    alt={user.name || 'Default User'}
                                    className="w-16 h-16 object-cover rounded-full flex justify-center items-center border-4 border-gray-600 transition-transform duration-500 hover:scale-110"
                                />
                                <div className="flex-1 flex flex-col">
                                    <h2 className="text-lg flex justify-center items-center font-bold mb-1">{user.name}</h2>
                                    <p className="text-sm flex justify-center items-center text-gray-400 mb-2">{user.email}</p>
                                    <div className="flex space-x-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-semibold">{user.upvotes}</span>
                                            <span className="text-xs text-gray-400">Upvotes</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-semibold">{user.followers.length}</span>
                                            <span className="text-xs text-gray-400">Followers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ranking;
