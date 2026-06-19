import React from 'react';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  title: string;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onRefresh }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-neutral-800 p-4 shadow-md flex justify-between items-center border-b border-neutral-700">
      <div>
        <h1 className="text-2xl font-bold text-primary-400">{title}</h1>
        {user && (
          <p className="text-xs text-neutral-500 mt-0.5">Hey, {user.full_name ?? user.username}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
          aria-label="Refresh news"
        >
          <ArrowPathIcon className="w-6 h-6 text-primary-400" />
        </button>
        {user && (
          <button
            onClick={logout}
            className="text-xs text-neutral-400 hover:text-red-400 transition-colors px-2 py-1 rounded"
            aria-label="Log out"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};
