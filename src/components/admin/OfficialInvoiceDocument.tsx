"use client";

import React from "react";
import { InvoiceRecord, COMPANY_INVOICE_DETAILS } from "@/lib/seed-data";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Users,
  Plane,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

interface Props {
  invoice: InvoiceRecord;
  className?: string;
  showWatermark?: boolean;
}

export function OfficialInvoiceDocument({
  invoice,
  className = "",
  showWatermark = true,
}: Props) {
  const isPaid = invoice.status === "Paid";
  const isIssued = invoice.status === "Issued";
  const isOverdue = invoice.status === "Overdue";

  // Approximate USD conversion rate (1 USD ≈ 1,380 RWF)
  const usdTotal = Math.round(invoice.totalRwf / 1380);

  return (
    <div
      id={`invoice-doc-${invoice.id}`}
      className={`relative mx-auto w-full max-w-[850px] bg-white p-8 sm:p-12 text-[#171D19] shadow-sm print:shadow-none print:p-6 print:max-w-none print:w-full font-sans border border-[#E2E8F0] print:border-none ${className}`}
      style={{
        color: "#171D19",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Print Specific Styles Injection */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 10mm 12mm 10mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print,
          header,
          footer,
          aside,
          nav {
            display: none !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F284E] via-[#0B3D2E] to-[#BCA77B]" />

      {/* PAID Watermark (for paid invoices) */}
      {showWatermark && isPaid && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06] select-none overflow-hidden">
          <span className="text-[120px] font-black uppercase tracking-[0.3em] text-emerald-800 rotate-[-25deg] border-[12px] border-emerald-800 px-12 py-4 rounded-3xl">
            PAID
          </span>
        </div>
      )}

      {/* HEADER SECTION: Logo, Company Profile, and Tax Invoice Badge */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-[#0F284E]/15">
        {/* Company Identity */}
        <div className="flex items-start gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-[#0F284E]/15 shadow-xs overflow-hidden">
            <img
              src="/logo.png"
              alt="Travel Rwanda"
              width={56}
              height={56}
              className="object-contain max-h-full max-w-full"
            />
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#BCA77B] block">
              Republic of Rwanda &bull; Official Transport Voucher
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F284E] uppercase font-display leading-tight">
              {COMPANY_INVOICE_DETAILS.name}
            </h1>
            <p className="text-xs font-semibold text-[#0B3D2E]">
              {COMPANY_INVOICE_DETAILS.descriptor}
            </p>
            <div className="pt-1 text-[11px] text-[#171D19]/70 space-y-0.5 font-mono">
              <div>📍 {COMPANY_INVOICE_DETAILS.address}</div>
              <div className="flex flex-wrap gap-x-3">
                <span>📞 {COMPANY_INVOICE_DETAILS.phonePrimary}</span>
                <span>✉️ {COMPANY_INVOICE_DETAILS.email}</span>
                <span className="font-bold text-[#0F284E]">TIN: {COMPANY_INVOICE_DETAILS.tin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Header Badge & Meta */}
        <div className="sm:text-right shrink-0 space-y-1.5 w-full sm:w-auto">
          <div className="inline-block bg-[#0F284E] text-[#F7F6F2] px-3.5 py-1 rounded text-xs font-bold uppercase tracking-[0.2em]">
            Tax Invoice / Facture
          </div>

          <div className="font-mono text-base sm:text-lg font-black text-[#0B3D2E] tracking-tight block">
            {invoice.invoiceNumber}
          </div>

          {invoice.referenceCode && (
            <div className="text-[11px] font-mono text-[#171D19]/60">
              Booking Ref: <strong className="text-[#0F284E]">{invoice.referenceCode}</strong>
            </div>
          )}

          {/* Status Badge */}
          <div className="pt-1 flex sm:justify-end">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                isPaid
                  ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                  : isIssued
                  ? "bg-sky-50 text-sky-900 border-sky-300"
                  : isOverdue
                  ? "bg-rose-50 text-rose-900 border-rose-300"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPaid
                    ? "bg-emerald-600"
                    : isIssued
                    ? "bg-sky-600"
                    : isOverdue
                    ? "bg-rose-600"
                    : "bg-gray-400"
                }`}
              />
              {invoice.status}
            </span>
          </div>
        </div>
      </div>

      {/* METADATA STRIP: Dates & Payment Term */}
      <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F6F2] p-3.5 rounded-lg border border-[#E2E8F0] text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#171D19]/50 block">Date Issued</span>
          <span className="font-mono font-bold text-[#0F284E]">{invoice.issueDate}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#171D19]/50 block">Due Date</span>
          <span className="font-mono font-bold text-[#0B3D2E]">{invoice.dueDate}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#171D19]/50 block">Payment Mode</span>
          <span className="font-medium text-[#171D19] truncate block">
            {invoice.paymentMethod || "MoMo / Wire Transfer"}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#171D19]/50 block">Currency</span>
          <span className="font-mono font-bold text-[#0F284E]">
            {invoice.currency} (Rwandan Franc)
          </span>
        </div>
      </div>

      {/* CLIENT & JOURNEY LOGISTICS DUAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 text-xs">
        {/* Left: Billed To Customer */}
        <div className="rounded-lg border border-[#E2E8F0] p-4 bg-white space-y-2">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#BCA77B]">
              Billed To (Client / Organization)
            </span>
            <Building2 className="h-3.5 w-3.5 text-[#BCA77B]" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-[#0F284E]">
              {invoice.clientName}
            </h3>

            {invoice.clientCompany && (
              <div className="font-semibold text-xs text-[#0B3D2E]">
                {invoice.clientCompany}
              </div>
            )}

            <div className="text-[11px] text-[#171D19]/70 space-y-0.5">
              <div>Phone: <strong className="text-[#171D19]">{invoice.clientPhone}</strong></div>
              {invoice.clientEmail && <div>Email: {invoice.clientEmail}</div>}
              {invoice.clientAddress && <div>Address: {invoice.clientAddress}</div>}
              {invoice.clientTin && (
                <div>Client TIN: <strong className="font-mono text-[#0F284E]">{invoice.clientTin}</strong></div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Transport & Journey Voucher Details */}
        <div className="rounded-lg border border-[#E2E8F0] p-4 bg-[#F7F6F2]/50 space-y-2">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B3D2E]">
              Journey Logistics & Fleet Voucher
            </span>
            <Car className="h-3.5 w-3.5 text-[#0B3D2E]" />
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[#171D19]/60">Service Category:</span>
              <span className="font-bold text-[#0F284E] capitalize">
                {(invoice.serviceType || "Car Rental").replace(/-/g, " ")}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-[#171D19]/60 shrink-0">Pickup:</span>
              <span className="font-medium text-right text-[#171D19]">
                {invoice.pickupLocation || "Kigali International Airport (KGL)"}
              </span>
            </div>

            {invoice.dropoffLocation && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#171D19]/60 shrink-0">Destination:</span>
                <span className="font-medium text-right text-[#171D19]">
                  {invoice.dropoffLocation}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[#171D19]/60">Schedule:</span>
              <span className="font-mono font-semibold text-[#0B3D2E]">
                {invoice.pickupDate} {invoice.pickupTime ? `at ${invoice.pickupTime}` : ""}
              </span>
            </div>

            {invoice.returnDate && (
              <div className="flex items-center justify-between">
                <span className="text-[#171D19]/60">Return Date:</span>
                <span className="font-mono text-[#171D19]">{invoice.returnDate}</span>
              </div>
            )}

            {invoice.vehicleName && (
              <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                <span className="text-[#171D19]/60">Allocated Vehicle:</span>
                <span className="font-bold text-[#0B3D2E]">{invoice.vehicleName}</span>
              </div>
            )}

            {invoice.driverName && (
              <div className="flex items-center justify-between">
                <span className="text-[#171D19]/60">Assigned Driver:</span>
                <span className="font-medium text-[#171D19]">
                  {invoice.driverName} {invoice.driverPhone ? `(${invoice.driverPhone})` : ""}
                </span>
              </div>
            )}

            {invoice.flightNumber && (
              <div className="flex items-center justify-between">
                <span className="text-[#171D19]/60">Flight Tracking:</span>
                <span className="font-mono font-bold text-sky-800">✈️ {invoice.flightNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ITEMIZED TABLE */}
      <div className="mb-6 rounded-lg border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0F284E] text-[#F7F6F2] font-mono uppercase text-[11px]">
            <tr>
              <th className="py-2.5 px-4 w-12 text-center">#</th>
              <th className="py-2.5 px-4">Description & Service Specification</th>
              <th className="py-2.5 px-4 text-center w-24">Qty / Days</th>
              <th className="py-2.5 px-4 text-right w-32">Rate (RWF)</th>
              <th className="py-2.5 px-4 text-right w-36">Total (RWF)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {invoice.items.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-[#F7F6F2]/50">
                <td className="py-3 px-4 font-mono text-center text-[#171D19]/50">
                  {idx + 1}
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-[#0F284E] block">{item.description}</span>
                  <span className="text-[10px] text-[#171D19]/60 block mt-0.5">
                    Includes licensed commercial driver, comprehensive passenger coverage & vehicle preparation.
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono font-semibold">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-right font-mono text-[#171D19]/80">
                  {item.unitPriceRwf.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-[#0F284E]">
                  {item.totalRwf.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS & SUMMARY SECTION */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6 print-break-inside-avoid">
        {/* Payment Remittance Information */}
        <div className="flex-1 space-y-3">
          <div className="rounded-lg border border-[#BCA77B]/40 bg-[#F7F6F2] p-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-[#BCA77B]" />
              Official Remittance & Payment Methods
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {/* Bank Transfer Details */}
              <div className="space-y-0.5">
                <strong className="text-[#0B3D2E] block">{COMPANY_INVOICE_DETAILS.bankName}</strong>
                <div>Account: <span className="font-mono font-bold">{COMPANY_INVOICE_DETAILS.bankAccountNumber}</span></div>
                <div>Name: <span>{COMPANY_INVOICE_DETAILS.bankAccountName}</span></div>
                <div>Swift Code: <span className="font-mono">{COMPANY_INVOICE_DETAILS.bankSwift}</span></div>
              </div>

              {/* MoMo Pay Code */}
              <div className="space-y-0.5">
                <strong className="text-[#0B3D2E] block">MTN Mobile Money (MoMo Pay)</strong>
                <div>Merchant Code: <span className="font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">{COMPANY_INVOICE_DETAILS.momoMerchantCode}</span></div>
                <div className="text-[10px] text-[#171D19]/70 pt-0.5">
                  Dial: <code className="font-mono">{COMPANY_INVOICE_DETAILS.momoDialCode}</code>
                </div>
              </div>
            </div>

            {invoice.paymentReference && (
              <div className="pt-1.5 border-t border-[#E2E8F0] text-[10px] text-[#171D19]/70">
                Payment Reference: <strong className="font-mono text-[#0F284E]">{invoice.paymentReference}</strong>
              </div>
            )}
          </div>

          {/* Operational Notes */}
          {invoice.notes && (
            <div className="text-[11px] text-[#171D19]/70 bg-white p-2.5 rounded border border-[#E2E8F0] italic">
              <strong>Staff Note:</strong> {invoice.notes}
            </div>
          )}
        </div>

        {/* Calculation Table */}
        <div className="w-full sm:w-72 shrink-0 space-y-2 text-xs">
          <div className="rounded-lg border border-[#E2E8F0] p-4 bg-[#F7F6F2]/30 space-y-2">
            <div className="flex justify-between text-[#171D19]/70">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-[#171D19]">
                {invoice.subtotalRwf.toLocaleString()} RWF
              </span>
            </div>

            {invoice.taxRatePercent > 0 ? (
              <div className="flex justify-between text-[#171D19]/70">
                <span>VAT ({invoice.taxRatePercent}%):</span>
                <span className="font-mono font-semibold text-[#171D19]">
                  {invoice.taxAmountRwf.toLocaleString()} RWF
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-[#171D19]/60 text-[11px]">
                <span>Rwanda VAT (18%):</span>
                <span className="font-medium text-emerald-700">Inclusive / Exempt</span>
              </div>
            )}

            {invoice.discountRwf > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Discount Applied:</span>
                <span className="font-mono font-semibold">
                  -{invoice.discountRwf.toLocaleString()} RWF
                </span>
              </div>
            )}

            <div className="border-t-2 border-[#0F284E] pt-2 flex justify-between items-baseline">
              <span className="font-bold text-sm uppercase text-[#0F284E]">Total Amount:</span>
              <div className="text-right">
                <span className="font-mono font-black text-lg text-[#0F284E] block">
                  {invoice.totalRwf.toLocaleString()} RWF
                </span>
                <span className="text-[11px] font-mono text-[#171D19]/60">
                  Approx. ${usdTotal.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OFFICIAL VALIDATION STAMP & AUTHORIZATION FOOTER */}
      <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-6 print-break-inside-avoid">
        {/* Terms & Legal disclaimer */}
        <div className="text-[10px] text-[#171D19]/60 max-w-md space-y-1">
          <div className="font-bold uppercase tracking-wider text-[#0F284E]">
            Terms & Commercial Conditions:
          </div>
          <p className="leading-relaxed">
            {invoice.termsAndConditions || COMPANY_INVOICE_DETAILS.defaultTerms}
          </p>
          <p className="text-[9px] text-[#171D19]/50">
            Registered ground passenger transport service in the Republic of Rwanda. All journeys are GPS monitored for safety and punctuality.
          </p>
        </div>

        {/* Official Rubber Stamp & Signature Block */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Circular Verification Seal Stamp */}
          <div className="relative flex flex-col items-center justify-center h-24 w-24 rounded-full border-2 border-dashed border-[#0B3D2E] text-[#0B3D2E] p-1 text-center select-none rotate-[-6deg] opacity-90">
            <span className="text-[7px] font-black uppercase tracking-wider block">★ TRAVEL RWANDA ★</span>
            <div className="h-0.5 w-12 bg-[#0B3D2E]/30 my-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#0F284E]">OFFICIAL</span>
            <span className="text-[7px] font-bold text-emerald-800 uppercase">VALID VOUCHER</span>
            <div className="h-0.5 w-12 bg-[#0B3D2E]/30 my-0.5" />
            <span className="text-[6.5px] font-mono text-[#171D19]/60">KIGALI &bull; RWANDA</span>
          </div>

          {/* Signature Line */}
          <div className="text-center w-36 space-y-1">
            <div className="h-10 flex items-end justify-center pb-1">
              <span className="font-serif italic text-sm text-[#0F284E] font-bold">
                J. Mugenzi
              </span>
            </div>
            <div className="border-t border-[#171D19]/40 pt-1 text-[9px] font-bold uppercase tracking-wider text-[#171D19]/60">
              Operations Director
            </div>
            <div className="text-[8px] text-[#171D19]/40 font-mono">
              Travel Rwanda Ltd
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
