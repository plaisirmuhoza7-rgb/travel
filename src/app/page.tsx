import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Eye,
  Sparkles,
  Plane,
  PlaneLanding,
  CalendarCheck,
  Car,
  ShieldCheck,
  Users,
  MessageSquare,
  Globe,
} from "lucide-react";
import type { StaticImageData } from "next/image";
import coasterImg from "../../public/1p.png";
import hiaceImg from "../../public/hiace.png";
import suvImg from "../../public/suv.png";
import evImg from "../../public/ev.png";
import teaImg from "../../public/tea.png";
import landcruiserImg from "../../public/landcruiser.png";
import diaImg from "../../public/dia.png";
import airportImg from "../../public/airport.png";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { CompactTripPlanner } from "@/components/home/CompactTripPlanner";
import { TestimonialsShowcase } from "@/components/home/TestimonialsShowcase";
import { repository } from "@/lib/repository";
import { ServiceCard } from "@/components/services/ServiceCard";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizeVehicle } from "@/lib/i18n/catalog";

const TOP_FEATURED_SHOWCASE: {
  vehicleId: string;
  fallbackSlug: string;
  fallbackName: string;
  image: StaticImageData;
}[] = [
  {
    vehicleId: "veh-prado-txl",
    fallbackSlug: "toyota-land-cruiser-prado-txl",
    fallbackName: "Toyota Land Cruiser Prado TXL",
    image: landcruiserImg,
  },
  {
    vehicleId: "veh-yangwang-u8",
    fallbackSlug: "yangwang-u8-luxury-4x4",
    fallbackName: "Yangwang U8 Luxury 4x4",
    image: evImg,
  },
  {
    vehicleId: "veh-byd-seal-u",
    fallbackSlug: "byd-seal-u-executive-suv",
    fallbackName: "BYD Seal U Executive SUV",
    image: suvImg,
  },
  {
    vehicleId: "veh-hyundai-tucson-horizon",
    fallbackSlug: "hyundai-tucson-next-gen",
    fallbackName: "Hyundai Tucson Next-Gen",
    image: teaImg,
  },
  {
    vehicleId: "veh-passenger-van-hiace",
    fallbackSlug: "passenger-van-hiace-class",
    fallbackName: "Toyota HiAce Passenger Van",
    image: hiaceImg,
  },
  {
    vehicleId: "veh-toyota-coaster",
    fallbackSlug: "toyota-coaster-bus",
    fallbackName: "Toyota Coaster Bus",
    image: coasterImg,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.homeTitle,
    description: dict.metadata.homeDescription,
  };
}

