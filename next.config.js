/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.externals = [...(config.externals || []), ".prisma/client"];
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
