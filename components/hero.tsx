import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-border">
            <Sparkles className="h-4 w-4 text-primary twinkle-animation" />
            <span className="text-sm text-muted-foreground">Công nghệ in 3D từ nhựa tái chế</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Tạo sản phẩm <span className="text-primary">3D độc đáo</span> của riêng bạn
          </h1>

          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Khám phá thế giới tùy chỉnh không giới hạn với các sản phẩm thân thiện môi trường. Từ móc khóa đến phụ kiện
            trang trí, tất cả đều được in 3D từ nhựa tái chế.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/customize">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Bắt đầu tùy chỉnh
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-card bg-transparent">
              Xem sản phẩm
            </Button>
          </div>
        </div>

        {/* Hero 3D Preview */}
        <div className="mt-16 relative">
          <div className="w-full max-w-2xl mx-auto h-96 bg-card/30 backdrop-blur-sm rounded-2xl border border-border flex items-center justify-center float-animation">
            <div className="text-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-16 h-16 bg-primary rounded-lg"></div>
              </div>
              <p className="text-muted-foreground">3D Product Preview</p>
              <p className="text-sm text-muted-foreground mt-2">Sẽ hiển thị mô hình 3D tương tác</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
