import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Star, ExternalLink, Quote } from 'lucide-react';
import SchemaMarkup, { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

// =============================================================================
// Bewertungen Page - SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Gästebewertungen | Erholungs Apartments Bad Lippspringe',
  description:
    'Lesen Sie, was unsere Gäste über die Erholungs Apartments in Bad Lippspringe sagen. ' +
    '9.1/10 auf Booking.com, 4.91/5 auf Airbnb. Sauber, gemütlich, perfekte Lage zur Westfalen Therme.',
  keywords: [
    'Bewertungen Ferienwohnung Bad Lippspringe',
    'Erholungs Apartments Erfahrungen',
    'Gästebewertungen',
    'Ferienwohnung Bewertung',
  ],
  openGraph: {
    title: 'Gästebewertungen | Erholungs Apartments Bad Lippspringe',
    description:
      'Was unsere Gäste sagen: 4.9 Sterne Durchschnitt. Sauber, gemütlich, perfekte Lage.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/bewertungen/',
  },
};

// =============================================================================
// Data
// =============================================================================

type ReviewSource = 'Google' | 'Airbnb' | 'Booking.com';

interface Review {
  id: number;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  source: ReviewSource;
  apartment?: string;
}

const reviews: Review[] = [
  // --- Booking.com Reviews ---
  {
    id: 1,
    name: 'Petra S.',
    rating: 5,
    text: 'Gepflegt und sauber, tolle Matratze, gemütliche Einrichtung und gut ausgestattete Küche. Sehr nette Gastgeber!',
    date: 'Januar 2025',
    source: 'Booking.com',
    apartment: 'Erholungs Apartment',
  },
  {
    id: 2,
    name: 'Jürgen W.',
    rating: 5,
    text: 'Die Ferienwohnung war sauber und gemütlich eingerichtet. Bequemes Bett, geräumiges Bad und ein toller Balkon bei gutem Wetter.',
    date: 'Dezember 2024',
    source: 'Booking.com',
    apartment: 'Erholungs Apartment',
  },
  {
    id: 3,
    name: 'Claudia B.',
    rating: 5,
    text: 'Ruhige Wohnlage, ca. 10 Minuten zur Therme. Ideal für ein Wellness-Wochenende. Alles was man braucht ist da.',
    date: 'November 2024',
    source: 'Booking.com',
    apartment: 'Erholungs Apartment',
  },
  {
    id: 4,
    name: 'Martin H.',
    rating: 5,
    text: 'Einfach perfekt! Liebevoll gestaltete Wohnung mit allem was man braucht. Tolle Gegend zum Radfahren.',
    date: 'Oktober 2024',
    source: 'Booking.com',
    apartment: 'Erholungs Kellerchen',
  },
  // --- Airbnb Reviews ---
  {
    id: 5,
    name: 'Sabine M.',
    rating: 5,
    text: 'Super Preis-Leistung, ruhige Lage, alles da was man braucht. Kommen auf jeden Fall wieder!',
    date: 'November 2024',
    source: 'Airbnb',
    apartment: 'Erholungs Kellerchen',
  },
  {
    id: 6,
    name: 'Lisa W.',
    rating: 5,
    text: 'Perfekt für unseren Kururlaub. Alles fußläufig erreichbar. Die Westfalen Therme ist nur wenige Minuten entfernt.',
    date: 'September 2024',
    source: 'Airbnb',
    apartment: 'Erholungs Apartment',
  },
  {
    id: 7,
    name: 'Olga K.',
    rating: 5,
    text: 'Sehr gemütliches Kellerchen, liebevoll eingerichtet. Die Küche hat alles was man braucht. Natalja ist eine super Gastgeberin!',
    date: 'August 2024',
    source: 'Airbnb',
    apartment: 'Erholungs Kellerchen',
  },
  {
    id: 8,
    name: 'Andreas F.',
    rating: 5,
    text: 'Wir waren zum dritten Mal hier und es ist jedes Mal wie nach Hause kommen. Die Massage vor Ort ist das absolute Highlight!',
    date: 'Juli 2024',
    source: 'Airbnb',
    apartment: 'Erholungs Apartment',
  },
  // --- Google Reviews ---
  {
    id: 9,
    name: 'Maria K.',
    rating: 5,
    text: 'Wunderbare kleine Wohnung, sehr sauber und gemütlich. Die Lage zur Therme ist perfekt!',
    date: 'Januar 2025',
    source: 'Google',
    apartment: 'Erholungs Kellerchen',
  },
  {
    id: 10,
    name: 'Thomas R.',
    rating: 5,
    text: 'Toll ausgestattetes Apartment, netter Gastgeber. Der Balkon ist herrlich. Kommen gerne wieder!',
    date: 'Dezember 2024',
    source: 'Google',
    apartment: 'Erholungs Apartment',
  },
  {
    id: 11,
    name: 'Frank D.',
    rating: 5,
    text: 'Die Massage im Haus war das absolute Highlight unseres Aufenthalts! Unbedingt buchen!',
    date: 'Oktober 2024',
    source: 'Google',
    apartment: 'Erholungs Apartment',
  },
  {
    id: 12,
    name: 'Hans M.',
    rating: 4,
    text: 'Gemütliche Unterkunft, guter Preis. Einziger Wunsch: etwas mehr Tageslicht im Kellerchen.',
    date: 'August 2024',
    source: 'Google',
    apartment: 'Erholungs Kellerchen',
  },
];

