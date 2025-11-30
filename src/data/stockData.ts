import { SearchResultSample, AppData, Thesis } from '../types';
import { generateChartData } from '../utils/chartUtils';

// Helper for placeholder narrative
const pendingNarrative = {
  summary: "데이터 업데이트 대기 중...",
  whyNow: "분석 중",
  floor: "분석 중",
  upside: "분석 중",
  debate: [],
  theBet: "분석 중"
};

export const ALL_STOCKS: SearchResultSample[] = [
  {
    ticker: "035900",
    name: "JYP Ent.",
    currentPrice: 62000,
    changeRate: -1.5,
    companyProfile: {
      summary: "K-POP 시스템을 수출하는 글로벌 엔터 기업",
      description: "트와이스, 스트레이키즈 등 글로벌 아티스트를 보유. 최근 미국(VCHA), 일본(NiziU) 등 현지화 그룹을 통해 시스템 수출을 시도하고 있습니다."
    },
    chartContext: "엔터 업종 센티멘트 악화로 조정 중이나, 밸류에이션 매력이 부각되는 구간입니다.",
    narrative: {
      summary: "K-POP 시스템 수출이 성공하여 글로벌 플랫폼 기업으로 재평가받을 수 있을까?",
      whyNow: "피크아웃 우려로 주가 조정 중이나, 시스템 수출이라는 새로운 모멘텀 대기 중.",
      floor: "기존 아티스트(스트레이키즈 등)의 캐시카우 능력은 주가에 반영되어 하방을 지지함.",
      upside: "미국(VCHA), 일본(NiziU) 등 현지화 그룹의 성공 시 멀티플 리레이팅 가능.",
      debate: ["엔터 업종 피크아웃 우려", "현지화 그룹의 수익 기여 시점"],
      theBet: "JYP의 시스템이 인종/국가를 초월한 글로벌 표준이 될 것이라 믿습니까?"
    },
    watchpoints: [
      {
        id: 1,
        question: "[현지화] 미국판 걸그룹 'VCHA'는 성공할 수 있을까요?",
        context: "JYP 시스템 수출의 핵심 시험대입니다. 단순 화제성을 넘어 빌보드 진입 등 실질적 성과가 필요합니다.",
        options: [
          { label: "시스템 수출 성공 (Bull)", side: "Bull", implications: "멀티플 확장" },
          { label: "문화적 장벽 확인 (Bear)", side: "Bear", implications: "성장성 훼손" }
        ]
      },
      {
        id: 2,
        question: "[본업 방어력] 앨범이 예전보다 덜 팔려도 괜찮을까요?",
        context: "앨범 판매량 감소는 업계 추세입니다. 콘서트/음원 수익이 이를 얼마나 상쇄할지가 관건입니다.",
        options: [
          { label: "이익 방어 가능 (Bull)", side: "Bull", implications: "실적 안정성 확인" },
          { label: "이익 감소 불가피 (Bear)", side: "Bear", implications: "실적 쇼크 주의" }
        ]
      }
    ],
    // [NEW] Active Event for Testing
    availableLogicBlocks: [], 
    events: [ // If type error, ignore logicBlocks and ensure Thesis type has events
        {
            id: 'evt-jyp-1',
            title: 'VCHA 글로벌 데뷔 초기 지표 발표',
            status: 'Active',
            type: 'Issue',
            date: 'Today',
            checkpoints: [
                { watchpointId: 1, status: 'Pending' }
            ],
            marketReaction: {
                priceChange: '-1.5%',
                volumeChange: '평소의 2배',
                comment: '초기 지표가 엇갈리며 실망 매물이 나오고 있습니다.'
            },
            analysis: {
                cause: '스포티파이 스트리밍 수치가 예상치를 소폭 하회했습니다.',
                context: '하지만 유튜브 조회수는 견조하여 팬덤 형성의 가능성은 확인되었습니다.'
            },
            scenarios: [
                { label: '추가 매수 (기회)', action: 'buy' },
                { label: '관망 (지켜보기)', action: 'hold' },
                { label: '비중 축소 (리스크)', action: 'sell' }
            ]
        }
    ]
  },
  {
    ticker: "GOOGL",
    name: "구글",
    currentPrice: 175.4,
    changeRate: -1.2,
    companyProfile: {
      summary: "전 세계 검색 시장의 90%를 장악한 검색 제왕",
      description: "구글은 검색, 유튜브, 안드로이드를 보유한 거대 IT 기업입니다."
    },
    chartContext: "최근 반독점 소송 이슈로 등락을 반복하고 있습니다.",
    narrative: {
       summary: "AI 전환기의 구글, 검색 제왕의 지위를 지킬 수 있을까?",
       whyNow: "Gemini 2.0 공개 임박. AI 검색 도입에 따른 마진율 변화가 핵심.",
       floor: "유튜브와 클라우드의 견고한 성장세.",
       upside: "AI 에이전트 시장 장악 시 밸류에이션 재평가.",
       debate: ["검색 점유율 하락 우려", "AI 비용 증가"],
       theBet: "구글이 AI 시대에도 검색의 주도권을 유지할 것이라 보십니까?"
    },
    watchpoints: [
        {
            id: 1,
            question: "AI 검색 도입이 광고 매출을 깎아먹을까요?",
            context: "AI가 답을 바로 주면 광고를 덜 보게 됩니다. 이를 상쇄할 새로운 수익 모델이 필요합니다.",
            options: [
                { label: "신규 수익 창출 (Bull)", side: "Bull" },
                { label: "매출 잠식 (Bear)", side: "Bear" }
            ]
        }
    ],
    availableLogicBlocks: [],
    // [NEW] Upcoming Event
    events: [
        {
            id: 'evt-goog-1',
            title: 'Gemini 2.0 공개 언팩',
            status: 'Upcoming',
            type: 'Product Launch',
            date: 'D-7',
            checkpoints: [{ watchpointId: 1, status: 'Pending' }],
            marketReaction: { priceChange: '', volumeChange: '', comment: '' },
            analysis: { cause: '', context: '' },
            scenarios: []
        }
    ]
  },
  // ... (Other stocks need minimal placeholder events to prevent UI errors)
  {
    ticker: "TSLA",
    name: "테슬라",
    currentPrice: 240.5,
    changeRate: 5.2,
    companyProfile: { summary: "AI 로보틱스 기업", description: "..." },
    chartContext: "반등 중",
    narrative: pendingNarrative,
    watchpoints: [],
    availableLogicBlocks: [],
    events: [
        {
            id: 'evt-tsla-1',
            title: '로보택시 규제 승인 청문회',
            status: 'Active',
            type: 'IR Event',
            date: 'Live',
            checkpoints: [],
            marketReaction: { priceChange: '+5.2%', volumeChange: '폭발', comment: '규제 완화 기대감으로 급등 중입니다.' },
            analysis: { cause: '우호적인 발언이 이어지고 있습니다.', context: '연내 승인 가능성이 높아졌습니다.' },
            scenarios: [
                { label: '추격 매수', action: 'buy' },
                { label: '홀딩', action: 'hold' }
            ]
        }
    ]
  },
  // Generic placeholders for others to ensure no empty arrays
  ...[
    { ticker: "PLTR", name: "팔란티어" },
    { ticker: "NVDA", name: "엔비디아" },
    { ticker: "000660", name: "SK하이닉스" },
    { ticker: "005930", name: "삼성전자" },
    { ticker: "AMZN", name: "아마존" },
    { ticker: "AMD", name: "AMD" }
  ].map(s => ({
      ticker: s.ticker,
      name: s.name,
      currentPrice: 100,
      changeRate: 0,
      companyProfile: { summary: "정보 없음", description: "" },
      chartContext: "",
      narrative: pendingNarrative,
      watchpoints: [],
      availableLogicBlocks: [],
      events: [
          {
            id: `evt-${s.ticker}-1`,
            title: '2분기 실적 발표',
            status: 'Upcoming' as const,
            type: 'Earnings',
            date: 'D-14',
            checkpoints: [],
            marketReaction: { priceChange: '', volumeChange: '', comment: '' },
            analysis: { cause: '', context: '' },
            scenarios: []
          }
      ]
  }))
];

