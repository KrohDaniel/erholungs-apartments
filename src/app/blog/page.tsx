import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import {
  ChevronRight,
  Calendar,
  ArrowRight,
  BookOpen,
  Tag,
  CalendarCheck,
} from 'lucide-react';

// =============================================================================
// Blog Listing Page - SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Blog & Reisetipps | Erholungs Apartments Bad Lippspringe',
  description:
    'Reisetipps, Ausflugsziele und Neuigkeiten aus Bad Lippspringe. ' +
    'Entdecken Sie Wanderwege, Wellness-Tipps und alles rund um Ihren ' +
    'Erholungsurlaub im Teutoburger Wald.',
  keywords: [
    'Bad Lippspringe Blog',
    'Reisetipps Teutoburger Wald',
    'Ausflugsziele Bad Lippspringe',
    'Wellness Tipps',
    'Wandern Bad Lippspringe',
  ],
  openGraph: {
    title: 'Blog | Erholungs Apartments Bad Lippspringe',
    description:
      'Reisetipps, Ausflugsziele und Neuigkeiten aus Bad Lippspringe.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/blog/',
  },
};

// =============================================================================
// Blog Post Data
// =============================================================================

export interface BlogPostPreview {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
}

export const blogPosts: BlogPostPreview[] = [
  {
    slug: 'die-besten-wanderwege-rund-um-bad-lippspringe',
    title: 'Die 5 besten Wanderwege rund um Bad Lippspringe',
    excerpt:
      'Von kurzen Kurwald-Spaziergängen bis zur Tagestour zu den Externsteinen: Entdecken Sie die schönsten Wanderrouten im Teutoburger Wald mit Schwierigkeitsgraden und Insider-Tipps.',
    date: '2025-03-15',
    category: 'Ausflugsziele',
    image: '/images/blog/wanderwege-waldweg.jpg',
  },
  {
    slug: 'westfalen-therme-tipps-fuer-ihren-besuch',
    title: 'Westfalen Therme: Der komplette Guide für Ihren Besuch',
    excerpt:
      'Alles über die Westfalen Therme: Saunalandschaft, Solebecken, Preise, Öffnungszeiten und unsere 7 Insider-Tipps für den perfekten Thermentag – nur 500 m von unseren Apartments.',
    date: '2025-02-20',
    category: 'Wellness',
    image: '/images/blog/therme-indoor-pool.jpg',
  },
  {
    slug: 'wellness-wochenende-in-bad-lippspringe-planen',
    title: 'Wellness-Wochenende in Bad Lippspringe: 3 perfekte Tage planen',
    excerpt:
      'Der ultimative Guide: Freitag ankommen, Samstag Therme und Massage genießen, Sonntag Natur erleben. Mit konkretem Zeitplan und Preisübersicht ab 280 € für 2 Personen.',
    date: '2025-01-10',
    category: 'Wellness',
    image: '/images/blog/wellness-spa-kerzen.jpg',
  },
  {
    slug: 'bad-lippspringe-im-fruehling-gartenschau-und-mehr',
    title: 'Bad Lippspringe im Frühling: Gartenschau, Kurwald und Ausflugstipps',
    excerpt:
      'Tulpen, Narzissen und frisches Waldgrün: Warum der Frühling die schönste Jahreszeit für Bad Lippspringe ist. Mit Ausflugstipps und Übernachtungsideen.',
    date: '2024-12-05',
    category: 'Saisonale Tipps',
    image: '/images/blog/fruehling-tulpen-park.jpg',
  },
];

// =============================================================================
// Helper
// =============================================================================

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// =============================================================================
// Blog Listing Page
// =============================================================================

export default function BlogPage() {
  const posts = blogPosts;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Startseite', href: '/' },
          { name: 'Blog', href: '/blog/' },
        ]}
      />
      {/* ------------------------------------------------------------------ */}
      {/* Breadcrumb                                                         */}
      {/* ------------------------------------------------------------------ */}
      <nav aria-label="Breadcrumb" className="bg-secondary">
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
            <li className="font-medium text-text">Blog</li>
          </ol>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-gradient-to-b from-secondary to-background py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
            Unser Blog
          </h1>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-accent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-light leading-relaxed">
            Reisetipps, Ausflugsziele und Neuigkeiten aus Bad Lippspringe
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Blog Posts Grid                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-md text-center py-16">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-muted/40" />
              <h2 className="text-xl font-semibold text-text">
                Noch keine Beiträge
              </h2>
              <p className="mt-2 text-text-muted">
                Hier werden bald spannende Beiträge rund um Bad Lippspringe
                erscheinen. Schauen Sie bald wieder vorbei!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  className="group flex flex-col rounded-2xl border border-border-light bg-white shadow-sm transition-all duration-[var(--transition-base)] hover:shadow-lg hover:-translate-y-1 hover:border-border overflow-hidden"
                >
                  {/* Post image */}
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-secondary to-background">
                    {post.image && (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={80}
                      />
                    )}
                    {/* Category tag */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary">
                        <Tag className="h-3 w-3" />
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Date */}
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-text-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>

                    {/* Title */}
                    <h2 className="mb-2 text-lg font-bold text-text leading-snug group-hover:text-primary transition-colors duration-[var(--transition-fast)]">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mb-4 flex-1 text-sm text-text-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Read more */}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-[var(--transition-base)]">
                      Weiterlesen
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 text-center sm:p-12 lg:p-16">
            {/* Decorative elements */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/10" />

            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Buchen Sie Ihre Erholungszeit
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 leading-relaxed">
                Erleben Sie Bad Lippspringe hautnah. Buchen Sie jetzt Ihre
                Ferienwohnung und starten Sie in Ihren Erholungsurlaub.
              </p>
              <Link
                href="/buchen/"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-[var(--transition-base)] hover:bg-accent-light hover:shadow-xl active:scale-[0.98]"
              >
                <CalendarCheck className="h-4 w-4" />
                Jetzt buchen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
