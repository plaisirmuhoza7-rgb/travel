import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Plane, CheckCircle2, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.airportTransfersTitle,
    description: dict.metadata.airportTransfersDescription,
  };
}

export default async function AirportTransfersPage() {
  const { dict } = await getServerDictionary();
  const icons = [Clock, ShieldCheck, CheckCircle2];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BCA77B]/40 bg-[#0B3D2E]/5 px-3 py-1">
            <Plane className="h-3.5 w-3.5 text-[#0B3D2E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0B3D2E]">
              {dict.airportTransfers.badge}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#0B3D2E] leading-tight">
            <span className="block">{dict.airportTransfers.titleLine1}</span>
            <span className="italic font-normal text-[#171D19] block">
              {dict.airportTransfers.titleLine2}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#171D19]/80 leading-relaxed max-w-xl">
            {dict.airportTransfers.body}
          </p>

          <div className="pt-2">
            <Link
              href="/plan-your-journey?service=airport-transfer"
              className="inline-flex items-center gap-2 rounded bg-[#0B3D2E] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] transition-all shadow-sm"
            >
              <span>{dict.airportTransfers.cta}</span>
              <ArrowRight className="h-4 w-4 text-[#BCA77B]" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <PlaceholderImage
            slotId="editorial-airport"
            aspectRatioClass="aspect-[16/10]"
            className="shadow-sm"
          />
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {dict.airportTransfers.features.map((feat, idx) => {
          const Icon = icons[idx] ?? Clock;
          return (
            <div
              key={feat.title}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-white p-6"
            >
              <Icon className="h-6 w-6 text-[#0B3D2E] mb-3" />
              <h3 className="font-display text-lg font-semibold text-[#0B3D2E]">
                {feat.title}
              </h3>
              <p className="text-xs text-[#171D19]/75 mt-1.5 leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
