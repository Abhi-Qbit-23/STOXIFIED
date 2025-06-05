
import React from 'react';
import { ArrowPathIcon } from './icons/ArrowPathIcon'; // Assuming you have this icon

interface HeaderProps {
  title: string;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onRefresh }) => {
  return (
    <header className="bg-neutral-800 p-4 shadow-md flex justify-between items-center border-b border-neutral-700">
      <h1 className="text-2xl font-bold text-primary-400">{title}</h1>
      <button
        onClick={onRefresh}
        className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
        aria-label="Refresh news"
      >
        <ArrowPathIcon className="w-6 h-6 text-primary-400" />
      </button>
    </header>
  );
};