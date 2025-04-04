import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Skip Clerk validation during static build time
  images: {
    unoptimized: true,
  },
  // Don't use static export as it causes issues with Clerk auth pages
  // Instead, we'll handle client-side rendering with proper checks
  // Set distDir to change the build output directory if needed
  // distDir: 'build',
};

export default nextConfig;
