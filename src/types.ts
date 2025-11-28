

export interface User {
  name: string;
  profileMsg: string;
  totalWinRate: number;
  totalAssetValue: number;
  totalProfitValue: number;
  totalProfitRate: number;
  // [New Field] Portfolio Details
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
  valuation: number;   // Current Value in KRW
  profitValue: number; // Profit/Loss amount in KRW
  profitRate: number;  // Profit/Loss rate (%)
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

// --- LOGIC & THESIS ---
export interface LogicHistoryItem {
  date: string;
  type: 'Positive' | 'Negative' | 'Neutral' | 'Success' | 'Failure'; // Extended for Decision Logs
  category?: 'News' | 'Decision'; // To distinguish type of log
  text: string; // e.g., "Earnings beat expectations supporting this"
  badgeText?: string; // e.g. "+5% Saved"
}

export interface LogicBlock {
  id: string | number;
  icon?: string;
  title: string; // Casual title: "AI makes Cloud money"
  desc: string; // Detail
  isActive?: boolean;
  history?: LogicHistoryItem[]; // Added for Drill-down
  healthScore?: number; // 0-100 score for validity
}

export interface VolatilityAnalysis {
  type: 'Macro' | 'News' | 'Noise';
  level: 'High' | 'Medium';
  title: string;
  desc: string;
  timestamp: string;
}

// --- EVENT DRIVEN SYSTEM ---
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
  marketReaction?: string; // Only for Post-Event
  myHypothesisCheck?: string; // Only for Post-Event
  options: ActionOption[];
  // New fields for Step 2 Context
  analysisContext?: {
    signal: 'Warning' | 'Opportunity' | 'Neutral';
    message: string; // "Wait! Volume is spiking abnormally."
    highlightColor: string;
  };
}

export interface Event {
  dDay: string;
  title: string;
  type: string;
  impact: 'High' | 'Medium' | 'Low';
  status: string;
  actionScenario?: EventActionScenario; // Added for Event-Driven Interaction
}

export interface VerificationResult {
  status: 'Hit' | 'Miss';
  title: string;
  comment: string;
  date: string;
}

// --- NEWS SYSTEM ---
export interface NewsItem {
  type: 'Positive' | 'Negative' | 'Neutral';
  text: string;
  date: string;
  analystComment?: string; // Added for enhanced context
  relatedLogicId?: string | number; // Added to link with logic blocks
}

// --- QUIZ & LEARNING SYSTEM ---
export type QuizCategory = 'LongTerm' | 'ShortTerm';

export interface QuizOption {
  text: string;
  type: 'bull' | 'bear' | 'idk';
  relatedLogicId?: string | number; // ID of the logic block this option supports
}

export interface QuizQuestion {
  id: number;
  category: QuizCategory;
  question: string;
  backgroundContext?: string; // Explains the "Why" before the question
  options: QuizOption[];
  relatedInfo?: {
    title: string;
    content: string[]; // Supports *bold* parsing
  };
}

// --- COMPANY INFO ---
export interface CompanyProfile {
  summary: string; // 3-line summary
  description: string; // Easy explanation for beginners
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

// --- MAIN THESIS STRUCTURE ---
export interface Thesis {
  id: number;
  ticker: string;
  name: string;
  avgPrice?: number;
  currentPrice: number;
  changeRate: number;
  status: 'Invested' | 'Watching';
  
  bigThesis: string; // Main one-liner thesis
  companyProfile: CompanyProfile; // Added
  
  logicBlocks: LogicBlock[];
  quizData: QuizQuestion[]; // Added for Learning Loop
  
  events: Event[];
  newsTags: NewsItem[]; // Renamed/Upgraded from NewsTag
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

// --- SEARCH & DISCOVERY ---
export interface SearchResultSample {
  ticker: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  
  companyProfile: CompanyProfile; // Added to match Thesis
  chartContext: string;
  
  availableLogicBlocks: LogicBlock[];
  quizData: QuizQuestion[]; // Added for Builder
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
  hotIssues: any[]; // Deprecated but kept for type safety if needed temporarily
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