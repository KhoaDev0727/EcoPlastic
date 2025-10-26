// app/api/admin/auth/login/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Thiếu email hoặc mật khẩu" }, { status: 400 });
    }

    // email là unique trong schema -> ok
    const account = await prisma.account.findUnique({ where: { email } });
    if (!account) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, account.password);
    if (!valid) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    // Set cookie session
    const cookieStore = cookies();
    cookieStore.set("admin_session", String(account.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 ngày
    });

    return NextResponse.json({ message: "Đăng nhập thành công" }, {
      headers: {
        "Cache-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (err) {
    // Đảm bảo luôn trả JSON, tránh HTML error page
    console.error("[/api/admin/auth/login] error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
