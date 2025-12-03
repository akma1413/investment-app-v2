# 하이포(Hypo) - 논리 기반 투자 앱 기술 문서

## 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프론트엔드 아키텍처](#3-프론트엔드-아키텍처)
4. [백엔드 아키텍처](#4-백엔드-아키텍처)
5. [핵심 기능 상세](#5-핵심-기능-상세)
6. [데이터 모델](#6-데이터-모델)
7. [비즈니스 로직](#7-비즈니스-로직)
8. [상태 관리](#8-상태-관리)
9. [UI/UX 설계](#9-uiux-설계)
10. [향후 개발 계획](#10-향후-개발-계획)

---

## 1. 프로젝트 개요

### 1.1 앱 소개
**하이포(Hypo)**는 "논리 기반 투자(Logic-Driven Investment)"를 핵심 철학으로 하는 투자 분석 애플리케이션입니다. 사용자가 단순히 주식을 매매하는 것이 아니라, **투자 가설(Thesis)**을 세우고 이를 지속적으로 검증하며 합리적인 투자 결정을 내릴 수 있도록 돕습니다.

### 1.2 핵심 가치
- **가설 기반 투자**: 모든 투자 결정에 명확한 근거와 논리를 부여
- **체계적 모니터링**: 투자 가설의 핵심 지표(Watchpoint)를 추적하고 검증
- **이벤트 기반 의사결정**: 실적 발표, 시장 이벤트 등에 대응하는 구조화된 프레임워크 제공
- **논리 건강도 추적**: 투자 가설의 유효성을 점수화하여 객관적 판단 지원

### 1.3 주요 사용자 흐름
```
주식 발견 → 투자 내러티브 학습 → 가설(Thesis) 생성 →
Watchpoint 선택 → 포트폴리오 추가 → 이벤트 모니터링 →
논리 건강도 체크 → 매수/보유/매도 결정
```

---

## 2. 기술 스택

### 2.1 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.0 | UI 프레임워크 |
| TypeScript | 5.8.2 | 타입 안정성 |
| Vite | 6.2.0 | 빌드 도구 & 개발 서버 |
| Tailwind CSS | CDN | 스타일링 |
| Framer Motion | 12.23.25 | 애니메이션 |
| Lucide React | 0.555.0 | 아이콘 라이브러리 |
| React Markdown | 10.1.0 | 마크다운 렌더링 |

### 2.2 백엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| FastAPI | 0.104.1 | REST API 프레임워크 |
| Python | 3.12+ | 서버 언어 |
| PostgreSQL | - | 데이터베이스 (Supabase) |
| asyncpg | 0.29.0 | 비동기 DB 드라이버 |
| python-jose | - | JWT 토큰 관리 |
| bcrypt | - | 비밀번호 해싱 |
| OpenTelemetry | - | 분산 추적 |

### 2.3 외부 서비스 연동
- **Supabase**: 관리형 PostgreSQL 데이터베이스
- **Gemini API**: AI 기반 투자 분석 (설정됨, 미활성)
- **OpenAI API**: 투자 내러티브 생성 (백엔드 설정)
- **Exa API**: 웹 검색 기능 (백엔드 설정)

---

## 3. 프론트엔드 아키텍처

### 3.1 디렉토리 구조
```
src/
├── components/              # UI 컴포넌트
│   ├── narrative/          # 내러티브 관련
│   │   ├── NarrativeIntro.tsx    # 5단계 투자 스토리
│   │   └── WatchpointBuilder.tsx # Watchpoint 선택
│   ├── stock-detail/       # 주식 상세 모달
│   │   ├── OnboardingFlow.tsx    # 온보딩 플로우
│   │   ├── LogicSection.tsx      # 논리 건강도 섹션
│   │   ├── EventSection.tsx      # 이벤트 섹션
│   │   └── NewsSection.tsx       # 뉴스 섹션
│   ├── event/              # 이벤트 관련
│   │   ├── ImmersiveEventMode.tsx # 몰입형 이벤트 모드
│   │   └── EventTicket.tsx        # 이벤트 티켓 카드
│   ├── InsightTab.tsx       # 인사이트 탭
│   ├── MyThesisTab.tsx      # 나의 가설 탭
│   ├── DiscoveryTab.tsx     # 발견 탭
│   └── StockDetailModal.tsx # 주식 상세 모달
├── contexts/
│   └── StoreContext.tsx     # 전역 상태 관리
├── utils/
│   ├── chartUtils.ts        # 차트 유틸리티
│   ├── formatters.ts        # 포맷팅 함수
│   └── logicUtils.ts        # 논리 건강도 계산
├── constants/
│   └── text.ts              # UI 텍스트 상수
├── data/
│   └── stockData.ts         # 주식 데이터
├── types.ts                 # TypeScript 타입 정의
├── App.tsx                  # 메인 앱 컴포넌트
└── index.tsx                # 앱 진입점
```

### 3.2 탭 구조 (3개 메인 탭)

#### 인사이트 탭 (Insight Tab)
- **목적**: 일일 시장 개요 및 포트폴리오 현황 표시
- **주요 기능**:
  - 시장 날씨 요약 (상승/하락/중립)
  - 시장 지수 차트 (KOSPI/S&P 500 자동 전환)
  - 보유 종목 표시 (국내/해외 탭 분리)
  - 손익률 시각화

#### 나의 가설 탭 (My Thesis Tab)
- **목적**: 개인 투자 가설 관리
- **주요 기능**:
  - 카드 형태의 가설 목록 (투자중/관심 상태)
  - 긴급 이벤트 인디케이터 (빨간색 강조)
  - 논리 아이콘 표시
  - 긴급도 기준 정렬

#### 발견 탭 (Discovery Tab)
- **목적**: 새로운 투자 기회 탐색
- **주요 기능**:
  - 전문 검색 기능
  - 트렌딩 로직 카드 (테마 컬러)
  - 최근 검색 히스토리
  - 로직 상세 모달

### 3.3 주요 모달 컴포넌트

#### StockDetailModal (주식 상세 모달)
가장 복잡한 컴포넌트로, 다음 섹션들을 포함:
- 가격 차트 (6개 시간대: 1D, 1W, 1M, 3M, 1Y, 5Y)
- 인터랙티브 호버 툴팁
- Watchpoint 목록 (확장 가능)
- 뉴스 섹션 (감성 태그)
- 이벤트 캐러셀
- 논리 건강도 디스플레이
- 기업 프로필

#### HypothesisBuilder (가설 빌더)
다단계 투자 가설 생성 인터페이스:
- **Step 1**: 내러티브 소개 (why/floor/upside/debate/final bet)
- **Step 2**: Watchpoint 선택 (Bull/Bear 결정)
- **결과**: "매수" 또는 "관심" 상태의 가설 생성

---

## 4. 백엔드 아키텍처

### 4.1 API 엔드포인트

#### 인증 라우트 (`/api/v1/auth`)

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/signin` | 로그인 |
| POST | `/auth/refresh` | 토큰 갱신 |
| POST | `/auth/logout` | 로그아웃 |
| POST | `/auth/change-password` | 비밀번호 변경 |
| GET | `/auth/me` | 현재 사용자 정보 |

#### 헬스 체크

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| GET | `/health` | 기본 상태 확인 |
| GET | `/health/ready` | DB 연결 포함 준비 상태 |

### 4.2 데이터베이스 스키마

#### users 테이블
```sql
- id (UUID, Primary Key)
- email (VARCHAR 255, UNIQUE)
- hashed_password (bcrypt)
- full_name (VARCHAR 255)
- is_active (BOOLEAN)
- is_verified (BOOLEAN)
- sign_up_method ('email', 'oauth')
- terms_of_service_agreed (BOOLEAN)
- privacy_policy_agreed (BOOLEAN)
- marketing_consent (BOOLEAN)
- oauth_provider (VARCHAR 50)
- oauth_id (VARCHAR 255)
- created_at, updated_at, last_login_at (TIMESTAMP)
```

#### refresh_tokens 테이블
```sql
- id (UUID, Primary Key)
- user_id (UUID, FK → users)
- token (VARCHAR 500, SHA-256 해시)
- expires_at (TIMESTAMP)
- is_revoked (BOOLEAN)
- created_at, revoked_at (TIMESTAMP)
```

### 4.3 보안 기능
- **비밀번호**: bcrypt 해싱 (cost=12)
- **토큰**: SHA-256 해싱 후 DB 저장
- **토큰 로테이션**: 리프레시 시 기존 토큰 무효화
- **토큰 패밀리 추적**: 도난 감지 시 전체 패밀리 무효화
- **RLS 정책**: Row-Level Security 활성화

---

## 5. 핵심 기능 상세

### 5.1 투자 가설(Thesis) 시스템

투자 가설은 앱의 핵심 개념으로, 모든 투자 결정의 근거가 됩니다.

#### 가설 구조
```typescript
interface Thesis {
  id: number;
  ticker: string;           // 종목 코드
  name: string;             // 종목명
  currentPrice: number;     // 현재가
  changeRate: number;       // 등락률
  status: 'Invested' | 'Watching';  // 투자중/관심

  narrative: {              // 투자 내러티브
    question: string;       // 핵심 질문
    steps: {
      history: NarrativeStep;   // 왜 지금인가?
      floor: NarrativeStep;     // 바닥은 어디인가?
      upside: NarrativeStep;    // 상승 여력은?
      debate: DebateSection;    // Bull vs Bear
      final: FinalBetSection;   // 최종 판단
    }
  };

  watchpoints: Watchpoint[];    // 모니터링 지표
  events: Event[];              // 관련 이벤트
  logicHealth: LogicHealth;     // 논리 건강도
}
```

#### 5단계 내러티브 프레임워크
1. **History (왜 지금인가?)**: 투자 타이밍의 배경과 맥락
2. **Floor (기초 체력)**: 하방 리스크와 본질적 가치
3. **Upside (상승 여력)**: 성장 잠재력과 상승 시나리오
4. **Debate (토론)**: Bull vs Bear 양측 논거
5. **Final Bet (최종 판단)**: 매수/관심 결정

### 5.2 Watchpoint 시스템

Watchpoint는 투자 가설의 핵심 가정을 검증하기 위한 모니터링 지표입니다.

```typescript
interface Watchpoint {
  title: string;        // 예: "[성장성]", "[수익성]"
  question: string;     // 모니터링할 구체적 질문
  context: string;      // 왜 중요한지 설명
  references?: {
    summaries: ReferenceItem[];  // 관련 자료
    pros: ReferenceItem;         // Bull 케이스
    cons: ReferenceItem;         // Bear 케이스
  };
  options: WatchpointOption[];   // Bull/Bear 선택지
}
```

### 5.3 논리 건강도(Logic Health) 시스템

투자 가설의 유효성을 0-100 점수로 평가합니다.

#### 점수 계산 알고리즘
```typescript
기본 점수: 50점

이벤트 결과에 따른 점수 변동:
- Watchpoint 확인(Pass): +10점
- Watchpoint 실패(Fail): -15점
- 매수 액션: +5점
- 매도 액션: -5점

상태 임계값:
- > 70점: 'Good' (건강함)
- 40-70점: 'Warning' (주의 필요)
- < 40점: 'Danger' (위험)
```

### 5.4 이벤트 시스템

시장 이벤트를 구조화하여 의사결정을 지원합니다.

#### 이벤트 구조
```typescript
interface Event {
  id: string;
  title: string;
  date: string;
  type: string;           // 실적발표, 정책변경 등
  status: 'Upcoming' | 'Active' | 'Completed';

  factCheck: {            // 팩트 체크
    status: string;
    actualValue: string;
    description: string;
  };

  marketReaction: {       // 시장 반응
    priceChange: string;
    volumeChange: string;
    comment: string;
  };

  analysis: {             // 분석
    cause: string;
    context: string;
    implication: string;
  };

  decisionScenario: {     // 의사결정 시나리오
    buy: ScenarioOption;
    hold: ScenarioOption;
    sell: ScenarioOption;
  };
}
```

#### 이벤트 5단계 흐름
1. **Info**: 이벤트 기본 정보
2. **Reaction**: 시장 반응 분석
3. **Analysis**: 원인 및 맥락 분석
4. **Context**: 포트폴리오 영향 평가
5. **Action**: 매수/보유/매도 제안

### 5.5 알림 시스템

```typescript
interface Notification {
  id: number;
  type: 'alert' | 'info';   // 긴급/일반
  title: string;
  desc: string;
  stockId?: number;         // 관련 가설 ID
  ticker?: string;
  eventId?: string;         // 관련 이벤트 ID
  timestamp: string;
  isRead: boolean;
}
```

**알림 트리거**:
- 이벤트 상태 변경 (Upcoming → Active → Completed)
- Watchpoint 임계값 돌파
- 유의미한 시장 변동
- 관련 뉴스 발생

---

## 6. 데이터 모델

### 6.1 사용자 모델
```typescript
interface User {
  name: string;
  profileMsg: string;
  totalWinRate: number;       // 승률
  totalAssetValue: number;    // 총 자산
  totalProfitValue: number;   // 총 수익
  totalProfitRate: number;    // 총 수익률
  holdings: {
    domestic: Holding[];      // 국내 보유
    overseas: Holding[];      // 해외 보유
  };
}
```

### 6.2 보유 종목 모델
```typescript
interface Holding {
  ticker: string;
  name: string;
  quantity: number;
  currentPrice: number;
  averagePrice: number;
  valuation: number;          // 평가금액
  profitValue: number;        // 수익금
  profitRate: number;         // 수익률
  currency: 'KRW' | 'USD';
}
```

### 6.3 시장 날씨 모델
```typescript
interface MarketWeather {
  status: 'Up' | 'Down' | 'Neutral';
  summary: string;
  indices: MarketIndex[];
}

interface MarketIndex {
  name: string;               // KOSPI, S&P 500 등
  value: number;
  change: number;
  trend: number[];            // 스파크라인 데이터
}
```

### 6.4 트렌딩 로직 모델
```typescript
interface TrendingLogic {
  keyword: string;            // "De-Nvidia", "전력망" 등
  stocks: RelatedStock[];     // 관련 종목
  analystConsensus: {
    priceTarget: number;
    outlook: 'Positive' | 'Neutral' | 'Negative';
    distribution: {
      buy: number;
      hold: number;
      sell: number;
    };
  };
  upsideScenario: string;     // 상승 시나리오
  reasonsToWatch: string[];   // 주목 이유
}
```

---

## 7. 비즈니스 로직

### 7.1 포트폴리오 동기화

`StoreContext.tsx`의 `syncHoldingsToThesis()` 함수:

```typescript
// 보유 종목과 가설 목록 동기화
function syncHoldingsToThesis():
  1. 모든 보유 종목 순회
  2. 기존 가설과 중복 체크 (ticker 기준)
  3. 신규 종목이면 가설 자동 생성
  4. 기존 가설이면 가격/수량 업데이트
  5. 국내(KRW)/해외(USD) 분리 처리
```

### 7.2 차트 데이터 생성

`chartUtils.ts`의 Random Walk 알고리즘:

```typescript
// 현실적인 주가 데이터 생성
function generateChartData(startPrice, count, trend):
  기본 변동성: 가격의 0.5%

  트렌드 팩터:
  - 상승(up): +20% 바이어스
  - 하락(down): -20% 바이어스
  - 변동(volatile): 1.5배 변동성

  가격 하한: 최소 0.1 (음수 방지)
```

### 7.3 통화 포맷팅

```typescript
function formatCurrency(value, currency):
  - 1000 초과: 원화 형식 ("58,200원")
  - 1000 이하: 달러 형식 ("$24.5")
  - undefined: "-" 표시
```

### 7.4 수익률 색상 코딩

한국 시장 관례 적용:
- **상승(+)**: `text-app-positive` (빨간색 #F87171)
- **하락(-)**: `text-app-negative` (파란색 #60A5FA)
- **보합(0)**: `text-zinc-500` (회색)

---

## 8. 상태 관리

### 8.1 StoreContext 구조

React Context API 기반의 전역 상태 관리:

```typescript
interface StoreContextType {
  data: AppData;

  // 사용자 관련
  updateUserName: (name: string) => void;

  // 알림 관련
  markNotificationAsRead: (id: number) => void;

  // 검색 관련
  searchStocks: (query: string) => void;
  selectDiscoveryStock: (ticker: string) => void;

  // 가설 관련
  addToMyThesis: (stock, status, watchpoints) => Thesis;
  recordEventDecision: (thesisId, eventId, decision) => void;
}
```

### 8.2 AppData 구조

```typescript
interface AppData {
  user: User;                        // 사용자 정보
  myThesis: Thesis[];               // 나의 가설 목록
  marketWeather: MarketWeather;     // 시장 날씨
  discovery: {
    trendingLogics: TrendingLogic[];
    recentSearches: string[];
    searchResults: SearchResultSample[];
    selectedStock?: SearchResultSample;
  };
  notifications: Notification[];     // 알림 목록
}
```

### 8.3 데이터 흐름

```
사용자 액션
    ↓
StoreContext 업데이트
    ↓
가설/이벤트 상태 변경
    ↓
논리 건강도 재계산
    ↓
알림 생성
    ↓
UI 리렌더링
```

---

## 9. UI/UX 설계

### 9.1 디자인 시스템

#### 컬러 팔레트
```javascript
colors: {
  app: {
    bg: '#121212',              // 다크 배경
    surface: '#1E1E1E',         // 카드 배경
    text: {
      primary: '#FFFFFF',       // 주요 텍스트
      secondary: '#A1A1AA'      // 보조 텍스트
    },
    accent: '#6366f1',          // 인디고 강조색
    positive: '#F87171',        // 상승 (빨강)
    negative: '#60A5FA',        // 하락 (파랑)
  }
}
```

#### 논리 건강도 색상
- **Good (>70)**: 초록색 계열
- **Warning (40-70)**: 주황색/노란색 계열
- **Danger (<40)**: 빨간색 계열

### 9.2 레이아웃

- **모바일 우선**: max-width 430px 고정
- **하단 네비게이션**: 88px 높이, 3개 탭
- **Safe Area**: 노치 대응 패딩 적용
- **스크롤바 숨김**: 커스텀 CSS (.no-scrollbar)

### 9.3 애니메이션

Framer Motion 활용:
- 탭 전환 애니메이션
- 카드 호버/탭 피드백
- 모달 진입/퇴장 효과
- 슬라이드 캐러셀

### 9.4 아이콘 시스템

Lucide React 아이콘 사용:
- **네비게이션**: CalendarClock, Lightbulb, Compass
- **알림**: Bell, AlertCircle, AlertTriangle
- **데이터**: TrendingUp, TrendingDown, BarChart3
- **컨트롤**: ChevronRight, X, Check
- **마켓**: Quote, Scale, Target, Eye

---

## 10. 향후 개발 계획

### 10.1 프론트엔드-백엔드 통합

현재 프론트엔드는 로컬 상태만 사용하고 있어 백엔드 연동이 필요합니다:

1. **API 클라이언트 구현**: Axios 또는 fetch 기반 API 레이어
2. **인증 연동**: JWT 토큰 관리 및 자동 갱신
3. **실시간 데이터**: WebSocket 또는 SSE 연동
4. **오프라인 지원**: 로컬 캐싱 및 동기화

### 10.2 추가 기능 개발

#### 백엔드 확장
- 포트폴리오/보유종목 관리 API
- 가설/Watchpoint 저장 API
- 이벤트 추적 API
- OpenAI 분석 서비스 연동
- Polymarket 연동 (예측 시장)

#### 프론트엔드 확장
- 이메일 인증 플로우
- 소셜 로그인 (Google, Apple)
- 푸시 알림
- 다크/라이트 모드 전환
- 다국어 지원

### 10.3 기술적 개선

1. **테스트 인프라**: Jest, React Testing Library 도입
2. **상태 관리 고도화**: Zustand 또는 TanStack Query 검토
3. **성능 최적화**: 코드 스플리팅, 레이지 로딩
4. **모니터링**: Sentry, Analytics 연동
5. **CI/CD**: GitHub Actions, Vercel 배포 자동화

### 10.4 데이터 파이프라인

1. **실시간 시세**: 증권사 API 또는 데이터 벤더 연동
2. **뉴스 피드**: 뉴스 API 연동 및 감성 분석
3. **AI 분석**: GPT-4 기반 투자 내러티브 자동 생성
4. **이벤트 캘린더**: 실적 발표, 배당 등 자동 수집

---

## 부록

### A. 환경 변수 설정

```bash
# .env.local (프론트엔드)
GEMINI_API_KEY=your_gemini_key

# .env (백엔드)
APP_NAME="Investment Interface API"
SECRET_KEY=<openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<public_key>
SUPABASE_SERVICE_ROLE_KEY=<secret_key>
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### B. 개발 환경 설정

```bash
# 프론트엔드
cd investment-app-v2
npm install
npm run dev          # http://localhost:3000

# 백엔드
cd investment-interface/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### C. 빌드 및 배포

```bash
# 프론트엔드 빌드
npm run build        # dist/ 폴더에 출력
npm run preview      # 빌드 미리보기

# 백엔드 (프로덕션)
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 문서 버전 정보

- **문서 버전**: 1.0.0
- **생성일**: 2025-12-03
- **작성**: Claude AI
- **프로젝트 버전**: 0.0.0

---

*이 문서는 하이포(Hypo) 투자 앱의 기술 구조와 기능을 포괄적으로 설명합니다. 개발 진행에 따라 지속적으로 업데이트될 예정입니다.*
