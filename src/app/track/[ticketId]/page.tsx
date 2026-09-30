"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CitizenRequest, Project } from "@/lib/types";
import {
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Camera,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Building,
} from "lucide-react";
import { getCategoryIcon } from "@/components/dashboard/ProjectTable";

export default function TrackPage() {
  const params = useParams();
  const ticketId = params?.ticketId as string;

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<CitizenRequest | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    fetch(`/api/track/${ticketId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ticket not found");
        return res.json();
      })
      .then((data) => {
        setRequest(data.request);
        setProject(data.project || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 text-center text-slate-500">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-700" />
        <p className="text-sm font-semibold">Retrieving request lifecycle from ledger...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Ticket Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">
          Ticket ID "{ticketId}" could not be located in the local ledger.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  // Derive stage status
  const isCompleted = project?.status_timeline?.some((t) => t.stage === "completed");
  const isFunded = project?.funding_status === "Funded";
  const completedEntry = project?.status_timeline?.find((t) => t.stage === "completed");

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 md:py-12">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Gateway</span>
      </Link>

      {/* Ticket Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Citizen Tracking Ledger
            </span>
            <h1 className="text-xl font-black text-slate-900 font-mono mt-0.5">
              {request.id}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 capitalize">
              {request.district}, {request.state}
            </span>
            {request.extraction && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                {getCategoryIcon(request.extraction.category)}
                <span className="capitalize">{request.extraction.category}</span>
              </span>
            )}
          </div>
        </div>

        {/* Citizen quote */}
        <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Original Submission ({request.village_text}):
          </span>
          <p className="text-slate-800 font-medium italic">"{request.original_text}"</p>
          {request.extraction?.translation_en && request.extraction.translation_en !== request.original_text && (
            <p className="text-slate-500 text-[11px] mt-1">
              &rarr; {request.extraction.translation_en}
            </p>
          )}
        </div>
      </div>

      {/* Vertical Lifecycle Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-700" />
          <span>Demand-to-Delivery Lifecycle Timeline</span>
        </h2>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {/* STEP 1: Received */}
          <div className="relative">
            <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="font-bold text-slate-900 text-sm">1. Request Received &amp; Transcribed</span>
                <span className="text-slate-400 text-[11px]">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Registered via {request.channel} channel in {request.district} district. Extracted structured category with Gemini.
              </p>
            </div>
          </div>

          {/* STEP 2: Grouped */}
          <div className="relative">
            <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="font-bold text-slate-900 text-sm">2. Grouped into Community Need</span>
                {project && (
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {project.id}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Synthesized with {project?.issue_count || 1} similar citizen requests across {project?.village_texts?.join(", ") || request.village_text} via semantic embedding deduplication.
              </p>
            </div>
          </div>

          {/* STEP 3: Prioritised */}
          <div className="relative">
            <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="font-bold text-slate-900 text-sm">3. Ranked in Priority Ledger</span>
                {project?.rank && (
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    Rank #{project.rank}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Evaluated deterministically on local infrastructure gap, voice-corrected demand, and urgency score.
              </p>
            </div>
          </div>

          {/* STEP 4: Funded / Waiting */}
          <div className="relative">
            <div
              className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs shadow-xs ${
                isFunded ? "bg-emerald-600" : "bg-amber-500"
              }`}
            >
              {isFunded ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="font-bold text-slate-900 text-sm">
                  {isFunded ? "4. Budget Allocated &amp; Scheduled" : "4. Waiting for Scheme Allocation"}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isFunded ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {project?.allocated_scheme_id || project?.scheme_routing?.primary_scheme_id}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isFunded
                  ? `Funded under ${project?.allocated_scheme_id || "Central Scheme"} (₹${project?.est_cost_crore} Cr estimated). Works slated for field execution.`
                  : "Currently positioned as high-priority in next fund sanction window."}
              </p>
            </div>
          </div>

          {/* STEP 5: Completed & Verified */}
          <div className="relative">
            <div
              className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs shadow-xs ${
                isCompleted ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Camera className="w-3.5 h-3.5 text-slate-600" />}
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="font-bold text-slate-900 text-sm">
                  {isCompleted ? "5. Completed &amp; Verified" : "5. Delivery Verification"}
                </span>
                {isCompleted && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by AI Vision
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                {isCompleted
                  ? completedEntry?.note || "Delivery verified by field officer photo evidence."
                  : "Field officer will upload completion photo for Gemini vision verification."}
              </p>

              {/* Show completion photo if verified */}
              {isCompleted && completedEntry?.photo_url && (
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-700 block mb-2">
                    Officer's Verified Completion Photo:
                  </span>
                  <img
                    src={completedEntry.photo_url}
                    alt="Verified Completion"
                    className="w-full h-48 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Officer Verify Shortcut Button */}
        {project && !isCompleted && (
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Are you a government field officer?</span>
            <Link
              href={`/verify/${project.id}`}
              className="font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Verify Project Delivery</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
