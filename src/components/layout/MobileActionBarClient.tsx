"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { stripLocalePrefix } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/LocaleProvider";

export function MobileActionBarClient() {
  const rawPathname = usePathname() || "/";
  const pathname = stripLocalePrefix(rawPathname);
  const { dict } = useI18n();

  if (pathname === "/plan-your-journey" || pathname.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(dict.mobileBar.whatsappGreeting)}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-lg gpu-layer">
      <div className="flex items-center gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#10B981] py-2.5 text-xs font-bold text-white shadow-sm active:bg-[#059669] transition-all"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{dict.mobileBar.whatsapp}</span>
        </a>

        <Link
          href="/plan-your-journey"
          className="flex-[1.3] inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0F284E] py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white shadow-md active:bg-[#1A3E72] transition-all"
        >
          <Calendar className="h-4 w-4 text-[#FACC15] shrink-0" />
          <span className="truncate">{dict.mobileBar.planJourney}</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FACC15] text-[#091A34] shrink-0">
            <ArrowRight className="h-2.5 w-2.5 stroke-[3]" />
          </span>
        </Link>
      </div>
    </div>
  );
}
