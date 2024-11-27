import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    webpackMemoryOptimizations: true,
  },
};

export default withPlausibleProxy({
  customDomain: "https://analytics.fascinated.cc",
})(nextConfig);
