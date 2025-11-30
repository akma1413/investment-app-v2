

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

// --- MARKET DATA ---
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

// --- LOGIC & NARRATIVE (New) ---

export interface NarrativeProfile {
  summary: string;
  whyNow: string;
  floor: string;
  upside: string;
  debate: string[];
  theBet: string;
}

export interface WatchpointOption {
  label: string;
  side: 'Bull' | 'Bear';
  implications?: string;
}

export interface Watchpoint {
  id: number;
  question: string;
  context: string;
  options: WatchpointOption[];
}

export interface LogicHealth {
  score: number;
  status: 'Good' | 'Warning' | 'Danger';
  history: any[];
}

// Legacy LogicBlock for compatibility
export interface LogicBlock {
  id: string | number;
  icon?: string;
  title: string;
  desc: string;
  isActive?: boolean;
  history?: any[];
}

// --- UNIFIED EVENT SYSTEM ---

export interface EventCheckpoint {
  watchpointId: number;
  status: 'Pending' | 'Pass' | 'Fail';
  actualValue?: string;
}

export interface EventScenario {
  label: string;
  action: 'buy' | 'hold' | 'sell';
}

export interface EventActionHistory {
  decision: 'buy' | 'hold' | 'sell';
  date: string;
}

export interface Event {
  id: string;
  title: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  type: string;
  date: string; // Replaces dDay
  
  // Legacy fields compatibility
  dDay?: string;
  impact?: 'High' | 'Medium' | 'Low';
  actionScenario?: any;

  // New fields
  checkpoints?: EventCheckpoint[];
  marketReaction?: {
    priceChange: string;
    volumeChange: string;
    comment: string;
  };
  analysis?: {
    cause: string;
    context: string;
  };
  scenarios?: EventScenario[];
  myActionHistory?: EventActionHistory;
}

// --- NEWS SYSTEM ---
export interface NewsItem {
  type: 'Positive' | 'Negative' | 'Neutral';
  text: string;
  date: string;
  analystComment?: string;
  relatedLogicId?: string | number;
}

// --- QUIZ & LEARNING SYSTEM (Legacy support) ---
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
  learningContext?: {
    targetTab: 'profile' | 'chart' | 'news';
    hint: string;
  };
}

// --- COMPANY INFO ---
export interface CompanyProfile {
  summary: string;
  description: string;
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

// --- MAIN THESIS STRUCTURE ---
export interface Thesis {
  id: number;
  ticker: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  status: 'Invested' | 'Watching';
  
  // New Core
  narrative?: NarrativeProfile;
  watchpoints: Watchpoint[];
  logicHealth: LogicHealth;
  
  // Legacy/Shared
  bigThesis?: string;
  companyProfile: CompanyProfile;
  logicBlocks: LogicBlock[];
  quizData?: QuizQuestion[];
  events: Event[];
  newsTags: NewsItem[];
  dailyBriefing: string;
  
  chartHistory: Record<TimeFrame, number[]>;
  chartNarratives: Record<TimeFrame, string>;
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

// --- SEARCH & DISCOVERY ---
export interface SearchResultSample {
  ticker: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  
  companyProfile: CompanyProfile;
  chartContext: string;
  
  // Core Data
  narrative?: NarrativeProfile;
  watchpoints?: Watchpoint[];
  availableLogicBlocks: LogicBlock[];
  events?: Event[];
  quizData?: QuizQuestion[];
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
  ticker?: string;
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
  recordEventDecision: (thesisId: number, eventId: string, decision: 'buy' | 'hold' | 'sell') => void;
}