

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppData, StoreContextType, SearchResultSample, Thesis, LogicBlock, TimeFrame } from '../types';

// Helper to generate fake chart data with realistic random walk
const generateChart = (startPrice: number, count: number, trend: 'up' | 'down' | 'volatile') => {
  let current = startPrice;
  const data = [current];
  
  // volatility factor (0.5% of price)
  const vol = startPrice * 0.005; 

  for (let i = 0; i < count - 1; i++) {
    let change = (Math.random() - 0.5) * vol; // Random walk
    
    // Bias based on trend
    if (trend === 'up') change += (vol * 0.2);
    if (trend === 'down') change -= (vol * 0.2);
    if (trend === 'volatile') change *= 1.5;

    current += change;
    // Ensure no negative prices
    if (current < 0) current = 0.1;
    data.push(Number(current.toFixed(2)));
  }
  return data;
};

// --- DUMMY DATABASE FOR SEARCH ---
const ALL_STOCKS: SearchResultSample[] = [
  {
    ticker: "GOOGL",
    name: "알파벳 A",
    currentPrice: 175.4,
    changeRate: -1.2,
    companyProfile: {
      summary: "전 세계 검색 시장의 90%를 장악한 검색 제왕",
      description: "구글은 우리가 궁금한 것을 검색할 때 쓰는 검색창뿐만 아니라, 유튜브, 안드로이드, 그리고 구글 클라우드까지 운영하는 거대 IT 기업입니다. 광고가 주 수입원입니다."
    },
    chartContext: "최근 3개월간 경쟁사 위기론으로 하락했으나, 성능 증명 후 반등세입니다.",
    availableLogicBlocks: [
      { id: 1, icon: 'Globe', title: "검색 해자 유지", desc: "AI 결합으로 검색 지배력이 더욱 강화될 것입니다." },
      { id: 2, icon: 'Cloud', title: "클라우드 2위 도약", desc: "AI 붐을 타고 클라우드 점유율이 확대되고 있습니다." },
      { id: 3, icon: 'TrendingDown', title: "검색 독점 소송", desc: "미 법무부 소송 패소 시 사업 분할 위험이 존재합니다." },
      { id: 4, icon: 'AlertTriangle', title: "기술 오류 리스크", desc: "제미나이 모델의 오류가 반복될 가능성이 있습니다." }
    ],
    quizData: [
      {
        id: 1,
        category: 'LongTerm',
        question: "[검색 해자] 챗GPT가 구글 검색을\n대체할까요?",
        options: [
          { text: "검색 광고 매출이 줄어들 것이다.", type: 'bear', relatedLogicId: 3 },
          { text: "AI 결합으로 검색 시장을 더 키울 것이다.", type: 'bull', relatedLogicId: 1 },
          { text: "잘 모르겠어요", type: 'idk' }
        ],
        learningContext: { targetTab: 'profile', hint: "구글의 검색 점유율 추이를 확인해보세요." }
      },
      {
        id: 2,
        category: 'LongTerm',
        question: "[클라우드] AWS와 Azure 사이에서\n구글의 위치는?",
        options: [
          { text: "AI 붐 타고 2위로 도약할 것이다.", type: 'bull', relatedLogicId: 2 },
          { text: "만년 3위에 머무를 것이다.", type: 'bear', relatedLogicId: 3 },
          { text: "잘 모르겠어요", type: 'idk' }
        ]
      },
      {
        id: 3,
        category: 'ShortTerm',
        question: "[규제] 미 법무부의 '검색 독점'\n소송 리스크",
        options: [
          { text: "기업 분할까지 갈 심각한 악재다.", type: 'bear', relatedLogicId: 3 },
          { text: "단기 노이즈일 뿐이다.", type: 'bull', relatedLogicId: 1 },
          { text: "잘 모르겠어요", type: 'idk' }
        ]
      },
      {
        id: 4,
        category: 'ShortTerm',
        question: "[신제품] 제미나이(Gemini) 최신 모델 공개",
        options: [
          { text: "경쟁사와의 기술 격차를 해소했다.", type: 'bull', relatedLogicId: 1 },
          { text: "여전히 오류가 많아 실망스럽다.", type: 'bear', relatedLogicId: 4 },
          { text: "잘 모르겠어요", type: 'idk' }
        ]
      }
    ]
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
    availableLogicBlocks: [
      { id: 10, icon: 'Car', title: "전기차 승자독식", desc: "치킨게임에서 살아남아 시장을 독식할 것입니다." },
      { id: 11, icon: 'TrendingDown', title: "점유율 하락", desc: "중국 전기차의 저가 공세에 밀릴 위험이 큽니다." },
      { id: 12, icon: 'Cpu', title: "FSD 수익화", desc: "자율주행 기술이 곧 막대한 현금흐름을 만들 것입니다." },
      { id: 13, icon: 'AlertTriangle', title: "기술 장벽", desc: "완전 자율주행 실현은 아직 요원합니다." },
      { id: 14, icon: 'Lightbulb', title: "CEO 혁신", desc: "머스크의 비전이 기업 가치를 이끕니다." },
      { id: 15, icon: 'AlertTriangle', title: "CEO 리스크", desc: "오너의 돌발 행동이 브랜드 가치를 훼손합니다." }
    ],
    quizData: [
        {
          id: 1,
          category: 'LongTerm',
          question: "[전기차 시장] 중국의 저가 공세,\n테슬라는 안전할까요?",
          options: [
            { text: "승자독식 구조로 시장을 지배할 것이다.", type: 'bull', relatedLogicId: 10 },
            { text: "점유율을 지속적으로 뺏길 것이다.", type: 'bear', relatedLogicId: 11 },
            { text: "잘 모르겠어요", type: 'idk' }
          ]
        },
        {
          id: 2,
          category: 'LongTerm',
          question: "[AI/로보택시] FSD(자율주행)는\n언제쯤 돈이 될까요?",
          options: [
             { text: "곧 로보택시로 수익화가 가능하다.", type: 'bull', relatedLogicId: 12 },
             { text: "기술적, 규제적 장벽이 여전히 높다.", type: 'bear', relatedLogicId: 13 },
             { text: "잘 모르겠어요", type: 'idk' }
          ]
        },
        {
          id: 3,
          category: 'LongTerm',
          question: "[CEO 리스크] 일론 머스크의 행보,\n어떻게 보시나요?",
          options: [
             { text: "혁신의 원동력이다.", type: 'bull', relatedLogicId: 14 },
             { text: "브랜드 가치를 심각하게 훼손한다.", type: 'bear', relatedLogicId: 15 },
             { text: "잘 모르겠어요", type: 'idk' }
          ]
        },
        {
          id: 4,
          category: 'ShortTerm',
          question: "[인도량] 이번 분기\n차량 인도량 실적 전망",
          options: [
             { text: "기대 이상의 반등이 나올 것이다.", type: 'bull', relatedLogicId: 10 },
             { text: "기대를 하회할 것이다.", type: 'bear', relatedLogicId: 11 },
             { text: "잘 모르겠어요", type: 'idk' }
          ]
        },
        {
          id: 5,
          category: 'ShortTerm',
          question: "[신모델] 저가형 모델(Model 2)\n출시 지연 루머",
          options: [
             { text: "판매량 반등이 늦어질 악재다.", type: 'bear', relatedLogicId: 11 },
             { text: "로보택시에 집중하는 전략적 선택이다.", type: 'bull', relatedLogicId: 12 },
             { text: "잘 모르겠어요", type: 'idk' }
          ]
        }
    ]
  },
  {
    ticker: "000660",
    name: "SK하이닉스",
    currentPrice: 185000,
    changeRate: 3.5,
    companyProfile: {
      summary: "AI 메모리(HBM) 시장의 글로벌 1위",
      description: "엔비디아 GPU에 필수적으로 들어가는 고성능 메모리(HBM)를 가장 잘 만드는 한국 기업입니다. 삼성전자보다 이 분야에선 앞서있다는 평가를 받습니다."
    },
    chartContext: "HBM 리더십 부각되며 신고가 랠리 후 숨 고르기 중입니다.",
    availableLogicBlocks: [
      { id: 20, icon: 'TrendingUp', title: "반도체 슈퍼사이클", desc: "AI 수요 폭증으로 3년 이상 공급 부족이 예상됩니다." },
      { id: 21, icon: 'TrendingDown', title: "사이클 고점", desc: "메모리 반도체 사이클이 곧 정점을 찍을 수 있습니다." },
      { id: 22, icon: 'Server', title: "HBM 기술 격차", desc: "경쟁사 대비 압도적인 수율과 기술력을 유지 중입니다." },
      { id: 23, icon: 'AlertTriangle', title: "경쟁사 추격", desc: "삼성전자의 진입으로 점유율이 하락할 수 있습니다." },
      { id: 24, icon: 'Globe', title: "시장 파이 확대", desc: "경쟁사의 진입은 전체 HBM 시장이 커진다는 신호입니다." }
    ],
    quizData: [
        {
          id: 1,
          category: 'LongTerm',
          question: "[AI 사이클] 반도체 슈퍼사이클은\n얼마나 갈까요?",
          options: [
             { text: "3년 이상 공급부족이 지속될 것이다.", type: 'bull', relatedLogicId: 20 },
             { text: "곧 고점이 올 것이다.", type: 'bear', relatedLogicId: 21 },
             { text: "잘 모르겠어요", type: 'idk' }
          ]
        },
        {
          id: 2,
          category: 'LongTerm',
          question: "[기술 격차] HBM 시장 1등\n수성 가능할까요?",
          options: [
             { text: "기술 격차를 유지할 것이다.", type: 'bull', relatedLogicId: 22 },
             { text: "경쟁사에게 추격을 허용할 것이다.", type: 'bear', relatedLogicId: 23 },
             { text: "잘 모르겠어요", type: 'idk' }
          ]
        },
        {
          id: 3,
          category: 'ShortTerm',
          question: "[경쟁사 이슈] 삼성전자의\n엔비디아 퀄 테스트 통과설",
          options: [
             { text: "공급 과잉 우려가 있다.", type: 'bear', relatedLogicId: 23 },
             { text: "시장 파이 확대의 호재다.", type: 'bull', relatedLogicId: 24 },
             { text: "잘 모르겠어요", type: 'idk' }
          ]
        }
    ]
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
    availableLogicBlocks: [
      { id: 30, icon: 'Globe', title: "민간 부문 확장", desc: "상업용(Commercial) 매출이 정부 매출을 앞지르고 있습니다." },
      { id: 31, icon: 'TrendingDown', title: "확장성 한계", desc: "복잡한 소프트웨어로 민간 확장이 제한적일 수 있습니다." },
      { id: 32, icon: 'TrendingUp', title: "패시브 자금 유입", desc: "S&P500 편입 효과가 지속될 것입니다." },
      { id: 33, icon: 'TrendingDown', title: "재료 소멸", desc: "지수 편입 이벤트는 이미 주가에 반영되었습니다." },
      { id: 34, icon: 'Scale', title: "압도적 성장률", desc: "높은 PER은 그만큼 높은 성장성을 증명합니다." },
      { id: 35, icon: 'AlertTriangle', title: "고평가 논란", desc: "PER 80배는 정당화하기 어려운 수준입니다." }
    ],
    quizData: [
        {
            id: 1,
            category: 'LongTerm',
            question: "[확장성] 정부용(Gov) 소프트웨어라는\n한계를 넘을까요?",
            options: [
                { text: "민간 매출이 폭발적으로 늘고 있다.", type: 'bull', relatedLogicId: 30 },
                { text: "민간 확장은 한계가 있을 것이다.", type: 'bear', relatedLogicId: 31 },
                { text: "잘 모르겠어요", type: 'idk' }
            ]
        },
        {
            id: 2,
            category: 'ShortTerm',
            question: "[S&P500 편입] 지수 편입 이후의\n주가 흐름",
            options: [
                { text: "패시브 자금 유입이 지속될 것이다.", type: 'bull', relatedLogicId: 32 },
                { text: "재료 소멸로 조정받을 것이다.", type: 'bear', relatedLogicId: 33 },
                { text: "잘 모르겠어요", type: 'idk' }
            ]
        },
        {
            id: 3,
            category: 'ShortTerm',
            question: "[밸류에이션] PER 80배,\n정당화 가능한가요?",
            options: [
                { text: "너무 비싸다.", type: 'bear', relatedLogicId: 35 },
                { text: "압도적 성장률이 정당화한다.", type: 'bull', relatedLogicId: 34 },
                { text: "잘 모르겠어요", type: 'idk' }
            ]
        }
    ]
  },
  {
    ticker: "035420",
    name: "NAVER",
    currentPrice: 192000,
    changeRate: -0.5,
    companyProfile: {
        summary: "한국의 구글 + 아마존 + 유튜브",
        description: "검색, 쇼핑, 웹툰, 핀테크 등 한국인의 일상 모든 곳에 침투해 있는 플랫폼 기업입니다. 최근에는 자체 AI '하이퍼클로바X'에 집중하고 있습니다."
    },
    chartContext: "AI 모멘텀 부재로 장기 소외되었으나 바닥을 다지는 중입니다.",
    availableLogicBlocks: [
      { id: 40, icon: 'TrendingDown', title: "검색 점유율 하락", desc: "유튜브와 인스타그램에 검색 주도권을 뺏기고 있습니다." },
      { id: 41, icon: 'Globe', title: "강력한 락인 효과", desc: "쇼핑과 웹툰 멤버십으로 사용자를 묶어두고 있습니다." },
      { id: 42, icon: 'Bot', title: "AI B2B 독점", desc: "한국형 AI로 국내 기업 시장을 선점할 것입니다." },
      { id: 43, icon: 'AlertTriangle', title: "빅테크 경쟁 열위", desc: "글로벌 AI 경쟁에서 뒤쳐질 가능성이 높습니다." },
      { id: 44, icon: 'AlertTriangle', title: "커머스 타격", desc: "알리/테무의 공세로 커머스 매출이 감소할 것입니다." },
      { id: 45, icon: 'TrendingUp', title: "광고 매출 수혜", desc: "C-커머스의 광고 집행은 오히려 매출에 도움이 됩니다." }
    ],
    quizData: [
        {
            id: 1,
            category: 'LongTerm',
            question: "[플랫폼 경쟁] 유튜브에 뺏긴 시간,\n되찾을까요?",
            options: [
                { text: "검색 점유율 하락이 지속될 것이다.", type: 'bear', relatedLogicId: 40 },
                { text: "쇼핑/웹툰 락인 효과가 강력하다.", type: 'bull', relatedLogicId: 41 },
                { text: "잘 모르겠어요", type: 'idk' }
            ]
        },
        {
            id: 2,
            category: 'LongTerm',
            question: "[소버린 AI] 한국형 AI\n'하이퍼클로바X'의 미래는?",
            options: [
                { text: "국내 B2B 시장을 독점할 것이다.", type: 'bull', relatedLogicId: 42 },
                { text: "글로벌 빅테크에 밀릴 것이다.", type: 'bear', relatedLogicId: 43 },
                { text: "잘 모르겠어요", type: 'idk' }
            ]
        },
        {
            id: 3,
            category: 'ShortTerm',
            question: "[C-커머스] 알리/테무의\n한국 시장 침투",
            options: [
                { text: "커머스 매출에 타격이 클 것이다.", type: 'bear', relatedLogicId: 44 },
                { text: "광고 매출에는 오히려 호재다.", type: 'bull', relatedLogicId: 45 },
                { text: "잘 모르겠어요", type: 'idk' }
            ]
        }
    ]
  }
];

