import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'nyyfwmmlciaymmcwdxqg.supabase.co' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
    ],
  },
};

export default nextConfig;
