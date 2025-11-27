

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppData, StoreContextType } from '../types';

const initialData: AppData = {
  user: {
    name: "시미",
    profileMsg: "논리적인 투자자",
    totalWinRate: 70,
  },
  marketWeather: {
    status: "Cloudy",
    summaryTitle: "기술주 숨 고르기",
    summaryBody: "",
    indices: [
      { 
        name: "S&P 500", 
        value: "5,230.14", 
        rate: -0.8, 
        trend: "down",
        chartData: [0, 0.1, 0.15, 0.05, -0.1, -0.3, -0.25, -0.4, -0.6, -0.7, -0.8]
      },
      { 
        name: "NASDAQ", 
        value: "16,300.50", 
        rate: -1.2, 
        trend: "down",
        chartData: [0, 0.2, 0.1, -0.2, -0.5, -0.8, -0.7, -0.9, -1.1, -1.25, -1.2]
      },
      { 
        name: "KOSPI", 
        value: "2,740.30", 
        rate: 0.3, 
        trend: "up",
        chartData: [0, -0.1, -0.2, 0.0, 0.1, 0.2, 0.15, 0.25, 0.35, 0.3, 0.3]
      }
    ]
  },
  summaryHighlights: [
    { text: "금리 인하 기대감이 조정", isBold: true },
    { text: "되며 나스닥이 잠시 쉬어가고 있습니다. ", isBold: false },
    { text: "전체적인 하락세", isBold: true },
    { text: "니 내 종목만 떨어진다고 너무 걱정 마세요.", isBold: false }
  ],
  hotIssues: [
    {
      ticker: "TSLA",
      name: "테슬라",
      rate: 5.2,
      cause: "로보택시 규제 완화 기대감",
      analystComment: "단순한 수급 이슈가 아닙니다. 규제 완화라는 명확한 트리거가 확인되었기에 상승 여력이 있습니다."
    }
  ],
  myThesis: [
    {
      id: 1,
      ticker: "GOOGL",
      name: "알파벳 A",
      currentPrice: 175.4,
      changeRate: -1.2,
      status: "Invested",
      bigThesis: "AI 시대의 최종 승자는 데이터와 자본을 가진 구글이다",
      logicBlocks: [
        { id: 'l1', icon: "Cloud", title: "클라우드 성장", desc: "기업들의 AI 도입으로 클라우드 매출 매년 20% 성장", isActive: true },
        { id: 'l2', icon: "Cpu", title: "자체 칩(TPU) 효과", desc: "외부 칩 의존도를 낮춰 마진율 개선", isActive: true }
      ],
      events: [
        { 
          dDay: "오늘", 
          title: "3분기 실적 발표", 
          type: "Earnings", 
          impact: "High", 
          status: "JustFinished",
          result: "Hit",
          analystFeedback: "시미님이 주목하신 '클라우드 마진'이 전년 대비 15% 개선된 것으로 확인되었습니다. 주가도 긍정적으로 반응하고 있습니다."
        }
      ],
      newsTags: [
        { type: "Positive", text: "클라우드 부문 영업이익률 역대 최고치 경신", date: "Just now" }
      ],
      dailyBriefing: "실적 발표 결과가 매우 좋습니다. 특히 우려했던 마진율이 크게 개선되며 가설이 입증되었습니다.",
      volatilityAnalysis: {
        type: 'Macro',
        level: 'Medium',
        title: "나스닥 전체 조정 중",
        desc: "구글만의 악재가 아닙니다. 금리 이슈로 기술주 전반이 하락하고 있으니 뇌동매매에 주의하세요.",
        timestamp: "10분 전"
      }
    },
    {
      id: 2,
      ticker: "NVDA",
      name: "엔비디아",
      currentPrice: 920.0,
      changeRate: -2.5,
      status: "Invested",
      bigThesis: "AI 인프라 투자는 이제 시작이다",
      logicBlocks: [
        { id: 'l1', icon: "Server", title: "데이터센터 수요", desc: "빅테크들의 CAPEX 지출 지속", isActive: true }
      ],
      events: [
        { 
          dDay: "어제", 
          title: "GTC 2025 키노트", 
          type: "Conference", 
          impact: "High", 
          status: "JustFinished",
          result: "Miss",
          analystFeedback: "호재성 발표가 있었지만 주가는 하락했습니다(재료 소멸). 시장은 이미 기대를 선반영한 것으로 보입니다."
        }
      ],
      newsTags: [
        { type: "Negative", text: "차익 실현 매물 출회로 인한 주가 조정", date: "Yesterday" }
      ],
      dailyBriefing: "키노트 발표 이후 '뉴스에 팔아라' 현상이 나타나고 있습니다. 단기 변동성에 유의하세요."
    },
    {
      id: 3,
      ticker: "TSLA",
      name: "테슬라",
      currentPrice: 240.5,
      changeRate: 5.2,
      status: "Watching",
      bigThesis: "FSD 완성이 곧 모빌리티 패권이다",
      logicBlocks: [
        { id: 'l1', icon: "Car", title: "FSD v12", desc: "End-to-End 신경망 적용으로 주행 성능 획기적 개선", isActive: true }
      ],
      events: [],
      newsTags: [],
      dailyBriefing: "규제 완화 소식에 강한 매수세가 유입되고 있습니다.",
      volatilityAnalysis: {
        type: 'News',
        level: 'High',
        title: "속보: 로보택시 규제 완화",
        desc: "단순 수급이 아닌, 펀더멘탈에 영향을 주는 강력한 호재입니다. 상승 추세가 이어질 가능성이 높습니다.",
        timestamp: "방금 전"
      }
    }
  ],
  discovery: {
    recentSearches: [
      { id: 101, ticker: "GOOGL", name: "Alphabet Inc.", date: "Just now" }
    ],
    trendingLogics: [
      { 
        rank: 1, 
        keyword: "AMD", 
        relatedStocksDetails: [
          { ticker: "AMD", name: "AMD", rate: 2.1 },
          { ticker: "TSM", name: "TSMC", rate: 1.4 }
        ], 
        title: "AI의 빈틈, AMD의 반격",
        subtitle: "엔비디아 독주 체제에 균열을 낼 수 있을까?",
        desc: "엔비디아의 공급 부족 사태로 인해 대체재로서의 AMD MI300X 수요가 폭발하고 있습니다. 특히 데이터센터용 GPU 시장에서 가성비를 무기로 점유율을 10%까지 확대할 것이라는 전망이 지배적입니다. 이는 단순한 2등 전략이 아닌, 멀티 벤더 전략을 원하는 빅테크들의 니즈와 정확히 부합합니다.",
        badge: "📉 바닥 찍고 반등",
        theme: "blue" 
      },
      { 
        rank: 2, 
        keyword: "전력", 
        relatedStocksDetails: [
           { ticker: "HD현대", name: "HD현대일렉트릭", rate: 4.5 },
           { ticker: "LS", name: "LS ELECTRIC", rate: 3.2 }
        ],
        title: "전력 슈퍼사이클",
        subtitle: "AI 데이터센터가 불러온 전력 설비 품귀 현상",
        desc: "AI 데이터센터 하나가 먹는 전력량은 일반 데이터센터의 10배입니다. 이로 인해 초고압 변압기 수주 잔고가 역대 최고치를 갱신하며 장기 호황 국면에 진입했습니다. 공급은 제한적인데 수요는 폭발하고 있어 가격 결정권이 제조사에게 넘어간 상황입니다.",
        badge: "💰 신고가 랠리",
        theme: "gold"
      },
      { 
        rank: 3, 
        keyword: "비만치료제", 
        relatedStocksDetails: [
          { ticker: "LLY", name: "Eli Lilly", rate: 0.8 },
          { ticker: "NVO", name: "Novo Nordisk", rate: 1.1 }
        ],
        title: "비만 치료제 혁명",
        subtitle: "없어서 못 파는 GLP-1, 적응증 확대로 시장 확장",
        desc: "단순 체중 감량을 넘어 심혈관 질환 예방 효과까지 입증되며 보험 적용 가능성이 커졌습니다. 생산 시설 확충이 완료되는 내년부터는 본격적인 매출 퀀텀 점프가 예상되며, 알츠하이머 등으로의 적응증 확대도 긍정적인 신호입니다.",
        badge: "🔥 트렌드 지속",
        theme: "orange"
      }
    ],
    searchResultSample: {
      ticker: "GOOGL",
      name: "알파벳 A",
      summary: "전 세계 검색 시장의 90%를 장악한 검색 제왕이에요.",
      chartContext: "최근 3개월간 경쟁사 위기론으로 하락했으나, 성능 증명 후 반등세입니다.",
      availableLogicBlocks: [
        { id: 1, title: "광고 매출 회복", desc: "경기가 좋아지며 기업들의 광고 집행비가 늘어나고 있어요." },
        { id: 2, title: "AI 기술 격차 해소", desc: "최신 모델이 경쟁사를 성능 면에서 따라잡았다는 평가가 있어요." },
        { id: 3, title: "독점 금지법 리스크", desc: "미 법무부와의 소송 패소 시 사업 분할 위험이 있어요." }
      ]
    }
  },
  notifications: [
    {
      id: 1,
      type: "alert",
      title: "구글(GOOGL) 실적 발표 완료",
      desc: "결과가 나왔습니다. 가설 적중 여부를 확인하세요.",
      stockId: 1,
      timestamp: "방금 전",
      isRead: false
    },
    {
      id: 2,
      type: "info",
      title: "오늘의 시장 브리핑 도착",
      desc: "기술주 중심의 하락세가 감지되었습니다.",
      timestamp: "1시간 전",
      isRead: true
    }
  ]
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);

  const updateUserName = (name: string) => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, name }
    }));
  };

  const markNotificationAsRead = (id: number) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  };

  return (
    <StoreContext.Provider value={{ data, updateUserName, markNotificationAsRead }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};