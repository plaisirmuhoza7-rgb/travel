import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";
import { QuickPlannerForm } from "./QuickPlannerForm";
import type { Vehicle } from "@/lib/seed-data";

export async function CompactTripPlanner({
  vehicles = [],
}: {
  vehicles?: Vehicle[];
}) {
  const { dict } = await getServerDictionary();

  return (
    <>
      {/* Mobile-only: lightweight CTA button leading straight to Quick Planner checkout */}
      <div className="md:hidden flex justify-center">
        <Link
          href="/plan-your-journey"
          style={{
            boxShadow: "0 14px 28px -8px rgba(15, 40, 78, 0.25)",
          }}
          className="group w-full max-w-sm sm:w-auto sm:min-w-[280px] min-h-[54px] inline-flex items-center justify-center gap-3 rounded-full bg-[#0F284E] hover:bg-[#1A3E72] active:bg-[#1A3E72] active:scale-[0.98] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white transition-all"
        >
          <span>{dict.home.quickPlanner.eyebrow}</span>
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FACC15] text-[#061226] transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
          </span>
        </Link>
      </div>

      {/* Desktop & tablet: full interactive Quick Trip Planner */}
      <div className="hidden md:block">
        <QuickPlannerForm vehicles={vehicles} />
      </div>
    </>
  );
}
