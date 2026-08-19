import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
      root: __dirname,
    },
  experimental: {
    
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