const totalReviews = reviews.length;
const averageRating = (
  reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
).toFixed(1);

// =============================================================================
// Subcomponents
// =============================================================================

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating
              ? 'fill-accent text-accent'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: ReviewSource }) {
  const styles: Record<ReviewSource, string> = {
    'Google': 'bg-blue-50 text-blue-600',
    'Airbnb': 'bg-rose-50 text-rose-600',
    'Booking.com': 'bg-indigo-50 text-indigo-600',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${styles[source]}`}
    >
      {source}
    </span>
  );
}

// =============================================================================
// Bewertungen Page
// =============================================================================

export default function BewertungenPage() {
  return (
    <>
      <SchemaMarkup type="LodgingBusiness" />
      <BreadcrumbSchema items={[
        { name: 'Startseite', href: '/' },
        { name: 'Gästebewertungen', href: '/bewertungen/' },
      ]} />

      {/* Breadcrumb */}
      <nav className="bg-secondary" aria-label="Breadcrumb">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-1.5 text-sm text-text-muted">
            <li>
              <Link href="/" className="hover:text-primary transition-colors duration-[var(--transition-fast)]">
                Startseite
              </Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="font-medium text-text">Bewertungen</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
            Was unsere G&auml;ste sagen
          </h1>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-accent" />

          {/* Overall rating */}
          <div className="mt-8 inline-flex flex-col items-center rounded-2xl border border-border-light bg-white px-10 py-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold text-text">{averageRating}</span>
              <div className="flex flex-col items-start">
                <StarRating rating={Math.round(Number(averageRating))} size="lg" />
                <p className="mt-1 text-sm text-text-muted">
                  Basierend auf {totalReviews} Bewertungen
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                Booking.com &middot; 9.1/10
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                Airbnb &middot; 4.91/5
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col rounded-2xl border border-border-light bg-white p-6 shadow-sm transition-all duration-[var(--transition-base)] hover:shadow-md sm:p-8"
              >
                {/* Quote icon */}
                <Quote className="mb-3 h-7 w-7 text-accent/25" />

                {/* Rating */}
                <StarRating rating={review.rating} />

                {/* Text */}
                <p className="mt-4 flex-1 text-text-light leading-relaxed">
                  &bdquo;{review.text}&ldquo;
                </p>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-border-light pt-4">
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {review.name}
                    </p>
                    <p className="text-xs text-text-muted">{review.date}</p>
                  </div>
                  <SourceBadge source={review.source} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews CTA */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 text-center sm:p-12 lg:p-16">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/10" />

            <div className="relative">
              <div className="mx-auto mb-4 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-8 w-8 fill-accent text-accent"
                  />
                ))}
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Waren Sie schon bei uns?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 leading-relaxed">
                Wir freuen uns &uuml;ber Ihre Bewertung! Teilen Sie Ihre
                Erfahrung mit anderen G&auml;sten und helfen Sie uns, noch besser
                zu werden.
              </p>
              <a
                href="https://www.google.com/maps/search/Erholungs+Apartments+Bad+Lippspringe"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-all duration-[var(--transition-base)] hover:bg-secondary hover:shadow-xl"
              >
                Bewerten Sie uns auf Google
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
