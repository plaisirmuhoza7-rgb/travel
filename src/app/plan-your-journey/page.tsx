import React, { Suspense } from "react";
import { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { repository } from "@/lib/repository";
import { ShieldCheck, Clock, Sparkles } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizeService, localizeVehicle } from "@/lib/i18n/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.bookingTitle,
    description: dict.metadata.bookingDescription,
  };
}

interface PlanYourJourneyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PlanYourJourneyPage({
  searchParams,
}: PlanYourJourneyPageProps) {
  const { locale, dict } = await getServerDictionary();
  const p = dict.booking.page;

  const params = await searchParams;
  const serviceSlug = typeof params.service === "string" ? params.service : "";
  const vehicleSlug = typeof params.vehicle === "string" ? params.vehicle : "";
  const vehicles = repository.getVehicles({ onlyPublished: true });
  const services = repository.getServices(true);
  const rawService = services.find((s) => s.slug === serviceSlug);
  const rawVehicle = vehicles.find((v) => v.slug === vehicleSlug);
  const preselectedService = rawService ? localizeService(rawService, locale) : undefined;
  const preselectedVehicle = rawVehicle ? localizeVehicle(rawVehicle, locale) : undefined;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Architectural Checkout Hero Header (Dark Blue -> Dark Green + Yellow) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061226] via-[#0F284E] to-[#063726] text-white border-b border-[#10B981]/20">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#225193]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#10B981]/20 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FACC15]/45 bg-[#042419]/85 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FACC15] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span>{p.checkoutBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {preselectedVehicle ? (
              <>
                {p.titleBookPrefix}
                <span className="text-[#FACC15]">
                  {preselectedVehicle.name}
                </span>
              </>
            ) : preselectedService ? (
              <>
                {p.titleBookPrefix}
                <span className="text-[#FACC15]">
                  {preselectedService.name}
                </span>
              </>
            ) : (
              <>
                {p.titleDefaultStart}
                <span className="text-[#FACC15]">{p.titleDefaultHighlight}</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {p.subtitle}
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              {p.badgeZeroPayment}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-white">
              <Clock className="h-3.5 w-3.5 text-[#FACC15]" />
              {p.badgeDispatch}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-white">
              <Sparkles className="h-3.5 w-3.5 text-[#FACC15]" />
              {p.badgeQuote}
            </span>
          </div>
        </div>
      </section>

      {/* Direct Official Checkout Form */}
      <div className="py-10 md:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="text-center py-16 text-sm font-bold text-[#0F284E]">
              {p.loadingCheckout}
            </div>
          }
        >
          <BookingWizard vehicles={vehicles} services={services} />
        </Suspense>
      </div>
    </div>
  );
}
