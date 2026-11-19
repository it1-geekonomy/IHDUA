import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the production Docker image (copies .next/standalone)
  output: "standalone",
  // Keep title/canonical/meta in <head> for HTML crawlers (Screaming Frog, etc.).
  // Without this, async generateMetadata streams those tags into <body>.
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "gsap"],
  },
  async redirects() {
    return [
      {
        source: "/farmer",
        destination: "/farmers",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/Fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
