import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchNews } from '../services/api';
import type { NewsQueryFilters } from '../services/api';
import type { NewsArticle } from '../types/news';

interface NewsStore {
  newsArticles: NewsArticle[];
  savedArticles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  loadNews: (filters?: NewsQueryFilters) => Promise<void>;
  handleSwipe: (direction: 'left' | 'right', articleId: string) => void;
  handleUnsaveArticle: (articleId: string) => void;
  refreshNews: () => Promise<void>;
  clearUserData: () => void;
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set, get) => ({
      newsArticles: [],
      savedArticles: [],
      isLoading: false,
      error: null,

      loadNews: async (filters?: NewsQueryFilters) => {
        set({ isLoading: true, error: null });
        try {
          const articles = await fetchNews(filters);
          set({ newsArticles: articles, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load news',
            isLoading: false,
          });
        }
      },

      handleSwipe: (direction, articleId) => {
        const { newsArticles, savedArticles } = get();
        const article = newsArticles.find(a => a.id === articleId);

        if (!article) return;

        if (direction === 'right') {
          const alreadySaved = savedArticles.some(a => a.id === articleId);
          set({
            savedArticles: alreadySaved ? savedArticles : [...savedArticles, article],
            newsArticles: newsArticles.filter(a => a.id !== articleId),
          });
        } else {
          set({
            newsArticles: newsArticles.filter(a => a.id !== articleId),
          });
        }
      },

      handleUnsaveArticle: (articleId) => {
        set(state => ({
          savedArticles: state.savedArticles.filter(a => a.id !== articleId),
        }));
      },

      refreshNews: async () => {
        const { loadNews } = get();
        await loadNews();
      },

      clearUserData: () => {
        set({ savedArticles: [], newsArticles: [], error: null });
      },
    }),
    {
      name: 'stoxified-storage',
      // Only persist saved articles — news feed should always be fresh
      partialize: (state) => ({ savedArticles: state.savedArticles }),
    }
  )
);
