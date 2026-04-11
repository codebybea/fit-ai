import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sem isso, no Next 16 quality acima de 75 é ignorado (fica tudo em 75).
    qualities: [75, 85, 90, 92, 95, 100],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
