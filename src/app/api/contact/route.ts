import { NextRequest, NextResponse } from "next/server";
import { createContactFormSchema } from "@/lib/validations/contact";
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
          { error: getDictionary(locale).api.tooManyRequestsContact },
          { status: 429 }
        );
      }
      rateData.count += 1;
    } else {
      ipRateLimits.set(ip, { count: 1, expiresAt: now + 10 * 60 * 1000 });
    }

    const body = await req.json();
    locale = resolveApiLocale(req, body?.locale);

    // 2. Honeypot Bot Trap
    if (body.website_hp && body.website_hp.trim().length > 0) {
      return NextResponse.json({
        success: true,
        referenceCode: "TRW-SPAM-PROTECTED",
      });
    }

    // 3. Schema Validation
    const schema = createContactFormSchema(locale);
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: issues }, { status: 400 });
    }

    const data = parseResult.data;
    const nowIso = new Date().toISOString();
    const dateStamp = nowIso.slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const referenceCode = `TRW-MSG-${dateStamp}-${randomSuffix}`;
    const idempotencyKey = data.idempotencyKey || `idem-contact-${Date.now()}-${randomSuffix}`;

    // 4. Server-side Idempotency check
    const existing = repository.getEnquiryByIdempotencyKey(idempotencyKey);
    if (existing) {
      return NextResponse.json({
        success: true,
        referenceCode: existing.referenceCode,
        isDuplicate: true,
      });
    }

    // 5. Store as unified inquiry in repository so admin can view/manage
    const newEnquiry = repository.createEnquiry({
      id: `msg-${Date.now()}-${randomSuffix.toLowerCase()}`,
      referenceCode,
      idempotencyKey,
      serviceType: data.service,
      status: "New",
      pickupLocation: "Kicukiro, Gahanga Center / Direct Webform",
      dropoffLocation: "Rwanda",
      pickupDate: nowIso.slice(0, 10),
      pickupTime: nowIso.slice(11, 16),
      passengerCount: 1,
      serviceSpecificData: {
        source: "contact_page_webform",
        topic: data.service,
        message: data.message,
      },
      customerName: data.fullName,
      customerEmail: data.email,
      customerPhone: data.phone,
      preferredContactMethod: data.preferredContact,
      bookingForSomeoneElse: false,
      customerNotes: `[Webform Message - ${data.service}]\n${data.message}`,
      privacyAccepted: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    // 6. Asynchronous email notifications (non-blocking)
    try {
      await sendEnquiryNotifications(newEnquiry, locale);
    } catch (e) {
      console.error("Non-fatal email error in contact API:", e);
    }

    return NextResponse.json(
      {
        success: true,
        referenceCode: newEnquiry.referenceCode,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Contact API route error:", err);
    return NextResponse.json(
      { error: getDictionary(locale).api.serverErrorContact },
      { status: 500 }
    );
  }
}
