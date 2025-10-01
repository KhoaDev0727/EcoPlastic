"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX, Center, Html } from "@react-three/drei";

function Model() {
  const fbx = useFBX("/test.fbx");

  // Nếu model quá to/nhỏ hoặc bị xoay, tinh chỉnh scale/rotation tại đây
  // Ví dụ: scale 0.01 và xoay trục X một chút
  return (
    <primitive
      object={fbx}
      scale={0.01}
      rotation={[Math.PI * -0.5, 0, 0]} // tùy mô hình, có thể bỏ nếu không cần
      castShadow
      receiveShadow
    />
  );
}

export default function ModelViewer3D() {
  return (
    <div className="w-full max-w-2xl mx-auto h-96 bg-card/30 backdrop-blur-sm rounded-2xl border border-border overflow-hidden">
      <Canvas shadows camera={{ position: [2, 2, 4], fov: 45 }}>
        {/* Ánh sáng cơ bản */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />

        <Suspense fallback={<Html center>Đang tải mô hình 3D…</Html>}>
          {/* Center sẽ tự canh giữa model theo bounding box */}
          <Center>
            <Model />
          </Center>
          <OrbitControls enablePan={false} makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}
