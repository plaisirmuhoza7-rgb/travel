import React from "react";
import Link from "next/link";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { DesktopNav } from "./DesktopNav";
import { HeaderActions } from "./HeaderActions";
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
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-2.5 shrink-0">
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
            <span className="text-base sm:text-lg xl:text-xl font-bold tracking-tight text-[#0F284E] transition-colors group-hover:text-[#1A3E72] whitespace-nowrap">
              TRAVEL RWANDA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav links={navLinks} />

        {/* Right Language Switcher, Phone & CTA */}
        <HeaderActions />

        {/* Mobile Hamburger & Drawer Client Island */}
        <MobileNavDrawer navLinks={navLinks} />
      </div>
    </header>
  );
}
