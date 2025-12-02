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

// --- NEW CORE: NARRATIVE & LOGIC ---
export interface NarrativeStep {
  title: string;
  content: string; // Markdown supported
}

export interface NarrativeProfile {
  question: string; // Main overarching question
  steps: {
    history: NarrativeStep; // Step 1: Why Now?
    floor: NarrativeStep;   // Step 2: The Floor
    upside: NarrativeStep;  // Step 3: The Upside
    debate: {               // Step 4: Debate & Data
      title: string;
      question: string;
      bulls: { title: string; items: string[] }[];
      bears: { title: string; items: string[] }[];
    };
    final: {                // Step 5: The Final Bet
      title: string;
      content: string;
      options: {
        label: string;
        value: 'Buy' | 'Watch';
        desc: string;
      }[];
    };
  };
}

export interface WatchpointOption {
  label: string;
  side: 'Bull' | 'Bear';
  implications?: string;
}

export interface Watchpoint {
  id: number;
  title: string; // e.g. "[기존 사업]", "[신규 사업]"
  question: string;
  context: string;
  options: WatchpointOption[];
}

export interface LogicHealth {
  score: number;
  status: 'Good' | 'Warning' | 'Danger';
  history: {
    date: string;
    scoreChange: number;
    reason: string;
  }[];
}

// Legacy support (to be removed later)
export interface LogicBlock {
  id: string | number;
  icon?: string;
  title: string;
  desc: string;
  isActive?: boolean;
  history?: { date: string; type: string; text: string; category?: string; badgeText?: string; }[];
}

// --- NEW CORE: EVENTS ---
export interface EventCheckpoint {
  watchpointId: number;
  status: 'Pending' | 'Pass' | 'Fail';
  actualValue?: string;
}

export interface EventScenario {
  label: string;
  action: 'buy' | 'hold' | 'sell';
  rationale: string;
}

export interface EventActionHistory {
  decision: 'buy' | 'hold' | 'sell';
  date: string;
  pnl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  relatedWatchpointId?: number;
  factCheck?: {
    status: 'Pass' | 'Fail' | 'Pending';
    actualValue: string;
    description: string;
  };
  marketReaction: {
    priceChange: string;
    volumeChange: string;
    comment: string;
  };
  analysis: {
    cause: string;
    context?: string;
    implication: string;
  };
  pros: string[];
  cons: string[];
  scenarios: EventScenario[];
  myActionHistory?: EventActionHistory;
  impact?: 'High' | 'Medium' | 'Low';
}

export interface NewsItem {
  type: 'Positive' | 'Negative' | 'Neutral';
  text: string;
  date: string;
  analystComment?: string;
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
  currentPrice: number;
  changeRate: number;
  status: 'Invested' | 'Watching';
  narrative: NarrativeProfile;
  watchpoints: Watchpoint[];
  logicHealth: LogicHealth;
  events: Event[];
  logicBlocks: LogicBlock[];
  companyProfile: CompanyProfile;
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

export interface SearchResultSample {
  ticker: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  companyProfile: CompanyProfile;
  chartContext: string;
  narrative: NarrativeProfile;
  watchpoints: Watchpoint[];
  events?: Event[]; // Added events array
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
  addToMyThesis: (stock: SearchResultSample, selectedWatchpointIndices: number[], investmentType: string, amount?: string) => Thesis;
  recordEventDecision: (thesisId: number, eventId: string, decision: 'buy' | 'hold' | 'sell') => void;
}