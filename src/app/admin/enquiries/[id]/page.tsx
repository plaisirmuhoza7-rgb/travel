import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { repository } from "@/lib/repository";
import { EnquiryDetailClient } from "@/components/admin/EnquiryDetailClient";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEnquiryDetailPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { locale, dict } = await getServerDictionary();
  const { id } = await params;
  const enquiry = repository.getEnquiryById(id);

  if (!enquiry) {
    notFound();
  }

  const history = repository.getStatusHistoryForEnquiry(id);
  const notes = repository.getNotesForEnquiry(id);
  const notifications = repository.getNotificationLogsForEnquiry(id);
  const vehicles = repository.getVehicles();

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Reference Header */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-[#0B3D2E] hover:text-[#BCA77B] transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{dict.admin.enquiryDetailPage.backToDashboard}</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
              {dict.admin.enquiryDetailPage.eyebrow}
            </span>
            <h1 className="font-display text-3xl font-bold text-[#0B3D2E]">
              {enquiry.referenceCode}
            </h1>
          </div>
          <div className="text-xs text-[#171D19]/60 font-mono">
            {dict.admin.enquiryDetailPage.submittedPrefix}{" "}
            {new Date(enquiry.createdAt).toLocaleString(
              locale === "fr" ? "fr-FR" : "en-US",
              { timeZone: "UTC" }
            )}{" "}
            {dict.admin.enquiryDetailPage.utcSuffix}
          </div>
        </div>
      </div>

      <EnquiryDetailClient
        enquiry={enquiry}
        history={history}
        notes={notes}
        notifications={notifications}
        adminEmail={session.email}
        vehicles={vehicles}
      />
    </div>
  );
}
