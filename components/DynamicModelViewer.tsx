// components/DynamicModelViewer.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Center } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as THREE from "three";

/** Parse color string (#RRGGBB | #RRGGBBAA) -> { hex, opacity } */
function parseColorWithAlpha(input?: string) {
  const fallback = { hex: "#ffffff", opacity: 1 };
  if (!input || typeof input !== "string") return fallback;
  const s = input.trim();
  if (/^#([0-9a-fA-F]{6})$/.test(s)) return { hex: s, opacity: 1 };
  if (/^#([0-9a-fA-F]{8})$/.test(s)) {
    const hex = `#${s.slice(1, 7)}`;
    const aa = parseInt(s.slice(7, 9), 16);
    return { hex, opacity: Math.max(0, Math.min(1, aa / 255)) };
  }
  try {
    const c = new THREE.Color(s);
    return { hex: `#${c.getHexString()}`, opacity: 1 };
  } catch {
    return fallback;
  }
}

/** Lấy đúng tên file .fbx cuối cùng và ép thành "/<basename>.fbx" */
function normalizeFbxPath(raw?: string) {
  if (!raw || typeof raw !== "string") return "";
  const m = raw.match(/[^/\\]+\.fbx$/i);
  if (!m) return "";
  // Giữ nguyên hoa/thường (Linux/Vercel phân biệt)
  return `/${m[0]}`;
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

function FBXPrimitive({ url, color }: { url: string; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const { hex, opacity } = useMemo(() => parseColorWithAlpha(color), [color]);

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

        model.traverse((o: any) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            const mats: THREE.Material[] = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach((m: any) => {
              if (m && "color" in m && m.color instanceof THREE.Color) {
                m.color = new THREE.Color(hex);
                if (opacity < 1) {
                  m.transparent = true;
                  m.opacity = opacity;
                }
                m.needsUpdate = true;
              }
            });
          }
        });

        model.scale.setScalar(0.01);

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
  }, [url, hex, opacity]);

  if (err) return <ErrorBox message={err} />;
  if (!obj) return <Loader />;

  return <primitive ref={groupRef} object={obj} />;
}

interface DynamicModelViewerProps {
  fbxPath: string;
  color?: string;
}

export default function DynamicModelViewer({
  fbxPath,
  color = "#cf05beff",
}: DynamicModelViewerProps) {
  const safePath = useMemo(() => normalizeFbxPath(fbxPath), [fbxPath]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-card/50 to-card rounded-2xl overflow-hidden">
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

        <Center>
          <FBXPrimitive url={safePath} color={color} />
        </Center>

        <OrbitControls enablePan={false} makeDefault />
      </Canvas>
    </div>
  );
}
