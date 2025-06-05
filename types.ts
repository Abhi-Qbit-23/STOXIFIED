
export interface NewsArticle {
  id: string;
  headline: string;
  fullText: string; // Original long text for summarization
  summary: string; // Summarized content by Gemini
  source: string;
  timestamp: string;
  category: string; // e.g., IPO, Q_RESULTS, STOCKS, GLOBAL_MARKETS
  ticker?: string; // e.g., $RELIANCE, AAPL
  logoUrl?: string; // URL to company logo, e.g., https://logo.clearbit.com/apple.com
  isLoadingSummary?: boolean;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}