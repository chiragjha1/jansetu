"use client";

import { useState } from "react";
import { PriorityWeights } from "@/lib/types";
import { PRESET_WEIGHTS, normalizeWeights } from "@/lib/scoring";
import { Sliders, Sparkles, HelpCircle, RefreshCw } from "lucide-react";

interface PrioritySlidersProps {
  weights: PriorityWeights;
  onWeightsChange: (newWeights: PriorityWeights) => void;
  onWhatChanged: () => void;
  isNarrating?: boolean;
}

export function PrioritySliders({
  weights,
  onWeightsChange,
  onWhatChanged,
  isNarrating = false,
}: PrioritySlidersProps) {
  const [activePreset, setActivePreset] = useState<string>("balanced");

  const handlePreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const preset = PRESET_WEIGHTS[presetKey];
    if (preset) {
      onWeightsChange(preset);
    }
  };

  const handleSliderChange = (key: keyof PriorityWeights, rawValue: number) => {
    setActivePreset("custom");
    const updated = { ...weights, [key]: rawValue };
    const normalized = normalizeWeights(updated);
    onWeightsChange(normalized);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Priority Weighting Engine</h3>
            <p className="text-xs text-slate-500">
              Deterministic scoring formula &bull; Sums auto-normalised to 100%
            </p>
          </div>
        </div>

        <button
          onClick={onWhatChanged}
          disabled={isNarrating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 text-blue-600 ${isNarrating ? "animate-spin" : ""}`} />
          <span>{isNarrating ? "Analyzing Movers..." : "What Changed?"}</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => handlePreset("balanced")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            activePreset === "balanced"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          Balanced (25% each)
        </button>
        <button
          onClick={() => handlePreset("equity_first")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            activePreset === "equity_first"
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          Equity First (50% Gap)
        </button>
        <button
          onClick={() => handlePreset("urgent_first")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            activePreset === "urgent_first"
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          Urgent First (50% Urgency)
        </button>
        <button
          onClick={() => handlePreset("best_value")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            activePreset === "best_value"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          Best Value (50% Cost-Effectiveness)
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Slider 1: Community Need */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
            <span>Community Need</span>
            <span className="text-blue-700 font-mono">
              {Math.round(weights.demand * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">Adjusted for digital voice-gap</p>
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={weights.demand}
            onChange={(e) => handleSliderChange("demand", parseFloat(e.target.value))}
            className="w-full accent-blue-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Slider 2: Service Gap */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
            <span>Service Gap</span>
            <span className="text-blue-700 font-mono">
              {Math.round(weights.gap * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">1 - District Infrastructure Index</p>
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={weights.gap}
            onChange={(e) => handleSliderChange("gap", parseFloat(e.target.value))}
            className="w-full accent-blue-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Slider 3: Urgency */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
            <span>Urgency</span>
            <span className="text-amber-600 font-mono">
              {Math.round(weights.urgency * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">Severity of risk to life &amp; health</p>
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={weights.urgency}
            onChange={(e) => handleSliderChange("urgency", parseFloat(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Slider 4: Value for Money */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
            <span>Value for Money</span>
            <span className="text-emerald-600 font-mono">
              {Math.round(weights.value * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">Beneficiaries served per ₹ Crore</p>
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={weights.value}
            onChange={(e) => handleSliderChange("value", parseFloat(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