export default async function HomePage() {
  const { locale, dict } = await getServerDictionary();
  const allPublished = repository.getVehicles({ onlyPublished: true });
  const topFleetLeads = TOP_FEATURED_SHOWCASE.map((item) => {
    const matched = allPublished.find(
      (v) => v.id === item.vehicleId || v.slug === item.fallbackSlug
    );
    const localized = matched ? localizeVehicle(matched, locale) : null;
    return {
      id: localized?.id ?? item.vehicleId,
      slug: localized?.slug ?? item.fallbackSlug,
      name: localized?.name ?? item.fallbackName,
      image: item.image,
    };
  });
  const allEnabledServices = repository.getServices(true);
  const homeServiceSlugs = ["car-rental", "airport-transfer", "corporate-transport"];
  const featuredServices = homeServiceSlugs
    .map((slug) => allEnabledServices.find((srv) => srv.slug === slug))
    .filter((srv): srv is NonNullable<typeof srv> => Boolean(srv));
  const services =
    featuredServices.length > 0 ? featuredServices : allEnabledServices.slice(0, 3);

  const featureIcons = [
    { Icon: Plane, bg: "bg-[#0F284E]" },
    { Icon: Sparkles, bg: "bg-[#063726]" },
    { Icon: CalendarCheck, bg: "bg-[#063726]" },
    { Icon: Car, bg: "bg-[#0F284E]" },
  ];

  const capabilityIcons = [Users, PlaneLanding, MessageSquare];

  const diasporaWhatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(dict.home.diasporaSection.whatsappGreeting)}`;

  return (
    <div className="flex flex-col bg-[#F8FAFC]">
      {/* SECTION A: HERO SLIDESHOW */}
      <HeroSlideshow />

      {/* SECTION B: ABOUT US */}
      <section className="pt-14 sm:pt-20 md:pt-24 pb-12 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          style={{
            borderRadius: "32px",
            background: "linear-gradient(155deg, #FFFFFF 0%, #FFFFFF 60%, #F8FAFC 100%)",
            border: "1px solid rgba(15, 40, 78, 0.09)",
            boxShadow:
              "0 32px 80px -20px rgba(15, 40, 78, 0.13), 0 6px 24px -6px rgba(15, 40, 78, 0.05)",
          }}
          className="group/card relative overflow-hidden"
        >
          {/* Ambient Luxury Top-Left & Bottom-Right Radial Shimmer */}
          <div
            style={{
              background:
                "radial-gradient(circle, rgba(250, 204, 21, 0.12) 0%, transparent 65%)",
            }}
            className="pointer-events-none -top-28 -left-24 absolute h-[380px] w-[380px] rounded-full blur-3xl"
          />
          <div
            style={{
              background:
                "radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, transparent 65%)",
            }}
            className="pointer-events-none -bottom-24 right-1/3 absolute h-[340px] w-[340px] rounded-full blur-3xl"
          />

          {/* Top Refined Tri-Tone Signature Hairline */}
          <div className="relative z-20 flex h-1 w-full">
            <div className="w-[45%] bg-[#0F284E]" />
            <div className="w-[35%] bg-[#063726]" />
            <div className="w-[20%] bg-[#FACC15]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-6 p-7 sm:p-11 lg:p-14 flex flex-col justify-center space-y-7 order-1">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: "fit-content",
                    backgroundColor: "rgba(6, 55, 38, 0.06)",
                    border: "1px solid rgba(6, 55, 38, 0.16)",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                  }}
                  className="inline-flex items-center gap-2 rounded-full"
                >
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#063726]">
                    {dict.home.aboutCard.eyebrow}
                  </span>
                </div>
                <span className="hidden sm:block h-px w-10 bg-[#FACC15]" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold tracking-tight text-[#0F284E] leading-[1.1]">
                  {dict.home.aboutCard.headlineStart}
                  <span style={{ color: "#063726" }} className="text-[#063726]">
                    {dict.home.aboutCard.headlineHighlight}
                  </span>
                </h2>

                <p className="text-base sm:text-[17px] text-[#475569] leading-[1.72] max-w-xl">
                  {dict.home.aboutCard.body}
                </p>
              </div>

              {/* Smooth 2x2 Editorial Feature Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {dict.home.aboutCard.features.map((feat, i) => {
                  const iconInfo = featureIcons[i] ?? featureIcons[0];
                  const IconComp = iconInfo.Icon;
                  return (
                    <div
                      key={feat.title}
                      className="flex items-start gap-3.5 rounded-2xl bg-[#F8FAFC]/85 p-4 border border-slate-200/80 hover:bg-white hover:border-[#FACC15]/70 hover:shadow-[0_12px_28px_-12px_rgba(15,40,78,0.12)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconInfo.bg} text-[#FACC15] shadow-xs`}
                      >
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#0F284E]">
                          {feat.title}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtle Architectural Trust Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-200/80 pt-5">
                {dict.home.aboutCard.metrics.map((metric, idx) => (
                  <div
                    key={metric.label}
                    className={idx > 0 ? "border-l border-slate-200/80 pl-3 sm:pl-4" : ""}
                  >
                    <span
                      className={`block text-xs sm:text-base font-extrabold ${
                        idx === 1 ? "text-[#063726]" : "text-[#0F284E]"
                      }`}
                    >
                      {metric.value}
                    </span>
                    <span className="block text-[10px] sm:text-[11px] font-semibold text-[#64748B] mt-0.5">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sleek Dual Action Pills */}
              <div className="pt-1 flex flex-wrap items-center gap-4">
                <Link
                  href="/plan-your-journey"
                  style={{
                    backgroundColor: "#FACC15",
                    color: "#061226",
                    border: "2px solid #FACC15",
                    borderRadius: "9999px",
                    padding: "13px 26px 13px 28px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontWeight: 800,
                    boxShadow: "0 14px 28px -8px rgba(250, 204, 21, 0.45)",
                  }}
                  className="group sm:whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider hover:bg-[#EAB308] hover:border-[#EAB308] active:scale-[0.98] transition-all"
                >
                  <span>{dict.home.aboutCard.bookNow}</span>
                  <span
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "9999px",
                      backgroundColor: "#061226",
                      color: "#FACC15",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                </Link>

                <Link
                  href="/about"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#0F284E",
                    border: "2px solid #CBD5E1",
                    borderRadius: "9999px",
                    padding: "13px 26px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontWeight: 700,
                  }}
                  className="group sm:whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider hover:border-[#0F284E] hover:bg-slate-50 transition-all"
                >
                  <span>{dict.home.aboutCard.exploreStory}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#063726] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Inset Museum-Grade Gallery Frame */}
            <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 lg:pl-2 order-2 flex">
              <div
                style={{
                  borderRadius: "24px",
                  boxShadow: "0 26px 65px -16px rgba(6, 18, 38, 0.28)",
                }}
                className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] overflow-hidden rounded-[24px] bg-[#091A34] ring-1 ring-[#0F284E]/15"
              >
                <Image
                  src={suvImg}
                  alt={dict.home.aboutCard.imageAlt}
                  fill
                  placeholder="blur"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[50%_42%] group-hover/card:scale-[1.03] transition-transform duration-700 ease-out"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061226]/85 via-[#061226]/10 to-transparent" />

                <div
                  style={{
                    backgroundColor: "rgba(6, 18, 38, 0.78)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: "7px 15px",
                    borderRadius: "9999px",
                  }}
                  className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-white shadow-lg"
                >
                  <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
                  <span>{dict.home.aboutCard.skyTag}</span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(6, 18, 38, 0.82)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "18px",
                  }}
                  className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-xl p-4 sm:p-5 text-white shadow-2xl"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FACC15] block">
                      {dict.home.aboutCard.standardEyebrow}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white/95 mt-0.5 leading-snug">
                      {dict.home.aboutCard.standardText}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 shrink-0 self-start sm:self-center rounded-full bg-[#10B981]/20 border border-[#10B981]/45 px-3.5 py-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                      {dict.home.aboutCard.trustedTeam}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: QUICK TRIP PLANNER */}
      <section className="pb-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <CompactTripPlanner vehicles={allPublished} />
      </section>

      {/* SECTION D: FEATURED FLEET */}
      <section className="content-auto pb-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-[#E2E8F0] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#059669]">
              {dict.home.featuredFleet.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F284E] mt-1">
              {dict.home.featuredFleet.title}
            </h2>
            <p className="mt-1 text-sm text-[#475569] max-w-xl">
              {dict.home.featuredFleet.subtitle}
            </p>
          </div>
          <Link
            href="/fleet"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F284E] hover:text-[#225193] transition-colors shrink-0"
          >
            <span>{dict.home.featuredFleet.viewAll}</span>
            <ArrowRight className="h-4 w-4 text-[#FACC15]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {topFleetLeads.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group relative flex flex-col justify-between rounded-[24px] border border-[#E2E8F0]/95 bg-white p-4 sm:p-5 shadow-[0_10px_28px_-14px_rgba(15,40,78,0.08)] hover:border-[#0F284E]/45 hover:shadow-[0_24px_48px_-16px_rgba(15,40,78,0.16)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-[#F1F5F9] ring-1 ring-inset ring-black/5">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  placeholder="blur"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
              </div>

              <div className="pt-4 pb-3.5 flex-1 flex items-center">
                <h3 className="text-[17px] sm:text-lg font-extrabold tracking-tight text-[#0F284E] group-hover:text-[#225193] transition-colors leading-snug">
                  {vehicle.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                <Link
                  href={`/fleet/${vehicle.slug}`}
                  style={{
                    backgroundColor: "#0F284E",
                    color: "#FFFFFF",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F284E] hover:bg-[#1A3E72] px-3 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-xs hover:shadow-md active:scale-[0.98] transition-all group/view"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-200 group-hover/view:text-white shrink-0" />
                  <span>{dict.common.view}</span>
                </Link>

                <Link
                  href={`/plan-your-journey?vehicle=${vehicle.slug}`}
                  style={{
                    backgroundColor: "#FACC15",
                    color: "#091A34",
                    border: "2px solid #FACC15",
                    borderRadius: "12px",
                    padding: "10px 12px",
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#FACC15] hover:border-[#EAB308] px-3 py-3 text-xs font-black uppercase tracking-wider text-[#091A34] shadow-xs hover:shadow-md active:scale-[0.98] transition-all group/btn"
                >
                  <span>{dict.common.book}</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3] shrink-0 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/fleet"
            style={{
              backgroundColor: "#0F284E",
              color: "#FFFFFF",
              borderRadius: "9999px",
              padding: "14px 32px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontWeight: 800,
            }}
            className="group sm:whitespace-nowrap rounded-full bg-[#0F284E] hover:bg-[#1A3E72] text-xs sm:text-sm uppercase tracking-wider text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
          >
            <span>{dict.home.featuredFleet.bottomCta}</span>
            <span
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "9999px",
                backgroundColor: "#FACC15",
                color: "#061226",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              className="transition-transform group-hover:translate-x-0.5"
            >
              <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          </Link>
        </div>
      </section>

      {/* SECTION E: SERVICES OVERVIEW */}
      <section className="bg-white border-y border-[#E2E8F0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 border-b border-[#E2E8F0] pb-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#063726]/10 border border-[#063726]/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#063726]">
                <span className="h-2 w-2 rounded-full bg-[#059669]" />
                {dict.home.servicesSection.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F284E] mt-2">
                {dict.home.servicesSection.title}
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0F284E] hover:text-[#063726] transition-colors shrink-0"
            >
              <span>{dict.home.servicesSection.viewAll}</span>
              <ArrowRight className="h-4 w-4 text-[#FACC15]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                loading="lazy"
              />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/services"
              style={{
                backgroundColor: "#0F284E",
                color: "#FFFFFF",
                borderRadius: "9999px",
                padding: "14px 32px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontWeight: 800,
              }}
              className="group sm:whitespace-nowrap rounded-full bg-[#0F284E] hover:bg-[#063726] text-xs sm:text-sm uppercase tracking-wider text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              <span>{dict.home.servicesSection.viewAll}</span>
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "9999px",
                  backgroundColor: "#FACC15",
                  color: "#061226",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                className="transition-transform group-hover:translate-x-0.5"
              >
                <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION F: DIASPORA & VISITORS ARRIVAL SHOWCASE */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #061226 0%, #0F284E 55%, #063726 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
        className="relative overflow-hidden py-20 md:py-28 text-white"
      >
        <div
          style={{
            background:
              "radial-gradient(circle, rgba(250, 204, 21, 0.14) 0%, transparent 65%)",
          }}
          className="pointer-events-none absolute -top-24 right-0 h-[440px] w-[440px] rounded-full blur-3xl"
        />
        <div
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, transparent 70%)",
          }}
          className="pointer-events-none absolute -bottom-24 left-0 h-[420px] w-[420px] rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-7 order-1">
              <div
                style={{
                  width: "fit-content",
                  backgroundColor: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(250, 204, 21, 0.35)",
                  padding: "7px 16px",
                  borderRadius: "9999px",
                }}
                className="inline-flex items-center gap-2 rounded-full text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FACC15]"
              >
                <Globe className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                <span>{dict.home.diasporaSection.eyebrow}</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-white">
                  <span className="block">{dict.home.diasporaSection.headingLine1}</span>
                  <span style={{ color: "#FACC15" }} className="block text-[#FACC15] mt-1">
                    {dict.home.diasporaSection.headingLine2}
                  </span>
                </h2>

                <p className="text-base sm:text-[17px] text-slate-200 leading-[1.7] max-w-xl">
                  {dict.home.diasporaSection.body}
                </p>
              </div>

              <div className="space-y-3.5">
                {dict.home.diasporaSection.capabilities.map((cap, idx) => {
                  const IconComp = capabilityIcons[idx] ?? Users;
                  return (
                    <div
                      key={cap.title}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "16px",
                        padding: "16px 18px",
                      }}
                      className="flex items-start gap-4 backdrop-blur-sm hover:bg-white/[0.1] hover:border-[#FACC15]/40 transition-all"
                    >
                      <div
                        style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#10B981]/40 text-[#FACC15]"
                      >
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-[15px] font-extrabold text-white">
                          {cap.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/plan-your-journey?audience=diaspora"
                  style={{
                    backgroundColor: "#FACC15",
                    color: "#061226",
                    border: "2px solid #FACC15",
                    borderRadius: "9999px",
                    padding: "13px 26px 13px 28px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontWeight: 800,
                    boxShadow: "0 14px 30px -8px rgba(250, 204, 21, 0.4)",
                  }}
                  className="group sm:whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider hover:bg-[#EAB308] hover:border-[#EAB308] active:scale-[0.98] transition-all"
                >
                  <span>{dict.home.diasporaSection.ctaPrimary}</span>
                  <span
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "9999px",
                      backgroundColor: "#061226",
                      color: "#FACC15",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                </Link>

                <a
                  href={diasporaWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "#FFFFFF",
                    border: "2px solid rgba(255, 255, 255, 0.28)",
                    borderRadius: "9999px",
                    padding: "13px 26px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    fontWeight: 800,
                  }}
                  className="sm:whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-[#061226] hover:border-white transition-all"
                >
                  <MessageSquare className="h-4 w-4 text-[#10B981] shrink-0" />
                  <span>{dict.home.diasporaSection.ctaSecondary}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 order-2">
              <div
                style={{
                  borderRadius: "28px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  backgroundColor: "#061226",
                  boxShadow: "0 30px 70px -15px rgba(2, 10, 24, 0.65)",
                }}
                className="group/dia relative overflow-hidden"
              >
                <div className="h-1.5 w-full flex">
                  <div className="w-[42%] bg-[#225193]" />
                  <div className="w-[38%] bg-[#10B981]" />
                  <div className="w-[20%] bg-[#FACC15]" />
                </div>

                <div
                  style={{ aspectRatio: "1408 / 1117" }}
                  className="relative w-full overflow-hidden bg-[#091A34]"
                >
                  <Image
                    src={diaImg}
                    alt={dict.home.diasporaSection.imageAlt}
                    fill
                    placeholder="blur"
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover/dia:scale-[1.03]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#061226]/75 to-transparent" />

                  <div
                    style={{
                      backgroundColor: "rgba(6, 18, 38, 0.84)",
                      border: "1px solid rgba(250, 204, 21, 0.45)",
                      padding: "7px 14px",
                      borderRadius: "9999px",
                    }}
                    className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-widest text-white shadow-lg"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                    <span>{dict.home.diasporaSection.skyBadge}</span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(6, 18, 38, 0.96)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                    padding: "20px 24px",
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FACC15]">
                      {dict.home.diasporaSection.conciergeEyebrow}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>{dict.home.diasporaSection.conciergeSupport}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 border-t border-white/10">
                    {dict.home.diasporaSection.highlights.map((item) => (
                      <div key={item.label} className="pt-2">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.label}
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-white mt-0.5">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G: CLIENT TESTIMONIALS SLIDESHOW */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          style={{
            borderRadius: "32px",
            backgroundColor: "#061226",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow:
              "0 36px 90px -20px rgba(6, 18, 38, 0.42), 0 10px 30px -10px rgba(6, 18, 38, 0.2)",
          }}
          className="relative overflow-hidden text-white"
        >
          {/* Full-Bleed Airport Tarmac Twilight Background (/airport.png) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src={airportImg}
              alt={dict.home.testimonials.tarmacImageAlt}
              fill
              placeholder="blur"
              loading="lazy"
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(6, 18, 38, 0.66) 0%, rgba(6, 18, 38, 0.34) 48%, rgba(6, 18, 38, 0.76) 100%)",
              }}
              className="absolute inset-0"
            />
            <div
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(6, 18, 38, 0.46) 0%, rgba(6, 18, 38, 0.16) 65%, rgba(6, 18, 38, 0.6) 100%)",
              }}
              className="absolute inset-0"
            />
          </div>

          <div className="relative z-20 flex h-1.5 w-full">
            <div className="w-[42%] bg-[#225193]" />
            <div className="w-[38%] bg-[#10B981]" />
            <div className="w-[20%] bg-[#FACC15]" />
          </div>

          <div className="relative z-10 py-10 sm:py-12 lg:py-14 space-y-8 sm:space-y-9">
            <TestimonialsShowcase />

            {/* Clean Centered CTA Row Directly Below Slideshow */}
            <div className="px-5 sm:px-10 lg:px-14 pt-1 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/plan-your-journey"
                style={{
                  backgroundColor: "#FACC15",
                  color: "#061226",
                  border: "2px solid #FACC15",
                  borderRadius: "9999px",
                  padding: "13px 28px 13px 30px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  fontWeight: 800,
                  boxShadow: "0 14px 32px -8px rgba(250, 204, 21, 0.44)",
                }}
                className="group sm:whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider hover:bg-[#EAB308] hover:border-[#EAB308] active:scale-[0.98] transition-all"
              >
                <span>{dict.home.testimonials.bookPickupCta}</span>
                <span
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "9999px",
                    backgroundColor: "#061226",
                    color: "#FACC15",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </span>
              </Link>

              <a
                href="https://wa.me/250784129579?text=Hello%20Travel%20Rwanda%2C%20I%20would%20like%20to%20book%20a%20ride."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "rgba(6, 18, 38, 0.72)",
                  color: "#FFFFFF",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "9999px",
                  padding: "13px 26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontWeight: 800,
                }}
                className="sm:whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-[#061226] hover:border-white transition-all backdrop-blur-md"
              >
                <MessageSquare className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>{dict.common.whatsappDispatch}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: THREE-STEP EXPLANATION */}
      <section className="bg-white border-y border-[#E2E8F0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#059669]">
              {dict.home.howItWorks.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F284E] mt-1">
              {dict.home.howItWorks.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dict.home.howItWorks.steps.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 sm:p-10 shadow-sm hover:bg-white hover:border-[#FACC15] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center min-h-[320px]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F284E] text-[#FACC15] font-black text-xl shadow-md">
                  {idx + 1}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F284E] mt-6">
                  {step.title}
                </h3>
                <p className="text-sm text-[#475569] mt-3 max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION J: CLOSING CARD ABOVE FOOTER */}
      <section
        style={{ paddingTop: "5.5rem", paddingBottom: "6.5rem" }}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div
          style={{
            background: "linear-gradient(135deg, #063726 0%, #042419 100%)",
            borderRadius: "24px",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            boxShadow: "0 25px 50px -12px rgba(4, 36, 25, 0.35)",
            overflow: "hidden",
          }}
          className="relative overflow-hidden rounded-2xl text-white shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 relative overflow-hidden" style={{ minHeight: "340px" }}>
              <img
                src="/key.png"
                alt={dict.home.closingCta.imageAlt}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "340px",
                  maxHeight: "480px",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
                className="w-full h-full object-cover object-center"
              />
              <div
                style={{
                  background:
                    "linear-gradient(to top, rgba(4, 36, 25, 0.85) 0%, rgba(4, 36, 25, 0.1) 45%, transparent 100%)",
                }}
                className="absolute inset-0 pointer-events-none"
              />
              <div
                style={{
                  width: "fit-content",
                  backgroundColor: "rgba(4, 36, 25, 0.9)",
                  color: "#FACC15",
                  border: "1px solid rgba(250, 204, 21, 0.45)",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                }}
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-widest"
              >
                <span
                  style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#FACC15" }}
                  className="h-2 w-2 rounded-full"
                />
                <span>{dict.home.closingCta.imageTag}</span>
              </div>
            </div>

            <div
              style={{ padding: "40px 36px" }}
              className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6 relative z-10"
            >
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "fit-content",
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    border: "1px solid rgba(250, 204, 21, 0.45)",
                    color: "#FACC15",
                  }}
                  className="text-xs font-extrabold uppercase tracking-[0.18em]"
                >
                  {dict.home.closingCta.eyebrow}
                </span>
              </div>

              <h2
                style={{ color: "#FFFFFF" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]"
              >
                {dict.home.closingCta.headlineStart}
                <span style={{ color: "#FACC15" }} className="text-[#FACC15]">
                  {dict.home.closingCta.headlineHighlight}
                </span>
              </h2>

              <p
                style={{ color: "#FFFFFF", lineHeight: 1.7 }}
                className="text-sm sm:text-base text-white leading-relaxed max-w-xl"
              >
                {dict.home.closingCta.body}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/plan-your-journey"
                  style={{
                    backgroundColor: "#FACC15",
                    color: "#042419",
                    padding: "14px 32px",
                    borderRadius: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontWeight: 800,
                  }}
                  className="sm:whitespace-nowrap rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-[0.98] transition-all group"
                >
                  <span>{dict.home.closingCta.bookNow}</span>
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "9999px",
                      backgroundColor: "#042419",
                      color: "#FACC15",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                </Link>

                <Link
                  href="/contact"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF",
                    border: "2px solid #FACC15",
                    padding: "14px 32px",
                    borderRadius: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    fontWeight: 800,
                  }}
                  className="sm:whitespace-nowrap rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white hover:bg-white hover:text-[#042419] transition-all"
                >
                  <span>{dict.home.closingCta.contactUs}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
