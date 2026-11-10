"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { stripLocalePrefix } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavLinkItem {
  label: string;
  href: string;
}

export function MobileNavDrawer({ navLinks }: { navLinks: NavLinkItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const rawPathname = usePathname() || "/";
  const pathname = stripLocalePrefix(rawPathname);
  const { dict } = useI18n();

  const labelByHref: Record<string, string> = {
    "/": dict.nav.home,
    "/fleet": dict.nav.fleet,
    "/services": dict.nav.services,
    "/events": dict.nav.events,
    "/about": dict.nav.about,
    "/contact": dict.nav.contact,
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
      <LanguageSwitcher variant="header" />
      <Link
        href="/plan-your-journey"
        className="hidden sm:inline-flex rounded-lg bg-[#0F284E] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap"
      >
        {dict.nav.planShort}
      </Link>
      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="rounded-lg p-2 text-[#0F284E] hover:bg-slate-100"
        aria-label={dict.nav.toggleMenu}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-20 z-50 border-b border-[#E2E8F0] bg-white px-6 py-6 transition-all shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/fleet" &&
                  (pathname.startsWith("/fleet") || pathname.startsWith("/vehicles")));
              const displayLabel = labelByHref[link.href] ?? link.label;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-base font-bold transition-colors ${
                    isActive
                      ? "bg-slate-100 text-[#0F284E]"
                      : "text-[#475569] hover:bg-slate-50 hover:text-[#0F284E]"
                  }`}
                >
                  {displayLabel}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-col gap-3">
              <LanguageSwitcher
                variant="drawer"
                onSwitch={() => setMobileMenuOpen(false)}
              />
              <a
                href="tel:+250784129579"
                className="flex items-center gap-2 text-sm font-bold text-[#0F284E] px-3.5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D1FAE5] text-[#059669]">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                {dict.common.phonePrimary}
              </a>
              <Link
                href="/plan-your-journey"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F284E] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md active:bg-[#1A3E72]"
              >
                <span>{dict.notFound.planJourney}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-[#091A34]">
                  <ArrowRight className="h-3 w-3 stroke-[3]" />
                </span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
