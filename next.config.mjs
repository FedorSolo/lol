import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "uuaxyywnuioitcjctvun.supabase.co" },
    ],
  },
  experimental: {
    // Default Server Action body limit is 1MB — far too small for client
    // training video uploads (/account/training). Vercel's own request
    // body limit on Hobby/Pro is ~4.5MB regardless of this setting, so
    // videos are capped there in practice; this just stops Next.js from
    // rejecting them earlier than that.
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default withNextIntl(nextConfig);
