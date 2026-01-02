import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: 'export',
  images: {
    unoptimized: true
  },
  // Ensure proper headers for Safari compatibility
  async headers() {
    return [
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
