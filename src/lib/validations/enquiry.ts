import { z } from "zod";
import { DEFAULT_LOCALE, Locale, getDictionary } from "@/lib/i18n";

export const ServiceTypeEnum = z.enum([
  "car-rental",
  "airport-transfer",
  "wedding-event",
  "group-transport",
  "corporate-transport",
]);

export const PreferredContactEnum = z.enum(["whatsapp", "phone", "email"]);

export const AirportDirectionEnum = z.enum(["arrival", "departure"]);

export function createEnquirySchema(locale: Locale = DEFAULT_LOCALE) {
  const m = getDictionary(locale).api.enquiryValidation;

  return z.object({
    idempotencyKey: z
      .string({ error: m.invalidIdempotency })
      .uuid(m.invalidIdempotency),
    serviceType: z.enum(ServiceTypeEnum.options, { error: m.serviceType }),
    preferredVehicleSlug: z
      .string({ error: m.invalidText })
      .optional()
      .nullable(),

    // Journey Common
    pickupLocation: z
      .string({ error: m.pickupLocation })
      .min(2, m.pickupLocation),
    dropoffLocation: z
      .string({ error: m.invalidText })
      .optional()
      .default(""),
    pickupDate: z
      .string({ error: m.pickupDateFormat })
      .regex(/^\d{4}-\d{2}-\d{2}$/, m.pickupDateFormat),
    pickupTime: z
      .string({ error: m.pickupTimeFormat })
      .regex(/^\d{2}:\d{2}$/, m.pickupTimeFormat),
    returnDate: z
      .string({ error: m.returnDateFormat })
      .regex(/^\d{4}-\d{2}-\d{2}$/, m.returnDateFormat)
      .optional()
      .nullable(),
    returnTime: z
      .string({ error: m.returnTimeFormat })
      .regex(/^\d{2}:\d{2}$/, m.returnTimeFormat)
      .optional()
      .nullable(),
    passengerCount: z
      .number({ error: m.passengerMin })
      .int(m.passengerInteger)
      .positive(m.passengerMin)
      .max(100, m.passengerMax),

    // Conditional: Airport Transfer
    airportDirection: z
      .enum(AirportDirectionEnum.options, { error: m.airportDirection })
      .optional()
      .nullable(),
    flightNumber: z.string({ error: m.invalidText }).optional().nullable(),
    flightDateTime: z.string({ error: m.invalidText }).optional().nullable(),

    // Conditional: Wedding / Event
    eventDate: z.string({ error: m.invalidText }).optional().nullable(),
    venues: z.string({ error: m.invalidText }).optional().nullable(),
    approximateGuests: z
      .number({ error: m.guestCountInvalid })
      .int(m.guestCountInvalid)
      .positive(m.guestCountInvalid)
      .optional()
      .nullable(),
    requestedVehicleCategories: z
      .array(z.string({ error: m.invalidText }), { error: m.invalidList })
      .optional()
      .default([]),
    decorationRequested: z
      .boolean({ error: m.invalidBoolean })
      .optional()
      .default(false),

    // Conditional: Group / Corporate Transport
    routeItinerarySummary: z
      .string({ error: m.invalidText })
      .optional()
      .nullable(),
    luggageTransportNotes: z
      .string({ error: m.invalidText })
      .optional()
      .nullable(),

    // Contact
    customerName: z.string({ error: m.customerName }).min(2, m.customerName),
    customerEmail: z
      .string({ error: m.customerEmail })
      .email(m.customerEmail),
    customerPhone: z
      .string({ error: m.customerPhone })
      .min(7, m.customerPhone),
    preferredContactMethod: z
      .enum(PreferredContactEnum.options, { error: m.preferredContact })
      .default("whatsapp"),

    // Arranging for someone else
    bookingForSomeoneElse: z
      .boolean({ error: m.invalidBoolean })
      .optional()
      .default(false),
    travellerName: z.string({ error: m.invalidText }).optional().nullable(),
    travellerPhone: z.string({ error: m.invalidText }).optional().nullable(),

    // General notes & legal
    customerNotes: z.string({ error: m.invalidText }).optional().nullable(),
    privacyAccepted: z.literal(true, {
      error: m.privacyAccepted,
    }),

    // Spam protection honeypot (must remain empty)
    website_url: z.string({ error: m.invalidText }).optional(),
  });
}

export const EnquirySchema = createEnquirySchema(DEFAULT_LOCALE);

export type EnquiryInput = z.infer<typeof EnquirySchema>;
