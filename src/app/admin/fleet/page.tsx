import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizeVehicle } from "@/lib/i18n/catalog";
import { repository } from "@/lib/repository";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminFleetPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { locale, dict } = await getServerDictionary();
  const vehicles = repository
    .getVehicles()
    .map((v) => localizeVehicle(v, locale));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
            {dict.admin.fleetPage.eyebrow}
          </span>
          <h1 className="font-display text-3xl font-bold text-[#0B3D2E]">
            {dict.admin.fleetPage.title}
          </h1>
          <p className="text-xs text-[#171D19]/60">
            {dict.admin.fleetPage.subtitle}
          </p>
        </div>
      </div>

      <div className="rounded-md border border-[#BCA77B]/40 bg-[#0B3D2E]/5 p-4 text-xs text-[#0B3D2E] flex items-start gap-2.5">
        <Camera className="h-4 w-4 text-[#BCA77B] shrink-0 mt-0.5" />
        <div>
          <strong>{dict.admin.fleetPage.photoGuideTitle}</strong> {dict.admin.fleetPage.photoGuideBeforeSrc}<code>src/lib/assets.ts</code>{dict.admin.fleetPage.photoGuideAfterSrc}<code>/public/images/fleet/...</code>{dict.admin.fleetPage.photoGuideAfterPath}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-white p-5 shadow-sm space-y-4"
          >
            <PlaceholderImage
              slotId={v.primaryAssetSlot}
              aspectRatioClass="aspect-[3/2]"
              showDetails={true}
            />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-[#171D19]/50">
                  {v.slug}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                    v.isPublished
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {v.isPublished ? dict.admin.fleetPage.publishedLive : dict.admin.fleetPage.draftLead}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#0B3D2E] mt-1">
                {v.name}
              </h3>
              <p className="text-xs text-[#171D19]/70 line-clamp-2 mt-1">
                {v.subtitle}
              </p>
            </div>

            <div className="border-t border-[var(--color-border-subtle)] pt-3 text-xs space-y-1 text-[#171D19]/70">
              <div className="flex justify-between">
                <span>{dict.admin.fleetPage.verifiedSeats}</span>
                <strong className="text-[#0B3D2E]">
                  {v.passengerCapacity !== null
                    ? `${v.passengerCapacity} ${dict.common.seatsLabel}`
                    : dict.admin.fleetPage.unverified}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{dict.admin.fleetPage.transmission}</span>
                <strong className="text-[#0B3D2E]">
                  {v.transmission || dict.admin.fleetPage.unverified}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{dict.admin.fleetPage.pricingMode}</span>
                <strong className="text-[#0B3D2E]">
                  {v.dailyRateRwf
                    ? `${v.dailyRateRwf.toLocaleString()} ${dict.common.rwf}`
                    : dict.common.requestQuote}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
