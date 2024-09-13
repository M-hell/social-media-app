import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OtherProfileCard({ user }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const owner = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleFollow = async () => {
        try {
            const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/increase-following`;
            const response = await axios.post(URL, { followingid: user._id }, { withCredentials: true });

            if (response.data.success) {
                setIsFollowing(true);
                toast.success("Followed successfully");
                console.log("Followed successfully");
            }
        } catch (error) {
            toast.error("Error following user");
        }
    };

    useEffect(() => {
        const checkIfFollowing = () => {
            if (user?.followers?.includes(owner._id)) {
                setIsFollowing(true);
            } else {
                setIsFollowing(false);
            }
        };

        if (user && owner._id) {
            checkIfFollowing();
        }
    }, [user, owner._id]);

    const isCurrentUser = owner._id === user._id;

    return (
        <div className="card card-side bg-gray-800 text-white shadow-xl rounded-lg overflow-hidden flex flex-col items-center p-4">
            <button onClick={() => navigate('/')} className="btn btn-secondary mb-4 self-start">Back to Home</button>
            <figure className="w-32 h-32 flex items-center justify-center mb-4">
                <img
                    src={user.profile_pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVHR62PqqslJrmbNHhwiH3Cmb99-h10mi6g&s'} // Fallback to default image if profile_pic is not available
                    alt={user.name || 'Default User'}
                    className="w-full h-full object-cover rounded-full border-4 border-gray-600" // Fully circular image
                />
            </figure>
            <div className="text-center">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <div className="flex justify-center mt-4 space-x-6">
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">{user?.followers.length}</span>
                        <span className="text-sm text-gray-400">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">{user?.following.length}</span>
                        <span className="text-sm text-gray-400">Following</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">{user?.upvotes}</span>
                        <span className="text-sm text-gray-400">Upvotes</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">{user?.downvotes}</span>
                        <span className="text-sm text-gray-400">Downvotes</span>
                    </div>
                </div>
                {!isCurrentUser && (
                    <div className="card-actions mt-4 flex justify-center">
                        {isFollowing ? (
                            <button className="btn text-white btn-secondary">Following</button>
                        ) : (
                            <button onClick={handleFollow} className="btn btn-primary">Follow</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OtherProfileCard;
