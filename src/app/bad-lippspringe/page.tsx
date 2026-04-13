import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Waves,
  TreePine,
  Mountain,
  Flower2,
  Fish,
  Footprints,
  MapPin,
  ArrowRight,
  ChevronRight,
  CalendarCheck,
} from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

// =============================================================================
// SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Bad Lippspringe Sehenswürdigkeiten | Ausflugsziele & Aktivitäten',
  description:
    'Entdecken Sie die schönsten Sehenswürdigkeiten und Ausflugsziele in Bad Lippspringe: ' +
    'Westfalen Therme, Kurwald, Externsteine, Gartenschau und mehr. Ideal für Ihren Erholungsurlaub.',
  keywords: [
    'Bad Lippspringe Sehenswürdigkeiten',
    'Ausflugsziele Bad Lippspringe',
    'Westfalen Therme',
    'Kurwald Bad Lippspringe',
    'Externsteine',
    'Teutoburger Wald',
    'Gartenschau Bad Lippspringe',
    'Aktivitäten Bad Lippspringe',
  ],
  openGraph: {
    title: 'Bad Lippspringe Sehenswürdigkeiten | Ausflugsziele & Aktivitäten',
    description:
      'Entdecken Sie die schönsten Sehenswürdigkeiten und Ausflugsziele in Bad Lippspringe.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/bad-lippspringe/',
  },
};

// =============================================================================
// Attraction Data
// =============================================================================

const attractions = [
  {
    slug: 'westfalen-therme',
    name: 'Westfalen Therme',
    distance: '500m',
    description:
      'Entspannen Sie in der beliebten Therme mit Wasserwelt und Saunalandschaft',
    icon: Waves,
    color: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    image: '/images/umgebung/westfalen-therme/thermenkuppel.jpg',
  },
  {
    slug: 'kurwald',
    name: 'Kurwald',
    distance: '300m',
    description:
      'Genießen Sie das Heilklima im zertifizierten Kurwald',
    icon: TreePine,
    color: 'from-emerald-50 to-green-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    image: '/images/umgebung/kurwald.jpg',
  },
  {
    slug: 'externsteine',
    name: 'Externsteine',
    distance: '12km',
    description:
      'Besuchen Sie das faszinierende Naturdenkmal',
    icon: Mountain,
    color: 'from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    image: '/images/umgebung/externsteine/externsteine-panorama.jpg',
  },
  {
    slug: 'gartenschau',
    name: 'Gartenschau',
    distance: null,
    description:
      'Ehemaliges Landesgartenschau-Gelände von 2017',
    icon: Flower2,
    color: 'from-pink-50 to-rose-50',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    image: '/images/umgebung/gartenschau/brunnen.jpg',
  },
  {
    slug: 'dedingerheide-see',
    name: 'Dedingerheide See',
    distance: '150m',
    description:
      'Idyllischer See direkt vor der Haustür – perfekt für Spaziergänge und Naturerlebnis',
    icon: Fish,
    color: 'from-sky-50 to-indigo-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    image: '/images/umgebung/dedinger-heidesee/panorama-see.jpg',
  },
  {
    slug: 'wanderwege',
    name: 'Wanderwege',
    distance: 'Ab Haustür',
    description:
      'Hermannsweg, Eggeweg, Planetenweg & Terrainkurwege im Teutoburger Wald',
    icon: Footprints,
    color: 'from-lime-50 to-emerald-50',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-700',
    image: '/images/umgebung/wandern/wanderer-felsen.jpg',
  },
];

// =============================================================================
// Page Component
// =============================================================================

