import React from "react";
import type { Metadata } from "next";
import { getServerDictionary } from "@/lib/i18n/server";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: `${dict.admin.login.portalTitle} | ${dict.common.brandName}`,
    description: dict.admin.login.portalSubtitle,
  };
}

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
