import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import SearchUser from './SearchUser';
import logo from '../assets/logo.png';
import { IoCall, IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const _id = useSelector((state) => state.user._id);

  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [endingMeetingId, setEndingMeetingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/logout`;
      await axios.get(url, { withCredentials: true });
      dispatch(logout());
      localStorage.clear();
      navigate('/email');
      setMenuOpen(false);
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
      setMeetings(prev => prev.filter(m => m._id !== meeting._id));
    } catch (err) {
      console.error("Failed to end meeting", err);
    } finally {
      setEndingMeetingId(null);
    }
  };

  return (
    <header
      className="w-full bg-gradient-to-r from-[#201b34] via-[#221c3d] to-black ring-1 ring-inset ring-white/10 shadow-lg rounded-b-3xl md:rounded-b-[36px] px-1 md:px-8 pt-2 pb-1.5 select-none sticky top-0 left-0 z-30 backdrop-blur-xl"
      role="banner"
    >
      <nav className="flex items-center min-h-[58px] gap-x-4 justify-between relative">
        {/* Hamburger / Menu Button */}
        <div className="relative flex items-center">
          <motion.button
            ref={buttonRef}
            type="button"
            className="p-2 rounded-full focus:outline-none hover:bg-white/10 transition-all text-white/90"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.ul
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.97, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -10 }}
                transition={{ duration: 0.17, ease: 'easeOut' }}
                className="absolute left-0 top-full mt-2 w-56 bg-black/95 ring-1 ring-white/15 rounded-xl z-50 font-semibold shadow-2xl text-white py-2 origin-top shadow-black/70"
                role="menu"
                aria-label="User menu"
              >
                <li role="none">
                  <button
                    role="menuitem"
                    className="w-full py-2 px-5 text-left hover:bg-orange-600/85 hover:text-white focus:outline-none focus:bg-orange-600/85 transition-all"
                    onClick={() => {
                      navigate(`/${_id}`);
                      setMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className="w-full py-2 px-5 text-left hover:bg-orange-600/85 hover:text-white focus:outline-none focus:bg-orange-600/85 transition-all"
                    onClick={() => {
                      navigate("/rankings");
                      setMenuOpen(false);
                    }}
                  >
                    Rankings
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className="w-full py-2 px-5 text-left hover:bg-red-500/80 hover:text-white focus:outline-none focus:bg-red-600 transition-all"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Center Logo & Brand */}
        <div className="flex items-center gap-3 select-none">
          <div className="bg-gradient-to-tr from-orange-500/90 to-yellow-400/90 p-2 rounded-full shadow-lg ring-2 ring-white/10 flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain" draggable={false} />
          </div>
          <span className="font-extrabold text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-fuchsia-300 to-amber-200 tracking-wide select-none pointer-events-none nerko-one-regular drop-shadow-sm">
            Laugh Daily
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex gap-3 md:gap-4 items-center">
          {/* Call Icon */}
          <motion.button
            type="button"
            onClick={handleShowMeetings}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition duration-200 focus:ring-2 focus:ring-blue-500/90 flex items-center"
            title="View Meetings"
            aria-label="View Meetings"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoCall size={22} />
          </motion.button>

          {/* Search Button */}
          <motion.button
            type="button"
            onClick={() => setOpenSearchUser(true)}
            className="bg-gradient-to-tr from-orange-500 to-pink-500 text-white rounded-full py-2 px-4 hover:from-orange-400 hover:to-pink-400 transition duration-150 font-semibold focus:ring-2 focus:ring-orange-500/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Search users"
          >
            Search
          </motion.button>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {openSearchUser && (
          <motion.div
            key="searchmodal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.19 }}
            className="fixed inset-0 z-[105] bg-black/60 backdrop-blur flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            <SearchUser onClose={() => setOpenSearchUser(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meetings Modal */}
      <AnimatePresence>
        {showMeetings && (
          <motion.div
            key="meeting-modal"
            initial={{ opacity: 0, y: -22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="fixed top-0 md:top-6 right-4 md:right-14 z-[106] max-w-xs w-[22rem] bg-gradient-to-tr from-[#29223f]/90 via-[#221c3d]/95 to-black/98 text-white shadow-2xl rounded-2xl px-3 py-4 ring-1 ring-white/8"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/8">
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
                Your Active Meetings
              </h3>
              <button
                onClick={() => setShowMeetings(false)}
                className="text-red-400 hover:text-red-500 rounded-full focus:outline-none p-1"
                aria-label="Close meetings"
              >
                <IoClose size={22} />
              </button>
            </div>
            {meetings.length === 0 ? (
              <p className="text-sm text-white/60">No active meetings found.</p>
            ) : (
              <ul className="space-y-2">
                {meetings.map((meeting, index) => {
                  const isGroup = meeting.groupCall;
                  const participant = !isGroup ? meeting.participants.find(p => p._id !== _id) : null;
                  return (
                    <li
                      key={index}
                      className="bg-black/40 rounded-xl p-3 hover:bg-black/65 transition flex flex-col gap-1"
                    >
                      <div className="text-xs">
                        <span className="text-teal-400">Group:</span> {isGroup ? 'Yes' : 'No'}
                      </div>
                      <div className="text-xs">
                        <span className="text-teal-400">Participants:</span> {meeting.participants.length}
                      </div>
                      <div className="text-xs">
                        <span className="text-teal-400">Created By:</span> {meeting.createdBy?.name}
                      </div>
                      <div className="text-xs">
                        <span className="text-teal-400">Created At:</span>{' '}
                        {new Date(meeting.createdAt).toLocaleString()}
                      </div>
                      {!isGroup && participant && (
                        <div className="text-xs">
                          <span className="text-teal-400">Participant:</span> {participant.name}
                        </div>
                      )}
                      {!isGroup && participant && (
                        <motion.button
                          layout
                          disabled={endingMeetingId === meeting._id}
                          onClick={() => handleEndMeeting(meeting)}
                          className="mt-2 w-full bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow transition-all active:scale-95"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {endingMeetingId === meeting._id ? "Ending..." : "End Meeting"}
                        </motion.button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
