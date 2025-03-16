/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:55001/:path*'
        }
      ]
    }
  };

export default nextConfig;
