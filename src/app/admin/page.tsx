import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { AdminBookingsDashboard } from "@/components/admin/AdminBookingsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const enquiries = repository.getEnquiries();
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
