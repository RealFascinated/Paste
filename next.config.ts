import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    webpackMemoryOptimizations: true,
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST",
          },
        ],
      },
    ];
  },
};

export default withPlausibleProxy({
  customDomain: "https://analytics.fascinated.cc",
})(nextConfig);
