"use client";

import { useState, useEffect } from "react";
import { StateConfig, ExtractionResult } from "@/lib/types";
import { I18N_STRINGS, SupportedLanguage } from "@/lib/i18n";
import { VoiceRecorder } from "@/components/citizen/VoiceRecorder";
import { ChatSim } from "@/components/citizen/ChatSim";
import { ResultCard } from "@/components/citizen/ResultCard";
import {
  MapPin,
  Mic,
  FileText,
  MessageCircle,
  Camera,
  Send,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function ReportPage() {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [states, setStates] = useState<StateConfig[]>([]);

  // Step 1: Location
  const [selectedStateId, setSelectedStateId] = useState<string>("rajasthan");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("barmer");
  const [villageText, setVillageText] = useState<string>("");

  // Step 2: Input mode & content
  const [activeTab, setActiveTab] = useState<"voice" | "text" | "chat">("voice");
  const [inputText, setInputText] = useState<string>("");
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>("audio/webm");
  const [photoRef, setPhotoRef] = useState<string | null>(null);

  // Submission state & Result
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    ticket_id: string;
    project_id: string;
    extraction: ExtractionResult;
    is_live_ai: boolean;
  } | null>(null);

  // Clarification state
  const [needsClarification, setNeedsClarification] = useState(false);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);
  const [clarificationReply, setClarificationReply] = useState<string>("");

  const t = I18N_STRINGS[lang] || I18N_STRINGS.en;

  useEffect(() => {
    // Listen to global language picker changes
    const saved = localStorage.getItem("jansetu_lang") as SupportedLanguage;
    if (saved && I18N_STRINGS[saved]) {
      setLang(saved);
    }

    const handler = () => {
      const cur = localStorage.getItem("jansetu_lang") as SupportedLanguage;
      if (cur && I18N_STRINGS[cur]) setLang(cur);
    };
    window.addEventListener("jansetu_lang_change", handler);

    // Fetch states
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.states && data.states.length > 0) {
          setStates(data.states);
          setSelectedStateId(data.states[0].id);
          if (data.states[0].districts.length > 0) {
            setSelectedDistrictId(data.states[0].districts[0].id);
          }
        }
      })
      .catch((e) => console.error(e));

    return () => window.removeEventListener("jansetu_lang_change", handler);
  }, []);

  const currentState = states.find((s) => s.id === selectedStateId);

  const handleStateChange = (newStId: string) => {
    setSelectedStateId(newStId);
    const target = states.find((s) => s.id === newStId);
    if (target && target.districts.length > 0) {
      setSelectedDistrictId(target.districts[0].id);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoRef(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (overrideText?: string) => {
    const textToSend = overrideText || (clarificationReply ? `${inputText} — Clarification: ${clarificationReply}` : inputText);

    if (!textToSend.trim() && !audioBase64) {
      alert("Please provide voice recording or text description of your community need.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: selectedStateId,
          district: selectedDistrictId,
          village_text: villageText || "Village Habitation",
          channel: activeTab,
          original_text: textToSend,
          audio_base64: audioBase64 || undefined,
          mime_type: audioMimeType,
          photo_ref: photoRef || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      if (data.needs_clarification && data.clarifying_question) {
        setNeedsClarification(true);
        setClarifyingQuestion(data.clarifying_question);
        setSubmitting(false);
        return;
      }

      setNeedsClarification(false);
      setSubmissionResult({
        ticket_id: data.ticket_id,
        project_id: data.project_id,
        extraction: data.extraction,
        is_live_ai: data.is_live_ai,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 md:py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          Citizen Reporting Gateway
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-2 tracking-tight">
          {t.reportNeed}
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Render result card once submitted */}
      {submissionResult ? (
        <ResultCard
          ticketId={submissionResult.ticket_id}
          projectId={submissionResult.project_id}
          extraction={submissionResult.extraction}
          isLiveAi={submissionResult.is_live_ai}
          onEdit={() => setSubmissionResult(null)}
          langCode={lang}
        />
      ) : (
        <div className="space-y-6">
          {/* STEP 1: Location */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-700" />
              <span>{t.step1Title}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.selectState}
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:outline-blue-700"
                >
                  {states.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.native_name || st.language_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.selectDistrict}
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:outline-blue-700 capitalize"
                >
                  {currentState?.districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.native_name ? `(${d.native_name})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.villageName}
              </label>
              <input
                type="text"
                value={villageText}
                onChange={(e) => setVillageText(e.target.value)}
                placeholder={t.villagePlaceholder}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-blue-700"
              />
            </div>
          </div>

          {/* STEP 2: Channel Tabs (Voice, Text, Chat) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-700" />
              <span>{t.step2Title}</span>
            </h2>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("voice")}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "voice"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">{t.tabVoice}</span>
                <span className="sm:hidden">Voice</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "text"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">{t.tabText}</span>
                <span className="sm:hidden">Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{t.tabChat}</span>
                <span className="sm:hidden">WhatsApp</span>
              </button>
            </div>

            {/* Voice Input Panel */}
            {activeTab === "voice" && (
              <VoiceRecorder
                onAudioReady={(base64, mime) => {
                  setAudioBase64(base64);
                  setAudioMimeType(mime);
                }}
                onClear={() => setAudioBase64(null)}
                micPromptText={t.micPrompt}
                recordingText={t.recording}
                tapToStopText={t.tapToStop}
              />
            )}

            {/* Text Input Panel */}
            {activeTab === "text" && (
              <div>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.textPlaceholder}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-blue-700 leading-relaxed"
                />
              </div>
            )}

            {/* Simulated WhatsApp Chat Panel */}
            {activeTab === "chat" && (
              <ChatSim
                initialText={inputText}
                onMessageSubmit={(msg) => {
                  setInputText(msg);
                  handleSubmit(msg);
                }}
              />
            )}

            {/* Optional Photo Attachment */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-700 cursor-pointer">
                <Camera className="w-4 h-4 text-slate-500" />
                <span>{photoRef ? "Photo Attached" : t.addPhotoOptional}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photoRef && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready
                </span>
              )}
            </div>
          </div>

          {/* Clarification Box if AI requires further details */}
          {needsClarification && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs animate-in fade-in">
              <div className="flex items-start gap-2.5 mb-3">
                <HelpCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">
                    {t.needClarification}
                  </h3>
                  <p className="text-xs md:text-sm text-amber-950 font-medium mt-1">
                    "{clarifyingQuestion}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={clarificationReply}
                  onChange={(e) => setClarificationReply(e.target.value)}
                  placeholder={t.replyPlaceholder}
                  className="flex-1 bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-amber-600"
                />
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={submitting || !clarificationReply.trim()}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {t.sendReply}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Submit Button */}
          {activeTab !== "chat" && (
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={submitting}
              className="w-full min-h-[52px] inline-flex items-center justify-center gap-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? t.submitting : t.submitButton}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
