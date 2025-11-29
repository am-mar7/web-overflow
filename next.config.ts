import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns :[
      {
        protocol:"https",
        hostname : "i.pravatar.cc",
        port:"",
      },
      {
        protocol:"https",
        hostname: "lh3.googleusercontent.com",
        port:"",
      },
      {
        protocol:"https",
        hostname: "lh3.githubusercontent.com",
        port:"",
      },
    ]
  }
};

export default nextConfig;
