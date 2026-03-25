// =============================================================================
// Erholungs Apartments - Constants & Static Data
// =============================================================================

import type {
  Apartment,
  ColorScheme,
  FAQItem,
  MassagePackage,
  SEOConfig,
  SiteConfig,
  UmgebungHighlight,
} from '@/types';

// -----------------------------------------------------------------------------
// Site Configuration
// -----------------------------------------------------------------------------

export const SITE_CONFIG: SiteConfig = {
  name: 'Erholungs Apartments',
  domain: 'erholungs-apartments.de',
  address: 'Adolf-Kolping-Str. 11',
  city: 'Bad Lippspringe',
  zip: '33175',
  country: 'Deutschland',
  phone: '0177 1666353',
  email: 'info@erholungs-apartments.de',
  owner: 'Natalja Kroh',
};

// -----------------------------------------------------------------------------
// Color Scheme
// -----------------------------------------------------------------------------

export const COLORS: ColorScheme = {
  primary: '#2D5016',
  secondary: '#F5EFE6',
  accent: '#C9A84C',
  text: '#1A1A1A',
  background: '#FAFAF7',
};

// -----------------------------------------------------------------------------
// Apartments
// -----------------------------------------------------------------------------

export const APARTMENTS: Apartment[] = [
  {
    id: 'erholungs-kellerchen',
    slug: 'erholungs-kellerchen',
    name: 'Erholungs Kellerchen',
    description:
      'Unser gemütliches Kellerchen ist eine liebevoll renovierte Souterrain-Wohnung mit ca. 25 m². ' +
      'Das Apartment bietet ein komfortables Doppelbett, eine voll ausgestattete Küche und ein ' +
      'modern renoviertes Badezimmer. Die gemütliche Atmosphäre im Untergeschoss sorgt für ' +
      'erholsame Nächte und entspannte Aufenthalte. Ideal für Paare oder Alleinreisende, die ' +
      'Bad Lippspringe und die umliegende Natur erkunden möchten.',
    shortDescription:
      'Gemütliche Souterrain-Wohnung mit ca. 25 m², Doppelbett, Küche und renoviertem Bad.',
    sqm: 25,
    maxGuests: 2,
    images: [
      { src: '/images/kellerchen/booking/19.jpg', alt: 'Erholungs Kellerchen - Schlafzimmer mit Himmelbett und LED-Beleuchtung' },
      { src: '/images/kellerchen/booking/09.jpg', alt: 'Erholungs Kellerchen - Gesamtansicht mit Doppelbett und Sitzecke' },
      { src: '/images/kellerchen/booking/02.jpg', alt: 'Erholungs Kellerchen - Gemütliches Schlafzimmer mit Baldachin' },
      { src: '/images/kellerchen/booking/06.jpg', alt: 'Erholungs Kellerchen - Wohnbereich mit Essplatz' },
      { src: '/images/kellerchen/booking/12.jpg', alt: 'Erholungs Kellerchen - Bett mit Blick auf Essbereich und Küche' },
      { src: '/images/kellerchen/booking/05.jpg', alt: 'Erholungs Kellerchen - Essbereich mit Wandkunst' },
      { src: '/images/kellerchen/booking/04.jpg', alt: 'Erholungs Kellerchen - Küchenzeile' },
      { src: '/images/kellerchen/booking/08.jpg', alt: 'Erholungs Kellerchen - Küche mit Blick ins Schlafzimmer' },
      { src: '/images/kellerchen/booking/16.jpg', alt: 'Erholungs Kellerchen - Küchenregale mit Gewürzen' },
      { src: '/images/kellerchen/booking/07.jpg', alt: 'Erholungs Kellerchen - Badezimmer' },
      { src: '/images/kellerchen/booking/10.jpg', alt: 'Erholungs Kellerchen - Dusche und WC' },
      { src: '/images/kellerchen/booking/11.jpg', alt: 'Erholungs Kellerchen - Smart-TV mit Streaming' },
      { src: '/images/kellerchen/booking/03.jpg', alt: 'Erholungs Kellerchen - Flur mit Blick auf Bad und Schlafzimmer' },
      { src: '/images/kellerchen/booking/14.jpg', alt: 'Erholungs Kellerchen - Treppenhaus und Eingangsbereich' },
      { src: '/images/kellerchen/booking/18.jpg', alt: 'Erholungs Kellerchen - Eigener Eingang' },
      { src: '/images/kellerchen/booking/15.jpg', alt: 'Erholungs Kellerchen - Dekorative Details' },
      { src: '/images/kellerchen/booking/17.jpg', alt: 'Erholungs Kellerchen - Flamingo-Dekoration' },
    ],
    amenities: [
      'WLAN',
      'Kostenlose Parkplätze',
      'Küche',
      'Badezimmer',
      'Bettwäsche',
      'Handtücher',
      'Gemütliche Atmosphäre',
    ],
    prices: {
      weekday: { 1: 40, 2: 45 },
      weekend: { 1: 55, 2: 60 },
    },
    discounts: [
      { minNights: 7, percentage: 10 },
      { minNights: 30, percentage: 20 },
    ],
    minNights: 2,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    floor: 'Untergeschoss',
    bedType: 'Doppelbett',
  },
  {
    id: 'erholungs-apartment',
    slug: 'erholungs-apartment',
    name: 'Erholungs Apartment',
    description:
      'Das Erholungs Apartment befindet sich im Erdgeschoss und bietet Platz für bis zu 4 Gäste. ' +
      'Die Wohnung verfügt über ein gemütliches Doppelbett, eine voll ausgestattete Küche, ' +
      'ein modernes Badezimmer und einen eigenen Balkon. Die Erdgeschosslage sorgt für einen ' +
      'bequemen Zugang ohne Treppen. Perfekt für Familien, kleine Gruppen oder Paare, die ' +
      'einen erholsamen Aufenthalt in Bad Lippspringe genießen möchten.',
    shortDescription:
      'Geräumige Erdgeschosswohnung für bis zu 4 Gäste mit Balkon, Küche und Bad.',
    sqm: 50,
    maxGuests: 4,
    images: [
      { src: '/images/apartment/apartment-ferienwohnung.jpg', alt: 'Erholungs Apartment - Ferienwohnung' },
      { src: '/images/apartment/apartment-kueche.jpg', alt: 'Erholungs Apartment - Küche' },
      { src: '/images/apartment/apartment-sitzplatz.jpg', alt: 'Erholungs Apartment - Sitzplatz' },
      { src: '/images/apartment/apartment-wohnzimmer-spiegel.jpg', alt: 'Erholungs Apartment - Wohnzimmer' },
      { src: '/images/apartment/apartment-wc.jpg', alt: 'Erholungs Apartment - WC' },
      { src: '/images/apartment/apartment-deko.jpg', alt: 'Erholungs Apartment - Dekoration' },
      { src: '/images/apartment/apartment-eingang.jpg', alt: 'Erholungs Apartment - Eingang' },
      { src: '/images/apartment/apartment-sitzgelegenheit-draussen.jpg', alt: 'Erholungs Apartment - Sitzgelegenheit draussen' },
      { src: '/images/apartment/apartment-sitzgelegenheit-draussen-2.jpg', alt: 'Erholungs Apartment - Sitzgelegenheit draussen 2' },
      { src: '/images/apartment/20180913_174826.jpg', alt: 'Erholungs Apartment - Aussenbereich' },
      { src: '/images/apartment/20180913_174024.jpg', alt: 'Erholungs Apartment - Gartenansicht' },
      { src: '/images/apartment/20180913_173636.jpg', alt: 'Erholungs Apartment - Terrasse' },
      { src: '/images/apartment/20180913_171641.jpg', alt: 'Erholungs Apartment - Wohnbereich' },
      { src: '/images/apartment/20180913_171314.jpg', alt: 'Erholungs Apartment - Schlafbereich' },
      { src: '/images/apartment/20180907_185002.jpg', alt: 'Erholungs Apartment - Abendstimmung' },
      { src: '/images/apartment/20180124_230628.jpg', alt: 'Erholungs Apartment - Innenansicht' },
      { src: '/images/apartment/20180121_142758.jpg', alt: 'Erholungs Apartment - Detailansicht' },
      { src: '/images/apartment/20170911_133440.jpg', alt: 'Erholungs Apartment - Gesamtansicht' },
    ],
    amenities: [
      'WLAN',
      'Kostenlose Parkplätze',
      'Küche',
      'Badezimmer',
      'Bettwäsche',
      'Handtücher',
      'Balkon',
      'Erdgeschoss',
    ],
    prices: {
      weekday: { 1: 70, 2: 70, 3: 80, 4: 90 },
      weekend: { 1: 70, 2: 70, 3: 80, 4: 90 },
    },
    discounts: [
      { minNights: 7, percentage: 10 },
      { minNights: 30, percentage: 20 },
    ],
    minNights: 2,
    checkInTime: '17:00',
    checkOutTime: '11:00',
    floor: 'Erdgeschoss',
    bedType: 'Doppelbett',
  },
];

