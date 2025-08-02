import type { NewsArticle } from '../types/news';

const API_BASE_URL = 'http://localhost:8000'; // Update this with your actual API URL

interface NewsFilters {
  source?: string;
  limit: number;  // Make limit required
}

export const fetchNews = async (filters?: NewsFilters): Promise<NewsArticle[]> => {
  try {
    console.log('Fetching news from API with filters:', filters);
    
    // Build query parameters
    const params = new URLSearchParams();
    // Always include limit, default to 20 if not provided
    params.append('limit', (filters?.limit || 20).toString());
    if (filters?.source) {
      params.append('source', filters.source);
    }
    
    const url = `${API_BASE_URL}/news${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Transform the API response to match our NewsArticle type
    // The backend returns { news: [...] } format
    const articles: NewsArticle[] = data.news.map((article: any) => ({
      id: article.id,
      headline: article.headline,
      url: article.url,
      summary: article.summary,
      source: article.source,
      scraped_at: article.scraped_at,
      isLoadingSummary: false,
      // Optional fields that might not be in the backend response
      logoUrl: undefined,
      category: undefined,
      ticker: undefined
    }));
    
    console.log('Parsed News:', articles);
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}; 