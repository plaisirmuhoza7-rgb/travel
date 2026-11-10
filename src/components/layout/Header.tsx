import React from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { DesktopNav } from "./DesktopNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getServerDictionary } from "@/lib/i18n/server";

export async function Header() {
  const { dict } = await getServerDictionary();

  const navLinks = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.fleet, href: "/fleet" },
    { label: dict.nav.services, href: "/services" },
    { label: dict.nav.events, href: "/events" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md gpu-layer shadow-xs">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" }}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white shadow-xs ring-1 ring-[#E2E8F0] transition-transform group-hover:scale-105"
          >
            <img
              src="/logo.png"
              alt={dict.common.logoAlt}
              width={40}
              height={40}
              style={{
                width: "40px",
                height: "40px",
                maxWidth: "40px",
                maxHeight: "40px",
                objectFit: "contain",
                display: "block",
              }}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-bold tracking-tight text-[#0F284E] transition-colors group-hover:text-[#1A3E72] whitespace-nowrap">
              TRAVEL RWANDA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav links={navLinks} />

        {/* Right Language Switcher, Phone & CTA */}
        <div className="hidden md:flex items-center gap-3 xl:gap-4 shrink-0">
          <LanguageSwitcher variant="header" />

          <a
            href="tel:+250784129579"
            className="hidden xl:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F284E] hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D1FAE5] text-[#059669]">
              <Phone className="h-3 w-3" />
            </span>
            <span>{dict.common.phonePrimary}</span>
          </a>

          <Link
            href="/plan-your-journey"
            className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-[#0F284E] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1A3E72] hover:shadow-md active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <span>{dict.nav.planJourney}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-[#091A34]">
              <ArrowRight className="h-3 w-3 stroke-[3]" />
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger & Drawer Client Island */}
        <MobileNavDrawer navLinks={navLinks} />
      </div>
    </header>
  );
}
