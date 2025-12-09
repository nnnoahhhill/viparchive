/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    deviceSizes: [300, 640],
    imageSizes: [300, 16, 32, 48],
  },
  output: "standalone",
};

module.exports = nextConfig;

