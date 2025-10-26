// app/api/admin/auth/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session) return NextResponse.json({ user: null });

  const user = await prisma.account.findUnique({
    where: { id: parseInt(session) },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json({ user: user || null });
}