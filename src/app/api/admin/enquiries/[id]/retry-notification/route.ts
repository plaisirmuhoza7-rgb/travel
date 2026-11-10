import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { sendEnquiryNotifications } from "@/lib/email";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let bodyLocale: unknown;
  try {
    const body = await req.json();
    bodyLocale = body?.locale;
  } catch {
    // Optional JSON body
  }
  const locale = resolveApiLocale(req, bodyLocale);
  const dict = getDictionary(locale);
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: dict.admin.apiErrors.unauthorized }, { status: 401 });
  }

  const { id } = await params;
  const enquiry = repository.getEnquiryById(id);

  if (!enquiry) {
    return NextResponse.json({ error: dict.admin.apiErrors.enquiryNotFound }, { status: 404 });
  }

  const result = await sendEnquiryNotifications(enquiry, locale);

  return NextResponse.json({ success: true, result });
}
