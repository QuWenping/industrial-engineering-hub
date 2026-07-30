import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  serverExternalPackages: ["@prisma/client"],
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
