
import { SearchResultSample, AppData } from '../types';
import { generateChartData } from '../utils/chartUtils';

export const ALL_STOCKS: SearchResultSample[] = [
  {
    ticker: "GOOGL",
    name: "구글",
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
        relatedInfo: {
          title: "검색 시장의 변화",
          content: [
            "구글은 *90% 이상의 검색 점유율*을 20년 가까이 유지해왔습니다.",
            "하지만 챗GPT와 같은 *생성형 AI*가 정답을 바로 알려주면서 검색 패턴이 바뀌고 있습니다.",
            "유튜브와 안드로이드 생태계가 강력한 *방어막(Lock-in)* 역할을 하고 있습니다."
          ]
        }
      },
      // ... (Rest of Google Quiz Data would go here, kept brief for this file)
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
          ],
          relatedInfo: {
            title: "중국 전기차의 위협",
            content: [
              "BYD 등 중국 기업들이 *압도적인 가격 경쟁력*으로 시장을 잠식하고 있습니다.",
              "테슬라는 이에 맞서 *가격 인하 정책*을 펼치며 점유율 방어에 나섰습니다."
            ]
          }
        },
        // ... (Rest of Tesla Quiz Data)
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
    quizData: []
  },
  { ticker: "005930", name: "삼성전자", currentPrice: 75000, changeRate: -1.2, companyProfile: { summary: "대한민국 대표 반도체/가전 기업", description: "메모리 반도체 1위, 스마트폰 1위 등 다양한 포트폴리오를 가진 글로벌 기업입니다." }, chartContext: "반도체 업황 회복 지연으로 박스권 흐름을 보이고 있습니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "360750", name: "TIGER 미국S&P500", currentPrice: 19640, changeRate: 0.5, companyProfile: { summary: "미국 S&P500 지수 추종 ETF", description: "미국 상위 500개 기업에 분산 투자하는 효과가 있습니다." }, chartContext: "미국 증시 호조로 우상향 추세를 이어가고 있습니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "AMZN", name: "아마존", currentPrice: 180.5, changeRate: 1.5, companyProfile: { summary: "이커머스와 클라우드의 제왕", description: "세계 최대 온라인 쇼핑몰이자 AWS를 통한 클라우드 1위 기업입니다." }, chartContext: "클라우드 성장세 재확인으로 주가가 견조합니다.", availableLogicBlocks: [{ id: 30, icon: 'Cloud', title: "AWS의 AI 주도권", desc: "클라우드 1위 AWS가 생성형 AI 수요를 흡수하며 재성장할 것입니다." }, { id: 31, icon: 'TrendingUp', title: "물류 마진 개선", desc: "물류 효율화 프로젝트 완료로 소매 부문 이익률이 구조적으로 개선 중입니다." }], quizData: [] },
  { ticker: "NVDA", name: "엔비디아", currentPrice: 950.0, changeRate: 2.5, companyProfile: { summary: "AI 시대의 총아, GPU 리더", description: "AI 데이터센터에 들어가는 GPU 시장을 사실상 독점하고 있습니다." }, chartContext: "AI 수요 폭증으로 기록적인 상승세를 보이고 있습니다.", availableLogicBlocks: [{ id: 40, icon: 'Cpu', title: "AI 칩 독점 지속", desc: "CUDA 생태계와 압도적 성능으로 시장 지배력이 3년 이상 지속될 것입니다." }], quizData: [] },
  { ticker: "AMD", name: "AMD", currentPrice: 160.0, changeRate: 2.1, companyProfile: { summary: "만년 2등의 반란, AI 칩 도전장", description: "엔비디아의 독주를 막을 유일한 대항마로 꼽힙니다." }, chartContext: "MI300 칩 출시로 AI 기대감이 반영되고 있습니다.", availableLogicBlocks: [{ id: 100, icon: 'Cpu', title: "멀티 벤더 수요", desc: "빅테크들이 엔비디아 의존도를 낮추려 합니다.", isActive: true }], quizData: [] },
  { ticker: "PLTR", name: "팔란티어", currentPrice: 25.4, changeRate: 1.2, companyProfile: { summary: "CIA가 쓰는 빅데이터 분석 및 AI 플랫폼", description: "원래는 정부와 군대에서 테러리스트를 잡는 소프트웨어를 만들던 회사인데, 이제는 일반 기업들이 AI를 도입할 때 쓰는 필수 플랫폼을 팔고 있습니다." }, chartContext: "흑자 전환 안착 후 밸류에이션 리레이팅이 진행 중입니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "035420", name: "네이버", currentPrice: 192000, changeRate: -0.5, companyProfile: { summary: "한국의 구글 + 아마존 + 유튜브", description: "검색, 쇼핑, 웹툰, 핀테크 등 한국인의 일상 모든 곳에 침투해 있는 플랫폼 기업입니다. 최근에는 자체 AI '하이퍼클로바X'에 집중하고 있습니다." }, chartContext: "AI 모멘텀 부재로 장기 소외되었으나 바닥을 다지는 중입니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "HD현대", name: "HD현대일렉트릭", currentPrice: 280000, changeRate: 4.5, companyProfile: { summary: "전력 슈퍼사이클의 최대 수혜주", description: "AI 데이터센터 급증으로 전력 변압기 수요가 폭발하며 호황을 누리고 있습니다." }, chartContext: "수주 잔고 폭증으로 신고가 행진을 이어가고 있습니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "LS", name: "LS일렉트릭", currentPrice: 170000, changeRate: 3.2, companyProfile: { summary: "전력망 인프라의 강자", description: "북미 전력망 교체 수요와 AI 데이터센터 수혜를 동시에 받고 있습니다." }, chartContext: "실적 개선 기대감으로 우상향 중입니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "LLY", name: "일라이 릴리", currentPrice: 780.0, changeRate: 0.8, companyProfile: { summary: "비만치료제 시장의 선두주자", description: "마운자로, 젭바운드 등 혁신적인 비만/당뇨 치료제로 글로벌 제약사 시가총액 1위를 다툽니다." }, chartContext: "없어서 못 파는 비만치료제 인기로 고공행진 중입니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "NVO", name: "노보 노디스크", currentPrice: 125.0, changeRate: 1.1, companyProfile: { summary: "위고비의 원조", description: "비만치료제 열풍을 불러온 위고비 개발사로 유럽 시총 1위 기업입니다." }, chartContext: "생산 설비 증설 소식에 상승세를 타고 있습니다.", availableLogicBlocks: [], quizData: [] },
  { ticker: "TSM", name: "TSMC", currentPrice: 150.0, changeRate: 1.4, companyProfile: { summary: "글로벌 파운드리 1위", description: "애플, 엔비디아 등 빅테크들의 칩을 도맡아 생산하는 반도체 위탁생산 절대강자입니다." }, chartContext: "AI 칩 주문 폭주로 실적 호조가 지속되고 있습니다.", availableLogicBlocks: [], quizData: [] }
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
        { id: 'd3', ticker: '360750', name: 'TIGER 미국S&P500', quantity: 22, currency: 'KRW', valuation: 432080, profitValue: 114620, profitRate: 36.1 }
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
  myThesis: [
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
        { 
            id: 'l1', 
            icon: "Car", 
            title: "FSD v12", 
            desc: "End-to-End 신경망 적용으로 주행 성능 획기적 개선", 
            isActive: true,
            history: [
                { date: '24.06.20', type: 'Failure', category: 'Decision', text: '매도 타이밍 놓침', badgeText: '기회 비용 발생' }
            ] 
        }
      ],
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
      quizData: [],
      chartHistory: {
        '1D': generateChartData(230, 24, 'up'),
        '1W': generateChartData(215, 20, 'up'),
        '1M': generateChartData(190, 30, 'up'),
        '3M': generateChartData(180, 45, 'volatile'),
        '1Y': generateChartData(250, 60, 'down'),
        '5Y': generateChartData(50, 60, 'up'),
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
      { id: 101, ticker: "GOOGL", name: "Google", date: "Just now" }
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
});
