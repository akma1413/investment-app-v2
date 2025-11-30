

import { SearchResultSample, AppData, Thesis } from '../types';
import { generateChartData } from '../utils/chartUtils';

// Helper to create default LogicHealth
const defaultHealth = {
  score: 80,
  status: 'Good' as const,
  history: []
};

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
    availableLogicBlocks: [] // Legacy support
  },
  {
    ticker: "PLTR",
    name: "팔란티어",
    currentPrice: 25.4,
    changeRate: 1.2,
    companyProfile: {
      summary: "CIA가 쓰는 빅데이터 분석 및 AI 플랫폼",
      description: "원래는 정부와 군대에서 테러리스트를 잡는 소프트웨어를 만들던 회사인데, 이제는 일반 기업들이 AI를 도입할 때 쓰는 필수 플랫폼을 팔고 있습니다."
    },
    chartContext: "흑자 전환 안착 후 밸류에이션 리레이팅이 진행 중입니다.",
    narrative: {
      summary: "특수 목적의 방산 기업에서, 전 산업의 필수 운영체제(OS)로 진화할 것인가?",
      whyNow: "AIP 출시 후 민간 부문 매출 급증 중. 단순 테마주에서 실적주로 변모하는 구간.",
      floor: "미국 국방부 및 동맹국의 안보 인프라 독점. 불황에도 성장하는 정부 매출.",
      upside: "민간 기업들이 AIP를 도입하며 '비싸도 쓰는 필수재'임을 증명해야 함.",
      debate: ["높은 밸류에이션 부담", "민간 확장 속도"],
      theBet: "미래 기업들이 가장 강력한 하나의 통합 툴(팔란티어)을 선택할 것이라 보십니까?"
    },
    watchpoints: [
      {
        id: 1,
        question: "[확장성] 일반 기업들도 비싼 돈을 주고 팔란티어를 쓸까요?",
        context: "데이터 복잡성이 임계치를 넘으면, 결국 비싸더라도 확실한 해결책을 찾게 됩니다.",
        options: [
          { label: "대체 불가 필수재 등극 (Bull)", side: "Bull", implications: "민간 매출 폭발" },
          { label: "저렴한 툴 조합으로 이탈 (Bear)", side: "Bear", implications: "성장률 둔화" }
        ]
      },
      {
        id: 2,
        question: "[수익성] '소프트웨어 회사'처럼 돈을 벌 수 있을까요?",
        context: "설치 시 엔지니어가 투입되는 구조를 깨고, AI 자동화로 마진율을 높여야 합니다.",
        options: [
          { label: "마진율 획기적 개선 (Bull)", side: "Bull", implications: "영업레버리지 발생" },
          { label: "고비용 구조 지속 (Bear)", side: "Bear", implications: "이익률 정체" }
        ]
      }
    ],
    availableLogicBlocks: []
  },
  {
    ticker: "TSLA",
    name: "테슬라",
    currentPrice: 240.5,
    changeRate: 5.2,
    companyProfile: {
      summary: "전기차를 넘어 AI 로보틱스 기업으로 진화 중",
      description: "단순히 차를 파는 회사가 아닙니다. 자율주행 소프트웨어(FSD)와 휴머노이드 로봇을 통해 미래 모빌리티와 노동 시장을 혁신하려는 기업입니다."
    },
    chartContext: "규제 완화 기대감으로 바닥을 찍고 급반등하고 있습니다.",
    narrative: {
      summary: "전기차 제조사를 넘어, AI & 로보틱스 기업으로의 퀀텀 점프를 증명할 때.",
      whyNow: "FSD v12 배포와 로보택시 공개 임박. 전기차 캐즘을 SW 수익으로 돌파 시도.",
      floor: "전기차 치킨게임 승자로서의 시장 지배력과 원가 경쟁력.",
      upside: "완전 자율주행(FSD) 및 로보택시의 상용화 성공.",
      debate: ["전기차 수요 둔화", "FSD 규제 리스크"],
      theBet: "테슬라가 단순 제조사가 아닌 AI 플랫폼 기업으로 재평가받을 수 있을까요?"
    },
    watchpoints: [
      {
        id: 1,
        question: "[수익성] 차 가격 인하 중단 및 마진율 회복 여부.",
        context: "점유율 방어를 위한 가격 인하가 마진을 훼손했습니다. 이제는 수익성 회복이 필요합니다.",
        options: [
          { label: "마진율 반등 성공 (Bull)", side: "Bull" },
          { label: "출혈 경쟁 지속 (Bear)", side: "Bear" }
        ]
      },
      {
        id: 2,
        question: "[AI] FSD 규제 승인 및 로보택시 구체화.",
        context: "기술적 완성도를 넘어 규제 당국의 승인을 받아내는 것이 핵심 마일스톤입니다.",
        options: [
          { label: "규제 승인 획득 (Bull)", side: "Bull" },
          { label: "출시 지연 (Bear)", side: "Bear" }
        ]
      }
    ],
    availableLogicBlocks: []
  },
  {
    ticker: "NVDA",
    name: "엔비디아",
    currentPrice: 950.0,
    changeRate: 2.5,
    companyProfile: {
      summary: "AI 시대의 총아, GPU 리더",
      description: "AI 데이터센터에 들어가는 GPU 시장을 사실상 독점하고 있습니다."
    },
    chartContext: "AI 수요 폭증으로 기록적인 상승세를 보이고 있습니다.",
    narrative: {
      summary: "AI 시대의 독점적 인프라. 이 파티는 닷컴버블인가, 인터넷 혁명인가?",
      whyNow: "Blackwell 신제품 출시와 빅테크들의 CAPEX 상향 경쟁.",
      floor: "CUDA 생태계가 구축한 강력한 경제적 해자.",
      upside: "Sovereign AI(국가별 자체 AI) 수요로 인한 시장 TAM 확대.",
      debate: ["경쟁 심화(AMD/자체칩)", "수요 피크아웃"],
      theBet: "엔비디아의 독점적 지위가 향후 3년 이상 지속될 수 있을까요?"
    },
    watchpoints: [
      {
        id: 1,
        question: "[수요] 빅테크들의 CAPEX(설비투자) 지속 여부.",
        context: "고객사들이 AI로 돈을 벌어야 칩 구매도 지속됩니다. ROI 증명이 관건입니다.",
        options: [
          { label: "투자 확대 지속 (Bull)", side: "Bull" },
          { label: "투자 축소 (Bear)", side: "Bear" }
        ]
      },
      {
        id: 2,
        question: "[경쟁] 자체 칩 개발 및 경쟁사(AMD) 추격 속도.",
        context: "독점적 마진을 위협하는 경쟁자들의 기술 격차 축소 여부를 확인해야 합니다.",
        options: [
          { label: "기술 격차 유지 (Bull)", side: "Bull" },
          { label: "점유율 하락 (Bear)", side: "Bear" }
        ]
      }
    ],
    availableLogicBlocks: []
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
    narrative: pendingNarrative,
    watchpoints: [],
    availableLogicBlocks: []
  },
  {
    ticker: "000660",
    name: "SK하이닉스",
    currentPrice: 185000,
    changeRate: 3.5,
    companyProfile: {
      summary: "AI 메모리(HBM) 시장의 글로벌 1위",
      description: "엔비디아 GPU에 필수적으로 들어가는 HBM을 주도하는 기업입니다."
    },
    chartContext: "HBM 리더십 부각되며 신고가 랠리 중입니다.",
    narrative: pendingNarrative,
    watchpoints: [],
    availableLogicBlocks: []
  },
  {
    ticker: "005930",
    name: "삼성전자",
    currentPrice: 75000,
    changeRate: -1.2,
    companyProfile: { summary: "대한민국 대표 반도체/가전 기업", description: "메모리 반도체 1위 기업입니다." },
    chartContext: "박스권 흐름을 보이고 있습니다.",
    narrative: pendingNarrative,
    watchpoints: [],
    availableLogicBlocks: []
  },
  {
    ticker: "AMZN",
    name: "아마존",
    currentPrice: 180.5,
    changeRate: 1.5,
    companyProfile: { summary: "이커머스와 클라우드의 제왕", description: "세계 최대 온라인 쇼핑몰이자 AWS 기업입니다." },
    chartContext: "클라우드 성장세 재확인 중입니다.",
    narrative: pendingNarrative,
    watchpoints: [],
    availableLogicBlocks: []
  },
  {
    ticker: "AMD",
    name: "AMD",
    currentPrice: 160.0,
    changeRate: 2.1,
    companyProfile: { summary: "만년 2등의 반란", description: "엔비디아의 독주를 막을 유일한 대항마입니다." },
    chartContext: "AI 칩 기대감이 반영되고 있습니다.",
    narrative: pendingNarrative,
    watchpoints: [],
    availableLogicBlocks: []
  }
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
        { id: 'd2', ticker: '005930', name: '삼성전자', quantity: 120, currency: 'KRW', valuation: 9000000, profitValue: -183600, profitRate: -2.0 }
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
    indices: [
      { name: "S&P 500", value: "5,230.14", rate: -0.8, trend: "down", chartData: [5250, 5245, 5255, 5240, 5235, 5225, 5230, 5228, 5220, 5225, 5230] },
      { name: "NASDAQ", value: "16,300.50", rate: -1.2, trend: "down", chartData: [16450, 16420, 16400, 16380, 16350, 16320, 16300, 16290, 16280, 16295, 16300] },
      { name: "KOSPI", value: "2,740.30", rate: 0.3, trend: "up", chartData: [2730, 2732, 2735, 2733, 2738, 2740, 2742, 2745, 2744, 2741, 2740] }
    ]
  },
  summaryHighlights: [
    { text: "금리 인하 기대감이 조정", isBold: true },
    { text: "되며 나스닥이 잠시 쉬어가고 있습니다. ", isBold: false },
    { text: "전체적인 하락세", isBold: true },
    { text: "니 내 종목만 떨어진다고 너무 걱정 마세요.", isBold: false }
  ],
  hotIssues: [],
  myThesis: [], // Will be populated by adding from ALL_STOCKS in components or initialization logic
  discovery: {
    recentSearches: [
      { id: 101, ticker: "GOOGL", name: "구글", date: "Just now" }
    ],
    searchResults: [],
    trendingLogics: [
      { 
        rank: 1, 
        keyword: "JYP", 
        relatedStocksDetails: [
          { ticker: "035900", name: "JYP Ent.", rate: -1.5 }
        ], 
        title: "K-POP의 위기인가 기회인가",
        subtitle: "시스템 수출로 재도약 노리는 엔터주",
        desc: "피크아웃 우려 속에서 현지화 그룹의 성과가 새로운 모멘텀이 될 수 있을지 주목받고 있습니다.",
        badge: "📉 바닥 다지기",
        theme: "blue" 
      }
    ],
    searchResultSample: ALL_STOCKS[0]
  },
  notifications: [
    {
      id: 1,
      type: "alert",
      title: "구글(GOOGL) 실적 발표 완료",
      desc: "결과가 나왔습니다. 가설 적중 여부를 확인하세요.",
      stockId: 1,
      ticker: "GOOGL", // Added ticker for reliable linking
      timestamp: "방금 전",
      isRead: false
    }
  ]
});
