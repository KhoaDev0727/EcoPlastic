export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      await prisma.product.create({
        data: {
          name: "Eco Test Model",
          slug: "eco-test-model",
          price: 150000,
          fbxPath: "/test.fbx",
          isActive: true,
        },
      });
    }
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(products);
  } catch (err: any) {
    console.error("[/api/products] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
