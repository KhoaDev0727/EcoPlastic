"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Product3DViewer } from "@/components/3d-viewer"
import { CustomizationPanel } from "@/components/customization-panel"
import { DragDropProvider } from "@/components/drag-drop-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Heart, Save } from "lucide-react"
import Link from "next/link"

const productTypes = [
  { id: "keychain", name: "Móc khóa", price: "89,000₫" },
  { id: "comb", name: "Cây lược", price: "156,000₫" },
  { id: "decoration", name: "Đồ trang trí", price: "234,000₫" },
]

export default function CustomizePage() {
  const [selectedProduct, setSelectedProduct] = useState<"keychain" | "comb" | "decoration">("keychain")
  const [selectedColor, setSelectedColor] = useState("#d97706")
  const [customization, setCustomization] = useState({})

  const currentProduct = productTypes.find((p) => p.id === selectedProduct)

  return (
    <DragDropProvider>
      <div className="min-h-screen">
        <Header />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link href="/">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại trang chủ
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 3D Viewer */}
              <div className="lg:col-span-8">
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground">Xem trước 3D</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border bg-transparent">
                          <Save className="h-4 w-4 mr-1" />
                          Lưu thiết kế
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Product3DViewer productType={selectedProduct} color={selectedColor} className="h-[600px]" />
                  </CardContent>
                </Card>

                {/* Product Selection */}
                <Card className="bg-card/50 backdrop-blur-sm border-border mt-6">
                  <CardHeader>
                    <CardTitle className="text-foreground">Chọn sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productTypes.map((product) => (
                        <div
                          key={product.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedProduct === product.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedProduct(product.id as any)}
                        >
                          <div className="text-center">
                            <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                            <p className="text-primary font-bold">{product.price}</p>
                            {selectedProduct === product.id && (
                              <Badge className="bg-primary text-primary-foreground mt-2">Đã chọn</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customization Panel */}
              <div className="lg:col-span-4">
                <CustomizationPanel
                  selectedProduct={selectedProduct}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  onCustomizationChange={setCustomization}
                />

                {/* Order Summary */}
                <Card className="bg-card/50 backdrop-blur-sm border-border mt-6">
                  <CardHeader>
                    <CardTitle className="text-foreground">Tóm tắt đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sản phẩm:</span>
                      <span className="text-foreground">{currentProduct?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Màu sắc:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="text-foreground">Tùy chỉnh</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí tùy chỉnh:</span>
                      <span className="text-foreground">+15,000₫</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Tổng cộng:</span>
                      <span className="text-primary">
                        {Number.parseInt(currentProduct?.price.replace(/[^\d]/g, "") || "0") + 15000}₫
                      </span>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-card bg-transparent"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Lưu vào yêu thích
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DragDropProvider>
  )
}
