import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Phone,
  ExternalLink,
  Clock,
  Sparkles,
  MessageCircle,
  Search,
  HandHeart,
  ClipboardList,
  HeartPulse,
  ArrowRight,
  Star,
  Quote,
  CheckCircle,
  CalendarCheck,
} from 'lucide-react';
import SchemaMarkup, { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

// =============================================================================
// Wohlbefinden Massage Page - SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Wohlbefinden Massage im Haus | Erholungs Apartments Bad Lippspringe',
  description:
    'Professionelle Massage-Behandlungen direkt in den Erholungs Apartments Bad Lippspringe. ' +
    'Wohlfühlen, Verspannungsfrei & Schmerzlösung. Erstgespräch kostenlos. Jetzt Termin vereinbaren!',
  keywords: [
    'Massage Bad Lippspringe',
    'Wohlbefinden Massage',
    'Massage Ferienwohnung',
    'Verspannungen lösen',
    'Schmerztherapie Massage',
    'Andreas Kroh Massage',
  ],
  openGraph: {
    title: 'Wohlbefinden Massage in Bad Lippspringe | Direkt im Haus',
    description:
      'Professionelle Massage-Behandlungen direkt in den Erholungs Apartments. Ab 75€. Erstgespräch kostenlos.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/wohlbefinden-massage',
  },
};

// =============================================================================
// Data
// =============================================================================

const packages = [
  {
    name: 'Wohlfühlen',
    duration: '60 Min.',
    price: '75€',
    description: 'Tiefenentspannung für Körper und Geist',
    icon: Sparkles,
    highlight: false,
  },
  {
    name: 'Verspannungsfrei',
    duration: '90–95 Min.',
    price: '95€',
    description: 'Gezielte Behandlung von Verspannungen und Schmerzen',
    icon: HandHeart,
    highlight: true,
  },
  {
    name: 'Schmerzlösung',
    duration: '120–130 Min.',
    price: '130€',
    description: 'Intensive Ganzkörperbehandlung für nachhaltige Schmerzlinderung',
    icon: HeartPulse,
    highlight: false,
  },
];

const processSteps = [
  {
    step: 1,
    title: 'Erstgespräch',
    description: 'Wir besprechen Ihre Beschwerden und Wünsche',
    icon: MessageCircle,
  },
  {
    step: 2,
    title: 'Analyse',
    description: 'Individuelle Beurteilung Ihres Körpers',
    icon: Search,
  },
  {
    step: 3,
    title: 'Behandlung',
    description: 'Maßgeschneiderte Massage-Behandlung',
    icon: HandHeart,
  },
  {
    step: 4,
    title: 'Nachbesprechung',
    description: 'Empfehlungen für Ihren Alltag',
    icon: ClipboardList,
  },
  {
    step: 5,
    title: 'Begleitung',
    description: 'Langfristige Unterstützung Ihres Wohlbefindens',
    icon: HeartPulse,
  },
];

const testimonials = [
  {
    name: 'Anna',
    text: 'Nach nur einer Sitzung fühlte ich mich wie neugeboren. Die Verspannungen in meinem Nacken waren endlich gelöst. Absolute Empfehlung!',
    rating: 5,
  },
  {
    name: 'Kathrin',
    text: 'Andreas nimmt sich wirklich Zeit und geht auf individuelle Beschwerden ein. Die Massage war professionell und unglaublich wohltuend.',
    rating: 5,
  },
  {
    name: 'Sandra',
    text: 'Ich komme regelmäßig zur Schmerzlösung-Massage. Meine chronischen Rückenschmerzen sind deutlich besser geworden. Vielen Dank!',
    rating: 5,
  },
  {
    name: 'Dorothea',
    text: 'Eine wunderbare Erfahrung. Die ruhige Atmosphäre und die fachkundige Behandlung haben mich restlos überzeugt.',
    rating: 5,
  },
];

// =============================================================================
// Wohlbefinden Massage Page
// =============================================================================

