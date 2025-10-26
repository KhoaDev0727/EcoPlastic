// app/admin/dashboard/page.tsx 
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
    },
  });
}

function nextStatus(current?: string) {
  if (current === "PENDING") return "CONFIRMED";
  if (current === "CONFIRMED") return "CANCELED";
  return "PENDING";
}

export default async function AdminDashboard() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const orders = await getOrders();

  const patchStatus = async (id: number) => {
    "use server";
    const o = await prisma.order.findUnique({ where: { id } });
    await prisma.order.update({
      where: { id },
      data: { status: nextStatus(o?.status) as any },
    });
    revalidatePath("/admin/dashboard");
  };

  const deleteOrder = async (id: number) => {
    "use server";
    try {
      await prisma.order.delete({ where: { id } });
    } catch (e: any) {
      if (e.code === "P2003") {
        await prisma.$transaction(async (tx) => {
          await tx.orderItem.deleteMany({ where: { orderId: id } });
          await tx.order.delete({ where: { id } });
        });
      } else throw e;
    }
    revalidatePath("/admin/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-green-800">Quản lý đơn hàng</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-green-100 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">#{order.id}</span>
                    <span className="ml-2 text-muted-foreground">
                      • {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <Badge
                    className={`px-3 py-1 ${
                      order.status === "PENDING"
                        ? "bg-yellow-500"
                        : order.status === "CONFIRMED"
                        ? "bg-green-600"
                        : "bg-red-500"
                    } text-white`}
                  >
                    {order.status === "PENDING"
                      ? "Chờ xác nhận"
                      : order.status === "CONFIRMED"
                      ? "Đã xác nhận"
                      : "Đã hủy"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Thông tin khách hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Khách:</span> {order.customerName}</div>
                  <div><span className="font-medium">Email:</span> {order.email}</div>
                  <div><span className="font-medium">SĐT:</span> {order.phone || "—"}</div>
                  <div><span className="font-medium">Địa chỉ:</span> {order.address || "—"}</div>
                </div>

                <Separator />

                {/* Sản phẩm */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span>{item.product.name}</span>
                        <span className="text-muted-foreground">× {item.quantity}</span>
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                      <span className="font-medium">
                        {(item.unitPrice * item.quantity).toLocaleString()}₫
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between items-center gap-3">
                  <div className="text-lg font-bold">
                    Tổng: <span className="text-green-600">{order.totalPrice.toLocaleString()}₫</span>
                  </div>

                  <div className="flex gap-2">
                    <form action={patchStatus.bind(null, order.id)}>
                      <Button variant="outline" size="sm" className="border-green-500 text-green-700">
                        Đổi trạng thái
                      </Button>
                    </form>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Đơn hàng <strong>#{order.id}</strong> sẽ bị xóa <strong>vĩnh viễn</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <form action={deleteOrder.bind(null, order.id)}>
                            <AlertDialogAction asChild>
                              <Button type="submit" variant="destructive">
                                Xóa
                              </Button>
                            </AlertDialogAction>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}