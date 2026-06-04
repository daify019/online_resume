/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
    typedRoutes: false,
  },
};

export default nextConfig;
