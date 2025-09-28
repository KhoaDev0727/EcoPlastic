"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Sticker {
  id: string
  type: string
  emoji: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: number
}

interface DragDropContextType {
  stickers: Sticker[]
  addSticker: (sticker: Omit<Sticker, "id" | "position" | "rotation" | "scale">) => void
  removeSticker: (id: string) => void
  updateSticker: (id: string, updates: Partial<Sticker>) => void
  draggedSticker: string | null
  setDraggedSticker: (sticker: string | null) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)

  const addSticker = (stickerData: Omit<Sticker, "id" | "position" | "rotation" | "scale">) => {
    const newSticker: Sticker = {
      ...stickerData,
      id: `sticker-${Date.now()}-${Math.random()}`,
      position: { x: 0, y: 0, z: 0.5 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 0.3,
    }
    setStickers((prev) => [...prev, newSticker])
  }

  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id))
  }

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  return (
    <DragDropContext.Provider
      value={{
        stickers,
        addSticker,
        removeSticker,
        updateSticker,
        draggedSticker,
        setDraggedSticker,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}
