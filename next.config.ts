import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  // Asegurar que Next.js use el directorio src/
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;

