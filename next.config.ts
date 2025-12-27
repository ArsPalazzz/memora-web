import withPWAInit from "@ducanh2912/next-pwa";

const isProd = process.env.NODE_ENV === "production";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: !isProd,
});

const nextConfig = {
  async rewrites() {
    //if (process.env.NODE_ENV === "development") {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/:path*`,
      },
    ];
    // }
    // return [];
  },
  env: {
    CUSTOM_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },
};

export default withPWA(nextConfig);
