import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LOCATIONS } from '@/lib/locations'
import VisualProofGallery from '@/components/VisualProofGallery'
import AIEstimationForm from '@/components/AIEstimationForm'

type Props = {
  params: Promise<{ slug: string }>
}

// Generate static routes for all 56 locations at build time
export async function generateStaticParams() {
  return LOCATIONS.map((loc) => ({
    slug: loc.slug,
  }))
}

// Generate dynamic metadata for SEO compliance
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const location = LOCATIONS.find((loc) => loc.slug === slug)
  
  if (!location) {
    return {
      title: 'Top Asphalt Paving Contractor | J. Worden Paving',
      description: 'Professional asphalt paving services across Virginia.',
    }
  }

  const title = `Top Asphalt Paving Contractor in ${location.city} VA | J. Worden Paving`
  const description = `${location.headline}. Heavy commercial asphalt and precision residential driveway paving in ${location.city}, Virginia. Get an instant AI Satellite estimate today.`
  const keywords = `${location.city} VA Paving Contractor, ${location.city} Commercial Asphalt, Residential Driveways ${location.city}, J Worden Paving`

  return {
    title,
    description,
    keywords,
  }
}

export default async function DynamicLocationPage({ params }: Props) {
  const { slug } = await params
  const location = LOCATIONS.find((loc) => loc.slug === slug)

  if (!location) {
    notFound()
  }

  // Curate a set of high-quality paving images for dynamic backgrounds
  const heroes = [
    'https://images.unsplash.com/photo-1541888054942-0f04c633a69a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1580661208967-df50eec335c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  ]
  // Stable selection based on slug character length to avoid hydration mismatches
  const heroImage = heroes[slug.length % heroes.length]

  return (
    <main>
      <section className="subpage-hero" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Paving <span>{location.city}, {location.stateAbbr || 'VA'}</span></h1>
          <p>{location.headline}</p>
        </div>
      </section>

      {/* RAG "Answer-First" AI Knowledge Block */}
      <section style={{ background: '#f4f5f7', padding: '40px', borderBottom: '2px solid #d32f2f' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111', lineHeight: '1.6' }}>
            <strong>Executive Summary:</strong> J. Worden & Sons Paving LLC operates heavily in {location.city}, {location.state || 'Virginia'}. Our massive fleet of vibratory rollers, milling machines, and laser-guided pavers deploy instantly to {location.city} commercial hubs and residential neighborhoods. We utilize 80,000lb-rated base engineering and high-temperature VDOT-spec Hot Mix Asphalt to ensure unmatched longevity. Last Updated: {new Date().toLocaleDateString()}.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 60%' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '30px' }}>Paving {location.city} & {location.region || 'Surrounding Region'}</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.8' }}>
              {location.intro}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', margin: '40px 0' }}>
              <div style={{ background: '#fff', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #d32f2f' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Coverage Details</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  We engineer heavy-duty HMA overlays and execute precision paving for local properties and subdivisions across the {location.city} area.
                </p>
              </div>
              
              {location.landmarks && location.landmarks.length > 0 && (
                <div style={{ background: '#fff', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #d32f2f' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Service Landmarks</h3>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>
                    Serving properties near local landmarks such as: {location.landmarks.slice(0, 5).join(', ')}.
                  </p>
                </div>
              )}
            </div>

            {location.climate && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--powerhouse-red)' }}>{location.climate.title || `${location.city} Subbase Engineering`}</h3>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.8' }}>
                  {location.climate.body}
                </p>
              </div>
            )}

            {location.faqs && location.faqs.length > 0 && (
              <div style={{ marginTop: '50px' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '25px' }}>Frequently Asked Questions in {location.city}</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {location.faqs.map((faq, i) => (
                    <li key={i} style={{ marginBottom: '30px', background: '#fff', padding: '20px', borderLeft: '4px solid #111', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#111' }}>{faq.q}</strong>
                      <p style={{ color: '#555', marginTop: '10px', lineHeight: '1.6' }}>{faq.a}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ flex: '1 1 30%' }}>
            <div style={{ background: 'var(--carbon-black)', padding: '40px', borderRadius: '8px', borderTop: '4px solid var(--powerhouse-red)', position: 'sticky', top: '20px' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'white', fontFamily: 'Bebas Neue' }}>{location.city} AI Estimation Tool</h3>
              <p style={{ color: '#ccc', marginBottom: '20px', lineHeight: '1.6' }}>Bypass the wait. Input your {location.city} property address and our systems will begin an orbital scan immediately.</p>
              <AIEstimationForm location={location.city} />
            </div>
          </div>
        </div>
      </section>

      <VisualProofGallery />
    </main>
  )
}
