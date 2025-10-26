// app/customize/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import DynamicModelViewer from "@/components/DynamicModelViewer";
import { CustomizationPanel } from "@/components/customization-panel";
import { DragDropProvider } from "@/components/drag-drop-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Save,
  Palette,
  CheckCircle2,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function CustomizePageRoot() {
  return (
    <DragDropProvider>
      <CustomizePage />
    </DragDropProvider>
  );
}

function CustomizePage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [selectedColor, setSelectedColor] = useState("#d97706");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    fetch(`/api/products/${productId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [productId]);

  const total = product?.price ?? 0;

  const placeOrder = async () => {
    if (!product || !productId) return;
    if (!customer.name || !customer.email) {
      alert("Vui lòng nhập Tên và Email");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone || null,
          address: customer.address || null,
          note: "Đặt từ trang customize",
          items: [
            {
              productId: parseInt(productId),
              productName: product.name, // GỬI TÊN SẢN PHẨM ĐI
              quantity: 1,
              unitPrice: product.price,
              colorHex: selectedColor,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error("Create order failed");
      const data = await res.json();
      setOrderSuccess(data);
      setCustomer({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setPlacing(false);
    }
  };

  // TRẠNG THÁI THÀNH CÔNG
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Header />
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-20 h-20 mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-green-800 mb-2">
                  Đặt hàng thành công!
                </h1>
                <p className="text-lg text-green-600 mb-6">
                  Cảm ơn bạn đã tin tưởng <strong>Second Life Plastic</strong>
                </p>

                <div className="bg-green-50 rounded-xl p-6 mb-6 text-left">
                  <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                    <Package className="w-5 h-5" />
                    Mã đơn hàng: <span className="text-xl">#{orderSuccess.id}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    {orderSuccess.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-green-300"
                            style={{
                              backgroundColor: item.colorHex || "#d97706",
                            }}
                          />
                          <span className="font-medium text-black">
                            {item.productName || item.product?.name || `Sản phẩm #${item.productId}`}
                          </span>
                          <span className="text-green-600">× {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-green-700">
                          {(item.unitPrice * item.quantity).toLocaleString()}₫
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-green-800">Tổng cộng:</span>
                    <span className="text-green-600">
                      {orderSuccess.totalPrice.toLocaleString()}₫
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <User className="w-4 h-4" />
                    <span>{orderSuccess.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <Mail className="w-4 h-4" />
                    <span>{orderSuccess.email}</span>
                  </div>
                  {orderSuccess.phone && (
                    <div className="flex items-center gap-2 text-green-700">
                      <Phone className="w-4 h-4" />
                      <span>{orderSuccess.phone}</span>
                    </div>
                  )}
                  {orderSuccess.address && (
                    <div className="flex items-center gap-2 text-green-700">
                      <MapPin className="w-4 h-4" />
                      <span>{orderSuccess.address}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-green-600 mt-6">
                  Chúng tôi sẽ liên hệ với bạn trong vòng <strong>24h</strong> để xác nhận đơn hàng.
                </p>

                <div className="flex gap-3 justify-center mt-8">
                  <Button
                    onClick={() => setOrderSuccess(null)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Đặt hàng khác
                  </Button>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Trang chủ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-foreground">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-lg text-red-500">Không tìm thấy sản phẩm!</p>
        <Link href="/">
          <Button>Quay lại trang chủ</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">
                      Xem trước 3D - {product.name}
                    </CardTitle>
                    <Button size="sm" variant="outline" className="border-border bg-transparent">
                      <Save className="h-4 w-4 mr-1" />
                      Lưu thiết kế
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-square w-full max-w-2xl mx-auto">
                    <DynamicModelViewer fbxPath={product.fbxPath} color={selectedColor} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Tùy chỉnh màu sắc
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomizationPanel
                    selectedProduct={product.slug}
                    selectedColor={selectedColor}
                    onColorChange={setSelectedColor}
                    onCustomizationChange={() => {}}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sản phẩm:</span>
                      <span className="text-foreground font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá:</span>
                      <span className="text-foreground">{product.price.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Màu sắc:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border-2 border-border shadow-sm"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="text-foreground">Tùy chỉnh</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Tổng cộng:</span>
                    <span className="text-primary">{total.toLocaleString()}₫</span>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div>
                      <Label className="text-foreground mb-2 block">Tên *</Label>
                      <Input
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 block">Email *</Label>
                      <Input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="you@example.com"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 block">Điện thoại</Label>
                      <Input
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="0901234567"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 block">Địa chỉ</Label>
                      <Input
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="123 Đường ABC, Quận 1"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <Button
                    disabled={placing}
                    onClick={placeOrder}
                    className="w-full h-12 mt-6 bg-green-600 hover:bg-green-700 text-white font-medium text-base"
                  >
                    {placing ? "Đang đặt hàng..." : "Đặt hàng ngay"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}