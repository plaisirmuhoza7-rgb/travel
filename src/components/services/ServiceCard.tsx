import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";
import type { ServiceItem } from "@/lib/seed-data";
import { getServiceVisual } from "@/lib/service-visuals";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizeService, localizeServiceVisual } from "@/lib/i18n/catalog";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  loading?: "eager" | "lazy";
  className?: string;
}

export async function ServiceCard({
  service,
  index,
  loading = "lazy",
  className = "",
}: ServiceCardProps) {
  const { locale, dict } = await getServerDictionary();
  const localizedService = localizeService(service, locale);
  const visual = localizeServiceVisual(
    getServiceVisual(localizedService.slug, index),
    localizedService.slug,
    locale
  );

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-[24px] border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_12px_32px_-14px_rgba(15,40,78,0.1)] hover:border-[#063726] hover:shadow-[0_24px_52px_-16px_rgba(6,55,38,0.2)] hover:-translate-y-1.5 transition-all duration-300 ${className}`}
    >
      {/* Tri-Color Signature Bar: Dark Blue | Dark Green | Yellow */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="w-[40%] bg-[#0F284E]" />
        <div className="w-[35%] bg-[#063726]" />
        <div className="w-[25%] bg-[#FACC15]" />
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* 1. CLEAN SERVICE IMAGE ONLY */}
          <Link
            href={`/services/${localizedService.slug}`}
            aria-label={`${dict.common.view} ${localizedService.name}`}
            className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#091A34] ring-1 ring-inset ring-black/5"
          >
            <Image
              src={visual.image}
              alt={visual.alt}
              fill
              placeholder="blur"
              loading={loading}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* 2. SERVICE NAME ONLY */}
          <div className="pt-4 pb-3.5 min-h-[5.25rem] flex items-center justify-between gap-3">
            <h3 className="text-[17px] sm:text-lg font-extrabold tracking-tight text-[#0F284E] group-hover:text-[#063726] transition-colors leading-snug line-clamp-2">
              {localizedService.name}
            </h3>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#063726] text-[11px] font-black text-[#FACC15] shadow-2xs">
              0{index + 1}
            </span>
          </div>
        </div>

        {/* 3. TWO CTAs: VIEW (Dark Blue) & BOOK (Yellow) */}
        <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-[#E2E8F0]">
          <Link
            href={`/services/${localizedService.slug}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F284E] hover:bg-[#063726] px-3 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-xs hover:shadow-md active:scale-[0.98] transition-all group/view"
          >
            <Eye className="h-3.5 w-3.5 text-[#FACC15]" />
            <span>{dict.common.view}</span>
          </Link>

          <Link
            href={`/plan-your-journey?service=${localizedService.slug}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#FACC15] hover:border-[#EAB308] px-3 py-3 text-xs font-black uppercase tracking-wider text-[#091A34] shadow-xs hover:shadow-md active:scale-[0.98] transition-all group/btn"
          >
            <span>{dict.common.book}</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[3] transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
