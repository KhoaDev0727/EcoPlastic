"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Palette, Sparkles, ImageIcon, Type, Layers, RotateCcw, Download, Share2 } from "lucide-react"
import { useDragDrop } from "@/components/drag-drop-provider"

interface CustomizationPanelProps {
  selectedProduct: string
  selectedColor: string
  onColorChange: (color: string) => void
  onCustomizationChange: (customization: any) => void
}

const colors = [
  { name: "Đen", value: "#000000" },
  { name: "Cam", value: "#d97706" },
  { name: "Trắng", value: "#ffffff" },
  { name: "Xám", value: "#4b5563" },
  { name: "Xanh dương", value: "#0891b2" },
  { name: "Đỏ", value: "#ef4444" },
  { name: "Tím", value: "#8b5cf6" },
  { name: "Hồng", value: "#ec4899" },
]

const textures = [
  { id: "smooth", name: "Mịn", preview: "bg-gradient-to-br from-gray-200 to-gray-300" },
  { id: "rough", name: "Nhám", preview: "bg-gradient-to-br from-gray-300 to-gray-400" },
  { id: "metallic", name: "Kim loại", preview: "bg-gradient-to-br from-gray-400 to-gray-500" },
  { id: "matte", name: "Mờ", preview: "bg-gradient-to-br from-gray-100 to-gray-200" },
]

const patterns = [
  { id: "none", name: "Không", preview: "bg-transparent" },
  { id: "dots", name: "Chấm bi", preview: "bg-dotted" },
  { id: "lines", name: "Sọc", preview: "bg-striped" },
  { id: "grid", name: "Lưới", preview: "bg-grid" },
]

const stickerCategories = [
  {
    id: "space",
    name: "Vũ trụ",
    stickers: [
      { id: "star", name: "Ngôi sao", emoji: "⭐" },
      { id: "planet", name: "Hành tinh", emoji: "🪐" },
      { id: "rocket", name: "Tên lửa", emoji: "🚀" },
      { id: "alien", name: "Người ngoài hành tinh", emoji: "👽" },
    ],
  },
  {
    id: "nature",
    name: "Thiên nhiên",
    stickers: [
      { id: "tree", name: "Cây", emoji: "🌳" },
      { id: "flower", name: "Hoa", emoji: "🌸" },
      { id: "sun", name: "Mặt trời", emoji: "☀️" },
      { id: "moon", name: "Mặt trăng", emoji: "🌙" },
    ],
  },
  {
    id: "symbols",
    name: "Ký hiệu",
    stickers: [
      { id: "heart", name: "Trái tim", emoji: "❤️" },
      { id: "lightning", name: "Tia chớp", emoji: "⚡" },
      { id: "diamond", name: "Kim cương", emoji: "💎" },
      { id: "fire", name: "Lửa", emoji: "🔥" },
    ],
  },
]

