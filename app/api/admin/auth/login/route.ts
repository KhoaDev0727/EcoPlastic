// app/api/admin/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Thiếu email hoặc mật khẩu" }, { status: 400 });
  }

  const account = await prisma.account.findUnique({ where: { email } });
  if (!account) {
    return NextResponse.json({ message: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, account.password);
  if (!valid) {
    return NextResponse.json({ message: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  // Tạo session cookie
  const cookieStore = cookies();
  cookieStore.set("admin_session", account.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 ngày
    path: "/",
  });

  return NextResponse.json({ message: "Đăng nhập thành công" });
}