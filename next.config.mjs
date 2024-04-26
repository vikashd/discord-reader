/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.discordapp.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.discordapp.net",
        port: "",
      },
    ],
  },
};

export default nextConfig;
