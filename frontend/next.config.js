/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@trpc/server', '@trpc/client', '@trpc/react-query'],
};

module.exports = nextConfig;