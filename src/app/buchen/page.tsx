import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronRight } from 'lucide-react';
import SchemaMarkup, { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { BookingForm } from '@/components/booking/BookingForm';

// =============================================================================
// Buchen Page - SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Online Buchen | Ferienwohnung Bad Lippspringe ab 40€',
  description:
    'Buchen Sie Ihre Ferienwohnung in Bad Lippspringe direkt online. ' +
    'Erholungs Kellerchen oder Erholungs Apartment – einfach Datum wählen, ' +
    'Gäste angeben und sicher bezahlen. Nahe der Westfalen Therme.',
  keywords: [
    'Ferienwohnung buchen Bad Lippspringe',
    'Online Buchung Erholungs Apartments',
    'Apartment reservieren Bad Lippspringe',
    'Ferienwohnung Westfalen Therme buchen',
    'Unterkunft buchen Teutoburger Wald',
  ],
  openGraph: {
    title: 'Online Buchen | Erholungs Apartments Bad Lippspringe',
    description:
      'Buchen Sie Ihre Ferienwohnung in Bad Lippspringe direkt online. ' +
      'Einfach, sicher und schnell.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/buchen',
  },
};

// =============================================================================
// Buchen Page
// =============================================================================

export default function BuchenPage() {
  return (
    <>
      {/* Schema.org Structured Data */}
      <SchemaMarkup type="LodgingBusiness" />
      <BreadcrumbSchema items={[
        { name: 'Startseite', href: '/' },
        { name: 'Online Buchen', href: '/buchen' },
      ]} />

      {/* -----------------------------------------------------------------------
          Breadcrumb Navigation
          ----------------------------------------------------------------------- */}
      <nav className="bg-secondary" aria-label="Breadcrumb">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-1.5 text-sm text-text-muted">
            <li>
              <Link
                href="/"
                className="hover:text-primary transition-colors duration-[var(--transition-fast)]"
              >
                Startseite
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-text">Online Buchen</li>
          </ol>
        </div>
      </nav>

      {/* -----------------------------------------------------------------------
          Hero Section
          ----------------------------------------------------------------------- */}
      <section className="bg-gradient-to-b from-secondary to-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
            Online Buchen
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-light leading-relaxed">
            Buchen Sie Ihre Ferienwohnung in Bad Lippspringe in wenigen Schritten.
            Wählen Sie Ihr Wunsch-Apartment, Ihren Reisezeitraum und bezahlen Sie
            sicher online.
          </p>
        </div>
      </section>

      {/* -----------------------------------------------------------------------
          Buchungsformular
          ----------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              </div>
            }
          >
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
