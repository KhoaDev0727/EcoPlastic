import { Button } from "@/components/ui/button";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border py-10 px-4 mt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

          {/* Brand & Tagline */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Second Life Plastic</h3>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Phụ kiện cá nhân từ nhựa tái chế – in 3D, thân thiện môi trường.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Liên hệ
            </h4>
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <Mail className="w-3.5 h-3.5" />
              secondlifeplastic@seli.id.vn
            </p>
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              600 Nguyễn Văn Cừ nối dài, P. An Bình, TP. Cần Thơ
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="font-semibold text-foreground mb-3">Theo dõi chúng tôi</h4>
            <div className="flex space-x-3">
              <Link
                href="https://www.facebook.com/secondlifeplastic/"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="mailto:secondlifeplastic@seli.id.vn"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <Mail className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Link
              href="https://seli.id.vn"
              target="_blank"
              className="mt-4 text-xs text-muted-foreground hover:text-primary underline underline-offset-2"
            >
              seli.id.vn
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 <span className="font-medium">Second Life Plastic</span>. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}