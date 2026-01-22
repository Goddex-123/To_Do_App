import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/To_Do_App',
  assetPrefix: '/To_Do_App/',
};

export default nextConfig;
