// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "ID không in valid" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[/api/products/[id]] error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}