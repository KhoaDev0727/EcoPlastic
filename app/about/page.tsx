// app/about/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Leaf, Users, Package, MapPin, Mail, Calendar, Facebook, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    { name: "Nguyễn Trương Ngọc Thảo", mssv: "CS181722" },
    { name: "Nguyễn Hoàng Khang", mssv: "CE180211" },
    { name: "Cao Minh Quang", mssv: "CS180814" },
    { name: "Lê Minh Khoa", mssv: "CE181686" },
    { name: "Lê Minh Thư", mssv: "CE180761" },
  ];

  const products = [
    {
      name: "DecoBox",
      desc: "Case đựng hộp hít Thái",
      detail: "Hộp bảo vệ nhỏ, nắp gập, dùng để đựng hộp hít Thái, tác dụng làm nổi bật, trang trí, thể hiện phong cách cá nhân.",
      icon: <Package className="w-6 h-6" />,
    },
    {
      name: "DecoKey",
      desc: "Móc khóa mô hình",
      detail: "Móc khóa mô hình (nhân vật, emoji). Dùng trang trí balo, chìa khóa.",
      icon: <Package className="w-6 h-6" />,
    },
    {
      name: "DecoPet",
      desc: "Đồ trang trí để bàn",
      detail: "Mô hình có kích thước vừa và nhỏ (mascot, biểu tượng) dùng để bàn làm việc, trang trí trên kệ.",
      icon: <Package className="w-6 h-6" />,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Leaf className="w-4 h-4 mr-1" />
              Thân thiện với môi trường
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Về <span className="text-primary">Second Life Plastic</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Chúng tôi biến nhựa bỏ đi thành những sản phẩm cá nhân hóa độc đáo, vừa đẹp mắt, vừa bảo vệ hành tinh.
            </p>
          </section>

          <Separator className="mb-16" />

          {/* Company Info */}
          <section className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" />
                Thông tin công ty
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <strong className="text-foreground w-32">Tên công ty:</strong>
                  SECOND LIFE PLASTIC
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>600 Nguyễn Văn Cừ nối dài - P. An Bình - TP. Cần Thơ</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Thành lập: 22/09/2025</span>
                </p>
                <p className="flex items-center gap-2">
                  <Badge variant="outline" className="w-fit">Hộ kinh doanh cá thể</Badge>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Liên hệ</h2>
              <div className="space-y-4">
                <Link
                  href="https://www.facebook.com/secondlifeplastic/"
                  target="_blank"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  facebook.com/secondlifeplastic
                </Link>
                <Link
                  href="https://seli.id.vn"
                  target="_blank"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  seli.id.vn
                </Link>
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  secondlifeplastic@seli.id.vn
                </p>
              </div>
            </div>
          </section>

          <Separator className="mb-16" />

          {/* Team Members */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Nhóm phát triển
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.mssv} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-center">{member.name}</CardTitle>
                    <CardDescription className="text-center">
                      MSSV: {member.mssv}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="mb-16" />

          {/* Products */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Sản phẩm của chúng tôi
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.name} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      {product.icon}
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{product.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12 bg-primary/5 rounded-3xl">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Sẵn sàng tạo ra sản phẩm của riêng bạn?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Tham gia cùng chúng tôi trong hành trình biến nhựa tái chế thành những món đồ ý nghĩa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/customize">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Bắt đầu tùy chỉnh
                </Button>
              </Link>
              <Link href="#products">
                <Button size="lg" variant="outline">
                  Xem sản phẩm
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}