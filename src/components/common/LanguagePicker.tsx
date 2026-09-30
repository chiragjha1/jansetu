"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
];

export function LanguagePicker() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("jansetu_lang");
    if (saved) setLang(saved);
  }, []);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("jansetu_lang", newLang);
    window.dispatchEvent(new Event("jansetu_lang_change"));
  };

  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm shadow-sm">
      <Globe className="w-4 h-4 text-slate-500" />
      <select
        value={lang}
        onChange={(e) => changeLang(e.target.value)}
        className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer"
        aria-label="Select language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native} ({l.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
}
