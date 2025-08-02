const generateId = () => Math.random().toString(36).substr(2, 9);

interface MockArticleData {
  id: string;
  headline: string;
  fullText: string;
  source: string;
  timestamp: string;
  category: string;
  ticker?: string;
  logoUrl?: string;
}

const mockRawArticlesData: Omit<MockArticleData, 'id'>[] = [
  {
    headline: "Tech Giant 'InnovateCorp' Surges 15% After Announcing Breakthrough AI Chip",
    fullText: "InnovateCorp (Ticker: INVC) saw its stock price skyrocket by 15% in early trading today following the much-anticipated announcement of its new 'Prometheus' AI chip. The company claims Prometheus is 50% faster and 30% more energy-efficient than current market leaders. Analysts predict this could significantly disrupt the AI hardware market, currently dominated by Nvidia and AMD. The news also positively impacted semiconductor ETFs. The launch event highlighted several partnerships with major cloud providers who plan to integrate Prometheus into their data centers within the next six months. This development is expected to boost InnovateCorp's Q4 earnings substantially.",
    source: "MarketWatch Today",
    timestamp: "2024-07-28T09:30:00Z",
    category: "STOCKS",
    ticker: "INVC",
    logoUrl: "https://logo.clearbit.com/innovatecorp.com"
  },
  {
    headline: "IPO Alert: 'GreenLeaf Organics' Sets Price Range Amid Strong Investor Interest",
    fullText: "GreenLeaf Organics, a leading producer of sustainable agricultural products, has announced its initial public offering (IPO) price range of $22-$25 per share. The company aims to raise $300 million, valuing it at approximately $1.5 billion. Strong pre-IPO demand is being driven by the growing consumer preference for organic foods and sustainable practices. Roadshows are scheduled for next week, with the stock expected to list on the NASDAQ under the ticker 'GLFO'. This IPO is seen as a bellwether for the organic food sector, which has seen significant growth over the past five years. Funds raised will be used for expanding production facilities and R&D into new crop varieties.",
    source: "IPO Insights",
    timestamp: "2024-07-28T10:15:00Z",
    category: "IPO",
    ticker: "GLFO",
    logoUrl: "https://logo.clearbit.com/greenleaforganics.com"
  },
  {
    headline: "Federal Reserve Hints at Pausing Rate Hikes; Markets React Positively",
    fullText: "Global markets rallied after Federal Reserve Chair Jerome Powell hinted at a potential pause in interest rate hikes during his latest speech. Powell cited cooling inflation data and signs of a stabilizing labor market as reasons for a more cautious approach. The Dow Jones Industrial Average gained 300 points, and the S&P 500 was up 1.2%. Bond yields fell slightly on the news. While not a definitive commitment, this change in tone has provided relief to investors worried about an overly aggressive tightening cycle. The next FOMC meeting is eagerly awaited for more concrete signals. This could particularly benefit growth stocks and real estate sectors.",
    source: "Global Financial News",
    timestamp: "2024-07-27T16:00:00Z",
    category: "GLOBAL_MARKETS",
    logoUrl: "https://logo.clearbit.com/federalreserve.gov"
  },
  {
    headline: "Energy Sector: Oil Prices Dip as OPEC+ Agrees to Modest Production Increase",
    fullText: "Crude oil prices experienced a slight downturn after OPEC+ member countries agreed to a modest increase in oil production starting next month. The increase, smaller than some analysts expected, aims to balance market stability with growing global demand. Brent crude fell by 1.5% to $78 per barrel. While the increase is not substantial, it signals a willingness from OPEC+ to address supply concerns. This could have implications for inflation and energy company profits in the coming quarter. Consumers might see a slight relief at the pump, though geopolitical factors continue to play a significant role in energy price volatility.",
    source: "EnergyWire",
    timestamp: "2024-07-28T11:00:00Z",
    category: "COMMODITIES",
    ticker: "OIL",
    logoUrl: "https://logo.clearbit.com/opec.org"
  },
  {
    headline: "Retail Giant 'ShopSmart' Misses Earnings Estimates, Cites Supply Chain Woes",
    fullText: "ShopSmart (Ticker: SHPS) reported Q2 earnings that fell short of analyst expectations, causing its stock to drop 8% in after-hours trading. The retail giant cited ongoing supply chain disruptions and higher logistics costs as primary factors. CEO Jane Doe stated that while consumer demand remains robust, managing inventory and shipping has been challenging. The company is investing in new warehousing technology and diversifying its supplier base to mitigate these issues. Despite the miss, ShopSmart maintained its full-year guidance, expressing optimism for improvement in the second half of the year. This report has raised concerns about the broader retail sector's resilience.",
    source: "EarningsToday",
    timestamp: "2024-07-27T20:30:00Z",
    category: "Q_RESULTS",
    ticker: "SHPS",
    logoUrl: "https://logo.clearbit.com/shopsmart.com"
  },
  {
    headline: "Emerging Markets Focus: India's Sensex Hits Record High on Strong FII Inflows",
    fullText: "India's benchmark stock index, the Sensex, reached a new all-time high today, driven by strong foreign institutional investor (FII) inflows and positive domestic economic indicators. FIIs have poured over $5 billion into Indian equities this month, attracted by the country's growth prospects and relatively stable inflation. The rally was broad-based, with financial and IT stocks leading the gains. This performance contrasts with some other emerging markets that are facing currency pressures. The Indian government's focus on infrastructure development and manufacturing incentives is also seen as a key long-term growth driver.",
    source: "Asia Pacific Markets",
    timestamp: "2024-07-28T08:00:00Z",
    category: "INDICES_MOVEMENT",
    ticker: "SENSEX",
    logoUrl: "https://logo.clearbit.com/bseindia.com"
  },
  {
    headline: "Crypto Update: Bitcoin Stabilizes Above $30k After Volatile Week",
    fullText: "Bitcoin (BTC) has found some stability above the $30,000 mark after a particularly volatile week that saw its price fluctuate by over 10%. The stabilization comes amidst renewed institutional interest and positive regulatory developments in some jurisdictions. However, concerns about macroeconomic headwinds and potential further regulatory scrutiny in other regions continue to create uncertainty. Ethereum (ETH) also followed a similar pattern, trading around $1,900. Trading volumes remain moderate, suggesting a wait-and-see approach from many investors. The overall crypto market capitalization is currently holding steady.",
    source: "CryptoNews Daily",
    timestamp: "2024-07-28T12:00:00Z",
    category: "CRYPTO",
    ticker: "BTC",
    logoUrl: "https://logo.clearbit.com/bitcoin.org"
  }
];

// To ensure we don't reuse the same set of articles if refresh is hit multiple times
let lastUsedIndex = -1;

export const mockNewsService = {
  getMockRawArticles: (count: number): MockArticleData[] => {
    const articlesToReturn: MockArticleData[] = [];
    const availableArticles = mockRawArticlesData.length;
    
    for (let i = 0; i < count; i++) {
      lastUsedIndex = (lastUsedIndex + 1) % availableArticles;
      const articleData = mockRawArticlesData[lastUsedIndex];
      articlesToReturn.push({
        ...articleData,
        id: `${generateId()}-${lastUsedIndex}`,
        logoUrl: articleData.logoUrl || `https://picsum.photos/seed/${articleData.ticker || articleData.source}/50/50`
      });
    }
    return articlesToReturn;
  }
};