export default function WohlbefindenMassagePage() {
  return (
    <>
      <SchemaMarkup type="LocalBusiness" />
      <BreadcrumbSchema items={[
        { name: 'Startseite', href: '/' },
        { name: 'Wohlbefinden Massage', href: '/wohlbefinden-massage' },
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
            <li className="font-medium text-text">Wohlbefinden Massage</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-[#E8F0E0] py-16 sm:py-20 lg:py-28">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/5" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-5 inline-block rounded-full bg-accent/10 px-5 py-2 text-xs font-semibold tracking-wide text-accent uppercase">
            Direkt im Haus
          </span>
          <h1 className="text-4xl font-bold text-text sm:text-5xl lg:text-6xl">
            Wohlbefinden Massage
          </h1>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-accent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-light leading-relaxed sm:text-xl">
            Professionelle Massage-Behandlungen direkt in unserem Haus &ndash;
            ohne Anfahrt, ohne Stress.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/massage/andreas_kroh.jpg"
                alt="Andreas Kroh – Massagetherapeut in Bad Lippspringe"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text sm:text-3xl">
                Ihr Wohlbefinden liegt uns am Herzen
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-accent" />
              <p className="mt-6 text-lg text-text-light leading-relaxed">
                Andreas Kroh bietet professionelle Massage-Behandlungen direkt
                im gleichen Haus wie die Erholungs Apartments an. Ob
                Tiefenentspannung, gezielte Behandlung von Verspannungen oder
                intensive Schmerztherapie &ndash; mit langj&auml;hriger
                Erfahrung und individueller Betreuung sorgt er daf&uuml;r, dass
                Sie sich rundum wohlf&uuml;hlen. Kombinieren Sie Ihren
                Aufenthalt in Bad Lippspringe mit einer professionellen Massage
                und erleben Sie Erholung auf ganzer Linie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Praxis Gallery */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-text sm:text-3xl">
              Einblicke in unsere Praxis
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
            <p className="mx-auto mt-4 max-w-2xl text-text-muted">
              Eine ruhige, einladende Atmosph&auml;re &ndash; direkt im Haus der
              Erholungs Apartments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              { src: '/images/massage/praxisraum-1.jpg', alt: 'Behandlungsraum mit Massageliege' },
              { src: '/images/massage/praxisraum-2.jpg', alt: 'Behandlungsraum mit warmem Licht' },
              { src: '/images/massage/massage-praxis.jpg', alt: 'Wirbels&auml;ulen-Behandlung' },
              { src: '/images/massage/fussreflexzonen-detail.jpg', alt: 'Fussreflexzonen-Massage Detail' },
            ].map((img) => (
              <div
                key={img.src}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-sm"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-secondary py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-text sm:text-3xl">
              Unsere Massage-Pakete
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {packages.map((pkg) => {
              const IconComponent = pkg.icon;
              return (
                <div
                  key={pkg.name}
                  className={`relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all duration-[var(--transition-base)] hover:shadow-lg hover:-translate-y-1 ${
                    pkg.highlight
                      ? 'border-accent ring-2 ring-accent/20'
                      : 'border-border-light'
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-accent px-4 py-1.5 text-xs font-semibold text-white">
                      Beliebt
                    </div>
                  )}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text">{pkg.name}</h3>
                  <p className="mt-2 text-text-muted leading-relaxed">
                    {pkg.description}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-border-light pt-4">
                    <span className="text-3xl font-bold text-primary">
                      {pkg.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Free consultation note */}
          <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <CheckCircle className="h-6 w-6 shrink-0 text-accent" />
            <p className="text-lg font-medium text-text">
              Erstgespr&auml;ch kostenlos &ndash; Wir beraten Sie gerne unverbindlich!
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-text sm:text-3xl">
              Was Sie erwartet
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
            <p className="mx-auto mt-4 max-w-2xl text-text-muted">
              Unser bew&auml;hrter 5-Schritte-Prozess f&uuml;r Ihr Wohlbefinden
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

            <div className="grid gap-8 lg:gap-0">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={step.step}
                    className={`relative flex flex-col items-center gap-4 lg:flex-row lg:gap-0 ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:text-left'}`}>
                      <div
                        className={`inline-block rounded-2xl border border-border-light bg-white p-6 shadow-sm transition-all duration-[var(--transition-base)] hover:shadow-md ${
                          isEven ? 'lg:ml-auto' : ''
                        }`}
                      >
                        <h3 className="text-lg font-bold text-text">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-text-muted">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Center circle */}
                    <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow-md">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>

                    {/* Spacer */}
                    <div className="hidden flex-1 lg:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-text sm:text-3xl">
              Das sagen unsere Kunden
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-border-light bg-white p-6 shadow-sm sm:p-8"
              >
                <Quote className="mb-4 h-8 w-8 text-accent/30" />
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'fill-accent text-accent'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-text-light leading-relaxed">
                  &bdquo;{testimonial.text}&ldquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-text">
                  &ndash; {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-20 lg:py-24">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <CalendarCheck className="mx-auto mb-5 h-12 w-12 text-accent" />
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Termin vereinbaren
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 leading-relaxed">
            Rufen Sie uns an oder besuchen Sie unsere Website f&uuml;r weitere
            Informationen und Terminbuchung.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:01771666353"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-all duration-[var(--transition-base)] hover:bg-secondary hover:shadow-xl"
            >
              <Phone className="h-5 w-5" />
              0177 1666353
            </a>
            <a
              href="https://wohlbefinden-massage.de"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all duration-[var(--transition-base)] hover:border-white hover:bg-white/10"
            >
              wohlbefinden-massage.de
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Cross-Selling */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border-light bg-white p-8 text-center shadow-sm sm:p-12">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-accent" />
            <h2 className="text-2xl font-bold text-text sm:text-3xl">
              Erholung &amp; Massage kombinieren
            </h2>
            <p className="mt-4 text-lg text-text-light leading-relaxed">
              Kombinieren Sie Ihren Aufenthalt in unseren gem&uuml;tlichen
              Ferienwohnungen mit einer professionellen Massage &ndash; f&uuml;r
              das ultimative Erholungserlebnis in Bad Lippspringe.
            </p>
            <Link
              href="/buchen/"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-[var(--transition-base)] hover:bg-primary-light hover:shadow-lg"
            >
              Jetzt Apartment buchen
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
