import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Móc khóa Space",
    category: "Móc khóa",
    price: "89,000",
    originalPrice: "120,000",
    image: "/futuristic-space-keychain-3d-printed-black.jpg",
    colors: ["#000000", "#d97706", "#ffffff", "#4b5563"],
    isNew: true,
    isBestseller: false,
  },
  {
    id: 2,
    name: "Lược Galaxy",
    category: "Cây lược",
    price: "156,000",
    originalPrice: "200,000",
    image: "/galaxy-themed-comb-3d-printed-cosmic-design.jpg",
    colors: ["#000000", "#4b5563", "#d97706", "#ffffff"],
    isNew: false,
    isBestseller: true,
  },
  {
    id: 3,
    name: "Kệ điện thoại Nebula",
    category: "Trang trí",
    price: "234,000",
    originalPrice: "300,000",
    image: "/nebula-phone-stand-3d-printed-cosmic-decoration.jpg",
    colors: ["#d97706", "#000000", "#4b5563"],
    isNew: true,
    isBestseller: false,
  },
  {
    id: 4,
    name: "Móc khóa Astronaut",
    category: "Móc khóa",
    price: "95,000",
    originalPrice: "130,000",
    image: "/astronaut-keychain-3d-printed-space-theme.jpg",
    colors: ["#ffffff", "#000000", "#d97706"],
    isNew: false,
    isBestseller: true,
  },
  {
    id: 5,
    name: "Đèn LED Cosmos",
    category: "Trang trí",
    price: "445,000",
    originalPrice: "600,000",
    image: "/cosmos-led-lamp-3d-printed-space-decoration.jpg",
    colors: ["#000000", "#d97706", "#4b5563"],
    isNew: true,
    isBestseller: false,
  },
  {
    id: 6,
    name: "Lược Rocket",
    category: "Cây lược",
    price: "178,000",
    originalPrice: "220,000",
    image: "/rocket-shaped-comb-3d-printed-space-design.jpg",
    colors: ["#d97706", "#000000", "#ffffff"],
    isNew: false,
    isBestseller: false,
  },
]

const categories = ["Tất cả", "Móc khóa", "Cây lược", "Trang trí"]

export function ProductGallery() {
  return (
    <section id="products" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bộ sưu tập <span className="text-primary">Vũ trụ</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Khám phá các sản phẩm độc đáo được in 3D từ nhựa tái chế, mang phong cách vũ trụ hiện đại
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Tất cả" ? "default" : "outline"}
              className={
                category === "Tất cả"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "border-border text-foreground hover:bg-card bg-transparent"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 group"
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-primary text-primary-foreground">Mới</Badge>}
                    {product.isBestseller && (
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        Bán chạy
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="secondary" className="bg-card/80 backdrop-blur-sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="bg-card/80 backdrop-blur-sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Customize Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Tùy chỉnh ngay
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      {product.category}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>

                  {/* Color Options */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">Màu:</span>
                    <div className="flex gap-1">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">{product.price}₫</span>
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}₫</span>
                    </div>
                    <Button size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-card bg-transparent">
            Xem thêm sản phẩm
          </Button>
        </div>
      </div>
    </section>
  )
}
