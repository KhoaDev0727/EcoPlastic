export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ message: "Đăng xuất thành công" }, {
      headers: {
        "Cache-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[/api/admin/auth/logout] error:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
