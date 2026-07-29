import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
