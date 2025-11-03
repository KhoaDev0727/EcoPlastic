// components/DynamicModelViewer.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Center } from "@react-three/drei";
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

function FBXPrimitive({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!url) throw new Error("fbxPath rỗng hoặc không phải .fbx");

        // Fetch thủ công để kiểm soát payload
        const res = await fetch(url, { cache: "no-store" });
        const status = res.status;
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) throw new Error(`HTTP ${status} khi tải ${url}`);

        const buf = await res.arrayBuffer();

        // Kiểm tra header Binary FBX
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

        // KHÔNG gán màu ở đây nữa (để dành cho trang customize)
        // Chỉ bật shadow flags
        model.traverse((o: any) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });

        // --- AUTO SCALE + CENTER ---
        // 1) Đưa model về origin
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center); // dịch để tâm về (0,0,0)

        // 2) Chuẩn hóa kích thước: đặt cạnh dài nhất = targetSize
        const size = new THREE.Vector3();
        box.getSize(size);
        const longest = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 1.6; // tuỳ chỉnh: ~1.6 đơn vị cho mọi model
        const scale = targetSize / longest;
        model.scale.setScalar(scale);

        // (Optional) tính lại box sau scale để đảm bảo
        // const box2 = new THREE.Box3().setFromObject(model);

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

  return <primitive ref={groupRef} object={obj} />;
}

interface DynamicModelViewerProps {
  fbxPath: string;
  // KHÔNG nhận/áp dụng color ở viewer nữa
}

export default function DynamicModelViewer({ fbxPath }: DynamicModelViewerProps) {
  // Ép path về dạng "/<basename>.fbx"
  const safePath = useMemo(() => normalizeFbxPath(fbxPath), [fbxPath]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-card/50 to-card rounded-2xl overflow-hidden">
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

        <Center>
          <FBXPrimitive url={safePath} />
        </Center>

        <OrbitControls enablePan={false} makeDefault />
      </Canvas>
    </div>
  );
}
