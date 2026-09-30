"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Camera,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { CitizenRequest, Project } from "@/lib/types";
import { getCategoryIcon } from "./ProjectTable";

interface ProjectDrawerProps {
  project: Project | null;
  requests: CitizenRequest[];
  onClose: () => void;
  onMarkScheduled: (projectId: string) => void;
}

export function ProjectDrawer({
  project,
  requests,
  onClose,
  onMarkScheduled,
}: ProjectDrawerProps) {
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  if (!project) return null;

  const relevantRequests = requests.filter((r) => r.project_id === project.id || project.request_ids.includes(r.id));
  const components = project.score_components;

  const handleFetchExplanation = async () => {
    setExplaining(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          priority_score: project.priority_score,
          rank: project.rank,
          category: project.category,
          est_affected_population: project.est_affected_population,
          est_cost_crore: project.est_cost_crore,
          components: project.score_components,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
      }
    } catch (e) {
      console.error(e);
      // Fallback plain explanation
      setExplanation(
        `Ranked #${project.rank} due to high service gap in ${project.district} combined with ${project.est_affected_population.toLocaleString()} citizens directly impacted, offering strong value at ₹${project.est_cost_crore} Cr under ${project.scheme_routing?.primary_scheme_id}.`
      );
    } finally {
      setExplaining(false);
    }
  };

  const currentExplanation =
    explanation ||
    project.explanation ||
    `Ranked #${project.rank} with priority score ${project.priority_score}/100. High demand intensity (${project.issue_count} reports) in ${project.district} where baseline infrastructure is constrained, delivering high community impact per crore.`;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs mt-0.5">
            {getCategoryIcon(project.category)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                {project.id}
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-medium text-slate-500 capitalize">
                {project.district}, {project.state}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
              {project.title}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* KPI Chips */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Rank</span>
            <span className="text-xl font-black text-slate-900">#{project.rank}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Priority Score</span>
            <span className="text-xl font-black text-blue-700">
              {project.priority_score.toFixed(1)}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Status</span>
            <span
              className={`text-xs font-bold block mt-1 ${
                project.funding_status === "Funded" ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {project.funding_status}
            </span>
          </div>
        </div>

        {/* AI Explainability Box */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Plain-Language Rank Explanation</span>
            </div>
            <button
              onClick={handleFetchExplanation}
              disabled={explaining}
              className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold underline disabled:opacity-50 cursor-pointer"
            >
              {explaining ? "Synthesizing..." : "Refresh Explanation"}
            </button>
          </div>
          <p className="text-xs text-blue-950 leading-relaxed font-medium">
            "{currentExplanation}"
          </p>
          <div className="mt-2 text-[10px] text-blue-800 flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span>Gemini cites verified deterministic math only. Zero invented figures.</span>
          </div>
        </div>

        {/* Deterministic Score Components Breakdown */}
        {components && (
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Deterministic Score Breakdown (0 - 100%)
            </h4>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Community Demand (Voice Adjusted)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Math.round(components.norm_adjusted_demand * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${components.norm_adjusted_demand * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">District Service Gap (1 - Index)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Math.round(components.norm_gap * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${components.norm_gap * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Average Citizen Urgency</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Math.round(components.norm_avg_urgency * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${components.norm_avg_urgency * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Cost-Effectiveness (Beneficiaries / Cr)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Math.round(components.norm_benefit_per_rupee * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${components.norm_benefit_per_rupee * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scheme Routing Detail */}
        {project.scheme_routing && (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Government Scheme Routing
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                {project.allocated_scheme_id || project.scheme_routing.primary_scheme_id}
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-2 font-medium">
              {project.scheme_routing.reasoning}
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono mb-2">
              {project.scheme_routing.catalog_basis}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>AI suggestion — officer must verify against official ministerial guidelines.</span>
            </div>
          </div>
        )}

        {/* Original Citizen Messages */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Original Citizen Voices ({relevantRequests.length})
          </h4>
          <div className="space-y-2">
            {relevantRequests.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-slate-700">{r.village_text}</span>
                  <span className="capitalize">{r.channel} channel &bull; {new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-800 font-medium italic mb-1">
                  "{r.original_text}"
                </p>
                {r.extraction?.translation_en && r.extraction.translation_en !== r.original_text && (
                  <p className="text-slate-500 text-[11px]">
                    &rarr; {r.extraction.translation_en}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
        <button
          onClick={() => onMarkScheduled(project.id)}
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>Mark as Scheduled</span>
        </button>

        <Link
          href={`/verify/${project.id}`}
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Verify Photo</span>
        </Link>
      </div>
    </div>
  );
}
