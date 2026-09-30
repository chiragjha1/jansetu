import type { Metadata } from "next";
import "./globals.css";
import { DemoBadge } from "@/components/common/DemoBadge";
import { LanguagePicker } from "@/components/common/LanguagePicker";
import { Footer } from "@/components/common/Footer";
import Link from "next/link";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "JanSetu — Demand-to-Delivery Ledger for Indian Governance",
  description:
    "Multilingual AI platform turning citizen development requests into a budget-aligned, explainable, ranked ledger for policymakers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <DemoBadge />
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-800 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900 tracking-tight">JanSetu</span>
                  <span className="text-sm font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    जनसेतु
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Demand-to-Delivery Ledger for Indian Governance
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                <Link
                  href="/report"
                  className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Citizen Portal
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Policymaker Dashboard
                </Link>
                <Link
                  href="/method"
                  className="px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Methodology
                </Link>
              </nav>

              <LanguagePicker />
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
