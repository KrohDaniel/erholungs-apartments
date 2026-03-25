import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  CalendarCheck,
  Waves,
  TreePine,
  Mountain,
  Flower2,
  CheckCircle2,
} from 'lucide-react';

// =============================================================================
// Attraction Data
// =============================================================================

interface AttractionFeature {
  text: string;
}

interface AttractionData {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  distance: string;
  distanceDetail: string;
  icon: typeof Waves;
  heroColor: string;
  iconBg: string;
  iconColor: string;
  intro: string;
  paragraphs: string[];
  features: AttractionFeature[];
  tip: string | null;
  image: string;
}

const attractionData: Record<string, AttractionData> = {
  'westfalen-therme': {
    slug: 'westfalen-therme',
    name: 'Westfalen Therme',
    metaTitle:
      'Westfalen Therme Bad Lippspringe | Nur 500m von unseren Apartments',
    metaDescription:
      'Die Westfalen Therme in Bad Lippspringe bietet Wasserwelt, Saunalandschaft und Sole-Becken. ' +
      'Nur 500m (5-7 Gehminuten) von den Erholungs Apartments entfernt.',
    distance: '500m',
    distanceDetail: '500m entfernt (5-7 Gehminuten)',
    icon: Waves,
    heroColor: 'from-blue-900 to-cyan-900',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    intro:
      'Die Westfalen Therme in Bad Lippspringe ist eine der beliebtesten Thermen in Ostwestfalen-Lippe.',
    paragraphs: [
      'Auf einer großzügigen Fläche bietet die Therme eine vielfältige Wasserwelt mit ' +
        'Innen- und Außenbecken, einer weitläufigen Saunalandschaft sowie wohltuenden ' +
        'Sole-Becken. Ob Entspannung im warmen Thermalwasser, Schwitzen in einer der ' +
        'zahlreichen Saunen oder Erholung im gepflegten Außenbereich - die Westfalen ' +
        'Therme bietet für jeden Geschmack das passende Wellness-Erlebnis.',
      'Besonders beliebt sind die regelmäßigen Aufguss-Zeremonien in der Saunalandschaft ' +
        'sowie die verschiedenen Solebecken, die mit ihrem hohen Salzgehalt besonders ' +
        'wohltuend für Haut und Atemwege sind. Der Außenbereich lädt bei schönem Wetter ' +
        'zum Verweilen und Sonnenbaden ein.',
      'Von unseren Erholungs Apartments erreichen Sie die Westfalen Therme in nur ' +
        '5 bis 7 Gehminuten. So können Sie Ihren Wellness-Tag ganz entspannt zu Fuß ' +
        'beginnen und ausklingen lassen.',
    ],
    features: [
      { text: 'Wasserwelt mit Innen- und Außenbecken' },
      { text: 'Großzügige Saunalandschaft' },
      { text: 'Wohltuende Sole-Becken' },
      { text: 'Gepflegter Außenbereich' },
      { text: 'Regelmäßige Aufguss-Zeremonien' },
      { text: 'Gastronomie vor Ort' },
    ],
    tip: 'Aktuelle Öffnungszeiten und Eintrittspreise finden Sie auf westfalentherme.de',
    image: '/images/umgebung/westfalen-therme.jpg',
  },

  kurwald: {
    slug: 'kurwald',
    name: 'Kurwald',
    metaTitle:
      'Kurwald Bad Lippspringe | Heilklimatischer Wald nur 300m entfernt',
    metaDescription:
      'Der zertifizierte Kurwald Bad Lippspringe bietet Heilklima, Waldwanderwege und ' +
      'Naturerlebnis. Nur 300m von den Erholungs Apartments entfernt.',
    distance: '300m',
    distanceDetail: '300m entfernt (3-5 Gehminuten)',
    icon: TreePine,
    heroColor: 'from-emerald-900 to-green-900',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    intro:
      'Der zertifizierte Kurwald Bad Lippspringe lädt zum Durchatmen ein.',
    paragraphs: [
      'Als einer der wenigen zertifizierten Heilwälder Deutschlands bietet der Kurwald ' +
        'Bad Lippspringe ein einzigartiges Mikroklima, das nachweislich positive Effekte ' +
        'auf die Gesundheit hat. Die besonders reine und allergenarme Waldluft wirkt ' +
        'heilsam bei Atemwegserkrankungen und fördert das allgemeine Wohlbefinden.',
      'Auf zahlreichen gut ausgebauten Wanderwegen können Sie den Wald in Ihrem eigenen ' +
        'Tempo erkunden. Ruhebänke und Naturerlebnisstationen laden zum Verweilen ein. ' +
        'Die spezielle Beschilderung der Terrainkurwege ermöglicht es Ihnen, Ihre ' +
        'Wanderung nach Kondition und Gesundheitszustand anzupassen.',
      'Der Kurwald beginnt nur wenige Gehminuten von unseren Apartments entfernt. ' +
        'Genießen Sie das Heilklima direkt vor der Haustür - ob für einen kurzen ' +
        'Morgenspaziergang oder eine ausgedehnte Wanderung durch den Teutoburger Wald.',
    ],
    features: [
      { text: 'Zertifizierter Heilwald' },
      { text: 'Heilklimatische Waldluft' },
      { text: 'Zahlreiche Wanderwege' },
      { text: 'Terrainkurwege verschiedener Schwierigkeitsgrade' },
      { text: 'Kneippanlagen im Wald' },
      { text: 'Naturerlebnisstationen' },
    ],
    tip: null,
    image: '/images/umgebung/kurwald.jpg',
  },

  externsteine: {
    slug: 'externsteine',
    name: 'Externsteine',
    metaTitle:
      'Externsteine | Naturdenkmal im Teutoburger Wald - 12km entfernt',
    metaDescription:
      'Die Externsteine sind eine markante Sandstein-Felsformation im Teutoburger Wald. ' +
      'Nur 12km von den Erholungs Apartments in Bad Lippspringe entfernt.',
    distance: '12km',
    distanceDetail: '12km entfernt (ca. 15 Minuten mit dem Auto)',
    icon: Mountain,
    heroColor: 'from-amber-900 to-orange-900',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    intro:
      'Die Externsteine sind eine markante Sandstein-Felsformation im Teutoburger Wald.',
    paragraphs: [
      'Die bis zu 40 Meter hohen Felsen gehören zu den bekanntesten Natur- und ' +
        'Kulturdenkmälern Deutschlands. Ihre einzigartige Gestalt und die zahlreichen ' +
        'mittelalterlichen Bearbeitungsspuren machen sie zu einem faszinierenden ' +
        'Ausflugsziel für Geschichts- und Naturliebhaber gleichermaßen.',
      'Die Felsen können über Treppen und Brücken bestiegen werden und bieten von ' +
        'oben einen atemberaubenden Blick über den Teutoburger Wald. Am Fuße der ' +
        'Externsteine erstreckt sich ein idyllischer See, der zum Verweilen einlädt. ' +
        'Ein Informationszentrum vor Ort vermittelt Wissenswertes über die ' +
        'kulturhistorische Bedeutung der Felsformation.',
      'Von unseren Erholungs Apartments erreichen Sie die Externsteine in nur ' +
        'etwa 15 Minuten mit dem Auto. Die Fahrt durch die malerische Landschaft ' +
        'des Teutoburger Waldes ist bereits ein Erlebnis für sich.',
    ],
    features: [
      { text: 'Begehbare Felsformation' },
      { text: 'Kulturhistorische Bedeutung' },
      { text: 'Naturdenkmal' },
      { text: 'Idyllischer See am Fuße der Felsen' },
      { text: 'Informationszentrum' },
      { text: 'Wanderwege in der Umgebung' },
    ],
    tip: null,
    image: '/images/umgebung/externsteine.jpg',
  },

  gartenschau: {
    slug: 'gartenschau',
    name: 'Gartenschau',
    metaTitle:
      'Gartenschau Bad Lippspringe | Ehemalige Landesgartenschau 2017',
    metaDescription:
      'Das Gelände der ehemaligen Landesgartenschau 2017 in Bad Lippspringe bietet ' +
      'wunderschöne Parks, Gärten und Spielplätze für die ganze Familie.',
    distance: 'In der Nähe',
    distanceDetail: 'In der Nähe (wenige Gehminuten)',
    icon: Flower2,
    heroColor: 'from-pink-900 to-rose-900',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    intro:
      'Das Gelände der ehemaligen Landesgartenschau 2017 ist weiterhin einen Besuch wert.',
    paragraphs: [
      'Die Landesgartenschau 2017 hat in Bad Lippspringe ein bleibendes Erbe ' +
        'hinterlassen: Wunderschön gestaltete Parkanlagen, Themengärten und ' +
        'Erholungsflächen laden das ganze Jahr über zum Spazieren und Genießen ein. ' +
        'Die liebevoll gepflegten Gärten zeigen eine beeindruckende Vielfalt an ' +
        'Pflanzen und Gestaltungsideen.',
      'Familien mit Kindern finden auf dem Gelände großzügige Spielplätze und ' +
        'Erlebnisbereiche. Die weitläufigen Grünflächen laden zum Picknicken und ' +
        'Verweilen ein. Regelmäßige Veranstaltungen und saisonale Highlights machen ' +
        'das Gartenschau-Gelände zu einem lebendigen Treffpunkt für Einheimische ' +
        'und Gäste.',
      'Das Gelände ist von unseren Apartments aus bequem zu Fuß erreichbar und ' +
        'bietet eine wunderbare Möglichkeit, die grüne Seite Bad Lippspringes ' +
        'zu entdecken.',
    ],
    features: [
      { text: 'Wunderschöne Parkanlagen' },
      { text: 'Liebevoll gestaltete Themengärten' },
      { text: 'Großzügige Spielplätze' },
      { text: 'Erlebnisbereiche für Kinder' },
      { text: 'Weitläufige Grünflächen' },
      { text: 'Regelmäßige Veranstaltungen' },
    ],
    tip: null,
    image: '/images/umgebung/gartenschau.jpg',
  },
};

