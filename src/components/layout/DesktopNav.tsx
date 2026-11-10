"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/lib/i18n/config";

interface NavLinkItem {
  label: string;
  href: string;
}

export function DesktopNav({ links }: { links: NavLinkItem[] }) {
  const rawPathname = usePathname() || "/";
  const pathname = stripLocalePrefix(rawPathname);

  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-7">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href === "/fleet" &&
            (pathname.startsWith("/fleet") || pathname.startsWith("/vehicles")));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-semibold transition-all relative py-1 whitespace-nowrap ${
              isActive
                ? "text-[#0F284E] font-extrabold"
                : "text-[#475569] hover:text-[#0F284E]"
            }`}
          >
            <span>{link.label}</span>
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#0F284E]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
