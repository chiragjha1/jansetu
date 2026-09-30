"use client";

import { StateConfig, Project } from "@/lib/types";
import { getCategoryIcon } from "./ProjectTable";
import { ArrowRight, Building, CheckCircle2, AlertCircle } from "lucide-react";

interface StateCompareProps {
  states: StateConfig[];
  projectsByState: Record<string, Project[]>;
  onSelectProject: (p: Project) => void;
  onSwitchState: (stateId: string) => void;
}

export function StateCompare({
  states,
  projectsByState,
  onSelectProject,
  onSwitchState,
}: StateCompareProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-700" />
            Federated Multi-State Priority Comparison
          </h3>
          <p className="text-xs text-slate-500">
            Side-by-side top 3 community needs per state &bull; Powered by state-specific configs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {states.map((st) => {
          const stateProjects = (projectsByState[st.id] || []).slice(0, 3);

          return (
            <div
              key={st.id}
              className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{st.name}</h4>
                    <span className="text-[11px] text-slate-500">
                      {st.language_name} ({st.language_code.toUpperCase()}) &bull; {st.districts.length} Districts
                    </span>
                  </div>
                  <button
                    onClick={() => onSwitchState(st.id)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {stateProjects.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="bg-white border border-slate-200/90 hover:border-blue-400 p-2.5 rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="text-blue-700">#{idx + 1}</span>
                          <span className="capitalize text-slate-500">{p.district}</span>
                        </span>
                        <span className="font-mono text-blue-700 font-bold">
                          {p.priority_score.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-100 flex-shrink-0">
                          {getCategoryIcon(p.category)}
                        </div>
                        <p className="text-xs text-slate-800 font-medium line-clamp-1 group-hover:text-blue-700">
                          {p.title}
                        </p>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{p.scheme_routing?.primary_scheme_id}</span>
                        <span
                          className={
                            p.funding_status === "Funded" ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"
                          }
                        >
                          {p.funding_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