// =============================================================================
// Static Params for SSG
// =============================================================================

export function generateStaticParams() {
  return [
    { slug: 'westfalen-therme' },
    { slug: 'kurwald' },
    { slug: 'externsteine' },
    { slug: 'gartenschau' },
  ];
}

// =============================================================================
// Dynamic Metadata
// =============================================================================

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const attraction = attractionData[slug];

  if (!attraction) {
    return {
      title: 'Seite nicht gefunden',
    };
  }

  return {
    title: attraction.metaTitle,
    description: attraction.metaDescription,
    openGraph: {
      title: attraction.metaTitle,
      description: attraction.metaDescription,
      type: 'website',
      locale: 'de_DE',
      siteName: 'Erholungs Apartments',
    },
    alternates: {
      canonical: `/bad-lippspringe/${attraction.slug}/`,
    },
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function AttractionDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const attraction = attractionData[slug];

  if (!attraction) {
    notFound();
  }

  const IconComponent = attraction.icon;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Breadcrumb                                                         */}
      {/* ------------------------------------------------------------------ */}
      <nav
        aria-label="Breadcrumb"
        className="bg-[#F5EFE6]/60 border-b border-[#E5E2DC]"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[#7A7A7A]">
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
            <li>
              <Link
                href="/bad-lippspringe/"
                className="transition-colors hover:text-[#2D5016]"
              >
                Bad Lippspringe
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-[#2D5016]">{attraction.name}</li>
          </ol>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${attraction.heroColor} py-16 sm:py-24 lg:py-28`}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 h-60 w-60 rounded-full bg-white" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#C9A84C]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <IconComponent className="h-8 w-8 text-white" />
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {attraction.name}
            </h1>

            {/* Distance badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-[#C9A84C]" />
              <span className="text-sm font-medium text-white">
                {attraction.distanceDetail}
              </span>
            </div>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
              {attraction.intro}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Content Section                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#FAFAF7] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Attraction image */}
              <div className="mb-10 overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white shadow-sm">
                <div className="relative aspect-video">
                  <Image
                    src={attraction.image}
                    alt={attraction.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 600px"
                    quality={85}
                  />
                </div>
              </div>

              {/* Paragraphs */}
              <div className="space-y-6">
                {attraction.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg leading-relaxed text-[#4A4A4A]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Opening hours tip */}
              {attraction.tip && (
                <div className="mt-8 rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/10 p-6">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A84C]" />
                    <p className="text-[#4A4A4A]">
                      <span className="font-semibold text-[#1A1A1A]">
                        Hinweis:{' '}
                      </span>
                      {attraction.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Features card */}
              <div className="sticky top-8 space-y-6">
                <div className="overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white shadow-sm">
                  <div className="border-b border-[#F0EDE7] bg-[#FAFAF7] px-6 py-4">
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                      Highlights
                    </h2>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {attraction.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2D5016]" />
                          <span className="text-[#4A4A4A]">
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Distance info card */}
                <div className="overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white shadow-sm">
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D5016]/10">
                        <MapPin className="h-5 w-5 text-[#2D5016]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A1A]">
                          Entfernung
                        </p>
                        <p className="text-sm text-[#7A7A7A]">
                          {attraction.distanceDetail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA card */}
                <div className="overflow-hidden rounded-2xl border border-[#2D5016]/20 bg-gradient-to-br from-[#2D5016] to-[#3D6B1E] shadow-lg">
                  <div className="p-6 text-center">
                    <h3 className="mb-2 text-lg font-bold text-white">
                      Übernachten Sie bei uns
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-white/80">
                      Gemütliche Ferienwohnungen in unmittelbarer Nähe
                    </p>
                    <Link
                      href="/buchen/"
                      className="group inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#D4B85E] hover:shadow-lg active:scale-[0.98]"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Jetzt buchen
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Back Link                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-[#E5E2DC] bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/bad-lippspringe/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#2D5016] transition-colors hover:text-[#3D6B1E]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Zurück zur Übersicht
          </Link>
        </div>
      </section>
    </>
  );
}