// -----------------------------------------------------------------------------
// Helper: find apartment by slug
// -----------------------------------------------------------------------------

export function getApartmentBySlug(slug: string): Apartment | undefined {
  return APARTMENTS.find((a) => a.slug === slug);
}

export function getApartmentById(id: string): Apartment | undefined {
  return APARTMENTS.find((a) => a.id === id);
}

// -----------------------------------------------------------------------------
// Massage Packages
// -----------------------------------------------------------------------------

export const MASSAGE_PACKAGES: MassagePackage[] = [
  {
    id: 'wohlfuehlen',
    name: 'Wohlfühlen',
    description:
      'Eine wohltuende Ganzkörpermassage zum Entspannen und Wohlfühlen. Ideal zum Abschalten nach einem aktiven Tag.',
    duration: '60 Min.',
    price: 75,
    priceLabel: '75 €',
  },
  {
    id: 'verspannungsfrei',
    name: 'Verspannungsfrei',
    description:
      'Gezielte Behandlung von Verspannungen und Muskelverhärtungen. Tiefenwirksame Techniken für nachhaltige Linderung.',
    duration: '90–95 Min.',
    price: 95,
    priceLabel: '95 €',
  },
  {
    id: 'schmerzloesung',
    name: 'Schmerzlösung',
    description:
      'Intensive therapeutische Massage zur Behandlung von chronischen Schmerzen und hartnäckigen Beschwerden.',
    duration: '120–130 Min.',
    price: 130,
    priceLabel: '130 €',
  },
  {
    id: 'erstgespraech',
    name: 'Erstgespräch',
    description:
      'Kostenloses Beratungsgespräch zur Analyse Ihrer Beschwerden und Empfehlung der passenden Behandlung.',
    duration: 'ca. 15 Min.',
    price: null,
    priceLabel: 'Kostenlos',
  },
];

