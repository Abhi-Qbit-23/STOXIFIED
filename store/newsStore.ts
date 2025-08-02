import { create } from 'zustand';
import { fetchNews } from '../services/api';
import type { NewsArticle } from '../types/news';

interface NewsFilters {
  source?: string;
  limit: number;
}

interface NewsStore {
  newsArticles: NewsArticle[];
  savedArticles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  loadNews: (filters?: NewsFilters) => Promise<void>;
  handleSwipe: (direction: 'left' | 'right', articleId: string) => void;
  handleUnsaveArticle: (articleId: string) => void;
  refreshNews: () => Promise<void>;
}

export const useNewsStore = create<NewsStore>((set, get) => ({
  newsArticles: [],
  savedArticles: [],
  isLoading: false,
  error: null,

  loadNews: async (filters?: NewsFilters) => {
    console.log('Store: Starting loadNews with filters:', filters);
    set({ isLoading: true, error: null });
    try {
      console.log('Store: Fetching news from API');
      const articles = await fetchNews(filters);
      console.log('Store: Received articles:', articles.length);
      set({ newsArticles: articles, isLoading: false });
    } catch (error) {
      console.error('Store: Error loading news:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load news', 
        isLoading: false 
      });
    }
  },

  handleSwipe: (direction, articleId) => {
    console.log('Store: Handling swipe', { direction, articleId });
    const { newsArticles, savedArticles } = get();
    const article = newsArticles.find(a => a.id === articleId);
    
    if (!article) {
      console.warn('Store: Article not found for swipe', articleId);
      return;
    }

    if (direction === 'right') {
      set({
        savedArticles: [...savedArticles, article],
        newsArticles: newsArticles.filter(a => a.id !== articleId)
      });
      console.log('Store: Article saved', articleId);
    } else {
      set({
        newsArticles: newsArticles.filter(a => a.id !== articleId)
      });
      console.log('Store: Article skipped', articleId);
    }
  },

  handleUnsaveArticle: (articleId) => {
    console.log('Store: Unsaving article', articleId);
    set(state => ({
      savedArticles: state.savedArticles.filter(a => a.id !== articleId)
    }));
  },

  refreshNews: async () => {
    console.log('Store: Refreshing news');
    set({ isLoading: true, error: null });
    try {
      const articles = await fetchNews();
      console.log('Store: Received refreshed articles:', articles.length);
      set({ newsArticles: articles, isLoading: false });
    } catch (error) {
      console.error('Store: Error refreshing news:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh news', 
        isLoading: false 
      });
    }
  }
})); 