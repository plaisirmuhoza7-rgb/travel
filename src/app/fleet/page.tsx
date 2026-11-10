import React from "react";
import { Metadata } from "next";
import { FleetCatalog } from "@/components/fleet/FleetCatalog";
import { repository } from "@/lib/repository";
import { Phone, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.fleetTitle,
    description: dict.metadata.fleetDescription,
  };
}

export default async function FleetPage() {
  const { dict } = await getServerDictionary();
  const vehicles = repository.getVehicles({ onlyPublished: true });
  const categories = repository.getCategories();
  const whatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(dict.fleet.convoyCard.whatsappGreeting)}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* MINIMALIST HEADER: JUST TITLE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F284E]">
          {dict.fleet.pageTitle}
        </h1>
      </div>

      {/* 2. MAIN CATALOG SHOWCASE */}
      <section className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FleetCatalog initialVehicles={vehicles} categories={categories} />
      </section>

      {/* 3. POLISHED LUXURY CONVOY & SPECIAL FLEET SHOWCASE */}
      <section className="pb-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#059669]">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span>{dict.fleet.convoyCard.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F284E] leading-[1.15]">
                {dict.fleet.convoyCard.titleStart}
                <span className="text-[#225193]">{dict.fleet.convoyCard.titleHighlight}</span>
              </h2>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl font-normal">
                {dict.fleet.convoyCard.body}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/plan-your-journey"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#091A34] shadow-sm active:scale-[0.98] transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{dict.fleet.convoyCard.planConvoy}</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F284E] transition-all"
                >
                  <Phone className="h-4 w-4 text-[#10B981]" />
                  <span>{dict.fleet.convoyCard.whatsappDispatch}</span>
                </a>
              </div>
            </div>

            {/* Right Photo Column: Curated high-res multi-vehicle lineup photo */}
            <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200 shadow-md group">
                <img
                  src="/manyp.png"
                  alt={dict.fleet.convoyCard.imageAlt}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 text-white text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FACC15] block">
                      {dict.fleet.convoyCard.imageEyebrow}
                    </span>
                    <span className="font-bold text-sm">{dict.fleet.convoyCard.imageCaption}</span>
                  </div>
                  <span className="rounded-lg bg-[#10B981] px-2.5 py-1 text-[10px] font-extrabold text-[#091A34] shrink-0">
                    {dict.fleet.convoyCard.imageBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
