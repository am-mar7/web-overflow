import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns :[
      {
        protocol:"https",
        hostname : "i.pravatar.cc",
        port:"",
      }
    ]
  }
};

export default nextConfig;
