import type { MetadataRoute } from 'next';

// =============================================================================
// Dynamic Sitemap Generation
// =============================================================================

const BASE_URL = 'https://erholungs-apartments.de';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ---------------------------------------------------------------------------
  // Static Pages
  // ---------------------------------------------------------------------------

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/erholungs-kellerchen/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/erholungs-apartment/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/buchen/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/wohlbefinden-massage/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bad-lippspringe/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bad-lippspringe/westfalen-therme/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/bad-lippspringe/kurwald/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/bad-lippspringe/externsteine/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/bad-lippspringe/gartenschau/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/bewertungen/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/kontakt/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/impressum/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/datenschutzerklaerung/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ---------------------------------------------------------------------------
  // Blog Pages
  // ---------------------------------------------------------------------------

  const blogSlugs = [
    'die-besten-wanderwege-rund-um-bad-lippspringe',
    'westfalen-therme-tipps-fuer-ihren-besuch',
    'wellness-wochenende-in-bad-lippspringe-planen',
    'bad-lippspringe-im-fruehling-gartenschau-und-mehr',
  ];

  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...blogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...blogPages];
}
