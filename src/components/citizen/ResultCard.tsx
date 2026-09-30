"use client";

import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, Edit3, Sparkles, ShieldCheck } from "lucide-react";
import { ExtractionResult } from "@/lib/types";
import { getCategoryIcon } from "@/components/dashboard/ProjectTable";

interface ResultCardProps {
  ticketId: string;
  projectId?: string;
  extraction: ExtractionResult;
  isLiveAi?: boolean;
  onEdit: () => void;
  langCode?: string;
}

export function ResultCard({
  ticketId,
  projectId,
  extraction,
  isLiveAi = true,
  onEdit,
  langCode = "en",
}: ResultCardProps) {
  return (
    <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-md animate-in fade-in zoom-in-95 duration-200">
      {/* Success Badge */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">
              Here is what we understood
            </h3>
            <p className="text-xs text-slate-500">
              Verified by Gemini multimodal language analysis
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
            isLiveAi
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-slate-100 text-slate-700 border-slate-300"
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>{isLiveAi ? "Live Google AI" : "Saved AI Result"}</span>
        </span>
      </div>

      {/* Ticket ID Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
            Your Tracking Ticket ID
          </span>
          <span className="font-mono text-base font-black text-blue-700">{ticketId}</span>
        </div>
        <Link
          href={`/track/${ticketId}`}
          className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
        >
          <span>Track Lifecycle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Structured Extraction Details */}
      <div className="space-y-4 mb-6">
        {/* Category & Urgency */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">
              Assigned Category
            </span>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-white shadow-2xs">
                {getCategoryIcon(extraction.category)}
              </div>
              <span className="font-bold text-slate-900 capitalize text-sm">
                {extraction.category}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block mb-1">
              Urgency Assessment
            </span>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-amber-600">
                {extraction.urgency} / 5
              </span>
              <span className="text-[11px] text-slate-500 line-clamp-1">
                ({extraction.urgency_reason})
              </span>
            </div>
          </div>
        </div>

        {/* English Translation */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">
            English Translation for Administrative Officers
          </span>
          <p className="text-xs md:text-sm text-slate-800 font-medium leading-relaxed italic">
            "{extraction.translation_en}"
          </p>
        </div>

        {/* Sub-Issue & Estimated Impact */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 gap-2">
          <span>
            <strong>Sub-Issue:</strong> {extraction.sub_issue}
          </span>
          {extraction.affected_population_estimate && (
            <span>
              <strong>Estimated Beneficiaries:</strong> {extraction.affected_population_estimate.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href={`/track/${ticketId}`}
          className="w-full sm:flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <span>Track My Request Progress</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={onEdit}
          className="w-full sm:w-auto px-4 py-2.5 inline-flex items-center justify-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-semibold transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Not right? Fix it</span>
        </button>
      </div>
    </div>
  );
}
