
import React from 'react';
import { AppView } from '../App';
import { Squares2X2Icon } from './icons/Squares2X2Icon';
import { BookmarkSquareIcon } from './icons/BookmarkSquareIcon';


interface NavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Nav: React.FC<NavProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: AppView.SwipeDeck, label: 'Discover', icon: <Squares2X2Icon className="w-6 h-6 mb-1" /> },
    { view: AppView.SavedNews, label: 'Saved', icon: <BookmarkSquareIcon className="w-6 h-6 mb-1" /> },
  ];

  return (
    <nav className="bg-neutral-800 p-2 shadow-t-md border-t border-neutral-700">
      <ul className="flex justify-around">
        {navItems.map(item => (
          <li key={item.view}>
            <button
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center px-4 py-2 rounded-md transition-colors
                          ${currentView === item.view ? 'text-primary-400' : 'text-neutral-400 hover:text-primary-300'}`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};