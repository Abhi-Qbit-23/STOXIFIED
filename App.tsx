
import React, { useState, useEffect, useCallback } from 'react';
import { SwipeDeck } from './components/SwipeDeck';
import { SavedNewsScreen } from './components/SavedNewsScreen';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import type { NewsArticle } from './types';
import { mockNewsService } from './services/newsService';
import { geminiService } from './services/geminiService';
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

  const loadAndSummarizeNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawArticles = mockNewsService.getMockRawArticles(7); // Fetch 7 raw articles
      const articlesWithSummaries: NewsArticle[] = [];

      for (const rawArticle of rawArticles) {
        // Initialize with isLoadingSummary true
        articlesWithSummaries.push({ ...rawArticle, summary: '', isLoadingSummary: true });
      }
      setNewsArticles(articlesWithSummaries); // Set articles immediately for UI responsiveness

      // Sequentially summarize to avoid overwhelming UI updates if done in parallel and updating state each time
      const summarizedArticles = [...articlesWithSummaries];
      for (let i = 0; i < summarizedArticles.length; i++) {
        const article = summarizedArticles[i];
        try {
          // API_KEY is now used directly in geminiService
          const summary = await geminiService.summarizeNews(article.fullText);
          summarizedArticles[i] = { ...article, summary, isLoadingSummary: false };
          setNewsArticles([...summarizedArticles]); // Update state after each summary
        } catch (summaryError) {
          console.error(`Failed to summarize article ${article.id}:`, summaryError);
          summarizedArticles[i] = { ...article, summary: "Could not load summary.", isLoadingSummary: false };
          setNewsArticles([...summarizedArticles]);
        }
      }
    } catch (e) {
      console.error("Failed to load news:", e);
      setError("Failed to load news. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed API_KEY from dependencies

  useEffect(() => {
    loadAndSummarizeNews();
  }, [loadAndSummarizeNews]);

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
    setNewsArticles([]); // Clear current articles
    loadAndSummarizeNews();
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
          <SwipeDeck
            articles={newsArticles}
            onSwipe={handleSwipe}
          />
        )}
        {currentView === AppView.SwipeDeck && !isLoading && newsArticles.length === 0 && !error && (
           <div className="flex-grow flex flex-col items-center justify-center text-neutral-500">
             <p className="text-xl">No more news for now!</p>
             <p>Check back later or refresh.</p>
           </div>
        )}
        {currentView === AppView.SavedNews && (
          <SavedNewsScreen
            savedArticles={savedArticles}
            onUnsave={handleUnsaveArticle}
          />
        )}
      </main>
      <Nav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
