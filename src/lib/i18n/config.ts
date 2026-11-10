export const SUPPORTED_LOCALES = ["en", "fr"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "trw_locale";
export const LOCALE_HEADER_NAME = "x-trw-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "fr";
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const lower = value.trim().toLowerCase();
  if (lower === "fr" || lower.startsWith("fr-") || lower.startsWith("fr_")) {
    return "fr";
  }
  return "en";
}

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");
  return stripped || "/";
}
