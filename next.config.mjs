// next.config.mjs
import path from "node:path";

/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Ép tất cả request http thành https
  { key: "Content-Security-Policy", value: "upgrade-insecure-requests" },
  // Luôn dùng HTTPS cho 1 năm, áp dụng cho subdomain
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Các header bảo mật bổ sung
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  // Ép bundler luôn dùng node_modules/three của project (tránh trùng version do deps khác kéo vào)
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      three: path.resolve(process.cwd(), "node_modules/three"),
    };
    return config;
  },

  async headers() {
    return [
      // Áp dụng security headers cho mọi route
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Đảm bảo file .fbx trả về đúng content-type (không bắt buộc, nhưng tránh edge-case)
      {
        source: "/:file*\\.fbx",
        headers: [
          { key: "Content-Type", value: "application/octet-stream" },
          // Tránh cache khi bạn đang debug / thay FBX thường xuyên
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
