import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  serverExternalPackages: ["@prisma/client"],
  images: {
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      // V0.2 enterprise placeholder → V1.0 services page
      {
        source: "/enterprise",
        destination: "/services",
        permanent: true,
      },
      // Legacy "knowledge" nav entry → insights
      {
        source: "/knowledge",
        destination: "/guides",
        permanent: true,
      },
      // Legacy "database" nav entry → materials
      {
        source: "/database",
        destination: "/materials",
        permanent: true,
      },
      // Drop the old reference page (never had content); redirect to tools
      {
        source: "/reference",
        destination: "/tools",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
