// components/product-gallery.tsx
"use client";

import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import DynamicModelViewer from "@/components/DynamicModelViewer";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ProductGallery() {
  const { data: products } = useSWR("/api/products", fetcher);
  const list = Array.isArray(products) ? products : [];

  return (
    <section id="products" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sản phẩm thử nghiệm
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((p) => (
            <Card key={p.id} className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
              <CardContent className="p-0 flex flex-col">
                {/* 3D Model */}
                <div className="h-64 w-full">
                  <DynamicModelViewer fbxPath={p.fbxPath} />
                </div>

                {/* Info */}
                <div className="p-6 flex-1">
                  <Badge variant="outline" className="mb-2">3D Model</Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{p.name}</h3>
                  <div className="text-xl font-bold text-primary mb-4">
                    {p.price.toLocaleString()}₫
                  </div>

                  {/* TRUYỀN productId QUA URL */}
                  <Link href={`/customize?productId=${p.id}`}>
                    <Button className="w-full">Tùy chỉnh & Đặt hàng</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}