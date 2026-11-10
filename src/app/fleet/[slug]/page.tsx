import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { repository } from "@/lib/repository";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import {
  Check,
  X,
  Users,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Info,
  Calendar,
} from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizeCategory, localizeVehicle } from "@/lib/i18n/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict } = await getServerDictionary();
  const rawVehicle = repository.getVehicleBySlug(slug);
  if (!rawVehicle) return { title: dict.metadata.vehicleNotFoundTitle };

  const vehicle = localizeVehicle(rawVehicle, locale);
  return {
    title: `${vehicle.name}${dict.metadata.vehicleTitleSuffix}`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const { locale, dict } = await getServerDictionary();
  const rawVehicle = repository.getVehicleBySlug(slug);

  if (!rawVehicle) {
    notFound();
  }

  const vehicle = localizeVehicle(rawVehicle, locale);
  const categories = repository.getCategories();
  const vehicleCats = categories
    .filter((c) => vehicle.categoryIds.includes(c.id))
    .map((c) => localizeCategory(c, locale));

  const waText = encodeURIComponent(
    `${dict.fleet.detail.whatsappGreetingPrefix}${vehicle.name}.`
  );

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#64748B]">
        <Link href="/" className="hover:text-[#0F284E]">
          {dict.fleet.detail.breadcrumbHome}
        </Link>
        <span>/</span>
        <Link href="/fleet" className="hover:text-[#0F284E]">
          {dict.fleet.detail.breadcrumbFleet}
        </Link>
        <span>/</span>
        <span className="text-[#0F284E] font-bold">{vehicle.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {vehicleCats.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-wider uppercase text-[#0F284E]"
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F284E]">
              {vehicle.name}
            </h1>
            <p className="text-base text-[#475569] mt-2 leading-relaxed">
              {vehicle.subtitle}
            </p>
          </div>

          {/* Primary Vehicle Frame */}
          <PlaceholderImage
            slotId={vehicle.primaryAssetSlot}
            aspectRatioClass="aspect-[3/2]"
            className="shadow-md bg-[#F1F5F9]"
          />

          {/* Overview & Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F284E]">
              {dict.fleet.detail.overviewHeading}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Verified Specifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-[#0F284E]">
              {dict.fleet.detail.specsHeading}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block flex items-center gap-1">
                  <Users className="h-3 w-3 text-[#10B981]" />{" "}
                  {dict.fleet.detail.passengerCapacity}
                </span>
                <span className="text-sm font-bold text-[#0F284E] mt-1 block">
                  {vehicle.passengerCapacity !== null
                    ? `${vehicle.passengerCapacity} ${dict.common.seatsLabel}`
                    : dict.common.confirmedOnEnquiry}
                </span>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-[#10B981]" />{" "}
                  {dict.fleet.detail.luggageCapacity}
                </span>
                <span className="text-sm font-bold text-[#0F284E] mt-1 block">
                  {vehicle.luggageCapacity !== null
                    ? `${vehicle.luggageCapacity} ${dict.common.bagsLabel}`
                    : dict.common.confirmedOnEnquiry}
                </span>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                  {dict.fleet.detail.transmission}
                </span>
                <span className="text-sm font-bold text-[#0F284E] mt-1 block">
                  {vehicle.transmission || dict.common.confirmedOnEnquiry}
                </span>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                  {dict.fleet.detail.fuelType}
                </span>
                <span className="text-sm font-bold text-[#0F284E] mt-1 block">
                  {vehicle.fuelType || dict.common.confirmedOnEnquiry}
                </span>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#10B981]" />{" "}
                  {dict.fleet.detail.inspectionMaintenance}
                </span>
                <span className="text-sm font-bold text-[#0F284E] mt-1 block">
                  {dict.fleet.detail.verifiedServicing}
                </span>
              </div>
            </div>
          </div>

          {/* Suitable Uses */}
          {vehicle.suitableUses && vehicle.suitableUses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl font-bold tracking-tight text-[#0F284E]">
                {dict.fleet.detail.recommendedUsesHeading}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-[#475569]">
                {vehicle.suitableUses.map((use, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Included & Excluded Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E2E8F0]">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F284E] mb-2 flex items-center gap-1">
                <Check className="h-4 w-4 text-[#10B981]" />{" "}
                {dict.fleet.detail.includedHeading}
              </h4>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                {vehicle.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1">
                <X className="h-4 w-4 text-[#64748B]" />{" "}
                {dict.fleet.detail.excludedHeading}
              </h4>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                {vehicle.excludedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-slate-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B] block">
                {dict.fleet.detail.quoteAvailability}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#0F284E]">
                  {dict.common.requestQuote}
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                {dict.fleet.detail.quoteDescription}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-4 text-xs text-[#0F284E] flex items-start gap-2.5">
              <Info className="h-4 w-4 text-[#225193] shrink-0 mt-0.5" />
              <span>{dict.fleet.detail.preselectNotice}</span>
            </div>

            <Link
              href={`/plan-your-journey?vehicle=${vehicle.slug}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F284E] py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1A3E72] active:scale-[0.98] transition-all shadow-md group"
            >
              <span>{dict.fleet.detail.requestVehicleCta}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-[#091A34] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3 w-3 stroke-[3]" />
              </span>
            </Link>

            <div className="text-center pt-2">
              <a
                href={`https://wa.me/250784129579?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#059669] hover:underline underline-offset-4"
              >
                {dict.fleet.detail.whatsappDirect}
              </a>
            </div>

            <div className="border-t border-[#E2E8F0] pt-4 space-y-2 text-xs font-medium text-[#475569]">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" />
                <span>{dict.fleet.detail.dispatchTimeNote}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                <span>{dict.fleet.detail.assistanceNote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
