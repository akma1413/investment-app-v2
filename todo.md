# 🛠️ Hypo Data & Logic Fix Task List

This document breaks down the "Data Consistency" and "Navigation Logic" fixes into atomic, execution-ready tasks. Please execute them **one by one** to ensure accuracy.

---

## ✅ Task 1: Update Data Source (Source of Truth)
**Target File:** `src/contexts/StoreContext.tsx`
**Goal:** Align the `initialData` strictly with the user's "My Assets" screenshot.

**Instructions:**
1.  Locate `initialData.user.holdings`.
2.  **Domestic Stocks Update:** Replace the existing array with these exact values:
    * **SK하이닉스:** quantity: `44`, valuation: `8140000`, profitValue: `-547180`, profitRate: `-6.3`
    * **삼성전자:** quantity: `120`, valuation: `9000000`, profitValue: `-183600`, profitRate: `-2.0`
    * **TIGER 미국S&P500:** quantity: `22`, valuation: `432080`, profitValue: `114620`, profitRate: `36.1`
3.  **Overseas Stocks Update:** Replace with these exact values:
    * **Google:** (Change name from "Alphabet A" to "Google"), quantity: `98`, valuation: `23520000`, profitValue: `12408900`, profitRate: `111.7`
    * **Amazon:** quantity: `33`, valuation: `8250000`, profitValue: `1966500`, profitRate: `31.3`
    * **NVIDIA:** quantity: `10`, valuation: `12400000`, profitValue: `7294800`, profitRate: `142.7`
4.  **Sync `myThesis`:** Ensure the `myThesis` array only contains stocks that exist in the updated holdings above. Remove any dummy data that doesn't match.

---

## ✅ Task 2: Fix Onboarding Stock Selection Logic
**Target File:** `src/components/onboarding/OnboardingFlow.tsx`
**Goal:** Ensure the user selects from their *actual* overseas holdings, not random data.

**Instructions:**
1.  Navigate to the `step === 'stock-select'` logic (or where `scannedStocks` is set).
2.  **Filter Logic Change:** instead of pulling from `ALL_STOCKS`, pull directly from `data.user.holdings.overseas` (from Task 1).
3.  **Display:** Ensure the list shows **Google, Amazon, and NVIDIA** as the selection options.
4.  **Selection Handler:** When a user selects a stock here, pass this *exact* stock object to the next step (Quiz).

---

## ✅ Task 3: Fix Discovery Navigation Bug
**Target File:** `src/components/DiscoveryTab.tsx`
**Goal:** Fix the bug where clicking a Trending Stock (e.g., AMD) opens the wrong modal (Google).

**Instructions:**
1.  Locate `handleStockClick(ticker)`.
2.  **Bug Fix:** The current logic might be defaulting to `selectDiscoveryStock` with a hardcoded value or finding the wrong index.
3.  **Logic Update:**
    * Search for the ticker in `data.discovery.trendingLogics` (flatten the `relatedStocksDetails` array).
    * OR search in `data.discovery.searchResults`.
    * Ensure the `selectedStock` state in the store is updated with the *clicked* stock's data, not a default one.

---

## ✅ Task 4: Implement "Uninvested View" in Detail Modal
**Target File:** `src/components/StockDetailModal.tsx`
**Goal:** Distinguish between "My Stocks" (Management Mode) and "New Stocks" (Discovery Mode).

**Instructions:**
1.  Inside the component, check if the current `stock` exists in `data.myThesis`.
    * `const isMyThesis = data.myThesis.some(t => t.ticker === stock.ticker);`
2.  **Conditional Rendering:**
    * **IF `isMyThesis` is TRUE:** Show the current view (Logic Health, Event Prediction, etc.).
    * **IF `isMyThesis` is FALSE:**
        * **Hide:** "Logic Health" section and "Event Action" cards.
        * **Show:** Only Chart, Company Profile, and News.
        * **Add CTA:** Render a prominent button at the bottom: **"이 종목으로 투자 가설 세우기"**.
3.  **Button Action:** Clicking the CTA should trigger `onAddLogic` (or the callback that opens `HypothesisBuilder`).

## ✅ Task 5: Redesign Event Response Logic (Pre/Post Flow)
**Target File:** `src/components/StockDetailModal.tsx`
**Goal:** Replace the static prediction card with a time-based interaction flow (Scenario Planning → Result Briefing).

**Instructions:**
1.  **Locate Component:** Find the `EventActionCard` component (or the section rendering event actions).
2.  **Add State Logic:**
    * Check `event.status` to distinguish between `'Upcoming'` (Pre-Event) and `'Completed'` (Post-Event).
3.  **Implement 'Pre-Event' View (Scenario Planner):**
    * **Condition:** If `status === 'Upcoming'`
    * **UI:** Display a "Strategy Builder" instead of simple Up/Down buttons.
    * **Inputs:** Add a simple selector or toggle: "If result is [Good/Bad], I will [Buy/Hold/Sell]".
    * **Action:** Add a "Save Strategy" button (mock functionality is fine).