export default function BadLippspringePage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Startseite', href: '/' },
        { name: 'Bad Lippspringe', href: '/bad-lippspringe/' },
      ]} />

      {/* ------------------------------------------------------------------ */}
      {/* Breadcrumb                                                         */}
      {/* ------------------------------------------------------------------ */}
      <nav
        aria-label="Breadcrumb"
        className="bg-[#F5EFE6]/60 border-b border-[#E5E2DC]"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-[#7A7A7A]">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-[#2D5016]"
              >
                Startseite
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-[#2D5016]">Bad Lippspringe</li>
          </ol>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-[#2D5016] py-20 sm:py-28 lg:py-32">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#C9A84C]" />
          <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-white" />
          <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-[#C9A84C]/50" />
        </div>

        {/* Subtle leaf pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(201,168,76,0.15),transparent_50%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium tracking-[0.3em] uppercase text-[#C9A84C]">
              Sehenswürdigkeiten & Ausflugsziele
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Erleben Sie{' '}
              <span className="italic font-normal">Bad Lippspringe</span>
            </h1>
            <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-[#C9A84C]" />
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
              Bad Lippspringe ist ein anerkannter Heilklimatischer Kurort am
              Rande des Teutoburger Waldes. Die einzigartige Kombination aus
              heilsamer Waldluft, Thermalquellen und einer malerischen
              Landschaft macht den Ort zu einem idealen Ziel für Erholung
              und Naturerlebnisse.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Intro Section                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#FAFAF7] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-[#2D5016]" />
              <span className="text-sm font-semibold uppercase tracking-widest text-[#2D5016]">
                Unsere Umgebung
              </span>
            </div>
            <p className="text-lg leading-relaxed text-[#4A4A4A]">
              Eingebettet in die grüne Landschaft Ostwestfalen-Lippes bietet
              Bad Lippspringe zahlreiche Möglichkeiten für Erholung, Wellness
              und Naturerlebnisse. Von unseren Erholungs Apartments aus
              erreichen Sie die wichtigsten Sehenswürdigkeiten bequem zu Fuß
              oder mit einer kurzen Autofahrt.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Attraction Cards Grid                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-3 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              Sehenswürdigkeiten & Ausflugsziele
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-[#C9A84C]" />
            <p className="mx-auto max-w-2xl text-[#7A7A7A]">
              Entdecken Sie die schönsten Orte rund um unsere Ferienwohnungen
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {attractions.map((attraction) => {
              const IconComponent = attraction.icon;
              const isLinked = attraction.slug !== null;

              const cardContent = (
                <div
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${attraction.color} border border-[#F0EDE7] shadow-sm transition-all duration-300 ${isLinked
                      ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'
                      : ''
                    }`}
                >
                  {/* Card image */}
                  {attraction.image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={attraction.image}
                        alt={attraction.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={80}
                      />
                      {attraction.distance && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-[#2D5016]">
                            <MapPin className="h-3 w-3" />
                            {attraction.distance}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card header */}
                  <div className="p-6 pb-4">
                    {!attraction.image && (
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${attraction.iconBg} transition-transform duration-300 ${isLinked ? 'group-hover:scale-110' : ''
                            }`}
                        >
                          <IconComponent
                            className={`h-7 w-7 ${attraction.iconColor}`}
                          />
                        </div>
                        {attraction.distance && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#2D5016]/10 px-3 py-1 text-xs font-semibold text-[#2D5016]">
                            <MapPin className="h-3 w-3" />
                            {attraction.distance}
                          </span>
                        )}
                      </div>
                    )}
                    <h3 className="mb-2 text-xl font-bold text-[#1A1A1A]">
                      {attraction.name}
                    </h3>
                    <p className="leading-relaxed text-[#4A4A4A]">
                      {attraction.description}
                    </p>
                  </div>

                  {/* Card footer with link indicator */}
                  {isLinked && (
                    <div className="border-t border-[#E5E2DC]/50 px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D5016] transition-colors group-hover:text-[#3D6B1E]">
                        Mehr erfahren
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  )}
                </div>
              );

              if (isLinked) {
                return (
                  <Link
                    key={attraction.name}
                    href={`/bad-lippspringe/${attraction.slug}/`}
                    className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5016] rounded-2xl"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div key={attraction.name}>{cardContent}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-[#F5EFE6] py-16 sm:py-20">
        {/* Decorative leaf circles */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#2D5016]/5" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#C9A84C]/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              Buchen Sie Ihre Ferienwohnung
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-[#4A4A4A]">
              Erleben Sie Bad Lippspringe von unseren gemütlichen
              Ferienwohnungen aus. Nur wenige Gehminuten zu den wichtigsten
              Sehenswürdigkeiten.
            </p>
            <Link
              href="/buchen/"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#2D5016] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#3D6B1E] hover:shadow-xl active:scale-[0.98]"
            >
              <CalendarCheck className="h-5 w-5" />
              Jetzt Verfügbarkeit prüfen
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