export function CustomizationPanel({
  selectedProduct,
  selectedColor,
  onColorChange,
  onCustomizationChange,
}: CustomizationPanelProps) {
  const [selectedTexture, setSelectedTexture] = useState("smooth")
  const [selectedPattern, setSelectedPattern] = useState("none")
  const [opacity, setOpacity] = useState([100])
  const [metallic, setMetallic] = useState([30])
  const [roughness, setRoughness] = useState([40])
  const [showGrid, setShowGrid] = useState(true)
  const [showWireframe, setShowWireframe] = useState(false)

  const { stickers, setDraggedSticker } = useDragDrop()

  const handleReset = () => {
    onColorChange("#d97706")
    setSelectedTexture("smooth")
    setSelectedPattern("none")
    setOpacity([100])
    setMetallic([30])
    setRoughness([40])
  }

  const handleStickerDragStart = (stickerId: string) => {
    setDraggedSticker(stickerId)
  }

  const handleStickerDragEnd = () => {
    setDraggedSticker(null)
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Hành động nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleReset} className="border-border bg-transparent">
              <RotateCcw className="h-4 w-4 mr-1" />
              Đặt lại
            </Button>
            <Button size="sm" variant="outline" className="border-border bg-transparent">
              <Download className="h-4 w-4 mr-1" />
              Tải xuống
            </Button>
            <Button size="sm" variant="outline" className="border-border bg-transparent">
              <Share2 className="h-4 w-4 mr-1" />
              Chia sẻ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sticker Count */}
      {stickers.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Sticker đã thêm:</span>
              <Badge className="bg-primary text-primary-foreground">{stickers.length}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Customization */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Tùy chỉnh sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="colors" className="text-xs">
                <Palette className="h-4 w-4 mr-1" />
                Màu
              </TabsTrigger>
              <TabsTrigger value="texture" className="text-xs">
                <ImageIcon className="h-4 w-4 mr-1" />
                Chất liệu
              </TabsTrigger>
              <TabsTrigger value="stickers" className="text-xs">
                <Layers className="h-4 w-4 mr-1" />
                Sticker
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs">
                <Type className="h-4 w-4 mr-1" />
                Chữ
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4 mt-4">
              <div>
                <Label className="text-foreground mb-3 block">Chọn màu chính</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <div
                      key={color.value}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedColor === color.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => onColorChange(color.value)}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div
                          className="w-8 h-8 rounded-full border border-border"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-xs text-foreground">{color.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground mb-2 block">Độ trong suốt: {opacity[0]}%</Label>
                  <Slider value={opacity} onValueChange={setOpacity} max={100} min={10} step={5} className="w-full" />
                </div>

                <div>
                  <Label className="text-foreground mb-2 block">Độ kim loại: {metallic[0]}%</Label>
                  <Slider value={metallic} onValueChange={setMetallic} max={100} min={0} step={5} className="w-full" />
                </div>

                <div>
                  <Label className="text-foreground mb-2 block">Độ nhám: {roughness[0]}%</Label>
                  <Slider
                    value={roughness}
                    onValueChange={setRoughness}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Texture Tab */}
            <TabsContent value="texture" className="space-y-4 mt-4">
              <div>
                <Label className="text-foreground mb-3 block">Chất liệu bề mặt</Label>
                <div className="grid grid-cols-2 gap-3">
                  {textures.map((texture) => (
                    <div
                      key={texture.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedTexture === texture.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTexture(texture.id)}
                    >
                      <div className={`w-full h-12 rounded ${texture.preview} mb-2`} />
                      <span className="text-sm text-foreground">{texture.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-foreground mb-3 block">Họa tiết</Label>
                <div className="grid grid-cols-2 gap-3">
                  {patterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      className={`p-3 rounded-lg border border-border hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all hover:bg-card/50`}
                      draggable
                    >
                      <div className={`w-full h-12 rounded ${pattern.preview} mb-2 border border-border`} />
                      <span className="text-sm text-foreground">{pattern.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Stickers Tab */}
            <TabsContent value="stickers" className="space-y-4 mt-4">
              <div className="text-center p-4 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5">
                <Layers className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-foreground text-sm font-medium">Kéo sticker vào mô hình 3D</p>
                <p className="text-muted-foreground text-xs mt-1">Double-click sticker trên mô hình để xóa</p>
              </div>

              {stickerCategories.map((category) => (
                <div key={category.id}>
                  <Label className="text-foreground mb-3 block">{category.name}</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {category.stickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all hover:bg-card/50 hover:scale-105"
                        draggable
                        onDragStart={() => handleStickerDragStart(sticker.id)}
                        onDragEnd={handleStickerDragEnd}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{sticker.emoji}</div>
                          <span className="text-xs text-foreground">{sticker.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="text-center p-4 border-2 border-dashed border-border rounded-lg">
                <Type className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Thêm chữ tùy chỉnh</p>
                <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90">
                  Thêm văn bản
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Options */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-sm">Tùy chọn hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid" className="text-foreground text-sm">
              Hiển thị lưới
            </Label>
            <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-wireframe" className="text-foreground text-sm">
              Khung dây
            </Label>
            <Switch id="show-wireframe" checked={showWireframe} onCheckedChange={setShowWireframe} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
