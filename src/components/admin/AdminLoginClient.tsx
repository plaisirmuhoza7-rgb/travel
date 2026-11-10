"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import logoImg from "../../../public/logo.png";

export function AdminLoginClient() {
  const { locale, dict } = useI18n();
  const t = dict.admin.login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error(data.error || t.loginFailed);
      }

      window.location.assign(new URL("/admin", window.location.origin).toString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.invalidCredentials);
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        background:
          "linear-gradient(155deg, #02150E 0%, #063726 52%, #031D14 100%)",
      }}
      className="relative flex-1 min-h-dvh w-full overflow-hidden flex items-center justify-center px-5 py-10"
    >
      {/* Soft Top Emerald Atmospheric Glow */}
      <div
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.16) 0%, transparent 65%)",
        }}
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative z-10 w-full max-w-[404px] flex flex-col gap-4">
        {/* Discreet Top Bar */}
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-100/75 hover:text-[#FACC15] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.backToSite}</span>
          </Link>

          <LanguageSwitcher variant="darkgreen" />
        </div>

        {/* Minimal Elevated Login Card */}
        <div
          style={{
            boxShadow:
              "0 32px 72px -18px rgba(0, 0, 0, 0.7), 0 8px 24px -8px rgba(2, 21, 14, 0.5)",
          }}
          className="w-full overflow-hidden rounded-[24px] border border-white/15 bg-white"
        >
          {/* Thin Brand Hairline */}
          <div
            style={{
              background:
                "linear-gradient(90deg, #063726 0%, #10B981 65%, #FACC15 100%)",
            }}
            className="h-[3px] w-full"
          />

          <div className="p-7 sm:p-9">
            {/* Clean Centered Brand Header */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#063726]/10 bg-[#F8FAFC] p-1.5 shadow-2xs">
                <Image
                  src={logoImg}
                  alt={dict.common.logoAlt}
                  width={36}
                  height={36}
                  priority
                  className="h-9 w-9 object-contain"
                />
              </div>

              <h1 className="mt-4 font-display text-[1.45rem] font-bold tracking-tight text-[#042419] leading-tight">
                {t.portalTitle}
              </h1>
              <p className="mt-1 text-xs sm:text-[13px] font-medium text-slate-500">
                {t.portalSubtitle}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="mt-7 space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-login-email"
                  className="block text-xs font-semibold text-[#063726]"
                >
                  {t.staffEmail}
                </label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#063726] transition-colors" />
                  <input
                    id="admin-login-email"
                    name="email"
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full h-11 sm:h-12 rounded-xl border border-slate-200 bg-[#F8FAFC] pl-10 pr-4 text-base sm:text-sm font-medium text-[#042419] placeholder:text-slate-400 focus:bg-white focus:border-[#063726] focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-[#10B981]/15 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-login-password"
                  className="block text-xs font-semibold text-[#063726]"
                >
                  {t.password}
                </label>
                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#063726] transition-colors" />
                  <input
                    id="admin-login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 sm:h-12 rounded-xl border border-slate-200 bg-[#F8FAFC] pl-10 pr-11 text-base sm:text-sm font-medium text-[#042419] placeholder:text-slate-400 focus:bg-white focus:border-[#063726] focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-[#10B981]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? t.hidePassword : t.showPassword}
                    aria-pressed={showPassword}
                    className="cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-[#ECFDF5] hover:text-[#063726] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background:
                      "linear-gradient(135deg, #063726 0%, #042419 100%)",
                  }}
                  className="group cursor-pointer w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-xl px-5 text-sm font-semibold text-white shadow-[0_14px_28px_-10px_rgba(4,36,25,0.55)] hover:brightness-110 active:scale-[0.99] disabled:opacity-65 transition-all"
                >
                  <span>{loading ? t.authenticating : t.signIn}</span>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#FACC15]" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-[#FACC15] transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
