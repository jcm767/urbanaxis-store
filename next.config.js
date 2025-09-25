// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // AliExpress & AliCDN (common product image hosts)
      { protocol: "https", hostname: "ae01.alicdn.com" },
      { protocol: "https", hostname: "img.alicdn.com" },
      { protocol: "https", hostname: "aliexpress.ru" },
      { protocol: "https", hostname: "www.aliexpress.com" },
      { protocol: "https", hostname: "*.aliexpress-media.com" },
      // Add your own CDN(s) here as needed
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
