import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { InvoiceRecord, COMPANY_INVOICE_DETAILS } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const invoices = repository.getInvoices({ status, search });
  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // If request asks to auto-generate for an enquiry
    if (body.enquiryId && body.action === "generate") {
      const generated = repository.generateInvoiceForEnquiry(body.enquiryId, session.email);
      if (!generated) {
        return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, invoice: generated });
    }

    if (!body.clientName || !body.clientPhone) {
      return NextResponse.json(
        { error: "Client Name and Phone are required." },
        { status: 400 }
      );
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const dateStamp = todayStr.replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = body.invoiceNumber || `INV-${dateStamp}-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const items = Array.isArray(body.items) && body.items.length > 0
      ? body.items
      : [
          {
            id: `item-${Date.now()}-1`,
            description: body.serviceDescription || "Ground Transport & Chauffeur Service",
            quantity: Number(body.quantity) || 1,
            unitPriceRwf: Number(body.unitPriceRwf) || Number(body.totalRwf) || 50000,
            totalRwf: (Number(body.quantity) || 1) * (Number(body.unitPriceRwf) || Number(body.totalRwf) || 50000),
          },
        ];

    const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.totalRwf) || 0), 0);
    const taxRate = Number(body.taxRatePercent) || 0;
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const discount = Number(body.discountRwf) || 0;
    const total = subtotal + taxAmount - discount;

    const newInvoice: InvoiceRecord = {
      id: body.id || `inv-${Date.now()}-${randomSuffix.toLowerCase()}`,
      invoiceNumber,
      enquiryId: body.enquiryId || null,
      referenceCode: body.referenceCode || null,
      issueDate: body.issueDate || todayStr,
      dueDate: body.dueDate || todayStr,
      status: body.status || "Issued",
      clientName: body.clientName,
      clientCompany: body.clientCompany || null,
      clientPhone: body.clientPhone,
      clientEmail: body.clientEmail || null,
      clientAddress: body.clientAddress || null,
      clientTin: body.clientTin || null,
      serviceType: body.serviceType || "car-rental",
      pickupLocation: body.pickupLocation || null,
      dropoffLocation: body.dropoffLocation || null,
      pickupDate: body.pickupDate || null,
      pickupTime: body.pickupTime || null,
      returnDate: body.returnDate || null,
      returnTime: body.returnTime || null,
      vehicleName: body.vehicleName || null,
      driverName: body.driverName || null,
      driverPhone: body.driverPhone || null,
      passengerCount: Number(body.passengerCount) || 1,
      flightNumber: body.flightNumber || null,
      items,
      subtotalRwf: subtotal,
      taxRatePercent: taxRate,
      taxAmountRwf: taxAmount,
      discountRwf: discount,
      totalRwf: total,
      currency: body.currency || "RWF",
      bankName: body.bankName || COMPANY_INVOICE_DETAILS.bankName,
      bankAccountNumber: body.bankAccountNumber || COMPANY_INVOICE_DETAILS.bankAccountNumber,
      bankAccountName: body.bankAccountName || COMPANY_INVOICE_DETAILS.bankAccountName,
      momoMerchantCode: body.momoMerchantCode || COMPANY_INVOICE_DETAILS.momoMerchantCode,
      paymentMethod: body.paymentMethod || "MTN Mobile Money / Bank Transfer",
      paymentReference: body.paymentReference || invoiceNumber,
      notes: body.notes || "Official Transport Reservation Voucher & Tax Invoice. Thank you for choosing Travel Rwanda.",
      termsAndConditions: body.termsAndConditions || COMPANY_INVOICE_DETAILS.defaultTerms,
      issuedByEmail: session.email,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = repository.saveInvoice(newInvoice);
    return NextResponse.json({ success: true, invoice: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create invoice" }, { status: 500 });
  }
}
