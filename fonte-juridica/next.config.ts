import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
      ignoreDuringBuilds: true
    },
    typescript: {
      ignoreBuildErrors: true
    },
    images: {
      domains: ['source.unsplash.com'],
    },
};

export default nextConfig;
