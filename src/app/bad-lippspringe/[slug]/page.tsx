import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ImageSlideshow from '@/components/ui/ImageSlideshow';
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
  Ticket,
  Droplets,
  Flame,
  Baby,
  Utensils,
  Sparkles,
  Euro,
  Fish,
  Footprints,
} from 'lucide-react';

// =============================================================================
// Attraction Data
// =============================================================================

interface AttractionFeature {
  text: string;
}

interface PriceEntry {
  label: string;
  price: string;
}

interface OpeningHours {
  label: string;
  times: string;
}

interface AreaHighlight {
  icon: typeof Waves;
  title: string;
  description: string;
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
  openingHours?: OpeningHours[];
  prices?: PriceEntry[];
  areas?: AreaHighlight[];
  address?: string;
  website?: string;
  gallery?: { src: string; alt: string }[];
}

const attractionData: Record<string, AttractionData> = {
  'westfalen-therme': {
    slug: 'westfalen-therme',
    name: 'Westfalen Therme',
    metaTitle:
      'Westfalen Therme Bad Lippspringe | Nur 500m von unseren Apartments',
    metaDescription:
      'Die Westfalen Therme in Bad Lippspringe: Erlebniswelten, Saunawelten, WALDgarten & Salinarium. ' +
      'Öffnungszeiten, Preise & Tipps. Nur 500m von den Erholungs Apartments entfernt.',
    distance: '500m',
    distanceDetail: '500m entfernt (5-7 Gehminuten)',
    icon: Waves,
    heroColor: 'from-blue-900 to-cyan-900',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    intro:
      'Die Westfalen Therme in Bad Lippspringe ist eine der beliebtesten Thermen in Ostwestfalen-Lippe – mit über 6.000 m² Wasser-, Sauna- und Wellnessfläche.',
    paragraphs: [
      'Ob Familienspaß in den Aqua-Erlebniswelten, Entspannung in der weitläufigen ' +
        'Saunalandschaft oder wohltuende Sole-Anwendungen im Salinarium – die Westfalen ' +
        'Therme bietet für jeden Geschmack das passende Erlebnis. Das Highlight: der ' +
        'WALDgarten mit Infinity Pool, Naturschwimmteich und Waldsauna inmitten der Natur.',
      'Besonders beliebt sind die regelmäßigen Aufguss-Zeremonien in der Saunalandschaft, ' +
        'die verschiedenen Solebecken mit ihrem hohen Salzgehalt sowie die 75m und 125m ' +
        'Wasserrutschen mit Zeitmessanlage. Für die kleinen Gäste gibt es das Piratenland ' +
        'mit Abenteuerschiff und Giant Splasher.',
      'Von unseren Erholungs Apartments erreichen Sie die Westfalen Therme in nur ' +
        '5 bis 7 Gehminuten zu Fuß. So können Sie Ihren Wellness-Tag ganz entspannt ' +
        'beginnen und ausklingen lassen – ohne Auto und Parkplatzsuche.',
    ],
    features: [
      { text: 'Aqua-Erlebniswelten mit Innen- & Außenbecken' },
      { text: '75m & 125m Wasserrutschen mit Zeitmessung' },
      { text: 'Saunawelten auf über 6.000 m²' },
      { text: 'WALDgarten mit Infinity Pool & Naturschwimmteich' },
      { text: 'Salinarium mit Solebecken & Salzsauna' },
      { text: 'Piratenland & Kinderwelt' },
      { text: 'Whirlpoolgrotte & Strömungskreisel' },
      { text: 'Restaurants WAVES & WALDbistro' },
    ],
    areas: [
      {
        icon: Waves,
        title: 'Aqua-Erlebniswelten',
        description:
          'Wasserwelt unter der großen Glaskuppel mit Innen- und Außenbecken, Whirlpoolgrotte, ' +
          'Strömungskreisel, Wasserfall, Wasserfontänen und Sprungtürmen (1m & 3m). ' +
          'Dazu zwei Wasserrutschen (75m & 125m) mit Zeitmessanlage.',
      },
      {
        icon: Flame,
        title: 'Saunawelten',
        description:
          'Weitläufige Saunalandschaft mit Panoramasaunen, Dampfbädern und der Asia Lounge ' +
          'als Ruhebereich. Regelmäßige Aufguss-Zeremonien sorgen für besondere Erlebnisse.',
      },
      {
        icon: Sparkles,
        title: 'WALDgarten',
        description:
          'Naturnahes Wellness-Erlebnis mit Infinity Pool, Naturschwimmteich, Waldsauna ' +
          'und WALDsuiten mit Kaminlounge – eingebettet in die Natur des Kurwaldes.',
      },
      {
        icon: Droplets,
        title: 'Salinarium',
        description:
          'Sole- und Wellness-Bereich mit Solebecken, Salzsauna und Textilsauna. ' +
          'Der hohe Salzgehalt wirkt besonders wohltuend für Haut und Atemwege.',
      },
      {
        icon: Baby,
        title: 'Piratenland & Kinderwelt',
        description:
          'Abenteuerschiff, Giant Splasher, Wasserkanone und Kleinkinderland mit ' +
          'kindgerechten Wasserspielen – Badespaß für die ganze Familie.',
      },
      {
        icon: Utensils,
        title: 'Gastronomie',
        description:
          'Restaurant WAVES (So–Do 11:30–20:00, Fr–Sa 10:30–21:00) und WALDbistro ' +
          '(So–Do 11:00–21:30, Fr–Sa 11:00–22:30) mit vielfältigem Angebot.',
      },
    ],
    openingHours: [
      { label: 'Wasserwelten & Saunawelt (So–Do)', times: '9:00 – 22:00 Uhr' },
      { label: 'Wasserwelten & Saunawelt (Fr–Sa)', times: '9:00 – 23:00 Uhr' },
      { label: 'Salinarium (So–Do)', times: '9:00 – 22:00 Uhr' },
      { label: 'Salinarium (Fr–Sa)', times: '9:00 – 23:00 Uhr' },
      { label: 'Sportbecken (Frühschwimmer)', times: '6:30 – 8:00 Uhr' },
    ],
    prices: [
      { label: 'Wasserwelt (3 Std.)', price: 'ab 18 €' },
      { label: 'Wasserwelt ermäßigt', price: 'ab 15 €' },
      { label: 'Familienkarte', price: 'ab 40 €' },
      { label: 'Wasser- & Saunawelt (3 Std.)', price: 'ab 30 €' },
      { label: 'Sportbecken Einzeleintritt', price: 'ab 3 €' },
    ],
    address: 'Schwimmbadstraße 14, 33175 Bad Lippspringe',
    website: 'https://www.westfalen-therme.de',
    tip: null,
    image: '/images/umgebung/westfalen-therme.jpg',
    gallery: [
      { src: '/images/umgebung/westfalen-therme/thermenkuppel.jpg', alt: 'Westfalen Therme – Thermenkuppel von außen' },
      { src: '/images/umgebung/westfalen-therme/wasserwelt.jpg', alt: 'Aqua-Erlebniswelt mit Becken und Rutschen' },
      { src: '/images/umgebung/westfalen-therme/whirlpool.jpg', alt: 'Whirlpool im Erlebnisbad' },
      { src: '/images/umgebung/westfalen-therme/aussenpool.jpg', alt: 'Außenpool bei Abendstimmung' },
      { src: '/images/umgebung/westfalen-therme/waldgarten.jpg', alt: 'WALDgarten – Natur-Wellness mit Infinity Pool' },
      { src: '/images/umgebung/westfalen-therme/salinarium.jpg', alt: 'Salinarium – Solebad & Wellness' },
      { src: '/images/umgebung/westfalen-therme/asia-lounge.jpg', alt: 'Asia Lounge – Ruhebereich in der Saunawelt' },
      { src: '/images/umgebung/westfalen-therme/kinderwelt.jpg', alt: 'Kinderwelt & Piratenland' },
    ],
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
        'Genießen Sie das Heilklima direkt vor der Haustür – ob für einen kurzen ' +
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
      'Die Externsteine – bis zu 40m hohe Sandsteinfelsen im Teutoburger Wald. ' +
      'Öffnungszeiten, Preise & Tipps. Nur 12km von den Erholungs Apartments entfernt.',
    distance: '12km',
    distanceDetail: '12km entfernt (ca. 15 Minuten mit dem Auto)',
    icon: Mountain,
    heroColor: 'from-amber-900 to-orange-900',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    intro:
      'Die Externsteine gehören zu den markantesten Naturdenkmälern Deutschlands – bis zu 40 Meter hohe Sandsteinfelsen, die jährlich rund 500.000 Besucher anziehen.',
    paragraphs: [
      'Die einzigartige Felsformation im Wiembecketal bei Horn-Bad Meinberg zählt zu den ' +
        'bekanntesten Natur- und Kulturdenkmälern Deutschlands. Ihre einzigartige Gestalt ' +
        'und die zahlreichen mittelalterlichen Bearbeitungsspuren – darunter das berühmte ' +
        'Kreuzabnahmerelief – machen sie zu einem faszinierenden Ausflugsziel für ' +
        'Geschichts- und Naturliebhaber gleichermaßen.',
      'Die Felsen können über Treppen und Brücken bestiegen werden und bieten von ' +
        'oben einen atemberaubenden Blick über den Teutoburger Wald. Am Fuße der ' +
        'Externsteine erstreckt sich ein idyllischer See, der zum Verweilen einlädt. ' +
        'Ein Informationszentrum vor Ort vermittelt Wissenswertes über die ' +
        'kulturhistorische Bedeutung. Geführte Touren ermöglichen den Zugang zur Grotte.',
      'Von unseren Erholungs Apartments erreichen Sie die Externsteine in nur ' +
        'etwa 15 Minuten mit dem Auto. Die Fahrt durch die malerische Landschaft ' +
        'des Teutoburger Waldes ist bereits ein Erlebnis für sich.',
    ],
    features: [
      { text: 'Bis zu 40m hohe begehbare Felsformation' },
      { text: 'UNESCO-nominiertes Kulturdenkmal' },
      { text: 'Grotte mit geführten Touren' },
      { text: 'Idyllischer See am Fuße der Felsen' },
      { text: 'Informationszentrum & Gastronomie' },
      { text: 'GPS-Naturerlebnispfade' },
      { text: 'Wanderwege im Naturschutzgebiet' },
      { text: 'Ca. 500.000 Besucher jährlich' },
    ],
    openingHours: [
      { label: 'Felsbesteigung (täglich)', times: '10:00 – 18:00 Uhr' },
      { label: 'Letzter Einlass', times: '17:30 Uhr' },
      { label: 'Saison', times: 'Ende März – Oktober' },
    ],
    prices: [
      { label: 'Erwachsene', price: '5,00 €' },
      { label: 'Kinder (6–17 Jahre)', price: 'ermäßigt' },
      { label: 'Kinder unter 6', price: 'kostenlos' },
    ],
    address: 'Externsteine Straße, 32805 Horn-Bad Meinberg',
    website: 'https://www.externsteine-info.de',
    tip: null,
    image: '/images/umgebung/externsteine/externsteine-panorama.jpg',
    gallery: [
      { src: '/images/umgebung/externsteine/externsteine-panorama.jpg', alt: 'Externsteine – Panoramablick auf die Felsformation' },
      { src: '/images/umgebung/externsteine/morgenlicht.jpg', alt: 'Externsteine im Morgenlicht' },
      { src: '/images/umgebung/externsteine/felsen-see.jpg', alt: 'Externsteine mit See – Landesverband Lippe' },
      { src: '/images/umgebung/externsteine/grotte.jpg', alt: 'Grotte in den Externsteinen' },
    ],
  },

  gartenschau: {
    slug: 'gartenschau',
    name: 'Gartenschau',
    metaTitle:
      'Gartenschau Bad Lippspringe | Ehemalige Landesgartenschau 2017',
    metaDescription:
      'Die Gartenschau Bad Lippspringe – ganzjährig geöffnet mit Parkanlagen, ' +
      'Grüffelo-Pfad, Spielplätzen & Events. Öffnungszeiten, Preise & Tipps.',
    distance: 'In der Nähe',
    distanceDetail: 'In der Nähe (wenige Gehminuten)',
    icon: Flower2,
    heroColor: 'from-pink-900 to-rose-900',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    intro:
      'Die Gartenschau Bad Lippspringe – das ganzjährig geöffnete Gelände der Landesgartenschau 2017 mit Parkanlagen, Spielplätzen und saisonalen Events.',
    paragraphs: [
      'Die Landesgartenschau 2017 hat in Bad Lippspringe ein bleibendes Erbe ' +
        'hinterlassen: Wunderschön gestaltete Parkanlagen, Themengärten und ' +
        'Erholungsflächen laden das ganze Jahr über zum Spazieren und Genießen ein. ' +
        'Besonders beliebt ist der Grüffelo-Pfad für Kinder sowie das „Grüne Klassenzimmer" ' +
        'für Schulklassen und Gruppen.',
      'Familien mit Kindern finden auf dem Gelände großzügige Spielplätze und ' +
        'Erlebnisbereiche. Die weitläufigen Grünflächen laden zum Picknicken und ' +
        'Verweilen ein. Regelmäßige Veranstaltungen wie die „Waldbeleuchtung" und ' +
        'saisonale Highlights wie das Kürbisfest machen ' +
        'das Gartenschau-Gelände zu einem lebendigen Treffpunkt für Einheimische ' +
        'und Gäste. Auch Hochzeiten und Kindergeburtstage können hier gefeiert werden.',
      'Das Gelände ist von unseren Apartments aus bequem zu Fuß erreichbar. ' +
        'Mit über 700 kostenlosen Parkplätzen in der Nähe ist die Anfahrt auch ' +
        'mit dem Auto unkompliziert.',
    ],
    features: [
      { text: 'Ganzjährig geöffnete Parkanlagen' },
      { text: 'Grüffelo-Pfad für Kinder' },
      { text: 'Themengärten & Pflanzenschauen' },
      { text: 'Großzügige Spielplätze' },
      { text: 'Grünes Klassenzimmer' },
      { text: 'Waldbeleuchtung & saisonale Events' },
      { text: 'Gastronomie vor Ort' },
      { text: 'Über 700 kostenlose Parkplätze' },
    ],
    openingHours: [
      { label: 'Hauptsaison (Apr–Okt)', times: '9:00 – 18:00 Uhr' },
      { label: 'Nebensaison (Nov–Mär)', times: '10:00 – 17:00 Uhr' },
    ],
    address: 'Lindenstraße 1a, 33175 Bad Lippspringe',
    website: 'https://www.gartenschau-badlippspringe.de',
    tip: null,
    image: '/images/umgebung/gartenschau/brunnen.jpg',
    gallery: [
      { src: '/images/umgebung/gartenschau/brunnen.jpg', alt: 'Gartenschau – Brunnenanlage mit Blumenbeeten' },
      { src: '/images/umgebung/gartenschau/tulpen.jpg', alt: 'Tulpenblüte in der Gartenschau' },
      { src: '/images/umgebung/gartenschau/pavillon.jpg', alt: 'Pavillon im Frühling mit Tulpen' },
      { src: '/images/umgebung/gartenschau/kuerbis-skulptur.jpg', alt: 'Kürbis-Skulptur beim Kürbisfest' },
      { src: '/images/umgebung/gartenschau/kuerbisfest.jpg', alt: 'Kürbisfest – Riesen-Kürbis-Wettbewerb' },
    ],
  },

  'dedingerheide-see': {
    slug: 'dedingerheide-see',
    name: 'Dedingerheide See',
    metaTitle:
      'Dedingerheide See | Naherholung nur 150m von unseren Apartments',
    metaDescription:
      'Der Dedingerheide See in Bad Lippspringe – idyllischer See für Spaziergänge, ' +
      'Joggen und Naturerlebnis. Nur 150m von den Erholungs Apartments entfernt.',
    distance: '150m',
    distanceDetail: '150m entfernt (2 Gehminuten)',
    icon: Fish,
    heroColor: 'from-sky-900 to-blue-900',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    intro:
      'Der Dedingerheide See liegt nur 150 Meter von unseren Apartments entfernt – perfekt für einen morgendlichen Spaziergang oder einen entspannten Abend am Wasser.',
    paragraphs: [
      'Der idyllische Dedingerheide See ist ein beliebtes Naherholungsziel in ' +
        'Bad Lippspringe und unser direkter Nachbar. Umgeben von Grünflächen und ' +
        'altem Baumbestand bietet der See eine ruhige Oase zum Abschalten und ' +
        'Kraft tanken – und das praktisch direkt vor der Haustür.',
      'Ein gut ausgebauter Rundweg um den See eignet sich hervorragend für ' +
        'Spaziergänge, Jogging oder Nordic Walking. Bänke am Ufer laden zum ' +
        'Verweilen und Naturbeobachten ein. Im Frühling und Sommer lassen sich ' +
        'hier Enten, Reiher und andere Wasservögel beobachten.',
      'Der See ist auch ein idealer Startpunkt für längere Wanderungen in den ' +
        'Kurwald oder zum Arminiuspark. Von hier aus können Sie verschiedene Routen ' +
        'in die Natur des Teutoburger Waldes erkunden – alles zu Fuß erreichbar.',
    ],
    features: [
      { text: 'Nur 150m von unseren Apartments' },
      { text: 'Rundweg zum Spazieren & Joggen' },
      { text: 'Ruhige Lage mit altem Baumbestand' },
      { text: 'Sitzbänke am Ufer' },
      { text: 'Wasservögel beobachten' },
      { text: 'Startpunkt für Wanderungen' },
      { text: 'Ganzjährig frei zugänglich' },
      { text: 'Ideal für Morgen- & Abendspaziergänge' },
    ],
    tip: 'Der See ist frei zugänglich – kein Eintritt nötig. Perfekt für einen Morgenspaziergang vor dem Frühstück!',
    image: '/images/umgebung/dedinger-heidesee/panorama-see.jpg',
    gallery: [
      { src: '/images/umgebung/dedinger-heidesee/panorama-see.jpg', alt: 'Dedingerheide See – Panoramablick über das Wasser' },
      { src: '/images/umgebung/dedinger-heidesee/luftbild.jpg', alt: 'Dedingerheide See – Luftbild mit Bad Lippspringe' },
      { src: '/images/umgebung/dedinger-heidesee/ufer-gaense.jpg', alt: 'Gänse am Ufer des Dedingerheide Sees' },
    ],
  },

  wanderwege: {
    slug: 'wanderwege',
    name: 'Wanderwege',
    metaTitle:
      'Wanderwege Bad Lippspringe | Teutoburger Wald & Eggegebirge',
    metaDescription:
      'Entdecken Sie die schönsten Wanderwege rund um Bad Lippspringe: Hermannsweg, ' +
      'Eggeweg, Planetenweg und Terrainkurwege im Heilwald. Direkt ab unseren Apartments.',
    distance: 'Ab Haustür',
    distanceDetail: 'Direkt ab der Haustür erreichbar',
    icon: Footprints,
    heroColor: 'from-lime-900 to-emerald-900',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-700',
    intro:
      'Bad Lippspringe liegt am Schnittpunkt der schönsten Wanderwege im Teutoburger Wald und Eggegebirge – alle direkt ab unserer Haustür erreichbar.',
    paragraphs: [
      'Als staatlich anerkannter Heilklimatischer Kurort am Rande des Teutoburger Waldes ' +
        'bietet Bad Lippspringe ein hervorragendes Netz an Wanderwegen für jedes Fitness-Level. ' +
        'Der 200 Hektar große Heilwald mit seinen Terrainkurwegen ist nur wenige Gehminuten ' +
        'von unseren Apartments entfernt und bietet besonders reine, allergenarme Waldluft.',
      'Zu den Highlights gehören der berühmte Hermannsweg (einer der „Top Trails of Germany"), ' +
        'der Eggeweg als Teil des europäischen Fernwanderwegs E1 sowie der 6 km lange ' +
        'Planetenweg – ein Lehrpfad, der unser Sonnensystem im Maßstab 1:1 Milliarde ' +
        'durch die Landschaft abbildet. Die historischen Ruhepunkte im Heilwald mit ' +
        'denkmalgeschützten Pavillons laden zum Verweilen ein.',
      'Ob kurzer Morgenspaziergang um den Dedingerheide See, eine Halbtageswanderung durch ' +
        'den Kurwald oder eine ambitionierte Etappe auf dem Hermannsweg – von unseren ' +
        'Erholungs Apartments starten Sie direkt ins Grüne. Geführte Wanderungen werden ' +
        'regelmäßig von der Tourist-Information angeboten.',
    ],
    areas: [
      {
        icon: Mountain,
        title: 'Hermannsweg',
        description:
          'Einer der „Top Trails of Germany" – 156 km Kammweg über den Teutoburger Wald. ' +
          'Etappen in der Nähe von Bad Lippspringe führen durch eindrucksvolle Buchenwälder.',
      },
      {
        icon: TreePine,
        title: 'Eggeweg',
        description:
          'Teil des europäischen Fernwanderwegs E1. Der Eggeweg führt über den Höhenzug ' +
          'des Eggegebirges mit herrlichen Panoramablicken.',
      },
      {
        icon: Sparkles,
        title: 'Planetenweg',
        description:
          '6 km langer Lehrpfad, der unser Sonnensystem im Maßstab 1:1 Milliarde ' +
          'durch die Landschaft abbildet. Ideal für Familien.',
      },
      {
        icon: Waves,
        title: 'Terrainkurwege',
        description:
          'Gesundheitswanderwege im 200 ha großen Heilwald mit verschiedenen ' +
          'Schwierigkeitsgraden – beschildert nach Belastungsstufen.',
      },
    ],
    features: [
      { text: 'Hermannsweg – Top Trail of Germany' },
      { text: 'Eggeweg – Europäischer Fernwanderweg E1' },
      { text: '6 km Planetenweg für Familien' },
      { text: 'Terrainkurwege im Heilwald' },
      { text: '200 ha zertifizierter Heilwald' },
      { text: 'Allergenarme, heilklimatische Waldluft' },
      { text: 'Geführte Wanderungen der Tourist-Info' },
      { text: 'Direkt ab unserer Haustür' },
    ],
    tip: 'Die Tourist-Information Bad Lippspringe bietet regelmäßig geführte Wanderungen an. Fragen Sie bei Ihrer Anreise nach dem aktuellen Programm!',
    image: '/images/umgebung/wandern/wanderer-felsen.jpg',
    gallery: [
      { src: '/images/umgebung/wandern/wanderer-felsen.jpg', alt: 'Wanderer auf Felsenpfad im Teutoburger Wald' },
      { src: '/images/umgebung/wandern/externsteine-spiegelung.jpg', alt: 'Externsteine mit Spiegelung im See' },
      { src: '/images/umgebung/wandern/wandergruppe-berge.png', alt: 'Wandergruppe auf Bergpfad' },
    ],
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
    { slug: 'dedingerheide-see' },
    { slug: 'wanderwege' },
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
              {/* Attraction image / slideshow */}
              {attraction.gallery && attraction.gallery.length > 1 ? (
                <div className="mb-10">
                  <ImageSlideshow images={attraction.gallery} />
                </div>
              ) : (
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
              )}

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

              {/* Areas / Bereiche (Westfalen Therme) */}
              {attraction.areas && attraction.areas.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6 text-2xl font-bold text-[#1A1A1A]">
                    Bereiche & Erlebniswelten
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {attraction.areas.map((area) => {
                      const AreaIcon = area.icon;
                      return (
                        <div
                          key={area.title}
                          className="rounded-2xl border border-[#E5E2DC] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                              <AreaIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-[#1A1A1A]">
                              {area.title}
                            </h3>
                          </div>
                          <p className="text-sm leading-relaxed text-[#4A4A4A]">
                            {area.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Opening hours tip (for non-therme attractions) */}
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
              <div className="sticky top-8 space-y-6">
                {/* Features card */}
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
                          <span className="text-sm text-[#4A4A4A]">
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Opening hours card */}
                {attraction.openingHours && (
                  <div className="overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-[#F0EDE7] bg-[#FAFAF7] px-6 py-4">
                      <Clock className="h-5 w-5 text-[#2D5016]" />
                      <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Öffnungszeiten
                      </h2>
                    </div>
                    <div className="p-6">
                      <dl className="space-y-3">
                        {attraction.openingHours.map((entry, index) => (
                          <div key={index}>
                            <dt className="text-xs font-medium text-[#7A7A7A]">
                              {entry.label}
                            </dt>
                            <dd className="mt-0.5 text-sm font-semibold text-[#1A1A1A]">
                              {entry.times}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      {attraction.website && (
                        <p className="mt-4 text-xs text-[#7A7A7A]">
                          Angaben ohne Gewähr. Aktuelle Zeiten auf{' '}
                          <a
                            href={attraction.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[#2D5016]"
                          >
                            {new URL(attraction.website).hostname.replace('www.', '')}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Prices card */}
                {attraction.prices && (
                  <div className="overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-[#F0EDE7] bg-[#FAFAF7] px-6 py-4">
                      <Ticket className="h-5 w-5 text-[#2D5016]" />
                      <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Eintrittspreise
                      </h2>
                    </div>
                    <div className="p-6">
                      <dl className="space-y-3">
                        {attraction.prices.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <dt className="text-sm text-[#4A4A4A]">
                              {entry.label}
                            </dt>
                            <dd className="text-sm font-bold text-[#2D5016]">
                              {entry.price}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      {attraction.slug === 'westfalen-therme' && (
                        <div className="mt-4 rounded-lg bg-[#C9A84C]/10 p-3">
                          <p className="flex items-start gap-2 text-xs text-[#4A4A4A]">
                            <Euro className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
                            <span>
                              <strong>Spartipp:</strong> WellnessCards mit 10–30% Rabatt
                              auf alle Eintritte erhältlich.
                            </span>
                          </p>
                        </div>
                      )}
                      {attraction.website && (
                        <p className="mt-3 text-xs text-[#7A7A7A]">
                          Richtpreise – aktuelle Preise auf{' '}
                          <a
                            href={attraction.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[#2D5016]"
                          >
                            {new URL(attraction.website).hostname.replace('www.', '')}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Distance & address info card */}
                <div className="overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D5016]/10">
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
                    {attraction.address && (
                      <div className="mt-4 rounded-lg bg-[#FAFAF7] p-3">
                        <p className="text-xs font-medium text-[#7A7A7A]">
                          Adresse
                        </p>
                        <p className="mt-0.5 text-sm text-[#1A1A1A]">
                          {attraction.address}
                        </p>
                      </div>
                    )}
                    {attraction.website && (
                      <a
                        href={attraction.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#2D5016] transition-colors hover:text-[#3D6B1E]"
                      >
                        Website besuchen
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    )}
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
