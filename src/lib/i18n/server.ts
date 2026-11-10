import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  Locale,
  isLocale,
} from "./config";
import { getDictionary, type Dictionary } from "./index";

export async function getServerLocale(): Promise<Locale> {
  try {
    const reqHeaders = await headers();
    const headerVal = reqHeaders.get(LOCALE_HEADER_NAME);
    if (isLocale(headerVal)) {
      return headerVal;
    }

    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
    if (isLocale(cookieVal)) {
      return cookieVal;
    }
  } catch {
    // Fallback cleanly when invoked outside an active HTTP request lifecycle
  }

  return DEFAULT_LOCALE;
}

export async function getServerDictionary(): Promise<{
  locale: Locale;
  dict: Dictionary;
}> {
  const locale = await getServerLocale();
  return {
    locale,
    dict: getDictionary(locale),
  };
}
