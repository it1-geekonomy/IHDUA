import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/education",
        destination: "/Education",
      },
      {
        source: "/vinayakagnana-vidyashale-mysore",
        destination: "/VinayakAgnana-Vidyashale-Mysore",
      },
      {
        source: "/vinayakagnana-vidyashale-mysore/gallery",
        destination: "/VinayakAgnana-Vidyashale-Mysore/gallery",
      },
      {
        source: "/adarsha-academy-krs",
        destination: "/Adarsha-Academy-KRS",
      },
      {
        source: "/adarsha-academy-krs/gallery",
        destination: "/Adarsha-Academy-KRS/gallery",
      },
    ];
  },
};

export default nextConfig;
