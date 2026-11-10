"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function AdminLoginPage() {
  const router = useRouter();
  const { locale, dict } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || dict.admin.login.loginFailed);
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || dict.admin.login.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-[var(--color-border-subtle)] bg-white p-8 shadow-sm">
        <div className="flex justify-end">
          <LanguageSwitcher variant="header" />
        </div>
        <div className="text-center !mt-2">
          <div
            style={{ width: "56px", height: "56px", minWidth: "56px", minHeight: "56px" }}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200"
          >
            <img
              src="/logo.png"
              alt={dict.common.logoAlt}
              width={44}
              height={44}
              style={{
                width: "44px",
                height: "44px",
                maxWidth: "44px",
                maxHeight: "44px",
                objectFit: "contain",
                display: "block",
              }}
              className="object-contain"
            />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0B3D2E] mt-4">
            {dict.admin.login.portalTitle}
          </h2>
          <p className="text-xs text-[#171D19]/60 mt-1">
            {dict.admin.login.portalSubtitle}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#171D19]/70">
              {dict.admin.login.staffEmail}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@travelrwanda.rw"
              className="w-full rounded-md border border-[var(--color-border-subtle)] bg-white px-3 py-2 text-sm text-[#171D19] focus:border-[#BCA77B] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#171D19]/70">
              {dict.admin.login.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-md border border-[var(--color-border-subtle)] bg-white px-3 py-2 text-sm text-[#171D19] focus:border-[#BCA77B] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#0B3D2E] py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] disabled:opacity-50 transition-all shadow-sm"
          >
            {loading ? dict.admin.login.authenticating : dict.admin.login.signIn}
            <ArrowRight className="h-4 w-4 text-[#BCA77B]" />
          </button>
        </form>

        <div className="border-t border-[var(--color-border-subtle)] pt-4 text-center">
          <p className="text-[11px] text-[#171D19]/50">
            {dict.admin.login.devNoteBefore}<code>ADMIN_SETUP_PASSWORD</code>{dict.admin.login.devNoteMiddle}<code>.env.local</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
