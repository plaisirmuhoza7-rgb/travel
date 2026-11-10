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
  const { vehicleId, vehicleName, driverName, driverPhone, note } = body;

  if (!vehicleName) {
    return NextResponse.json(
      { error: dict.admin.apiErrors.vehicleNameRequired },
      { status: 400 }
    );
  }

  const updated = repository.assignVehicleToEnquiry(
    id,
    vehicleId || "custom-veh",
    vehicleName,
    session.email,
    driverName,
    driverPhone,
    note || `${dict.admin.apiErrors.assignedVehiclePrefix}${vehicleName}`
  );

  if (!updated) {
    return NextResponse.json(
      { error: dict.admin.apiErrors.enquiryNotFound },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, enquiry: updated });
}
