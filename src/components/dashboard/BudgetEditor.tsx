"use client";

import { useState } from "react";
import { Scheme } from "@/lib/types";
import { SchemeBudgetSummary } from "@/lib/scoring";
import { Landmark, AlertTriangle, ShieldCheck } from "lucide-react";

interface BudgetEditorProps {
  schemes: Scheme[];
  budgets: Record<string, number>;
  summaries: Record<string, SchemeBudgetSummary>;
  onBudgetChange: (schemeId: string, newBudget: number) => void;
  onResetBudgets: () => void;
}

export function BudgetEditor({
  schemes,
  budgets,
  summaries,
  onBudgetChange,
  onResetBudgets,
}: BudgetEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Scheme Budget Allocation Ledger</h3>
            <p className="text-xs text-slate-500">
              Live fiscal constraints &bull; Dynamic fallback to secondary schemes upon cap exhaustion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetBudgets}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {isOpen ? "Collapse Caps" : "Edit Scheme Caps"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {schemes.map((scheme) => {
          const total = budgets[scheme.id] ?? scheme.unit_cost_crore * 10;
          const summary = summaries[scheme.id] || {
            allocated_budget: 0,
            remaining_budget: total,
            funded_count: 0,
            unfunded_count: 0,
          };

          const pct = total > 0 ? Math.min(100, Math.round((summary.allocated_budget / total) * 100)) : 100;
          const isExhausted = summary.remaining_budget <= 0.05 || total === 0;

          return (
            <div
              key={scheme.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isExhausted
                  ? "border-rose-300 bg-rose-50/40"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-bold text-xs text-slate-900 block leading-tight">
                    {scheme.id}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
                    {scheme.name}
                  </span>
                </div>
                {isExhausted ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    Cap Hit
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {summary.funded_count} Funded
                  </span>
                )}
              </div>

              {/* Budget amount & live input */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600">
                  Allocated: <strong>₹{summary.allocated_budget.toFixed(1)} Cr</strong>
                </span>
                <span className="text-slate-600">
                  Rem: <strong className={isExhausted ? "text-rose-600" : "text-emerald-700"}>
                    ₹{summary.remaining_budget.toFixed(1)} Cr
                  </strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isExhausted ? "bg-rose-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-600"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Inline editor when opened */}
              {isOpen && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Scheme Cap:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={total}
                      onChange={(e) =>
                        onBudgetChange(scheme.id, Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="w-20 px-2 py-0.5 text-xs text-right font-bold bg-white border border-slate-300 rounded focus:outline-blue-600"
                    />
                    <span className="text-slate-500">Cr</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
