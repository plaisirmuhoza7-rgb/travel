import {
  Locale,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  isLocale,
} from "./config";
import type { Dictionary } from "./types";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";

export type { Dictionary } from "./types";
export * from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  fr,
};

export function getDictionary(locale?: Locale | string | null): Dictionary {
  if (isLocale(locale)) {
    return DICTIONARIES[locale];
  }
  return DICTIONARIES[DEFAULT_LOCALE];
}

export function resolveApiLocale(
  req: {
    headers: { get(name: string): string | null };
    cookies?: { get(name: string): { value: string } | undefined };
    nextUrl?: { searchParams?: { get(name: string): string | null } };
  },
  explicitLocale?: unknown
): Locale {
  if (isLocale(explicitLocale)) return explicitLocale;
  const queryLang = req.nextUrl?.searchParams?.get("lang");
  if (isLocale(queryLang)) return queryLang;
  const headerVal = req.headers.get(LOCALE_HEADER_NAME);
  if (isLocale(headerVal)) return headerVal;
  const cookieVal = req.cookies?.get(LOCALE_COOKIE_NAME)?.value;
  if (isLocale(cookieVal)) return cookieVal;
  return DEFAULT_LOCALE;
}

export function getServiceLabelBySlug(slug: string, dict: Dictionary): string {
  switch (slug) {
    case "car-rental":
      return dict.admin.bookingsDashboard.filters.serviceOptions.carRental;
    case "airport-transfer":
      return dict.admin.bookingsDashboard.filters.serviceOptions.airportTransfer;
    case "wedding-event":
      return dict.admin.bookingsDashboard.filters.serviceOptions.weddingEvent;
    case "group-transport":
      return dict.admin.bookingsDashboard.filters.serviceOptions.groupTransport;
    case "corporate-transport":
      return dict.admin.bookingsDashboard.filters.serviceOptions.corporateTransport;
    default: {
      const contactTopic = dict.contact.form.serviceOptions.find(
        (opt) => opt.value === slug
      );
      if (contactTopic) return contactTopic.label;
      return slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
}
