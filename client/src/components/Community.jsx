import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus, Users, Settings, Trash2, UserPlus, UserMinus, MessageCircle,
  Crown, Calendar, X, Search
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Community() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-communities');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [participantUsers, setParticipantUsers] = useState([]);
  const _id = useSelector(state => state.user._id);
  const navigate = useNavigate();

  const [createForm, setCreateForm] = useState({
    name: '',
    participants: []
  });
  const [manageForm, setManageForm] = useState({
    type: 'add',
    selectedUserIds: [],
    selectedUsers: []
  });

  const getUsers = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/all-followers-following`;
      const response = await axios.post(URL, { _id }, { withCredentials: true });
      
      if (response.data.data.length === 0) {
        console.log("Add friends by clicking on search at top right");
      } else {
        const uniqueUsers = Array.from(new Set(response.data.data.map(user => user._id)))
          .map(id => response.data.data.find(user => user._id === id));
        setUsers(uniqueUsers);
      }
    } catch (error) {
      console.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const filterUsersForAction = (actionType, community) => {
    if (actionType === 'add') {
      const participantIds = community.participants.map(p => p._id);
      return users.filter(user => !participantIds.includes(user._id));
    } else {
      return community.participants.filter(p => p._id !== community.createdBy._id);
    }
  };

  useEffect(() => {
    if (showManageModal && selectedCommunity && users.length > 0) {
      const filteredUsers = filterUsersForAction(manageForm.type, selectedCommunity);
      
      if (manageForm.type === 'add') {
        setAvailableUsers(filteredUsers);
      } else {
        setParticipantUsers(filteredUsers);
      }
      
      // Reset selected users when changing action type or community
      setManageForm(prev => ({ 
        ...prev, 
        selectedUserIds: [], 
        selectedUsers: [] 
      }));
    }
  }, [showManageModal, selectedCommunity, manageForm.type, users]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/get-user-communities`, {
        withCredentials: true
      });
      const data = response.data;
      if (data.success) {
        setCommunities(data.data);
      }
    } catch (error) {/* no-op */ }
    finally { setLoading(false); }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/create-community`, createForm, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      const data = response.data;
      if (data.success) {
        setShowCreateModal(false);
        setCreateForm({ name: '', participants: [] });
        fetchCommunities();
        alert('Community created successfully!');
      }
    } catch {/* no-op */ }
  };

  const handleDeleteCommunity = async (communityId) => {
    if (!window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) return;
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/delete-community/${communityId}`, {
        withCredentials: true
      });
      const data = response.data;
      if (data.success) {
        fetchCommunities();
        alert('Community deleted successfully!');
      }
    } catch {/* no-op */ }
  };

  const handleManageParticipants = async (e) => {
    e.preventDefault();
    if (manageForm.selectedUserIds.length === 0) {
      alert('Please select at least one user');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/manage-community-participants`, {
        type: manageForm.type,
        communityId: selectedCommunity._id,
        userIds: manageForm.selectedUserIds
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      const data = response.data;
      if (data.success) {
        setShowManageModal(false);
        setManageForm({ type: 'add', selectedUserIds: [], selectedUsers: [] });
        fetchCommunities();
        
        const successCount = data.data.results.length;
        const errorCount = data.data.errors ? data.data.errors.length : 0;
        let message = `${successCount} user(s) ${manageForm.type === 'add' ? 'added to' : 'removed from'} community successfully!`;
        if (errorCount > 0) {
          message += `\n${errorCount} user(s) could not be processed.`;
        }
        alert(message);
      }
    } catch (error) {
      console.error('Error managing participants:', error);
      alert('An error occurred while managing participants');
    }
  };

  // Fixed handleUserToggle function
  const handleUserToggle = (userId) => {
    setManageForm(prev => {
      const isSelected = prev.selectedUserIds.includes(userId);
      const userList = prev.type === 'add' ? availableUsers : participantUsers;
      const user = userList.find(u => u._id === userId);

      if (!user) return prev;

      if (isSelected) {
        return {
          ...prev,
          selectedUserIds: prev.selectedUserIds.filter(id => id !== userId),
          selectedUsers: prev.selectedUsers.filter(u => u._id !== userId)
        };
      } else {
        return {
          ...prev,
          selectedUserIds: [...prev.selectedUserIds, userId],
          selectedUsers: [...prev.selectedUsers, user]
        };
      }
    });
  };

  const handleSelectAll = () => {
    const userList = manageForm.type === 'add' ? availableUsers : participantUsers;
    if (userList.length > 0) {
      setManageForm(prev => ({
        ...prev,
        selectedUserIds: userList.map(u => u._id),
        selectedUsers: [...userList]
      }));
    }
  };

  const handleClearAll = () => {
    setManageForm(prev => ({
      ...prev,
      selectedUserIds: [],
      selectedUsers: []
    }));
  };

  const handleActionTypeChange = (newType) => {
    setManageForm(prev => ({ 
      ...prev, 
      type: newType, 
      selectedUserIds: [], 
      selectedUsers: [] 
    }));
  };

  useEffect(() => {
    fetchCommunities();
    getUsers();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-tr from-[#181325] via-[#232949] to-black px-2 py-8"
      style={{
        backgroundImage:
          'radial-gradient(at 18% 13%,rgba(73,44,191,0.17) 0,transparent 55%), ' +
          'radial-gradient(at 85% 27%,rgba(91,64,186,0.15) 0,transparent 63%), ' +
          'radial-gradient(at 45% 110%,rgba(255,156,92,0.08) 0,transparent 70%)'
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-200 to-fuchsia-300 tracking-tight">
              Communities
            </h1>
            <p className="text-white/70 mt-2">Connect, collaborate, and grow together</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-400 hover:to-fuchsia-500 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <Plus size={20} /> Create Community
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={20} />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/35 text-white pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/50 transition-all duration-200 outline-none placeholder-white/30 font-medium"
            autoComplete="off"
          />
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
            {filteredCommunities.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users size={48} className="mx-auto text-white/20 mb-5" />
                <h3 className="text-xl font-bold text-white/80 mb-2">
                  {searchQuery ? 'No communities found' : 'No communities yet'}
                </h3>
                <p className="text-white/50">
                  {searchQuery ? 'Try a different search term' : 'Create your first community to get started.'}
                </p>
              </div>
            ) : (
              filteredCommunities.map((community) => (
                <div
                  key={community._id}
                  className="rounded-2xl shadow-xl border border-white/10 bg-gradient-to-tr from-black/60 via-gray-900/60 to-slate-900 ring-1 ring-white/10 hover:ring-orange-600/25 hover:shadow-orange-400/15 transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Community Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                         <span onClick={() => navigate(`/community/${community._id}`)} className="cursor-pointer">{community.name}</span> 
                          {community.isCreator && (
                            <Crown size={18} className="text-yellow-400" title="You're the creator" />
                          )}
                        </h3>
                        <p className="text-sm text-white/60">
                          Created by {community.createdBy.name}
                        </p>
                      </div>
                      {community.isCreator && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedCommunity(community);
                              setShowManageModal(true);
                            }}
                            className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-full transition"
                            title="Manage Participants"
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCommunity(community._id)}
                            className="p-2 text-red-500 hover:bg-red-600/10 rounded-full transition"
                            title="Delete Community"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-r from-black/30 to-orange-900/10 p-3 rounded-xl flex items-center gap-2">
                        <Users size={16} className="text-orange-400" />
                        <span className="text-sm font-semibold text-white/90">
                          {community.participantCount} Members
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-black/30 to-orange-900/10 p-3 rounded-xl flex items-center gap-2">
                        <MessageCircle size={16} className="text-orange-400" />
                        <span className="text-sm font-semibold text-white/90">
                          {community.messageCount} Messages
                        </span>
                      </div>
                    </div>
                    {/* Last Message */}
                    {community.lastMessage && (
                      <div className="bg-black/20 p-3 rounded-xl mb-4">
                        <p className="text-xs text-orange-200 mb-1">Latest message:</p>
                        <p className="text-sm text-white/90 truncate">
                          {community.lastMessage.content}
                        </p>
                      </div>
                    )}
                    {/* Join Date */}
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar size={12} />
                      Joined {new Date(community.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Community Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur">
            <div className="bg-gradient-to-br from-black/90 via-[#231c37]/98 to-[#181325] rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-white/10 p-0">
              <div className="p-7">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold text-white">Create Community</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white/80 hover:text-orange-400 transition"
                  >
                    <X size={28} />
                  </button>
                </div>
                <form className="flex flex-col gap-5" onSubmit={handleCreateCommunity}>
                  <div>
                    <label className="block text-white/70 font-semibold mb-2">Community Name</label>
                    <input
                      type="text"
                      value={createForm.name}
                      required
                      onChange={e =>
                        setCreateForm({ ...createForm, name: e.target.value })
                      }
                      minLength={2}
                      maxLength={64}
                      className="w-full px-4 py-3 bg-black/35 rounded-xl border border-white/12 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 transition-all font-semibold"
                      placeholder="Enter community name"
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-3 border border-white/15 text-white/70 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-orange-400 hover:to-fuchsia-400 transition-all"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Manage Participants Modal */}
        {showManageModal && selectedCommunity && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur">
            <div className="bg-gradient-to-br from-black/92 via-[#231c37]/98 to-[#181325] rounded-2xl shadow-2xl w-full max-w-2xl ring-1 ring-white/10 p-0 max-h-[90vh] overflow-hidden">
              <div className="p-7 flex flex-col h-full max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold text-white">
                    Manage Participants — {selectedCommunity.name}
                  </h3>
                  <button
                    onClick={() => setShowManageModal(false)}
                    className="text-white/80 hover:text-orange-400 transition"
                  >
                    <X size={28} />
                  </button>
                </div>
                
                <form className="flex flex-col gap-4 flex-1 overflow-hidden" onSubmit={handleManageParticipants}>
                  <div>
                    <label className="block text-white/70 font-semibold mb-2">Action</label>
                    <select
                      value={manageForm.type}
                      onChange={e => handleActionTypeChange(e.target.value)}
                      className="w-full px-4 py-3 bg-black/35 rounded-xl border border-white/12 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="add">Add Users</option>
                      <option value="remove">Remove Users</option>
                    </select>
                  </div>

                  {/* Selected Users Display */}
                  {manageForm.selectedUsers.length > 0 && (
                    <div className="bg-black/20 p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-white/80">
                          Selected ({manageForm.selectedUsers.length})
                        </span>
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {manageForm.selectedUsers.map(user => (
                          <span
                            key={user._id}
                            className="bg-orange-500/20 text-orange-200 px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                          >
                            {user.name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserToggle(user._id);
                              }}
                              className="hover:text-red-300 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Selection */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-white/70 font-semibold">
                        {manageForm.type === 'add' ? 'Select Users to Add' : 'Select Users to Remove'}
                        <span className="text-xs text-white/50 ml-2">
                          ({manageForm.type === 'add' ? availableUsers.length : participantUsers.length} available)
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        disabled={(manageForm.type === 'add' ? availableUsers : participantUsers).length === 0}
                        className={`text-xs transition-colors ${
                          (manageForm.type === 'add' ? availableUsers : participantUsers).length === 0
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-orange-400 hover:text-orange-300 cursor-pointer'
                        }`}
                      >
                        Select All
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-black/20 rounded-xl p-3 space-y-2">
                      {(manageForm.type === 'add' ? availableUsers : participantUsers).length === 0 ? (
                        <p className="text-white/50 text-center py-4">
                          {manageForm.type === 'add' ? 'No users available to add' : 'No users available to remove'}
                        </p>
                      ) : (
                        (manageForm.type === 'add' ? availableUsers : participantUsers).map(user => (
                          <div
                            key={user._id}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                              manageForm.selectedUserIds.includes(user._id)
                                ? manageForm.type === 'add' 
                                  ? 'bg-orange-500/20 border border-orange-500/30'
                                  : 'bg-red-500/20 border border-red-500/30'
                                : 'hover:bg-white/5'
                            }`}
                            onClick={() => handleUserToggle(user._id)}
                          >
                            <input
                              type="checkbox"
                              checked={manageForm.selectedUserIds.includes(user._id)}
                              onChange={() => handleUserToggle(user._id)}
                              className={`w-4 h-4 bg-transparent border-white/30 rounded ${
                                manageForm.type === 'add' 
                                  ? 'text-orange-500 focus:ring-orange-500' 
                                  : 'text-red-500 focus:ring-red-500'
                              }`}
                            />
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white/90 font-medium">{user.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowManageModal(false)}
                      className="flex-1 px-4 py-3 border border-white/15 text-white/70 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={manageForm.selectedUserIds.length === 0}
                      className={`flex-1 px-4 py-3 text-white rounded-xl font-bold transition-all ${
                        manageForm.selectedUserIds.length === 0
                          ? 'bg-gray-600 cursor-not-allowed opacity-50'
                          : manageForm.type === 'add'
                          ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500'
                      }`}
                    >
                      {manageForm.type === 'add'
                        ? (<span className="flex items-center gap-1 justify-center"><UserPlus size={16} /> Add Users ({manageForm.selectedUserIds.length})</span>)
                        : (<span className="flex items-center gap-1 justify-center"><UserMinus size={16} /> Remove Users ({manageForm.selectedUserIds.length})</span>)
                      }
                    </button>
                  </div>
                </form>
                
                {/* Current Participants */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white/80 mb-3">
                    Current Participants ({selectedCommunity.participantCount})
                  </h4>
                  <div className="max-h-24 overflow-y-auto space-y-2">
                    {selectedCommunity.participants.map((participant) => (
                      <div
                        key={participant._id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {(participant.name?.charAt(0) || '').toUpperCase()}
                        </div>
                        <span className="text-white/90">{participant.name}</span>
                        {participant._id === selectedCommunity.createdBy._id && (
                          <Crown size={12} className="text-yellow-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;