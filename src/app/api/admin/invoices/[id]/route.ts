import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { repository } from "@/lib/repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const invoice = repository.getInvoiceById(id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ invoice });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // If updating items, recalculate totals
  let updates = { ...body };
  if (Array.isArray(body.items)) {
    const subtotal = body.items.reduce(
      (sum: number, it: any) => sum + (Number(it.totalRwf) || 0),
      0
    );
    const taxRate = Number(body.taxRatePercent !== undefined ? body.taxRatePercent : 0);
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const discount = Number(body.discountRwf || 0);
    const total = subtotal + taxAmount - discount;

    updates = {
      ...updates,
      subtotalRwf: subtotal,
      taxAmountRwf: taxAmount,
      totalRwf: total,
    };
  }

  const updated = repository.updateInvoice(id, updates);
  if (!updated) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, invoice: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const success = repository.deleteInvoice(id);
  if (!success) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
