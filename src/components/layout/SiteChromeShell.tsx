"use client";

import React from "react";
import { useSelectedLayoutSegment } from "next/navigation";

interface SiteChromeShellProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function SiteChromeShell({
  header,
  footer,
  children,
}: SiteChromeShellProps) {
  const segment = useSelectedLayoutSegment();
  const isAdminArea = segment === "admin" || segment === "login";

  if (isAdminArea) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
