import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  let locale = resolveApiLocale(req);
  try {
    const body = await req.json().catch(() => ({}));
    locale = resolveApiLocale(req, body?.locale);

    const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";
    const configuredEmail =
      process.env.ADMIN_SETUP_EMAIL || "admin@travelrwanda.rw";
    const sessionEmail = rawEmail || configuredEmail;

    const forwardedProto = req.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim()
      .toLowerCase();
    const isHttps =
      forwardedProto === "https" ||
      (forwardedProto !== "http" && req.nextUrl.protocol === "https:");

    // Testing mode enabled: allow sign-in even with arbitrary/wrong credentials.
    // Re-enable strict email/password matching before production launch.
    await setAdminSession(sessionEmail, isHttps);

    return NextResponse.json({
      success: true,
      email: sessionEmail,
      testingBypass: true,
    });
  } catch {
    return NextResponse.json(
      { error: getDictionary(locale).admin.apiErrors.authError },
      { status: 500 }
    );
  }
}
