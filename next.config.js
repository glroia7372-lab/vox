/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'd3t32hsnjxo7q6.cloudfront.net',
      },
      {
        protocol: 'http',
        hostname: 'api.lorealparisusa.com',
      },
      {
        protocol: 'https',
        hostname: 'www.purcosmetics.com',
      },
      {
        protocol: 'https',
        hostname: 'www.nyxcosmetics.com',
      },
    ],
  },
};

module.exports = nextConfig;