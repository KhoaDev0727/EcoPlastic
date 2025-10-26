// app/admin/layout.tsx
import { Sidebar } from "@/components/admin/sidebar";
import { getAdminUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}