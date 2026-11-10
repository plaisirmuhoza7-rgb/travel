import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const { dict } = await getServerDictionary();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E] mb-6">
        <Compass className="h-8 w-8 text-[#BCA77B]" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
        {dict.notFound.eyebrow}
      </span>

      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#0B3D2E] mt-2 mb-3">
        {dict.notFound.title}
      </h1>

      <p className="max-w-md text-sm text-[#171D19]/70 leading-relaxed mb-8">
        {dict.notFound.description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded bg-[#0B3D2E] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] transition-all"
        >
          <ArrowLeft className="h-4 w-4 text-[#BCA77B]" />
          <span>{dict.notFound.returnHome}</span>
        </Link>

        <Link
          href="/plan-your-journey"
          className="inline-flex items-center gap-2 rounded border border-[#0B3D2E] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E] hover:bg-[#0B3D2E]/5 transition-all"
        >
          <span>{dict.notFound.planJourney}</span>
        </Link>
      </div>
    </div>
  );
}
