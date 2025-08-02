import React from 'react';
import TinderCard from 'react-tinder-card';
import type { NewsArticle } from '../types';
import { NewsCard } from './NewsCard';

interface SwipeDeckProps {
  articles: NewsArticle[];
  onSwipe: (direction: 'left' | 'right', articleId: string) => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ articles, onSwipe }) => {
  const handleSwipe = (direction: string, articleId: string) => {
    if (direction === 'left' || direction === 'right') {
      onSwipe(direction, articleId);
    }
  };

  if (articles.length === 0) {
    return null;
  }

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
            zIndex: articles.length - index
          }}
        >
          <TinderCard
            onSwipe={(dir) => handleSwipe(dir, article.id)}
            preventSwipe={['up', 'down']}
            className="w-full h-full"
          >
            <NewsCard article={article} />
          </TinderCard>
        </div>
      ))}
    </div>
  );
};