4.  **Implement 'Post-Event' View (Briefing & Execution):**
    * **Condition:** If `status === 'Completed'`
    * **UI:** Display a "Result Briefing" card.
    * **Content:** Show "Actual vs Consensus" data (e.g., "EPS: Beat by 10%").
    * **Strategy Recall:** Display the user's saved strategy from the Pre-Event phase (e.g., "You planned to Buy").
    * **Actions:** Add two buttons: "Execute Plan" (Primary) and "Revise Plan" (Secondary).

---
> **🔔 NEW TASKS (Requested on YYYY-MM-DD)**
> 다음 작업들은 사용자 피드백을 반영한 개선 및 버그 수정 사항입니다. 순차적으로 진행해주세요.

## ✅ Task 6: Redesign Splash Screen (Logo & Tagline)
**Target File:** `src/components/onboarding/OnboardingFlow.tsx` (step === 'splash')
**Goal:** Replace the current icon with a bold text logo and a meaningful tagline.

**Instructions:**
1.  **Remove Icon:** Delete the existing `Layers` icon container.
2.  **Main Logo:**
    * Render the text **"Hypo"** in a very large size.
    * **Style:** `text-7xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent`.
3.  **Add Tagline:**
    * Below the logo, add the core message: **"자극과 충동이 아닌 논리와 스토리로 투자하기"**
    * **Style:** `text-xl text-zinc-400 mt-4 font-medium tracking-tight`.

## ✅ Task 7: Update Onboarding Final Step Copy
**Target File:** `src/components/onboarding/OnboardingFlow.tsx` (step === 'permission')
**Goal:** Update the heading and description text based on user feedback, including dynamic user name binding.

**Instructions:**
1.  Get the `user.name` from the `useStore` hook.
2.  **Update Heading:**
    * Change from: "이 기준이 흔들릴 때만 알림을 드릴게요."
    * Change to: "단순한 시세 변동이 아니라<br/>**내 가설에 대한 시사점**을 알려드릴게요." (Apply emphasis color to bold part).
3.  **Update Description:**
    * Change from: "불필요한 시세 알림으로 방해하지 않습니다."
    * Change to: `"${user.name}님의 판단을 기다립니다."`

## ✅ Task 8: Fix My Thesis Tab Data Display (Bug Fix)
**Target File:**
1.  `src/contexts/StoreContext.tsx` (Data)
2.  `src/components/MyThesisTab.tsx` (UI)
**Goal:** Show Korean stock names and actual holdings/profit data instead of current price/change rate.

**Instructions:**
1.  **Data Update (`StoreContext.tsx`):**
    * Ensure all `ALL_STOCKS` and `initialData.user.holdings` use Korean names for `name` property (e.g., "Alphabet A" -> "구글", "NVIDIA" -> "엔비디아").
2.  **UI Update (`MyThesisTab.tsx`):**
    * Instead of displaying `stock.ticker` as the main title, display `stock.name` (Korean name). You can show ticker smaller below it.
    * **Right Side Data:** Replace `stock.currentPrice` and `stock.changeRate` with the user's actual holding data.
        * Find the corresponding holding data from `data.user.holdings` using the ticker.
        * Display **Valuation** (평가액, e.g., "23,520,000원") nicely formatted.
        * Display **Total Profit Rate** (누적 수익률, e.g., "+111.7%") with appropriate color (`app-positive`/`app-negative`).

## ✅ Task 9: Fix Post-Onboarding Navigation Logic
**Target Files:**
1.  `src/App.tsx`
2.  `src/components/onboarding/OnboardingFlow.tsx`
**Goal:** After onboarding, navigate directly to the *Detail Modal* of the selected stock, not just the My Thesis tab.

**Instructions:**
1.  **Modify callback (`App.tsx`):** Update the `handleOnboardingComplete` function to accept the `addedStockThesis` object as an argument.
2.  **Navigation Logic (`App.tsx`):** Inside `handleOnboardingComplete`:
    * Set `setActiveTab('my-thesis')`.
    * Set `setSelectedStock(addedStockThesis)` to immediately open its detail modal.
3.  **Call with data (`OnboardingFlow.tsx`):** In `handleFinalComplete`, grab the newly created thesis object (returned from `addToMyThesis` or found in store) and pass it to the `onComplete(newThesis)` callback.

## ✅ Task 10: Revamp Quiz "Context" UX (Toggle instead of Modal)
**Target Files:**
1.  `src/types.ts` (Data Structure)
2.  `src/contexts/StoreContext.tsx` (Data Content)
3.  `src/components/onboarding/OnboardingFlow.tsx` (UI implementation)
**Goal:** Replace the 'IDK' modal with an inline, structured "Related Info" toggle for *every* question.

**Instructions:**
1.  **Data Structure Update (`types.ts`):**
    * Remove `learningContext` from `QuizQuestion`.
    * Add a new field: `relatedInfo: { title: string; content: string[] }`. `content` is an array of strings for bullet points. Support simple markdown-like highlighting (e.g., asterisks `*text*`) in the strings.