const initialData: AppData = {
  user: {
    name: "시미",
    profileMsg: "논리적인 투자자",
    totalWinRate: 70,
    totalAssetValue: 117913851,
    totalProfitValue: 34714499,
    totalProfitRate: 41.7,
    holdings: {
      domestic: [
        {
          id: 'd1',
          ticker: '000660',
          name: 'SK하이닉스',
          quantity: 44,
          currency: 'KRW',
          valuation: 8140000,
          profitValue: -547180,
          profitRate: -6.3
        },
        {
          id: 'd2',
          ticker: '005930',
          name: '삼성전자',
          quantity: 120,
          currency: 'KRW',
          valuation: 9000000,
          profitValue: -183600,
          profitRate: -2.0
        },
        {
          id: 'd3',
          ticker: '360750',
          name: 'TIGER 미국S&P500',
          quantity: 22,
          currency: 'KRW',
          valuation: 432080,
          profitValue: 114620,
          profitRate: 36.1
        }
      ],
      overseas: [
        {
          id: 'o1',
          ticker: 'GOOGL',
          name: 'Alphabet A',
          quantity: 98,
          currency: 'USD',
          valuation: 23520000,
          profitValue: 12408900,
          profitRate: 111.7
        },
        {
          id: 'o2',
          ticker: 'AMZN',
          name: 'Amazon',
          quantity: 33,
          currency: 'USD',
          valuation: 8250000,
          profitValue: 1966500,
          profitRate: 31.3
        },
        {
          id: 'o3',
          ticker: 'NVDA',
          name: 'NVIDIA',
          quantity: 10,
          currency: 'USD',
          valuation: 12400000,
          profitValue: 7294800,
          profitRate: 142.7
        }
      ]
    }
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
        chartData: [5250, 5245, 5255, 5240, 5235, 5225, 5230, 5228, 5220, 5225, 5230]
      },
      { 
        name: "NASDAQ", 
        value: "16,300.50", 
        rate: -1.2, 
        trend: "down",
        chartData: [16450, 16420, 16400, 16380, 16350, 16320, 16300, 16290, 16280, 16295, 16300]
      },
      { 
        name: "KOSPI", 
        value: "2,740.30", 
        rate: 0.3, 
        trend: "up",
        chartData: [2730, 2732, 2735, 2733, 2738, 2740, 2742, 2745, 2744, 2741, 2740]
      }
    ]
  },
  summaryHighlights: [
    { text: "금리 인하 기대감이 조정", isBold: true },
    { text: "되며 나스닥이 잠시 쉬어가고 있습니다. ", isBold: false },
    { text: "전체적인 하락세", isBold: true },
    { text: "니 내 종목만 떨어진다고 너무 걱정 마세요.", isBold: false }
  ],
  hotIssues: [],
  myThesis: [
    {
      id: 1,
      ticker: "GOOGL",
      name: "알파벳 A",
      currentPrice: 175.4,
      changeRate: -1.2,
      status: "Invested",
      bigThesis: "AI 시대의 최종 승자는 데이터와 자본을 가진 구글이다",
      companyProfile: {
          summary: "전 세계 검색 시장의 90%를 장악한 검색 제왕",
          description: "구글은 우리가 궁금한 것을 검색할 때 쓰는 검색창뿐만 아니라, 유튜브, 안드로이드, 그리고 구글 클라우드까지 운영하는 거대 IT 기업입니다."
      },
      logicBlocks: [
        { id: 'l1', icon: "Cloud", title: "클라우드 성장", desc: "기업들의 AI 도입으로 클라우드 매출 매년 20% 성장", isActive: true },
        { id: 'l2', icon: "Cpu", title: "자체 칩(TPU) 효과", desc: "외부 칩 의존도를 낮춰 마진율 개선", isActive: true }
      ],
      // [SCENARIO: PRE-EVENT]
      events: [
        { 
            dDay: "D-1", 
            title: "3분기 실적 발표", 
            type: "Earnings", 
            impact: "High", 
            status: "Upcoming",
            actionScenario: {
                phase: 'Pre-Event',
                title: "내일 실적 발표, 어떻게 예상하세요?",
                description: "월가는 매출 15% 성장을 기대하고 있습니다. 특히 클라우드 부문 마진율 개선이 핵심 관전 포인트입니다. 당신의 가설(클라우드 성장)과 일치하나요?",
                options: [
                    { label: "기대 이상일 것 (비중 확대)", actionType: 'buy', sentiment: 'Positive' },
                    { label: "예상 부합 (유지)", actionType: 'hold', sentiment: 'Neutral' },
                    { label: "실망스러울 것 (비중 축소)", actionType: 'sell', sentiment: 'Negative' }
                ]
            }
        }
      ],
      newsTags: [
        { type: "Positive", text: "클라우드 부문 영업이익률 역대 최고치 경신 전망", date: "Just now", analystComment: "클라우드 마진 개선 가설에 힘을 실어주는 뉴스입니다." }
      ],
      dailyBriefing: "실적 발표를 하루 앞두고 있습니다. 시장의 기대치가 높아진 상태라 작은 미스에도 변동성이 커질 수 있습니다.",
      quizData: [
        {
            id: 1,
            category: 'LongTerm',
            question: "생성형 AI 검색(ChatGPT 등)이\n구글을 위협할까요?",
            options: [
              { text: "검색 광고 매출이 줄어들 것이다.", type: 'bear', relatedLogicId: 'l1' },
              { text: "AI 결합으로 검색 시장을 더 키울 것이다.", type: 'bull', relatedLogicId: 'l2' },
              { text: "잘 모르겠어요", type: 'idk' }
            ],
            learningContext: {
              targetTab: 'profile',
              hint: "구글의 검색 점유율과 유튜브의 락인(Lock-in) 효과를 확인해보세요."
            }
        }
      ],
      chartHistory: {
        '1D': generateChart(177, 24, 'down'),
        '1W': generateChart(178, 20, 'volatile'),
        '1M': generateChart(168, 30, 'up'),
        '3M': generateChart(155, 45, 'up'),
        '1Y': generateChart(130, 60, 'up'),
        '5Y': generateChart(100, 60, 'up'),
      },
      chartNarratives: {
        '1D': '실적 경계감으로 소폭 조정 중입니다.',
        '1W': '단기 변동성이 확대되고 있으나 175달러 지지선을 지키고 있습니다.',
        '1M': 'AI 모델 제미나이 발표 이후 우상향 추세가 뚜렷합니다.',
        '3M': '클라우드 마진 개선 기대감이 주가에 반영되기 시작했습니다.',
        '1Y': 'AI 전환기의 과도기적 주가 흐름을 지나 성장 궤도에 진입했습니다.',
        '5Y': '검색 광고 독점력을 바탕으로 꾸준한 현금 흐름을 창출해왔습니다.'
      }
    },
    {
      id: 2,
      ticker: "TSLA",
      name: "테슬라",
      currentPrice: 240.5,
      changeRate: 5.2,
      status: "Invested",
      bigThesis: "FSD 완성이 곧 모빌리티 패권이다",
      companyProfile: {
          summary: "전기차를 넘어 AI 로보틱스 기업으로 진화 중",
          description: "자율주행(FSD)과 로봇(Optimus)을 통해 미래 모빌리티와 노동 시장을 혁신하려는 기업입니다."
      },
      logicBlocks: [
        { id: 'l1', icon: "Car", title: "FSD v12", desc: "End-to-End 신경망 적용으로 주행 성능 획기적 개선", isActive: true }
      ],
      // [SCENARIO: POST-EVENT]
      events: [
        { 
            dDay: "Today", 
            title: "실적 발표 직후", 
            type: "Earnings", 
            impact: "High", 
            status: "Completed",
            actionScenario: {
                phase: 'Post-Event',
                title: "어닝 쇼크? 규제 완화!",
                description: "EPS는 예상치를 하회했으나, 컨퍼런스 콜에서 언급된 '규제 완화' 소식에 주가가 급등했습니다. 펀더멘털보다는 기대감이 지배하는 상황입니다.",
                marketReaction: "이익 감소 악재보다 미래 비전(규제 완화) 호재에 반응하여 급등 중",
                myHypothesisCheck: "회원님의 'FSD 가치' 가설이 시장에서 재조명받고 있습니다. 다만 실적 숫자는 아직 뒷받침되지 않았습니다.",
                options: [
                    { label: "상승 즐기기 (Hold)", actionType: 'hold', sentiment: 'Positive' },
                    { label: "일부 수익 실현", actionType: 'sell', sentiment: 'Neutral' },
                    { label: "가설 재점검 필요", actionType: 'revise', sentiment: 'Negative' }
                ]
            }
        }
      ],
      newsTags: [],
      dailyBriefing: "규제 완화 소식에 강한 매수세가 유입되고 있습니다. 가설이 적중하고 있는 모습입니다.",
      quizData: [
        {
          id: 1,
          category: 'LongTerm',
          question: "전기차 시장에서\n테슬라의 가격 경쟁력은?",
          options: [
            { text: "치킨게임 승자로 시장을 독식할 것이다.", type: 'bull', relatedLogicId: 'l1' },
            { text: "중국 저가 전기차 공세에 밀릴 것이다.", type: 'bear', relatedLogicId: 'l1' },
            { text: "잘 모르겠어요", type: 'idk' }
          ],
          learningContext: {
            targetTab: 'chart',
            hint: "최근 마진율 추이와 중국 시장 점유율 변화를 차트에서 확인해보세요."
          }
        }
      ],
      chartHistory: {
        '1D': generateChart(230, 24, 'up'),
        '1W': generateChart(215, 20, 'up'),
        '1M': generateChart(190, 30, 'up'),
        '3M': generateChart(180, 45, 'volatile'),
        '1Y': generateChart(250, 60, 'down'),
        '5Y': generateChart(50, 60, 'up'),
      },
      chartNarratives: {
        '1D': '규제 완화 속보로 급등세가 연출되고 있습니다.',
        '1W': '인도량 호조 기대감이 선반영되며 상승세를 탔습니다.',
        '1M': '저가 매수세 유입으로 바닥을 다지고 반등했습니다.',
        '3M': '전기차 수요 둔화 우려와 신모델 기대감이 공존하고 있습니다.',
        '1Y': '영업이익률 하락 우려로 인해 박스권에 갇혀 있었습니다.',
        '5Y': '전기차 대중화를 이끌며 자동차 산업의 패러다임을 바꿨습니다.'
      }
    }
  ],
  discovery: {
    recentSearches: [
      { id: 101, ticker: "GOOGL", name: "Alphabet Inc.", date: "Just now" }
    ],
    searchResults: [],
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
    searchResultSample: ALL_STOCKS[0]
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

  const searchStocks = (query: string) => {
    if (!query.trim()) {
        setData(prev => ({
            ...prev,
            discovery: { ...prev.discovery, searchResults: [] }
        }));
        return;
    }

    const lowerQuery = query.toLowerCase();
    const results = ALL_STOCKS.filter(stock => 
        stock.ticker.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
    );

    setData(prev => ({
        ...prev,
        discovery: { ...prev.discovery, searchResults: results }
    }));
  };

  const selectDiscoveryStock = (ticker: string) => {
      const stock = ALL_STOCKS.find(s => s.ticker === ticker);
      if (stock) {
          setData(prev => ({
              ...prev,
              discovery: { ...prev.discovery, searchResultSample: stock }
          }));
      }
  };

  const addToMyThesis = (stock: SearchResultSample, selectedLogicIds: number[], investmentType: string, amount?: string) => {
    // 1. Create Logic Blocks from selected IDs
    const selectedLogicBlocks = stock.availableLogicBlocks.filter(l => 
        selectedLogicIds.includes(Number(l.id))
    ).map(l => ({ ...l, isActive: true })); // Mark as active

    // 2. Generate Dummy Charts (Since SearchResultSample doesn't have full history)
    const trend = stock.changeRate > 0 ? 'up' : 'down';
    const chartHistory = {
        '1D': generateChart(stock.currentPrice, 24, trend),
        '1W': generateChart(stock.currentPrice, 20, 'volatile'),
        '1M': generateChart(stock.currentPrice * 0.95, 30, trend),
        '3M': generateChart(stock.currentPrice * 0.9, 45, trend),
        '1Y': generateChart(stock.currentPrice * 0.8, 60, trend),
        '5Y': generateChart(stock.currentPrice * 0.5, 60, 'up'),
    };

    // 3. Construct New Thesis Object
    const newThesis: Thesis = {
        id: Date.now(), // Unique ID
        ticker: stock.ticker,
        name: stock.name,
        currentPrice: stock.currentPrice,
        changeRate: stock.changeRate,
        status: investmentType as 'Invested' | 'Watching',
        bigThesis: selectedLogicBlocks.length > 0 ? selectedLogicBlocks[0].title : "나만의 투자 가설",
        companyProfile: stock.companyProfile,
        logicBlocks: selectedLogicBlocks,
        quizData: stock.quizData,
        events: [], // Start with no events
        newsTags: [], // Start with no news
        dailyBriefing: "새로운 투자 가설이 등록되었습니다. 시장의 변화를 면밀히 관찰하세요.",
        chartHistory: chartHistory,
        chartNarratives: {
            '1D': '가설 수립 후 모니터링 중입니다.',
            '1W': '변동성이 있지만 추세는 유효합니다.',
            '1M': '장기적인 관점에서 접근 중입니다.',
            '3M': '', '1Y': '', '5Y': ''
        }
    };

    // 4. Update State
    setData(prev => ({
        ...prev,
        myThesis: [newThesis, ...prev.myThesis], // Add to top
        notifications: [
            {
                id: Date.now(),
                type: 'info',
                title: `${stock.name} 가설 등록 완료`,
                desc: '성공적으로 저장되었습니다. 아이디어 탭에서 확인하세요.',
                timestamp: '방금 전',
                isRead: false,
                stockId: newThesis.id
            },
            ...prev.notifications
        ]
    }));
  };

  return (
    <StoreContext.Provider value={{ data, updateUserName, markNotificationAsRead, searchStocks, selectDiscoveryStock, addToMyThesis }}>
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