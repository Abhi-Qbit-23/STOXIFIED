
import React from 'react';
// import TinderCard from 'react-tinder-card'; // Temporarily removed for diagnosis
import type { NewsArticle } from '../types';
import { NewsCard } from './NewsCard';

interface SwipeDeckProps {
  articles: NewsArticle[];
  onSwipe: (direction: 'left' | 'right', articleId: string) => void; // Kept for prop consistency, but won't be actively called by UI
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ articles /*, onSwipe */ }) => {
  // const handleSwipe = (direction: string, articleId: string) => { // Temporarily unused
  //   if (direction === 'left' || direction === 'right') {
  //     onSwipe(direction, articleId);
  //   }
  // };

  if (articles.length === 0) {
    return null; // Handled by parent component
  }

  // Diagnostic rendering: Display cards stacked.
  // The NewsCard component itself is absolute positioned, so its parent needs to provide the frame.
  // We use zIndex to ensure the last article in the array (top of the conceptual stack) is visually on top.
  return (
    <div className="relative w-full flex-grow flex items-center justify-center">
      {articles.map((article, index) => (
        // Replacing TinderCard with a simple div for diagnostic purposes
        <div
          key={article.id}
          className={`absolute`} // NewsCard is already absolute, this div provides the context area
          style={{ 
            width: 'calc(100% - 2rem)', 
            height: 'calc(100% - 2rem)', 
            maxWidth: '400px', 
            maxHeight: '600px',
            zIndex: index // Simple stacking: higher index = visually on top
          }}
        >
          <NewsCard article={article} />
        </div>
      ))}
    </div>
  );
};
