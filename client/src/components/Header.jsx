import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import SearchUser from './SearchUser';
import logo from '../assets/logo.png';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const _id = useSelector((state) => state.user._id);

    // Handle logout
    const handleLogout = async () => {
        try {
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/logout`;
            await axios.get(url, { withCredentials: true });
            dispatch(logout());
            localStorage.clear();
            navigate('/email');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="navbar bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white rounded-xl shadow-md p-2">
            <div className="navbar-start">
                <div className="dropdown relative">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-gray-900 font-semibold text-white rounded-box mt-3 w-52 p-2 shadow-lg"
                        style={{ zIndex: 9999 }}
                    >
                        <li>
                            <button className="hover:text-orange-500" onClick={() => navigate(`/${_id}`)}>Profile</button>
                        </li>
                        <li>
                            <button className="hover:text-orange-500" onClick={() => navigate("/rankings")}>Rankings</button>
                        </li>
                        <li>
                            <button className="hover:text-orange-500" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center flex items-center space-x-2">
                <div className="bg-orange-500 rounded-full p-2 flex items-center justify-center">
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                </div>
                <a className="btn btn-ghost text-2xl text-orange-500 font-bold nerko-one-regular tracking-wide">Laugh Daily</a>
            </div>
            <div className="navbar-end flex items-center space-x-4">
                {/* Video Calling Button */}
                <a
                    href="https://meow-meet.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white rounded-full py-2 px-4 flex items-center space-x-2 hover:bg-blue-600 transition duration-300"
                >
                    <span>Video Calling</span>
                </a>
                
                {/* Search Button */}
                <button 
                    onClick={() => setOpenSearchUser(true)} 
                    className="bg-orange-500 text-white rounded-full py-2 px-4 hover:bg-orange-600 transition duration-300 flex items-center justify-center"
                >
                    Search
                </button>
            </div>
            {openSearchUser && (
                <SearchUser onClose={() => setOpenSearchUser(false)} />
            )}
        </div>
    );
}

export default Header;
