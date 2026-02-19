import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow external image domains if needed
    remotePatterns: [],
  },
  env: {
    // Public: accessible in client-side code
    NEXT_PUBLIC_LANG_API_URL: process.env.NEXT_PUBLIC_LANG_API_URL || '/api/lang',
  },
};

export default nextConfig;
