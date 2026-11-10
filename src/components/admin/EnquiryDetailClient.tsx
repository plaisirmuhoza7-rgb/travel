"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EnquiryRecord, StatusHistoryItem, EnquiryNoteItem, NotificationLogItem, Vehicle, InvoiceRecord } from "@/lib/seed-data";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { getServiceLabelBySlug } from "@/lib/i18n";
import { localizeVehicle } from "@/lib/i18n/catalog";
import { InvoiceModal } from "./InvoiceModal";
import {
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Send,
  UserCheck,
  Car,
  Receipt,
} from "lucide-react";

interface Props {
  enquiry: EnquiryRecord;
  history: StatusHistoryItem[];
  notes: EnquiryNoteItem[];
  notifications: NotificationLogItem[];
  adminEmail: string;
  vehicles?: Vehicle[];
}

export function EnquiryDetailClient({
  enquiry,
  history,
  notes,
  notifications,
  vehicles = [],
}: Props) {
  const router = useRouter();
  const { locale, dict } = useI18n();
  const ed = dict.admin.enquiryDetailClient;
  const statusesMap: Record<string, string> = dict.admin.bookingsDashboard.statuses;
  const getStatusLabel = (status: string) => statusesMap[status] || status;
  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

  const [selectedStatus, setSelectedStatus] = useState(enquiry.status);
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fleet & Driver Allocation State
  const [assignedVehicleName, setAssignedVehicleName] = useState(enquiry.assignedVehicleName || "");
  const [assignedVehicleId, setAssignedVehicleId] = useState(enquiry.assignedVehicleId || "");
  const [driverName, setDriverName] = useState(enquiry.driverName || "");
  const [driverPhone, setDriverPhone] = useState(enquiry.driverPhone || "");
  const [quotedPrice, setQuotedPrice] = useState(enquiry.quotedPriceRwf?.toString() || "");
  const [isSavingFleet, setIsSavingFleet] = useState(false);

  const [newNoteBody, setNewNoteBody] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Invoice State
  const [invoiceToView, setInvoiceToView] = useState<InvoiceRecord | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  const handleOpenInvoice = async () => {
    setIsLoadingInvoice(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryId: enquiry.id, action: "generate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate invoice");
      setInvoiceToView(data.invoice);
    } catch (err: any) {
      alert("Error generating invoice: " + err.message);
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  // Status Update Handler
  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStatus(true);
    setActionMessage(null);

    try {
      const label = getStatusLabel(selectedStatus);
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote || `${ed.autoStatusNotePrefix}${label}`,
          locale,
        }),
      });

      if (!res.ok) throw new Error(ed.failedUpdateStatus);

      setActionMessage(`${ed.statusUpdatedPrefix}${label}`);
      setStatusNote("");
      router.refresh();
    } catch (err: any) {
      setActionMessage(ed.errorUpdatingStatus + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Add Note Handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteBody.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newNoteBody, locale }),
      });

      if (!res.ok) throw new Error(ed.failedAddNote);

      setNewNoteBody("");
      router.refresh();
    } catch (err: any) {
      alert(ed.errorAddingNote + err.message);
    } finally {
      setIsAddingNote(false);
    }
  };

  // Save Fleet Allocation & Pricing
  const handleSaveFleetAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFleet(true);
    setActionMessage(null);
    try {
      const matched = vehicles.find((v) => v.name === assignedVehicleName);
      const displayVehicleName = matched
        ? localizeVehicle(matched, locale).name
        : assignedVehicleName;

      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: assignedVehicleId,
          vehicleName: assignedVehicleName,
          driverName,
          driverPhone,
          note: `${ed.assignNotePrefix}${displayVehicleName}${driverName ? ` (${ed.assignNoteDriverPrefix}${driverName})` : ""}`,
          locale,
        }),
      });

      if (!res.ok) throw new Error(ed.failedAssignVehicle);

      if (quotedPrice) {
        await fetch(`/api/admin/enquiries/${enquiry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quotedPriceRwf: Number(quotedPrice), locale }),
        });
      }

      setActionMessage(ed.fleetSavedMsg);
      router.refresh();
    } catch (err: any) {
      setActionMessage(ed.errorSavingFleet + err.message);
    } finally {
      setIsSavingFleet(false);
    }
  };

  // Retry Notification
  const handleRetryNotification = async () => {
    setIsRetryingEmail(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/retry-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ed.retryFailed);
      alert(ed.retryTriggeredMsg);
      router.refresh();
    } catch (err: any) {
      alert(ed.retryErrorPrefix + err.message);
    } finally {
      setIsRetryingEmail(false);
    }
  };

  const cleanPhone = enquiry.customerPhone.replace(/[^0-9]/g, "");
  const waText = `${ed.whatsappEnquiryGreeting}${enquiry.customerName}${ed.whatsappEnquiryMid}${enquiry.referenceCode}]:`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
  const preferredContactLabel =
    dict.contact.form.replyMethods[
      enquiry.preferredContactMethod as "whatsapp" | "phone" | "email"
    ] || enquiry.preferredContactMethod;

  return (
    <div className="space-y-8">
      {actionMessage && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
          {actionMessage}
        </div>
      )}

      {/* Official Invoice & Travel Voucher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[var(--color-border-subtle)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F284E] text-[#FACC15]">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BCA77B] tracking-wider block">
              Official Tax Invoice & Voucher
            </span>
            <span className="text-xs font-semibold text-[#0F284E]">
              Print or dispatch official verified invoice with Travel Rwanda logo & MoMo Pay
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenInvoice}
          disabled={isLoadingInvoice}
          className="inline-flex items-center gap-1.5 rounded bg-[#0F284E] text-[#F7F6F2] hover:bg-[#061226] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-xs shrink-0 disabled:opacity-50"
        >
          <Receipt className="h-4 w-4 text-[#FACC15]" />
          <span>{isLoadingInvoice ? "Generating..." : "Generate / View Official Invoice"}</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Customer & Journey Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Customer Info */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#0B3D2E] border-b border-[var(--color-border-subtle)] pb-2 flex items-center justify-between">
              <span>{ed.customerInfoTitle}</span>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-sans font-semibold text-[#0B3D2E] hover:text-[#BCA77B] flex items-center gap-1"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>{ed.openInWhatsapp}</span>
              </a>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.fullName}
                </span>
                <span className="text-sm font-semibold text-[#0B3D2E]">{enquiry.customerName}</span>
              </div>

              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.contactPhoneWhatsapp}
                </span>
                <span className="text-sm font-semibold text-[#0B3D2E]">{enquiry.customerPhone}</span>
              </div>

              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.email}
                </span>
                <span className="text-xs text-[#171D19]/80">{enquiry.customerEmail}</span>
              </div>

              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.preferredChannel}
                </span>
                <span className="text-xs uppercase font-bold text-[#BCA77B]">
                  {preferredContactLabel}
                </span>
              </div>
            </div>

            {enquiry.bookingForSomeoneElse && (
              <div className="rounded-md bg-[#F7F6F2] border border-[#BCA77B]/40 p-3 text-xs space-y-1">
                <strong className="text-[#0B3D2E] flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-[#BCA77B]" />
                  {ed.thirdPartyTitle}
                </strong>
                <p>
                  {ed.travellerName} <strong>{enquiry.travellerName || ed.notSpecified}</strong>
                </p>
                <p>
                  {ed.travellerPhone} <strong>{enquiry.travellerPhone || ed.notSpecified}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Journey Logistics */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#0B3D2E] border-b border-[var(--color-border-subtle)] pb-2">
              {ed.journeyLogisticsTitle}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.serviceType}
                </span>
                <span className="text-sm font-semibold text-[#0B3D2E]">
                  {getServiceLabelBySlug(enquiry.serviceType, dict)}
                </span>
              </div>

              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.passengers}
                </span>
                <span className="text-sm font-semibold text-[#0B3D2E]">
                  {enquiry.passengerCount}{ed.personsSuffix}
                </span>
              </div>

              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.pickupLocation}
                </span>
                <span className="text-xs font-semibold text-[#171D19]">
                  {enquiry.pickupLocation}
                </span>
              </div>

              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.dropoffDestination}
                </span>
                <span className="text-xs text-[#171D19]/80">
                  {enquiry.dropoffLocation || ed.notSpecified}
                </span>
              </div>

              <div>
                <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                  {ed.pickupDateTimeLabel}
                </span>
                <span className="text-xs font-mono font-semibold text-[#0B3D2E]">
                  {enquiry.pickupDate} {ed.utcAtWord} {enquiry.pickupTime}
                </span>
              </div>

              {enquiry.returnDate && (
                <div>
                  <span className="text-[#171D19]/50 uppercase font-semibold block text-[10px]">
                    {ed.returnDateTimeLabel}
                  </span>
                  <span className="text-xs font-mono text-[#0B3D2E]">
                    {enquiry.returnDate} {ed.utcAtWord} {enquiry.returnTime || dict.common.notApplicable}
                  </span>
                </div>
              )}
            </div>

            {enquiry.serviceSpecificData && Object.keys(enquiry.serviceSpecificData).length > 0 && (
              <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                <span className="text-[10px] uppercase font-semibold text-[#171D19]/50 block mb-1">
                  {ed.serviceSpecificDetails}
                </span>
                <pre className="rounded bg-[#F7F6F2] p-2.5 font-mono text-[11px] text-[#171D19]/80 overflow-x-auto">
                  {JSON.stringify(enquiry.serviceSpecificData, null, 2)}
                </pre>
              </div>
            )}

            {enquiry.customerNotes && (
              <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                <span className="text-[10px] uppercase font-semibold text-[#171D19]/50 block mb-1">
                  {ed.customerNotesRequests}
                </span>
                <p className="rounded bg-[#F7F6F2] p-3 text-xs text-[#171D19]/80 italic">
                  &ldquo;{enquiry.customerNotes}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Fleet Allocation, Status Workflow & Staff Notes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vehicle & Fleet Allocation Card */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#0B3D2E] border-b border-[var(--color-border-subtle)] pb-2 flex items-center justify-between">
              <span>{ed.fleetAllocationTitle}</span>
              <Car className="h-4 w-4 text-[#BCA77B]" />
            </h3>

            <form onSubmit={handleSaveFleetAllocation} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171D19]/70">
                  {ed.assignedVehicle}
                </label>
                <select
                  value={assignedVehicleName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssignedVehicleName(val);
                    const v = vehicles.find((item) => item.name === val);
                    if (v) setAssignedVehicleId(v.id);
                  }}
                  className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs font-semibold text-[#0B3D2E]"
                >
                  <option value="">{ed.noVehicleAssigned}</option>
                  {vehicles.map((rawV) => {
                    const v = localizeVehicle(rawV, locale);
                    return (
                      <option key={rawV.id} value={rawV.name}>
                        {v.name} ({v.passengerCapacity ? `${v.passengerCapacity} ${dict.common.seatsLabel.toLowerCase()}` : ed.customLabel})
                      </option>
                    );
                  })}
                  <option value="Other Partner Vehicle">{ed.otherPartnerVehicle}</option>
                </select>
              </div>

              {assignedVehicleName === "Other Partner Vehicle" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171D19]/70">
                    {ed.customVehicleName}
                  </label>
                  <input
                    type="text"
                    placeholder={dict.admin.bookingsDashboard.assignModal.customVehiclePlaceholder}
                    onChange={(e) => setAssignedVehicleName(e.target.value)}
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[#171D19]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171D19]/70">
                    {ed.driverName}
                  </label>
                  <input
                    type="text"
                    placeholder={dict.admin.bookingsDashboard.newBookingModal.driverNamePlaceholder}
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[#171D19]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171D19]/70">
                    {ed.driverPhone}
                  </label>
                  <input
                    type="text"
                    placeholder="+250 788 000 000"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[#171D19]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171D19]/70">
                  {ed.agreedPriceRwf}
                </label>
                <input
                  type="number"
                  placeholder={dict.admin.bookingsDashboard.newBookingModal.quotedPricePlaceholder}
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs font-mono font-bold text-[#0B3D2E]"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingFleet}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-[#0B3D2E] py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] disabled:opacity-50"
              >
                <span>{isSavingFleet ? ed.saving : ed.saveFleetAllocation}</span>
              </button>
            </form>
          </div>

          {/* Status Workflow Action Card */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#0B3D2E] border-b border-[var(--color-border-subtle)] pb-2">
              {ed.statusWorkflowTitle}
            </h3>

            {selectedStatus === "Confirmed" && (
              <div className="rounded-md bg-yellow-50 border border-yellow-300 p-3 text-xs text-yellow-900 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-yellow-600" />
                <div>
                  <strong>{ed.manualCheckPrefix}</strong>{ed.manualCheckBody}
                </div>
              </div>
            )}

            <form onSubmit={handleStatusChange} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171D19]/70">
                  {ed.updateStatus}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs font-semibold text-[#0B3D2E]"
                >
                  <option value="New">{dict.admin.bookingsDashboard.statuses.New}</option>
                  <option value="Contacted">{dict.admin.bookingsDashboard.statuses.Contacted}</option>
                  <option value="Quoted">{dict.admin.bookingsDashboard.statuses.Quoted}</option>
                  <option value="Confirmed">{ed.confirmedWithVehicle}</option>
                  <option value="Completed">{dict.admin.bookingsDashboard.statuses.Completed}</option>
                  <option value="Cancelled">{dict.admin.bookingsDashboard.statuses.Cancelled}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171D19]/70">
                  {ed.auditNoteLabel}
                </label>
                <input
                  type="text"
                  placeholder={ed.auditNotePlaceholder}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[#171D19]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingStatus}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-[#0B3D2E] py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] disabled:opacity-50"
              >
                <span>{ed.saveStatusChange}</span>
              </button>
            </form>
          </div>

          {/* Private Staff Notes */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#0B3D2E] border-b border-[var(--color-border-subtle)] pb-2">
              {ed.privateNotesTitle}
            </h3>
            <p className="text-[11px] text-[#171D19]/60">
              {ed.privateNotesDesc}
            </p>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                placeholder={ed.privateNotePlaceholder}
                value={newNoteBody}
                onChange={(e) => setNewNoteBody(e.target.value)}
                className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-3 py-2 text-xs text-[#171D19]"
              />
              <button
                type="submit"
                disabled={isAddingNote || !newNoteBody.trim()}
                className="inline-flex items-center gap-1 rounded bg-[#0B3D2E]/10 px-3 py-1.5 text-xs font-semibold text-[#0B3D2E] hover:bg-[#0B3D2E] hover:text-[#F7F6F2] disabled:opacity-40"
              >
                <Send className="h-3 w-3" />
                <span>{ed.addNote}</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {notes.length === 0 ? (
                <p className="text-xs text-[#171D19]/50 italic">{ed.noInternalNotes}</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="rounded border border-[var(--color-border-subtle)] p-2.5 bg-[#F7F6F2]/40 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-[#171D19]/50 mb-1">
                      <span>{n.authorEmail}</span>
                      <span>{new Date(n.createdAt).toLocaleDateString(dateLocale)}</span>
                    </div>
                    <p className="text-xs text-[#171D19]/80">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Email Notification Logs */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
              <h3 className="font-display text-lg font-bold text-[#0B3D2E]">
                {ed.emailLogsTitle}
              </h3>
              <button
                type="button"
                onClick={handleRetryNotification}
                disabled={isRetryingEmail}
                className="inline-flex items-center gap-1 text-[11px] text-[#0B3D2E] hover:text-[#BCA77B]"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{ed.retryEmails}</span>
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-[#171D19]/50 italic">{ed.noEmailLogs}</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="rounded border border-[var(--color-border-subtle)] p-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="uppercase font-semibold text-[#0B3D2E]">
                      {ed.recipientTypes[notif.recipientType as "staff" | "customer"] || notif.recipientType}
                    </span>
                    <span
                      className={`font-semibold ${
                        notif.status === "sent"
                          ? "text-emerald-700"
                          : notif.status === "unconfigured"
                          ? "text-yellow-700"
                          : "text-red-600"
                      }`}
                    >
                      {ed.emailStatuses[notif.status as "sent" | "unconfigured" | "failed"] || notif.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#171D19]/70">{notif.recipientEmail}</p>
                  {notif.errorMessage && (
                    <p className="text-[10px] text-red-600">{notif.errorMessage}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status History Audit Timeline */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-display text-xl font-bold text-[#0B3D2E]">
          {ed.auditTrailTitle}
        </h3>
        <div className="space-y-3">
          {history.map((hist) => (
            <div
              key={hist.id}
              className="flex items-start gap-3 border-l-2 border-[#BCA77B] pl-4 text-xs"
            >
              <div>
                <span className="font-mono text-[10px] text-[#171D19]/50 block">
                  {new Date(hist.createdAt).toLocaleString(dateLocale)} · {ed.changedByPrefix}{hist.changedByEmail}
                </span>
                <p className="text-[#0B3D2E] font-semibold mt-0.5">
                  {hist.previousStatus ? getStatusLabel(hist.previousStatus) : dict.common.notApplicable} → {getStatusLabel(hist.newStatus)}
                </p>
                <p className="text-[#171D19]/70 mt-0.5">{hist.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INVOICE MODAL */}
      {invoiceToView && (
        <InvoiceModal
          invoice={invoiceToView}
          isOpen={Boolean(invoiceToView)}
          onClose={() => setInvoiceToView(null)}
          onUpdateInvoice={(updated) => setInvoiceToView(updated)}
        />
      )}
    </div>
  );
}
