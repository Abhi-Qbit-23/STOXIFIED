import React, { useState, useEffect } from 'react';
import { SwipeDeck } from './components/SwipeDeck';
import { SavedNewsScreen } from './components/SavedNewsScreen';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import { NewsFilters } from './components/NewsFilters';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignupScreen } from './components/auth/SignupScreen';
import { useNewsStore } from './store/newsStore';
import { useAuthStore } from './store/authStore';

export enum AppView {
  SwipeDeck = 'swipeDeck',
  SavedNews = 'savedNews',
}

type AuthView = 'login' | 'signup';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.SwipeDeck);
  const [authView, setAuthView] = useState<AuthView>('login');

  const { token, hydrateUser } = useAuthStore();
  const { newsArticles, savedArticles, isLoading, error, loadNews, handleSwipe, handleUnsaveArticle, refreshNews } = useNewsStore();

  // On mount: re-validate stored token, then load news
  useEffect(() => {
    hydrateUser().then(() => loadNews());
  }, []);

  // If not authenticated, show auth screens
  if (!token) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-neutral-900 shadow-2xl">
        {authView === 'login' ? (
          <LoginScreen onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <SignupScreen onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-neutral-900 shadow-2xl">
      <Header title="Stoxified" onRefresh={refreshNews} />

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
            <NewsFilters onFilterChange={loadNews} />
            <SwipeDeck
              articles={newsArticles}
              onSwipe={handleSwipe}
              onRefresh={refreshNews}
              isLoading={isLoading}
            />
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
