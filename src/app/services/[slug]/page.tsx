import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { repository } from "@/lib/repository";
import { getServiceVisual } from "@/lib/service-visuals";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";
import {
  localizeService,
  localizeServiceVisual,
  localizeVehicle,
} from "@/lib/i18n/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict } = await getServerDictionary();
  const rawService = repository
    .getServices(true)
    .find((s) => s.slug === slug);

  if (!rawService) {
    return { title: dict.metadata.serviceNotFoundTitle };
  }

  const service = localizeService(rawService, locale);
  return {
    title: `${service.name}${dict.metadata.serviceTitleSuffix}`,
    description: service.fullDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const { locale, dict } = await getServerDictionary();
  const enabledServices = repository.getServices(true);
  const serviceIndex = enabledServices.findIndex((s) => s.slug === slug);
  const rawService = enabledServices[serviceIndex];

  if (!rawService) {
    notFound();
  }

  const service = localizeService(rawService, locale);
  const visual = localizeServiceVisual(
    getServiceVisual(service.slug, serviceIndex),
    service.slug,
    locale
  );
  const matchingVehicles = repository
    .getVehicles({ onlyPublished: true })
    .filter((v) => v.confirmedServices.includes(service.slug))
    .map((v) => localizeVehicle(v, locale));

  const waText = encodeURIComponent(
    `${dict.serviceDetail.whatsappGreetingPrefix}${service.name}.`
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A]">
      {/* 1. ARCHITECTURAL DARK BLUE -> DARK GREEN HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061226] via-[#0F284E] to-[#063726] text-white border-b border-[#10B981]/20">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#225193]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-16 h-80 w-80 rounded-full bg-[#10B981]/20 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
            <Link href="/" className="hover:text-[#FACC15] transition-colors">
              {dict.serviceDetail.breadcrumbHome}
            </Link>
            <span>/</span>
            <Link
              href="/services"
              className="hover:text-[#FACC15] transition-colors"
            >
              {dict.serviceDetail.breadcrumbServices}
            </Link>
            <span>/</span>
            <span className="text-[#FACC15]">{service.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FACC15]/45 bg-[#042419]/85 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FACC15]">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span>
                  0{serviceIndex + 1} · {visual.badge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                {service.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                {service.fullDescription}
              </p>

              {/* Highlights */}
              <ul className="space-y-2.5 pt-1">
                {visual.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-white"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#063726] border border-[#10B981]/45 text-[#FACC15]">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={`/plan-your-journey?service=${service.slug}`}
                  className="group inline-flex items-center gap-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] px-7 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#091A34] shadow-lg active:scale-[0.98] transition-all"
                >
                  <span>{dict.serviceDetail.bookServiceCta}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#091A34] text-[#FACC15] transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                </Link>

                <a
                  href={`https://wa.me/250784129579?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#063726] hover:bg-[#042419] border border-[#10B981]/45 px-6 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all"
                >
                  <MessageSquare className="h-4 w-4 text-[#10B981]" />
                  <span>{dict.serviceDetail.whatsappDesk}</span>
                </a>
              </div>
            </div>

            {/* Right Service Image Card */}
            <div className="lg:col-span-6">
              <div className="rounded-[26px] border border-white/15 bg-[#091A34] p-3.5 shadow-2xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={visual.image}
                    alt={visual.alt}
                    fill
                    placeholder="blur"
                    preload
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061226]/75 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-[#063726]/92 border border-[#10B981]/45 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#FACC15]">
                      {visual.fleetTag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#091A34]/90 border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>{dict.serviceDetail.kigaliNationwide}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RECOMMENDED FLEET FOR THIS SERVICE */}
      <section className="py-14 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-[#E2E8F0] pb-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#063726]/10 border border-[#063726]/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#063726]">
              <span className="h-2 w-2 rounded-full bg-[#059669]" />
              {dict.serviceDetail.matchedFleetBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F284E] mt-2">
              {dict.serviceDetail.vehiclesAvailablePrefix}
              {service.name}
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0F284E] hover:text-[#063726] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-[#FACC15]" />
            <span>{dict.serviceDetail.backToAllServices}</span>
          </Link>
        </div>

        {matchingVehicles.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#475569]">
              {dict.serviceDetail.fallbackNotice}
            </p>
            <Link
              href={`/plan-your-journey?service=${service.slug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FACC15] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#091A34]"
            >
              <span>
                {dict.serviceDetail.bookPrefix}
                {service.name}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {matchingVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="group flex flex-col justify-between rounded-[24px] border border-[#E2E8F0] bg-white overflow-hidden shadow-xs hover:border-[#063726] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-1.5 w-full flex">
                  <div className="w-[40%] bg-[#0F284E]" />
                  <div className="w-[35%] bg-[#063726]" />
                  <div className="w-[25%] bg-[#FACC15]" />
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="overflow-hidden rounded-2xl">
                      <PlaceholderImage
                        slotId={vehicle.primaryAssetSlot}
                        aspectRatioClass="aspect-[3/2]"
                        className="group-hover:scale-105 transition-transform duration-500 bg-[#F1F5F9]"
                        showDetails={false}
                      />
                    </div>

                    <div className="pt-4 pb-3.5 min-h-[3.75rem] flex items-center justify-between gap-2">
                      <h3 className="text-[17px] font-extrabold tracking-tight text-[#0F284E] leading-snug">
                        {vehicle.name}
                      </h3>
                      {vehicle.passengerCapacity && (
                        <span className="shrink-0 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 text-[10px] font-extrabold text-[#063726]">
                          {vehicle.passengerCapacity} {dict.common.seatsLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-[#E2E8F0]">
                    <Link
                      href={`/fleet/${vehicle.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F284E] hover:bg-[#063726] px-3 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-all"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#FACC15]" />
                      <span>{dict.common.view}</span>
                    </Link>
                    <Link
                      href={`/plan-your-journey?service=${service.slug}&vehicle=${vehicle.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] px-3 py-3 text-xs font-black uppercase tracking-wider text-[#091A34] transition-all"
                    >
                      <span>{dict.common.book}</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
