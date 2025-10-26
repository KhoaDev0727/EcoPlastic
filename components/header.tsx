// components/header.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* === LOGO === */}
          <Link href="/" className="flex items-center space-x-2 group" onClick={closeMobile}>
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

          {/* === NAVIGATION (Desktop) === */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Trang chủ</Link>
            <Link href="/#products" className="text-foreground hover:text-primary transition-colors">Sản phẩm</Link>
            <Link href="/#customize" className="text-foreground hover:text-primary transition-colors">Tùy chỉnh</Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">Về chúng tôi</Link>
          </nav>

          {/* === USER ACTIONS + Hamburger === */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {/* Hamburger (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* === NAVIGATION (Mobile Panel) === */}
        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-200 overflow-hidden ${
            mobileOpen ? "max-h-96 mt-3" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-2 rounded-xl border border-border bg-background/90 p-3 shadow-md">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={closeMobile}
            >
              Trang chủ
            </Link>
            <Link
              href="/#products"
              className="px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={closeMobile}
            >
              Sản phẩm
            </Link>
            <Link
              href="/#customize"
              className="px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={closeMobile}
            >
              Tùy chỉnh
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={closeMobile}
            >
              Về chúng tôi
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
