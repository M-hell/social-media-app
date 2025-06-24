import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import SearchUser from './SearchUser';
import logo from '../assets/logo.png';
import { IoCall, IoClose } from 'react-icons/io5';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [endingMeetingId, setEndingMeetingId] = useState(null);
  const _id = useSelector((state) => state.user._id);

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

  const handleShowMeetings = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-meetings`;
      const res = await axios.get(url, { withCredentials: true });
      setMeetings(res.data.data || []);
      setShowMeetings(true);
    } catch (err) {
      console.error("Error fetching meetings", err);
    }
  };

  const handleEndMeeting = async (meeting) => {
    if (meeting.groupCall) return;

    const participant = meeting.participants.find((p) => p._id !== _id);
    if (!participant) return;

    setEndingMeetingId(meeting._id);

    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/end-meeting`;
      await axios.post(
        url,
        {
          userId: _id,
          participantId: participant._id,
        },
        { withCredentials: true }
      );

      // Remove the ended meeting from UI
      setMeetings(prev => prev.filter(m => m._id !== meeting._id));
    } catch (err) {
      console.error("Failed to end meeting", err);
    } finally {
      setEndingMeetingId(null);
    }
  };

  return (
    <div className="navbar bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white rounded-xl shadow-md p-2 relative">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
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
        {/* Call Icon */}
        <button
          onClick={handleShowMeetings}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
          title="View Meetings"
        >
          <IoCall size={22} />
        </button>

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

      {/* Meeting Popup */}
      {showMeetings && (
        <div className="absolute top-20 right-4 bg-gray-900 text-white shadow-lg rounded-lg p-4 w-80 z-[9999] max-h-[400px] overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-orange-500">Your Active Meetings</h3>
            <button onClick={() => setShowMeetings(false)} className="text-red-500 hover:text-red-600">
              <IoClose size={20} />
            </button>
          </div>

          {meetings.length === 0 ? (
            <p className="text-sm text-gray-400">No active meetings found.</p>
          ) : (
            <ul className="space-y-2">
              {meetings.map((meeting, index) => {
                const isGroup = meeting.groupCall;
                const participant = !isGroup ? meeting.participants.find(p => p._id !== _id) : null;

                return (
                  <li key={index} className="bg-gray-800 p-2 rounded hover:bg-gray-700 text-sm break-all">
                    <div><span className="text-teal-400">Room ID:</span> {meeting.roomId}</div>
                    <div><span className="text-teal-400">Group:</span> {isGroup ? 'Yes' : 'No'}</div>
                    <div><span className="text-teal-400">Participants:</span> {meeting.participants.length}</div>
                    <div><span className="text-teal-400">Created By:</span> {meeting.createdBy?.name}</div>
                    <div><span className="text-teal-400">Created At:</span> {new Date(meeting.createdAt).toLocaleString()}</div>
                    {
                      !isGroup && participant && (
                        <div><span className="text-teal-400">Participant:</span> {participant.name}</div>
                      )
                    }
                    {
                      !isGroup && participant && (
                        <button
                          disabled={endingMeetingId === meeting._id}
                          onClick={() => handleEndMeeting(meeting)}
                          className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-xs transition"
                        >
                          {endingMeetingId === meeting._id ? "Ending..." : "End Meeting"}
                        </button>
                      )
                    }
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
