import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // The apex domain (no www) is attached to this project but was serving
      // entirely different content than the real business site at
      // www.jwordenasphaltpaving.com — same title/content mismatch as two
      // competing pages for the same core keywords, undermining Google's
      // ability to pick a canonical version. A canonical <link> tag alone is
      // advisory and unreliable when content genuinely differs; this is a
      // real 308 (permanent, SEO-equivalent to 301) redirect that consolidates
      // all link equity onto the one real site. Scoped to the apex host only,
      // so *.vercel.app preview URLs are untouched for testing.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jwordenasphaltpaving.com' }],
        destination: 'https://www.jwordenasphaltpaving.com/:path*',
        permanent: true,
      },
      {
        source: '/locations/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
