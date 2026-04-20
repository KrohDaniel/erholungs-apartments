import { SITE_CONFIG, APARTMENTS } from '@/lib/constants';

// =============================================================================
// Schema.org Structured Data Component
// =============================================================================

type SchemaType =
  | 'LodgingBusiness'
  | 'Apartment'
  | 'BlogPosting'
  | 'LocalBusiness'
  | 'WebSite'
  | 'Organization';

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
// Helpers
// =============================================================================

/** Format phone for Schema: strip leading 0, remove spaces */
function formatPhoneInternational() {
  return `+49${SITE_CONFIG.phone.replace(/^0/, '').replace(/\s/g, '')}`;
}

// =============================================================================
// Schema Generators
// =============================================================================

function generateLodgingBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `https://${SITE_CONFIG.domain}/#lodging`,
    name: SITE_CONFIG.name,
    alternateName: [
      'Ferienwohnung Bad Lippspringe - Erholungsapartment - Erholungskellerchen',
      'Ferienwohnung Bad Lippspringe',
      'Erholungsapartment Bad Lippspringe',
      'Erholungskellerchen Bad Lippspringe',
    ],
    description:
      'Gemütliche Ferienwohnungen in Bad Lippspringe nahe der Westfalen Therme. ' +
      'Ideal für Erholung, Kur und Wellness am Teutoburger Wald.',
    url: `https://${SITE_CONFIG.domain}`,
    telephone: formatPhoneInternational(),
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
    paymentAccepted: 'Cash, Bank Transfer, Credit Card, PayPal',
    checkinTime: '14:00',
    checkoutTime: '11:00',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: [
      { '@type': 'City', name: 'Bad Lippspringe' },
      { '@type': 'City', name: 'Paderborn' },
      { '@type': 'AdministrativeArea', name: 'Kreis Paderborn' },
      { '@type': 'AdministrativeArea', name: 'Nordrhein-Westfalen' },
    ],
    knowsLanguage: ['de', 'en'],
    sameAs: [
      `https://www.google.com/maps/search/Erholungs+Apartments+Bad+Lippspringe`,
      `https://www.booking.com/hotel/de/erholungs-apartment.de.html`,
      `https://www.booking.com/hotel/de/erholungskellerche.de.html`,
    ],
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
      { '@type': 'LocationFeatureSpecification', name: 'Balkon', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Nichtraucher', value: true },
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
    '@id': `https://${SITE_CONFIG.domain}/${apartment.slug}/#apartment`,
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
    alternateName: [
      'Ferienwohnung Bad Lippspringe - Erholungsapartment - Erholungskellerchen',
      'Ferienwohnung Bad Lippspringe',
    ],
    description:
      'Gemütliche Ferienwohnungen in Bad Lippspringe nahe der Westfalen Therme.',
    url: `https://${SITE_CONFIG.domain}`,
    telephone: formatPhoneInternational(),
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
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      `https://www.google.com/maps/search/Erholungs+Apartments+Bad+Lippspringe`,
      `https://www.booking.com/hotel/de/erholungs-apartment.de.html`,
      `https://www.booking.com/hotel/de/erholungskellerche.de.html`,
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12',
      bestRating: '5',
      worstRating: '1',
    },
    areaServed: [
      { '@type': 'City', name: 'Bad Lippspringe' },
      { '@type': 'City', name: 'Paderborn' },
      { '@type': 'AdministrativeArea', name: 'Kreis Paderborn' },
    ],
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

function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `https://${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: 'Ferienwohnung Bad Lippspringe',
    url: `https://${SITE_CONFIG.domain}`,
    logo: {
      '@type': 'ImageObject',
      url: `https://${SITE_CONFIG.domain}/images/general/logo-gross.png`,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: formatPhoneInternational(),
      contactType: 'reservations',
      availableLanguage: ['German', 'English'],
      areaServed: 'DE',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.city,
      postalCode: SITE_CONFIG.zip,
      addressCountry: 'DE',
      addressRegion: 'Nordrhein-Westfalen',
    },
    sameAs: [
      'https://www.google.com/maps/search/Erholungs+Apartments+Bad+Lippspringe',
    ],
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
case 'BlogPosting':
      schema = generateBlogPostingSchema(blogPost);
      break;
    case 'LocalBusiness':
      schema = generateLocalBusinessSchema();
      break;
    case 'WebSite':
      schema = generateWebSiteSchema();
      break;
    case 'Organization':
      schema = generateOrganizationSchema();
      break;
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/<\/script>/gi, '<\\/script>') }}
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
    itemListElement: items.map((item, index) => {
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };
      // Per Google docs: last item (current page) should not include the URL
      if (index < items.length - 1) {
        entry.item = `${baseUrl}${item.href}`;
      }
      return entry;
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/<\/script>/gi, '<\\/script>') }}
    />
  );
}
