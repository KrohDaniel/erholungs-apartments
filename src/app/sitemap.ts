import type { MetadataRoute } from 'next';

// =============================================================================
// Dynamic Sitemap Generation
// =============================================================================

const BASE_URL = 'https://erholungs-apartments.de';

export default function sitemap(): MetadataRoute.Sitemap {
  // ---------------------------------------------------------------------------
  // Static Pages (lastModified = date of last meaningful content change)
  // ---------------------------------------------------------------------------

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: '2025-03-15',
    },
    {
      url: `${BASE_URL}/erholungs-kellerchen/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/erholungs-apartment/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/buchen/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/wohlbefinden-massage/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bad-lippspringe/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bad-lippspringe/westfalen-therme/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bad-lippspringe/kurwald/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bad-lippspringe/externsteine/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bad-lippspringe/gartenschau/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bad-lippspringe/dedingerheide-see/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bad-lippspringe/wanderwege/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/bewertungen/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/kontakt/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/impressum/`,
      lastModified: '2025-01-20',
    },
    {
      url: `${BASE_URL}/datenschutzerklaerung/`,
      lastModified: '2025-01-20',
    },
  ];

  // ---------------------------------------------------------------------------
  // Blog Pages (lastModified = publication date of each post)
  // ---------------------------------------------------------------------------

  const blogPosts: { slug: string; date: string }[] = [
    { slug: 'die-besten-wanderwege-rund-um-bad-lippspringe', date: '2025-03-15' },
    { slug: 'westfalen-therme-tipps-fuer-ihren-besuch', date: '2025-02-20' },
    { slug: 'wellness-wochenende-in-bad-lippspringe-planen', date: '2025-01-10' },
    { slug: 'bad-lippspringe-im-fruehling-gartenschau-und-mehr', date: '2024-12-05' },
  ];

  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog/`,
      lastModified: '2025-03-15',
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}/`,
      lastModified: post.date,
    })),
  ];

  return [...staticPages, ...blogPages];
}
