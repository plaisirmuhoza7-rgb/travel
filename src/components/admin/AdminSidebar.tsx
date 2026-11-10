"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  LayoutDashboard,
  Car,
  Receipt,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname() || "/admin";
  const { dict } = useI18n();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  const navLinks = [
    {
      href: "/admin",
      label: dict.admin.layout.bookingsDashboard,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/invoices",
      label: dict.admin.layout.invoices || "Invoices & Billing",
      icon: Receipt,
      exact: false,
    },
    {
      href: "/admin/fleet",
      label: dict.admin.layout.fleetAssets,
      icon: Car,
      exact: false,
    },
    {
      href: "/admin/settings",
      label: dict.admin.layout.settings,
      icon: Settings,
      exact: false,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const renderNavLinks = () => (
    <nav className="space-y-1.5 text-xs font-semibold uppercase tracking-wider">
      {navLinks.map((item) => {
        const Icon = item.icon;
        const active = isLinkActive(item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileDrawerOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-all ${
              active
                ? "bg-[#0B3D2E] text-[#FACC15] font-bold border-l-4 border-[#FACC15] shadow-sm"
                : "text-white/80 hover:bg-[#0F284E] hover:text-[#FACC15]"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-[#FACC15]" : "text-[#FACC15]/80"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 1. MOBILE TOP APP BAR (Compact, non-intrusive, not fixed over content) */}
      <div className="md:hidden relative z-30 flex items-center justify-between px-4 py-3 bg-[#061226] border-b border-[#0B3D2E] text-white shadow-md">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-[#FACC15]/30">
            <img
              src="/logo.png"
              alt="Travel Rwanda"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display text-sm font-black tracking-wide text-white block leading-none">
              TRAVEL RWANDA
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#FACC15] uppercase">
              Operations Center
            </span>
          </div>
        </Link>

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F284E] hover:bg-[#0B3D2E] text-[#FACC15] border border-white/10 transition-colors"
          aria-label="Open Admin Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* 2. MOBILE SLIDE-OVER DRAWER & BACKDROP */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Menu Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#061226] text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#0B3D2E] z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-[#FACC15]/30">
                    <img
                      src="/logo.png"
                      alt="Travel Rwanda"
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-display text-sm font-bold text-white block">
                      TRAVEL RWANDA
                    </span>
                    <span className="text-[9px] font-semibold tracking-wider text-[#FACC15] uppercase">
                      Admin Portal
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-[#FACC15] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              {renderNavLinks()}
            </div>

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-white/10 space-y-3 text-xs">
              <LanguageSwitcher variant="admin" />

              <div className="text-[11px] text-white/60 truncate pt-1">
                {dict.admin.layout.signedInAs} <br />
                <strong className="text-[#FACC15] font-mono">{userEmail}</strong>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[#FACC15] hover:underline font-semibold"
                >
                  <span>{dict.admin.layout.liveSite}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <form action="/api/admin/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 text-white/70 hover:text-red-400 font-semibold"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>{dict.admin.layout.logout}</span>
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 3. DESKTOP STICKY SIDEBAR (Firm in position, never scrolls away!) */}
      <aside
        style={{
          backgroundColor: "#061226",
          borderColor: "rgba(11, 61, 46, 0.8)",
        }}
        className="hidden md:flex md:w-64 md:h-screen md:sticky md:top-0 md:shrink-0 flex-col justify-between text-white p-6 border-r overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-[#FACC15]/40 shadow-sm overflow-hidden">
              <img
                src="/logo.png"
                alt="Travel Rwanda"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display text-base font-black tracking-wide text-white block leading-tight">
                TRAVEL RWANDA
              </span>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#FACC15] uppercase">
                {dict.admin.layout.adminControlCenter}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          {renderNavLinks()}
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <LanguageSwitcher variant="admin" />

          <div className="text-[11px] text-white/60 truncate">
            {dict.admin.layout.signedInAs} <br />
            <strong className="text-[#FACC15] font-mono">{userEmail}</strong>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[#FACC15] hover:underline font-semibold"
            >
              <span>{dict.admin.layout.liveSite}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <form action="/api/admin/auth/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1 text-white/70 hover:text-red-400 font-semibold cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
                <span>{dict.admin.layout.logout}</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
