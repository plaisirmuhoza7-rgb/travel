"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InvoiceRecord, Vehicle, ServiceItem, EnquiryRecord } from "@/lib/seed-data";
import { InvoiceModal } from "./InvoiceModal";
import {
  Receipt,
  Search,
  Filter,
  Plus,
  Printer,
  MessageSquare,
  CheckCircle,
  Clock,
  CreditCard,
  Building2,
  Calendar,
  X,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react";

interface Props {
  initialInvoices: InvoiceRecord[];
  vehicles: Vehicle[];
  services: ServiceItem[];
  enquiries: EnquiryRecord[];
  adminEmail: string;
}

export function AdminInvoicesClient({
  initialInvoices,
  vehicles,
  services,
  enquiries,
  adminEmail,
}: Props) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected invoice for modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  // New Invoice Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Invoice Form Data
  const [newInvoiceData, setNewInvoiceData] = useState({
    enquiryId: "",
    clientName: "",
    clientCompany: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    clientTin: "",
    serviceType: "car-rental",
    pickupLocation: "Kigali International Airport (KGL)",
    dropoffLocation: "",
    pickupDate: new Date().toISOString().slice(0, 10),
    pickupTime: "09:00",
    returnDate: "",
    vehicleName: "",
    driverName: "",
    driverPhone: "",
    passengerCount: 1,
    unitPriceRwf: 50000,
    quantity: 1,
    description: "Executive Chauffeur & Vehicle Hire",
    taxRatePercent: 0,
    status: "Issued" as InvoiceRecord["status"],
    notes: "Official Transport Tax Invoice. Thank you for choosing Travel Rwanda.",
  });

  // When admin selects an existing booking to bill:
  const handleSelectBooking = (enquiryId: string) => {
    const enq = enquiries.find((e) => e.id === enquiryId);
    if (!enq) {
      setNewInvoiceData((prev) => ({ ...prev, enquiryId: "" }));
      return;
    }

    setNewInvoiceData((prev) => ({
      ...prev,
      enquiryId: enq.id,
      clientName: enq.customerName,
      clientPhone: enq.customerPhone,
      clientEmail: enq.customerEmail || "",
      clientAddress: enq.pickupLocation,
      serviceType: enq.serviceType,
      pickupLocation: enq.pickupLocation,
      dropoffLocation: enq.dropoffLocation || "",
      pickupDate: enq.pickupDate,
      pickupTime: enq.pickupTime,
      returnDate: enq.returnDate || "",
      vehicleName: enq.assignedVehicleName || "",
      driverName: enq.driverName || "",
      driverPhone: enq.driverPhone || "",
      passengerCount: enq.passengerCount,
      unitPriceRwf: enq.quotedPriceRwf || 50000,
      quantity: 1,
      description: `${enq.serviceType.replace(/-/g, " ").toUpperCase()} - ${enq.pickupLocation} to ${enq.dropoffLocation || "Kigali"}`,
    }));
  };

  // Create Invoice Handler
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const items = [
        {
          id: `item-${Date.now()}-1`,
          description: newInvoiceData.description,
          quantity: Number(newInvoiceData.quantity) || 1,
          unitPriceRwf: Number(newInvoiceData.unitPriceRwf) || 0,
          totalRwf: (Number(newInvoiceData.quantity) || 1) * (Number(newInvoiceData.unitPriceRwf) || 0),
        },
      ];

      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newInvoiceData,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      setInvoices((prev) => [data.invoice, ...prev]);
      setIsCreateModalOpen(false);
      setSelectedInvoice(data.invoice);
      router.refresh();
    } catch (err: any) {
      alert("Error creating invoice: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.clientName.toLowerCase().includes(q) ||
          i.clientPhone.toLowerCase().includes(q) ||
          (i.clientEmail && i.clientEmail.toLowerCase().includes(q)) ||
          (i.clientCompany && i.clientCompany.toLowerCase().includes(q)) ||
          (i.referenceCode && i.referenceCode.toLowerCase().includes(q)) ||
          (i.vehicleName && i.vehicleName.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((i) => i.status.toLowerCase() === statusFilter.toLowerCase());
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [invoices, searchQuery, statusFilter]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalCount = invoices.length;
    const paidCount = invoices.filter((i) => i.status === "Paid").length;
    const issuedCount = invoices.filter((i) => i.status === "Issued").length;

    const totalInvoicedRwf = invoices
      .filter((i) => i.status !== "Cancelled")
      .reduce((sum, i) => sum + i.totalRwf, 0);

    const paidTotalRwf = invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.totalRwf, 0);

    const pendingTotalRwf = invoices
      .filter((i) => i.status === "Issued" || i.status === "Draft")
      .reduce((sum, i) => sum + i.totalRwf, 0);

    return {
      totalCount,
      paidCount,
      issuedCount,
      totalInvoicedRwf,
      paidTotalRwf,
      pendingTotalRwf,
    };
  }, [invoices]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
            Commercial & Billing Center
          </span>
          <h1 className="font-display text-3xl font-bold text-[#0F284E] tracking-tight mt-0.5">
            Official Tax Invoices & Vouchers
          </h1>
          <p className="text-xs text-[#171D19]/70 mt-1">
            Generate, customize, and print verified Travel Rwanda invoices with Rwanda TIN (120 488 950), MoMo Pay, and official stamps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded bg-[#0F284E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#061226] shadow-sm transition-all"
          >
            <Plus className="h-4 w-4 text-[#FACC15]" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#CBD5E1] bg-white p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#171D19]/50 block">Total Invoiced</span>
          <span className="font-display text-xl sm:text-2xl font-black text-[#0F284E] mt-1 block font-mono">
            {stats.totalInvoicedRwf.toLocaleString()} RWF
          </span>
          <span className="text-[11px] text-[#171D19]/60 block mt-0.5 font-mono">
            {stats.totalCount} invoices logged
          </span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Collected & Paid</span>
          <span className="font-display text-xl sm:text-2xl font-black text-emerald-700 mt-1 block font-mono">
            {stats.paidTotalRwf.toLocaleString()} RWF
          </span>
          <span className="text-[11px] text-emerald-800/70 block mt-0.5">
            {stats.paidCount} paid invoice(s)
          </span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Outstanding / Due</span>
          <span className="font-display text-xl sm:text-2xl font-black text-amber-700 mt-1 block font-mono">
            {stats.pendingTotalRwf.toLocaleString()} RWF
          </span>
          <span className="text-[11px] text-amber-800/70 block mt-0.5">
            {stats.issuedCount} pending remittance
          </span>
        </div>

        <div className="rounded-xl border border-[#CBD5E1] bg-white p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#171D19]/50 block">Official Details</span>
          <div className="text-xs font-bold text-[#0F284E] mt-1">TIN: 120 488 950</div>
          <div className="text-[11px] text-[#171D19]/70 font-mono">MoMo Pay: 841295</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-[#CBD5E1] bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#171D19]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice number, customer name, phone, company, or booking reference..."
            className="w-full rounded-md border border-[#CBD5E1] bg-[#F7F6F2] pl-9 pr-8 py-2 text-xs text-[#171D19] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-[#171D19]/40 hover:text-[#171D19]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-[#171D19]/50 uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-[#CBD5E1] bg-[#F7F6F2] px-3 py-2 text-xs text-[#171D19] focus:outline-none"
          >
            <option value="all">All Invoices ({invoices.length})</option>
            <option value="Issued">Issued / Pending ({stats.issuedCount})</option>
            <option value="Paid">Paid ({stats.paidCount})</option>
            <option value="Draft">Draft</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="rounded-xl border border-[#CBD5E1] bg-white shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="h-10 w-10 text-[#BCA77B] mx-auto opacity-60" />
            <h3 className="font-display text-lg font-bold text-[#0F284E]">No Invoices Found</h3>
            <p className="text-xs text-[#171D19]/60 max-w-sm mx-auto">
              No invoice matches your search or filter criteria. Create a new invoice or generate one directly from any booking enquiry.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded bg-[#0F284E] text-[#F7F6F2] px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              <Plus className="h-3.5 w-3.5 text-[#FACC15]" />
              <span>+ Create Invoice</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F284E] text-[#F7F6F2] uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client / Company</th>
                  <th className="py-3 px-4">Service & Vehicle</th>
                  <th className="py-3 px-4">Date Issued</th>
                  <th className="py-3 px-4 text-right">Amount (RWF)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredInvoices.map((inv) => {
                  const isPaid = inv.status === "Paid";
                  const cleanPhone = inv.clientPhone.replace(/[^0-9]/g, "");
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${inv.clientName}, regarding your Travel Rwanda Invoice [${inv.invoiceNumber}] for ${inv.totalRwf.toLocaleString()} RWF...`
                  )}`;

                  return (
                    <tr key={inv.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#0F284E] block">
                          {inv.invoiceNumber}
                        </span>
                        {inv.referenceCode && (
                          <span className="text-[10px] font-mono text-[#171D19]/50 block">
                            Ref: {inv.referenceCode}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-[#0F284E] block text-xs">{inv.clientName}</strong>
                        {inv.clientCompany && (
                          <span className="text-[11px] text-[#0B3D2E] font-medium block">
                            {inv.clientCompany}
                          </span>
                        )}
                        <span className="text-[10px] text-[#171D19]/60 font-mono block">
                          {inv.clientPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-[#171D19] block">
                          {(inv.serviceType || "Car Rental").replace(/-/g, " ")}
                        </span>
                        {inv.vehicleName && (
                          <span className="text-[11px] text-[#0B3D2E] block truncate max-w-[180px]">
                            🚗 {inv.vehicleName}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#171D19]/80">
                        <div>{inv.issueDate}</div>
                        <div className="text-[10px] text-[#171D19]/50">Due: {inv.dueDate}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#0F284E]">
                        {inv.totalRwf.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                              : inv.status === "Issued"
                              ? "bg-sky-50 text-sky-900 border-sky-300"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isPaid ? "bg-emerald-600" : inv.status === "Issued" ? "bg-sky-600" : "bg-gray-400"
                            }`}
                          />
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="inline-flex items-center gap-1 rounded bg-[#0F284E] text-[#F7F6F2] hover:bg-[#061226] px-2.5 py-1 text-[11px] font-semibold transition-all shadow-2xs"
                        >
                          <Printer className="h-3 w-3 text-[#FACC15]" />
                          <span>View / Print</span>
                        </button>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 px-2 py-1 text-[11px] font-semibold transition-all"
                          title="Open WhatsApp chat with client"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW / PRINT / EDIT INVOICE */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          onUpdateInvoice={(updated) => {
            setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
            setSelectedInvoice(updated);
          }}
        />
      )}

      {/* MODAL 2: + CREATE NEW CUSTOM INVOICE */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06281E]/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-[#BCA77B]/40 bg-white p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BCA77B]">
                  Billing Generator
                </span>
                <h3 className="font-display text-xl font-bold text-[#0F284E]">
                  Create Official Tax Invoice
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded p-1 text-[#171D19]/40 hover:text-[#171D19]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              {/* Optional: Pick existing booking enquiry */}
              <div className="rounded-lg bg-[#F7F6F2] p-3 border border-[#E2E8F0] space-y-1">
                <label className="font-bold text-[#0F284E] block">
                  Autofill from Existing Booking (Optional)
                </label>
                <select
                  value={newInvoiceData.enquiryId}
                  onChange={(e) => handleSelectBooking(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-2 text-xs"
                >
                  <option value="">-- Custom Invoice (or choose booking to autofill) --</option>
                  {enquiries.map((enq) => (
                    <option key={enq.id} value={enq.id}>
                      {enq.referenceCode} - {enq.customerName} ({enq.serviceType} &bull; {enq.pickupDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sarah Lindqvist"
                    value={newInvoiceData.clientName}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, clientName: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+250 788 000 000"
                    value={newInvoiceData.clientPhone}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, clientPhone: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Global Health Initiative"
                    value={newInvoiceData.clientCompany}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, clientCompany: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>
              </div>

              {/* Service & Fleet Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Service Type</label>
                  <select
                    value={newInvoiceData.serviceType}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, serviceType: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  >
                    <option value="car-rental">Car Rental</option>
                    <option value="airport-transfer">Airport Transfer</option>
                    <option value="wedding-event">Weddings & Ceremonies</option>
                    <option value="group-transport">Vans & Group Transport</option>
                    <option value="corporate-transport">Corporate & Event Transport</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Allocated Fleet Vehicle</label>
                  <select
                    value={newInvoiceData.vehicleName}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, vehicleName: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  >
                    <option value="">-- Choose fleet vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                    <option value="Other Partner Vehicle">Other Partner Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Initial Status</label>
                  <select
                    value={newInvoiceData.status}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, status: e.target.value as any })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  >
                    <option value="Issued">Issued (Awaiting Payment)</option>
                    <option value="Paid">Paid</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Route & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={newInvoiceData.pickupLocation}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, pickupLocation: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Destination / Drop-off</label>
                  <input
                    type="text"
                    placeholder="e.g. Kigali Marriott Hotel"
                    value={newInvoiceData.dropoffLocation}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dropoffLocation: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>
              </div>

              {/* Service Line Item & Rate */}
              <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                <span className="font-bold text-[#0F284E] block uppercase tracking-wider text-[10px]">
                  Billing Line Item & Pricing (RWF)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-7">
                    <label className="font-semibold text-[#171D19]/70 block mb-0.5">Description</label>
                    <input
                      type="text"
                      required
                      value={newInvoiceData.description}
                      onChange={(e) => setNewInvoiceData({ ...newInvoiceData, description: e.target.value })}
                      className="w-full rounded border border-[#CBD5E1] bg-white p-2"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#171D19]/70 block mb-0.5">Qty / Days</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newInvoiceData.quantity}
                      onChange={(e) => setNewInvoiceData({ ...newInvoiceData, quantity: Number(e.target.value) })}
                      className="w-full rounded border border-[#CBD5E1] bg-white p-2 text-center font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-semibold text-[#171D19]/70 block mb-0.5">Rate (RWF)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newInvoiceData.unitPriceRwf}
                      onChange={(e) => setNewInvoiceData({ ...newInvoiceData, unitPriceRwf: Number(e.target.value) })}
                      className="w-full rounded border border-[#CBD5E1] bg-white p-2 text-right font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0] text-xs font-bold">
                  <span className="text-[#171D19]/60">Total Estimated:</span>
                  <span className="font-mono text-base text-[#0F284E]">
                    {((newInvoiceData.quantity || 1) * (newInvoiceData.unitPriceRwf || 0)).toLocaleString()} RWF
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded px-4 py-2 font-semibold text-[#171D19]/70 hover:bg-[#F7F6F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-[#0F284E] text-[#F7F6F2] px-5 py-2 font-bold uppercase tracking-wider hover:bg-[#061226] disabled:opacity-50"
                >
                  {isSubmitting ? "Generating..." : "Generate Official Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
