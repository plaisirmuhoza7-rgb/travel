import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { ArrowRight, MessageSquare } from "lucide-react";
import landcruiserImg from "../../../public/landcruiser.png";
import manypImg from "../../../public/manyp.png";
import coastersImg from "../../../public/coasters.png";
import hiaceImg from "../../../public/hiace.png";
import { getServerDictionary } from "@/lib/i18n/server";

const EVENT_IMAGE_MAP: Record<string, StaticImageData> = {
  weddings: landcruiserImg,
  "corporate-meetings": manypImg,
  conferences: coastersImg,
  "other-events": hiaceImg,
};

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.eventsTitle,
    description: dict.metadata.eventsDescription,
  };
}

export default async function EventsPage() {
  const { dict } = await getServerDictionary();
  const whatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(dict.events.whatsappGreeting)}`;

  return (
    <div style={{ backgroundColor: "#F8FAFC", color: "#0F172A" }} className="w-full bg-[#F8FAFC] text-[#0F172A]">
      {/* CLEAN ARCHITECTURAL HERO */}
      <section
        style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}
        className="relative bg-white border-b border-[#E2E8F0] py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div
                style={{
                  backgroundColor: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  color: "#063726",
                  width: "fit-content",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                }}
                className="inline-flex items-center gap-2 rounded-full text-[11px] font-extrabold uppercase tracking-[0.18em]"
              >
                <span
                  style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#10B981" }}
                  className="inline-block shrink-0"
                />
                <span>{dict.events.badge}</span>
              </div>

              <h1
                style={{ color: "#0F284E" }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.08]"
              >
                {dict.events.titlePrefix}
                <span style={{ color: "#063726" }}>{dict.events.titleHighlight}</span>
                <span style={{ color: "#FACC15" }}>.</span>
              </h1>

              <p
                style={{ color: "#475569" }}
                className="text-base sm:text-lg font-medium max-w-xl leading-relaxed"
              >
                {dict.events.subtitle}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/plan-your-journey?service=wedding-event"
                  style={{
                    backgroundColor: "#FACC15",
                    color: "#091A34",
                    padding: "13px 26px",
                    borderRadius: "12px",
                  }}
                  className="inline-flex items-center gap-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm hover:opacity-95 active:scale-[0.98] transition-all group"
                >
                  <span>{dict.events.planEventCta}</span>
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "9999px",
                      backgroundColor: "#091A34",
                      color: "#FACC15",
                    }}
                    className="inline-flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5"
                  >
                    <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                </Link>

                <a
                  href="#event-types"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#0F284E",
                    border: "1px solid #CBD5E1",
                    padding: "13px 24px",
                    borderRadius: "12px",
                  }}
                  className="inline-flex items-center gap-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-slate-50 transition-all"
                >
                  <span>{dict.events.viewOccasionsCta}</span>
                </a>
              </div>
            </div>

            {/* Right Clean Dark Blue & Dark Green Fleet Summary Card */}
            <div className="lg:col-span-5">
              <div
                style={{
                  background: "linear-gradient(135deg, #091A34 0%, #0F284E 55%, #063726 100%)",
                  borderRadius: "24px",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  padding: "28px",
                  color: "#FFFFFF",
                }}
                className="relative overflow-hidden shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                    <span
                      style={{ color: "#FACC15" }}
                      className="text-[11px] font-extrabold uppercase tracking-[0.18em]"
                    >
                      {dict.events.readinessTitle}
                    </span>
                    <span
                      style={{
                        backgroundColor: "rgba(16, 185, 129, 0.18)",
                        color: "#10B981",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                      }}
                      className="text-[10px] font-extrabold uppercase tracking-wider shrink-0"
                    >
                      {dict.events.readinessLocation}
                    </span>
                  </div>

                  {dict.events.heroHighlights.map((item, idx) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 py-2.5"
                      style={
                        idx < dict.events.heroHighlights.length - 1
                          ? { borderBottom: "1px solid rgba(255,255,255,0.1)" }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "9999px",
                            backgroundColor: item.dot,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ color: "#FFFFFF" }} className="text-sm font-bold">
                          {item.label}
                        </span>
                      </div>
                      <span style={{ color: "#CBD5E1" }} className="text-xs font-medium text-right">
                        {item.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT CARDS GRID */}
      <section
        id="event-types"
        className="py-14 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-[#E2E8F0] pb-6">
          <div>
            <span
              style={{ color: "#059669" }}
              className="text-xs font-extrabold uppercase tracking-[0.18em]"
            >
              {dict.events.fleetEyebrow}
            </span>
            <h2
              style={{ color: "#0F284E" }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1"
            >
              {dict.events.fleetTitle}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#0F284E",
              color: "#FFFFFF",
              padding: "8px 16px",
              borderRadius: "9999px",
              width: "fit-content",
            }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider shrink-0"
          >
            <span
              style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#FACC15" }}
              className="inline-block shrink-0"
            />
            <span>{dict.events.categoriesBadge}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dict.events.items.map((event) => (
            <Link
              key={event.slug}
              href={event.href}
              aria-label={`${dict.events.bookAriaPrefix}${event.title}`}
              className="group relative flex flex-col rounded-3xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm hover:border-[#0F284E] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-1.5 w-full flex">
                <div style={{ backgroundColor: "#0F284E" }} className="w-1/2" />
                <div style={{ backgroundColor: "#063726" }} className="w-1/2" />
              </div>

              <div className="p-3.5 pb-0">
                <div
                  style={{ backgroundColor: "#091A34" }}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl"
                >
                  <Image
                    src={EVENT_IMAGE_MAP[event.slug] ?? landcruiserImg}
                    alt={event.alt}
                    fill
                    placeholder="blur"
                    priority={event.priority}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div
                    style={{
                      background:
                        "linear-gradient(to top, rgba(9, 26, 52, 0.65) 0%, transparent 55%)",
                    }}
                    className="absolute inset-0 pointer-events-none"
                  />

                  <div
                    style={{
                      backgroundColor: "rgba(9, 26, 52, 0.85)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.18)",
                      padding: "5px 12px",
                      borderRadius: "9999px",
                    }}
                    className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-2 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider"
                  >
                    <span
                      style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#FACC15" }}
                      className="inline-block shrink-0"
                    />
                    <span>
                      {event.number} · {event.badge}
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: "rgba(6, 55, 38, 0.9)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      padding: "4px 10px",
                      borderRadius: "8px",
                    }}
                    className="absolute bottom-3 right-3.5 z-10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider"
                  >
                    {event.fleetTag}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex items-center justify-between gap-4">
                <div>
                  <h3
                    style={{ color: "#0F284E" }}
                    className="text-xl sm:text-2xl font-extrabold tracking-tight group-hover:text-[#225193] transition-colors"
                  >
                    {event.title}
                  </h3>
                  <p style={{ color: "#475569" }} className="text-sm font-medium mt-1">
                    {event.line}
                  </p>
                </div>

                <span
                  style={{
                    backgroundColor: "#FACC15",
                    color: "#091A34",
                    padding: "11px 16px",
                    borderRadius: "12px",
                  }}
                  className="inline-flex shrink-0 items-center gap-2 text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all group-hover:bg-[#EAB308]"
                >
                  <span>{dict.common.book}</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3] transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3-STEP STRIP */}
      <section className="pb-16 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dict.events.steps.map((step) => (
            <div
              key={step.num}
              className="flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-xs"
            >
              <span
                style={{
                  backgroundColor: step.bg,
                  color: "#FACC15",
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                }}
                className="flex shrink-0 items-center justify-center text-sm font-black shadow-xs"
              >
                {step.num}
              </span>
              <span
                style={{ color: "#0F284E" }}
                className="text-base sm:text-lg font-extrabold tracking-tight"
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-24">
        <div
          style={{
            background: "linear-gradient(135deg, #063726 0%, #072B2E 50%, #091A34 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "24px",
          }}
          className="relative overflow-hidden p-8 sm:p-12 md:p-14 text-white shadow-2xl"
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div
                style={{
                  backgroundColor: "rgba(4, 36, 25, 0.85)",
                  border: "1px solid rgba(250, 204, 21, 0.45)",
                  color: "#FACC15",
                  width: "fit-content",
                  padding: "5px 14px",
                  borderRadius: "9999px",
                }}
                className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em]"
              >
                <span
                  style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#FACC15" }}
                  className="inline-block shrink-0"
                />
                <span>{dict.events.closingBadge}</span>
              </div>
              <h2 style={{ color: "#FFFFFF" }} className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {dict.events.closingTitle}
              </h2>
              <p style={{ color: "#E2E8F0" }} className="text-sm sm:text-base font-medium">
                {dict.events.closingSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <Link
                href="/plan-your-journey?service=wedding-event"
                style={{
                  backgroundColor: "#FACC15",
                  color: "#091A34",
                  padding: "15px 28px",
                  borderRadius: "12px",
                }}
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-[0.98] transition-all"
              >
                <span>{dict.common.bookNow}</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#10B981",
                  color: "#FFFFFF",
                  padding: "15px 24px",
                  borderRadius: "12px",
                }}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md hover:opacity-95 transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{dict.common.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
