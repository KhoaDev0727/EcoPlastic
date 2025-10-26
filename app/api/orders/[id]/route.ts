// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const runtime = "nodejs";

// PATCH: Đổi trạng thái
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id))
    return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order)
    return NextResponse.json({ message: "Không tìm thấy đơn" }, { status: 404 });

  const next: Record<OrderStatus, OrderStatus> = {
    PENDING: "CONFIRMED",
    CONFIRMED: "CANCELED",
    CANCELED: "PENDING",
  } as const;

  const updated = await prisma.order.update({
    where: { id },
    data: { status: next[order.status] },
  });

  return NextResponse.json(updated);
}

// DELETE: Xóa đơn hàng
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id))
    return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order)
    return NextResponse.json({ message: "Không tìm thấy đơn" }, { status: 404 });

  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  await prisma.order.delete({ where: { id } });

  return NextResponse.json({ message: "Đã xóa đơn hàng" });
}