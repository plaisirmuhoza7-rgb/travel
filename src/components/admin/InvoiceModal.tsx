"use client";

import React, { useState } from "react";
import { InvoiceRecord, InvoiceLineItem } from "@/lib/seed-data";
import { OfficialInvoiceDocument } from "./OfficialInvoiceDocument";
import {
  Printer,
  Download,
  Share2,
  CheckCircle,
  X,
  Edit3,
  Plus,
  Trash2,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";

interface Props {
  invoice: InvoiceRecord;
  isOpen: boolean;
  onClose: () => void;
  onUpdateInvoice?: (updated: InvoiceRecord) => void;
}

export function InvoiceModal({
  invoice: initialInvoice,
  isOpen,
  onClose,
  onUpdateInvoice,
}: Props) {
  const [invoice, setInvoice] = useState<InvoiceRecord>(initialInvoice);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Editable Form State
  const [editData, setEditData] = useState({
    status: invoice.status,
    clientName: invoice.clientName,
    clientCompany: invoice.clientCompany || "",
    clientPhone: invoice.clientPhone,
    clientEmail: invoice.clientEmail || "",
    clientAddress: invoice.clientAddress || "",
    clientTin: invoice.clientTin || "",
    pickupLocation: invoice.pickupLocation || "",
    dropoffLocation: invoice.dropoffLocation || "",
    pickupDate: invoice.pickupDate || "",
    pickupTime: invoice.pickupTime || "",
    vehicleName: invoice.vehicleName || "",
    driverName: invoice.driverName || "",
    driverPhone: invoice.driverPhone || "",
    taxRatePercent: invoice.taxRatePercent || 0,
    discountRwf: invoice.discountRwf || 0,
    notes: invoice.notes || "",
    termsAndConditions: invoice.termsAndConditions || "",
    items: [...invoice.items],
  });

  if (!isOpen) return null;

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Dispatch Message
  const handleShareWhatsApp = () => {
    const cleanPhone = invoice.clientPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${invoice.clientName},\n\n` +
      `Here is your official Travel Rwanda Tax Invoice [${invoice.invoiceNumber}] for ${invoice.serviceType?.replace(/-/g, " ") || "Transport Services"}.\n\n` +
      `Total Amount: ${invoice.totalRwf.toLocaleString()} RWF\n` +
      `Status: ${invoice.status.toUpperCase()}\n` +
      `Pickup: ${invoice.pickupLocation} on ${invoice.pickupDate} at ${invoice.pickupTime || "scheduled time"}\n\n` +
      `Payment Remittance:\n` +
      `- MTN MoMo Pay: *182*8*1*841295# (Travel Rwanda Ltd)\n` +
      `- Bank of Kigali: 00040-0698421-33\n\n` +
      `Thank you for choosing Travel Rwanda Transport Services!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  // Quick Status Toggle (e.g. Mark Paid)
  const handleToggleStatus = async (newStatus: InvoiceRecord["status"]) => {
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.invoice) {
        setInvoice(data.invoice);
        setEditData((prev) => ({ ...prev, status: newStatus }));
        if (onUpdateInvoice) onUpdateInvoice(data.invoice);
      }
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  // Save Edit Changes
  const handleSaveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update invoice");

      setInvoice(data.invoice);
      setIsEditMode(false);
      if (onUpdateInvoice) onUpdateInvoice(data.invoice);
    } catch (err: any) {
      alert("Error saving invoice: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Line item manipulation
  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      description: "Additional Transport / Waiting Fee",
      quantity: 1,
      unitPriceRwf: 20000,
      totalRwf: 20000,
    };
    setEditData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceLineItem, val: any) => {
    const updated = [...editData.items];
    updated[index] = { ...updated[index], [field]: val };
    if (field === "quantity" || field === "unitPriceRwf") {
      const q = field === "quantity" ? Number(val) : updated[index].quantity;
      const p = field === "unitPriceRwf" ? Number(val) : updated[index].unitPriceRwf;
      updated[index].totalRwf = (q || 0) * (p || 0);
    }
    setEditData((prev) => ({ ...prev, items: updated }));
  };

  const handleRemoveItem = (index: number) => {
    if (editData.items.length <= 1) {
      alert("An invoice must contain at least one line item.");
      return;
    }
    const updated = editData.items.filter((_, i) => i !== index);
    setEditData((prev) => ({ ...prev, items: updated }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06281E]/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#F7F6F2] shadow-2xl overflow-hidden my-6 border border-[#BCA77B]/40 flex flex-col max-h-[92vh]">
        {/* MODAL CONTROL HEADER (Hidden when printing) */}
        <div className="no-print shrink-0 bg-[#0F284E] text-[#F7F6F2] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BCA77B]/30">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[#FACC15] bg-[#061226] px-2.5 py-1 rounded border border-[#FACC15]/30">
              {invoice.invoiceNumber}
            </span>
            <span className="text-xs text-[#F7F6F2]/80">
              Client: <strong>{invoice.clientName}</strong>
            </span>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {invoice.status !== "Paid" ? (
              <button
                onClick={() => handleToggleStatus("Paid")}
                className="inline-flex items-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Mark as Paid</span>
              </button>
            ) : (
              <button
                onClick={() => handleToggleStatus("Issued")}
                className="inline-flex items-center gap-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
              >
                <span>Mark as Issued (Unpaid)</span>
              </button>
            )}

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="inline-flex items-center gap-1.5 rounded bg-white/10 hover:bg-white/20 text-[#F7F6F2] px-3 py-1.5 text-xs font-semibold transition-all border border-white/20"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#BCA77B]" />
              <span>{isEditMode ? "Preview Mode" : "Edit Invoice"}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-semibold transition-all"
              title="Share invoice summary on WhatsApp"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded bg-[#FACC15] hover:bg-[#EAB308] text-[#0F284E] px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#F7F6F2]/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#E2E8F0]/30">
          {/* EDIT FORM (If in edit mode) */}
          {isEditMode ? (
            <form onSubmit={handleSaveEdits} className="max-w-4xl mx-auto bg-white p-6 rounded-xl border border-[#CBD5E1] shadow-sm space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h3 className="font-display text-lg font-bold text-[#0F284E]">
                  Edit Invoice Specifications & Pricing
                </h3>
                <span className="font-mono text-xs text-[#0B3D2E] font-bold">
                  {invoice.invoiceNumber}
                </span>
              </div>

              {/* Status & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Invoice Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Issued">Issued (Awaiting Payment)</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={editData.pickupDate || ""}
                    onChange={(e) => setEditData({ ...editData, pickupDate: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Client TIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 100 488 231"
                    value={editData.clientTin}
                    onChange={(e) => setEditData({ ...editData, clientTin: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2 font-mono"
                  />
                </div>
              </div>

              {/* Client Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editData.clientName}
                    onChange={(e) => setEditData({ ...editData, clientName: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Client Phone *</label>
                  <input
                    type="text"
                    required
                    value={editData.clientPhone}
                    onChange={(e) => setEditData({ ...editData, clientPhone: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Company / Org Name</label>
                  <input
                    type="text"
                    placeholder="e.g. African Development Bank"
                    value={editData.clientCompany}
                    onChange={(e) => setEditData({ ...editData, clientCompany: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>
              </div>

              {/* Vehicle & Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Allocated Vehicle</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota Land Cruiser Prado TXL"
                    value={editData.vehicleName}
                    onChange={(e) => setEditData({ ...editData, vehicleName: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Driver Name & Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. Innocent Gasana (+250 788...)"
                    value={editData.driverName}
                    onChange={(e) => setEditData({ ...editData, driverName: e.target.value })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171D19] block mb-1">Tax Rate (VAT %)</label>
                  <select
                    value={editData.taxRatePercent}
                    onChange={(e) => setEditData({ ...editData, taxRatePercent: Number(e.target.value) })}
                    className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2"
                  >
                    <option value={0}>0% (Tax Exempt / Inclusive)</option>
                    <option value={18}>18% (Standard Rwanda VAT)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F284E] uppercase tracking-wider text-[11px]">
                    Itemized Charges & Services
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 rounded bg-[#0B3D2E] text-white px-2.5 py-1 text-[11px] font-semibold hover:bg-[#06281E]"
                  >
                    <Plus className="h-3 w-3" />
                    <span>+ Add Line Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editData.items.map((it, idx) => (
                    <div key={it.id || idx} className="flex items-center gap-2 bg-[#F7F6F2] p-2.5 rounded-lg border border-[#E2E8F0]">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          placeholder="Description of transport service..."
                          value={it.description}
                          onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                          className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs"
                        />
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={it.quantity}
                          onChange={(e) => handleUpdateItem(idx, "quantity", Number(e.target.value))}
                          className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-center font-mono"
                        />
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Rate (RWF)"
                          value={it.unitPriceRwf}
                          onChange={(e) => handleUpdateItem(idx, "unitPriceRwf", Number(e.target.value))}
                          className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-right font-mono"
                        />
                      </div>

                      <div className="w-28 text-right font-mono font-bold text-[#0F284E] px-1">
                        {it.totalRwf.toLocaleString()} RWF
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="rounded p-1 text-red-500 hover:bg-red-50"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-[#171D19] block mb-1">Invoice Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  className="w-full rounded border border-[#CBD5E1] bg-[#F7F6F2] p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="rounded px-4 py-2 font-semibold text-[#171D19]/70 hover:bg-[#F7F6F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded bg-[#0B3D2E] text-white px-5 py-2 font-bold uppercase tracking-wider hover:bg-[#06281E] disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Invoice"}
                </button>
              </div>
            </form>
          ) : (
            /* OFFICIAL INVOICE DOCUMENT DISPLAY */
            <OfficialInvoiceDocument invoice={invoice} />
          )}
        </div>
      </div>
    </div>
  );
}
