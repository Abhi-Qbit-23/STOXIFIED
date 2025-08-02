import React, { useState, useEffect } from 'react';
import { SwipeDeck } from './components/SwipeDeck';
import { SavedNewsScreen } from './components/SavedNewsScreen';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import { NewsFilters } from './components/NewsFilters';
import { useNewsStore } from './store/newsStore';

export enum AppView {
  SwipeDeck = 'swipeDeck',
  SavedNews = 'savedNews',
}

const App: React.FC = () => {
  console.log('App: Component rendering');
  const [currentView, setCurrentView] = useState<AppView>(AppView.SwipeDeck);
  const {
    newsArticles,
    savedArticles,
    isLoading,
    error,
    loadNews,
    handleSwipe,
    handleUnsaveArticle,
    refreshNews
  } = useNewsStore();

  useEffect(() => {
    console.log('App: Initial load effect triggered');
    const initializeApp = async () => {
      try {
        await loadNews();
        console.log('App: Initial load completed');
      } catch (e) {
        console.error('App: Error during initial load:', e);
      }
    };
    initializeApp();
  }, [loadNews]);

  const handleFilterChange = async (filters: { source?: string; limit: number }) => {
    try {
      await loadNews(filters);
    } catch (e) {
      console.error('Error applying filters:', e);
    }
  };

  console.log('App render state:', { 
    newsArticles: newsArticles.length, 
    isLoading, 
    error,
    currentView 
  });

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-neutral-900 shadow-2xl">
      <Header title="StockSwipe" onRefresh={refreshNews} />
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
        {currentView === AppView.SwipeDeck && (
          <>
            <NewsFilters onFilterChange={handleFilterChange} />
            {newsArticles.length > 0 && (
              <SwipeDeck articles={newsArticles} onSwipe={handleSwipe} />
            )}

            {!isLoading && newsArticles.length === 0 && !error && (
              <div className="flex-grow flex flex-col items-center justify-center text-neutral-500">
                <p className="text-xl">No more news for now!</p>
                <p>Check back later or refresh.</p>
              </div>
            )}
          </>
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
