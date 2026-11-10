"use client";

import React from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function HeaderActions() {
  const { dict } = useI18n();

  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4 shrink-0">
      <LanguageSwitcher variant="header" />

      <a
        href="tel:+250784129579"
        className="hidden xl:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F284E] hover:bg-slate-100 transition-colors whitespace-nowrap"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D1FAE5] text-[#059669]">
          <Phone className="h-3 w-3" />
        </span>
        <span>{dict.common.phonePrimary}</span>
      </a>

      <Link
        href="/plan-your-journey"
        className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-[#0F284E] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1A3E72] hover:shadow-md active:scale-[0.98] transition-all whitespace-nowrap"
      >
        <span>{dict.nav.planJourney}</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-[#091A34]">
          <ArrowRight className="h-3 w-3 stroke-[3]" />
        </span>
      </Link>
    </div>
  );
}
