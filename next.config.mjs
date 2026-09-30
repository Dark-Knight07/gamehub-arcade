/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        // Offline editions always save as files instead of opening in the tab
        source: "/downloads/:file*",
        headers: [{ key: "Content-Disposition", value: "attachment" }],
      },
    ];
  },
};

export default nextConfig;
