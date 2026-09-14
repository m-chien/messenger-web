import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "yodel-distract-negative.ngrok-free.dev",
    "localhost:8888",
    "localhost:3000",
  ],
  async rewrites() {
    return [
      {
        source: "/users/:path*",
        destination: "http://localhost:8080/users/:path*",
      },
      {
        source: "/chatRooms/:path*",
        destination: "http://localhost:8080/chatRooms/:path*",
      },
      {
        source: "/chatRoomUsers/:path*",
        destination: "http://localhost:8080/chatRoomUsers/:path*",
      },
      {
        source: "/messages/:path*",
        destination: "http://localhost:8080/messages/:path*",
      },
      {
        source: "/friends/:path*",
        destination: "http://localhost:8080/friends/:path*",
      },
      {
        source: "/friendRequests/:path*",
        destination: "http://localhost:8080/friendRequests/:path*",
      },
      {
        source: "/files/:path*",
        destination: "http://localhost:8080/files/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
