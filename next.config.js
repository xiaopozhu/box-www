/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:9000/api/:path*",
      },
    ];
  },

  // 环境变量配置
  env: {
    API_HOST:
      process.env.NODE_ENV === "production" ? "https://api.deepzz.com" : "",
  },
};

module.exports = nextConfig;
