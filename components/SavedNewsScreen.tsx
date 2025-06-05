
import React from 'react';
import type { NewsArticle } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ShareIcon } from './icons/ShareIcon';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';


interface SavedNewsScreenProps {
  savedArticles: NewsArticle[];
  onUnsave: (articleId: string) => void;
}

export const SavedNewsScreen: React.FC<SavedNewsScreenProps> = ({ savedArticles, onUnsave }) => {
  const handleShare = async (article: NewsArticle) => {
    const shareData = {
      title: article.headline,
      text: `${article.headline}\n\n${article.summary}\n\nSource: ${article.source}`,
      // url: article.originalUrl || window.location.href, // Ideally, you'd have an original article URL
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support navigator.share
        // This could open a modal with links or copy to clipboard
        alert('Sharing is not supported on this browser, or a fallback is needed. Article details copied to console.');
        console.log('Share Data:', shareData);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (savedArticles.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-neutral-500 p-4">
        <ArrowUpRightIcon className="w-16 h-16 mb-4 text-primary-600"/>
        <h3 className="text-xl font-semibold mb-2">No Saved Articles</h3>
        <p className="text-center">Swipe right on news cards to save them here for later reading.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-1 space-y-4 no-scrollbar">
      <h2 className="text-2xl font-bold text-primary-400 mb-4 px-3">Saved News</h2>
      {savedArticles.map(article => (
        <div key={article.id} className="bg-neutral-800 p-4 rounded-lg shadow-md border border-neutral-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-primary-300 flex-1 mr-2">{article.headline}</h3>
            {article.logoUrl && (
              <img src={article.logoUrl} alt="logo" className="w-10 h-10 rounded-full object-contain bg-white p-0.5"/>
            )}
          </div>
          <p className="text-sm text-neutral-300 mb-3 leading-relaxed">{article.summary}</p>
          <div className="flex justify-between items-center text-xs text-neutral-400 mb-3">
            <span>{article.source} - {formatDate(article.timestamp)}</span>
            <div>
              {article.ticker && <span className="bg-neutral-700 text-neutral-200 px-2 py-0.5 rounded-full text-xs font-mono mr-2">{article.ticker}</span>}
              <span className="bg-primary-700 text-primary-100 px-2 py-0.5 rounded-full text-xs">{article.category.replace(/_/g, ' ')}</span>
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleShare(article)}
              className="flex items-center justify-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-xs transition-colors"
              aria-label="Share article"
            >
              <ShareIcon className="w-4 h-4 mr-1.5" /> Share
            </button>
            <button
              onClick={() => onUnsave(article.id)}
              className="flex items-center justify-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs transition-colors"
              aria-label="Unsave article"
            >
              <TrashIcon className="w-4 h-4 mr-1.5" /> Unsave
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};