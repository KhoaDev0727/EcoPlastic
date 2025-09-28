import { Card, CardContent } from "@/components/ui/card"
import { Recycle, Palette, Printer, Sparkles } from "lucide-react"

const features = [
  {
    icon: Recycle,
    title: "100% Nhựa tái chế",
    description: "Sản phẩm được làm từ nhựa tái chế, thân thiện với môi trường và bền vững.",
  },
  {
    icon: Palette,
    title: "Tùy chỉnh không giới hạn",
    description: "Thay đổi màu sắc, thêm sticker và tạo ra sản phẩm độc đáo theo ý thích.",
  },
  {
    icon: Printer,
    title: "Công nghệ in 3D hiện đại",
    description: "Sử dụng máy in 3D chất lượng cao để tạo ra sản phẩm chính xác và bền đẹp.",
  },
  {
    icon: Sparkles,
    title: "Thiết kế Gen Z",
    description: "Phong cách trẻ trung, hiện đại phù hợp với thế hệ Gen Z năng động.",
  },
]

export function Features() {
  return (
    <section className="py-16 px-4 bg-card/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tại sao chọn <span className="text-primary">EcoSpace 3D</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Chúng tôi kết hợp công nghệ hiện đại với trách nhiệm môi trường
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 text-center"
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 float-animation">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
