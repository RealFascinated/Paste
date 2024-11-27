import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