// -----------------------------------------------------------------------------
// Umgebung (Surroundings) Highlights
// -----------------------------------------------------------------------------

export const UMGEBUNG_HIGHLIGHTS: UmgebungHighlight[] = [
  {
    id: 'westfalen-therme',
    name: 'Westfalen Therme',
    description:
      'Erlebnis- und Wellnessbad mit Thermalwasser, Saunalandschaft und Solebecken. Entspannung pur direkt um die Ecke.',
    distance: '500 m',
    link: 'https://www.westfalen-therme.de',
  },
  {
    id: 'kurwald',
    name: 'Kurwald Bad Lippspringe',
    description:
      'Heilklimatischer Kurwald mit zahlreichen Wanderwegen, Kneippanlagen und Ruhezonen inmitten der Natur.',
    distance: '300 m',
  },
  {
    id: 'externsteine',
    name: 'Externsteine',
    description:
      'Markante Sandsteinfelsen im Teutoburger Wald - eines der bekanntesten Natur- und Kulturdenkmäler Deutschlands.',
    distance: '12 km',
    link: 'https://www.externsteine.de',
  },
  {
    id: 'gartenschau',
    name: 'Landesgartenschau Bad Lippspringe',
    description:
      'Wunderschöne Parkanlage mit Themengärten, Spielplätzen und Veranstaltungen für die ganze Familie.',
    distance: 'In der Nähe',
  },
  {
    id: 'dedingerheide-see',
    name: 'Dedingerheide See',
    description:
      'Idyllischer See zum Spazierengehen und Erholen. Perfekt für einen entspannten Nachmittag in der Natur.',
    distance: 'In der Nähe',
  },
];

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Wie sind die Check-in und Check-out Zeiten?',
    answer:
      'Die Check-in Zeiten variieren je nach Apartment: Erholungs Kellerchen ab 14:00 Uhr, ' +
      'Erholungs Apartment ab 17:00 Uhr. Check-out ist bei beiden Apartments bis 11:00 Uhr. ' +
      'Sollten Sie eine frühere Anreise oder spätere Abreise wünschen, kontaktieren Sie uns bitte im Voraus.',
  },
  {
    question: 'Gibt es kostenlose Parkplätze?',
    answer:
      'Ja, kostenlose Parkplätze stehen direkt am Haus zur Verfügung. Eine vorherige Reservierung ist nicht notwendig.',
  },
  {
    question: 'Ist WLAN verfügbar?',
    answer:
      'Ja, in allen Apartments steht Ihnen kostenloses Highspeed-WLAN zur Verfügung. Die Zugangsdaten erhalten Sie bei der Anreise.',
  },
  {
    question: 'Sind Haustiere erlaubt?',
    answer:
      'Haustiere sind nach vorheriger Absprache willkommen. Bitte kontaktieren Sie uns vor der Buchung, ' +
      'damit wir die Details klären können. Es kann eine zusätzliche Reinigungsgebühr anfallen.',
  },
  {
    question: 'Wie ist die Stornierungspolitik?',
    answer:
      'Kostenlose Stornierung bis 7 Tage vor Anreise. Bei Stornierung innerhalb von 7 Tagen vor Anreise ' +
      'wird die erste Nacht berechnet. Bei Nichtanreise (No-Show) wird der gesamte Betrag fällig.',
  },
  {
    question: 'Wie weit ist die Westfalen Therme entfernt?',
    answer:
      'Die Westfalen Therme ist nur etwa 500 Meter entfernt und bequem zu Fuß erreichbar. ' +
      'Perfekt für einen entspannten Wellness-Tag!',
  },
  {
    question: 'Kann ich eine Massage buchen?',
    answer:
      'Ja! Wir bieten verschiedene Massage-Pakete an, vom Wohlfühl-Paket bis zur therapeutischen ' +
      'Schmerzbehandlung. Sie können eine Massage direkt bei der Buchung oder während Ihres Aufenthalts hinzubuchen. ' +
      'Das Erstgespräch ist kostenlos.',
  },
  {
    question: 'Wie viele Nächte muss ich mindestens buchen?',
    answer:
      'Der Mindestaufenthalt beträgt 2 Nächte. Bei längeren Aufenthalten profitieren Sie von unseren Rabatten: ' +
      '10 % ab 7 Nächten und 20 % ab 30 Nächten.',
  },
];

