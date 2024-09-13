import React from 'react';
import { useState } from 'react';
import axios from 'axios'; // Import axios
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import SearchUser from './SearchUser';
import { useSelector } from 'react-redux';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const _id = useSelector(state => state.user._id);

    // Handle logout
    const handleLogout = async () => {
        try {
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/logout`;
            await axios({
                url,
                method: "GET",
                withCredentials: true
            });
            dispatch(logout());
            localStorage.clear();
            navigate("/email");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="navbar bg-base-100 rounded-2xl">
            <div className="navbar-start">
                <div className="dropdown relative"> {/* Add relative positioning */}
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul
    tabIndex={0}
    className="menu menu-sm dropdown-content bg-black font-extrabold rounded-box mt-3 w-52 p-2 shadow-lg"
    style={{ zIndex: 9999 }} // Set z-index to a high value to ensure it's on top
>
    <button className='hover:text-orange-500' onClick={() => navigate(`/${_id}`)}>Profile</button>
    <button className='hover:text-orange-500' onClick={() => navigate("/rankings")}>Rankings</button>
    <button className='hover:text-orange-500' onClick={handleLogout}>Logout</button>
</ul>

                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-3xl text-orange-500 font-bold nerko-one-regular">Laugh Daily</a>
            </div>
            <div className="navbar-end">
                <button onClick={() => setOpenSearchUser(true)} className="btn btn-ghost btn-circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
            {
                openSearchUser && (
                    <SearchUser onClose={() => setOpenSearchUser(false)} />
                )
            }
        </div>
    );
}

export default Header;
