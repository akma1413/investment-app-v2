


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
  summary: string; // One-line summary for cards
  whyNow: string;
  floor: string;
  upside: string;
  debate: string[]; // Bull/Bear points
  theBet: string; // The core question to the user
}

export type QuizCategory = 'LongTerm' | 'ShortTerm';

export interface WatchpointOption {
  label: string; // e.g., "Bull: 이익 방어 가능"
  side: 'Bull' | 'Bear';
  implications?: string;
  
  // Legacy/UI Compatibility
  text?: string; // alias for label
  type?: 'bull' | 'bear' | 'idk'; // alias for side
  relatedLogicId?: number | string;
}

export interface Watchpoint {
  id: number;
  question: string;
  context: string; // Background info
  options: WatchpointOption[];

  // Legacy/UI Compatibility
  category?: QuizCategory;
  backgroundContext?: string; // alias for context
  relatedInfo?: { title: string; content: string[] };
}

export interface LogicHealth {
  score: number; // 0-100
  status: 'Good' | 'Warning' | 'Danger';
  history: {
    date: string;
    scoreChange: number;
    reason: string;
  }[];
}

// Deprecated LogicBlock for backward compatibility during migration, 
// but can be repurposed as visual chips in the UI.
export interface LogicBlock {
  id: string | number;
  icon?: string;
  title: string;
  desc: string;
  isActive?: boolean;
  history?: { date: string; type: string; text: string; category?: string; badgeText?: string; }[];
}

// --- UNIFIED EVENT SYSTEM (New) ---

export interface EventCheckpoint {
  watchpointId: number;
  status: 'Pending' | 'Pass' | 'Fail';
  actualValue?: string;
}

export interface EventScenario {
  label: string; // e.g., "Aggressive Buy", "Risk Control"
  action: 'buy' | 'hold' | 'sell';
  // Legacy support for UI mapping
  actionType?: 'buy' | 'hold' | 'sell';
}

export interface EventActionHistory {
  decision: 'buy' | 'hold' | 'sell';
  date: string;
  pnl?: string; // Profit/Loss at that time
}

export interface Event {
  id: string;
  title: string;
  date: string; // Replaces dDay
  type: string; // Earnings, Product Launch, etc.
  status: 'Upcoming' | 'Active' | 'Completed';
  
  // Linkage to Watchpoints
  checkpoints: EventCheckpoint[];
  
  // Post-Event Analysis
  marketReaction: {
    priceChange: string;
    volumeChange: string;
    comment: string;
  };
  analysis: {
    cause: string;
    context: string;
  };
  
  // Actionable Scenarios
  scenarios: EventScenario[];
  
  // User History
  myActionHistory?: EventActionHistory;

  // Legacy/UI Compatibility
  impact?: 'High' | 'Medium' | 'Low';
}

// --- NEWS SYSTEM ---
export interface NewsItem {
  type: 'Positive' | 'Negative' | 'Neutral';
  text: string;
  date: string;
  analystComment?: string;
  relatedWatchpointId?: number; // Linked to Watchpoint instead of LogicId
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
  
  // Asset Data
  avgPrice?: number;
  currentPrice: number;
  changeRate: number;
  status: 'Invested' | 'Watching';
  
  // Narrative Core (New)
  narrative: NarrativeProfile;
  watchpoints: Watchpoint[]; // Replaces QuizData
  logicHealth: LogicHealth;  // New metric
  
  // Legacy Logic Blocks (kept for visual compatibility if needed)
  logicBlocks: LogicBlock[]; 
  
  // Event Loop
  events: Event[];
  
  // Context
  companyProfile: CompanyProfile;
  newsTags: NewsItem[];
  dailyBriefing: string;
  
  // Charts
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
  narrative: NarrativeProfile;
  watchpoints: Watchpoint[];
  availableLogicBlocks: LogicBlock[]; // Legacy

  events?: Event[]; // Optional events for seeding data
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
  ticker?: string; // Added for robust deep linking
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
  addToMyThesis: (stock: SearchResultSample, selectedWatchpointIndices: number[], investmentType: string, amount?: string) => Thesis;
  recordEventDecision: (thesisId: number, eventId: string, decision: 'buy' | 'hold' | 'sell') => void;
}
