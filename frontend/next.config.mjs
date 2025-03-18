/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:65534/:path*",
      },
    ];
  },
};

export default nextConfig;
