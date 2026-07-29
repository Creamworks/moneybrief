import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 헤드리스 워드프레스(대표 이미지) 최적화 허용
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bcredit.host.whoisweb.net",
      },
    ],
  },
};

export default nextConfig;
