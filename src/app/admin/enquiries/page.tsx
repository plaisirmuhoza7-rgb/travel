import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { AdminBookingsDashboard } from "@/components/admin/AdminBookingsDashboard";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminEnquiriesListPage({ searchParams }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { status, search } = await searchParams;
  const enquiries = repository.getEnquiries({ status, search });
  const vehicles = repository.getVehicles();
  const services = repository.getServices(false);

  return (
    <div className="space-y-6">
      <AdminBookingsDashboard
        initialEnquiries={enquiries}
        vehicles={vehicles}
        services={services}
        adminEmail={session.email}
      />
    </div>
  );
}
