import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 여기에 추가

  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  },

  async redirects() {
    return [
      {
        source: "/login",
        destination: "/",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
