"use client";

import { useState, useRef } from "react";
import { Mic, Square, Play, RotateCcw, Upload, Volume2 } from "lucide-react";

interface VoiceRecorderProps {
  onAudioReady: (base64Audio: string, mimeType: string) => void;
  onClear: () => void;
  micPromptText?: string;
  recordingText?: string;
  tapToStopText?: string;
}

export function VoiceRecorder({
  onAudioReady,
  onClear,
  micPromptText = "Tap and speak in your language",
  recordingText = "Recording in progress... speak clearly",
  tapToStopText = "Tap to finish recording",
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(",")[1];
          onAudioReady(base64String, "audio/webm");
        };

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access unavailable, prompting file upload fallback:", err);
      alert("Microphone permission denied or unsupported. Please use the 'Upload audio file' option below or text input.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setRecordSeconds(0);
    setIsRecording(false);
    onClear();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      onAudioReady(base64String, file.type || "audio/webm");
    };
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
      {!audioUrl && !isRecording && (
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={startRecording}
            className="w-24 h-24 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer mb-3"
            aria-label="Start voice recording"
          >
            <Mic className="w-10 h-10 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Record</span>
          </button>
          <p className="text-sm font-semibold text-slate-800">{micPromptText}</p>
          <p className="text-xs text-slate-500 mt-1">
            Hindi, Odia, Tamil, English &bull; Gemini will transcribe &amp; extract
          </p>

          <div className="mt-4 pt-4 border-t border-slate-200/80 w-full flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Or upload an audio note:</span>
            <label className="text-blue-700 font-semibold underline cursor-pointer hover:text-blue-900">
              <Upload className="w-3.5 h-3.5 inline mr-1" />
              Upload Audio File
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="flex flex-col items-center animate-pulse">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-rose-600 text-white flex flex-col items-center justify-center shadow-xl">
              <Square className="w-8 h-8" />
              <span className="text-xs font-mono font-bold mt-1">
                00:{String(recordSeconds).padStart(2, "0")}
              </span>
            </div>
            <div className="absolute -inset-2 rounded-full border-4 border-rose-400 animate-ping opacity-25" />
          </div>

          <p className="text-sm font-bold text-rose-700">{recordingText}</p>
          <button
            type="button"
            onClick={stopRecording}
            className="mt-3 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
          >
            {tapToStopText}
          </button>
        </div>
      )}

      {audioUrl && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Volume2 className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold text-emerald-800 mb-2">Voice Recording Captured!</p>
          <audio src={audioUrl} controls className="w-full max-w-sm h-10 mb-3" />

          <button
            type="button"
            onClick={resetRecording}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-record Voice</span>
          </button>
        </div>
      )}
    </div>
  );
}
