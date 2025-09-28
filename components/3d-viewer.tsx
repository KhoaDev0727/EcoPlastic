"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut, Maximize, X } from "lucide-react"
import { useDragDrop } from "@/components/drag-drop-provider"
import type * as THREE from "three"

// 3D Sticker Component
function StickerMesh({ sticker, onRemove }: { sticker: any; onRemove: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group
      position={[sticker.position.x, sticker.position.y, sticker.position.z]}
      rotation={[sticker.rotation.x, sticker.rotation.y, sticker.rotation.z]}
      scale={sticker.scale}
    >
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (e.detail === 2) {
            // Double click to remove
            onRemove()
          }
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0.9} />
      </mesh>

      {/* Text representation of emoji */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        {sticker.emoji}
      </Text>

      {/* Remove button when hovered */}
      {hovered && (
        <Html position={[0.6, 0.6, 0]} center>
          <Button
            size="icon"
            variant="destructive"
            className="w-6 h-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Html>
      )}
    </group>
  )
}

// 3D Product Model Component with drop zone
function ProductModel({
  productType = "keychain",
  color = "#d97706",
  scale = 1,
}: {
  productType?: string
  color?: string
  scale?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { addSticker, draggedSticker, setDraggedSticker } = useDragDrop()
  const { camera, raycaster, pointer } = useThree()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const handleDrop = (event: any) => {
    event.preventDefault()
    if (draggedSticker) {
      // Calculate 3D position from mouse position
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObject(meshRef.current!)

      if (intersects.length > 0) {
        const point = intersects[0].point
        addSticker({
          type: draggedSticker,
          emoji: getStickerEmoji(draggedSticker),
        })
      }
      setDraggedSticker(null)
    }
  }

  const getStickerEmoji = (type: string) => {
    const emojiMap: { [key: string]: string } = {
      star: "⭐",
      planet: "🪐",
      rocket: "🚀",
      alien: "👽",
      tree: "🌳",
      flower: "🌸",
      sun: "☀️",
      moon: "🌙",
      heart: "❤️",
      lightning: "⚡",
      diamond: "💎",
      fire: "🔥",
    }
    return emojiMap[type] || "⭐"
  }

  // Simple geometric shapes for different product types
  const getGeometry = () => {
    switch (productType) {
      case "keychain":
        return (
          <group ref={meshRef} scale={scale}>
            {/* Main keychain body */}
            <mesh position={[0, 0, 0]} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
              <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
              <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Keychain ring */}
            <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.3, 0.1, 8, 16]} />
              <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Decorative elements */}
            <mesh position={[0, 0, 0.15]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
            </mesh>
          </group>
        )
      case "comb":
        return (
          <group ref={meshRef} scale={scale}>
            {/* Comb handle */}
            <mesh position={[0, 0, 0]} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
              <boxGeometry args={[0.3, 2, 0.2]} />
              <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
            </mesh>
            {/* Comb teeth */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} position={[0.4, 0.8 - i * 0.2, 0]}>
                <boxGeometry args={[0.6, 0.05, 0.15]} />
                <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
              </mesh>
            ))}
          </group>
        )
      case "decoration":
        return (
          <group ref={meshRef} scale={scale}>
            {/* Base */}
            <mesh position={[0, -0.5, 0]} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
              <cylinderGeometry args={[1, 1, 0.2, 8]} />
              <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Main decoration */}
            <mesh position={[0, 0.5, 0]}>
              <octahedronGeometry args={[0.8]} />
              <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
            </mesh>
            {/* Accent elements */}
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={i} position={[Math.cos((i * Math.PI) / 3) * 1.2, 0.5, Math.sin((i * Math.PI) / 3) * 1.2]}>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        )
      default:
        return (
          <mesh ref={meshRef} scale={scale} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
    }
  }

  return getGeometry()
}

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-foreground">Đang tải mô hình 3D...</span>
      </div>
    </Html>
  )
}

interface Product3DViewerProps {
  productType?: "keychain" | "comb" | "decoration"
  color?: string
  className?: string
  showControls?: boolean
}

export function Product3DViewer({
  productType = "keychain",
  color = "#d97706",
  className = "",
  showControls = true,
}: Product3DViewerProps) {
  const [scale, setScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const controlsRef = useRef<any>(null)
  const { stickers, removeSticker } = useDragDrop()

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
    setScale(1)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div
      className={`relative bg-card/30 backdrop-blur-sm rounded-lg border border-border overflow-hidden ${className}`}
    >
      <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-96"}`}>
        <Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
          <PerspectiveCamera makeDefault position={[3, 3, 3]} />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#d97706" />

          {/* Environment */}
          <Environment preset="studio" />

          {/* Product Model */}
          <Suspense fallback={<Loader />}>
            <ProductModel productType={productType} color={color} scale={scale} />
          </Suspense>

          {/* Render Stickers */}
          {stickers.map((sticker) => (
            <StickerMesh key={sticker.id} sticker={sticker} onRemove={() => removeSticker(sticker.id)} />
          ))}

          {/* Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />

          {/* Grid */}
          <gridHelper args={[10, 10, "#4b5563", "#374151"]} position={[0, -2, 0]} />
        </Canvas>

        {/* Control Buttons */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Product Info Overlay */}
        <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border">
          <h3 className="text-foreground font-semibold mb-1">
            {productType === "keychain" && "Móc khóa Space"}
            {productType === "comb" && "Lược Galaxy"}
            {productType === "decoration" && "Đồ trang trí Cosmos"}
          </h3>
          <p className="text-muted-foreground text-sm">
            Kéo sticker vào • Double-click để xóa • {stickers.length} sticker
          </p>
        </div>

        {/* Fullscreen close button */}
        {isFullscreen && (
          <Button
            className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={() => setIsFullscreen(false)}
          >
            Đóng
          </Button>
        )}
      </div>
    </div>
  )
}
