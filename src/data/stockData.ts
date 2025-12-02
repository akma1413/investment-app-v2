import { SearchResultSample } from '../types';

export const ALL_STOCKS: SearchResultSample[] = [
  {
    ticker: "035900",
    name: "JYP Ent.",
    currentPrice: 58200,
    changeRate: -1.35,
    companyProfile: {
      summary: "K-POP 글로벌 확장의 선두주자",
      description: "트와이스, 스트레이키즈 등 글로벌 아티스트 라인업을 보유한 대한민국 대표 엔터테인먼트 기업입니다."
    },
    chartContext: "최근 1년 주가는 엔터 업황 부진으로 하락세이나, 글로벌 매출 비중은 꾸준히 상승 중입니다.",
    narrative: {
      question: "JYP의 K-POP 시스템 수출이 성공하여 글로벌 플랫폼 기업으로 재평가받을 수 있을까?",
      steps: {
        history: {
          title: "Why Now?",
          content: "지금 엔터주는 '위기'이자 '기회'의 갈림길에 서 있습니다. K-POP의 성장이 정점에 달했다는 우려(Peak-out)와, 현지화 아이돌을 통해 새로운 시장이 열릴 것이라는 기대가 팽팽하게 맞서고 있기 때문입니다. 특히 JYP는 가장 적극적으로 '현지화 시스템(A2K, NiziU 등)'을 시도하고 있어, 이 실험의 성공 여부가 주가의 향방을 결정할 중요한 시점입니다."
        },
        floor: {
          title: "The Floor",
          content: "JYP의 기초 체력은 '시스템'에서 나옵니다. 특정 아티스트 의존도를 낮추고, 체계적인 트레이닝 및 프로듀싱 시스템을 통해 꾸준히 신인을 배출해내는 능력이 탁월합니다. 이는 엔터사 중 가장 높은 영업이익률로 증명되고 있으며, 설령 신사업이 지연되더라도 기존 라인업만으로도 안정적인 수익 창출이 가능하다는 것이 하방을 지지하는 요소입니다."
        },
        upside: {
          title: "The Upside",
          content: "주가 상승의 핵심 열쇠(Trigger)는 'K-POP 시스템의 수출'입니다. 단순히 한국 가수가 해외에 나가는 것을 넘어, JYP의 노하우로 미국/일본 현지 가수를 데뷔시키는 'A2K', 'NiziU' 프로젝트가 성공한다면, JYP는 단순 기획사를 넘어 '글로벌 음악 플랫폼'으로 재평가받으며 밸류에이션이 리레이팅될 것입니다."
        },
        debate: {
          title: "Debate",
          question: "현지화 아이돌, 진짜 돈이 될까?",
          bulls: [
            { title: "확장성 무한대", items: ["현지 언어/문화 장벽 해소", "북미/일본 시장의 거대한 파이"] },
            { title: "이익률 개선", items: ["현지 활동으로 비용 절감", "로열티 수익 구조"] }
          ],
          bears: [
            { title: "K-POP 정체성 모호", items: ["한국 없는 K-POP의 매력 반감", "팬덤 결집력 약화 가능성"] },
            { title: "성공 불확실성", items: ["초기 투자 비용 부담", "현지 대형 기획사와의 경쟁"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "JYP는 K-POP의 '산업화'를 가장 잘 증명해온 기업입니다. 이제 그 시스템을 전 세계에 이식하려 합니다. 이 거대한 실험에 배팅하시겠습니까?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "시스템의 힘을 믿는다. 지금이 저점 매수의 기회." },
            { label: "No (Watch)", value: "Watch", desc: "아직은 시기상조. 현지화 프로젝트 성과를 확인하고 싶다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[기존 사업]",
        question: "트와이스와 스트레이키즈, '반짝 유행'일까요 '스테디셀러'일까요?",
        context: "아이돌 그룹은 보통 데뷔 7년 차가 지나면 인기가 꺾인다는 징크스가 있습니다. 하지만 본 조비나 콜드플레이처럼 **'전설'**이 될 수도 있습니다.\n\nJYP의 간판스타들이 앞으로도 수년간 수백만 명을 콘서트에 모을 수 있을까요?",
        options: [
          { label: "Long-run", side: "Bull", implications: "안정적 수익 유지" },
          { label: "Fade-out", side: "Bear", implications: "수익 감소 위험" }
        ]
      },
      {
        id: 2,
        title: "[신규 사업]",
        question: "K-POP, '한국 맛집'인가요 '맥도날드'인가요?",
        context: "JYP는 이제 한국인 없이, 외국인만으로 구성된 K-POP 그룹을 현지에서 데뷔시키고 있습니다.\n\n만약 이것이 성공하면 JYP는 한국 기획사가 아니라, 전 세계 어디서나 통하는 시스템을 가진 **'글로벌 프랜차이즈 기업'**이 됩니다.",
        options: [
          { label: "프랜차이즈", side: "Bull", implications: "주가 대폭 상승 기회" },
          { label: "로컬 맛집", side: "Bear", implications: "성장 한계 존재" }
        ]
      },
      {
        id: 3,
        title: "[가격 매력도]",
        question: "최악의 경우 신인이 망해도 괜찮을까요?",
        context: "투자는 '잃지 않는 것'이 중요합니다. 현재 JYP 주가는 전성기 대비 많이 내려와 있습니다. 미국 현지화 프로젝트가 다 실패하고, 그냥 지금 있는 가수들만 열심히 활동한다고 가정해 봅시다. 그래도 지금 주가라면 사볼 만하다고 느끼시나요?",
        options: [
          { label: "안전함", side: "Bull", implications: "저점 매수 기회" },
          { label: "위험함", side: "Bear", implications: "관망 필요" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-jyp-1',
        type: 'Issue',
        status: 'Active',
        title: 'VCHA 글로벌 데뷔 지표 발표',
        date: 'Today',
        impact: 'High',
        relatedWatchpointId: 2,
        factCheck: {
          status: 'Fail',
          actualValue: '스포티파이 진입 실패',
          description: '기대했던 스포티파이 글로벌 차트 진입에 실패했습니다.'
        },
        marketReaction: {
          priceChange: '-4.5%',
          volumeChange: '300% (Explosive Selling)',
          comment: '실망 매물이 쏟아지며 주가가 급락하고 있습니다.'
        },
        analysis: {
          cause: '초기 음원 성과가 시장의 높은 기대치에 미치지 못했습니다.',
          implication: '단기적인 투자 심리는 악화되었으나, 시스템의 문제는 아닙니다.'
        },
        pros: [
          '유튜브 조회수는 견조하게 상승 중 (팬덤 형성 초기 단계)',
          '현지화 시스템 자체의 결함은 발견되지 않음'
        ],
        cons: [
          '초기 대중성 확보 실패로 마케팅 비용 증가 우려',
          '후속 그룹 데뷔 일정에 대한 불확실성 증대'
        ],
        scenarios: [
          { label: '저가 매수 (기회)', action: 'buy', rationale: '과도한 공포입니다. 장기 방향성은 유효합니다.' },
          { label: '관망 (지켜보기)', action: 'hold', rationale: '다음 앨범 성과까지 확인이 필요합니다.' },
          { label: '비중 축소 (리스크)', action: 'sell', rationale: '불확실성이 커졌습니다. 리스크를 관리합니다.' }
        ]
      }
    ],

    availableLogicBlocks: [],
    chartHistory: {
      '1D': [58000, 57800, 57500, 57200, 57500, 58000, 58200],
      '1W': [59000, 58500, 58000, 57500, 58200],
      '1M': [62000, 61500, 60000, 59500, 58000, 58500, 59000, 58200],
      '3M': [65000, 63000, 60000, 58000, 59000, 58200],
      '1Y': [70000, 65000, 60000, 55000, 58200],
      '5Y': [40000, 50000, 70000, 58200]
    },
    chartNarratives: {
      '1D': '장 초반 약세였으나 오후 들어 저가 매수세가 유입되었습니다.',
      '1W': '단기 바닥을 다지며 반등을 모색하는 구간입니다.',
      '1M': '엔터 업황 우려로 조정받았으나, 58,000원 선에서 지지력을 확인했습니다.',
      '3M': '신인 그룹 데뷔 지연 소식에 하락폭이 컸습니다.',
      '1Y': 'K-POP 피크아웃 논란으로 밸류에이션이 낮아진 상태입니다.',
      '5Y': '장기적으로는 우상향 추세가 훼손되지 않았습니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: 'JYP, A2K 프로젝트 데뷔조 빌보드 핫100 진입 쾌거',
        date: '2025.11.28',
        analystComment: '현지화 전략의 성공 가능성을 입증한 중요한 모멘텀입니다.'
      },
      {
        type: 'Positive',
        text: '스트레이키즈 월드투어 매진 행렬, 매출 신기록 전망',
        date: '2025.11.25',
        analystComment: '기존 IP의 수익 창출 능력이 여전히 견고함을 보여줍니다.'
      },
      {
        type: 'Neutral',
        text: '엔터주 전반적 약세, 밸류에이션 매력 부각',
        date: '2025.11.20',
        analystComment: '악재가 대부분 반영된 가격대로, 저가 매수 기회로 볼 수 있습니다.'
      }
    ]
  },
  {
    ticker: "PLTR",
    name: "팔란티어",
    currentPrice: 24.5,
    changeRate: 3.2,
    companyProfile: {
      summary: "데이터 분석의 끝판왕",
      description: "정부 및 대기업을 위한 빅데이터 분석 소프트웨어를 제공하는 기업입니다. CIA가 초기 투자자로 유명합니다."
    },
    chartContext: "AI 붐을 타고 주가가 급등했으나, 높은 밸류에이션 논란으로 변동성이 큽니다.",
    narrative: {
      question: "팔란티어가 '반짝 AI 테마주'가 아닌 '제2의 마이크로소프트'가 될 수 있을까요?",
      steps: {
        history: {
          title: "Why Now?",
          content: "AI가 실험실을 넘어 실제 비즈니스 현장에 적용되는 시기입니다. 기업들은 단순히 '신기한 AI'가 아니라, 실제로 돈을 벌어다 주는 '실전형 AI'를 찾고 있습니다. 팔란티어는 오랜 기간 정부/군사 작전에서 검증된 소프트웨어 역량을 바탕으로, 이 '실전 AI' 시장을 선점하려 하고 있습니다."
        },
        floor: {
          title: "The Floor",
          content: "팔란티어의 하방은 '미국 정부'가 지지합니다. 국방부, CIA 등과의 장기 계약은 경기 침체와 무관하게 안정적인 현금 흐름을 만들어줍니다. 그 어떤 기업보다 강력한 진입 장벽(보안, 신뢰성)을 구축하고 있어, 쉽게 대체될 수 없는 독보적인 위치를 점하고 있습니다."
        },
        upside: {
          title: "The Upside",
          content: "폭발적인 성장은 민간 기업 시장(Commercial)에 달려 있습니다. 최근 출시한 'AIP(Artificial Intelligence Platform)'가 기업들의 운영 방식을 획기적으로 바꿔놓는다면, 팔란티어는 정부 수주 기업을 넘어 전 세계 모든 기업의 OS(운영체제)가 될 수 있습니다."
        },
        debate: {
          title: "Debate",
          question: "비싼 가격, 정당화될 수 있나?",
          bulls: [
            { title: "압도적 기술 격차", items: ["경쟁사가 따라올 수 없는 온톨로지 기술", "실제 전장/현장에서 입증된 성능"] },
            { title: "민간 시장 침투 가속", items: ["AIP 부트캠프를 통한 빠른 고객 확보", "네트워크 효과 발생"] }
          ],
          bears: [
            { title: "지나친 고평가", items: ["전통적 SaaS 대비 너무 높은 PER", "성장률 둔화 시 주가 급락 위험"] },
            { title: "확장성의 한계", items: ["커스터마이징이 많이 필요한 구조", "전문 엔지니어 의존도 높음"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "데이터가 새로운 석유라면, 팔란티어는 그 석유를 정제하는 최고의 기술을 가졌습니다. 하지만 그 기술값으로 지금의 주가는 합당할까요?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "대체 불가능한 AI 인프라. 비싸도 산다." },
            { label: "No (Watch)", value: "Watch", desc: "좋은 기업이지만 가격이 부담스럽다. 조정을 기다린다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[제품의 성격]",
        question: "기업들에게 AI는 '단순 보조'일까요, '필수 생존 도구'일까요?",
        context: "마이크로소프트의 코파일럿 같은 AI는 업무 효율을 높여주는 **'보조 수단(Nice-to-have)'**에 가깝습니다.\n\n반면 팔란티어는 공장을 멈추거나 전쟁을 지휘하는 등 생존과 직결된 문제를 해결하는 **'핵심 기반(Must-have)'**을 지향합니다.",
        options: [
          { label: "필수 생존 도구", side: "Bull", implications: "필수재 등극" },
          { label: "단순 보조", side: "Bear", implications: "가격 저항 발생" }
        ]
      },
      {
        id: 2,
        title: "[대중성]",
        question: "아이폰처럼 '한번 쓰면 못 빠져나오는' 생태계가 될까요?",
        context: "현재 시장은 팔란티어에게 매우 높은 점수(비싼 주가)를 주고 있습니다. 이 기대에 부응하려면, 강력한 **'락인(Lock-in) 효과'**가 있어야 합니다.\n\n팔란티어 시스템이 기업 깊숙이 침투하여 **대체 불가능한 표준**이 될 것이라 보십니까?",
        options: [
          { label: "표준 등극", side: "Bull", implications: "영원한 고객 확보" },
          { label: "대체 가능", side: "Bear", implications: "경쟁 심화 우려" }
        ]
      },
      {
        id: 3,
        title: "[가격 정당성]",
        question: "앞으로 '모든' 공장과 사무실이 이걸 쓰게 될까요?",
        context: "지금 팔란티어 주가에는 '앞으로 전 세계 수많은 기업이 도입할 것'이라는 **엄청난 기대**가 반영되어 있습니다.\n\n팔란티어가 소수의 특수 기업(방산, 에너지)을 넘어, 일반 기업들도 다 쓰는 **'국민 소프트웨어'**가 될 수 있을까요?",
        options: [
          { label: "대중화 성공", side: "Bull", implications: "고평가 정당화" },
          { label: "틈새시장 국한", side: "Bear", implications: "주가 하락 위험" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-pltr-1',
        type: 'Report',
        status: 'Active',
        title: 'AIP 부트캠프 전환율 보고서',
        date: 'Yesterday',
        impact: 'High',
        relatedWatchpointId: 2,
        factCheck: {
          status: 'Pass',
          actualValue: '전환율 40% 달성',
          description: '무료 부트캠프 고객의 유료 전환율이 예상치를 상회했습니다.'
        },
        marketReaction: {
          priceChange: '+5.2%',
          volumeChange: 'Strong Buying',
          comment: '기관 투자자들의 매수세가 유입되고 있습니다.'
        },
        analysis: {
          cause: 'AIP(인공지능 플랫폼)의 실제 도입 효과가 입증되었습니다.',
          implication: '민간 시장(Commercial) 확장이 가속화될 전망입니다.'
        },
        pros: [
          '고객사 락인(Lock-in) 효과가 숫자로 증명됨',
          '영업 레버리지 효과로 이익률 개선 기대'
        ],
        cons: [
          '주가가 이미 선반영되어 밸류에이션 부담 가중',
          '정부 계약 성장률은 다소 둔화됨'
        ],
        scenarios: [
          { label: '추격 매수', action: 'buy', rationale: '성장성이 확인되었습니다. 더 오를 것입니다.' },
          { label: '보유 (Hold)', action: 'hold', rationale: '좋은 뉴스지만 가격이 비쌉니다.' },
          { label: '차익 실현', action: 'sell', rationale: '뉴스에 파는 것이 안전합니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [24.2, 24.3, 24.5, 24.8, 24.5],
      '1W': [23.5, 23.8, 24.0, 24.2, 24.5],
      '1M': [22.0, 22.5, 23.0, 23.5, 24.0, 24.5],
      '3M': [20.0, 21.0, 22.0, 23.0, 24.5],
      '1Y': [15.0, 18.0, 20.0, 22.0, 24.5],
      '5Y': [10.0, 25.0, 15.0, 20.0, 24.5]
    },
    chartNarratives: {
      '1D': '장중 꾸준한 우상향 흐름을 보이고 있습니다.',
      '1W': 'AIP 컨퍼런스 이후 기대감이 반영되며 상승세입니다.',
      '1M': '견조한 실적 발표 이후 레벨업된 주가를 유지 중입니다.',
      '3M': 'S&P500 편입 기대감으로 수급이 개선되었습니다.',
      '1Y': '흑자 전환 성공으로 펀더멘털이 강화되었습니다.',
      '5Y': '상장 초기 거품이 빠지고 실적 기반으로 재평가받고 있습니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: '팔란티어, 미 육군과 2,000억원 규모 계약 체결',
        date: '2025.11.29',
        analystComment: '정부 매출의 안정성을 다시 한번 입증했습니다.'
      },
      {
        type: 'Positive',
        text: 'AIP 부트캠프 참여 기업 1,000개 돌파',
        date: '2025.11.25',
        analystComment: '민간 시장 확장이 예상보다 빠르게 진행되고 있습니다.'
      },
      {
        type: 'Negative',
        text: '내부자 매도 소식에 주가 소폭 하락',
        date: '2025.11.20',
        analystComment: '단기적인 수급 이슈일 뿐, 펀더멘털 영향은 제한적입니다.'
      }
    ]
  },
  {
    ticker: "GOOGL",
    name: "구글",
    currentPrice: 175.5,
    changeRate: 1.2,
    companyProfile: {
      summary: "인터넷의 관문, AI의 선구자",
      description: "검색 엔진, 유튜브, 안드로이드, 클라우드 등 전 세계 인터넷 생태계를 지배하는 빅테크 기업입니다."
    },
    chartContext: "생성형 AI 경쟁 심화 우려로 주가가 횡보했으나, 최근 실적 호조로 반등 중입니다.",
    narrative: {
      question: "검색 제왕 구글, AI 시대에도 왕좌를 지킬 수 있을까?",
      steps: {
        history: {
          title: "Why Now?",
          content: "ChatGPT의 등장으로 '검색의 시대'가 끝났다는 위기론이 대두되었습니다. 하지만 구글은 'Gemini'를 통해 반격을 시작했습니다. 지금은 구글이 검색 시장의 지배력을 유지하면서 AI라는 새로운 파도에 성공적으로 올라탈 수 있을지 판가름 나는 중요한 시기입니다."
        },
        floor: {
          title: "The Floor",
          content: "구글의 검색 광고와 유튜브는 여전히 막강한 '현금 창출기(Cash Cow)'입니다. 전 세계인의 습관이 된 검색과 동영상 소비 패턴은 쉽게 바뀌지 않습니다. 이 막대한 자금력은 AI 인프라 투자 경쟁에서 구글이 결코 뒤처지지 않게 하는 든든한 버팀목입니다."
        },
        upside: {
          title: "The Upside",
          content: "AI가 검색 결과에 통합되면서(SGE), 구글은 단순 검색 엔진을 넘어 '개인 비서'로 진화하고 있습니다. 또한 유튜브 쇼핑, 클라우드 성장 등 AI를 접목한 신사업들이 터져준다면, 구글은 다시 한번 거대한 성장을 이뤄낼 수 있습니다."
        },
        debate: {
          title: "Debate",
          question: "AI는 검색 광고를 갉아먹을까?",
          bulls: [
            { title: "광고 효율 증대", items: ["AI로 타겟팅 정교화", "구매 전환율 상승"] },
            { title: "플랫폼 락인 강화", items: ["안드로이드/유튜브와의 시너지", "데이터 독점"] }
          ],
          bears: [
            { title: "자기 잠식(Cannibalization)", items: ["답변 바로 주면 광고 클릭 감소", "검색 비용 증가"] },
            { title: "점유율 하락", items: ["ChatGPT/Perplexity 등 경쟁자 부상", "젊은 층의 이탈"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "구글은 인터넷 역사상 가장 강력한 해자를 가진 기업입니다. AI라는 도전자가 이 성벽을 무너뜨릴까요, 아니면 구글이 AI마저 흡수해버릴까요?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "구글은 결국 승리한다. AI도 구글이 제일 잘할 것." },
            { label: "No (Watch)", value: "Watch", desc: "검색 점유율 변화를 좀 더 지켜보고 싶다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[기존 사업]",
        question: "검색 광고, '황금알을 낳는 거위'는 건재한가?",
        context: "AI 챗봇이 답을 바로 알려주면 사람들은 링크를 클릭하지 않습니다. 이는 구글의 핵심 수입원인 **'검색 광고' 매출 감소**로 이어질 수 있습니다.\n\n구글이 AI를 도입하면서도 광고 수익을 지켜낼 수 있을까요?",
        options: [
          { label: "건재함", side: "Bull", implications: "캐시카우 유지" },
          { label: "위축됨", side: "Bear", implications: "수익성 악화" }
        ]
      },
      {
        id: 2,
        title: "[신규 사업]",
        question: "Gemini는 '아이폰'이 될 수 있을까?",
        context: "구글의 AI 모델 Gemini가 안드로이드 폰에 기본 탑재되어, 전 세계인의 일상을 지배하는 '슈퍼 앱'이 될 수 있을까요? 아니면 그저 여러 AI 비서 중 하나(N분의 1)에 그칠까요?",
        options: [
          { label: "슈퍼 앱", side: "Bull", implications: "모바일 생태계 장악" },
          { label: "N분의 1", side: "Bear", implications: "경쟁 심화" }
        ]
      },
      {
        id: 3,
        title: "[인프라]",
        question: "TPU, 엔비디아를 대체할 '게임 체인저'인가?",
        context: "AI를 돌리는 데는 엄청난 비용이 듭니다. 구글은 자체 개발 칩(TPU)을 통해 이 비용을 획기적으로 낮추려 합니다. 구글의 칩이 엔비디아 GPU 의존도를 낮추고 이익률을 방어해줄 수 있을까요?",
        options: [
          { label: "게임 체인저", side: "Bull", implications: "비용 경쟁력 우위" },
          { label: "대체 불가", side: "Bear", implications: "비용 부담 지속" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-goog-1',
        type: 'Issue',
        status: 'Active',
        title: 'Gemini 3.0 전격 공개',
        date: 'Today',
        impact: 'High',
        relatedWatchpointId: 1,
        factCheck: {
          status: 'Pass',
          actualValue: 'MMLU 92.5%',
          description: 'Gemini 3.0이 GPT-5를 상회하는 벤치마크 점수를 기록했습니다.'
        },
        marketReaction: {
          priceChange: '+4.2%',
          volumeChange: '+180%',
          comment: 'AI 주도권 탈환 기대감에 매수세가 폭발하고 있습니다.'
        },
        analysis: {
          cause: 'Gemini 3.0의 압도적인 성능과 멀티모달 기능',
          context: '검색 시장 점유율 방어 및 클라우드 성장 가속화 전망',
          implication: 'AI 수익화 모델의 구체화 가능성 증대'
        },
        scenarios: [
          { label: '강력 매수', action: 'buy', rationale: 'AI 리더십 회복, 지금이 저가 매수 기회' },
          { label: '관망', action: 'hold', rationale: '실제 서비스 적용 및 수익화 추이 확인 필요' },
          { label: '매도', action: 'sell', rationale: '경쟁 심화 및 비용 증가 우려 여전' }
        ],
        pros: ['GPT-5 대비 우수한 성능 입증', '유튜브/검색 등 자사 플랫폼 시너지 기대'],
        cons: ['AI 모델 개발 및 운영 비용 급증', '반독점 규제 리스크 지속']
      }
    ],

    availableLogicBlocks: [],
    chartHistory: {
      '1D': [174, 174.5, 175, 175.2, 175.5],
      '1W': [170, 172, 173, 174, 175.5],
      '1M': [165, 168, 170, 172, 171, 173, 174, 175.5],
      '3M': [150, 155, 160, 165, 170, 175.5],
      '1Y': [140, 150, 160, 170, 175.5],
      '5Y': [100, 120, 140, 160, 175.5]
    },
    chartNarratives: {
      '1D': 'Gemini 3.0 발표 직후 강한 상승세를 보이고 있습니다.',
      '1W': 'AI 신제품 기대감으로 주간 내내 강세입니다.',
      '1M': 'Gemini 3.0 발표 기대감으로 꾸준한 우상향 추세를 보이고 있습니다.',
      '3M': '검색 점유율 방어 성공으로 투자 심리가 개선되었습니다.',
      '1Y': 'AI 경쟁력 입증으로 신고가 랠리를 이어가고 있습니다.',
      '5Y': '빅테크 중 가장 안정적인 성장세를 유지 중입니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: 'Gemini 3.0 탑재 픽셀폰, 사전 예약 역대 최고',
        date: '2025.11.30',
        analystComment: '온디바이스 AI 시장에서의 주도권 확보가 기대됩니다.'
      },
      {
        type: 'Positive',
        text: '구글 클라우드, AI 수요 힘입어 40% 성장',
        date: '2025.11.28',
        analystComment: '클라우드 부문의 이익 기여도가 지속적으로 상승하고 있습니다.'
      },
      {
        type: 'Negative',
        text: 'EU, 빅테크 AI 규제 법안 발의... 구글 영향은?',
        date: '2025.11.25',
        analystComment: '규제 리스크는 상존하나, 이미 주가에 일부 반영된 것으로 보입니다.'
      }
    ]
  },
  {
    ticker: "TSLA",
    name: "테슬라",
    currentPrice: 180.2,
    changeRate: -0.5,
    companyProfile: {
      summary: "전기차 그 이상의 미래",
      description: "전기차, 자율주행, 로봇, 에너지 사업을 아우르는 혁신 기업입니다. 일론 머스크의 비전이 핵심 동력입니다."
    },
    chartContext: "전기차 수요 둔화로 조정을 받았으나, 로보택시 기대감으로 다시 주목받고 있습니다.",
    narrative: {
      question: "테슬라는 '자동차 회사'인가요, 'AI 로봇 회사'인가요?",
      steps: {
        history: {
          title: "Why Now?",
          content: "전기차 시장의 성장세가 둔화되면서 테슬라의 주가는 정체기를 겪었습니다. 이제 시장의 눈은 '차를 얼마나 많이 파느냐'에서 '자율주행(FSD)과 로보택시가 언제 실현되느냐'로 옮겨갔습니다. 지금은 테슬라가 단순 제조사에서 AI 플랫폼 기업으로 변모하는 결정적인 과도기입니다."
        },
        floor: {
          title: "The Floor",
          content: "테슬라는 전기차 시장에서 압도적인 원가 경쟁력과 브랜드 파워를 가지고 있습니다. 치킨 게임이 벌어져도 끝까지 살아남을 수 있는 체력을 갖췄으며, 충전 네트워크(슈퍼차저)와 에너지 사업은 안정적인 수익원이 되어주고 있습니다."
        },
        upside: {
          title: "The Upside",
          content: "테슬라의 진정한 가치는 '자율주행 소프트웨어'와 '휴머노이드 로봇(옵티머스)'에 있습니다. 만약 로보택시가 상용화되어 운송 시장을 장악한다면, 테슬라의 시가총액은 지금과는 차원이 다른 레벨로 도약할 것입니다."
        },
        debate: {
          title: "Debate",
          question: "완전 자율주행, 꿈인가 현실인가?",
          bulls: [
            { title: "데이터의 승리", items: ["압도적인 주행 데이터 보유", "V12의 획기적 성능 개선"] },
            { title: "비즈니스 모델 확장", items: ["FSD 라이선싱 판매", "로보택시 플랫폼 수수료"] }
          ],
          bears: [
            { title: "규제의 벽", items: ["사고 책임 소재 불분명", "정부의 승인 지연 가능성"] },
            { title: "기술적 한계", items: ["완벽한 Level 5 도달 불확실", "라이다 없는 방식의 위험성"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "테슬라 투자는 일론 머스크가 그리는 미래에 대한 믿음입니다. 전기차 1등을 넘어 AI 혁명의 주인공이 될 것이라 믿으십니까?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "머스크는 결국 해낸다. 미래 가치를 선점한다." },
            { label: "No (Watch)", value: "Watch", desc: "자율주행 완성도가 더 높아질 때까지 기다린다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[기존 사업]",
        question: "전기차 마진, '애플'급인가 '현대차'급인가?",
        context: "테슬라는 혁신적인 공정으로 높은 이익률을 자랑해왔습니다. 하지만 중국 전기차들의 저가 공세가 거셉니다.\n\n테슬라가 가격 전쟁 속에서도 여전히 남들보다 월등히 높은 **마진(이익률)**을 지켜낼 수 있을까요?",
        options: [
          { label: "애플급", side: "Bull", implications: "압도적 원가 우위" },
          { label: "현대차급", side: "Bear", implications: "평범한 제조사화" }
        ]
      },
      {
        id: 2,
        title: "[신규 사업]",
        question: "로보택시, '우버'를 죽일 수 있을까?",
        context: "테슬라의 로보택시가 나오면 운전기사가 필요 없어 요금이 획기적으로 낮아집니다.\n\n이것이 기존의 우버나 택시 산업을 완전히 대체하고, 테슬라가 그 시장을 **독식**할 수 있을 것이라 보십니까?",
        options: [
          { label: "시장 독식", side: "Bull", implications: "플랫폼 기업 도약" },
          { label: "공존/실패", side: "Bear", implications: "규제 및 경쟁 심화" }
        ]
      },
      {
        id: 3,
        title: "[CEO 리스크]",
        question: "일론 머스크, '천재'인가 '시한폭탄'인가?",
        context: "머스크의 기행은 주가에 큰 변동성을 줍니다. 하지만 그의 천재성이 없으면 지금의 테슬라도 없습니다.\n\n머스크의 리더십이 앞으로도 테슬라를 혁신으로 이끄는 **핵심 동력**이 될까요, 아니면 회사를 위태롭게 하는 **리스크**가 될까요?",
        options: [
          { label: "핵심 동력", side: "Bull", implications: "혁신 지속" },
          { label: "리스크", side: "Bear", implications: "오너 리스크 부각" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-tsla-1',
        type: 'Issue',
        status: 'Active',
        title: 'NHTSA 로보택시 안전성 조사 확대',
        date: 'Today',
        impact: 'High',
        relatedWatchpointId: 2,
        factCheck: {
          status: 'Fail',
          actualValue: '조사 대상 확대',
          description: '규제 당국이 FSD 안전성에 대해 강도 높은 조사를 예고했습니다.'
        },
        marketReaction: {
          priceChange: '-3.8%',
          volumeChange: 'Panic Selling',
          comment: '규제 리스크 부각으로 실망 매물이 나오고 있습니다.'
        },
        analysis: {
          cause: '최근 발생한 FSD 관련 사고가 트리거가 되었습니다.',
          implication: '로보택시 상용화 시점이 지연될 수 있다는 우려가 커졌습니다.'
        },
        pros: [
          '데이터 축적량은 여전히 압도적임',
          '규제는 결국 넘어야 할 산이며, 기술적 진보는 계속됨'
        ],
        cons: [
          '상용화 지연 시 밸류에이션(PER) 유지 어려움',
          '경쟁사(Waymo 등)에게 추격의 시간 허용'
        ],
        scenarios: [
          { label: '저가 매수', action: 'buy', rationale: '규제 노이즈는 매수 기회입니다.' },
          { label: '관망', action: 'hold', rationale: '조사 결과를 지켜봐야 합니다.' },
          { label: '손절', action: 'sell', rationale: '로보택시가 없으면 주가는 너무 비쌉니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [181, 180.5, 180.2, 179.8, 180.2],
      '1W': [185, 183, 182, 181, 180.2],
      '1M': [190, 188, 185, 182, 180.2],
      '3M': [200, 195, 190, 185, 180.2],
      '1Y': [250, 220, 200, 190, 180.2],
      '5Y': [20, 300, 400, 200, 180.2]
    },
    chartNarratives: {
      '1D': '로보택시 규제 이슈로 장중 약세를 보이고 있습니다.',
      '1W': '인도량 부진 우려로 하락 추세가 이어지고 있습니다.',
      '1M': '전기차 수요 둔화 데이터가 확인되며 조정받고 있습니다.',
      '3M': '가격 인하 경쟁 심화로 이익률 훼손 우려가 큽니다.',
      '1Y': '성장통을 겪으며 밸류에이션이 정상화되는 과정입니다.',
      '5Y': '역사적 고점 대비 조정을 받았으나 장기 우상향 추세는 유효합니다.'
    },
    newsTags: [
      {
        type: 'Negative',
        text: '테슬라, 중국 내 FSD 승인 지연 가능성',
        date: '2025.11.30',
        analystComment: '중국 시장 모멘텀이 약화될 수 있는 리스크입니다.'
      },
      {
        type: 'Positive',
        text: '사이버트럭 생산량 주당 5,000대 돌파',
        date: '2025.11.28',
        analystComment: '생산 병목 현상이 해소되고 있음을 보여줍니다.'
      },
      {
        type: 'Neutral',
        text: '머스크, AI 스타트업 xAI에 추가 투자 유치',
        date: '2025.11.25',
        analystComment: '테슬라와의 시너지 기대와 자원 분산 우려가 공존합니다.'
      }
    ]
  },
  {
    ticker: "NVDA",
    name: "엔비디아",
    currentPrice: 950.0,
    changeRate: 5.4,
    companyProfile: {
      summary: "AI 시대의 심장",
      description: "GPU 시장을 독점하며 AI 연산의 표준을 제시하는 기업입니다. 데이터센터 매출이 폭발적으로 성장 중입니다."
    },
    chartContext: "AI 수요 폭발로 사상 최고가를 경신 중이며, 조정 시마다 매수세가 유입되고 있습니다.",
    narrative: {
      question: "엔비디아의 독주, 영원할 수 있을까?",
      steps: {
        history: {
          title: "Why Now?",
          content: "모든 빅테크 기업들이 AI 주도권을 잡기 위해 엔비디아의 칩(H100, Blackwell)을 사려고 줄을 섰습니다. '공급이 수요를 못 따라가는' 초호황기입니다. 지금은 이 폭발적인 성장이 얼마나 더 지속될 수 있을지, 경쟁자들이 언제쯤 따라올 수 있을지를 판단해야 할 시점입니다."
        },
        floor: {
          title: "The Floor",
          content: "엔비디아의 진짜 힘은 칩 성능뿐만 아니라 'CUDA'라는 소프트웨어 생태계에 있습니다. 전 세계 AI 개발자들이 이미 CUDA에 익숙해져 있어, 다른 칩으로 갈아타기가 매우 어렵습니다. 이 강력한 락인(Lock-in) 효과가 엔비디아의 점유율을 방어해줍니다."
        },
        upside: {
          title: "The Upside",
          content: "AI는 이제 시작입니다. 텍스트를 넘어 영상, 로봇, 신약 개발, 자율주행 등 모든 산업으로 AI가 확산되면, 필요한 컴퓨팅 파워는 기하급수적으로 늘어납니다. 엔비디아는 단순 칩 판매를 넘어 'AI 공장'을 지어주는 토탈 솔루션 기업으로 진화하고 있습니다."
        },
        debate: {
          title: "Debate",
          question: "경쟁자들의 추격, 위협적인가?",
          bulls: [
            { title: "대체 불가", items: ["성능 격차 유지", "소프트웨어 생태계 장악"] },
            { title: "시장 확대", items: ["소버린 AI(국가별 AI) 수요 증가", "추론 시장 선점"] }
          ],
          bears: [
            { title: "자체 칩 개발", items: ["구글/아마존/MS의 탈엔비디아 시도", "비용 절감 니즈"] },
            { title: "수요 피크 우려", items: ["빅테크 투자 축소 시 타격", "재고 조정 가능성"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "골드러시 시대에 청바지를 파는 리바이스처럼, AI 시대에 가장 확실한 돈을 버는 곳은 엔비디아입니다. 이 독점적 지위가 앞으로도 계속될 것이라 믿으십니까?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "AI는 엔비디아 없이는 불가능하다. 계속 간다." },
            { label: "No (Watch)", value: "Watch", desc: "경쟁 심화와 고평가가 우려된다. 조심스럽다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[해자]",
        question: "CUDA 생태계, '철옹성'인가 '모래성'인가?",
        context: "많은 경쟁사들이 엔비디아의 소프트웨어 독점(CUDA)을 깨기 위해 연합군을 결성했습니다.\n\n개발자들이 엔비디아의 생태계를 떠나 다른 칩을 쓰기 시작할까요? 아니면 이미 익숙해진 환경을 **버리지 못할까요**?",
        options: [
          { label: "철옹성", side: "Bull", implications: "독점 유지" },
          { label: "모래성", side: "Bear", implications: "점유율 하락" }
        ]
      },
      {
        id: 2,
        title: "[수요 지속성]",
        question: "빅테크들의 AI 투자, '치킨 게임'인가 '실수요'인가?",
        context: "지금 구글, MS, 메타 등은 경쟁에서 뒤처지지 않기 위해 무리해서라도 엔비디아 칩을 사고 있습니다.\n\n만약 AI 서비스에서 돈이 안 벌린다면, 이들은 칩 구매를 확 줄일 것입니다. 지금의 수요가 **거품**일 가능성은 없을까요?",
        options: [
          { label: "실수요", side: "Bull", implications: "실적 지속 성장" },
          { label: "치킨 게임", side: "Bear", implications: "수요 절벽 위험" }
        ]
      },
      {
        id: 3,
        title: "[가격 정당성]",
        question: "시총 1위, '거품'인가 '뉴 노멀'인가?",
        context: "엔비디아는 세계에서 가장 비싼 기업 중 하나가 되었습니다.\n\n이것이 AI 시대의 당연한 결과(**New Normal**)일까요, 아니면 닷컴 버블 때의 시스코처럼 지나친 열광(**Bubble**)일까요?",
        options: [
          { label: "뉴 노멀", side: "Bull", implications: "추가 상승 여력" },
          { label: "거품", side: "Bear", implications: "큰 폭의 조정" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-nvda-1',
        type: 'Issue',
        status: 'Active',
        title: 'Blackwell 칩 출시 지연 루머',
        date: 'Today',
        impact: 'High',
        relatedWatchpointId: 2,
        factCheck: {
          status: 'Fail',
          actualValue: '3개월 지연 가능성',
          description: '설계 결함으로 인해 차세대 칩 출시가 늦어질 수 있다는 보도입니다.'
        },
        marketReaction: {
          priceChange: '-6.2%',
          volumeChange: 'Massive Selling',
          comment: 'AI 거품론과 맞물려 투매가 나오고 있습니다.'
        },
        analysis: {
          cause: '패키징 과정에서의 발열 문제가 원인으로 지목됩니다.',
          implication: '단기 실적 공백 우려가 있으나, 수요 자체가 사라진 것은 아닙니다.'
        },
        pros: [
          '수요는 여전히 공급을 초과하는 상태 (대기 수요 누적)',
          '경쟁사(AMD)가 이 틈을 타기에는 아직 역부족'
        ],
        cons: [
          '빅테크들의 AI 투자 심리 위축 가능성',
          '주가 고점 논란에 기름을 붓는 격'
        ],
        scenarios: [
          { label: '저점 매수', action: 'buy', rationale: '기술적 이슈일 뿐, 펀더멘털은 견고합니다.' },
          { label: '관망', action: 'hold', rationale: '지연이 사실인지 확인이 필요합니다.' },
          { label: '비중 축소', action: 'sell', rationale: '모멘텀이 꺾였습니다. 일단 피합니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [945, 948, 950, 952, 950],
      '1W': [930, 935, 940, 945, 950],
      '1M': [900, 910, 920, 930, 950],
      '3M': [800, 850, 900, 920, 950],
      '1Y': [400, 600, 800, 900, 950],
      '5Y': [100, 200, 400, 800, 950]
    },
    chartNarratives: {
      '1D': 'Blackwell 지연 루머에도 불구하고 저가 매수세가 강합니다.',
      '1W': '실적 발표를 앞두고 기대감이 고조되고 있습니다.',
      '1M': 'AI 투자 확대 기조가 재확인되며 신고가를 경신했습니다.',
      '3M': '조정 시마다 강한 반등을 보여주며 주도주 지위를 유지 중입니다.',
      '1Y': 'AI 시대의 최대 수혜주로서 독보적인 상승률을 기록했습니다.',
      '5Y': '반도체 사이클을 넘어 구조적 성장기에 진입했습니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: '엔비디아, H200 칩 주문 폭주... 대기 1년',
        date: '2025.11.29',
        analystComment: '공급 부족 현상이 당분간 지속될 전망입니다.'
      },
      {
        type: 'Negative',
        text: '아마존·구글, 자체 AI 칩 개발 가속화',
        date: '2025.11.26',
        analystComment: '장기적인 경쟁 심화 우려가 제기되고 있습니다.'
      },
      {
        type: 'Positive',
        text: '젠슨 황, "AI 공장은 이제 시작일 뿐"',
        date: '2025.11.22',
        analystComment: 'CEO의 강한 자신감이 투자 심리를 자극하고 있습니다.'
      }
    ]
  },
  {
    ticker: "AAPL",
    name: "애플",
    currentPrice: 192.3,
    changeRate: 0.8,
    companyProfile: {
      summary: "온디바이스 AI의 잠재적 패자",
      description: "아이폰, 아이패드, 맥 등 강력한 하드웨어 생태계를 기반으로 서비스 매출을 확대하고 있습니다."
    },
    chartContext: "중국 판매 부진 우려로 주춤했으나, AI 기능 탑재 발표 이후 기대감이 살아나고 있습니다.",
    narrative: {
      question: "애플, AI 전쟁에서 뒤처진 걸까, 숨 고르기 중인 걸까?",
      steps: {
        history: {
          title: "Why Now?",
          content: "애플은 AI 열풍에서 한발 물러나 있는 것처럼 보였습니다. 하지만 'Apple Intelligence' 발표를 통해, 클라우드가 아닌 기기 자체에서 돌아가는 '온디바이스 AI'로 승부수를 던졌습니다. 지금은 애플이 20억 대의 활성 기기를 무기로 AI 시장의 판도를 뒤집을 수 있을지 지켜봐야 할 때입니다."
        },
        floor: {
          title: "The Floor",
          content: "애플의 가장 큰 자산은 '충성 고객'입니다. 한번 아이폰을 쓰면 에어팟, 애플워치, 맥북까지 쓰게 되는 강력한 생태계(Walled Garden)는 경쟁사가 넘볼 수 없는 해자입니다. 또한 자사주 매입과 배당 등 주주 환원 정책도 주가를 단단하게 받쳐줍니다."
        },
        upside: {
          title: "The Upside",
          content: "만약 아이폰의 시리(Siri)가 진짜 똑똑해져서 내 모든 앱을 제어해준다면? 사람들은 AI 기능을 쓰기 위해 새 아이폰으로 바꿀 것입니다(슈퍼 사이클). 하드웨어 교체 수요뿐만 아니라, AI 앱스토어 같은 새로운 서비스 매출도 기대할 수 있습니다."
        },
        debate: {
          title: "Debate",
          question: "혁신의 부재 vs 완성된 경험",
          bulls: [
            { title: "온디바이스 AI 최강자", items: ["개인정보 보안 우위", "하드웨어/소프트웨어 최적화"] },
            { title: "교체 주기 도래", items: ["AI 기능 구동을 위한 기기 업그레이드 수요", "아이폰 매출 반등"] }
          ],
          bears: [
            { title: "중국 리스크", items: ["애국 소비 열풍", "화웨이 등 로컬 브랜드의 추격"] },
            { title: "AI 기술 격차", items: ["오픈AI/구글 대비 자체 모델 성능 의문", "뒤늦은 출발"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "애플은 항상 늦게 출발했지만, 결국 시장을 정의하고 지배해왔습니다. AI 스마트폰 시대도 애플이 정의하게 될까요?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "애플의 사용자 경험은 이길 수 없다. 믿고 산다." },
            { label: "No (Watch)", value: "Watch", desc: "중국 시장 부진과 AI 성능을 좀 더 확인하고 싶다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[신규 사업]",
        question: "애플 인텔리전스, '시리'의 환골탈태인가?",
        context: "그동안 시리(Siri)는 멍청하다는 놀림을 받았습니다.\n\n새로 나올 AI 기능들이 소비자가 '와, 이건 진짜 편하다'라고 느낄 만큼 **혁신적**일까요? 아니면 그저 **마케팅 용어**에 불과할까요?",
        options: [
          { label: "환골탈태", side: "Bull", implications: "슈퍼 사이클 견인" },
          { label: "마케팅", side: "Bear", implications: "실망 매물 출회" }
        ]
      },
      {
        id: 2,
        title: "[시장 리스크]",
        question: "중국 시장, '애국 소비'를 뚫을 수 있나?",
        context: "애플 매출의 20%를 차지하는 중국에서 아이폰 판매가 줄고 있습니다.\n\n중국 정부의 규제와 화웨이의 부활 속에서도 애플이 **프리미엄 폰 시장의 지배력**을 유지할 수 있을까요?",
        options: [
          { label: "지배력 유지", side: "Bull", implications: "실적 방어 성공" },
          { label: "점유율 하락", side: "Bear", implications: "성장판 닫힘" }
        ]
      },
      {
        id: 3,
        title: "[해자]",
        question: "폐쇄적 생태계, '독'인가 '약'인가?",
        context: "유럽 등 각국 정부는 애플의 폐쇄적인 정책(앱스토어 독점 등)을 규제하려 합니다.\n\n이러한 규제가 애플 생태계의 **락인 효과**를 약화시키고 수익성을 훼손할까요? 아니면 애플은 영리하게 피해갈까요?",
        options: [
          { label: "약(방어)", side: "Bull", implications: "해자 유지" },
          { label: "독(훼손)", side: "Bear", implications: "수익 모델 타격" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-aapl-1',
        type: 'Product Launch',
        status: 'Upcoming',
        title: 'WWDC AI 기능 공개',
        date: 'D-14',
        impact: 'High',
        relatedWatchpointId: 1,
        factCheck: {
          status: 'Pending',
          actualValue: '확인 대기 중',
          description: '애플 인텔리전스의 구체적인 기능과 시리(Siri)의 업그레이드 수준이 공개될 예정입니다.'
        },
        marketReaction: {
          priceChange: '+0.8%',
          volumeChange: 'Steady',
          comment: '기대감과 우려가 공존하며 관망세가 짙습니다.'
        },
        analysis: {
          cause: '경쟁사 대비 늦은 AI 도입에 대한 시장의 의구심을 해소해야 합니다.',
          implication: '온디바이스 AI의 표준을 제시할 수 있을지가 관전 포인트입니다.'
        },
        pros: [
          '강력한 하드웨어 생태계를 기반으로 한 빠른 보급',
          '개인정보 보호를 중시하는 소비자들에게 어필'
        ],
        cons: [
          '오픈AI/구글 대비 자체 모델 성능 부족 우려',
          '중국 시장에서의 AI 기능 탑재 불확실성'
        ],
        scenarios: [
          { label: '선취매', action: 'buy', rationale: '애플은 결국 해냅니다. 저점 매수 기회입니다.' },
          { label: '관망', action: 'hold', rationale: '실제 기능 시연을 보고 판단해도 늦지 않습니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [191, 191.5, 192, 192.2, 192.3],
      '1W': [190, 190.5, 191, 191.5, 192.3],
      '1M': [185, 188, 190, 191, 192.3],
      '3M': [170, 175, 180, 185, 192.3],
      '1Y': [150, 160, 170, 180, 192.3],
      '5Y': [100, 130, 150, 180, 192.3]
    },
    chartNarratives: {
      '1D': 'WWDC 기대감으로 장 막판 상승폭을 확대했습니다.',
      '1W': 'AI 기능 탑재 소식에 투자 심리가 개선되고 있습니다.',
      '1M': '중국 판매 우려가 완화되며 반등 흐름을 탔습니다.',
      '3M': '저평가 매력이 부각되며 기관 수급이 유입되었습니다.',
      '1Y': '성장 둔화 우려를 딛고 다시 상승 추세로 복귀했습니다.',
      '5Y': '강력한 주주 환원 정책으로 하방 경직성이 뛰어납니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: '애플, 오픈AI와 파트너십 체결 임박',
        date: '2025.11.30',
        analystComment: 'AI 경쟁력을 단숨에 확보할 수 있는 전략적 선택입니다.'
      },
      {
        type: 'Negative',
        text: '중국 아이폰 할인 판매에도 출하량 감소',
        date: '2025.11.27',
        analystComment: '중국 시장에서의 브랜드 파워 약화가 우려됩니다.'
      },
      {
        type: 'Positive',
        text: '아이패드 신제품, M4 칩 성능 호평',
        date: '2025.11.24',
        analystComment: '하드웨어 기술 격차를 다시 한번 증명했습니다.'
      }
    ]
  },
  {
    ticker: "005930",
    name: "삼성전자",
    currentPrice: 78500,
    changeRate: -0.8,
    companyProfile: {
      summary: "반도체 왕좌 탈환을 노린다",
      description: "메모리 반도체 세계 1위, 스마트폰, 가전 등 다각화된 포트폴리오를 가진 한국 대표 기업입니다."
    },
    chartContext: "HBM 경쟁에서 밀리며 주가가 부진했으나, 엔비디아 납품 기대감으로 반등을 모색 중입니다.",
    narrative: {
      question: "삼성전자, '만년 2등' 꼬리표 떼고 다시 비상할까?",
      steps: {
        history: {
          title: "Why Now?",
          content: "AI 반도체의 핵심인 HBM(고대역폭메모리) 시장에서 SK하이닉스에 주도권을 뺏기며 자존심을 구겼습니다. 하지만 삼성은 막강한 자금력과 기술력으로 맹추격을 시작했습니다. 엔비디아 테스트 통과 여부가 초미의 관심사이며, 지금이 반격의 서막일지, 쇠락의 전조일지 결정될 순간입니다."
        },
        floor: {
          title: "The Floor",
          content: "반도체 사이클이 바닥을 찍고 올라오고 있습니다(Turn-around). 레거시(범용) 메모리 가격이 상승하면, 점유율 1위인 삼성전자의 실적은 자연스럽게 개선됩니다. 또한 스마트폰(갤럭시)과 가전 사업이 버텨주고 있어 실적 변동성을 줄여줍니다."
        },
        upside: {
          title: "The Upside",
          content: "삼성의 꿈은 '턴키(Turn-key)'입니다. 메모리(HBM), 파운드리(생산), 패키징(조립)을 한 번에 다 해줄 수 있는 유일한 회사라는 점을 무기로 삼고 있습니다. 만약 이 전략이 먹혀 엔비디아나 AMD의 물량을 대거 수주한다면, 주가는 전고점을 뚫고 날아오를 것입니다."
        },
        debate: {
          title: "Debate",
          question: "HBM, 늦었지만 따라잡을까?",
          bulls: [
            { title: "생산 능력(CAPA) 우위", items: ["압도적인 설비 투자와 양산 능력", "수율 개선 속도"] },
            { title: "종합 반도체 시너지", items: ["메모리+파운드리+패키징 일괄 수주 가능"] }
          ],
          bears: [
            { title: "기술 격차 지속", items: ["하이닉스와의 기술 격차 좁히기 난항", "발열/전력 이슈"] },
            { title: "파운드리 적자", items: ["TSMC와의 점유율 격차 확대", "수율 문제"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "삼성전자는 위기 때마다 초격차 기술로 살아남았습니다. 이번 AI 파도에서도 결국 승자가 될 것이라 믿으십니까?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "삼성의 저력을 믿는다. 지금이 가장 쌀 때." },
            { label: "No (Watch)", value: "Watch", desc: "HBM 납품 확정 뉴스를 보고 들어가도 늦지 않다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[신규 사업]",
        question: "HBM3E, 엔비디아 뚫을 수 있나?",
        context: "현재 HBM 시장은 SK하이닉스가 독주하고 있습니다.\n\n삼성전자가 차세대 HBM(HBM3E)을 엔비디아에 납품하는 데 성공한다면, 주가는 단숨에 **재평가**받을 것입니다. 삼성이 기술적 결함을 해결하고 **퀄 테스트**를 통과할 수 있을까요?",
        options: [
          { label: "통과/납품", side: "Bull", implications: "주가 급등 트리거" },
          { label: "지연/실패", side: "Bear", implications: "실망 매물 출회" }
        ]
      },
      {
        id: 2,
        title: "[기존 사업]",
        question: "파운드리, TSMC 추격 가능한가?",
        context: "비메모리 반도체를 만들어주는 파운드리 사업에서 TSMC와의 격차가 좁혀지지 않고 있습니다.\n\n삼성이 수율 문제를 해결하고 빅테크 고객사를 확보하여 파운드리에서 **유의미한 이익**을 낼 수 있을까요?",
        options: [
          { label: "추격 가능", side: "Bull", implications: "밸류에이션 리레이팅" },
          { label: "격차 지속", side: "Bear", implications: "만년 2등 고착화" }
        ]
      },
      {
        id: 3,
        title: "[조직 문화]",
        question: "초격차 DNA, 살아있나?",
        context: "과거의 삼성은 남들이 따라올 수 없는 기술 격차(초격차)로 시장을 지배했습니다. 하지만 최근에는 기술 리더십을 잃었다는 비판이 나옵니다.\n\n삼성의 조직 문화가 다시 **혁신**을 만들어낼 수 있을 만큼 역동적인가요?",
        options: [
          { label: "살아있다", side: "Bull", implications: "위기 극복" },
          { label: "관료화됨", side: "Bear", implications: "경쟁력 약화" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-005930-1',
        type: 'Issue',
        status: 'Active',
        title: 'HBM3E 엔비디아 퀄 테스트 통과 임박설',
        date: 'Today',
        impact: 'High',
        relatedWatchpointId: 1,
        factCheck: {
          status: 'Pending',
          actualValue: '최종 단계 진입',
          description: '엔비디아의 품질 테스트를 통과하기 직전이라는 루머가 돌고 있습니다.'
        },
        marketReaction: {
          priceChange: '+3.5%',
          volumeChange: 'High Volume',
          comment: '외국인 매수세가 강하게 유입되며 기대감을 반영하고 있습니다.'
        },
        analysis: {
          cause: '발열 및 전력 소모 문제가 해결되었다는 소식이 전해졌습니다.',
          implication: '납품 성공 시 SK하이닉스와의 밸류에이션 격차 축소가 예상됩니다.'
        },
        pros: [
          'HBM 공급 부족 해소의 유일한 대안은 삼성전자',
          '파운드리 턴어라운드와 맞물려 실적 퀀텀 점프 가능'
        ],
        cons: [
          '아직 확정된 것은 아님 (희망 고문 가능성)',
          '수율이 낮아 초기 이익 기여도는 낮을 수 있음'
        ],
        scenarios: [
          { label: '적극 매수', action: 'buy', rationale: '지금이 가장 쌀 때입니다. 퀄 통과 뉴스가 나오면 늦습니다.' },
          { label: '분할 매수', action: 'buy', rationale: '확실한 뉴스가 나올 때까지 조금씩 모아갑니다.' },
          { label: '관망', action: 'hold', rationale: '과거에도 루머에 속았습니다. 오피셜을 기다립니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [78000, 78200, 78300, 78400, 78500],
      '1W': [77000, 77500, 78000, 78200, 78500],
      '1M': [75000, 76000, 77000, 78000, 78500],
      '3M': [72000, 74000, 76000, 77000, 78500],
      '1Y': [65000, 70000, 75000, 78000, 78500],
      '5Y': [50000, 80000, 60000, 70000, 78500]
    },
    chartNarratives: {
      '1D': '외국인 매수세 유입으로 강보합 마감했습니다.',
      '1W': 'HBM 공급 기대감으로 주간 상승세를 기록했습니다.',
      '1M': '반도체 업황 턴어라운드 신호에 7만전자를 안착했습니다.',
      '3M': '감산 효과 가시화로 이익 전망치가 상향되고 있습니다.',
      '1Y': '긴 박스권을 돌파하고 추세적 상승을 시도 중입니다.',
      '5Y': '메모리 사이클 회복과 함께 주가 레벨업이 기대됩니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: '삼성전자, 엔비디아 HBM3E 퀄 테스트 통과 임박',
        date: '2025.11.29',
        analystComment: '주가 상승의 가장 큰 트리거가 될 것입니다.'
      },
      {
        type: 'Neutral',
        text: '파운드리 적자 축소, 수율 개선 확인',
        date: '2025.11.26',
        analystComment: '비메모리 부문의 턴어라운드 가능성이 보입니다.'
      },
      {
        type: 'Negative',
        text: '노조 창사 첫 파업 선언, 생산 차질 우려',
        date: '2025.11.23',
        analystComment: '단기적인 심리적 악재로 작용할 수 있습니다.'
      }
    ]
  },
  {
    ticker: "000660",
    name: "SK하이닉스",
    currentPrice: 178000,
    changeRate: 2.5,
    companyProfile: {
      summary: "HBM 시장의 지배자",
      description: "메모리 반도체 2위 기업이지만, AI용 고성능 메모리(HBM)에서는 세계 1위 기술력을 자랑합니다."
    },
    chartContext: "HBM 독점 공급 수혜로 주가가 급등했으며, 신고가 랠리를 이어가고 있습니다.",
    narrative: {
      question: "SK하이닉스, '만년 2등'에서 'AI 메모리 1등'으로 굳히기?",
      steps: {
        history: {
          title: "Why Now?",
          content: "SK하이닉스는 엔비디아에 HBM을 사실상 독점 공급하며 AI 반도체 수혜를 가장 직접적으로 받고 있습니다. 과거에는 삼성전자의 그늘에 가려져 있었지만, 지금은 기술력으로 삼성을 앞서고 있다는 평가까지 받습니다. 이 '기술 우위'가 구조적인 1등으로 굳어질지 지켜봐야 합니다."
        },
        floor: {
          title: "The Floor",
          content: "엔비디아와의 끈끈한 파트너십이 가장 큰 자산입니다. AI 칩을 만들 때 하이닉스의 HBM이 표준처럼 쓰이고 있어, 당분간은 대체 불가능한 지위를 누릴 것입니다. 메모리 감산 효과로 인한 D램 가격 상승도 실적을 받쳐줍니다."
        },
        upside: {
          title: "The Upside",
          content: "HBM 시장은 이제 개화기입니다. AI 서버 투자가 늘어날수록 HBM 수요는 폭증할 것이고, 하이닉스는 여기서 가장 큰 이익을 가져갈 것입니다. 만약 차세대 HBM4에서도 기술 리더십을 유지한다면, 하이닉스는 '메모리계의 엔비디아'가 될 수도 있습니다."
        },
        debate: {
          title: "Debate",
          question: "삼성의 반격, 버틸 수 있나?",
          bulls: [
            { title: "기술 초격차", items: ["MR-MUF 공정의 우수성", "수율 안정화 노하우"] },
            { title: "파트너십", items: ["엔비디아/TSMC와의 견고한 동맹"] }
          ],
          bears: [
            { title: "공급 과잉 우려", items: ["삼성/마이크론의 공격적 증설", "HBM 가격 하락 가능성"] },
            { title: "단일 의존도", items: ["메모리에만 집중된 포트폴리오", "반도체 사이클 타격 취약"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "기술의 하이닉스라는 말이 현실이 되었습니다. 삼성의 추격을 따돌리고 HBM 왕좌를 계속 지킬 수 있을까요?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "기술 격차는 쉽게 좁혀지지 않는다. 1등을 산다." },
            { label: "No (Watch)", value: "Watch", desc: "삼성의 물량 공세가 시작되면 이익률이 꺾일 수 있다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[기술 경쟁력]",
        question: "MR-MUF 공정, 삼성도 못 따라하나?",
        context: "하이닉스는 독자적인 패키징 기술(MR-MUF)로 발열 문제를 해결하고 수율을 잡았습니다.\n\n이 기술이 경쟁사들이 쉽게 모방할 수 없는 하이닉스만의 **'해자'**라고 보십니까?",
        options: [
          { label: "강력한 해자", side: "Bull", implications: "기술 독점 지속" },
          { label: "따라잡힘", side: "Bear", implications: "경쟁 심화" }
        ]
      },
      {
        id: 2,
        title: "[시장 상황]",
        question: "HBM 공급 과잉, 언제 올까?",
        context: "너도나도 HBM을 만들겠다고 공장을 짓고 있습니다. 1~2년 뒤에 공급이 쏟아져 나오면 HBM 가격이 폭락할 수도 있습니다.\n\n하이닉스가 **프리미엄 가격**을 계속 받을 수 있을까요?",
        options: [
          { label: "공급 부족 지속", side: "Bull", implications: "고마진 유지" },
          { label: "공급 과잉 전환", side: "Bear", implications: "이익률 하락" }
        ]
      },
      {
        id: 3,
        title: "[재무 건전성]",
        question: "설비 투자금, 감당 가능한가?",
        context: "HBM 공장을 짓는 데는 천문학적인 돈이 듭니다. 하이닉스는 삼성보다 현금 동원력이 약합니다.\n\n공격적인 투자를 하면서도 **재무적으로 흔들리지 않을 수** 있을까요?",
        options: [
          { label: "감당 가능", side: "Bull", implications: "선순환 구조" },
          { label: "재무 부담", side: "Bear", implications: "유상증자 등 우려" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-000660-1',
        type: 'Product Launch',
        status: 'Upcoming',
        title: '차세대 HBM4 로드맵 발표',
        date: 'D-3',
        impact: 'Medium',
        relatedWatchpointId: 1,
        factCheck: {
          status: 'Pending',
          actualValue: '발표 대기',
          description: 'TSMC와의 협력을 통한 HBM4 개발 계획을 구체화할 예정입니다.'
        },
        marketReaction: {
          priceChange: '+1.5%',
          volumeChange: 'Steady',
          comment: '기술 리더십 유지에 대한 기대감이 주가에 반영되고 있습니다.'
        },
        analysis: {
          cause: '삼성전자의 추격을 뿌리치기 위해 기술 격차를 더 벌리려는 전략입니다.',
          implication: 'HBM4에서도 주도권을 잡는다면 독주 체제는 당분간 지속될 것입니다.'
        },
        pros: [
          'TSMC와의 동맹 강화로 패키징 기술 우위 지속',
          '고객 맞춤형 HBM 시장 선점'
        ],
        cons: [
          '기술 난이도 증가로 인한 개발 지연 리스크',
          '경쟁사들의 연합 전선 구축'
        ],
        scenarios: [
          { label: '보유 (Hold)', action: 'hold', rationale: '1등 기업은 계속 가져갑니다.' },
          { label: '추가 매수', action: 'buy', rationale: '기술 격차 확인 시 비중을 늘립니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [177000, 177500, 178000, 178500, 178000],
      '1W': [175000, 176000, 177000, 177500, 178000],
      '1M': [170000, 172000, 175000, 176000, 178000],
      '3M': [150000, 160000, 170000, 175000, 178000],
      '1Y': [100000, 120000, 150000, 170000, 178000],
      '5Y': [80000, 100000, 130000, 150000, 178000]
    },
    chartNarratives: {
      '1D': '기관 매수세가 유입되며 견조한 흐름입니다.',
      '1W': 'HBM 리더십이 부각되며 상승 추세를 이어가고 있습니다.',
      '1M': '엔비디아 실적 호조에 동조하며 신고가 랠리 중입니다.',
      '3M': '메모리 업황 개선 기대감으로 외국인 수급이 집중되었습니다.',
      '1Y': 'AI 반도체 최대 수혜주로 재평가받고 있습니다.',
      '5Y': '구조적 성장기에 진입하며 주가 레벨이 한 단계 높아졌습니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: 'SK하이닉스, HBM4 개발 로드맵 앞당긴다',
        date: '2025.11.30',
        analystComment: '기술 격차를 유지하겠다는 강력한 의지입니다.'
      },
      {
        type: 'Positive',
        text: '엔비디아 CEO, "SK하이닉스는 최고의 파트너"',
        date: '2025.11.28',
        analystComment: '파트너십이 여전히 공고함을 확인시켜 주었습니다.'
      },
      {
        type: 'Neutral',
        text: 'D램 가격 상승세 지속, 4분기 실적 기대',
        date: '2025.11.25',
        analystComment: '본업인 레거시 메모리에서도 이익 개선이 예상됩니다.'
      }
    ]
  },
  {
    ticker: "AMZN",
    name: "아마존",
    currentPrice: 185.0,
    changeRate: 1.5,
    companyProfile: {
      summary: "이커머스와 클라우드의 제왕",
      description: "세계 최대 전자상거래 업체이자, 클라우드(AWS) 시장 점유율 1위 기업입니다."
    },
    chartContext: "물류 비용 절감으로 이익이 급증하며 주가가 상승세입니다. AWS의 AI 성장성이 관건입니다.",
    narrative: {
      question: "아마존, '비용 절감'을 넘어 'AI 성장'을 보여줄 수 있을까?",
      steps: {
        history: {
          title: "Why Now?",
          content: "아마존은 코로나 이후 과잉 투자 후유증을 겪었지만, 뼈를 깎는 구조조정과 물류 효율화로 수익성을 회복했습니다. 이제 시장의 관심은 '얼마나 아꼈냐'에서 'AWS가 AI 붐을 타고 다시 고성장할 수 있느냐'로 이동했습니다. MS(Azure)와의 클라우드 전쟁에서 승기를 잡아야 할 때입니다."
        },
        floor: {
          title: "The Floor",
          content: "아마존의 이커머스는 '미국인의 생활 인프라'입니다. 프라임 멤버십의 락인 효과는 강력하며, 광고 사업이 새로운 캐시카우로 급부상하고 있습니다. 물류 효율화로 인해 본업인 쇼핑에서도 이익이 나기 시작했다는 점이 긍정적입니다."
        },
        upside: {
          title: "The Upside",
          content: "AWS는 클라우드 1등이지만, AI 분야에서는 MS에 밀린다는 인식이 있었습니다. 아마존은 자체 AI 칩(Trainium, Inferentia)과 베드락(Bedrock) 플랫폼으로 반격을 준비 중입니다. AWS 고객들이 AI를 쓰기 위해 아마존을 떠나지 않고 더 많은 돈을 쓰게 만든다면, 실적은 퀀텀 점프할 것입니다."
        },
        debate: {
          title: "Debate",
          question: "AWS vs Azure, AI 클라우드 승자는?",
          bulls: [
            { title: "생태계의 힘", items: ["가장 많은 스타트업/기업 고객 보유", "다양한 AI 모델 선택권 제공"] },
            { title: "자체 칩 효율성", items: ["엔비디아 의존도 낮춤", "고객에게 저렴한 AI 옵션 제공"] }
          ],
          bears: [
            { title: "MS의 선공", items: ["OpenAI 독점 파트너십 효과", "기업용 AI 시장 선점"] },
            { title: "성장률 둔화", items: ["AWS 성장률이 Azure보다 낮음", "점유율 하락 추세"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "아마존은 물류 혁신으로 이커머스를 제패했습니다. 이제 AI로 클라우드 왕좌를 지키려 합니다. 제프 베조스의 'Day 1' 정신이 여전히 유효하다고 보십니까?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "클라우드 1등의 저력은 무섭다. 수익성 개선과 성장을 동시에." },
            { label: "No (Watch)", value: "Watch", desc: "AI 경쟁력이 아직 의문이다. AWS 성장률 반등을 확인하고 싶다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[신규 사업]",
        question: "AWS 성장률, 다시 가속화될까?",
        context: "클라우드 시장이 성숙기에 접어들었다는 우려가 있습니다.\n\nAI 수요가 AWS의 성장률을 다시 **두 자릿수 후반**으로 끌어올릴 수 있을까요? 아니면 MS에게 점유율을 계속 뺏길까요?",
        options: [
          { label: "재가속", side: "Bull", implications: "주가 상승 동력" },
          { label: "둔화 지속", side: "Bear", implications: "성장주 매력 감소" }
        ]
      },
      {
        id: 2,
        title: "[기존 사업]",
        question: "이커머스 마진, 더 짜낼 수 있나?",
        context: "아마존은 로봇 도입과 지역 거점 배송으로 물류 비용을 많이 줄였습니다.\n\n여기서 마진을 **더 높일 여지**가 남아있을까요? 아니면 이제 쥐어짤 만큼 다 짠 걸까요?",
        options: [
          { label: "개선 여지 있음", side: "Bull", implications: "이익 서프라이즈" },
          { label: "한계 도달", side: "Bear", implications: "이익 모멘텀 둔화" }
        ]
      },
      {
        id: 3,
        title: "[경쟁 상황]",
        question: "테무/쉬인, 아마존의 위협인가?",
        context: "중국 커머스 앱(테무, 쉬인)이 초저가를 무기로 미국 시장을 공략하고 있습니다.\n\n아마존의 **'빠른 배송'**과 **'신뢰'**가 이들의 '초저가' 공세를 막아낼 수 있을까요?",
        options: [
          { label: "방어 가능", side: "Bull", implications: "해자 입증" },
          { label: "점유율 잠식", side: "Bear", implications: "매출 타격" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-amzn-1',
        type: 'Report',
        status: 'Active',
        title: 'AWS AI 인프라 투자 대폭 확대',
        date: 'Today',
        impact: 'High',
        relatedWatchpointId: 1,
        factCheck: {
          status: 'Pass',
          actualValue: 'CapEx 50% 증액',
          description: 'AI 데이터센터 구축을 위해 자본 지출을 대폭 늘리겠다고 발표했습니다.'
        },
        marketReaction: {
          priceChange: '-2.1%',
          volumeChange: 'Selling Pressure',
          comment: '단기 이익률 훼손 우려로 매물이 출회되고 있습니다.'
        },
        analysis: {
          cause: 'MS, 구글과의 AI 클라우드 경쟁에서 밀리지 않기 위한 승부수입니다.',
          implication: '단기적으로는 비용 부담이 크지만, 장기 성장을 위한 필수 투자입니다.'
        },
        pros: [
          '압도적인 클라우드 점유율을 바탕으로 AI 수익화 가속',
          '자체 칩 도입으로 장기적인 비용 효율화 가능'
        ],
        cons: [
          '이익률 가이던스 하향 조정 가능성',
          '경기 침체 시 과잉 투자 리스크'
        ],
        scenarios: [
          { label: '저가 매수', action: 'buy', rationale: '미래를 위한 투자는 호재입니다. 조정 시 매수합니다.' },
          { label: '관망', action: 'hold', rationale: '이익률이 얼마나 훼손될지 확인이 필요합니다.' },
          { label: '비중 축소', action: 'sell', rationale: '당분간 주가 상승 여력이 제한적입니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [184, 184.5, 185, 185.5, 185.0],
      '1W': [182, 183, 184, 184.5, 185.0],
      '1M': [175, 178, 180, 182, 185.0],
      '3M': [160, 170, 175, 180, 185.0],
      '1Y': [130, 150, 160, 170, 185.0],
      '5Y': [100, 150, 100, 130, 185.0]
    },
    chartNarratives: {
      '1D': '장 초반 약세였으나 저가 매수세 유입으로 반등했습니다.',
      '1W': 'AWS 실적 기대감으로 주간 상승세를 유지했습니다.',
      '1M': '물류 비용 절감 효과가 지속되며 우상향 중입니다.',
      '3M': 'AI 투자 확대 발표 이후 변동성이 확대되었습니다.',
      '1Y': '이익률 개선이 가시화되며 주가가 레벨업되었습니다.',
      '5Y': '긴 횡보를 끝내고 다시 성장주로서의 면모를 보여주고 있습니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: '아마존, 생성형 AI 스타트업에 추가 투자',
        date: '2025.11.29',
        analystComment: 'AI 생태계 확장을 위한 공격적인 행보입니다.'
      },
      {
        type: 'Positive',
        text: 'AWS 매출 성장률 15% 회복 전망',
        date: '2025.11.26',
        analystComment: '클라우드 시장의 재성장이 기대됩니다.'
      },
      {
        type: 'Negative',
        text: 'FTC, 아마존 반독점 소송 준비',
        date: '2025.11.22',
        analystComment: '규제 리스크가 다시 부각될 수 있습니다.'
      }
    ]
  },
  {
    ticker: "AMD",
    name: "AMD",
    currentPrice: 160.5,
    changeRate: 4.1,
    companyProfile: {
      summary: "엔비디아의 유일한 대항마",
      description: "CPU 시장에서 인텔을 위협하고, GPU 시장에서 엔비디아를 추격하는 2인자 전략의 귀재입니다."
    },
    chartContext: "AI 칩 MI300 출시 기대감으로 올랐으나, 엔비디아와의 격차 확인 후 조정을 받고 있습니다.",
    narrative: {
      question: "AMD, '영원한 2인자'인가 '가성비의 구원자'인가?",
      steps: {
        history: {
          title: "Why Now?",
          content: "엔비디아 칩은 너무 비싸고 구하기도 힘듭니다. 시장은 간절하게 '쓸만한 대안'을 찾고 있습니다. AMD가 내놓은 AI 칩 'MI300'이 그 대안이 될 수 있을지 검증받는 시기입니다. 만약 빅테크들이 AMD 칩을 대거 채택한다면, AMD는 또 한 번의 '리사 수 매직'을 보여줄 수 있습니다."
        },
        floor: {
          title: "The Floor",
          content: "AMD는 데이터센터 CPU 시장에서 인텔의 점유율을 꾸준히 뺏어오고 있습니다(EPYC 프로세서). 이 CPU 사업이 든든한 현금 창출원 역할을 합니다. 또한 엑스박스, 플레이스테이션에 들어가는 칩도 AMD가 만듭니다. 망할 회사가 아니라는 점은 확실합니다."
        },
        upside: {
          title: "The Upside",
          content: "엔비디아가 독점한 AI 칩 시장의 10%만 가져와도 AMD의 매출은 폭증합니다. 소프트웨어(ROCm) 호환성 문제만 해결된다면, 가격 경쟁력을 무기로 엔비디아의 독주를 견제할 강력한 2인자가 될 수 있습니다."
        },
        debate: {
          title: "Debate",
          question: "소프트웨어 격차, 극복 가능한가?",
          bulls: [
            { title: "오픈소스 전략", items: ["개발자 커뮤니티 지원 강화", "ROCm 생태계 확장"] },
            { title: "가성비 수요", items: ["추론 영역에서는 가성비가 중요", "메타/MS의 지원 사격"] }
          ],
          bears: [
            { title: "CUDA의 벽", items: ["엔비디아 생태계를 떠나기 싫어하는 개발자들", "최적화 부족"] },
            { title: "다음 세대 경쟁", items: ["엔비디아의 신제품 주기가 너무 빠름", "기술 격차 유지"] }
          ]
        },
        final: {
          title: "Final Bet",
          content: "시장은 독점을 싫어합니다. 엔비디아의 독주를 막을 유일한 대항마, AMD에게 기회를 주시겠습니까?",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "2등만 해도 대박이다. 가성비 전략은 통한다." },
            { label: "No (Watch)", value: "Watch", desc: "소프트웨어가 아직 부족하다. 실제 수주 실적을 보고 싶다." }
          ]
        }
      }
    },
    watchpoints: [
      {
        id: 1,
        title: "[제품 경쟁력]",
        question: "MI300, 엔비디아 H100만큼 쓸만한가?",
        context: "AMD는 자사 칩이 엔비디아보다 가성비가 좋다고 주장합니다. 하지만 실제 현장에서 개발자들이 써봤을 때도 '이 정도면 쓸만하다'는 평가가 나와야 합니다.\n\n성능 벤치마크가 아닌, **실제 고객들의 후기**가 긍정적일까요?",
        options: [
          { label: "쓸만하다", side: "Bull", implications: "점유율 확대" },
          { label: "아직 멀었다", side: "Bear", implications: "기대감 소멸" }
        ]
      },
      {
        id: 2,
        title: "[소프트웨어]",
        question: "ROCm, 개발자들이 쓰기 편해졌나?",
        context: "하드웨어가 좋아도 소프트웨어가 불편하면 개발자들은 쓰지 않습니다.\n\nAMD의 소프트웨어 플랫폼(ROCm)이 엔비디아(CUDA)만큼 **쓰기 편해질 수** 있을까요? 버그 없이 잘 돌아갈까요?",
        options: [
          { label: "개선됨", side: "Bull", implications: "생태계 확장" },
          { label: "여전히 불편", side: "Bear", implications: "하드웨어 판매 제약" }
        ]
      },
      {
        id: 3,
        title: "[시장 점유율]",
        question: "AI 칩 점유율 10%, 달성 가능한가?",
        context: "AMD의 목표는 AI 칩 시장의 의미 있는 2인자가 되는 것입니다. 점유율 10%만 달성해도 주가는 크게 오를 수 있습니다. 빅테크 기업들이 엔비디아 견제용으로 AMD를 키워줄까요?",
        options: [
          { label: "달성 가능", side: "Bull", implications: "강력한 주가 상승" },
          { label: "실패", side: "Bear", implications: "만년 유망주" }
        ]
      }
    ],
    events: [
      {
        id: 'evt-amd-1',
        type: 'Issue',
        status: 'Active',
        title: 'MI300 벤치마크 성능 유출',
        date: 'Yesterday',
        impact: 'High',
        relatedWatchpointId: 1,
        factCheck: {
          status: 'Pass',
          actualValue: 'H100 대비 90% 성능',
          description: '유출된 벤치마크 결과, 엔비디아 주력 칩 대비 가성비가 뛰어난 것으로 확인되었습니다.'
        },
        marketReaction: {
          priceChange: '+4.8%',
          volumeChange: 'Strong Buying',
          comment: '예상보다 뛰어난 성능에 저가 매수세가 몰리고 있습니다.'
        },
        analysis: {
          cause: '소프트웨어 최적화가 빠르게 진행되면서 하드웨어 성능을 제대로 끌어내기 시작했습니다.',
          implication: '엔비디아의 독점 체제에 균열을 낼 수 있는 강력한 대안임이 증명되었습니다.'
        },
        pros: [
          '가격 대비 성능(가성비) 우위 확인',
          '메타, MS 등 주요 고객사들의 채택 확대 기대'
        ],
        cons: [
          '여전히 부족한 소프트웨어 생태계 (CUDA 대비)',
          '엔비디아의 차세대 칩(Blackwell) 출시 임박'
        ],
        scenarios: [
          { label: '추격 매수', action: 'buy', rationale: '2등 전략이 통하고 있습니다. 상승 여력이 큽니다.' },
          { label: '보유 (Hold)', action: 'hold', rationale: '실제 매출로 이어지는지 확인해야 합니다.' },
          { label: '차익 실현', action: 'sell', rationale: '단기 급등에 따른 차익 실현 매물을 주의해야 합니다.' }
        ]
      }
    ],
    availableLogicBlocks: [],
    chartHistory: {
      '1D': [158, 159, 160, 161, 160.5],
      '1W': [155, 157, 158, 160, 160.5],
      '1M': [150, 152, 155, 158, 160.5],
      '3M': [140, 145, 150, 155, 160.5],
      '1Y': [100, 120, 140, 150, 160.5],
      '5Y': [50, 80, 100, 140, 160.5]
    },
    chartNarratives: {
      '1D': 'MI300 성능 유출 소식에 장중 강세를 보였습니다.',
      '1W': '엔비디아 대항마로서의 입지가 강화되며 상승 중입니다.',
      '1M': '저평가 매력이 부각되며 기관 수급이 유입되었습니다.',
      '3M': 'AI 칩 시장 점유율 확대 기대감으로 반등했습니다.',
      '1Y': 'CPU와 GPU 양 날개로 실적 성장이 가시화되고 있습니다.',
      '5Y': '리사 수 CEO의 리더십 아래 구조적 턴어라운드에 성공했습니다.'
    },
    newsTags: [
      {
        type: 'Positive',
        text: 'AMD, 삼성전자에 AI 칩 공급 논의',
        date: '2025.11.29',
        analystComment: '대형 고객사 확보 가능성이 높아졌습니다.'
      },
      {
        type: 'Neutral',
        text: '인텔, 파운드리 분사 결정... AMD 반사이익?',
        date: '2025.11.26',
        analystComment: '경쟁사의 혼란은 AMD에게 기회가 될 수 있습니다.'
      },
      {
        type: 'Negative',
        text: 'PC 수요 회복 지연, CPU 매출 우려',
        date: '2025.11.23',
        analystComment: 'AI 외 부문의 실적 둔화 가능성이 있습니다.'
      }
    ]
  }
];

export const pendingNarrative = {
  question: "아직 분석되지 않은 종목입니다.",
  steps: {
    history: { title: "Why Now?", content: "데이터 부족" },
    floor: { title: "The Floor", content: "데이터 부족" },
    upside: { title: "The Upside", content: "데이터 부족" },
    debate: { title: "Debate", question: "데이터 부족", bulls: [], bears: [] },
    final: { title: "Final Bet", content: "데이터 부족", options: [] }
  }
};

export const getInitialData = () => {
  return {
    user: {
      name: 'Guest',
      profileMsg: '투자의 본질을 꿰뚫다',
      totalWinRate: 0,
      totalAssetValue: 0,
      totalProfitValue: 0,
      totalProfitRate: 0,
      holdings: {
        domestic: [],
        overseas: []
      }
    },
    marketWeather: {
      status: 'Sunny',
      summaryTitle: '시장 맑음',
      summaryBody: '전반적으로 상승세입니다.',
      indices: []
    },
    summaryHighlights: [],
    hotIssues: [],
    myThesis: [],
    discovery: {
      trendingLogics: [],
      searchResultSample: ALL_STOCKS[0],
      recentSearches: [],
      searchResults: []
    },
    notifications: []
  };
};