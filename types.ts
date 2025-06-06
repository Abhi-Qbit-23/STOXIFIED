
export interface NewsArticle {
  id: string;
  headline: string;
  url: string;
  summary: string;
  source: string;
  scraped_at: string;
  isLoadingSummary?: boolean;
};

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}