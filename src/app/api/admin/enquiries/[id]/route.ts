import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let locale = resolveApiLocale(req);
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: getDictionary(locale).admin.apiErrors.unauthorized },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const { locale: bodyLocale, auditNote, ...updates } = body || {};
  locale = resolveApiLocale(req, bodyLocale);
  const dict = getDictionary(locale);

  const updated = repository.updateEnquiry(
    id,
    updates,
    session.email,
    auditNote || dict.admin.apiErrors.bookingUpdatedNote
  );

  if (!updated) {
    return NextResponse.json({ error: dict.admin.apiErrors.bookingNotFound }, { status: 404 });
  }

  return NextResponse.json({ success: true, enquiry: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dict = getDictionary(resolveApiLocale(req));
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: dict.admin.apiErrors.unauthorized }, { status: 401 });
  }

  const { id } = await params;
  const success = repository.deleteEnquiry(id);

  if (!success) {
    return NextResponse.json({ error: dict.admin.apiErrors.bookingNotFound }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
