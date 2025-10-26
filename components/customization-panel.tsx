// components/customization-panel.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

interface CustomizationPanelProps {
  selectedProduct: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onCustomizationChange: (customization: any) => void;
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
];

export function CustomizationPanel({
  selectedColor,
  onColorChange,
}: CustomizationPanelProps) {
  return (
    <CardContent className="p-0">
      <div className="grid grid-cols-4 gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`group relative p-3 rounded-xl border-2 transition-all ${
              selectedColor === color.value
                ? "border-primary shadow-lg scale-105"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div
              className="w-full h-12 rounded-lg shadow-inner"
              style={{ backgroundColor: color.value }}
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </CardContent>
  );
}