import React, { useEffect, useState } from 'react';
import { FaUserFriends } from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from 'axios';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Use Link for routing
import { useNavigate } from 'react-router-dom';

function UserSidebar() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const _id = useSelector(state => state.user._id);
    const navigate = useNavigate();

    const getUsers = async () => {
        setLoading(true);
        try {
            const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-followers-following`;
            const response = await axios.post(URL, { _id }, { withCredentials: true });

            if (response.data.data.length === 0) {
                toast.error("No users found");
            } else {
                const uniqueUsers = Array.from(new Set(response.data.data.map(user => user._id)))
                    .map(id => response.data.data.find(user => user._id === id));
                setUsers(uniqueUsers);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
            navigate("/all-posts");
        }
    };

    useEffect(() => {
        if (_id) {
            getUsers();
        }
    }, [_id]);

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col items-center justify-center">
                <label htmlFor="my-drawer-3" className="text-3xl drawer-button lg:hidden">
                    <FaUserFriends />
                </label>
            </div>

            <div className="drawer-side fixed top-0 left-0 z-50 lg:relative">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>

                <div className="bg-base-200 text-base-content p-4 h-[80vh] w-[65vw] lg:w-[18vw] max-h-[90vh] lg:max-h-[85vh] flex-col justify-center items-center overflow-y-auto rounded-lg shadow-lg mx-4 my-2 lg:mx-0 lg:my-0">
                    <h2 className='text-xl font-bold mb-2'>Friends</h2>
                    <hr className='mb-2' />

                    {loading ? (
                        <Loading />
                    ) : users.length === 0 ? (
                        <p className="text-center text-gray-500">No users found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <Link key={user._id} to={`/${user._id}`} className="bg-gray-600 hover:border hover:border-orange-500 hover:bg-slate-950 text-white rounded-lg shadow-sm p-2 flex items-center space-x-3">
                                    <img
                                        src={user.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'}
                                        alt={user.name || 'Default User'}
                                        className="w-12 h-12 object-cover rounded-full border border-gray-300"
                                    />
                                    <div className="flex-1">
                                        <span className="block text-sm font-medium">
                                            {user.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserSidebar;