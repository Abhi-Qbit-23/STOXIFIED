import React from 'react';
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
  const handleSwipe = (direction: string, articleId: string) => {
    if (direction === 'left' || direction === 'right') {
      onSwipe(direction, articleId);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-neutral-500 gap-4">
        <p className="text-xl font-semibold">You're all caught up!</p>
        <p className="text-sm text-center">No more cards. Refresh to load more.</p>
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

  // articles[0] is the top card — rendered last so it has highest z-index

  return (
    <div className="relative flex-grow w-full">
      {[...articles].reverse().map((article, i) => (
        <div
          key={article.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: i + 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TinderCard
            onSwipe={(dir) => handleSwipe(dir, article.id)}
            preventSwipe={['up', 'down']}
            className="w-full h-full"
          >
            <div style={{ width: '100%', height: '100%', maxWidth: '400px', maxHeight: '580px', position: 'relative' }}>
              <NewsCard article={article} />
            </div>
          </TinderCard>
        </div>
      ))}
    </div>
  );
};
