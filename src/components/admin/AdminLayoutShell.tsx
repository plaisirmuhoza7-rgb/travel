"use client";

import React from "react";
import { useSelectedLayoutSegment } from "next/navigation";

interface AdminLayoutShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function AdminLayoutShell({ sidebar, children }: AdminLayoutShellProps) {
  const segment = useSelectedLayoutSegment();

  if (segment === "login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {sidebar}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
