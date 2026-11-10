import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { repository } from "@/lib/repository";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { dict } = await getServerDictionary();
  const settings = repository.getSettings();
  const services = repository.getServices(false);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
          {dict.admin.settingsPage.eyebrow}
        </span>
        <h1 className="font-display text-3xl font-bold text-[#0B3D2E]">
          {dict.admin.settingsPage.title}
        </h1>
        <p className="text-xs text-[#171D19]/60">
          {dict.admin.settingsPage.subtitle}
        </p>
      </div>

      <AdminSettingsClient initialSettings={settings} services={services} />
    </div>
  );
}
