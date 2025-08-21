/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Remove i18n from here as you're using app router with manual i18n handling
};

export default nextConfig;