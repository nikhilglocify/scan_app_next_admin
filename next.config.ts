import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    AWS_REGION: '', // Do not expose AWS_REGION to the client
  },
  /* config options here */
};

export default nextConfig;
