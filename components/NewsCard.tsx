import React from 'react';
import type { NewsArticle } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { BuildingLibraryIcon } from './icons/BuildingLibraryIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="absolute w-full h-full bg-neutral-800 rounded-xl shadow-xl overflow-hidden flex flex-col p-6 border border-neutral-700">
      <div className="flex-grow overflow-y-auto no-scrollbar">
        <h2 className="text-2xl font-bold text-primary-400 mb-3 leading-tight">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {article.headline}
          </a>
        </h2>

        {article.isLoadingSummary ? (
          <div className="flex items-center justify-center h-24">
            <LoadingSpinner className="w-8 h-8 text-primary-500" />
            <p className="ml-3 text-neutral-400">Generating summary...</p>
          </div>
        ) : (
          <p className="text-neutral-300 text-sm leading-relaxed mb-4">{article.summary}</p>
        )}

        <div className="space-y-2 text-xs text-neutral-400">
          <div className="flex items-center">
            <BuildingLibraryIcon className="w-4 h-4 mr-2 text-primary-500" />
            <span>{article.source || 'Unknown Source'}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-primary-500" />
            <span>{formatDate(article.scraped_at)}</span>
          </div>
        </div>
      </div>
      <div className="pt-4 mt-auto text-center text-xs text-neutral-500">
        Swipe Left to Skip, Swipe Right to Save
      </div>
    </div>
  );
};
