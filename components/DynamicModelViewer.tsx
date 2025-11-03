// components/DynamicModelViewer.tsx
"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as THREE from "three";

/** Lấy đúng tên file .fbx cuối cùng và ép thành "/<basename>.fbx" */
function normalizeFbxPath(raw?: string) {
  if (!raw || typeof raw !== "string") return "";
  const m = raw.match(/[^/\\]+\.fbx$/i);
  if (!m) return "";
  return `/${m[0]}`; // giữ nguyên hoa/thường
}

function Loader() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-foreground">Đang tải FBX…</span>
      </div>
    </Html>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <Html center>
      <div className="px-3 py-2 rounded-md bg-red-500/10 border border-red-500 text-red-500 text-sm max-w-[380px]">
        {message}
      </div>
    </Html>
  );
}

function useFitModelToView(model: THREE.Object3D | null, opts?: { targetSize?: number }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetSize = opts?.targetSize ?? 1.6; // kích thước “vừa phải” trong card

  useEffect(() => {
    if (!model) return;

    // Reset mọi xoay lạ/axis khác: đảm bảo đứng thẳng, nhìn thẳng
    model.rotation.set(0, 0, 0);

    // Tính bbox ban đầu
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Đưa tâm về (0,0,0) để model nằm giữa khung
    model.position.sub(center);

    // Scale để cạnh dài nhất bằng targetSize
    const size = new THREE.Vector3();
    box.getSize(size);
    const longest = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / longest;
    model.scale.setScalar(scale);

    // Tính lại bbox sau khi scale + center để tinh chỉnh
    const box2 = new THREE.Box3().setFromObject(model);
    const size2 = new THREE.Vector3();
    const center2 = new THREE.Vector3();
    box2.getSize(size2);
    box2.getCenter(center2);

    // Đưa tâm thật về 0 lần nữa (tránh sai biệt do scale)
    model.position.sub(center2);

    // Nhẹ nhàng nâng mô hình lên một chút để nằm giữa khung nhìn (do camera hơi nhìn từ trên)
    const lift = size2.y * 0.05;
    model.position.y += lift;

    // Cập nhật camera target về (0, 0, 0)
    // (OrbitControls sẽ đọc target này)
    if ("lookAt" in camera) {
      camera.lookAt(0, 0, 0);
    }
  }, [model, camera, targetSize]);

  return controlsRef;
}

function FBXPrimitive({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const controlsRef = useFitModelToView(obj, { targetSize: 1.6 });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!url) throw new Error("fbxPath rỗng hoặc không phải .fbx");

        const res = await fetch(url, { cache: "no-store" });
        const status = res.status;
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) throw new Error(`HTTP ${status} khi tải ${url}`);

        const buf = await res.arrayBuffer();

        const head = new TextDecoder().decode(new Uint8Array(buf.slice(0, 24)));
        if (!head.includes("Kaydara FBX Binary")) {
          throw new Error(
            `Payload không phải FBX Binary (status=${status}, header=${JSON.stringify(
              head
            )}, content-type="${ct}")`
          );
        }

        const loader = new FBXLoader();
        const model = loader.parse(buf, "");

        // KHÔNG gán màu — giữ nguyên vật liệu gốc
        model.traverse((o: any) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });

        if (alive) {
          setObj(model);
          setErr(null);
        }
      } catch (e: any) {
        console.error("FBX load error:", e);
        if (alive) setErr(String(e?.message || e));
      }
    })();

    return () => {
      alive = false;
      // Dọn tài nguyên khi unmount
      if (groupRef.current) {
        groupRef.current.traverse((o: any) => {
          if (o.isMesh) {
            o.geometry?.dispose?.();
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats?.forEach((m: any) => {
              m?.map?.dispose?.();
              m?.normalMap?.dispose?.();
              m?.roughnessMap?.dispose?.();
              m?.metalnessMap?.dispose?.();
              m?.dispose?.();
            });
          }
        });
      }
    };
  }, [url]);

  if (err) return <ErrorBox message={err} />;
  if (!obj) return <Loader />;

  return (
    <>
      <primitive ref={groupRef} object={obj} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        makeDefault
        // Khóa target ngay giữa mô hình
        target={[0, 0, 0]}
        // Giới hạn zoom để mô hình luôn “vừa phải” trong card
        minDistance={1.2}
        maxDistance={6}
      />
    </>
  );
}

interface DynamicModelViewerProps {
  fbxPath: string;
}

export default function DynamicModelViewer({ fbxPath }: DynamicModelViewerProps) {
  const safePath = useMemo(() => normalizeFbxPath(fbxPath), [fbxPath]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-card/50 to-card rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 3.2], fov: 45 }} // góc nhìn ổn cho card
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

        <FBXPrimitive url={safePath} />
      </Canvas>
    </div>
  );
}
