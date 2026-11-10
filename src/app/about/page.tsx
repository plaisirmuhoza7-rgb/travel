import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Compass,
  Sparkles,
} from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.aboutTitle,
    description: dict.metadata.aboutDescription,
  };
}

export default async function AboutPage() {
  const { dict } = await getServerDictionary();
  const standardIcons = [CheckCircle2, Clock, ShieldCheck, Compass];
  const whatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(dict.about.whatsappGreeting)}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A]">
      {/* 1. LUMINOUS ARCHITECTURAL HERO WITH /ev.png SHOWCASE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061226] via-[#0F284E] to-[#063726] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="pointer-events-none absolute -top-28 left-1/4 h-96 w-96 rounded-full bg-[#225193]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-12 h-96 w-96 rounded-full bg-[#10B981]/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-[#FACC15]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Editorial Hero Column */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/40 bg-[#063726]/80 px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#10B981] shadow-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#FACC15]" />
                <span>{dict.about.heroBadge}</span>
              </div>

              <div className="space-y-5">
                <h1 className="text-[2.15rem] sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-white leading-[1.1]">
                  <span className="block">{dict.about.heroLine1}</span>
                  <span className="block text-[#FACC15] mt-1.5">
                    {dict.about.heroLine2}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-200 leading-[1.8] max-w-xl font-normal">
                  {dict.about.heroBody}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/plan-your-journey"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#FACC15] hover:border-[#EAB308] px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#061226] shadow-[0_12px_28px_-6px_rgba(250,204,21,0.38)] active:scale-[0.98] transition-all"
                >
                  <span>{dict.about.planJourney}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#061226] text-[#FACC15] transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                </Link>

                <Link
                  href="/fleet"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 hover:bg-white/15 px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-xs transition-all"
                >
                  <span>{dict.about.exploreFleet}</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-7 border-t border-white/15">
                {dict.about.stats.map((st, idx) => (
                  <div key={st.label}>
                    <span
                      className={`block text-lg sm:text-2xl font-extrabold tracking-tight ${
                        idx === 0
                          ? "text-[#FACC15]"
                          : idx === 2
                          ? "text-[#10B981]"
                          : "text-white"
                      }`}
                    >
                      {st.value}
                    </span>
                    <span className="mt-1 block text-xs sm:text-sm text-slate-300 leading-snug">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Shining Vehicle Showcase (/ev.png) */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-[#FACC15]/25 via-[#10B981]/20 to-[#225193]/40 blur-2xl opacity-80" />

                <div className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-[#091A34] shadow-[0_32px_80px_-15px_rgba(0,0,0,0.7)]">
                  <div className="h-1 w-full bg-gradient-to-r from-[#FACC15] via-[#10B981] to-[#225193]" />

                  <div className="relative aspect-square sm:aspect-[10/9] w-full overflow-hidden">
                    <Image
                      src="/ev.png"
                      alt={dict.about.imageAlt}
                      fill
                      preload
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-[center_58%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061226]/90 via-[#061226]/10 to-transparent" />

                    <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#061226]/70 backdrop-blur-md border border-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md">
                      <Sparkles className="h-3.5 w-3.5 text-[#FACC15]" />
                      <span>{dict.about.imageTag}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#061226]/75 backdrop-blur-md border border-white/15 px-5 py-4 shadow-xl">
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FACC15]">
                          {dict.about.opsEyebrow}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-white/95 mt-0.5">
                          {dict.about.opsSubtitle}
                        </p>
                      </div>
                      <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                        <span>{dict.about.verifiedFleet}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY & OPERATING STANDARDS */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 sm:mb-20">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block text-xs font-extrabold uppercase tracking-[0.18em] text-[#059669]">
                {dict.about.storyEyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#0F284E] tracking-tight leading-[1.14]">
                {dict.about.storyTitle}
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-base sm:text-[17px] text-[#475569] leading-[1.85]">
              <p>{dict.about.storyP1}</p>
              <p>{dict.about.storyP2}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8">
            {dict.about.standards.map((item, idx) => {
              const Icon = standardIcons[idx] ?? CheckCircle2;
              return (
                <div
                  key={item.title}
                  className="group rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] p-8 flex flex-col gap-5 hover:bg-white hover:border-[#FACC15] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F284E] text-[#FACC15] shadow-xs transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-extrabold text-[#0F284E] tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-[#475569] leading-[1.75]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 sm:py-28 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0F284E] shadow-2xs">
              <HelpCircle className="h-3.5 w-3.5 text-[#059669]" />
              <span>{dict.about.faqBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F284E] tracking-tight leading-tight">
              {dict.about.faqTitle}
            </h2>

            <p className="text-base sm:text-[17px] text-[#64748B] leading-[1.75]">
              {dict.about.faqSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {dict.about.faqs.map((item, i) => (
              <article
                key={item.q}
                className="rounded-3xl bg-white border border-[#E2E8F0] p-8 sm:p-10 shadow-[0_12px_32px_-16px_rgba(15,40,78,0.08)] hover:border-[#0F284E]/25 hover:shadow-[0_20px_48px_-16px_rgba(15,40,78,0.14)] transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F284E] text-xs font-black tracking-wider text-[#FACC15] shadow-xs">
                    0{i + 1}
                  </span>
                  <span className="rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#059669]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#0F284E] leading-[1.45] tracking-tight">
                  {item.q}
                </h3>

                <div className="my-5 h-px w-full bg-[#F1F5F9]" />

                <p className="text-[15px] sm:text-base text-[#475569] leading-[1.85] font-normal">
                  {item.a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLOSING GAHANGA HUB & CONCIERGE INVITATION */}
      <section className="pb-20 sm:pb-28 pt-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061226] via-[#0F284E] to-[#063726] border border-[#10B981]/30 p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
            <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#10B981]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FACC15]/40 bg-[#042419]/80 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FACC15]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{dict.about.closingHubBadge}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {dict.about.closingTitle}
                </h2>

                <p className="text-base text-slate-200 leading-[1.75]">
                  {dict.about.closingBodyBefore}
                  <a
                    href="tel:+250784129579"
                    className="font-bold text-[#FACC15] hover:underline underline-offset-4"
                  >
                    {dict.common.phonePrimary}
                  </a>
                  {dict.about.closingBodyOr}
                  <a
                    href="tel:+250781782882"
                    className="font-bold text-white hover:text-[#FACC15] transition-colors"
                  >
                    {dict.common.phoneSecondary}
                  </a>
                  {dict.about.closingBodyAfter}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <Link
                  href="/plan-your-journey"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] px-7 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#061226] shadow-lg active:scale-[0.98] transition-all"
                >
                  <span>{dict.common.bookNow}</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 px-6 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all"
                >
                  <Phone className="h-4 w-4 text-[#FACC15]" />
                  <span>{dict.common.contactUs}</span>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] hover:bg-[#059669] px-6 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{dict.common.whatsappDesk}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
