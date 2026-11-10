import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  let locale = resolveApiLocale(req);
  try {
    const body = await req.json();
    locale = resolveApiLocale(req, body?.locale);
    const { email, password } = body;

    const configuredEmail = process.env.ADMIN_SETUP_EMAIL || "admin@travelrwanda.rw";
    const configuredPassword = process.env.ADMIN_SETUP_PASSWORD || "Rwanda2026!Admin";

    if (email === configuredEmail && password === configuredPassword) {
      await setAdminSession(email);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: getDictionary(locale).admin.apiErrors.invalidCredentials },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: getDictionary(locale).admin.apiErrors.authError },
      { status: 500 }
    );
  }
}
