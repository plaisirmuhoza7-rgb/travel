import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { AdminInvoicesClient } from "@/components/admin/AdminInvoicesClient";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const invoices = repository.getInvoices();
  const vehicles = repository.getVehicles();
  const services = repository.getServices(false);
  const enquiries = repository.getEnquiries();

  return (
    <div className="space-y-6">
      <AdminInvoicesClient
        initialInvoices={invoices}
        vehicles={vehicles}
        services={services}
        enquiries={enquiries}
        adminEmail={session.email}
      />
    </div>
  );
}
