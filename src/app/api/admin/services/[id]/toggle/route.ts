import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";
import { getDictionary, resolveApiLocale } from "@/lib/i18n";

export async function POST(
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
  locale = resolveApiLocale(req, body?.locale);
  const dict = getDictionary(locale);
  const { isEnabled } = body;

  const updated = repository.updateService(id, { isEnabled });
  if (!updated) {
    return NextResponse.json(
      { error: dict.admin.apiErrors.serviceNotFound },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, service: updated });
}