// -----------------------------------------------------------------------------
// SEO Defaults
// -----------------------------------------------------------------------------

export const SEO_CONFIG: SEOConfig = {
  titleTemplate: '%s | Erholungs Apartments Bad Lippspringe',
  defaultTitle: 'Erholungs Apartments - Ferienwohnungen in Bad Lippspringe',
  defaultDescription:
    'Gemütliche Ferienwohnungen in Bad Lippspringe nahe der Westfalen Therme. ' +
    'Erholungs Kellerchen & Erholungs Apartment - ideal für Ihren Erholungsurlaub im Teutoburger Wald.',
  siteUrl: 'https://erholungs-apartments.de',
  locale: 'de_DE',
  ogImage: '/images/hero/20180406_182210.jpg',
};

// -----------------------------------------------------------------------------
// Social Links
// -----------------------------------------------------------------------------

export const SOCIAL_LINKS = {
  airbnb: '',
  google: 'https://www.google.com/maps/search/Erholungs+Apartments+Bad+Lippspringe',
  instagram: '',
} as const;

// -----------------------------------------------------------------------------
// External Calendar (iCal) URLs
// -----------------------------------------------------------------------------

export const ICAL_FEEDS: Record<string, { booking?: string; airbnb?: string }> = {
  'erholungs-apartment': {
    booking: 'https://ical.booking.com/v1/export/t/3ff3e903-bd6a-499d-805c-ef203bc753dd.ics',
  },
  'erholungs-kellerchen': {
    booking: 'https://ical.booking.com/v1/export/t/b69da8f7-e064-40a1-b184-20dbd746c857.ics',
  },
};
