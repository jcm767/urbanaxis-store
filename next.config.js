/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Canonicalize ONLY from www -> apex to avoid ping-pong loops.
  // If the request host is "www.theurbanaxis.com", redirect to apex.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.theurbanaxis.com' }],
        destination: 'https://theurbanaxis.com/:path*',
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '*.alicdn.com' },
      { protocol: 'https', hostname: '*.aliexpress-media.com' },
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: 'i.alicdn.com' }
    ],
  },
};

module.exports = nextConfig;
