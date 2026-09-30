import Link from "next/link";
import { store } from "@/lib/store";
import {
  Mic,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Search,
  Building2,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const states = store.getStates();
  const schemes = store.getSchemes();

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col justify-between">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs md:text-sm font-semibold px-3 py-1 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Build with AI: Digital Infrastructure &amp; Governance</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          JanSetu <span className="text-blue-700 font-normal">| जनसेतु</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed">
          The Demand-to-Delivery Ledger for Indian Governance. Connecting grassroots citizen voices
          directly to central &amp; state scheme budgets with explainable, deterministic AI.
        </p>
      </div>

      {/* Two Big Primary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full mb-12">
        {/* Card 1: Citizen */}
        <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 md:p-8 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Mic className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              Citizen Gateway
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">
              I am a citizen — report a community need
            </h2>
            <p className="text-slate-600 text-base mb-6 leading-relaxed">
              Speak or write in <strong>Hindi, Odia, Tamil, or English</strong>. Report village roads,
              drinking water crises, healthcare gaps, or schools. Track your ticket from funding to verified completion.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/report"
              className="w-full min-h-[52px] inline-flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <span>Submit Community Need</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Supports Voice Audio &bull; WhatsApp Tab &bull; Text</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Login Needed
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Policymaker */}
        <div className="bg-white rounded-2xl border-2 border-slate-800 p-6 md:p-8 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              Policymaker Ledger
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">
              I am an officer — view priorities
            </h2>
            <p className="text-slate-600 text-base mb-6 leading-relaxed">
              Explore budget-constrained project rankings, interact with transparent priority sliders
              (equity, urgency, value), inspect GIS district hotspots, and verify photo completion.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full min-h-[52px] inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <span>Open Policymaker Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>3 States &bull; 12 Districts &bull; 6 Central Schemes</span>
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Deterministic Scoring
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Demo Tour Links */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-5xl mx-auto w-full mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-700" />
              Quick Demo Lifecycle Tracker
            </h3>
            <p className="text-xs text-slate-500">
              Jump straight to guaranteed pre-seeded tickets to inspect each stage of delivery.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Live Demo Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/track/TICKET-DEMO-01"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition-colors block group"
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-blue-700">TICKET-DEMO-01</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px]">
                Prioritised &amp; Grouped
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
              Ramsar Drinking Water (Rajasthan)
            </p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              6-month pipeline breakage routed to Jal Jeevan Mission
            </p>
          </Link>

          <Link
            href="/track/TICKET-DEMO-02"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition-colors block group"
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-blue-700">TICKET-DEMO-02</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px]">
                Funded &amp; Scheduled
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
              Lamtaput All-Weather Road (Odisha)
            </p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              Monsoon connectivity funded under PMGSY batch 2026
            </p>
          </Link>

          <Link
            href="/track/TICKET-DEMO-03"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition-colors block group"
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-blue-700">TICKET-DEMO-03</span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
                Completed &amp; Verified
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
              Tiruvadanai PHC Solar Unit (Tamil Nadu)
            </p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              Vaccine cold storage verified with officer completion photo
            </p>
          </Link>
        </div>
      </div>

      {/* Federated States Overview Bar */}
      <div className="border-t border-slate-200 pt-6 max-w-5xl mx-auto w-full">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-slate-400" />
          Active Federated States (Zero code changes to add a state)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {states.map((st) => (
            <div
              key={st.id}
              className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {st.name} ({st.native_name})
                </div>
                <div className="text-xs text-slate-500">
                  {st.language_name} &bull; {st.districts.length} districts configured
                </div>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {st.language_code.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
