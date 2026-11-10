import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await clearAdminSession();

  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/html")) {
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }

  return NextResponse.json({ success: true });
}
