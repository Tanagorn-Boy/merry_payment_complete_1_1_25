/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // ใช้ @svgr/webpack สำหรับแปลง .svg เป็น React component
    });
    return config;
  },
};

export default nextConfig;
