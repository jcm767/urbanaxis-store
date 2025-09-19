/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ae-pic-a1.aliexpress-media.com' },
      // add other hosts you might use:
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: 'ae01.aliexpress-media.com' },
    ],
  },
};

module.exports = nextConfig;
