/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['t4.ftcdn.net', 'lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    };
    return config;
  },
};

export default nextConfig;
