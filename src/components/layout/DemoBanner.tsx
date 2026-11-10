import React from "react";
import { getServerDictionary } from "@/lib/i18n/server";

export async function DemoBanner() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

  if (!isDemo) return null;

  const { dict } = await getServerDictionary();

  return (
    <div className="bg-[#091A34] text-white border-b border-[#225193] py-2 px-4 text-xs font-semibold tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            {dict.demoBanner.badge}
          </span>
          <span className="text-slate-200 hidden sm:inline">
            {dict.demoBanner.desktopText}
          </span>
          <span className="text-slate-200 sm:hidden">
            {dict.demoBanner.mobileText}
          </span>
        </div>
        <span className="text-[#FACC15] text-[11px] font-bold font-mono shrink-0">
          {dict.demoBanner.locationTag}
        </span>
      </div>
    </div>
  );
}
