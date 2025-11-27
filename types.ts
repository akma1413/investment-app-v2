

export interface User {
  name: string;
  profileMsg: string;
  totalWinRate: number;
}

export interface MarketIndex {
  name: string;
  value: string;
  rate: number;
  trend: 'up' | 'down';
  chartData: number[];
}

export interface MarketWeather {
  status: string;
  summaryTitle: string;
  summaryBody: string;
  indices: MarketIndex[];
}

export interface SummaryHighlight {
  text: string;
  isBold: boolean;
}

export interface HotIssue {
  ticker: string;
  name: string;
  rate: number;
  cause: string;
  analystComment: string;
}

export interface LogicBlock {
  id: string | number;
  icon?: string;
  title: string;
  desc: string;
  isActive?: boolean;
}

export interface VolatilityAnalysis {
  type: 'Macro' | 'News' | 'Noise';
  level: 'High' | 'Medium';
  title: string;
  desc: string;
  timestamp: string;
}

export interface Event {
  dDay: string;
  title: string;
  type: string;
  impact: 'High' | 'Medium' | 'Low';
  status: string;
  result?: 'Hit' | 'Miss'; // Verification Result
  analystFeedback?: string; // Analyst's specific comment on the result
}

export interface NewsTag {
  type: 'Positive' | 'Negative';
  text: string;
  date: string;
}

export interface Thesis {
  id: number;
  ticker: string;
  name: string;
  avgPrice?: number;
  currentPrice: number;
  changeRate: number;
  status: 'Invested' | 'Watching';
  bigThesis: string;
  logicBlocks: LogicBlock[];
  events: Event[];
  newsTags: NewsTag[];
  dailyBriefing: string;
  volatilityAnalysis?: VolatilityAnalysis; // New field for Live Briefing
}

export interface RelatedStock {
  ticker: string;
  name: string;
  rate: number;
}

export interface TrendingLogic {
  rank: number;
  keyword: string;
  relatedStocksDetails: RelatedStock[]; // Updated for detailed list
  desc: string;
  title: string;
  subtitle: string;
  badge: string;
  theme: string;
}

export interface SearchResultSample {
  ticker: string;
  name: string;
  summary: string;
  chartContext: string;
  availableLogicBlocks: LogicBlock[];
}

export interface RecentSearch {
  id: number;
  ticker: string;
  name: string;
  date: string;
}

export interface Discovery {
  trendingLogics: TrendingLogic[];
  searchResultSample: SearchResultSample;
  recentSearches: RecentSearch[]; // New field
}

export interface Notification {
  id: number;
  type: 'alert' | 'info';
  title: string;
  desc: string;
  stockId?: number;
  timestamp: string;
  isRead: boolean;
}

export interface AppData {
  user: User;
  marketWeather: MarketWeather;
  summaryHighlights: SummaryHighlight[];
  hotIssues: HotIssue[];
  myThesis: Thesis[];
  discovery: Discovery;
  notifications: Notification[];
}

export interface StoreContextType {
  data: AppData;
  updateUserName: (name: string) => void;
  markNotificationAsRead: (id: number) => void;
}