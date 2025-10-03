import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
      },
    },
  },
};

export default nextConfig;
