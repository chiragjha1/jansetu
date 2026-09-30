"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Project, VerificationResult } from "@/lib/types";
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Upload,
  RefreshCw,
} from "lucide-react";
import { getCategoryIcon } from "@/components/dashboard/ProjectTable";

const SAMPLE_COMPLETION_PHOTOS = [
  {
    label: "Fresh Asphalt Road (PMGSY)",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15e0?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "Drinking Water Tap Standpost (JJM)",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15e0?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "Primary Health Centre Solar Unit (NHM)",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "School Classroom Addition (Samagra Shiksha)",
    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=60",
  },
];

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Photo states
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>(SAMPLE_COMPLETION_PHOTOS[0].url);
  const [afterPhotoBase64, setAfterPhotoBase64] = useState<string | null>(null);

  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [verdictData, setVerdictData] = useState<{
    verification: VerificationResult;
    is_live_ai: boolean;
  } | null>(null);

  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const p = data.projects?.find((item: Project) => item.id === projectId);
        if (p) {
          setProject(p);
          // If already verified, populate verdictData
          if (p.verification) {
            setVerdictData({
              verification: p.verification,
              is_live_ai: false,
            });
            setConfirmed(true);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAfterPhotoUrl(url);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      setAfterPhotoBase64(base64String);
      setVerdictData(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunVerification = async () => {
    if (!project) return;
    setVerifying(true);
    try {
      const res = await fetch("/api/verify-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          after_photo_base64: afterPhotoBase64 || undefined,
          after_photo_url: afterPhotoUrl,
        }),
      });
      const data = await res.json();
      if (data.verification) {
        setVerdictData({
          verification: data.verification,
          is_live_ai: data.is_live_ai,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmCompletion = async () => {
    if (!project || !verdictData) return;
    setConfirming(true);
    try {
      const res = await fetch("/api/verify-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          confirm: true,
          after_photo_url: afterPhotoUrl,
          evidence_notes: verdictData.verification.evidence_notes,
          verdict: verdictData.verification.verdict,
        }),
      });

      if (res.ok) {
        setConfirmed(true);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to confirm completion in ledger.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-700" />
        <p className="text-sm font-semibold">Loading verification inspection portal...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Project Not Found</h2>
        <Link href="/dashboard" className="text-xs text-blue-700 underline font-semibold">
          Return to Policymaker Dashboard
        </Link>
      </div>
    );
  }

  const linkedTicket = project.request_ids[0];

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Policymaker Dashboard</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Delivery Verification Loop
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-mono font-bold text-blue-700">{project.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 capitalize">
              {project.district} district &bull; Scheme: {project.allocated_scheme_id || project.scheme_routing?.primary_scheme_id} &bull; Est: ₹{project.est_cost_crore} Cr
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {project.issue_count} Citizen Requests
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left: Reported Need (Before) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                1. Citizen Reported Need (Before)
              </span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Baseline Issue
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-100 h-56 mb-3 border border-slate-200 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1574360801682-1c4e33045c58?w=800&auto=format&fit=crop&q=60"
                alt="Reported Need Condition"
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2 py-1 rounded">
                Reported by {project.unique_citizens} citizens
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-200">
              "{project.sub_issue}"
            </p>
          </div>
        </div>

        {/* Right: Officer After Photo */}
        <div className="bg-white border-2 border-blue-600 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                2. Officer Completion Photo (After)
              </span>
              <label className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer">
                <Upload className="w-3 h-3 inline mr-1" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-100 h-56 mb-3 border border-slate-200 flex items-center justify-center">
              <img
                src={afterPhotoUrl}
                alt="Officer Completion Evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2 py-1 rounded">
                Field Evidence Submission
              </div>
            </div>

            {/* Quick Preset Selector for Easy Demo Testing */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-400 font-medium flex-shrink-0">Demo Samples:</span>
              {SAMPLE_COMPLETION_PHOTOS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAfterPhotoUrl(s.url);
                    setAfterPhotoBase64(null);
                    setVerdictData(null);
                  }}
                  className={`px-2 py-0.5 rounded border transition-colors flex-shrink-0 cursor-pointer ${
                    afterPhotoUrl === s.url
                      ? "bg-blue-100 text-blue-800 border-blue-300 font-bold"
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {s.label.split("(")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleRunVerification}
              disabled={verifying}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} />
              <span>{verifying ? "Gemini Vision Analyzing..." : "Run Gemini Vision Verification"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gemini Vision Verdict Card */}
      {verdictData && (
        <div
          className={`border-2 rounded-2xl p-6 shadow-md mb-8 animate-in fade-in duration-200 ${
            verdictData.verification.verdict === "verified"
              ? "bg-emerald-50/70 border-emerald-500"
              : verdictData.verification.verdict === "unclear"
              ? "bg-amber-50/70 border-amber-500"
              : "bg-rose-50/70 border-rose-500"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                  verdictData.verification.verdict === "verified"
                    ? "bg-emerald-600"
                    : verdictData.verification.verdict === "unclear"
                    ? "bg-amber-500"
                    : "bg-rose-600"
                }`}
              >
                {verdictData.verification.verdict === "verified" ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : verdictData.verification.verdict === "unclear" ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <XCircle className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                  Gemini Multimodal Vision Analysis
                </span>
                <h3 className="text-xl font-black text-slate-900 uppercase">
                  VERDICT: {verdictData.verification.verdict.replace("_", " ")}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800">
                Confidence: {Math.round(verdictData.verification.confidence * 100)}%
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-white border border-slate-200 text-purple-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{verdictData.is_live_ai ? "Live Gemini Vision" : "AI Saved Result"}</span>
              </span>
            </div>
          </div>

          {/* 30-word evidence note */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Field Evidence Summary (Max 30 words)
            </span>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              "{verdictData.verification.evidence_notes}"
            </p>
          </div>

          {/* Officer Confirmation Action */}
          {confirmed ? (
            <div className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-white" />
                <div>
                  <h4 className="font-bold text-sm">Delivery Confirmed &amp; Recorded in Ledger</h4>
                  <p className="text-xs text-emerald-100">
                    Citizens tracking ticket #{linkedTicket} can now see the verified completion status.
                  </p>
                </div>
              </div>
              <Link
                href={`/track/${linkedTicket}`}
                className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-lg hover:bg-emerald-50 transition-colors shadow-2xs"
              >
                View Citizen Timeline &rarr;
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-600 font-medium">
                Officer must click confirm to officially close the delivery loop and notify citizens.
              </p>
              <button
                type="button"
                onClick={handleConfirmCompletion}
                disabled={confirming}
                className="w-full sm:w-auto min-h-[48px] px-6 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{confirming ? "Recording in Ledger..." : "Confirm & Notify Citizens"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
