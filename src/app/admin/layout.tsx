import React from "react";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import {
  LayoutDashboard,
  Car,
  Receipt,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const { dict } = await getServerDictionary();

  const sidebar = session ? (
    <aside className="w-full md:w-64 bg-[#06281E] text-[#F7F6F2] p-6 flex flex-col justify-between shrink-0 border-r border-[#BCA77B]/20">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div
            style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 overflow-hidden shadow-sm"
          >
            <img
              src="/logo.png"
              alt={dict.common.logoAlt}
              width={34}
              height={34}
              style={{
                width: "34px",
                height: "34px",
                maxWidth: "34px",
                maxHeight: "34px",
                objectFit: "contain",
                display: "block",
              }}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-wider text-[#F7F6F2] block leading-tight">
              {dict.common.brandName.toUpperCase()}
            </span>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#BCA77B] uppercase">
              {dict.admin.layout.adminControlCenter}
            </p>
          </div>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold uppercase tracking-wider">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded px-3 py-2 text-[#F7F6F2]/80 hover:bg-[#0B3D2E] hover:text-[#BCA77B] transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-[#BCA77B]" />
            <span>{dict.admin.layout.bookingsDashboard}</span>
          </Link>

          <Link
            href="/admin/invoices"
            className="flex items-center gap-2.5 rounded px-3 py-2 text-[#F7F6F2]/80 hover:bg-[#0B3D2E] hover:text-[#BCA77B] transition-colors"
          >
            <Receipt className="h-4 w-4 text-[#BCA77B]" />
            <span>{dict.admin.layout.invoices || "Invoices & Billing"}</span>
          </Link>

          <Link
            href="/admin/fleet"
            className="flex items-center gap-2.5 rounded px-3 py-2 text-[#F7F6F2]/80 hover:bg-[#0B3D2E] hover:text-[#BCA77B] transition-colors"
          >
            <Car className="h-4 w-4 text-[#BCA77B]" />
            <span>{dict.admin.layout.fleetAssets}</span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 rounded px-3 py-2 text-[#F7F6F2]/80 hover:bg-[#0B3D2E] hover:text-[#BCA77B] transition-colors"
          >
            <Settings className="h-4 w-4 text-[#BCA77B]" />
            <span>{dict.admin.layout.settings}</span>
          </Link>
        </nav>
      </div>

      <div className="pt-6 border-t border-[#F7F6F2]/10 space-y-3">
        <LanguageSwitcher variant="admin" />

        <div className="text-[11px] text-[#F7F6F2]/60 truncate">
          {dict.admin.layout.signedInAs} <br />
          <strong className="text-[#F7F6F2] font-mono">{session.email}</strong>
        </div>

        <div className="flex items-center justify-between text-xs pt-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-[#BCA77B] hover:underline"
          >
            <span>{dict.admin.layout.liveSite}</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <form action="/api/admin/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1 text-[#F7F6F2]/70 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              <span>{dict.admin.layout.logout}</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  ) : null;

  return <AdminLayoutShell sidebar={sidebar}>{children}</AdminLayoutShell>;
}
