// components/DynamicModelViewer.tsx
"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX, Center, Html } from "@react-three/drei";
import * as THREE from "three";

interface DynamicModelViewerProps {
  fbxPath: string;
  color?: string;
}

function Model({ fbxPath, color }: { fbxPath: string; color: string }) {
  const fbx = useFBX(fbxPath);

  useEffect(() => {
    if (!fbx || !color) return;
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (mat && "color" in mat && mat.color instanceof THREE.Color) {
            mat.color.set(color);
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [fbx, color]);

  return (
    <primitive
      object={fbx}
      scale={0.01} 
      rotation={[0, 0, 0]}
      castShadow
      receiveShadow
    />
  );
}

export default function DynamicModelViewer({ fbxPath, color = "#cf05beff" }: DynamicModelViewerProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-card/50 to-card rounded-2xl overflow-hidden">
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

        <Suspense fallback={<Html center><div className="text-white">Đang tải 3D...</div></Html>}>
          <Center>
            <Model fbxPath={fbxPath} color={color} />
          </Center>
          <OrbitControls enablePan={false} makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}