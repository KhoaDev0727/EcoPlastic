import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGallery } from "@/components/product-gallery"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductGallery />
      <Features />
      <Footer />
    </main>
  )
}
