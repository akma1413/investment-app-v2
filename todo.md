1. [Foundation] 데이터 모델링 및 타입 재정의
가장 먼저 그릇을 빚어야 합니다. 새로운 기획 의도(Narrative, Watchpoints, Event Loop)를 담을 수 있도록 데이터 구조를 확장합니다.

작업 개요: types.ts 전면 개편.

주요 사항:

Thesis: narrativeSummary(한 줄 요약), logicHealth(점수), watchpoints(구 퀴즈 대체) 필드 추가.

Event: 예측(Pre)과 대응(Post)을 아우르는 통합 구조 및 myActionHistory(유저의 선택 기록) 필드 설계.

User: 포트폴리오(Assets)와 가설(Thesis) 간의 ID 매핑 구조 점검.

2. [Content] 핵심 콘텐츠 데이터 마이그레이션
변경된 데이터 구조에 맞춰 실제 화면에 뿌려질 '맛있는' 데이터를 준비합니다.

작업 개요: stockData.ts 내 주요 종목 데이터 재구성.

주요 사항:

대상: JYP, 팔란티어(PLTR), 테슬라(TSLA), 엔비디아(NVDA).

Phase 1 (Narrative): Why Now → Floor → Upside 구조의 스토리텔링 데이터 작성.

Phase 2 (Watchpoints): '맥락(Context)'이 포함된 관전 포인트 질문지 작성.

3. [Module A] Phase 1 & 2 신규 뷰 구현
사용자가 가설을 수립하는 두 가지 핵심 모듈을 독립적인 컴포넌트로 개발합니다.

작업 개요: NarrativeIntro (스토리텔러) 및 WatchpointBuilder (세부 가설 설정) 구현.

주요 사항:

NarrativeIntro: 세로 스크롤 카드뉴스 UI. 마지막에 'The Bet(판단)' 선택 시 데이터 저장.

WatchpointBuilder: 가로 스와이프 형태의 질문 카드. 상세 페이지 내에서 모달로 진입.

4. [Module B] Event Loop (몰입형 대응) 구현
이슈 발생 시 사용자가 경험할 핵심 액션 플로우를 구현합니다.

작업 개요: ImmersiveEventMode (풀스크린 모달) 구현.

주요 사항:

5단계 플로우: 팩트체크 → 시장반응 → 분석 → 가설점검 → 최종판단.

단일 메시지 원칙: 한 화면에 하나의 메시지와 버튼만 노출.

통합 구조: 예측(Pre) 모드와 대응(Post) 모드를 하나의 컴포넌트에서 props로 분기 처리.

5. [Integration] 종목 상세 페이지 (Logic HQ) 리뉴얼
개발된 모듈들을 하나로 모으는 허브(Hub) 페이지를 구축합니다.

작업 개요: StockDetailModal 전면 UI 수정.

주요 사항:

4단 레이어 구조: Action Ticket(긴급) → Chart(배경) → Logic HQ(핵심) → Reference(정보).

Logic HQ 카드: 내러티브 요약 + 건강도(Health) 미터기 + 왓치포인트 리스트 시각화.

진입점 연결: Action Ticket 클릭 시 → ImmersiveEventMode 실행.

6. [Flow] 온보딩 및 탐색 플로우 재설계
앱의 첫인상과 진입 경로를 기획 의도에 맞게 수정합니다.

작업 개요: OnboardingFlow 수정 및 Discovery 탭 연결.

주요 사항:

온보딩 축소: 종목 스캔 후 **Phase 1(Narrative)**만 진행하고 종료.

랜딩 수정: 온보딩 완료 시 '홈'이 아니라, **방금 가설을 세운 '종목 상세 페이지'**로 즉시 이동 (몰입 유지).

검색 연결: Discovery에서 종목 클릭 시 → (미보유 시) NarrativeIntro 진입.

7. [System] 데이터 정합성 및 알림 시스템 동기화
모든 데이터가 유기적으로 연결되어 있는지 확인하고 끊어진 혈관을 잇습니다.

작업 개요: StoreContext 로직 강화 및 Notification 딥링크 처리.

주요 사항:

Sync: User.holdings(자산)에 있는 종목은 자동으로 MyThesis(아이디어) 탭에 'Invested' 상태로 동기화.

Notification: 알림 클릭 시 단순히 앱을 켜는 게 아니라, 해당 종목의 ImmersiveEventMode (특정 이벤트) 또는 StockDetailModal로 정확히 이동(Deep Link).

History: 이벤트 대응 결과가 LogicHealth 점수에 실시간 반영되도록 로직 연결.