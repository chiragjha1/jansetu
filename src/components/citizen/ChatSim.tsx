"use client";

import { useState } from "react";
import { Send, Bot, User, MessageCircle, Mic } from "lucide-react";

interface ChatSimProps {
  onMessageSubmit: (messageText: string) => void;
  initialText?: string;
}

export function ChatSim({ onMessageSubmit, initialText = "" }: ChatSimProps) {
  const [messages, setMessages] = useState<Array<{ sender: "bot" | "user"; text: string; time: string }>>([
    {
      sender: "bot",
      text: "Namaste! I am JanSetu AI Assistant. Please describe what infrastructure need or problem your village is facing (road, drinking water, health centre, school, or electricity). You can write in Hindi, Odia, Tamil, or English.",
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState(initialText);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: "Just now" },
      { sender: "bot", text: "Thank you. Preparing your submission to the JanSetu Ledger...", time: "Just now" },
    ]);
    onMessageSubmit(userMsg);
    setInputText("");
  };

  return (
    <div className="bg-[#efeae2] border border-slate-300 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[400px]">
      {/* WhatsApp Header Bar */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">JanSetu Civic Helpline</h4>
            <span className="text-[11px] text-emerald-200 block">WhatsApp Channel (Simulated for Demo)</span>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded font-mono">
          Online
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                m.sender === "user"
                  ? "bg-[#dcf8c6] text-slate-900 rounded-tr-none"
                  : "bg-white text-slate-900 rounded-tl-none border border-slate-200"
              }`}
            >
              <div className="flex items-center gap-1 mb-1 text-[10px] font-bold text-slate-400">
                {m.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-[#075e54]" />}
                <span>{m.sender === "user" ? "You" : "JanSetu Assistant"}</span>
              </div>
              <p className="font-medium text-slate-800">{m.text}</p>
              <span className="text-[9px] text-slate-400 block text-right mt-1">{m.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-[#f0f2f5] p-2.5 border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message in your language..."
          className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-800 focus:outline-[#075e54]"
        />
        <button
          type="button"
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-[#075e54] hover:bg-[#128c7e] text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
