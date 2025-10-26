// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET: Lấy tất cả đơn hàng (dùng cho admin)
export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
  return NextResponse.json(orders);
}

// POST: Tạo đơn hàng từ khách
export async function POST(req: Request) {
  const body = await req.json();

  if (
    !body?.customerName ||
    !body?.email ||
    !Array.isArray(body?.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json({ message: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }

  const total = body.items.reduce(
    (sum: number, it: any) => sum + it.unitPrice * (it.quantity ?? 1),
    0
  );

  const order = await prisma.order.create({
    data: {
      customerName: body.customerName,
      email: body.email,
      phone: body.phone ?? null,
      address: body.address ?? null,
      note: body.note ?? null,
      totalPrice: total,
      items: {
        create: body.items.map((it: any) => ({
          productId: it.productId,
          productName: it.productName, 
          quantity: it.quantity ?? 1,
          unitPrice: it.unitPrice,
          colorHex: it.colorHex ?? "#d97706",
          stickers: it.stickers ?? [],
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(order, { status: 201 });
}