2.  **Data Content Update (`StoreContext.tsx`):**
    * For **ALL** questions in `ALL_STOCKS`, populate the `relatedInfo` field with structured data relevant to the question.
    * *Example:* For Google Search antitrust:
        * `title`: "검색 독점 소송 핵심 요약"
        * `content`: ["미 법무부는 구글이 *불법적인 계약*으로 경쟁을 막았다고 주장합니다.", "패소 시 최악의 경우 *사업 부문 매각* 명령이 내려질 수 있습니다.", "하지만 실제 분할까지는 *수년이 걸리는 지루한 법정 공방*이 예상됩니다."]
3.  **UI Implementation (`OnboardingFlow.tsx`):**
    * Remove the "힌트 보기" icon/button from the 'idk' option.
    * Below the list of options, add a "관련 내용 보기" toggle button (e.g., using `ChevronDown/Up`).
    * When expanded, render the `relatedInfo` in a styled container (e.g., `bg-white/5 p-4 rounded-xl mt-4`).
    * Render the `content` array as a bulleted list. Implement a simple parser to style text wrapped in `*` with `text-app-accent` or bold white.

---
> **🔔 MAJOR UX OVERHAUL (Requested on YYYY-MM-DD)**
> "이벤트 대응"과 "가설 관리" 경험을 전면 개편합니다.

## ✅ Task 11: Revamp "My Logic Management" UI (Visual Hierarchy)
**Target File:** `src/components/StockDetailModal.tsx` (Logic Section)
**Goal:** Make the "Logic Health" section the most prominent part of the modal and visualize decision outcomes.

**Instructions:**
1.  **Visual Emphasis:**
    * **Container:** Change background from transparent/dark to a distinct, slightly lighter card style (e.g., `bg-[#1E1E1E] border-l-4 border-app-accent`).
    * **Typography:** Increase the title font size (`text-xl` or `2xl`) and make it bold white.
2.  **Remove Components:**
    * Delete the "Recent 3-month validity" graph (progress bar) entirely.
3.  **Update History Items (Performance Visualization):**
    * **Structure:** Update the history list to include user decisions.
    * **New Item Type:** Add a "Decision Log" type.
    * **Visual:** If the log is a User Decision, display a **"Performance Badge"**.
        * *Example 1 (Success):* "🎯 Pre-emptive Sell (+5% Saved)" (Text: "주가 하락 전 매도 성공") -> Green/Blue Badge.
        * *Example 2 (Miss):* "🥀 Missed Opportunity" -> Gray Badge.
    * **Implementation:** Mock up 1-2 examples of these decision logs in the dummy data.

## ✅ Task 12: Implement Unified 5-Step Event Carousel
**Target File:** `src/components/StockDetailModal.tsx` (Event Section)
**Goal:** Replace the vertical scroll event card with a **Horizontal Swiper (Carousel)** that guides the user through 5 specific steps.

**Instructions:**
1.  **UI Layout:**
    * Use a horizontal scroll container (snap-x) or a carousel library logic.
    * **Step Indicators:** Show dots (e.g., `○ ● ○ ○ ○`) at the bottom to indicate current step (1 of 5).
2.  **The 5-Step Content Structure (Unified for Pre/Post):**
    * **Card 1: Info (정보)** - Event Title, D-Day, Key Facts.
    * **Card 2: Reaction (반응)** - Market Data (Price/Volume) or Consensus.
    * **Card 3: Analysis (분석)** - "Hypo's Insight" (Why is this happening?).
    * **Card 4: Context (맥락)** - Long-term view / Validity check.
    * **Card 5: Proposition (제안)** - Action Buttons (Buy/Hold/Sell).
3.  **Navigation:**
    * User swipes right to see the next logic step.
    * The "Action Buttons" are only available on the final card (Step 5).

## ✅ Task 13: Implement "Action Log" (Collapsible Archive)
**Target File:** `src/components/StockDetailModal.tsx`
**Goal:** Clean up the interface by archiving completed events into a compact, toggleable list at the bottom (Accordion Style).
**Instructions:**
1.  **State Management:**
    * Continue tracking `completedEventIds`.
    * Add local state for toggling items: `const [expandedEventId, setExpandedEventId] = useState<number | null>(null);` (Allow only one open at a time, or multiple).
2.  **Section Layout:**
    * Create a new section at the **very bottom** of the modal: "지난 대응 내역 (Action Log)".
    * This section should only appear if there are completed events.
3.  **Compact Row Design (Collapsed State):**
    * **Style:** A thin, clickable row (height ~56px). Background `bg-[#1E1E1E]`, border-b `border-white/5`.
    * **Content:**
        * **Left:** Event Title (e.g., "Q3 Earnings").
        * **Right:** User's Decision Badge (Small) + Chevron Icon (Down).
        * *Example Badge:* "✅ 매수 완료" (Green text/bg) or "👀 관망" (Gray text/bg).
4.  **Expanded State:**
    * When a row is clicked, expand to show the full context or a summary of that event card.
    * Use a smooth height transition (animate-in).
5.  **Rendering Logic:**
    * Move any event present in `completedEventIds` from the top "Active" area to this bottom "Action Log" list.