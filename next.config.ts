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
  // Configuración actualizada para Next.js 15
  serverExternalPackages: [],
  // Configuración para Docker (standalone output)
  output: 'standalone',
};

export default nextConfig;

