import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { EnquiryRecord } from "@/lib/seed-data";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

export async function GET(req: NextRequest) {
  const dict = getDictionary(resolveApiLocale(req));
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: dict.admin.apiErrors.unauthorized }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const enquiries = repository.getEnquiries({ status, search });
  return NextResponse.json({ enquiries });
}

export async function POST(req: NextRequest) {
  let locale = resolveApiLocale(req);
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: getDictionary(locale).admin.apiErrors.unauthorized },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    locale = resolveApiLocale(req, body?.locale);
    const dict = getDictionary(locale);

    if (!body.customerName || !body.customerPhone || !body.pickupLocation || !body.pickupDate) {
      return NextResponse.json(
        { error: dict.admin.apiErrors.missingRequiredBookingFields },
        { status: 400 }
      );
    }

    const dateStamp = (body.pickupDate || new Date().toISOString().slice(0, 10)).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const referenceCode = `TRW-${dateStamp}-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const newRecord: EnquiryRecord = {
      id: `enq-${Date.now()}-${randomSuffix.toLowerCase()}`,
      referenceCode,
      idempotencyKey: body.idempotencyKey || `admin-${Date.now()}-${randomSuffix}`,
      serviceType: body.serviceType || "car-rental",
      status: body.status || "Confirmed",
      pickupLocation: body.pickupLocation,
      dropoffLocation: body.dropoffLocation || "",
      pickupDate: body.pickupDate,
      pickupTime: body.pickupTime || "09:00",
      returnDate: body.returnDate || null,
      returnTime: body.returnTime || null,
      passengerCount: Number(body.passengerCount) || 1,
      serviceSpecificData: body.serviceSpecificData || {},
      customerName: body.customerName,
      customerEmail: body.customerEmail || "walkin@travelrwanda.rw",
      customerPhone: body.customerPhone,
      preferredContactMethod: body.preferredContactMethod || "whatsapp",
      bookingForSomeoneElse: Boolean(body.bookingForSomeoneElse),
      travellerName: body.travellerName || null,
      travellerPhone: body.travellerPhone || null,
      customerNotes: body.customerNotes || null,
      privacyAccepted: true,
      assignedVehicleId: body.assignedVehicleId || null,
      assignedVehicleName: body.assignedVehicleName || null,
      driverName: body.driverName || null,
      driverPhone: body.driverPhone || null,
      quotedPriceRwf: body.quotedPriceRwf ? Number(body.quotedPriceRwf) : null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = repository.createEnquiry(newRecord);

    // If a vehicle was assigned at creation time, add a status history note
    if (body.assignedVehicleName) {
      repository.assignVehicleToEnquiry(
        saved.id,
        body.assignedVehicleId || "custom",
        body.assignedVehicleName,
        session.email,
        body.driverName,
        body.driverPhone,
        `${dict.admin.apiErrors.bookingCreatedNotePrefix}${body.assignedVehicleName}`
      );
    }

    return NextResponse.json({ success: true, enquiry: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || getDictionary(locale).admin.apiErrors.failedCreateBooking },
      { status: 500 }
    );
  }
}
