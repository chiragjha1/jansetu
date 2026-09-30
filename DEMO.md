# JanSetu: 4-Minute Hackathon Demo Click-Path & Pitch Script

**Track**: Track 1: AI for Digital Infrastructure & Governance  
**Product**: JanSetu (Demand-to-Delivery Ledger for Indian Governance)  
**Target Duration**: Exactly 4 Minutes  

---

## ⏱️ Minute 0:00 – 0:45: The Problem & The Solution (Screen: `/`)
- **Action**: Open `http://localhost:3000/`. Point out the persistent honesty badge: *"Demo data: synthetic requests + illustrative indicators"*.
- **Speaker Script**:
  > *"Every year in India, millions of citizens call panchayat helplines, send WhatsApp notes, or file grievances about broken roads, saline water, or dark schools. But these citizen voices vanish into administrative silos. Meanwhile, district collectors and department heads struggle to allocate hundreds of crores of central scheme budgets—like PMGSY or Jal Jeevan Mission—relying on static paperwork without grassroots demand data.*
  >
  > *Meet **JanSetu**—a multilingual Digital Public Good that turns unstructured citizen voice and text in Indian languages into an explainable, budget-aligned priority ledger for policymakers, and closes the delivery loop with Gemini vision photo verification."*

---

## ⏱️ Minute 0:45 – 1:30: Citizen Voice & Structured Extraction (Screen: `/report`)
- **Action**: Click **"Submit Community Need"** or navigate to `/report`.
- **Action**:
  1. Select **Rajasthan &rarr; Barmer**, village name: *"Baytu"*.
  2. Switch to the **WhatsApp channel** tab (or **Voice** / **Text**).
  3. Submit the Hindi prompt:  
     `"हमारे गांव में मुख्य संपर्क सड़क बहुत खराब है, एंबुलेंस नहीं आ सकती। तुरंत डामर सड़क बनवाएं।"`
  4. Click **Submit to JanSetu Ledger**.
- **Observation**:
  - The structured result card pops up:
    - **Language Detected**: Hindi
    - **Category**: Road (`PMGSY` eligible)
    - **Urgency**: 4 / 5 (emergency ambulance access blocked)
    - **English Translation**: *"Main village access road heavily damaged, ambulance cannot enter. Asphalt road needed immediately."*
    - **Tracking Ticket ID**: `TICKET-RAJ-xxxxxx`
- **Speaker Script**:
  > *"Gemini 2.5 Flash transcribed and extracted the structured intent without the citizen having to learn bureaucratic forms. Notice the English translation generated specifically for district magistrates and scheme officers."*

---

## ⏱️ Minute 1:30 – 2:30: Policymaker Ledger & Deterministic Scoring (Screen: `/dashboard`)
- **Action**: Click **Policymaker Dashboard** in the top navigation.
- **Observation**:
  - Point to the **KPI row**: 160+ requests synthesized into distinct community needs with live budget utilization.
  - Point to the **Ranked Table** on the left and the **GIS Leaflet Map** on the right with district hotspot circles sized by community need.
- **Action (Acceptance Test 3)**:
  - Drag the **Service Gap** slider to `60%` or click the **"Equity First"** preset.
  - Notice the table re-ranks **INSTANTLY** in the browser. Green up-arrows and red down-arrows show rank movements.
  - Click the **"What Changed?"** button.
- **Observation**:
  - Gemini reads *only* the top 5 movers and generates a 3-sentence plain-English summary of which projects rose and why.
- **Action (Acceptance Test 4)**:
  - Click **"Edit Scheme Caps"** in the Budget panel. Reduce `PMGSY` budget to `0 Cr`.
  - Notice road projects instantly switch to **"Unfunded"** and automatically attempt fallback to secondary schemes (like `MGNREGA`).
- **Speaker Script**:
  > *"Rule number one of our architecture: Gemini does language and reasoning ONLY. All prioritization math and budget allocation is 100% deterministic TypeScript in `/lib/scoring.ts` with 7 passing unit tests. Policymakers can adjust weights for Equity or Urgency and see immediate explainable shifts."*

---

## ⏱️ Minute 2:30 – 3:15: Closing the Loop with Vision Verification (Screen: `/verify/[projectId]`)
- **Action**:
  - Click on any funded project row (e.g. `PRJ-RAJ-001` or `PRJ-TAM-003`).
  - The right-side drawer opens with plain-language *"Why this rank"* and citizen quotes.
  - Click **"Upload Completion Photo"** (navigates to `/verify/...`).
- **Action**:
  - Select one of the demo completion photos (e.g., *Fresh Asphalt Road* or *PHC Solar Unit*).
  - Click **"Run Gemini Vision Verification"**.
- **Observation**:
  - Gemini multimodal vision inspects the physical evidence and returns:
    - **Verdict**: `VERIFIED`
    - **Confidence**: `98%`
    - **Evidence Notes (max 30 words)**: *"Physical inspection confirms newly laid blacktop asphalt road with graded culvert matching PMGSY rural specifications."*
  - Click **"Confirm & Notify Citizens"**.
- **Speaker Script**:
  > *"Now we close the loop. When local contractors claim a road or water plant is built, the field officer uploads a completion photo. Gemini multimodal vision verifies completion against the citizen's original complaint before public funds are signed off."*

---

## ⏱️ Minute 3:15 – 4:00: Citizen Lifecycle Tracking & Federated States (Screen: `/track/...`)
- **Action**:
  - Click **"View Citizen Timeline"** or open `/track/TICKET-DEMO-03`.
  - Show the 5-stage vertical timeline:
    1. *Request Received* &rarr; 2. *Grouped into Community Need* &rarr; 3. *Prioritised in Ledger* &rarr; 4. *Funded under NHM* &rarr; 5. *Completed & Verified by Vision* (with the photo displayed).
- **Action (Acceptance Test 5)**:
  - Return to `/dashboard`. Switch state tabs to **Odisha (Odia)** and **Tamil Nadu (Tamil)**.
  - Point out that all 3 states run on the exact same codebase driven purely by JSON configs.
  - Click **"/method"** to show the complete transparency page.
- **Speaker Script**:
  > *"The citizen opens their SMS or tracking link and sees proof of delivery with the actual photo of their completed clinic or road. And because JanSetu is completely config-driven, expanding from Rajasthan to Odisha and Tamil Nadu took zero code changes. JanSetu bridges demand to delivery with AI you can trust."*
