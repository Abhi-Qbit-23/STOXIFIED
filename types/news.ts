export interface NewsArticle {
  id: string;
  headline: string;
  url: string;
  summary: string;
  source: string;
  scraped_at: string;
  isLoadingSummary?: boolean;
  logoUrl?: string;
  category?: string;
  ticker?: string;
  timestamp?: string;
  fullText?: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
} 