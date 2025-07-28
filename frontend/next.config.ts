import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 여기에 추가

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
      {
        source: "/mypage/assets",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
