"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteSettings, ServiceItem } from "@/lib/seed-data";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizeService } from "@/lib/i18n/catalog";
import { Save } from "lucide-react";

interface Props {
  initialSettings: SiteSettings;
  services: ServiceItem[];
}

export function AdminSettingsClient({ initialSettings, services }: Props) {
  const router = useRouter();
  const { locale, dict } = useI18n();
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, locale }),
      });

      if (!res.ok) throw new Error(dict.admin.settingsPage.failedSave);

      setMessage(dict.admin.settingsPage.savedSuccess);
      router.refresh();
    } catch (err: any) {
      setMessage(dict.admin.settingsPage.saveErrorPrefix + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleService = async (serviceId: string, currentEnabled: boolean) => {
    try {
      await fetch(`/api/admin/services/${serviceId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !currentEnabled, locale }),
      });
      router.refresh();
    } catch {
      alert(dict.admin.settingsPage.toggleError);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {message && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Company Contact Details */}
      <form onSubmit={handleSaveSettings} className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-6">
        <h3 className="font-display text-xl font-bold text-[#0B3D2E] border-b border-[var(--color-border-subtle)] pb-2">
          {dict.admin.settingsPage.identityTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#171D19]/70">
              {dict.admin.settingsPage.primaryPhone}
            </label>
            <input
              type="text"
              value={settings.phonePrimary}
              onChange={(e) => setSettings({ ...settings, phonePrimary: e.target.value })}
              className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs text-[#171D19]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#171D19]/70">
              {dict.admin.settingsPage.secondaryPhone}
            </label>
            <input
              type="text"
              value={settings.phoneSecondary}
              onChange={(e) => setSettings({ ...settings, phoneSecondary: e.target.value })}
              className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs text-[#171D19]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#171D19]/70">
              {dict.admin.settingsPage.whatsappDigits}
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs text-[#171D19]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#171D19]/70">
              {dict.admin.settingsPage.officialEmail}
            </label>
            <input
              type="email"
              placeholder={dict.admin.settingsPage.officialEmailPlaceholder}
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs text-[#171D19]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#171D19]/70">
            {dict.admin.settingsPage.physicalLocation}
          </label>
          <input
            type="text"
            value={settings.locationDisplay}
            onChange={(e) => setSettings({ ...settings, locationDisplay: e.target.value })}
            className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs text-[#171D19]"
          />
        </div>

        {/* Legal Approval Toggle */}
        <div className="rounded-md border border-[var(--color-border-subtle)] p-4 bg-[#F7F6F2]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.policiesApproved}
              onChange={(e) => setSettings({ ...settings, policiesApproved: e.target.checked })}
              className="rounded text-[#0B3D2E] focus:ring-[#BCA77B]"
            />
            <span className="text-xs font-semibold text-[#0B3D2E]">
              {dict.admin.settingsPage.policiesApprovedLabel}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 rounded bg-[#0B3D2E] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E]"
        >
          <Save className="h-3.5 w-3.5 text-[#BCA77B]" />
          <span>{isSaving ? dict.admin.settingsPage.saving : dict.admin.settingsPage.saveSettings}</span>
        </button>
      </form>

      {/* Services Management */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-display text-xl font-bold text-[#0B3D2E] border-b border-[var(--color-border-subtle)] pb-2">
          {dict.admin.settingsPage.serviceCatalogueTitle}
        </h3>
        <p className="text-xs text-[#171D19]/60">
          {dict.admin.settingsPage.serviceCatalogueDesc}
        </p>

        <div className="space-y-2">
          {services.map((rawSrv) => {
            const srv = localizeService(rawSrv, locale);
            return (
              <div
                key={srv.id}
                className="flex items-center justify-between rounded border border-[var(--color-border-subtle)] p-3 text-xs"
              >
                <div>
                  <strong className="text-[#0B3D2E]">{srv.name}</strong>
                  <p className="text-[#171D19]/60 text-[11px]">{srv.shortSummary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleService(srv.id, srv.isEnabled)}
                  className={`rounded px-3 py-1 font-semibold text-[11px] ${
                    srv.isEnabled
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {srv.isEnabled ? dict.admin.settingsPage.published : dict.admin.settingsPage.unpublishedDraft}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
