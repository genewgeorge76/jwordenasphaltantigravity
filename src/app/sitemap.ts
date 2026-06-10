import { MetadataRoute } from 'next'
import { getSortedInsightsData } from '@/lib/insights'
import { LOCATIONS } from '@/lib/locations'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jwordenasphaltpaving.com'

  // Main Services
  const services = [
    '',
    '/commercial-paving',
    '/residential-driveways',
    '/asphalt-milling',
    '/sealcoating-maintenance',
    '/insights',
  ]

  // Local SEO Pages: Dynamic locations from locations.js + static neighborhood/zip routes
  const additionalRoutes = [
    '/23221',
    '/the-fan-district',
    '/museum-district',
    '/windsor-farms',
    '/stratford-hills',
    '/west-end-richmond',
    '/church-hill',
    '/scotts-addition',
  ]
  const dynamicLocationRoutes = LOCATIONS.map((loc) => `/${loc.slug}`)
  const locations = Array.from(new Set([...dynamicLocationRoutes, ...additionalRoutes]))

  const serviceUrls = services.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const locationUrls = locations.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic Insight/Blog Pages
  const insights = getSortedInsightsData()
  const insightUrls = insights.map((insight) => ({
    url: `${baseUrl}/insights/${insight.slug}`,
    lastModified: new Date(insight.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...serviceUrls, ...locationUrls, ...insightUrls]
}
