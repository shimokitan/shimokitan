
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@shimokitan/db", "@shimokitan/ui", "@shimokitan/auth"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
