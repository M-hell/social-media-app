import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

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
          data: { sortby },
          withCredentials: true
        });
        setUsers(response.data.data);
      } catch (error) {
        // Fallback: no toast here for public boards
        // toast.error('Error fetching users');
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchUsers();
  }, [sortby]);

  return (
    <div className="min-h-[90vh] w-full flex flex-col bg-gradient-to-br from-[#181325] via-[#232949] to-[#181325] items-center py-10 px-1">
      <div className="w-full max-w-3xl flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-1 mx-auto md:max-w-2xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-200 to-fuchsia-300 tracking-tight">
            Rankings
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-tr from-orange-500 via-orange-400 to-amber-400 text-white font-semibold py-2 px-6 rounded-xl shadow hover:from-orange-600 hover:to-orange-500 transition-all text-lg"
          >
            &lt; Back to Home
          </button>
        </div>
        <div className="flex items-center gap-2 mb-7 mx-auto">
          <label htmlFor="sortby" className="mr-2 text-base font-semibold text-white/80">Sort By:</label>
          <select
            id="sortby"
            value={sortby}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2.5 rounded-xl border-none shadow-sm text-sm focus:ring-2 focus:ring-orange-400 transition"
          >
            <option value="upvotes">Upvotes</option>
            <option value="followers">Followers</option>
          </select>
        </div>
        {isLoading ? (
          <Loading />
        ) : users.length === 0 ? (
          <p className="text-white/80 mt-10 text-center text-lg">No users found</p>
        ) : (
          <div className="overflow-y-auto max-h-[72vh]">
            <div className="space-y-6 px-1">
              {users.map((user, idx) => (
                <div
                  onClick={() => navigate(`/${user._id}`)}
                  key={user._id}
                  className={`flex items-center gap-6 cursor-pointer bg-gradient-to-tr from-black/70 to-gray-900  border border-white/10 text-white shadow-lg rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-black/85 hover:shadow-2xl`}
                  style={{ minWidth: 300 }}
                >
                  <div className="flex flex-col items-center flex-shrink-0 relative">
                    {/* Badge */}
                    <span className={`absolute -top-2 -left-2 bg-gradient-to-tr from-orange-400 via-orange-600 to-pink-500 text-white font-bold rounded-full px-3 py-1 text-xs shadow-md ${idx === 0 && "ring-2 ring-orange-400/80 animate-pulse"}`}>
                      #{idx + 1}
                    </span>
                    <Avatar
                      width={65}
                      height={65}
                      imageUrl={user.profile_pic}
                      name={user.name}
                      userId={user._id}
                      className="border-4 border-orange-400/50"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1 overflow-hidden">
                    <h2 className="text-lg md:text-xl font-bold truncate mb-0">{user.name}</h2>
                    <p className="text-sm text-white/50 truncate">{user.email}</p>
                    <div className="flex gap-10 mt-2">
                      <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-orange-300">{user.upvotes ?? 0}</span>
                        <span className="text-xs text-white/60">Upvotes</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-fuchsia-300">{user.followers?.length ?? 0}</span>
                        <span className="text-xs text-white/60">Followers</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ranking;
