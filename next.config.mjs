/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [{ source: "/feed", destination: "/rss.xml", permanent: true }];
  },
};

export default nextConfig;
