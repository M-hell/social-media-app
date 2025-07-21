import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={`/${user?._id}`}
      onClick={onClose}
      className="flex items-center gap-3 p-3 lg:p-4 border border-transparent border-b-gray-700 hover:border hover:border-orange-400/70 rounded-xl bg-gradient-to-r from-black/65 via-gray-900/70 to-slate-900 transition-all duration-150 cursor-pointer group"
      tabIndex={0}
      aria-label={`Go to profile of ${user?.name || 'user'}`}
    >
      <Avatar
        width={54}
        height={54}
        name={user?.name}
        userId={user?._id}
        imageUrl={user?.profile_pic}
        className="flex-shrink-0 transition-all group-hover:shadow-orange-400/25"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-white/95 text-base truncate w-[120px] sm:w-[180px] group-hover:text-orange-300">
          {user?.name}
        </span>
        <span className="text-sm text-white/65 truncate w-[120px] sm:w-[180px]">
          {user?.email}
        </span>
      </div>
    </Link>
  );
};

export default UserSearchCard;
