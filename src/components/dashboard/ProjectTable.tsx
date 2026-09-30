"use client";

import {
  Droplets,
  Truck,
  HeartPulse,
  GraduationCap,
  Zap,
  Sparkles,
  Home,
  Waves,
  Layers,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { Category, Project } from "@/lib/types";

interface ProjectTableProps {
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (p: Project) => void;
}

export function getCategoryIcon(cat: Category) {
  switch (cat) {
    case "water":
      return <Droplets className="w-4 h-4 text-sky-600" />;
    case "road":
      return <Truck className="w-4 h-4 text-amber-600" />;
    case "health":
      return <HeartPulse className="w-4 h-4 text-rose-600" />;
    case "education":
      return <GraduationCap className="w-4 h-4 text-indigo-600" />;
    case "electricity":
      return <Zap className="w-4 h-4 text-yellow-600" />;
    case "sanitation":
      return <Sparkles className="w-4 h-4 text-teal-600" />;
    case "housing":
      return <Home className="w-4 h-4 text-orange-600" />;
    case "irrigation":
      return <Waves className="w-4 h-4 text-cyan-600" />;
    default:
      return <Layers className="w-4 h-4 text-slate-600" />;
  }
}

export function ProjectTable({
  projects,
  selectedProjectId,
  onSelectProject,
}: ProjectTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3 w-16 text-center">Rank</th>
              <th className="py-3 px-3">Need &amp; Location</th>
              <th className="py-3 px-3 w-28">Population</th>
              <th className="py-3 px-3 w-32">Priority Score</th>
              <th className="py-3 px-3 w-28">Scheme</th>
              <th className="py-3 px-3 w-32 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => {
              const rankDelta =
                p.previous_rank !== undefined && p.rank !== undefined
                  ? p.previous_rank - p.rank
                  : 0;

              const isSelected = selectedProjectId === p.id;
              const isFunded = p.funding_status === "Funded";

              return (
                <tr
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50/80 font-medium" : ""
                  }`}
                >
                  {/* Rank with delta indicator */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-bold text-slate-900 text-base">#{p.rank}</span>
                      {rankDelta > 0 && (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
                          <ArrowUp className="w-3 h-3" />
                          {rankDelta}
                        </span>
                      )}
                      {rankDelta < 0 && (
                        <span className="inline-flex items-center text-[10px] font-bold text-rose-600">
                          <ArrowDown className="w-3 h-3" />
                          {Math.abs(rankDelta)}
                        </span>
                      )}
                      {rankDelta === 0 && (
                        <Minus className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </td>

                  {/* Need & Location */}
                  <td className="py-3 px-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 flex-shrink-0">
                        {getCategoryIcon(p.category)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {p.title}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="capitalize font-medium text-slate-700">
                            {p.district}
                          </span>
                          <span>&bull;</span>
                          <span>{p.issue_count} requests ({p.unique_citizens} citizens)</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Population */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-slate-700 text-xs">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.est_affected_population.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ₹{p.est_cost_crore} Cr
                    </div>
                  </td>

                  {/* Priority Bar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>{p.priority_score.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          p.priority_score >= 80
                            ? "bg-blue-600"
                            : p.priority_score >= 60
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                        style={{ width: `${Math.min(100, p.priority_score)}%` }}
                      />
                    </div>
                  </td>

                  {/* Scheme Badge */}
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-800 rounded border border-slate-200">
                      {p.allocated_scheme_id || p.scheme_routing?.primary_scheme_id || "Unrouted"}
                    </span>
                  </td>

                  {/* Status Chip */}
                  <td className="py-3 px-3 text-center">
                    {isFunded ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Funded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Unfunded
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
