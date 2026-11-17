import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the production Docker image (copies .next/standalone)
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
