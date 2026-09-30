"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw, Check, Sparkles } from "lucide-react";

export function Footer() {
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = async () => {
    if (resetting) return;
    setResetting(true);
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        setResetDone(true);
        setTimeout(() => {
          setResetDone(false);
          window.location.reload();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">JanSetu (जनसेतु)</span>
          <span>&bull;</span>
          <span>Digital Public Good for Indian Governance</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/method" className="text-blue-700 hover:underline font-medium">
            Methodology &amp; Scoring
          </Link>
          <span className="text-slate-300">|</span>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-slate-700 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            System Health
          </a>
          <span className="text-slate-300">|</span>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Restore all precomputed demo projects and requests"
          >
            {resetDone ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span>Restored!</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3.5 h-3.5 text-slate-600 ${resetting ? "animate-spin" : ""}`} />
                <span>{resetting ? "Resetting..." : "Reset Demo Data"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
