import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Same env var as sitemap.ts, and it must stay that way: robots.txt is how a
  // crawler is told where the sitemap lives, so if these two disagree the
  // crawler is pointed at a sitemap on a different host than the pages it just
  // crawled — and a cross-host sitemap reference is ignored outright.
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jwordenasphaltpaving.com'
  ).replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
