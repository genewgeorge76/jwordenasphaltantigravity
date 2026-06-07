import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jwordenasphaltpaving.com'

  // Core Service Pages
  const services = [
    '',
    '/commercial-paving',
    '/residential-driveways',
    '/sealcoating-maintenance',
    '/asphalt-milling',
  ]

  // Local SEO Silo Pages
  const locations = [
    '/richmond-va',
    '/henrico-va',
    '/23221',
    '/chester-va',
    '/chesterfield-va',
    '/midlothian-va',
    '/new-kent-va',
    '/williamsburg-va',
    '/hanover-va',
    '/ashland-va',
    '/powhatan-va',
    '/goochland-va',
    '/hopewell-va',
    '/prince-george-va',
    '/fredericksburg-va',
    '/petersburg-va',
    '/mechanicsville-va',
    '/colonial-heights-va',
    '/the-fan-district',
    '/museum-district',
    '/windsor-farms',
    '/stratford-hills',
    '/west-end-richmond',
    '/church-hill',
    '/scotts-addition',
  ]

  const serviceUrls = services.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.9,
  }))

  const locationUrls = locations.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...serviceUrls, ...locationUrls]
}
