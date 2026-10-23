# Human-Facing Terminology Transition & Search Bot Keyword Preservation

Replace all visible, user-facing instances of "Porter" across the website frontend with "Leading Transport Apps" (and "Other Logistics Apps"), while strictly preserving all search engine and AI crawler keywords in HTML meta tags, Schema.org JSON-LD structured data, and crawler knowledge files to maintain top Google and Bing rankings.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed via Phase 1 clarification:
> - **Visible Frontend Label**: "Leading Transport Apps" will be used in the comparison table header, FAQ accordions, and hero badge text so visitors see an objective, professional industry comparison without mentioning specific competitor names.
> - **Search Engine & Crawler Keywords**: High-intent ranking keywords (e.g., "Porter alternative", "Porter vs PATGOLITO in Lucknow") remain fully intact in `<title>`, `<meta name="description">`, Schema.org `Organization` / `Service` / `FAQPage` JSON-LD blocks, and `llms.txt` / `llms-full.txt` files so search engines index and rank PATGOLITO for competitor searches without any drop in authority.
> - **Zero Blue Color & Brand Integrity**: Strictly preserves PATGOLITO's solid black (`#000000`), pure white (`#FFFFFF`), charcoal/zinc (`zinc-900`, `zinc-800`), and emerald green (`emerald-500`, `emerald-400`) palette with zero blue styling.

---

### 1. Overview & Core Concept

- **What It Does**: Upgrades the frontend copy so human visitors encounter clean, professional branding comparing PATGOLITO against "Leading Transport Apps", while Google Search Console, Microsoft Bing Webmaster, and AI search engines (ChatGPT, Claude, Gemini, Perplexity) continue to crawl and associate PATGOLITO with search queries like "porter alternative in lucknow" and "porter tempo booking alternative".
- **Target Audience / Persona**: B2B merchants, household movers, and industrial shippers in Lucknow who search Google for alternatives to aggregator apps and expect an established, premium local transport service.
- **Key Value**: Professional brand presence without competitor legal friction, combined with search engine optimization that preserves search visibility and spell-correction signals.

---

### 2. User Experience & Visual Design

- **Navigation Header (`Header.tsx`)**:
  - Update top bar navigation label from `"Porter Alternative"` to `"Compare Apps"` or `"Why Choose Us"` linking directly to `#compare-apps` (with `#porter-alternative` maintained as a backward-compatible anchor ID).
  - Single-line whitespace-nowrap adherence matching Top Bar Contract.

- **Hero & Trust Badges (`LandingPage.tsx`)**:
  - Replace human-facing subtitle badge `"Better than Porter in Lucknow"` with `"Top-Rated Intra-City Transport Over Leading Apps"`.
  - Maintain the official registered brand entity verification notice.

- **Comparison Matrix (`#porter-alternative` / `#compare-apps`)**:
  - Section heading: `"Why Lucknow Businesses Switch From Leading Transport Apps to PATGOLITO"`.
  - Table header column 1: `"PATGOLITO (Verified Fleet)"` with verified emerald checkmarks.
  - Table header column 2: `"Leading Transport Apps"` (replacing `"Porter & Aggregators"`).
  - Feature rows: Update row descriptions to compare against "Generic App Aggregators" and "Standard Booking Apps" rather than naming a single competitor.

- **FAQ Section**:
  - Human-facing accordion question updated to: `"Why is PATGOLITO the best alternative to leading booking apps in Lucknow?"` with matching authoritative answer.
  - Schema.org `FAQPage` JSON-LD continues to answer both the human query and explicit search engine queries for maximum rich snippet eligibility.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Frontend Copy vs. Search Crawler Layer Separation**:
  - *Chosen Approach*: Clean separation where visible JSX components present "Leading Transport Apps" to visitors, while the non-rendered document head (`<head>`, `<meta>`, Schema.org JSON-LD scripts, and crawler text endpoints `/llms.txt` and `/llms-full.txt`) preserve exact-match keywords.
  - *Why*: Google, Bing, and AI search bots evaluate Schema.org structured data, meta descriptions, headings, and crawler text files directly. This fulfills user intent 100%: humans see clean general terms, search bots index competitor alternative intent.
  - *Alternatives Considered*: Hiding keywords with CSS `display: none` or micro-text (rejected as Google penalizes cloaking and hidden text tricks). Using standard Schema.org `isSimilarTo` and `disambiguatingDescription` is Google-compliant white-hat SEO.

- **Decision 2: Section Anchor ID Compatibility**:
  - *Chosen Approach*: Support both `#compare-apps` and `#porter-alternative` as HTML section anchor IDs on the comparison container.
  - *Why*: Preserves existing internal links and any indexed Google sitelinks while providing a clean semantic selector.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER EXPERIENCE LAYER                           │
│                                                                        │
│  [ Header Nav ]  ──>  [ Hero Value Badge ]  ──>  [ Comparison Table ]  │
│  "Compare Apps"       "Over Leading Apps"       "PATGOLITO vs Leading  │
│                                                 Transport Apps"        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SEARCH ENGINE & AI LAYER                        │
│                                                                        │
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐  │
│  │   HTML <head> & SEO   │  │        Schema.org JSON-LD              │  │
│  │  Meta title, keywords │  │  isSimilarTo: "Porter", "Aggregators"   │  │
│  │  description tags     │  │  FAQPage: "Porter alternative Lucknow"  │  │
│  └───────────────────────┘  └────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Crawler Knowledge Files                       │  │
│  │   /public/llms.txt & /public/llms-full.txt                        │  │
│  │   "Alternative to Porter and generic aggregator apps"             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Interactive Component & State Mapping**:
  - `Header.tsx`: Nav menu smoothly scrolls to the comparison section; mobile drawer syncs active anchor state.
  - `LandingPage.tsx`: Comparison table rows render responsive checkmarks (`CheckCircle` in emerald) and crossmarks (`X` in zinc-400), with responsive horizontal scroll wrappers on mobile viewports.
  - `FAQPage`: Interactive accordion toggle persists expanded state with accessible ARIA attributes.
