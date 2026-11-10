import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  Locale,
  isLocale,
  stripLocalePrefix,
} from "@/lib/i18n/config";

function extractPathLocale(pathname: string): Locale | null {
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const queryLang = searchParams.get("lang");
  const pathLocale = extractPathLocale(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  let resolvedLocale: Locale = DEFAULT_LOCALE;
  if (isLocale(queryLang)) {
    resolvedLocale = queryLang;
  } else if (pathLocale) {
    resolvedLocale = pathLocale;
  } else if (isLocale(cookieLocale)) {
    resolvedLocale = cookieLocale;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER_NAME, resolvedLocale);

  let response: NextResponse;

  if (pathLocale) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = stripLocalePrefix(pathname);
    response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isLocale(queryLang) || pathLocale) {
    response.cookies.set({
      name: LOCALE_COOKIE_NAME,
      value: resolvedLocale,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
