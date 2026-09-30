# JanSetu (जनसेतु) — Pitch Deck Outline

**Google Build with AI: Code for Communities**  
**Track 1: AI for Digital Infrastructure & Governance**  
**Project**: JanSetu — Demand-to-Delivery Ledger for Indian Governance  

---

### Slide 1: Title & Vision
- **Header**: JanSetu (जनसेतु)
- **Sub-header**: The Demand-to-Delivery Ledger for Indian Governance
- **Tagline**: Turning grassroots citizen voices into budget-aligned, explainable development projects—and closing the delivery loop with AI vision.
- **Presenter**: Team JanSetu | Built for Google "Build with AI: Code for Communities" (Track 1)

---

### Slide 2: The Core Problem — The Broken Demand-to-Delivery Loop
- **The Citizen Dilemma**: Millions of rural citizens face chronic infrastructure failure (broken roads, saline water, unpowered health centres). Grievances sent via panchayats, WhatsApp, or voice in local dialects disappear into bureaucratic silos.
- **The Policymaker Dilemma**: District Magistrates and Chief Planning Officers allocate ₹10,000+ Crores of central scheme funds (PMGSY, Jal Jeevan Mission, NHM) using static annual surveys rather than live community demand.
- **The Delivery Gap**: Billions of rupees in public tenders are signed off without verifiable physical inspection, leading to "ghost projects" and incomplete delivery.

---

### Slide 3: The Solution — JanSetu Core Loop
```
Citizen Voice/Text  ──▶  Gemini 2.5 Flash  ──▶  Embedding Dedupe  ──▶  Deterministic Scoring
(Hindi, Odia, Tamil)     (Structured JSON)      (Cosine > 0.82)         (100% TypeScript)
                                                                               │
                                                                               ▼
Citizen Timeline   ◀──  Gemini Vision     ◀──  Officer Photo    ◀──  Scheme Budget Caps
(Closed Delivery)       (Before / After)        (Field Delivery)       (PMGSY, JJM, NHM)
```
- A Digital Public Good (DPG) connecting citizens directly to ministerial budgets with complete explainability.

---

### Slide 4: Non-Negotiable Engineering Principle — Strict AI Partition
- **Rule**: Gemini does **Language & Judgment ONLY**.
- **Gemini's Role**:
  - Transcribing rural audio dialects (voice-first citizen inclusion)
  - Translating Hindi, Odia, Tamil, and Hinglish/Tanglish into structured English
  - Semantic matching to official central scheme criteria
  - Plain-language explainability (*"Why this rank?"* and *"What changed?"*)
  - Multimodal vision verification of completion photos
- **TypeScript's Role**:
  - **100% of mathematical scoring, min-max normalization, and budget allocation is deterministic in `/lib/scoring.ts`**.
  - Unit tested with zero hallucinations or unexplainable numbers.

---

### Slide 5: Pillar 1 — Voice-First Multilingual Citizen Inclusion
- **Zero Login Friction**: No Aadhaar or password barriers; citizens simply pick their village and speak or text.
- **Native Channels**:
  - Browser Web Audio voice recorder (with audio file upload fallback)
  - Text input in Indian scripts
  - Simulated WhatsApp interface familiar to 500M+ Indians
- **Immediate Understanding**: Instant structured result card translated to English with category icon, urgency, and a unique tracking ticket ID.

---

### Slide 6: Pillar 2 — Semantic Grouping & Anti-Spam De-biasing
- **Voice-Gap Demand Adjustment**:
  - Communities with low digital penetration under-report. JanSetu corrects this:  
    `adjusted_demand = demand_per_10k / max(digital_access_rate, 0.2)`
- **Unique Citizen Count**: Spammers submitting 20 complaints count as 1 unique citizen via hashed identifier.
- **Embedding Deduplication**: Submissions in the same district and category with cosine similarity &gt; 0.82 merge into a single community project cluster.

---

### Slide 7: Pillar 3 — Policymaker Ledger & Dynamic Presets
- **Real-Time Interactive Priorities**:
  - 4 Sliders: *Community Need*, *Service Gap*, *Urgency*, *Value for Money*.
  - Instant Presets: **Balanced**, **Equity First** (50% gap weight), **Urgent First**, **Best Value**.
- **Transparent Budget Allocation**:
  - Live allocation against scheme budgets (₹ Crore).
  - When a primary scheme cap is reached, automatically tests secondary scheme eligibility (e.g., PMGSY to MGNREGA).
- **Gemini "What Changed?"**: Narrates the exact rank movers in 3 plain-English sentences without inventing numbers.

---

### Slide 8: Pillar 4 — Closing the Delivery Loop with Gemini Vision
- **The Accountability Crisis**: Government claims work is finished; citizens claim nothing changed.
- **JanSetu Closure**:
  - Field officer uploads an "After" completion photo.
  - Gemini 2.5 Flash Multimodal Vision compares before vs after evidence.
  - Generates a **VERIFIED / UNCLEAR / NOT VERIFIED** verdict with a max-30-word physical evidence note.
  - Officer confirmation permanently records completion in the public ledger and updates the citizen tracking timeline.

---

### Slide 9: Federated Design — 3 Diverse States Shipped
- Built from day one for Indian federalism:
  - **Rajasthan** (Hindi) &bull; 4 Districts: Barmer (Thar Desert water crisis), Udaipur (Tribal hilly roads), Jodhpur, Jaipur.
  - **Odisha** (Odia) &bull; 4 Districts: Koraput (Tribal PHC & road gap), Mayurbhanj, Sambalpur, Khordha.
  - **Tamil Nadu** (Tamil) &bull; 4 Districts: Ramanathapuram (Coastal water salinity), Dharmapuri, Madurai, Chennai.
- **Zero Code Changes**: Adding a state requires adding **one single JSON config file** with district populations, indicators, and scheme budgets.

---

### Slide 10: Demo Safety & Production Readiness
- **Instant Precomputation**: `npm run seed:ai` pre-caches ~160 requests and 69 projects. Works seamlessly online or offline.
- **Demo Reset Button**: One click in the footer restores the clean precomputed demonstration state.
- **System Health Endpoint**: `/api/health` monitors Gemini connectivity and store counters.
- **Honesty Disclosures**: Persistent honesty banner and `/method` page explicitly stating real vs synthetic vs AI-generated components.

---

### Slide 11: Production Scale Roadmap
1. **Gov Channels**: Official WhatsApp Business Cloud API &amp; Bhashini Speech-to-Speech integration.
2. **Data Pipeline**: Ingestion adapters for District Collectorate CSV/NIC grievance dumps.
3. **National Analytics**: Google Cloud BigQuery data sink for inter-state infrastructure benchmarking.
4. **Disbursement**: Direct API hooks to PFMS (Public Financial Management System) for milestone-based fund release upon Gemini vision verification.

---

### Slide 12: Summary & The JanSetu Promise
- **Problem-Solution Fit**: Direct alignment with rural infrastructure allocation and civic accountability.
- **AI Execution**: Gemini 2.5 Flash + Text-Embedding-004 + Multimodal Vision doing genuine, mission-critical cognitive work.
- **Impact**: Shrinks project identification from 18 months of survey delay to real-time grassroots responsiveness.
- **Deployability**: Containerized on Google Cloud Run with single-command `deploy.md`.

*JanSetu: From citizen demand to verified delivery, built for every community across India.*