export const getInitialData = (): AppData => ({
  user: {
    name: "시미",
    profileMsg: "논리적인 투자자",
    totalWinRate: 70,
    totalAssetValue: 117913851,
    totalProfitValue: 34714499,
    totalProfitRate: 41.7,
    holdings: {
      domestic: [
        { id: 'd1', ticker: '000660', name: 'SK하이닉스', quantity: 44, currency: 'KRW', valuation: 8140000, profitValue: -547180, profitRate: -6.3 },
        { id: 'd2', ticker: '005930', name: '삼성전자', quantity: 120, currency: 'KRW', valuation: 9000000, profitValue: -183600, profitRate: -2.0 },
        // [NEW] Added JYP for Onboarding Test
        { id: 'd3', ticker: '035900', name: 'JYP Ent.', quantity: 50, currency: 'KRW', valuation: 3100000, profitValue: -450000, profitRate: -12.5 }
      ],
      overseas: [
        { id: 'o1', ticker: 'GOOGL', name: '구글', quantity: 98, currency: 'USD', valuation: 23520000, profitValue: 12408900, profitRate: 111.7 },
        { id: 'o2', ticker: 'AMZN', name: '아마존', quantity: 33, currency: 'USD', valuation: 8250000, profitValue: 1966500, profitRate: 31.3 },
        { id: 'o3', ticker: 'NVDA', name: '엔비디아', quantity: 10, currency: 'USD', valuation: 12400000, profitValue: 7294800, profitRate: 142.7 }
      ]
    }
  },
  marketWeather: {
    status: "Cloudy",
    summaryTitle: "기술주 숨 고르기",
    summaryBody: "",
    indices: [] // Simplified for brevity
  },
  summaryHighlights: [],
  hotIssues: [],
  myThesis: [], // Will be populated by StoreContext
  discovery: {
    recentSearches: [],
    searchResults: [],
    trendingLogics: [],
    searchResultSample: ALL_STOCKS[0]
  },
  notifications: [
    {
      id: 1,
      type: "alert",
      title: "JYP Ent. 이벤트 발생",
      desc: "글로벌 데뷔 지표 발표. 대응이 필요합니다.",
      stockId: 1, // Will be mapped later
      ticker: "035900",
      timestamp: "방금 전",
      isRead: false
    }
  ]
});