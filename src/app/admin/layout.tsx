import React from "react";
import { getAdminSession } from "@/lib/auth";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <AdminLayoutShell
      sidebar={session ? <AdminSidebar userEmail={session.email} /> : null}
    >
      {children}
    </AdminLayoutShell>
  );
}
