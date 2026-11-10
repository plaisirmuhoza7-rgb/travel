import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { repository } from "@/lib/repository";
import { AdminBookingsDashboard } from "@/components/admin/AdminBookingsDashboard";
import { ShieldCheck, Mail, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { dict } = await getServerDictionary();
  const enquiries = repository.getEnquiries();
  const vehicles = repository.getVehicles();
  const services = repository.getServices(false);
  const settings = repository.getSettings();

  return (
    <div className="space-y-10">
      {/* Primary Operations & Bookings Dashboard with Booked Cards */}
      <AdminBookingsDashboard
        initialEnquiries={enquiries}
        vehicles={vehicles}
        services={services}
        adminEmail={session.email}
      />

      {/* Production Launch Readiness & Handover Card */}
      <div className="rounded-xl border border-[#BCA77B]/40 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#0B3D2E]" />
          <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
            {dict.admin.dashboardPage.readinessTitle}
          </h2>
        </div>
        <p className="text-xs text-[#171D19]/70">
          {dict.admin.dashboardPage.readinessSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Email / SMTP Status */}
          <div className="rounded-md border border-[var(--color-border-subtle)] p-3 bg-[#F7F6F2] space-y-1">
            <div className="flex items-center justify-between">
              <strong className="flex items-center gap-1.5 text-[#0B3D2E]">
                <Mail className="h-3.5 w-3.5 text-[#BCA77B]" /> {dict.admin.dashboardPage.smtpDispatch}
              </strong>
              {process.env.SMTP_USER ? (
                <span className="text-emerald-700 font-semibold">{dict.admin.dashboardPage.configured}</span>
              ) : (
                <span className="text-yellow-700 font-semibold">{dict.admin.dashboardPage.fallbackMode}</span>
              )}
            </div>
            <p className="text-[11px] text-[#171D19]/60">
              {dict.admin.dashboardPage.smtpHelpBefore}<code>SMTP_USER</code> in <code>.env.local</code>{dict.admin.dashboardPage.smtpHelpAfter}
            </p>
          </div>

          {/* Contact Email Verification */}
          <div className="rounded-md border border-[var(--color-border-subtle)] p-3 bg-[#F7F6F2] space-y-1">
            <div className="flex items-center justify-between">
              <strong className="flex items-center gap-1.5 text-[#0B3D2E]">
                {dict.admin.dashboardPage.officialContact}
              </strong>
              {settings.contactEmail ? (
                <span className="text-emerald-700 font-semibold">{settings.contactEmail}</span>
              ) : (
                <span className="text-yellow-700 font-semibold">{dict.admin.dashboardPage.pendingInput}</span>
              )}
            </div>
            <p className="text-[11px] text-[#171D19]/60">
              {dict.admin.dashboardPage.officialContactHelp}
            </p>
          </div>

          {/* Legal Terms Approval */}
          <div className="rounded-md border border-[var(--color-border-subtle)] p-3 bg-[#F7F6F2] space-y-1">
            <div className="flex items-center justify-between">
              <strong className="flex items-center gap-1.5 text-[#0B3D2E]">
                {dict.admin.dashboardPage.legalTerms}
              </strong>
              {settings.policiesApproved ? (
                <span className="text-emerald-700 font-semibold">{dict.admin.dashboardPage.approved}</span>
              ) : (
                <span className="text-yellow-700 font-semibold">{dict.admin.dashboardPage.draftMode}</span>
              )}
            </div>
            <p className="text-[11px] text-[#171D19]/60">
              {dict.admin.dashboardPage.legalTermsHelp}
            </p>
          </div>

          {/* Image Placeholder Replacement */}
          <div className="rounded-md border border-[var(--color-border-subtle)] p-3 bg-[#F7F6F2] space-y-1">
            <div className="flex items-center justify-between">
              <strong className="flex items-center gap-1.5 text-[#0B3D2E]">
                <Camera className="h-3.5 w-3.5 text-[#BCA77B]" /> {dict.admin.dashboardPage.fleetPhotos}
              </strong>
              <span className="text-blue-700 font-semibold">{dict.admin.dashboardPage.slotsActive}</span>
            </div>
            <p className="text-[11px] text-[#171D19]/60">
              {dict.admin.dashboardPage.fleetPhotosHelp}<code>/public/images/fleet/...</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
