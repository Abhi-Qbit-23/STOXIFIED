import React, { useState, useEffect, useCallback } from 'react';
import { SwipeDeck } from './components/SwipeDeck';
import { SavedNewsScreen } from './components/SavedNewsScreen';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import type { NewsArticle } from './types';
import { LoadingSpinner } from './components/icons/LoadingSpinner';

export enum AppView {
  SwipeDeck = 'swipeDeck',
  SavedNews = 'savedNews',
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.SwipeDeck);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>(() => {
    const localSaved = localStorage.getItem('savedStockNews');
    return localSaved ? JSON.parse(localSaved) : [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadNewsFromAPI = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/news');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const parsedNews: NewsArticle[] = data.map((item: any) => ({
        id: String(item.id),
        headline: item.headline,
        url: item.url,
        summary: item.summary || '',
        source: item.source || '',
        scraped_at: item.scraped_at || '',
        isLoadingSummary: false,
      }));
      setNewsArticles(parsedNews);
    } catch (e) {
      console.error("Failed to load news:", e);
      setError("Failed to load news. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNewsFromAPI();
  }, [loadNewsFromAPI]);

  useEffect(() => {
    localStorage.setItem('savedStockNews', JSON.stringify(savedArticles));
  }, [savedArticles]);

  const handleSwipe = (direction: 'left' | 'right', articleId: string) => {
    const articleToHandle = newsArticles.find(a => a.id === articleId);
    if (!articleToHandle) return;

    if (direction === 'right') {
      setSavedArticles(prev => [articleToHandle, ...prev.filter(a => a.id !== articleId)]);
    }
    setNewsArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const handleUnsaveArticle = (articleId: string) => {
    setSavedArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const handleRefresh = () => {
    setNewsArticles([]);
    loadNewsFromAPI();
  };

  // Button-controlled swipe
  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (newsArticles.length === 0) return;
    handleSwipe(direction, newsArticles[0].id);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-neutral-900 shadow-2xl">
      <Header title="StockSwipe" onRefresh={handleRefresh} />
      {error && (
        <div className="p-4 m-4 bg-red-800 text-white rounded-lg text-center">
          <p>{error}</p>
        </div>
      )}
      {isLoading && newsArticles.length === 0 && (
        <div className="flex-grow flex flex-col items-center justify-center text-neutral-400">
          <LoadingSpinner className="w-12 h-12 mb-4" />
          <p>Loading latest news...</p>
        </div>
      )}

      <main className="flex-grow overflow-hidden p-4 flex flex-col">
        {currentView === AppView.SwipeDeck && newsArticles.length > 0 && (
          <>
            <SwipeDeck articles={newsArticles} onSwipe={handleSwipe} />

            {/* ✅ Swipe Buttons */}
            <div className="flex justify-around mt-6">
              <button
                onClick={() => handleButtonSwipe('left')}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Skip 👎
              </button>
              <button
                onClick={() => handleButtonSwipe('right')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save 👍
              </button>
            </div>
          </>
        )}

        {currentView === AppView.SwipeDeck && !isLoading && newsArticles.length === 0 && !error && (
          <div className="flex-grow flex flex-col items-center justify-center text-neutral-500">
            <p className="text-xl">No more news for now!</p>
            <p>Check back later or refresh.</p>
          </div>
        )}

        {currentView === AppView.SavedNews && (
          <SavedNewsScreen savedArticles={savedArticles} onUnsave={handleUnsaveArticle} />
        )}
      </main>
      <Nav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
