import type { NewsArticle } from '../types/news';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set. Check your environment variables.');
}

export interface NewsQueryFilters {
  source?: string;
  limit: number;
}

interface ApiArticle {
  id: string;
  headline: string;
  url: string;
  summary: string;
  source: string;
  scraped_at: string;
}

export const fetchNews = async (filters?: NewsQueryFilters): Promise<NewsArticle[]> => {
  const params = new URLSearchParams();
  params.append('limit', (filters?.limit ?? 20).toString());
  if (filters?.source) {
    params.append('source', filters.source);
  }

  const qs = params.toString();
  const url = `${API_BASE_URL}/news${qs ? `?${qs}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.status}`);
  }

  const data = await response.json();

  return data.news.map((article: ApiArticle): NewsArticle => ({
    id: article.id,
    headline: article.headline,
    url: article.url,
    summary: article.summary,
    source: article.source,
    scraped_at: article.scraped_at,
    isLoadingSummary: false,
  }));
};
