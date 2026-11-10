import { NextRequest, NextResponse } from "next/server";
import { createEnquirySchema } from "@/lib/validations/enquiry";
import { repository } from "@/lib/repository";
import { sendEnquiryNotifications } from "@/lib/email";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

// In-memory rate limiting map
const ipRateLimits = new Map<string, { count: number; expiresAt: number }>();

export async function POST(req: NextRequest) {
  let locale = resolveApiLocale(req);
  try {
    // 1. IP Rate Limiting (10 requests per 10 minutes)
    const ip = req.headers.get("x-forwarded-for") || "local-ip";
    const now = Date.now();
    const rateData = ipRateLimits.get(ip);

    if (rateData && rateData.expiresAt > now) {
      if (rateData.count >= 10) {
        return NextResponse.json(
          { error: getDictionary(locale).api.tooManyRequestsEnquiry },
          { status: 429 }
        );
      }
      rateData.count += 1;
    } else {
      ipRateLimits.set(ip, { count: 1, expiresAt: now + 10 * 60 * 1000 });
    }

    const body = await req.json();
    locale = resolveApiLocale(req, body?.locale);

    // 2. Honeypot Check (Spam Bot Protection)
    if (body.website_url && body.website_url.trim().length > 0) {
      // Silently return fake success to trick spam bots without storing garbage
      return NextResponse.json({
        success: true,
        referenceCode: "TRW-SPAM-PROTECTED",
      });
    }

    // 3. Schema Validation
    const schema = createEnquirySchema(locale);
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: issues }, { status: 400 });
    }

    const data = parseResult.data;

    // 4. Server-Side Idempotency Check
    const existing = repository.getEnquiryByIdempotencyKey(data.idempotencyKey);
    if (existing) {
      return NextResponse.json({
        success: true,
        referenceCode: existing.referenceCode,
        isDuplicate: true,
      });
    }

    // 5. Generate Non-sequential Reference Code (e.g. TRW-20261105-8F3K)
    const dateStamp = data.pickupDate.replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const referenceCode = `TRW-${dateStamp}-${randomSuffix}`;

    const newEnquiry = repository.createEnquiry({
      id: `enq-${Date.now()}-${randomSuffix.toLowerCase()}`,
      referenceCode,
      idempotencyKey: data.idempotencyKey,
      serviceType: data.serviceType,
      status: "New",
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      returnDate: data.returnDate,
      returnTime: data.returnTime,
      passengerCount: data.passengerCount,
      serviceSpecificData: {
        preferredVehicleSlug: data.preferredVehicleSlug,
        airportDirection: data.airportDirection,
        flightNumber: data.flightNumber,
        eventDate: data.eventDate,
        venues: data.venues,
        approximateGuests: data.approximateGuests,
        routeItinerarySummary: data.routeItinerarySummary,
      },
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      preferredContactMethod: data.preferredContactMethod,
      bookingForSomeoneElse: data.bookingForSomeoneElse,
      travellerName: data.travellerName,
      travellerPhone: data.travellerPhone,
      customerNotes: data.customerNotes,
      privacyAccepted: Boolean(data.privacyAccepted),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 6. Trigger Asynchronous Notifications (Email failure will not prevent enquiry save)
    try {
      await sendEnquiryNotifications(newEnquiry, locale);
    } catch (e) {
      console.error("Non-fatal email notification error:", e);
    }

    return NextResponse.json(
      {
        success: true,
        referenceCode: newEnquiry.referenceCode,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json(
      { error: getDictionary(locale).api.serverErrorEnquiry },
      { status: 500 }
    );
  }
}
