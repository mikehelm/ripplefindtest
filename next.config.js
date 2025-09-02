/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache completely in development to prevent ENOENT errors
    if (dev) {
      config.cache = false;
      // Also disable filesystem cache
      config.infrastructureLogging = { level: 'error' };
    }
    return config;
  },
  // Reduce memory pressure that can cause cache issues
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
