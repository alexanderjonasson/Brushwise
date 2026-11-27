import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Photos are uploaded through a Server Action. The photo itself may be
      // 4 MB (see src/lib/photos.ts); the rest is room for the form encoding.
      bodySizeLimit: "4.2mb",
    },
  },
  images: {
    // Photos are served from our Vercel Blob store
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/miniatures/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
