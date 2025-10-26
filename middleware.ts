// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Chỉ áp dụng cho các trang /admin/*
  if (pathname.startsWith("/admin")) {
    const session = req.cookies.get("admin_session")?.value;

    if (!session && pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (session && pathname === "/admin/login") {
      const dashboardUrl = new URL("/admin/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};