// app/api/admin/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ message: "Đăng xuất thành công" });
}