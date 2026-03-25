import { SITE_CONFIG, APARTMENTS, FAQ_ITEMS } from '@/lib/constants';

// =============================================================================
// Schema.org Structured Data Component
// =============================================================================

type SchemaType =
  | 'LodgingBusiness'
  | 'Apartment'
  | 'FAQPage'
  | 'BlogPosting'
  | 'LocalBusiness'
  | 'WebSite';

interface SchemaMarkupProps {
  type: SchemaType;
  /** Required for Apartment schema - pass the apartment slug */
  apartmentSlug?: string;
  /** Required for BlogPosting schema */
  blogPost?: {
    title: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
  };
}

// =============================================================================
// Schema Generators
// =============================================================================

function generateLodgingBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: SITE_CONFIG.name,
    description:
      'Gemütliche Ferienwohnungen in Bad Lippspringe nahe der Westfalen Therme. ' +
      'Ideal für Erholung, Kur und Wellness am Teutoburger Wald.',
    url: `https://${SITE_CONFIG.domain}`,
    telephone: `+49${SITE_CONFIG.phone}`,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.city,
      postalCode: SITE_CONFIG.zip,
      addressCountry: 'DE',
      addressRegion: 'Nordrhein-Westfalen',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.7833,
      longitude: 8.8167,
    },
    image: `https://${SITE_CONFIG.domain}/images/hero/20180406_182210.jpg`,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Bank Transfer',
    checkinTime: '14:00',
    checkoutTime: '11:00',
    starRating: {
      '@type': 'Rating',
      ratingValue: '4.9',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12',
      bestRating: '5',
      worstRating: '1',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Kostenloses WLAN', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Kostenlose Parkplätze', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Voll ausgestattete Küche', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bettwäsche und Handtücher', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Massage-Service', value: true },
    ],
    numberOfRooms: APARTMENTS.length,
    hasMap: `https://www.google.com/maps?q=${SITE_CONFIG.address},+${SITE_CONFIG.zip}+${SITE_CONFIG.city}`,
  };
}

function generateApartmentSchema(apartmentSlug?: string) {
  const apartment = APARTMENTS.find((a) => a.slug === apartmentSlug);

  if (!apartment) {
    return generateLodgingBusinessSchema();
  }

  const minPrice = Math.min(
    ...Object.values(apartment.prices.weekday),
    ...Object.values(apartment.prices.weekend)
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: apartment.name,
    description: apartment.description,
    url: `https://${SITE_CONFIG.domain}/${apartment.slug}/`,
    image: apartment.images.map(
      (img) => `https://${SITE_CONFIG.domain}${img.src}`
    ),
    numberOfRooms: 1,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: apartment.sqm,
      unitCode: 'MTK',
    },
    occupancy: {
      '@type': 'QuantitativeValue',
      value: apartment.maxGuests,
      unitText: 'Personen',
    },
    bed: {
      '@type': 'BedDetails',
      typeOfBed: apartment.bedType,
      numberOfBeds: 1,
    },
    floorLevel: apartment.floor,
    amenityFeature: apartment.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    containedInPlace: {
      '@type': 'LodgingBusiness',
      name: SITE_CONFIG.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.address,
        addressLocality: SITE_CONFIG.city,
        postalCode: SITE_CONFIG.zip,
        addressCountry: 'DE',
      },
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: minPrice,
      priceValidUntil: new Date(
        new Date().getFullYear() + 1,
        11,
        31
      ).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
    },
  };
}

function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function generateBlogPostingSchema(blogPost?: SchemaMarkupProps['blogPost']) {
  if (!blogPost) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogPost.title,
    description: blogPost.description,
    datePublished: blogPost.datePublished,
    dateModified: blogPost.dateModified || blogPost.datePublished,
    image: blogPost.image
      ? `https://${SITE_CONFIG.domain}${blogPost.image}`
      : `https://${SITE_CONFIG.domain}/images/hero/20180406_182210.jpg`,
    url: `https://${SITE_CONFIG.domain}${blogPost.url}`,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: `https://${SITE_CONFIG.domain}`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: `https://${SITE_CONFIG.domain}`,
      logo: {
        '@type': 'ImageObject',
        url: `https://${SITE_CONFIG.domain}/images/general/logo-gross.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://${SITE_CONFIG.domain}${blogPost.url}`,
    },
  };
}

function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://${SITE_CONFIG.domain}/#business`,
    name: SITE_CONFIG.name,
    description:
      'Gemütliche Ferienwohnungen in Bad Lippspringe nahe der Westfalen Therme.',
    url: `https://${SITE_CONFIG.domain}`,
    telephone: `+49${SITE_CONFIG.phone}`,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.city,
      postalCode: SITE_CONFIG.zip,
      addressCountry: 'DE',
      addressRegion: 'Nordrhein-Westfalen',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.7833,
      longitude: 8.8167,
    },
    image: `https://${SITE_CONFIG.domain}/images/hero/20180406_182210.jpg`,
    priceRange: '€€',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12',
      bestRating: '5',
      worstRating: '1',
    },
    areaServed: {
      '@type': 'City',
      name: 'Bad Lippspringe',
    },
  };
}

function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `https://${SITE_CONFIG.domain}/#website`,
    name: SITE_CONFIG.name,
    url: `https://${SITE_CONFIG.domain}`,
    description:
      'Gemütliche Ferienwohnungen in Bad Lippspringe nahe der Westfalen Therme. ' +
      'Erholungs Kellerchen & Erholungs Apartment.',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: `https://${SITE_CONFIG.domain}`,
    },
    inLanguage: 'de-DE',
  };
}

// =============================================================================
// Component
// =============================================================================

export default function SchemaMarkup({
  type,
  apartmentSlug,
  blogPost,
}: SchemaMarkupProps) {
  let schema: object | null = null;

  switch (type) {
    case 'LodgingBusiness':
      schema = generateLodgingBusinessSchema();
      break;
    case 'Apartment':
      schema = generateApartmentSchema(apartmentSlug);
      break;
    case 'FAQPage':
      schema = generateFAQSchema();
      break;
    case 'BlogPosting':
      schema = generateBlogPostingSchema(blogPost);
      break;
    case 'LocalBusiness':
      schema = generateLocalBusinessSchema();
      break;
    case 'WebSite':
      schema = generateWebSiteSchema();
      break;
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export { SchemaMarkup };
export type { SchemaMarkupProps, SchemaType };

// =============================================================================
// BreadcrumbList Schema Component
// =============================================================================

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = `https://${SITE_CONFIG.domain}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
