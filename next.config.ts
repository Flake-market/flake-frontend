import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@coral-xyz/anchor',
    '@solana/web3.js',
    '@solana/spl-token'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
    ],
  },
};

export default nextConfig;
