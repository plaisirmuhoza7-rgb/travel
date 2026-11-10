"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import keyImg from "../../../public/key.png";
import logoImg from "../../../public/logo.png";

export function AdminLoginClient() {
  const { locale, dict } = useI18n();
  const t = dict.admin.login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail("admin@travelrwanda.rw");
    setPassword("Rwanda2026!Admin");
    setError(null);
  };

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
        throw new Error(data.error || t.loginFailed);
      }

      window.location.assign(new URL("/admin", window.location.origin).toString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.invalidCredentials);
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #031A12 0%, #063726 48%, #042419 100%)",
      }}
      className="relative min-h-[calc(100dvh-5rem)] w-full overflow-hidden flex items-center justify-center py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8"
    >
      {/* Subtle Dark-Green Architectural Dot Grid */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(rgba(16, 185, 129, 0.16) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        className="pointer-events-none absolute inset-0 opacity-60"
      />

      {/* Ambient Emerald & Gold Radial Glows */}
      <div
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.24) 0%, transparent 68%)",
        }}
        className="pointer-events-none absolute -top-28 -left-24 h-[460px] w-[460px] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 204, 21, 0.14) 0%, transparent 68%)",
        }}
        className="pointer-events-none absolute -bottom-32 -right-24 h-[440px] w-[440px] rounded-full blur-3xl"
      />

      {/* Main Split Portal Card */}
      <div
        style={{
          boxShadow:
            "0 40px 100px -20px rgba(2, 16, 11, 0.8), 0 12px 32px -12px rgba(4, 36, 25, 0.6)",
        }}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#10B981]/30 bg-white"
      >
        {/* Signature Dark-Green to Gold Gradient Hairline */}
        <div
          style={{
            background:
              "linear-gradient(90deg, #0B3D2E 0%, #10B981 58%, #FACC15 100%)",
          }}
          className="h-1.5 w-full"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* LEFT PANEL: Dark Green Luxury Showcase */}
          <div className="lg:col-span-6 min-w-0 relative min-h-[225px] sm:min-h-[280px] lg:min-h-[600px] bg-[#042419] text-white flex flex-col justify-between p-5 sm:p-8 overflow-hidden">
            <Image
              src={keyImg}
              alt={t.showcaseImageAlt}
              fill
              placeholder="blur"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center scale-[1.01]"
            />

            {/* Calibrated Dark Green Atmospheric Scrim */}
            <div
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4, 36, 25, 0.78) 0%, rgba(4, 36, 25, 0.25) 38%, rgba(4, 36, 25, 0.90) 76%, #042419 100%)",
              }}
              className="pointer-events-none absolute inset-0"
            />
            <div
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6, 55, 38, 0.5) 0%, transparent 55%)",
              }}
              className="pointer-events-none absolute inset-0"
            />

            {/* Top Frosted Status Row */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/45 bg-[#042419]/80 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-100 backdrop-blur-md shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>{t.showcaseEyebrow}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#063726]/85 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FACC15] backdrop-blur-md">
                <span>{t.showcaseTag}</span>
              </div>
            </div>

            {/* Bottom Brand Narrative & Capability Tiles */}
            <div className="relative z-10 space-y-5 mt-8 lg:mt-0">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-0.5 w-7 rounded-full bg-[#FACC15]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FACC15]">
                    {dict.common.brandName}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-extrabold tracking-tight leading-[1.12] text-white">
                  <span className="block">{t.showcaseTitleLine1}</span>
                  <span className="block text-[#FACC15] mt-0.5">
                    {t.showcaseTitleLine2}
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-emerald-50/85 leading-relaxed max-w-md">
                  {t.showcaseSubtitle}
                </p>
              </div>

              {/* 3 Architectural Dark Green Glass Tiles */}
              <div className="hidden sm:grid grid-cols-3 gap-2.5 pt-1">
                {t.showcaseHighlights.map((item, idx) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#10B981]/25 bg-[#063726]/75 backdrop-blur-md px-3 py-2.5"
                  >
                    <span
                      className={`block text-[10px] font-extrabold uppercase tracking-wider ${
                        idx === 1 ? "text-[#10B981]" : "text-[#FACC15]"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold text-white/95 leading-snug">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: High-Craft Dark-Green Accented Login Form */}
          <div className="lg:col-span-6 min-w-0 bg-white p-5 sm:p-9 lg:p-10 flex flex-col justify-between gap-6">
            {/* Top Utility Row */}
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#063726] hover:bg-[#ECFDF5] hover:text-[#042419] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#059669]" />
                <span>{t.backToSite}</span>
              </Link>

              <LanguageSwitcher variant="darkgreen" />
            </div>

            {/* Form Header + Testing Notice + Inputs */}
            <div className="space-y-5">
              {/* Brand Emblem & Title */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-[#063726]/15 border border-[#D1FAE5]">
                  <Image
                    src={logoImg}
                    alt={dict.common.logoAlt}
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#063726]">
                    <ShieldCheck className="h-3 w-3 text-[#059669]" />
                    <span>{t.portalBadge}</span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-[1.7rem] font-extrabold tracking-tight text-[#042419] leading-tight">
                    {t.portalTitle}
                  </h1>
                  <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                    {t.portalSubtitle}
                  </p>
                </div>
              </div>

              {/* Testing Access Callout */}
              <div className="rounded-2xl border border-[#10B981]/35 bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#FEFCE8]/75 p-3.5 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#063726]">
                    <Sparkles className="h-3.5 w-3.5 text-[#059669]" />
                    <span>{t.testModeBadge}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="cursor-pointer rounded-full border border-[#063726]/20 bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#063726] shadow-2xs hover:border-[#063726] hover:bg-[#063726] hover:text-[#FACC15] transition-colors"
                  >
                    {t.fillDemoBtn}
                  </button>
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-[#063726]/85">
                  {t.testModeDescription}
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-700 flex items-center gap-2.5"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} noValidate className="space-y-4">
                {/* Staff Email Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-login-email"
                    className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#063726]"
                  >
                    {t.staffEmail}
                  </label>
                  <div className="relative group">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#059669] group-focus-within:text-[#063726] transition-colors" />
                    <input
                      id="admin-login-email"
                      name="email"
                      type="text"
                      inputMode="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full h-12 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] pl-10.5 pr-4 text-base sm:text-sm font-medium text-[#042419] placeholder:text-slate-400 focus:bg-white focus:border-[#063726] focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-[#10B981]/15 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="admin-login-password"
                      className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#063726]"
                    >
                      {t.password}
                    </label>
                    <span className="text-[10px] font-semibold text-[#059669]">
                      {t.passwordHint}
                    </span>
                  </div>
                  <div className="relative group">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#059669] group-focus-within:text-[#063726] transition-colors" />
                    <input
                      id="admin-login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-12 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] pl-10.5 pr-12 text-base sm:text-sm font-medium text-[#042419] placeholder:text-slate-400 focus:bg-white focus:border-[#063726] focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-[#10B981]/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? t.hidePassword : t.showPassword}
                      aria-pressed={showPassword}
                      className="cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-[#ECFDF5] hover:text-[#063726] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Session Status & Support Link */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#475569]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                    <span>{t.sessionNote}</span>
                  </span>

                  <Link
                    href="/contact"
                    className="font-bold text-[#063726] hover:text-[#059669] hover:underline transition-colors"
                  >
                    {t.needHelp}
                  </Link>
                </div>

                {/* Dark Green Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background:
                      "linear-gradient(135deg, #063726 0%, #0B3D2E 55%, #042419 100%)",
                  }}
                  className="group cursor-pointer w-full h-12 sm:h-[52px] inline-flex items-center justify-center gap-3 rounded-xl px-6 text-xs sm:text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_16px_32px_-10px_rgba(4,36,25,0.55)] hover:shadow-[0_20px_36px_-8px_rgba(6,55,38,0.65)] hover:brightness-110 active:scale-[0.99] disabled:opacity-65 transition-all"
                >
                  <span>{loading ? t.authenticating : t.signIn}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FACC15] text-[#042419] shadow-xs transition-transform group-hover:translate-x-0.5">
                    {loading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2.75]" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Bottom Environment Footer */}
            <div className="border-t border-slate-200/80 pt-4 flex flex-col gap-1.5 text-[11px] text-[#475569]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-[#063726]">
                  {dict.common.locationGahanga}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <span>{dict.common.brandName}</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {t.devNoteBefore}
                <code className="rounded bg-[#ECFDF5] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#063726]">
                  ADMIN_SETUP_PASSWORD
                </code>
                {t.devNoteMiddle}
                <code className="rounded bg-[#ECFDF5] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#063726]">
                  .env.local
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
