import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
   eslint: {
    // ⚠️ Attention : ça bypass les erreurs mais ça n'arrange pas ton code
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
