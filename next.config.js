/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/box-api/:path*",
        destination: "http://localhost:9000/box-api/:path*",
      },
    ];
  },
  images: {
    domains: ["st.deepzz.com"],
  },
  // 环境变量配置
  env: {
    API_HOST:
      process.env.NODE_ENV === "production" ? "https://api.deepzz.com" : "",
  },
};

module.exports = nextConfig;
