"use client";

import React, { useState } from "react";
import type { AssetSlot } from "@/lib/assets";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizeAssetSlot } from "@/lib/i18n/catalog";

interface PlaceholderImageClientProps {
  slot: AssetSlot;
  className?: string;
  aspectRatioClass?: string;
  showDetails?: boolean;
}

export function PlaceholderImageClient({
  slot,
  className = "",
  aspectRatioClass,
  showDetails = true,
}: PlaceholderImageClientProps) {
  const [hasError, setHasError] = useState(false);
  const { locale, dict } = useI18n();
  const localizedSlot = localizeAssetSlot(slot, locale);

  const ratioMap: Record<string, string> = {
    "16/9": "aspect-[16/9]",
    "16/10": "aspect-[16/10]",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "1/1": "aspect-square",
    auto: "h-full w-full min-h-[140px]",
  };

  const selectedRatio = aspectRatioClass || ratioMap[localizedSlot.aspectRatio] || "aspect-[16/10]";

  if (!hasError && localizedSlot.publicPath) {
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-slate-900/5 transition-all duration-300 hover:border-[#3B82F6] hover:shadow-md will-change-transform ${selectedRatio} ${className}`}
        role="img"
        aria-label={localizedSlot.alt}
      >
        <img
          src={localizedSlot.publicPath}
          alt={localizedSlot.alt}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-slate-50/80 transition-all duration-300 hover:border-[#3B82F6] hover:shadow-md will-change-transform ${selectedRatio} ${className}`}
      role="img"
      aria-label={localizedSlot.alt}
      style={{ contentVisibility: "auto", containIntrinsicSize: "300px 200px" }}
    >
      {/* Background Architectural Grid Lines in slate blue */}
      <div className="absolute inset-0 bg-[radial-gradient(#225193_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      {/* Top accent badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-[#0F284E] border border-slate-200/80 shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
        <span>{dict.placeholderImage.photoSlotBadge}</span>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F284E]/10 border border-[#0F284E]/20 text-[#0F284E] transition-transform duration-300 group-hover:scale-105 shadow-xs">
          <ImageIcon className="h-6 w-6 stroke-[1.75]" />
        </div>

        <h4 className="text-base font-bold tracking-tight text-[#0F284E] sm:text-lg">
          {localizedSlot.title}
        </h4>

        {showDetails && (
          <div className="mt-2.5 flex flex-col items-center gap-1.5 text-[11px] text-[#475569]">
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-[#0F284E] border border-slate-200 shadow-2xs">
              <Sparkles className="h-3 w-3 text-[#FACC15]" />
              {localizedSlot.recommendedSize}
            </span>
            <span className="font-mono text-[10px] text-[#64748B] tracking-tight">
              {dict.placeholderImage.replaceAtPrefix}
              {localizedSlot.publicPath}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
