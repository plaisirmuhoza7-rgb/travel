"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Locale, stripLocalePrefix } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  variant?: "header" | "drawer" | "footer" | "admin";
  className?: string;
}

export function LanguageSwitcher({
  variant = "header",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, dict, setLocale } = useI18n();
  const pathname = usePathname() || "/";
  const router = useRouter();

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    setLocale(nextLocale);

    const strippedPath = stripLocalePrefix(pathname);
    if (strippedPath !== pathname) {
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      router.replace(`${strippedPath}${search}`, { scroll: false });
    }
    router.refresh();
  };

  if (variant === "admin") {
    return (
      <div
        className={`flex items-center justify-between gap-2 rounded-lg bg-[#091A34] px-3 py-2 border border-white/10 ${className}`}
      >
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
          <Globe className="h-3.5 w-3.5 text-[#FACC15]" />
          <span>{dict.nav.languageLabel}</span>
        </span>
        <div
          className="inline-flex items-center rounded-md bg-white/10 p-0.5"
          role="group"
          aria-label={dict.nav.languageLabel}
        >
          <button
            type="button"
            onClick={() => handleSelect("en")}
            aria-label={dict.nav.switchToEnglish}
            aria-pressed={locale === "en"}
            className={`rounded px-2 py-0.5 text-[11px] font-extrabold transition-colors ${
              locale === "en"
                ? "bg-[#FACC15] text-[#091A34]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => handleSelect("fr")}
            aria-label={dict.nav.switchToFrench}
            aria-pressed={locale === "fr"}
            className={`rounded px-2 py-0.5 text-[11px] font-extrabold transition-colors ${
              locale === "fr"
                ? "bg-[#FACC15] text-[#091A34]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            FR
          </button>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 ${className}`}
        role="group"
        aria-label={dict.nav.languageLabel}
      >
        <Globe className="h-3.5 w-3.5 text-[#FACC15] shrink-0" />
        <button
          type="button"
          onClick={() => handleSelect("en")}
          aria-label={dict.nav.switchToEnglish}
          aria-pressed={locale === "en"}
          className={`rounded px-2 py-0.5 text-xs font-extrabold transition-colors ${
            locale === "en"
              ? "bg-[#FACC15] text-[#061226]"
              : "text-white/80 hover:text-white"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => handleSelect("fr")}
          aria-label={dict.nav.switchToFrench}
          aria-pressed={locale === "fr"}
          className={`rounded px-2 py-0.5 text-xs font-extrabold transition-colors ${
            locale === "fr"
              ? "bg-[#FACC15] text-[#061226]"
              : "text-white/80 hover:text-white"
          }`}
        >
          Français
        </button>
      </div>
    );
  }

  if (variant === "drawer") {
    return (
      <div
        className={`flex items-center justify-between rounded-xl bg-slate-50 border border-[#E2E8F0] px-3.5 py-2.5 ${className}`}
      >
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F284E]">
          <Globe className="h-4 w-4 text-[#1A3E72]" />
          <span>{dict.nav.languageLabel}</span>
        </span>
        <div
          className="inline-flex items-center rounded-lg bg-white p-0.5 border border-[#E2E8F0]"
          role="group"
          aria-label={dict.nav.languageLabel}
        >
          <button
            type="button"
            onClick={() => handleSelect("en")}
            aria-label={dict.nav.switchToEnglish}
            aria-pressed={locale === "en"}
            className={`rounded-md px-2.5 py-1 text-xs font-extrabold transition-colors ${
              locale === "en"
                ? "bg-[#0F284E] text-white"
                : "text-[#475569] hover:text-[#0F284E]"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => handleSelect("fr")}
            aria-label={dict.nav.switchToFrench}
            aria-pressed={locale === "fr"}
            className={`rounded-md px-2.5 py-1 text-xs font-extrabold transition-colors ${
              locale === "fr"
                ? "bg-[#0F284E] text-white"
                : "text-[#475569] hover:text-[#0F284E]"
            }`}
          >
            FR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-[#E2E8F0] bg-slate-50 p-0.5 shadow-2xs shrink-0 ${className}`}
      role="group"
      aria-label={dict.nav.languageLabel}
    >
      <button
        type="button"
        onClick={() => handleSelect("en")}
        aria-label={dict.nav.switchToEnglish}
        aria-pressed={locale === "en"}
        className={`rounded-md px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider transition-colors ${
          locale === "en"
            ? "bg-[#0F284E] text-white shadow-2xs"
            : "text-[#475569] hover:text-[#0F284E]"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSelect("fr")}
        aria-label={dict.nav.switchToFrench}
        aria-pressed={locale === "fr"}
        className={`rounded-md px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider transition-colors ${
          locale === "fr"
            ? "bg-[#0F284E] text-white shadow-2xs"
            : "text-[#475569] hover:text-[#0F284E]"
        }`}
      >
        FR
      </button>
    </div>
  );
}
