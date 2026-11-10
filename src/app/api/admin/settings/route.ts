import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  let locale = resolveApiLocale(req);
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: getDictionary(locale).admin.apiErrors.unauthorized },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { locale: bodyLocale, ...updates } = body || {};
  locale = resolveApiLocale(req, bodyLocale);
  const updated = repository.updateSettings(updates);

  return NextResponse.json({ success: true, settings: updated });
}
