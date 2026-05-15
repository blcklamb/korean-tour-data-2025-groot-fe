import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "groot-be-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "groot-app-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "search.pstatic.net",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
