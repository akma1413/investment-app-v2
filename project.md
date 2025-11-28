# Project Hypo: Logic-Driven Investment Service

## 1. Project Identity & Philosophy
* **Name:** Hypo (하이포)
* **Core Value:** **"Logic-Driven Investment" (논리 기반 투자)**
* **Mission:** To transform emotional, impulse-driven investors into rational, hypothesis-driven investors.
* **Key Shift:**
    * FROM: "How much did the price change today?" (Price-focused)
    * TO: "Is my investment hypothesis still valid?" (Logic-focused)

## 2. Target Audience & Persona
* **Target User:**
    * Financial beginners/intermediates who often fall for FOMO or Panic Selling.
    * Users who lack deep knowledge of macroeconomics, regulations, or industry jargon.
* **Service Persona:** **"The Rational Partner"**
    * **Tone:** Objective, Insightful, yet Empathetic.
    * **Role:** Interprets data into a narrative. Does not dictate actions but provides the context needed for the user to make a decision.

## 3. Core User Experience Principles (UX Rules)

### A. Cognitive Ease (쉬운 접근성)
* **No Jargon:** Translate financial terms into everyday language.
* **Structured Information:** Use bullet points, highlighting, and progressive disclosure (Context Toggles).
* **Guided Decisions (Narrative-Driven):**
    * Do NOT use empty text boxes or rigid "If-Then" calculators.
    * **The 5-Step Narrative Structure:**
        1.  **Info:** What happened? (Fact)
        2.  **Reaction:** How did the price/volume move? (Market Data)
        3.  **Analysis:** Was this priced in? Is it disappointing? (Insight)
        4.  **Context:** When is the next milestone? (Big Picture)
        5.  **Proposition:** "Given this, should we Hold or Sell?" (Judgment Call)

### B. Signal Over Noise (신호와 소음의 분리)
* **Notification Philosophy:** Only alert when **"My Logic"** is affected or an **"Event"** requires a judgment call.
* **Dashboard:** Prioritize "Logic Health" and "Event Briefings" over real-time price tickers.

### C. Source of Truth (데이터 정합성)
* **My Assets:** The user's actual holdings (imported via OCR) are the absolute source of truth.
* **Naming Convention:** Use familiar **Korean Names** (e.g., "구글", "엔비디아").
* **Synchronization:** Ensure 'Insight' tab and 'My Thesis' tab display identical holding data.

---

## 4. Key Features & User Flows

### Phase 1: Onboarding (The Entry)
1.  **Splash:** Bold text logo ("Hypo"). Message: "감이 아닌, 논리로."
2.  **Pain Point Carousel:** Emphasize the pain of panic selling.
3.  **OCR Asset Import:** Import actual holdings from a screenshot.
4.  **Stock Selection:** Select one major stock from actual holdings (e.g., Google, Tesla).
    * *UX Goal:* **"Experience the service's core workflow through a sample case."** (Not just fixing anxiety).
5.  **Hypothesis Quiz:** Multi-step questions with "Related Info" toggles to build a structured Thesis.

### Phase 2: Hypothesis Management (The Core)
* **Location:** `MyThesisTab` & `StockDetailModal`
* **Logic Health (Visual Indicator):**
    * **Green (지지 - Support):** News supports the hypothesis. Thesis is strong.
    * **Yellow (약화 - Weaken):** Warning signs appear. Monitor closely.
    * **Red (위기 - Crisis):** Hypothesis is broken or invalid. Immediate action required.

* **Event Response Loop (Unified Framework):**
    * **Principle:** Whether Pre-Event or Post-Event, the UI structure remains consistent. It focuses on **Information -> Analysis -> Judgment**.
    * **Common Layout:**
        1.  **Header:** Event Title (e.g., "Q3 Earnings").
        2.  **The Briefing:**
            * *Pre-Event:* What is this event? + Market Expectations (Consensus).
            * *Post-Event:* Result Summary + Market Reaction.
        3.  **The Analysis (Insight):** "Price is dropping despite good news (Priced-in)" or "Volume is spiking."
        4.  **The Context:** "Next check-point is next quarter."
        5.  **The Judgment (Proposition):** "Keep waiting?" vs "Take profit?" (User selects an action).

### Phase 3: Discovery (The Expansion)
* **Scenario-Based Search:** Discover stocks via "Stories/Trends".
* **Uninvested View:** Show a "Build Hypothesis" CTA for unowned stocks.

---

## 5. Technical & Design Context

### Tech Stack
* **Framework:** React (Vite) + TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide-React

### Design System Notes
* **Theme:** Dark Mode (Premium).
* **Colors:**
    * `app-bg`: `#121212`
    * `app-accent`: Indigo (`#6366f1`)
    * `app-positive`: Muted Red (`#F87171`)
    * `app-negative`: Muted Blue (`#60A5FA`)
    * **Logic Health Colors:**
        * Support: `#10B981` (Emerald-500)
        * Weaken: `#F59E0B` (Amber-500)
        * Crisis: `#EF4444` (Red-500)

---

## 6. Current Implementation Status (ToDo)
*Ref: Refer to `todo.md` for the active task list.*
* **Active Focus:**
    1.  Syncing OCR data with `MyThesis` tab.
    2.  Implementing "Related Info" toggles in Onboarding.
    3.  Fixing navigation flows from Discovery to Detail.
    4.  **Refactoring Event Loop:** Implementing the unified "Info -> Analysis -> Judgment" flow.