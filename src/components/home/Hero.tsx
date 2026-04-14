import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Wifi,
  Car,
  ArrowRight,
} from 'lucide-react';
import HeroBookingBar from './HeroBookingBar';

// =============================================================================
// Hero Component (Server Component - static content is SSR'd)
// =============================================================================

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background" id="hero">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[600px] xl:min-h-[680px]">

          {/* ----------------------------------------------------------------
              Left: Text + Booking
              ---------------------------------------------------------------- */}
          <div className="flex flex-col justify-center px-5 pt-6 pb-8 sm:px-8 sm:pt-8 md:px-12 lg:w-[46%] lg:py-12 lg:pl-8 lg:pr-10 xl:pl-12 xl:pr-14">

            {/* Rating badge */}
            <div className="mb-4 inline-flex max-w-max items-center gap-2 rounded-full bg-secondary px-3 py-1.5 sm:mb-5 sm:px-4 sm:py-2">
              <Star className="h-4 w-4 shrink-0 fill-accent text-accent" />
              <span className="text-sm font-semibold text-text">9.0/10</span>
              <span className="text-sm text-text-muted">Booking.com</span>
            </div>

            {/* Headline */}
            <h1 className="mb-3 text-3xl font-bold leading-[1.1] tracking-tight text-text sm:mb-4 sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
              Ferienwohnungen
              <br />
              <span className="text-primary">in Bad Lippspringe</span>
            </h1>

            {/* Description */}
            <p className="mb-5 max-w-md text-base leading-relaxed text-text-light sm:mb-6 sm:text-lg">
              Direkt am Kurwald, nur 5 Gehminuten zur Westfalen Therme.
              Mit Massage-Angebot im Haus.
            </p>

            {/* USP pills */}
            <div className="mb-5 flex flex-wrap gap-1.5 sm:mb-6 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary sm:px-3.5 sm:py-1.5 sm:text-sm">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> 500m Therme
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary sm:px-3.5 sm:py-1.5 sm:text-sm">
                <Wifi className="h-3.5 w-3.5 shrink-0" /> Gratis WLAN
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary sm:px-3.5 sm:py-1.5 sm:text-sm">
                <Car className="h-3.5 w-3.5 shrink-0" /> Kostenlos Parken
              </span>
            </div>

            {/* Booking form (Client Component) */}
            <HeroBookingBar />

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/erholungs-kellerchen/"
                className="group inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-md sm:gap-2 sm:px-4 sm:text-sm"
              >
                <span>Kellerchen</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold group-hover:bg-white/20 group-hover:text-white sm:text-xs">
                  ab 30&euro;
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/erholungs-apartment/"
                className="group inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-md sm:gap-2 sm:px-4 sm:text-sm"
              >
                <span>Apartment</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold group-hover:bg-white/20 group-hover:text-white sm:text-xs">
                  ab 60&euro;
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              Right: Apartment images
              ---------------------------------------------------------------- */}
          <div className="relative flex-1 px-5 pb-6 sm:px-8 md:px-12 lg:px-0 lg:py-8 lg:pr-8 xl:pr-12">
            <div className="grid grid-cols-2 gap-3 h-full sm:gap-4">

              {/* Apartment */}
              <Link
                href="/erholungs-apartment/"
                className="group relative overflow-hidden rounded-2xl shadow-lg block aspect-[3/4] sm:aspect-auto"
              >
                <Image
                  src="/images/apartment/463798182.jpg"
                  alt="Erholungs Apartment - Wohn- und Schlafbereich mit Doppelbett und Kronleuchter"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 28vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                  <h3 className="text-sm font-bold text-white sm:text-lg lg:text-xl">
                    Erholungs Apartment
                  </h3>
                  <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
                    Erdgeschoss &middot; bis 2 Pers. + 1 Kind
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-white shadow sm:px-3 sm:py-1 sm:text-xs">
                    ab 60&euro;/Nacht
                  </span>
                </div>
              </Link>

              {/* Kellerchen */}
              <Link
                href="/erholungs-kellerchen/"
                className="group relative overflow-hidden rounded-2xl shadow-lg block aspect-[3/4] sm:aspect-auto"
              >
                <Image
                  src="/images/kellerchen/booking/19.jpg"
                  alt="Erholungs Kellerchen - Schlafzimmer mit Himmelbett und LED-Beleuchtung"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 28vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                  <h3 className="text-sm font-bold text-white sm:text-lg lg:text-xl">
                    Erholungs Kellerchen
                  </h3>
                  <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
                    ~25 m&sup2; &middot; bis 2 Personen
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-white shadow sm:px-3 sm:py-1 sm:text-xs">
                    ab 30&euro;/Nacht
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
