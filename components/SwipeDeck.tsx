import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import type { NewsArticle } from '../types/news';
import { NewsCard } from './NewsCard';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface SwipeDeckProps {
  articles: NewsArticle[];
  onSwipe: (direction: 'left' | 'right', articleId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ articles, onSwipe, onRefresh, isLoading }) => {
  // Track the active swipe direction for the top card only
  const [activeSwipeDir, setActiveSwipeDir] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: string, articleId: string) => {
    setActiveSwipeDir(null);
    if (direction === 'left' || direction === 'right') {
      onSwipe(direction, articleId);
    }
  };

  const handleCardLeftScreen = () => {
    setActiveSwipeDir(null);
  };

  if (articles.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-neutral-500 gap-4">
        <p className="text-xl font-semibold">You're all caught up!</p>
        <p className="text-sm text-center">No more news cards. Refresh to load more.</p>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    );
  }

  // The top card is the last in the array (highest z-index)
  const topCardId = articles[articles.length - 1]?.id;

  return (
    <div className="relative w-full flex-grow flex items-center justify-center">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className="absolute"
          style={{
            width: 'calc(100% - 2rem)',
            height: 'calc(100% - 2rem)',
            maxWidth: '400px',
            maxHeight: '600px',
            zIndex: index + 1,
          }}
        >
          <TinderCard
            onSwipe={(dir) => handleSwipe(dir, article.id)}
            onCardLeftScreen={handleCardLeftScreen}
            preventSwipe={['up', 'down']}
            className="w-full h-full"
            onSwipeRequirementFulfilled={(dir) => {
              if (article.id === topCardId) {
                setActiveSwipeDir(dir === 'left' || dir === 'right' ? dir : null);
              }
            }}
            onSwipeRequirementUnfulfilled={() => {
              setActiveSwipeDir(null);
            }}
          >
            <NewsCard
              article={article}
              swipeDirection={article.id === topCardId ? activeSwipeDir : null}
            />
          </TinderCard>
        </div>
      ))}
    </div>
  );
};
