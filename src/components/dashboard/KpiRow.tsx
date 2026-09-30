import { MessageSquareText, Layers, CheckCircle, PieChart } from "lucide-react";

interface KpiRowProps {
  requestCount: number;
  projectCount: number;
  fundedCount: number;
  unfundedCount: number;
  budgetAllocatedCrore: number;
  budgetTotalCrore: number;
}

export function KpiRow({
  requestCount,
  projectCount,
  fundedCount,
  unfundedCount,
  budgetAllocatedCrore,
  budgetTotalCrore,
}: KpiRowProps) {
  const budgetUsedPct =
    budgetTotalCrore > 0
      ? Math.min(100, Math.round((budgetAllocatedCrore / budgetTotalCrore) * 100))
      : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KPI 1 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Citizen Requests
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <MessageSquareText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
          {requestCount}
        </div>
        <p className="text-xs text-slate-500 mt-1">Multi-lingual voice, text &amp; chat</p>
      </div>

      {/* KPI 2 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Community Needs
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
          {projectCount}
        </div>
        <p className="text-xs text-slate-500 mt-1">Grouped by embedding dedupe</p>
      </div>

      {/* KPI 3 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Funding Status
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-600">{fundedCount}</span>
          <span className="text-xs text-slate-400">funded /</span>
          <span className="text-sm font-semibold text-rose-600">{unfundedCount} wait</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Constrained by scheme caps</p>
      </div>

      {/* KPI 4 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Budget Utilised
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{budgetUsedPct}%</span>
          <span className="text-xs text-slate-500">
            ({budgetAllocatedCrore.toFixed(1)} / {budgetTotalCrore.toFixed(1)} Cr)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              budgetUsedPct > 90 ? "bg-amber-600" : "bg-blue-600"
            }`}
            style={{ width: `${budgetUsedPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
