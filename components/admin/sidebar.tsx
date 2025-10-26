// components/admin/sidebar.tsx
"use client";

import { LogOut, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SidebarProps {
  user: { email: string } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-green-700 text-white p-6 flex flex-col h-screen">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">EcoPlastic</h2>
        <p className="text-green-200 text-sm">Quản trị</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <a
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-600 transition"
            >
              <Package className="w-5 h-5" />
              Quản lý đơn hàng
            </a>
          </li>
        </ul>
      </nav>

      <div className="border-t border-green-600 pt-4">
        <div className="flex items-center gap-2 mb-3 px-4">
          <User className="w-5 h-5" />
          <span className="text-sm truncate">{user?.email}</span>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-green-600"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
}