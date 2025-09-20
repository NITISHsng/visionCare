/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    NEXT_FONT_GOOGLE_OPTIMIZED: 'false',
  },
};

module.exports = nextConfig;
