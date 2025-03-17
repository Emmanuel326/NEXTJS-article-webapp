/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local backend for development
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      // Production backend using api.fynanceguide.site
      {
        protocol: "https",
        hostname: "api.fynanceguide.site",
        pathname: "/media/**",
      },
    ],
  },
  compiler: {
    // This will remove all console statements in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
