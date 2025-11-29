
export interface User {
  name: string;
  profileMsg: string;
  totalWinRate: number;
  totalAssetValue: number;
  totalProfitValue: number;
  totalProfitRate: number;
  holdings: {
    domestic: Holding[];
    overseas: Holding[];
  };
}

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  currency: 'KRW' | 'USD';
  valuation: number;
  profitValue: number;
  profitRate: number;
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

export interface LogicHistoryItem {
  date: string;
  type: 'Positive' | 'Negative' | 'Neutral' | 'Success' | 'Failure'; 
  category?: 'News' | 'Decision';
  text: string;
  badgeText?: string;
}

export interface LogicBlock {
  id: string | number;
  icon?: string;
  title: string;
  desc: string;
  isActive?: boolean;
  history?: LogicHistoryItem[];
  healthScore?: number;
}

export interface VolatilityAnalysis {
  type: 'Macro' | 'News' | 'Noise';
  level: 'High' | 'Medium';
  title: string;
  desc: string;
  timestamp: string;
}

export type EventPhase = 'Pre-Event' | 'Post-Event' | 'None';

export interface ActionOption {
  label: string;
  actionType: 'buy' | 'sell' | 'hold' | 'revise';
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface EventActionScenario {
  phase: EventPhase;
  title: string;
  description: string;
  marketReaction?: string;
  myHypothesisCheck?: string;
  options: ActionOption[];
  analysisContext?: {
    signal: 'Warning' | 'Opportunity' | 'Neutral';
    message: string;
    highlightColor: string;
  };
}

export interface Event {
  dDay: string;
  title: string;
  type: string;
  impact: 'High' | 'Medium' | 'Low';
  status: string;
  actionScenario?: EventActionScenario;
}

export interface VerificationResult {
  status: 'Hit' | 'Miss';
  title: string;
  comment: string;
  date: string;
}

export interface NewsItem {
  type: 'Positive' | 'Negative' | 'Neutral';
  text: string;
  date: string;
  analystComment?: string;
  relatedLogicId?: string | number;
}

export type QuizCategory = 'LongTerm' | 'ShortTerm';

export interface QuizOption {
  text: string;
  type: 'bull' | 'bear' | 'idk';
  relatedLogicId?: string | number;
}

export interface QuizQuestion {
  id: number;
  category: QuizCategory;
  question: string;
  backgroundContext?: string;
  options: QuizOption[];
  relatedInfo?: {
    title: string;
    content: string[];
  };
}

export interface CompanyProfile {
  summary: string;
  description: string;
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

export interface Thesis {
  id: number;
  ticker: string;
  name: string;
  avgPrice?: number;
  currentPrice: number;
  changeRate: number;
  status: 'Invested' | 'Watching';
  
  bigThesis: string;
  companyProfile: CompanyProfile;
  
  logicBlocks: LogicBlock[];
  quizData: QuizQuestion[];
  
  events: Event[];
  newsTags: NewsItem[];
  dailyBriefing: string;
  
  chartHistory: Record<TimeFrame, number[]>;
  chartNarratives: Record<TimeFrame, string>;
  
  volatilityAnalysis?: VolatilityAnalysis; 
  verificationResult?: VerificationResult;
}

export interface RelatedStock {
  ticker: string;
  name: string;
  rate: number;
}

export interface TrendingLogic {
  rank: number;
  keyword: string;
  relatedStocksDetails: RelatedStock[];
  desc: string;
  title: string;
  subtitle: string;
  badge: string;
  theme: string;
}

export interface SearchResultSample {
  ticker: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  
  companyProfile: CompanyProfile;
  chartContext: string;
  
  availableLogicBlocks: LogicBlock[];
  quizData: QuizQuestion[];
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
  recentSearches: RecentSearch[];
  searchResults: SearchResultSample[];
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
  hotIssues: any[];
  myThesis: Thesis[];
  discovery: Discovery;
  notifications: Notification[];
}

export interface StoreContextType {
  data: AppData;
  updateUserName: (name: string) => void;
  markNotificationAsRead: (id: number) => void;
  searchStocks: (query: string) => void;
  selectDiscoveryStock: (ticker: string) => void;
  addToMyThesis: (stock: SearchResultSample, selectedLogicIds: number[], investmentType: string, amount?: string) => Thesis;
}
