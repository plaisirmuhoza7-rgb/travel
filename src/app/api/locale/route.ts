import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  Locale,
  isLocale,
} from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

function isHttpsRequest(req: NextRequest): boolean {
  const forwardedProto = req.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  if (forwardedProto === "https") return true;
  if (forwardedProto === "http") return false;
  return req.nextUrl.protocol === "https:";
}

function sanitizeRedirectPath(raw: string | null, lang: Locale): string {
  let pathname = "/";
  let search = "";

  if (raw) {
    const trimmed = raw.trim();
    if (
      trimmed.startsWith("/") &&
      !trimmed.startsWith("//") &&
      !trimmed.includes("\\") &&
      !/[\r\n]/.test(trimmed)
    ) {
      try {
        const parsed = new URL(trimmed, "http://trw.local");
        if (parsed.origin === "http://trw.local") {
          pathname = parsed.pathname || "/";
          const params = new URLSearchParams(parsed.search);
          params.set("lang", lang);
          const qs = params.toString();
          search = qs ? `?${qs}` : "";
          return `${pathname}${search}`;
        }
      } catch {
        // Fallback cleanly to root with explicit lang param
      }
    }
  }

  return `/?lang=${lang}`;
}

function applyLocaleCookieAndCacheHeaders(
  res: NextResponse,
  locale: Locale,
  isHttps: boolean
) {
  res.cookies.set({
    name: LOCALE_COOKIE_NAME,
    value: locale,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
    secure: isHttps,
  });
  res.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, max-age=0, must-revalidate"
  );
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie");
}

export async function GET(req: NextRequest) {
  const rawLang =
    req.nextUrl.searchParams.get("lang") ??
    req.nextUrl.searchParams.get("locale");
  const resolvedLocale: Locale = isLocale(rawLang)
    ? rawLang
    : DEFAULT_LOCALE;
  const redirectTarget = sanitizeRedirectPath(
    req.nextUrl.searchParams.get("redirect"),
    resolvedLocale
  );

  // Use a relative Location header so reverse proxies/containers never leak internal hostnames
  const response = new NextResponse(null, {
    status: 307,
    headers: {
      Location: redirectTarget,
    },
  });

  applyLocaleCookieAndCacheHeaders(
    response,
    resolvedLocale,
    isHttpsRequest(req)
  );
  return response;
}

export async function POST(req: NextRequest) {
  let bodyLocale: unknown;
  try {
    const body = (await req.json()) as { locale?: unknown; lang?: unknown };
    bodyLocale = body?.locale ?? body?.lang;
  } catch {
    bodyLocale = undefined;
  }

  const candidate =
    bodyLocale ??
    req.nextUrl.searchParams.get("lang") ??
    req.nextUrl.searchParams.get("locale");

  if (!isLocale(candidate)) {
    return NextResponse.json(
      { error: "Unsupported locale. Expected 'en' or 'fr'." },
      {
        status: 400,
        headers: {
          "Cache-Control": "private, no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  const response = NextResponse.json({ success: true, locale: candidate });
  applyLocaleCookieAndCacheHeaders(response, candidate, isHttpsRequest(req));
  return response;
}
