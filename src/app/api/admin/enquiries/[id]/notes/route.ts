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
  const reqBody = await req.json();
  locale = resolveApiLocale(req, reqBody?.locale);
  const dict = getDictionary(locale);
  const { body } = reqBody;

  if (!body || !body.trim()) {
    return NextResponse.json(
      { error: dict.admin.apiErrors.noteEmpty },
      { status: 400 }
    );
  }

  const note = repository.addNoteToEnquiry(id, session.email, body.trim());

  return NextResponse.json({ success: true, note });
}
