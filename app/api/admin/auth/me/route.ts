export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      return NextResponse.json({ user: null }, {
        headers: {
          "Cache-Control": "no-store",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      });
    }

    const user = await prisma.account.findUnique({
      where: { id: Number(session) },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({ user: user || null }, {
      headers: {
        "Cache-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[/api/admin/auth/me] error:", e);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
