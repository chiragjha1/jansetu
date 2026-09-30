import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Calculator,
  Database,
  Building,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";

export default function MethodPage() {
  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 mb-2">
          Transparency &amp; Governance Architecture
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          JanSetu Methodology &amp; Honesty Notice
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
          Full technical disclosure of AI boundaries, deterministic scoring math, data provenance,
          and public governance scaling architecture.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section 1: Data Provenance & Honesty Labels */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-bold text-slate-900">
              1. Data Provenance &amp; Honesty Disclosures
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            In compliance with Digital Public Good and hackathon evaluation standards, all datasets used in this prototype are explicitly classified:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded inline-block mb-2">
                Real (Official)
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Districts &amp; Scheme Guidelines
              </h3>
              <p className="text-xs text-slate-600">
                Official district boundaries, geo-coordinates, and scheme mandate eligibility criteria from MoRD (PMGSY, PMAY-G, MGNREGA), Jal Shakti (JJM), and MoHFW (NHM).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block mb-2">
                Illustrative
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                District Indicators &amp; Budgets
              </h3>
              <p className="text-xs text-slate-600">
                District baseline service indicators (tap water, road connectivity, PHC access) and scheme budget allocations (₹ Crore) are illustrative calibrated figures modeled on Census and NFHS trends.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block mb-2">
                Synthetic
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Citizen Requests
              </h3>
              <p className="text-xs text-slate-600">
                All 160 pre-seeded citizen complaints across Rajasthan, Odisha, and Tamil Nadu are synthetically generated to model realistic rural voice, chat, and text patterns across Indian dialects.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Non-Negotiable AI Boundaries */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-purple-700" />
            <h2 className="text-xl font-bold text-slate-900">
              2. Strict Boundaries on Google Gemini AI
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            In governance platforms, AI must never be a black box that arbitrarily determines public fund distribution. JanSetu enforces a strict functional partition:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What Gemini DOES Do (Language &amp; Judgment)</span>
              </div>
              <ul className="text-xs text-emerald-950 space-y-1.5 list-disc pl-4 font-medium">
                <li>Speech-to-text audio transcription across Indian dialects</li>
                <li>Translation from Hindi, Odia, and Tamil to English</li>
                <li>Categorization and sub-issue extraction</li>
                <li>Synthesizing in-language clarifying questions when ambiguous</li>
                <li>Matching project summaries to official scheme criteria</li>
                <li>Multimodal vision verification of completion photos</li>
                <li>Generating concise plain-English explanations citing computed numbers</li>
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>What Gemini NEVER Does (Math &amp; Ranking)</span>
              </div>
              <ul className="text-xs text-rose-950 space-y-1.5 list-disc pl-4 font-medium">
                <li>NEVER computes priority scores or rankings</li>
                <li>NEVER determines budget allocation or cutoffs</li>
                <li>NEVER performs normalization or arithmetic</li>
                <li>NEVER invents demographic or cost statistics</li>
                <li>All math is deterministic TypeScript in <code>/lib/scoring.ts</code>, 100% unit-tested</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Deterministic Scoring Formula */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-bold text-slate-900">
              3. The Deterministic Scoring Formula
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Project prioritization is computed deterministically across four min-max normalized dimensions:
          </p>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs md:text-sm mb-4 overflow-x-auto leading-relaxed">
            Priority Score = 100 &times; ( w<sub>demand</sub> &times; norm_demand + w<sub>gap</sub> &times; norm_gap + w<sub>urgency</sub> &times; norm_urgency + w<sub>value</sub> &times; norm_value )
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 text-sm block mb-1">
                A. Demand Adjustment (Voice-Gap Correction)
              </strong>
              <code className="text-blue-700 block mb-1">
                demand_per_10k = unique_citizens / district_population &times; 10000
              </code>
              <code className="text-blue-700 block mb-1">
                adjusted_demand = demand_per_10k / max(digital_access_rate, 0.2)
              </code>
              <p className="text-slate-600 mt-1">
                <strong>Why:</strong> Remote and tribal districts with low smartphone or internet penetration under-report compared to urban districts. Normalizing by the digital access rate prevents digital privilege from monopolizing public funds.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 text-sm block mb-1">
                B. Infrastructure Service Gap
              </strong>
              <code className="text-blue-700 block mb-1">
                gap = 1 - district_indicator (e.g., tap_water, road_connectivity)
              </code>
              <p className="text-slate-600 mt-1">
                <strong>Why:</strong> Communities with the lowest existing access receive higher baseline weight, ensuring progressive equity.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 text-sm block mb-1">
                C. Cost-Effectiveness (Benefit per Rupee)
              </strong>
              <code className="text-blue-700 block mb-1">
                benefit_per_rupee = affected_population / est_cost_crore
              </code>
              <p className="text-slate-600 mt-1">
                <strong>Why:</strong> Maximizes citizen utility per rupee spent across competing public works.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Spam Prevention & Deduplication */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-900">
              4. Spam Mitigation &amp; Deduplication
            </h2>
          </div>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong>Rate Limiting:</strong> Enforces a strict ceiling of max 5 submissions per <code>phone_hash</code> per day to prevent automated spamming.
            </p>
            <p>
              <strong>Unique Citizen De-biasing:</strong> While citizen report counts are recorded, demand scoring computes <em>unique phone hashes</em>. A single citizen submitting 20 requests counts as 1 citizen in the priority formula.
            </p>
            <p>
              <strong>Semantic Deduplication:</strong> Submissions in the same district and category with cosine embedding similarity &gt; 0.82 are automatically joined into existing project clusters rather than fragmenting into duplicate tenders.
            </p>
          </div>
        </section>

        {/* Section 5: Federated State Config & Production Scale */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-5 h-5 text-indigo-700" />
            <h2 className="text-xl font-bold text-slate-900">
              5. Federated Scaling Across India
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
            JanSetu is designed from ground up as a zero-code-change federated Digital Public Good.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <p>
              <strong>Adding a New State:</strong> Drop a single JSON file into <code>/config/states/[state_name].json</code> defining districts, population, digital access rates, indicators, and scheme budgets. Zero TypeScript code changes required.
            </p>
            <p>
              <strong>Production Integration Path:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>District Collectorate CSV/API bulk ingestion adapters</li>
              <li>Official WhatsApp Business Cloud API &amp; Bhashini Speech-to-Speech webhook</li>
              <li>Google Cloud BigQuery data sink for national-scale inter-state analytics</li>
              <li>Direct PFMS (Public Financial Management System) disbursement hooks</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
        >
          <span>&larr; Return to Policymaker Dashboard</span>
        </Link>
        <Link
          href="/report"
          className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
        >
          <span>Submit a Citizen Request &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
