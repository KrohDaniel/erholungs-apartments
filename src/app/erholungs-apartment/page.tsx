import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  MapPin,
  Sparkles,
  Phone,
  Bed,
  Users,
  Building,
  Sun,
} from 'lucide-react';
import { getApartmentBySlug, SITE_CONFIG } from '@/lib/constants';
import ImageGallery from '@/components/apartment/ImageGallery';
import AmenityList from '@/components/apartment/AmenityList';
import PriceTable from '@/components/apartment/PriceTable';
import BookingCTA from '@/components/apartment/BookingCTA';
import SchemaMarkup, { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

// =============================================================================
// Metadata
// =============================================================================

const apartment = getApartmentBySlug('erholungs-apartment')!;

export const metadata: Metadata = {
  title: 'Erholungs Apartment | Ferienwohnung Bad Lippspringe 2 Personen',
  description:
    'Geräumige Ferienwohnung in der ersten Etage in Bad Lippspringe für bis zu 2 Personen und 1 Kind. ' +
    'Mit Balkon, Küche, Bad und kostenlosem Parkplatz. Nahe Westfalen Therme. Ab 70 Euro/Nacht.',
  keywords: [
    'Erholungs Apartment',
    'Ferienwohnung Bad Lippspringe',
    'Ferienwohnung 2 Personen',
    'Ferienwohnung erste Etage',
    'Westfalen Therme Unterkunft',
    'Familie Ferienwohnung NRW',
    'Balkon Ferienwohnung',
  ],
  openGraph: {
    title: 'Erholungs Apartment | Ferienwohnung Bad Lippspringe 2 Personen',
    description:
      'Geräumige Ferienwohnung in der ersten Etage für bis zu 2 Personen + 1 Kind mit Balkon. Nahe Westfalen Therme. Ab 70 Euro/Nacht.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/erholungs-apartment/',
  },
};

// =============================================================================
// Page Component
// =============================================================================

export default function ErholungsApartmentPage() {
  const minPrice = 70;

  return (
    <>
      <SchemaMarkup type="Apartment" apartmentSlug="erholungs-apartment" />
      <BreadcrumbSchema items={[
        { name: 'Startseite', href: '/' },
        { name: 'Erholungs Apartment', href: '/erholungs-apartment/' },
      ]} />

      {/* -------------------------------------------------------------------
          Breadcrumb
          ------------------------------------------------------------------- */}
      <nav
        aria-label="Brotkrumen-Navigation"
        className="bg-secondary/50 border-b border-border-light"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-sm text-text-muted">
            <li>
              <Link
                href="/"
                className="hover:text-primary transition-colors"
              >
                Startseite
              </Link>
            </li>
            <li>
              <ChevronRight size={14} className="text-text-muted/50" />
            </li>
            <li>
              <Link
                href="/#apartments"
                className="hover:text-primary transition-colors"
              >
                Apartments
              </Link>
            </li>
            <li>
              <ChevronRight size={14} className="text-text-muted/50" />
            </li>
            <li className="text-text font-medium" aria-current="page">
              Erholungs Apartment
            </li>
          </ol>
        </div>
      </nav>

      {/* -------------------------------------------------------------------
          Image Gallery
          ------------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <ImageGallery
          images={apartment.images}
          apartmentName={apartment.name}
        />
      </section>

      {/* -------------------------------------------------------------------
          Main Content - Two Column Layout
          ------------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left column: Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & subtitle */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">
                {apartment.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-text-light">
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <Building size={15} className="text-primary" />
                  {apartment.floor}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <Users size={15} className="text-primary" />
                  bis {apartment.maxGuests} Personen
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <Sun size={15} className="text-primary" />
                  Balkon
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <Bed size={15} className="text-primary" />
                  {apartment.bedType}
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-border-light" />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-text mb-4">
                Über diese Unterkunft
              </h2>
              <p className="text-text-light leading-relaxed text-base">
                {apartment.description}
              </p>
            </div>

            {/* Divider */}
            <hr className="border-border-light" />

            {/* Amenities */}
            <AmenityList amenities={[apartment.bedType, ...apartment.amenities]} />

            {/* Divider */}
            <hr className="border-border-light" />

            {/* Prices */}
            <PriceTable apartmentSlug={apartment.slug} />

            {/* Divider */}
            <hr className="border-border-light" />

            {/* Massage cross-selling */}
            <div className="bg-accent/8 border border-accent/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15">
                  <Sparkles size={22} className="text-accent-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text mb-1">
                    Tipp: Wohlbefinden Massage &ndash; 10% Rabatt
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed mb-3">
                    Gönnen Sie sich eine wohltuende Massage direkt im selben Haus!
                    Von der Wohlfühl-Massage bis zur therapeutischen Schmerzbehandlung
                    &ndash; als Gast des Erholungs Apartments erhalten Sie <strong className="text-accent-dark">10% Rabatt</strong> auf alle Massage-Behandlungen.
                  </p>
                  <Link
                    href="/wohlbefinden-massage/"
                    className="
                      inline-flex items-center gap-1.5
                      text-sm font-semibold text-accent-dark
                      hover:text-primary transition-colors
                    "
                  >
                    Massage-Angebote ansehen
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-border-light" />

            {/* Location */}
            <section aria-labelledby="location-heading">
              <h2
                id="location-heading"
                className="text-2xl font-semibold text-text mb-4"
              >
                Lage &amp; Anreise
              </h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-text font-medium">
                    {SITE_CONFIG.address}
                  </p>
                  <p className="text-text-light text-sm">
                    {SITE_CONFIG.zip} {SITE_CONFIG.city}, {SITE_CONFIG.country}
                  </p>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="w-full overflow-hidden rounded-xl border border-border-light shadow-sm aspect-video sm:aspect-auto">
                <iframe
                  src="https://www.google.com/maps?q=Adolf-Kolping-Str.+11,+33175+Bad+Lippspringe,+Deutschland&output=embed&hl=de"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Standort Erholungs Apartment - Adolf-Kolping-Str. 11, 33175 Bad Lippspringe"
                  className="w-full h-full min-h-[200px]"
                />
              </div>

              <div className="mt-4 text-sm text-text-light space-y-1.5">
                <p>
                  <strong className="text-text">Westfalen Therme:</strong> ca. 500 m Fußweg
                </p>
                <p>
                  <strong className="text-text">Kurwald:</strong> ca. 300 m Fußweg
                </p>
                <p>
                  <strong className="text-text">Kostenlose Parkplätze</strong> direkt am Haus
                </p>
              </div>
            </section>

            {/* Contact section */}
            <section className="bg-secondary rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-text mb-2">
                Fragen? Wir helfen gern!
              </h3>
              <p className="text-text-light text-sm mb-4">
                Haben Sie Fragen zur Unterkunft oder möchten Sie individuell beraten werden?
                Kontaktieren Sie uns direkt.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:+49${SITE_CONFIG.phone.replace(/^0/, '').replace(/\s/g, '')}`}
                  className="
                    inline-flex items-center gap-2 px-4 py-2
                    bg-primary text-white text-sm font-medium rounded-lg
                    hover:bg-primary-light transition-colors shadow-sm
                  "
                >
                  <Phone size={16} />
                  {SITE_CONFIG.phone}
                </a>
                <Link
                  href="/kontakt/"
                  className="
                    inline-flex items-center gap-2 px-4 py-2
                    bg-white text-text text-sm font-medium rounded-lg
                    border border-border hover:bg-background transition-colors
                  "
                >
                  Kontaktformular
                  <ChevronRight size={14} />
                </Link>
              </div>
            </section>
          </div>

          {/* Right column: Booking CTA sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <BookingCTA
              apartmentSlug={apartment.slug}
              minPrice={minPrice}
            />
          </div>
        </div>
      </div>
    </>
  );
}
