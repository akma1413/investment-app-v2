import { SearchResultSample, AppData, NarrativeProfile } from '../types';
import { generateChartData } from '../utils/chartUtils';

// Helper for placeholder narrative (Updated to new structure)
const pendingNarrative: NarrativeProfile = {
  question: "데이터 업데이트 대기 중...",
  steps: {
    history: { title: "분석 중", content: "데이터를 수집하고 있습니다." },
    floor: { title: "분석 중", content: "데이터를 수집하고 있습니다." },
    upside: { title: "분석 중", content: "데이터를 수집하고 있습니다." },
    debate: {
      title: "분석 중",
      question: "데이터 부족",
      bulls: [],
      bears: []
    },
    final: {
      title: "분석 중",
      content: "잠시만 기다려주세요.",
      options: []
    }
  }
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
      question: "JYP의 K-POP 시스템 수출이 성공하여 글로벌 플랫폼 기업으로 재평가받을 수 있을까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**과거의 상승 (2020~2023):** 스트레이키즈(Stray Kids)와 트와이스가 북미 시장에서 대성공을 거두며 'K-POP의 글로벌 확장'을 증명했습니다. 이 시기 주가는 실적 성장과 함께 우상향했습니다.\n\n**최근의 하락/정체 (2024~):** \"더 이상 앨범이 예전만큼 안 팔린다\"는 **'피크아웃(Peak-out)' 공포**가 지배하며 고점 대비 주가가 조정받았습니다. 시장은 지금 '단순한 히트곡' 그 이상의 새로운 성장 동력을 요구하고 있습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"기존 IP의 현금 창출력은 의심하지 않는다\"**\n\n* 스트레이키즈는 여전히 빌보드 200 차트 1위를 기록하고 있고, 트와이스의 스타디움 투어는 매진 행렬입니다.\n* 이들의 활동만으로도 연간 영업이익 OOOO억 원 수준은 방어 가능하다는 것이 증권가 리포트들의 공통된 의견(Consensus)입니다. 현재 주가는 딱 이 정도의 '안정적인 수익'만을 반영하고 있습니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"수출(Export)을 넘어선 현지화(Localization)\"**\n\n* 기존 K-POP 시스템(한국인 멤버+한국 트레이닝)은 멤버들의 물리적 제약과 활동 수명에 한계가 있습니다.\n* 시장이 기다리는 다음 스텝은 **\"JYP의 아이돌 육성 시스템만 현지에 이식해(시스템 수출), 현지인으로 구성된 그룹을 성공시키는 것\"**입니다. 이것이 성공하면 마진율이 획기적으로 개선되고 확장성이 무한대가 되기 때문입니다.\n* 따라서 현재 주가가 전고점을 뚫고 가려면, 미국 현지 걸그룹 **'VCHA'**나 일본의 **'NiziU(니쥬)'** 이후 프로젝트들이 단순한 화제성을 넘어 **'현지 주류 시장 안착'**이라는 숫자를 보여줘야 합니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "과연 K-POP 없는 K-POP 그룹이 서구권에서 통할까?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[데이터]** 일본 현지화 그룹 'NiziU'는 이미 돔 투어를 돌 정도로 일본 시장 내 매출 기여도가 큽니다. 시스템의 유효성은 아시아권에서 입증되었습니다.", "**[오피니언]** 유니버설 뮤직(Republic Records)과의 파트너십이 공고하여, 미국 라디오/방송 프로모션 파워는 역대 K-POP 기획사 중 가장 강력합니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[데이터]** 'VCHA'의 데뷔 후 스포티파이 스트리밍 추이와 유튜브 조회수가 기존 스트레이키즈나 동세대의 뉴진스 등에 비해 저조합니다.", "**[리스크]** \"한국인이 없는 K-POP은 그냥 팝(Pop) 아닌가?\"라는 정체성 논란이 있습니다. 현지 팬덤 코어가 강력하게 결집하지 못할 수 있다는 우려가 존재합니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 지금 \"기존 가수들은 잘하겠지만, 새로운 현지화 프로젝트는 아직 못 믿겠다\"는 상태입니다.\n\n**당신은 JYP의 '아이돌 육성 시스템'이 인종과 국가를 초월해 적용 가능한 '표준 공정'이라고 생각하시나요?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "만약 VCHA 혹은 차기 현지 그룹이 빌보드 HOT 100에 진입한다면, JYP는 단순 엔터사가 아닌 '플랫폼 기업'으로 재평가받아 주가는 크게 오를 것입니다." },
            { label: "No (Watch)", value: "Watch", desc: "K-POP의 인기가 '한국인 멤버들의 매력'에 기반한다고 본다면, 지금은 성장 한계에 봉착한 상태일 수 있습니다." }
          ]
        }
      }
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
    availableLogicBlocks: [],
    events: [
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
    ticker: "PLTR",
    name: "팔란티어",
    currentPrice: 24.5,
    changeRate: 3.2,
    companyProfile: {
      summary: "데이터 통합 및 AI 분석 플랫폼 기업",
      description: "정부 기관용 '고담'과 민간 기업용 '파운드리'를 통해 데이터 기반 의사결정을 지원합니다. 최근 AI 플랫폼 'AIP'로 급성장 중입니다."
    },
    chartContext: "AIP 출시 후 실적 호조로 급등세를 보이고 있습니다.",
    narrative: {
      question: "팔란티어는 단순한 방산 기업인가, 아니면 전 산업의 AI 운영체제(OS)가 될 것인가?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"은둔의 방산 기업에서 AI 대장주로의 변신\"**\n\n* 상장 초기 팔란티어는 'CIA가 쓰는 비밀스러운 소프트웨어 회사'라는 이미지가 강했습니다. 성장성은 좋지만 민간 기업 확장이 더디다는 평가를 받았습니다.\n* 하지만 2023년, AI 플랫폼 **'AIP(Artificial Intelligence Platform)'**를 출시하며 상황이 반전되었습니다. 기업 시장(B2B) 매출이 급증하기 시작했고, 시장은 팔란티어를 '단순 방산주'가 아닌 **'확장 가능한 AI 소프트웨어 기업'**으로 재평가하기 시작했습니다.\n\n**AIP가 주목받는 이유 (The Problem & Solution):**\n* **[문제]** 대기업들의 데이터는 엉망으로 흩어져 있습니다. 생산은 ERP에, 영업은 세일즈포스에, 재고는 엑셀에 따로 놀아 중요한 의사결정에 데이터를 못 씁니다(Data Silo).\n* **[해결]** AIP는 이 흩어진 데이터들을 강제로 통합합니다. 그리고 AI에게 **\"원자재 가격이 올랐으니, 마진율 방어를 위해 생산 일정을 최적화해\"**라고 명령하면, 연결된 시스템을 실제로 가동해 결과를 만들어냅니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"국방/정보 분야에서의 입지는 대체 불가능하다\"**\n\n* **[합의된 사실]** 시장은 팔란티어가 미국 국방부와 동맹국의 안보 시스템에서 이미 **'독점적 지위'**를 굳혔다고 봅니다.\n* **[부연 설명]** 팔란티어의 국방용 소프트웨어 '고담(Gotham)'은 전쟁터의 수만 가지 데이터를 통합해 지휘관에게 보여줍니다. 이는 미 정부의 핵심 인프라로 자리 잡았으며, 이 **정부 매출(Cash Cow)은 경기 침체와 무관하게 매년 성장**하며 주가의 단단한 바닥을 지지해 줍니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"전쟁/방산을 넘어, 민간 산업계에서도 '필수재'임을 증명할 수 있는가?\"**\n\n* 현재의 높은 주가(고평가)가 정당화되려면, 팔란티어의 기술이 특수한 전쟁터뿐만 아니라 **제조, 에너지, 물류, 금융 등 일반 산업 현장에서도 대체 불가능한 필수품**이 되어야 합니다.\n* **[관전 포인트]** 기업들이 단순히 엑셀이나 BI(시각화) 도구를 쓰는 것을 넘어, 비싼 돈을 주고서라도 팔란티어의 '운영 시스템(Foundry/AIP)'을 도입할 만큼 **압도적인 효율성**을 느끼느냐가 핵심입니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "팔란티어는 확장 가능한 소프트웨어(SaaS)인가, 비싼 구축형 컨설팅인가?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[데이터 - 고객사 수]** AIP 출시 이후 미국 상업 부문(Commercial) 고객 수가 전년 대비 40~50%씩 폭증하고 있습니다. 이는 특정 산업에만 국한되지 않고 범용적으로 먹혀들고 있다는 증거입니다.", "**[사례]** 파나소닉(배터리 공장), BP(에너지) 등 제조업 기반의 거대 기업들이 팔란티어 도입 후 생산성이 두 자릿수 이상 개선되었다는 구체적인 ROI를 발표하고 있습니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[경쟁 심화]** '데이터브릭스'나 '스노우플레이크' 같은 데이터 플랫폼 기업들도 AI 기능을 강화하고 있습니다. 기업들이 굳이 가장 비싸고 무거운 팔란티어를 선택할지 의문입니다.", "**[확장성 의문]** 팔란티어는 엔지니어가 투입되어 세팅해 줘야 하는 구조에 가깝습니다. 중소기업까지 널리 쓰이는 '쉬운 소프트웨어'가 되기엔 태생적인 한계가 있다는 지적이 있습니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"정부 사업은 깔고 가고, 민간 사업이 얼마나 터져주느냐\"를 지켜보고 있습니다.\n\n**미래의 기업들이 복잡한 문제를 해결하기 위해 어떤 선택을 할 것이라 보십니까?**",
          options: [
            { label: "Scenario A (Buy)", value: "Buy", desc: "기업 데이터가 너무 복잡해져서, 결국 **가장 강력한 통합 성능을 가진 팔란티어**를 쓸 수밖에 없을 것이다. (그렇다면 지금은 '제2의 전성기' 초입입니다)" },
            { label: "Scenario B (Watch)", value: "Watch", desc: "팔란티어는 너무 비싸고 어렵다. 기업들은 *적당한 성능의 저렴한 툴*을 여러 개 섞어 쓰는 방식을 택할 것이다. (그렇다면 현재 주가는 과열입니다)" }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
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
    chartContext: "반독점 소송과 AI 검색 전환 비용 우려로 횡보 중입니다.",
    narrative: {
      question: "AI 전환기의 구글, 검색 제왕의 지위를 지킬 수 있을까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"검색 독점의 황금기, 그리고 AI라는 균열\"**\n\n* 구글은 지난 20년간 '검색하면 구글'이라는 공식을 만들며 전 세계 디지털 광고 시장을 지배했습니다. 주가는 이 독점적 이익을 바탕으로 꾸준히 우상향했습니다.\n* 하지만 ChatGPT의 등장 이후, **\"사람들이 더 이상 검색창에 키워드를 입력하지 않고 AI에게 물어본다면?\"**이라는 근본적인 의문이 제기되었습니다. 여기에 미 법무부의 **반독점 소송** 패소 가능성까지 겹치며 주가는 밸류에이션 할인을 받고 있습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"유튜브와 클라우드는 여전히 강력하다\"**\n\n* 검색 시장의 우려와 별개로, **유튜브(YouTube)**는 전 세계 동영상 트래픽을 독점하며 넷플릭스를 위협하는 수준의 체류 시간을 보여줍니다.\n* 또한 **구글 클라우드(GCP)**는 AI 기업들의 수요 폭증으로 흑자 전환에 성공하며 매 분기 고성장을 기록 중입니다. 이 두 기둥이 버티고 있어 구글의 현금 창출력은 여전히 막강합니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"AI 검색(Gemini)이 광고 수익을 갉아먹지 않음을 증명하라\"**\n\n* AI가 답을 바로 알려주면 사용자는 광고 링크를 클릭할 필요가 없어집니다. 이는 구글의 핵심 수익원인 **검색 광고 매출 감소(Cannibalization)**로 이어질 수 있습니다.\n* 주가가 다시 전고점을 뚫으려면, 구글이 **AI 검색 결과 내에서도 효과적으로 광고를 노출**하거나, AI 구독 모델 등을 통해 **검색 광고 감소분을 상쇄할 새로운 수익원**을 찾아냈다는 것을 숫자로 증명해야 합니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "구글은 AI 시대에도 '인터넷의 관문' 역할을 유지할 수 있을까?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[데이터]** 안드로이드 생태계의 30억 명 사용자는 여전히 구글 검색을 기본으로 사용합니다. 습관의 힘은 무섭습니다.", "**[기술]** Gemini 1.5 Pro 등 최신 모델의 성능이 GPT-4를 따라잡았으며, 방대한 데이터 인프라(TPU)를 자체 보유해 AI 운영 비용을 가장 효율적으로 통제할 수 있습니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[경쟁]** OpenAI의 'SearchGPT'나 'Perplexity' 같은 AI 검색 스타트업들이 구글의 점유율을 조금씩 갉아먹고 있습니다.", "**[규제]** 반독점 소송 결과에 따라 크롬 브라우저나 안드로이드 사업부를 강제 매각해야 할 수도 있다는 최악의 시나리오가 존재합니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"구글이 AI 때문에 망하진 않겠지만, 예전만큼 돈을 쉽게 벌진 못할 것\"이라고 걱정합니다.\n\n**당신은 구글이 AI라는 파도를 타고 더 높이 올라갈 것이라 보십니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "구글은 결국 AI 검색에서도 승리할 것이며, 유튜브와 클라우드가 새로운 성장 엔진이 될 것이다." },
            { label: "No (Watch)", value: "Watch", desc: "검색 광고 매출 감소는 구조적인 문제다. 반독점 리스크가 해소될 때까지는 관망해야 한다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
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
      question: "테슬라는 전기차 제조사인가, 아니면 AI & 로보틱스 플랫폼인가?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"전기차 치킨게임의 승자, 이제는 다음 챕터로\"**\n\n* 테슬라는 전기차 대중화를 이끌며 주가가 폭등했으나, 최근 고금리와 전기차 수요 둔화(Chasm)로 인해 **가격 인하 경쟁**을 주도했습니다. 이로 인해 마진율이 하락하며 주가도 큰 조정을 받았습니다.\n* 하지만 시장은 이제 전기차 판매량보다 **자율주행(FSD)과 로보택시**의 실현 가능성에 주목하며 다시 밸류에이션을 높이고 있습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"제조업으로서의 경쟁력은 여전히 압도적이다\"**\n\n* 테슬라의 기가팩토리 공정 혁신(Gigacasting)은 타사 대비 압도적인 **원가 경쟁력**을 제공합니다. 중국 전기차들이 치고 올라와도, 테슬라는 여전히 이익을 내며 차를 팔 수 있는 몇 안 되는 회사입니다.\n* 또한 전 세계에 깔린 **슈퍼차저 네트워크**와 에너지 저장 장치(ESS) 사업은 전기차 판매가 주춤할 때도 현금을 벌어다 주는 든든한 버팀목입니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"FSD의 상용화와 로보택시 규제 승인\"**\n\n* 테슬라 주가가 다시 전고점을 뚫으려면, **FSD(완전 자율주행)**가 베타 딱지를 떼고 **'운전자 개입 없는 주행'**을 완벽히 입증해야 합니다.\n* 특히 **로보택시(Robotaxi)** 사업이 정부 규제를 통과해 실제 도로에서 돈을 벌기 시작한다면, 테슬라는 '자동차 제조사(PER 10배)'가 아닌 '소프트웨어 플랫폼(PER 50배+)'으로 완전히 재평가받게 됩니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "일론 머스크의 약속은 이번엔 진짜일까?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[데이터]** FSD v12 배포 이후 '개입 없는 주행 거리' 데이터가 기하급수적으로 개선되고 있습니다. AI가 스스로 학습하는 End-to-End 방식이 통하고 있다는 증거입니다.", "**[환경]** 중국 바이두와의 협력 등 글로벌 규제 장벽을 하나씩 넘고 있습니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[리스크]** 로보택시 출시는 수년째 연기되어 왔습니다. 기술적 완성도와 별개로, 사고 발생 시 법적 책임 문제 등 규제 해결에 예상보다 훨씬 긴 시간이 걸릴 수 있습니다.", "**[실적]** 당장은 전기차 판매 부진으로 인한 실적 쇼크가 주가의 발목을 잡을 수 있습니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"전기차는 이제 재미없고, 자율주행이 터져야 한다\"고 말합니다.\n\n**당신은 테슬라가 운전대 없는 세상을 가장 먼저 열 것이라 믿습니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "FSD와 로보택시는 결국 시간문제다. 지금이 가장 싼 가격일 수 있다." },
            { label: "No (Watch)", value: "Watch", desc: "규제 승인은 쉽지 않다. 전기차 마진 하락세가 멈출 때까지 기다려야 한다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
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
      question: "엔비디아의 독점은 영원할까, 아니면 경쟁자들에게 틈을 내줄까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"AI 골드러시의 유일한 곡괭이 판매상\"**\n\n* ChatGPT 이후 전 세계 빅테크들이 AI 모델 개발에 뛰어들면서, 이를 돌리기 위한 엔비디아의 GPU(H100)는 없어서 못 파는 지경이 되었습니다. 매출과 이익이 매 분기 2~3배씩 폭증하며 주가도 수직 상승했습니다.\n* 이제 시장의 관심은 \"이 미친 성장세가 내년에도, 내후년에도 지속될 수 있을까?\"에 쏠려 있습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"CUDA 생태계라는 철옹성\"**\n\n* 엔비디아가 무서운 점은 하드웨어보다 소프트웨어입니다. 전 세계 AI 개발자들은 엔비디아의 **CUDA 플랫폼**에 익숙해져 있어, 다른 회사의 칩을 쓰고 싶어도 코드를 다시 짜야 하는 불편함 때문에 쉽게 떠나지 못합니다(Lock-in Effect).\n* 이 강력한 생태계 덕분에 경쟁사들이 더 싼 칩을 내놓아도 엔비디아의 점유율은 쉽게 무너지지 않습니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"추론(Inference) 시장까지 장악하라\"**\n\n* 지금까지는 AI를 '학습(Training)'시키는 데 엔비디아 칩이 쓰였습니다. 하지만 앞으로는 만들어진 AI를 서비스하는 **'추론' 시장**이 훨씬 커질 것입니다.\n* 만약 엔비디아가 추론 시장에서도 압도적인 가성비와 성능을 증명한다면, AI 시장의 성장이 곧 엔비디아의 성장이 되는 공식이 깨지지 않고 이어질 것입니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "빅테크들의 '탈(脫) 엔비디아' 선언, 위협적일까?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[로드맵]** 엔비디아는 1년마다 신제품(Blackwell 등)을 쏟아내며 경쟁사와의 기술 격차를 오히려 벌리고 있습니다.", "**[수요]** 국가 단위의 AI 인프라 구축(Sovereign AI) 수요가 더해지며 주문이 밀려 있습니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[경쟁]** 구글(TPU), 아마존(Trainium), 마이크로소프트(Maia) 등 주요 고객사들이 자체 칩을 개발해 엔비디아 의존도를 낮추려 합니다.", "**[마진]** 경쟁이 치열해지면 지금 같은 70%대의 비정상적인 이익률은 유지하기 어려울 수 있습니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"엔비디아 좋은 건 알지만, 너무 비싼 거 아냐?\"라고 의심하기 시작했습니다.\n\n**당신은 엔비디아가 시가총액 1위를 넘어 AI 시대의 영원한 대장주가 될 것이라 보십니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "CUDA 생태계는 절대 무너지지 않는다. 조정은 매수 기회다." },
            { label: "No (Watch)", value: "Watch", desc: "경쟁 심화로 마진율 하락은 필연적이다. 성장 둔화 시점에 대비해야 한다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
  },
  {
    ticker: "AAPL",
    name: "애플",
    currentPrice: 180.5,
    changeRate: 1.2,
    companyProfile: {
      summary: "세계 최고 가치의 빅테크, 생태계의 제왕",
      description: "아이폰, 맥, 아이패드, 애플워치 등 하드웨어와 앱스토어, 애플뮤직, 아이클라우드 등 서비스를 결합한 강력한 생태계를 구축한 기업입니다."
    },
    chartContext: "AI 기능 탑재 기대감과 중국 판매 부진 우려가 공존하고 있습니다.",
    narrative: {
      question: "혁신 없는 애플, '브랜드 파워'만으로 성장을 지속할 수 있을까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"성숙기에 접어든 하드웨어, 서비스로의 전환\"**\n\n* 아이폰은 더 이상 예전처럼 폭발적으로 팔리지 않습니다. 스마트폰 시장은 포화 상태이고, 교체 주기는 길어졌습니다.\n* 하지만 애플은 **서비스(앱스토어, 뮤직, 클라우드)** 매출 비중을 늘리며 체질 개선에 성공했습니다. 최근에는 **AI(Apple Intelligence)** 기능을 통해 아이폰 교체 수요를 자극하려 하고 있습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"한 번 들어오면 나갈 수 없는 생태계(Walled Garden)\"**\n\n* 아이폰, 애플워치, 에어팟, 맥북이 연동되는 편리함은 사용자를 강력하게 묶어둡니다(Lock-in). 이 충성 고객들은 경기가 어려워도 애플 제품을 사고, 매달 구독료를 냅니다.\n* 이 **강력한 현금 흐름과 자사주 매입**은 애플 주가가 아무리 떨어져도 금방 회복하게 만드는 안전판입니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"온디바이스 AI의 승자가 되는 것\"**\n\n* 클라우드 기반의 AI(ChatGPT 등)는 개인정보 보안 이슈가 있습니다. 애플은 **\"내 기기 안에서 안전하게 돌아가는 AI\"**를 표방합니다.\n* 만약 '애플 인텔리전스'가 시리(Siri)를 진짜 똑똑한 비서로 만들고, 이것이 **아이폰 16 슈퍼사이클(대규모 교체 수요)**을 만들어낸다면 애플은 다시 한번 퀀텀 점프를 할 수 있습니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "중국 시장의 부진과 규제 리스크, 극복 가능한가?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[전략]** 인도가 새로운 중국이 되고 있습니다. 인도 내 아이폰 생산과 판매가 급증하며 중국의 빈자리를 채우고 있습니다.", "**[서비스]** 서비스 부문 마진율은 70%가 넘습니다. 하드웨어를 덜 팔아도 이익은 더 늘어나는 구조로 가고 있습니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[중국]** 화웨이 등 애국 소비 열풍으로 중국 내 아이폰 점유율이 뚝 떨어졌습니다. 중국은 애플 매출의 20%를 차지하는 핵심 시장입니다.", "**[규제]** 미국과 유럽의 반독점 규제로 앱스토어 수수료 수익 모델이 위협받고 있습니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"애플은 망하지 않지만, 예전만큼 핫하지도 않다\"고 봅니다.\n\n**당신은 애플의 AI가 아이폰을 다시 'Must-have' 아이템으로 만들 것이라 보십니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "온디바이스 AI의 진정한 승자는 애플이 될 것이다. 지금이 매수 적기다." },
            { label: "No (Watch)", value: "Watch", desc: "혁신은 멈췄고 규제는 강해진다. 당분간 큰 성장은 기대하기 어렵다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
  },
  {
    ticker: "005930",
    name: "삼성전자",
    currentPrice: 58000,
    changeRate: -0.8,
    companyProfile: {
      summary: "글로벌 반도체·가전 1위, 메모리 시장 지배자",
      description: "DRAM과 NAND 등 메모리 반도체에서 세계 1위이며, 스마트폰, TV, 가전 등 다양한 사업을 영위하는 종합 전자기업입니다."
    },
    chartContext: "HBM 경쟁 열위와 파운드리 적자로 주가가 부진한 흐름입니다.",
    narrative: {
      question: "삼성전자는 '만년 2등'의 굴욕을 씻고 AI 반도체의 주인공으로 복귀할 수 있을까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"메모리 제왕의 자존심 구긴 HBM 쇼크\"**\n\n* 삼성전자는 지난 30년간 메모리 반도체 1등이었지만, AI 시대의 핵심인 **HBM(고대역폭메모리)** 시장을 SK하이닉스에게 뺏기며 주가가 곤두박질쳤습니다.\n* \"삼성이 기술력에서 밀렸다\"는 충격적인 평가 속에, 외국인 투자자들의 매도세가 이어지며 5만전자까지 추락했습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"그래도 삼성은 삼성이다 (PBR 1배 수준)\"**\n\n* 현재 주가는 청산 가치 수준(PBR 1.0배 부근)까지 떨어졌습니다. 이는 시장이 삼성의 **망할 가능성**은 없다고 보지만, **성장할 기대**도 거의 안 한다는 뜻입니다.\n* 하지만 레거시(범용) DRAM과 NAND 시장에서는 여전히 1위이며, 현금 보유량도 막대합니다. 악재란 악재는 다 반영된 '바닥'이라는 인식이 강합니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"엔비디아 퀄 테스트 통과와 HBM3E 공급\"**\n\n* 주가가 반등하려면 딱 하나, **\"우리도 엔비디아에 HBM 납품한다\"**는 뉴스가 필요합니다.\n* SK하이닉스가 독점하고 있는 HBM 시장에 삼성이 진입해 점유율을 가져온다면, \"기술 경쟁력 회복\"이라는 신호와 함께 주가는 V자 반등을 할 수 있습니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "삼성의 기술력 문제, 일시적인가 구조적인가?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[저력]** 삼성은 과거에도 위기 때마다 압도적인 자본력과 공정 기술로 경쟁자를 따돌렸습니다. 턴키(메모리+파운드리+패키징) 서비스는 삼성만이 가능한 무기입니다.", "**[밸류]** 역사적 저점 구간으로, HBM 공급 소식만 들려도 상승 여력이 큽니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[조직]** \"관료화된 조직 문화가 혁신을 막고 있다\"는 내부 비판이 거셉니다. 기술 리더십을 되찾는 데는 시간이 오래 걸릴 수 있습니다.", "**[파운드리]** 비메모리(파운드리) 사업의 적자가 지속되며 전체 실적을 갉아먹고 있습니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"삼성이 예전 같지 않다\"며 실망하고 있습니다.\n\n**당신은 삼성전자가 절치부심하여 다시 1등의 저력을 보여줄 것이라 믿습니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "삼성의 저력을 믿는다. 지금은 너무 싼 가격이다." },
            { label: "No (Watch)", value: "Watch", desc: "기술 격차는 쉽게 좁혀지지 않는다. 확실한 납품 공시가 뜰 때까지 기다리겠다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
  },
  {
    ticker: "000660",
    name: "SK하이닉스",
    currentPrice: 185000,
    changeRate: 1.5,
    companyProfile: {
      summary: "HBM 시장의 절대 강자, AI 메모리 리더",
      description: "DRAM과 NAND를 생산하는 글로벌 반도체 기업으로, 엔비디아에 HBM을 독점 공급하며 AI 메모리 시장을 선도하고 있습니다."
    },
    chartContext: "엔비디아향 HBM 독점 공급 수혜로 신고가 랠리 후 숨고르기 중입니다.",
    narrative: {
      question: "SK하이닉스는 '만년 2등' 꼬리표를 떼고 AI 메모리 대장주로 굳히기에 들어갈까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"HBM 선점으로 맞이한 최고의 전성기\"**\n\n* SK하이닉스는 경쟁사보다 한발 앞서 HBM(고대역폭메모리) 개발에 올인했고, 이것이 AI 시대와 맞물려 대박을 터뜨렸습니다.\n* 엔비디아의 핵심 파트너로서 HBM3, HBM3E를 사실상 독점 공급하며, 삼성전자를 제치고 **'AI 메모리는 하이닉스'**라는 공식을 만들었습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"내년 물량까지 이미 완판(Sold Out)\"**\n\n* AI 칩 수요가 워낙 강력해, 하이닉스의 HBM 생산 라인은 풀가동 중이며 내년 생산 물량까지 이미 예약이 끝났다는 것이 정설입니다.\n* 당분간은 **없어서 못 파는 상황**이 지속되며, 높은 영업이익률을 유지할 것으로 보입니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"삼성의 추격을 따돌리고 독점적 마진 유지\"**\n\n* 현재 주가에는 'HBM 독점' 프리미엄이 반영되어 있습니다. 추가 상승을 위해서는 **삼성전자가 HBM 시장에 진입하더라도 하이닉스의 점유율과 마진이 훼손되지 않음**을 증명해야 합니다.\n* 차세대 제품인 **HBM4**에서도 기술 격차를 유지하며 엔비디아와의 동맹을 굳건히 한다면, 메모리 사이클을 타는 주식이 아니라 **성장주**로 재평가받을 수 있습니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "메모리 반도체의 '사이클(Cycle)' 저주는 끝났나?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[구조적 성장]** AI 수요는 일시적 유행이 아닙니다. HBM은 일반 DRAM보다 가격 변동성이 적고 수익성이 월등히 높은 '스페셜티' 제품입니다.", "**[파트너십]** TSMC-엔비디아-하이닉스로 이어지는 3각 동맹은 쉽게 깨지지 않을 만큼 견고합니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[공급 과잉]** 삼성전자와 마이크론이 HBM 생산을 늘리고 있습니다. 공급이 늘어나면 결국 HBM 가격도 떨어질 수밖에 없습니다.", "**[피크아웃]** 반도체는 대표적인 사이클 산업입니다. 지금이 호황의 정점(Peak)일 수 있다는 우려가 늘 있습니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"하이닉스 좋은 건 알지만, 삼성 들어오면 끝물 아냐?\"라고 의심합니다.\n\n**당신은 SK하이닉스의 기술 우위가 앞으로도 수년간 지속될 것이라 보십니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "기술 격차는 1~2년 내에 좁혀지지 않는다. AI 메모리 대장주는 계속 하이닉스다." },
            { label: "No (Watch)", value: "Watch", desc: "경쟁자가 늘어나면 마진은 떨어진다. 사이클 고점일 수 있으니 조심해야 한다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
  },
  {
    ticker: "AMZN",
    name: "아마존",
    currentPrice: 180.0,
    changeRate: 0.8,
    companyProfile: {
      summary: "이커머스와 클라우드의 절대 강자",
      description: "세계 최대의 온라인 쇼핑몰이자, 클라우드 컴퓨팅(AWS) 시장 점유율 1위 기업입니다."
    },
    chartContext: "AWS 성장세 회복과 물류 비용 절감 효과로 우상향 중입니다.",
    narrative: {
      question: "아마존은 '비용 절감'을 넘어 'AI 클라우드'로 다시 성장할 수 있을까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"팬데믹 버블 붕괴 후, 뼈를 깎는 체질 개선\"**\n\n* 코로나 때 너무 많이 지어놓은 물류센터와 인력 과잉으로 수익성이 악화되며 주가가 폭락했었습니다.\n* 하지만 CEO 앤디 재시 취임 이후 강도 높은 **구조조정과 물류 효율화**를 단행했고, 영업이익률이 드라마틱하게 개선되며 주가는 전고점을 회복했습니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"돈 버는 기계가 된 이커머스\"**\n\n* 예전엔 팔아도 남는 게 없던 쇼핑 사업이, 이제는 **광고 사업**과 맞물려 막대한 현금을 창출하고 있습니다.\n* 아마존의 물류 네트워크는 경쟁자가 따라올 수 없는 해자(Moat)이며, 프라임 멤버십 가격 인상에도 이탈률은 낮습니다. 본업이 튼튼합니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"AWS가 AI 붐을 타고 다시 질주해야 한다\"**\n\n* 아마존의 진짜 엔진은 클라우드(AWS)입니다. 하지만 최근 마이크로소프트(Azure)가 AI를 앞세워 맹추격하며 점유율을 위협받고 있습니다.\n* 아마존이 자체 AI 칩(Trainium/Inferentia)과 베드락(Bedrock) 플랫폼을 통해 **\"AI 개발도 역시 AWS가 최고\"**라는 것을 증명하고, AWS 성장률을 다시 20%대로 끌어올려야 주가는 한 단계 더 도약할 수 있습니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "MS와의 AI 클라우드 전쟁, 승산이 있을까?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[생태계]** 전 세계 스타트업과 대기업의 인프라가 이미 AWS에 깔려 있습니다. 데이터를 옮기는 건 너무 힘든 일이라 이탈이 쉽지 않습니다.", "**[효율]** 자체 개발한 AI 칩을 통해 엔비디아 GPU보다 저렴한 가격에 AI 서비스를 제공할 수 있습니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[경쟁]** MS는 OpenAI라는 강력한 우군이 있습니다. 기업들이 'GPT-4를 쓰려면 Azure를 써야 한다'고 생각하는 것이 가장 큰 위협입니다.", "**[소비]** 경기 침체로 소비자들이 지갑을 닫으면 이커머스 매출이 타격을 입을 수 있습니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"아마존이 AI에서 MS에 밀리는 것 아니냐\"는 의구심을 가지고 있습니다.\n\n**당신은 클라우드 1위 아마존이 AI 시대에도 왕좌를 지킬 것이라 보십니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "AWS의 인프라 경쟁력은 압도적이다. 이익률 개선과 AI 성장이 동시에 터질 것이다." },
            { label: "No (Watch)", value: "Watch", desc: "AI 주도권은 MS에게 넘어갔다. 클라우드 성장 둔화가 우려된다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
  },
  {
    ticker: "AMD",
    name: "AMD",
    currentPrice: 160.0,
    changeRate: 1.8,
    companyProfile: {
      summary: "엔비디아의 유일한 대항마, CPU/GPU 2인자",
      description: "인텔과 엔비디아라는 거인들과 동시에 경쟁하며 성장해온 끈기의 반도체 기업입니다. 최근 AI 칩 MI300으로 엔비디아 독점에 도전합니다."
    },
    chartContext: "AI 칩 점유율 확대 기대감과 엔비디아와의 격차 우려로 등락을 반복 중입니다.",
    narrative: {
      question: "AMD는 엔비디아의 독점을 깨고 'AI 2인자' 자리를 확실히 굳힐 수 있을까?",
      steps: {
        history: {
          title: "주가 히스토리 및 현황 (Why Now?)",
          content: "**\"만년 2등의 반란, 이번엔 AI다\"**\n\n* AMD는 과거 인텔을 위협하며 CPU 시장에서 기적을 썼던 저력이 있습니다. 이제는 GPU 시장에서 엔비디아의 독점에 도전장을 내밀었습니다.\n* 엔비디아 칩이 너무 비싸고 구하기 힘들자, 빅테크 기업들은 **\"엔비디아를 대체할 대안(Alternative)\"**을 간절히 찾고 있습니다. 그 유일한 대안이 바로 AMD입니다."
        },
        floor: {
          title: "시장의 합의된 기대 (The Floor: 하방 경직성)",
          content: "**\"데이터센터 CPU 점유율 확대\"**\n\n* AI 칩뿐만 아니라, 서버용 CPU(EPYC) 시장에서 인텔의 점유율을 계속 뺏어오고 있습니다. 성능과 전력 효율에서 인텔을 앞섰다는 평가를 받으며 안정적인 캐시카우 역할을 하고 있습니다.\n* 엔비디아만큼은 아니더라도, AI 시장이 커지면 2등인 AMD에게도 콩고물(낙수 효과)이 떨어질 것이라는 기대가 바닥을 지지합니다."
        },
        upside: {
          title: "주가 상승을 위한 핵심 트리거 (The Upside: 리레이팅 조건)",
          content: "**\"MI300 시리즈의 실질적인 점유율 확보\"**\n\n* AMD의 최신 AI 칩 **MI300**이 엔비디아 H100과 비교해 가성비가 좋다는 것을 입증해야 합니다.\n* 단순히 \"좋은 제품\"을 넘어, 마이크로소프트나 메타 같은 빅테크들이 **실제로 대량 구매**를 하고 소프트웨어 호환성 문제를 해결해준다면, AMD는 '엔비디아의 저렴한 대안'으로서 폭발적인 성장을 할 수 있습니다."
        },
        debate: {
          title: "핵심 논쟁 및 데이터 (Debate & Data)",
          question: "소프트웨어(ROCm)가 하드웨어의 발목을 잡지 않을까?",
          bulls: [
            { title: "긍정적 시그널 (Bullish Evidence)", items: ["**[가성비]** 엔비디아 칩보다 가격은 훨씬 싼데 메모리 용량은 더 큽니다. 거대 언어 모델(LLM)을 돌리기에 가성비가 뛰어납니다.", "**[지원]** 엔비디아 독점을 싫어하는 빅테크들이 AMD의 소프트웨어 생태계 구축을 적극적으로 도와주고 있습니다."] }
          ],
          bears: [
            { title: "부정적 시그널 (Bearish Evidence)", items: ["**[소프트웨어]** 엔비디아의 CUDA에 비해 AMD의 ROCm은 여전히 불안정하고 개발하기 어렵다는 평이 많습니다. 개발자들이 기피하면 하드웨어가 좋아도 안 팔립니다.", "**[경쟁]** 엔비디아가 가격을 내리거나 신제품을 빨리 내놓으면, 굳이 2등 제품을 쓸 이유가 사라집니다."] }
          ]
        },
        final: {
          title: "당신의 판단 (The Final Bet)",
          content: "시장은 \"AMD가 엔비디아의 10%만 가져와도 대박\"이라고 기대합니다.\n\n**당신은 AMD가 엔비디아의 독점을 깰 수 있는 강력한 경쟁자가 될 것이라 보십니까?**",
          options: [
            { label: "Yes (Buy)", value: "Buy", desc: "AI 시장은 너무 커서 엔비디아 혼자 다 못 먹는다. 2등의 성장폭이 더 클 수 있다." },
            { label: "No (Watch)", value: "Watch", desc: "소프트웨어 격차는 쉽게 좁혀지지 않는다. 엔비디아 쏠림 현상은 계속될 것이다." }
          ]
        }
      }
    },
    watchpoints: [],
    availableLogicBlocks: [],
    events: []
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
        { id: 'd2', ticker: '005930', name: '삼성전자', quantity: 120, currency: 'KRW', valuation: 9000000, profitValue: -183600, profitRate: -2.0 },
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
  myThesis: [],
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
      },
      {
        rank: 2,
        keyword: "AI 반도체",
        relatedStocksDetails: [
          { ticker: "NVDA", name: "엔비디아", rate: 2.5 },
          { ticker: "005930", name: "삼성전자", rate: -0.8 },
          { ticker: "000660", name: "SK하이닉스", rate: 0 }
        ],
        title: "AI 반도체 공급망 경쟁",
        subtitle: "HBM 메모리 전쟁의 승자는 누구?",
        desc: "엔비디아 GPU 독점 속에서 HBM 공급사들의 기술 경쟁이 치열합니다. SK하이닉스의 선점 vs 삼성전자의 추격.",
        badge: "🔥 경쟁 심화",
        theme: "purple"
      },
      {
        rank: 3,
        keyword: "빅테크",
        relatedStocksDetails: [
          { ticker: "AAPL", name: "애플", rate: 1.2 },
          { ticker: "GOOGL", name: "구글", rate: -1.2 }
        ],
        title: "빅테크 생태계 전환기",
        subtitle: "AI 시대, 플랫폼 기업들의 재평가",
        desc: "애플의 서비스 수익 성장과 구글의 AI 검색 전환. 기존 생태계를 지키며 혁신할 수 있을까?",
        badge: "⚡ 전환기",
        theme: "orange"
      },
      {
        rank: 4,
        keyword: "자율주행",
        relatedStocksDetails: [
          { ticker: "TSLA", name: "테슬라", rate: 5.2 }
        ],
        title: "자율주행 상용화 레이스",
        subtitle: "FSD와 로보택시의 규제 돌파",
        desc: "규제 완화 기대감으로 급등한 테슬라. 자율주행 기술이 실제 수익으로 전환될 수 있을지가 관건입니다.",
        badge: "🚀 급등 중",
        theme: "green"
      }
    ],
    searchResultSample: ALL_STOCKS[0]
  },
  notifications: [
    {
      id: 1,
      type: "alert",
      title: "JYP Ent. 이벤트 발생",
      desc: "글로벌 데뷔 지표 발표. 대응이 필요합니다.",
      stockId: 1,
      ticker: "035900",
      timestamp: "방금 전",
      isRead: false
    }
  ]
});