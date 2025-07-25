import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        source: "/mypage",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
