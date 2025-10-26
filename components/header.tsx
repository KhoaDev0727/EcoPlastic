// components/header.tsx
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* === LOGO === */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-border/50 shadow-sm transition-all group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="Second Life Plastic Logo"
                fill
                className="object-cover"
                sizes="32px"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Seli Store
            </h1>
          </Link>

          {/* === NAVIGATION === */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link href="/#products" className="text-foreground hover:text-primary transition-colors">
              Sản phẩm
            </Link>
            <Link href="/#customize" className="text-foreground hover:text-primary transition-colors">
              Tùy chỉnh
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              Về chúng tôi
            </Link>
          </nav>

          {/* === USER ACTIONS === */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <User className="h-5 w five" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <ShoppingCart className="h-5 w five" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w five" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}