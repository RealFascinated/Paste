import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    webpackMemoryOptimizations: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
    "@radix-ui/react-icons": {
      transform: "@radix-ui/react-icons/dist/{{member}}.js",
    },
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

export default nextConfig;
