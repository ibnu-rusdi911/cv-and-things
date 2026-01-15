/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ✅ Biarkan Next.js decide yang terbaik
  // output: 'export', // ❌ JANGAN
  
  images: {
    unoptimized: true,
  },
  
  // Jika ada masalah build di Vercel, baru aktifkan ini:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Untuk security headers (optional)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig