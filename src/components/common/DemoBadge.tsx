import Link from "next/link";
import { Info } from "lucide-react";

export function DemoBadge() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-between">
      <div className="flex items-center gap-2 mx-auto max-w-7xl w-full">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="font-medium">
          Demo data: synthetic citizen requests + illustrative indicators
        </span>
        <span className="hidden sm:inline text-amber-700">|</span>
        <Link
          href="/method"
          className="underline font-semibold hover:text-amber-950 transition-colors ml-auto sm:ml-0"
        >
          View Methodology &amp; Honesty Notice &rarr;
        </Link>
      </div>
    </div>
  );
}
