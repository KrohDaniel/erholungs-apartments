import Link from 'next/link';
import Image from 'next/image';
import {
  Bed,
  CookingPot,
  Bath,
  Wifi,
  Sun,
  ArrowRight,
} from 'lucide-react';

interface AmenityItem {
  icon: React.ElementType;
  label: string;
}

interface ApartmentData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  amenities: AmenityItem[];
}

const apartments: ApartmentData[] = [
  {
    slug: '/erholungs-kellerchen/',
    title: 'Erholungs Kellerchen',
    subtitle: '~25 qm | bis 2 Personen',
    description:
      'Gem\u00FCtliche Kellerwohnung mit Doppelbett, K\u00FCche und renoviertem Bad. Perfekt f\u00FCr Paare und Alleinreisende.',
    price: 'ab 45\u20AC/Nacht',
    image: '/images/kellerchen/booking/hero_keller.jpeg',
    imageAlt: 'Erholungs Kellerchen - Gemütliches Schlafzimmer mit Doppelbett und Sitzecke',
    amenities: [
      { icon: Bed, label: 'Doppelbett' },
      { icon: CookingPot, label: 'K\u00FCche' },
      { icon: Bath, label: 'Bad' },
      { icon: Wifi, label: 'WLAN' },
    ],
  },
  {
    slug: '/erholungs-apartment/',
    title: 'Erholungs Apartment',
    subtitle: '1. Etage | bis 2 Pers. + 1 Kind',
    description:
      'Ger\u00E4umiges Apartment in der ersten Etage mit Doppelbett, K\u00FCche, Bad und Balkon. Ideal f\u00FCr Paare und Familien mit Kind.',
    price: 'ab 70\u20AC/Nacht',
    image: '/images/apartment/hero_apartment.jpeg',
    imageAlt: 'Erholungs Apartment - Geräumiger Wohn- und Schlafbereich mit Doppelbett und Kronleuchter',
    amenities: [
      { icon: Bed, label: 'Doppelbett' },
      { icon: CookingPot, label: 'K\u00FCche' },
      { icon: Bath, label: 'Bad' },
      { icon: Wifi, label: 'WLAN' },
      { icon: Sun, label: 'Balkon' },
    ],
  },
];

function ApartmentCard({ apartment }: { apartment: ApartmentData }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-300">
        <Image
          src={apartment.image}
          alt={apartment.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Price badge */}
        <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white shadow-md">
          {apartment.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <h3 className="mb-1 text-xl font-bold text-text sm:text-2xl">
          {apartment.title}
        </h3>
        <p className="mb-3 text-sm font-medium text-text-muted">
          {apartment.subtitle}
        </p>
        <p className="mb-5 leading-relaxed text-text-light">
          {apartment.description}
        </p>

        {/* Amenities */}
        <div className="mb-6 flex flex-wrap gap-4">
          {apartment.amenities.map((amenity) => (
            <div
              key={amenity.label}
              className="flex items-center gap-1.5 text-text-muted"
            >
              <amenity.icon className="h-4 w-4" />
              <span className="text-xs">{amenity.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={apartment.slug}
          className="group/btn inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-light hover:shadow-md"
        >
          Details ansehen
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default function ApartmentCards() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-3xl font-bold text-text sm:text-4xl">
            Unsere Unterk&uuml;nfte
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
          {apartments.map((apartment) => (
            <ApartmentCard key={apartment.slug} apartment={apartment} />
          ))}
        </div>
      </div>
    </section>
  );
}
