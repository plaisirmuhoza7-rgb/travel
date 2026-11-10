"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Vehicle, Category } from "@/lib/seed-data";
import { getAssetSlot } from "@/lib/assets";
import { ArrowRight, ArrowUpRight, RotateCcw, Eye } from "lucide-react";
import { CLIENT_BUILD_VERSION } from "@/lib/client-version";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  localizeAssetSlot,
  localizeCategory,
  localizeVehicle,
} from "@/lib/i18n/catalog";

interface FleetCatalogProps {
  initialVehicles: Vehicle[];
  categories: Category[];
}

export function FleetCatalog({ initialVehicles, categories }: FleetCatalogProps) {
  const { locale, dict } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const _keepIconFactory = ArrowUpRight;

  // Filter logic respecting truthfulness: unknown capacity (null) NEVER satisfies numeric filter
  const filteredVehicles = useMemo(() => {
    return initialVehicles.filter((v) => {
      // Category filter
      if (selectedCategory !== "all") {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (!cat || !v.categoryIds.includes(cat.id)) {
          return false;
        }
      }

      // Capacity filter
      if (minCapacity > 0) {
        if (v.passengerCapacity === null || v.passengerCapacity < minCapacity) {
          return false;
        }
      }

      // Search query filter (match raw and localized strings)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const lv = localizeVehicle(v, locale);
        const matchesName =
          v.name.toLowerCase().includes(q) || lv.name.toLowerCase().includes(q);
        const matchesSubtitle =
          v.subtitle.toLowerCase().includes(q) || lv.subtitle.toLowerCase().includes(q);
        const matchesDesc =
          v.description.toLowerCase().includes(q) ||
          lv.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSubtitle && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [initialVehicles, categories, selectedCategory, minCapacity, searchQuery, locale]);

  const handleReset = () => {
    setSelectedCategory("all");
    setMinCapacity(0);
    setSearchQuery("");
  };

  return (
    <div
      data-v={CLIENT_BUILD_VERSION}
      data-icon={Boolean(_keepIconFactory)}
      className="space-y-8"
    >
      {/* MINIMALIST CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-2 text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[#0F284E] text-white shadow-sm"
              : "bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F284E]/40 hover:text-[#0F284E]"
          }`}
        >
          {dict.fleet.allTab} ({initialVehicles.length})
        </button>
        {categories.map((cat) => {
          const count = initialVehicles.filter((v) => v.categoryIds.includes(cat.id)).length;
          if (count === 0) return null;
          const localizedCat = localizeCategory(cat, locale);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-4 py-2 text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-[#0F284E] text-white shadow-sm"
                  : "bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F284E]/40 hover:text-[#0F284E]"
              }`}
            >
              {localizedCat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* 2. VEHICLES GRID OR EMPTY STATE */}
      {filteredVehicles.length === 0 ? (
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-12 text-center shadow-xs">
          <p className="text-lg font-bold text-[#0F284E]">{dict.fleet.emptyTitle}</p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F284E] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-[#1A3E72] transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{dict.fleet.showAllButton}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {filteredVehicles.map((rawVehicle) => {
            const vehicle = localizeVehicle(rawVehicle, locale);
            const rawSlot = getAssetSlot(vehicle.primaryAssetSlot);
            const slot = rawSlot ? localizeAssetSlot(rawSlot, locale) : undefined;
            const imageSrc = slot?.publicPath || "/manyp.png";

            return (
              <div
                key={vehicle.id}
                className="group relative flex flex-col justify-between rounded-[24px] border border-[#E2E8F0]/95 bg-white p-4 sm:p-5 shadow-[0_10px_28px_-14px_rgba(15,40,78,0.08)] hover:border-[#0F284E]/45 hover:shadow-[0_24px_48px_-16px_rgba(15,40,78,0.16)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* 1. CAR IMAGE ONLY */}
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-[#F1F5F9] ring-1 ring-inset ring-black/5">
                  <img
                    src={imageSrc}
                    alt={slot?.alt || vehicle.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                  />
                </div>

                {/* 2. VEHICLE NAME ONLY */}
                <div className="pt-4 pb-3.5 flex-1 flex items-center">
                  <h3 className="text-[17px] sm:text-lg font-extrabold tracking-tight text-[#0F284E] group-hover:text-[#225193] transition-colors leading-snug">
                    {vehicle.name}
                  </h3>
                </div>

                {/* 3. TWO COLORED CTAs (VIEW OR BOOK) */}
                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                  <Link
                    href={`/fleet/${vehicle.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F284E] hover:bg-[#1A3E72] px-3 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-xs hover:shadow-md active:scale-[0.98] transition-all group/view"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-200 group-hover/view:text-white" />
                    <span>{dict.common.view}</span>
                  </Link>

                  <Link
                    href={`/plan-your-journey?vehicle=${vehicle.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#FACC15] hover:border-[#EAB308] px-3 py-3 text-xs font-black uppercase tracking-wider text-[#091A34] shadow-xs hover:shadow-md active:scale-[0.98] transition-all group/btn"
                  >
                    <span>{dict.common.book}</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[3] transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
