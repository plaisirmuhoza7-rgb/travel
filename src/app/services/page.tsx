import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { repository } from "@/lib/repository";
import { ServiceCard } from "@/components/services/ServiceCard";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.servicesTitle,
    description: dict.metadata.servicesDescription,
  };
}

export default async function ServicesPage() {
  const { dict } = await getServerDictionary();
  const services = repository.getServices(true);
  const standardIcons = [Clock, ShieldCheck, Sparkles];
  const whatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(dict.servicesPage.whatsappGreeting)}`;

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen">
      {/* 1. ARCHITECTURAL HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061226] via-[#0F284E] to-[#063726] text-white border-b border-[#10B981]/20">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#225193]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-16 h-80 w-80 rounded-full bg-[#10B981]/20 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FACC15]/40 bg-[#042419]/80 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FACC15] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span>{dict.servicesPage.eyebrow}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.08]">
              {dict.servicesPage.titlePrefix}
              <span className="text-[#FACC15]">{dict.servicesPage.titleHighlight}</span>
              <span className="text-[#10B981]">.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              {dict.servicesPage.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/plan-your-journey"
                className="group inline-flex items-center gap-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#091A34] shadow-lg active:scale-[0.98] transition-all"
              >
                <span>{dict.servicesPage.planJourney}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#091A34] text-[#FACC15] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </span>
              </Link>

              <Link
                href="/fleet"
                className="inline-flex items-center gap-2 rounded-xl border border-[#10B981]/50 bg-[#063726]/75 hover:bg-[#063726] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-xs transition-all"
              >
                <span>{dict.servicesPage.exploreFleet}</span>
                <ArrowUpRight className="h-4 w-4 text-[#FACC15]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EQUAL SERVICE CARDS */}
      <section className="py-14 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#063726]/10 border border-[#063726]/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#063726] mb-2">
              <span className="h-2 w-2 rounded-full bg-[#059669]" />
              <span>{dict.servicesPage.selectServiceBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F284E]">
              {dict.servicesPage.sectionHeading}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#0F284E] px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shrink-0 self-start sm:self-auto shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
            <span>{dict.servicesPage.zeroUpfrontBadge}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-7">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              loading={index < 3 ? "eager" : "lazy"}
              className="w-full md:w-[calc((100%-1.75rem)/2)] lg:w-[calc((100%-3.5rem)/3)]"
            />
          ))}
        </div>
      </section>

      {/* 3. SERVICE STANDARDS STRIP */}
      <section className="pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dict.servicesPage.standards.map((item, idx) => {
            const Icon = standardIcons[idx] ?? Clock;
            const isNavy = item.tone === "navy";
            return (
              <div
                key={item.number}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs hover:border-[#FACC15] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[#FACC15] shadow-xs ${
                      isNavy ? "bg-[#0F284E]" : "bg-[#063726]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-extrabold text-[#063726] bg-[#ECFDF5] border border-[#A7F3D0] rounded-full px-3 py-1">
                    {item.number}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0F284E] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLOSING TRUST GUARANTEE BANNER */}
      <section className="pb-20 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063726] via-[#072B2E] to-[#091A34] border border-[#10B981]/30 p-8 sm:p-12 md:p-14 text-white shadow-2xl">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#FACC15]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FACC15]/45 bg-[#042419]/85 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FACC15]">
                <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
                <span>{dict.servicesPage.commitmentBadge}</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {dict.servicesPage.commitmentTitleStart}
                <span className="text-[#FACC15]">
                  {dict.servicesPage.commitmentTitleHighlight}
                </span>
              </h3>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {dict.servicesPage.commitmentBody}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <Link
                href="/plan-your-journey"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] px-7 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#091A34] shadow-lg active:scale-[0.98] transition-all"
              >
                <span>{dict.servicesPage.beginRequest}</span>
                <ArrowRight className="h-4 w-4 stroke-[3] transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] hover:bg-[#059669] px-6 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{dict.servicesPage.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
