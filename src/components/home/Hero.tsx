'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Search,
  CalendarDays,
  Users,
  ChevronDown,
  MapPin,
  Wifi,
  Car,
  ArrowRight,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface BookingState {
  checkIn: string;
  checkOut: string;
  guests: string;
}

// =============================================================================
// BookingBar
// =============================================================================

function BookingBar({
  booking,
  setBooking,
  onSearch,
}: {
  booking: BookingState;
  setBooking: (b: Partial<BookingState>) => void;
  onSearch: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-4">
      <div>
        <label htmlFor="hero-checkin" className="mb-1.5 block text-xs font-medium text-text-muted sm:text-sm">Anreise</label>
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input id="hero-checkin" type="date" value={booking.checkIn} onChange={(e) => setBooking({ checkIn: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-2 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label htmlFor="hero-checkout" className="mb-1.5 block text-xs font-medium text-text-muted sm:text-sm">Abreise</label>
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input id="hero-checkout" type="date" value={booking.checkOut} onChange={(e) => setBooking({ checkOut: e.target.value })}
            min={booking.checkIn || new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-2 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label htmlFor="hero-guests" className="mb-1.5 block text-xs font-medium text-text-muted sm:text-sm">Gäste</label>
        <div className="relative">
          <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <select id="hero-guests" value={booking.guests} onChange={(e) => setBooking({ guests: e.target.value })}
            className="w-full appearance-none rounded-lg border border-border bg-background py-2.5 pl-10 pr-8 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="1">1 Gast</option>
            <option value="2">2 Gäste</option>
            <option value="3">3 Gäste</option>
            <option value="4">4 Gäste</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>
      </div>
      <div className="flex items-end">
        <button type="button" onClick={onSearch}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-light hover:shadow-lg active:scale-[0.98] cursor-pointer">
          <Search className="h-4 w-4" />
          <span>Suchen</span>
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Hero Component (Showcase Design)
// =============================================================================

export default function Hero() {
  const [booking, setBookingState] = useState<BookingState>({
    checkIn: '',
    checkOut: '',
    guests: '2',
  });

  const setBooking = useCallback((partial: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (booking.checkIn) params.set('checkin', booking.checkIn);
    if (booking.checkOut) params.set('checkout', booking.checkOut);
    params.set('guests', booking.guests);
    window.location.href = `/buchen/?${params.toString()}`;
  }, [booking]);

  return (
    <section className="relative bg-background" id="hero">
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col pt-4 md:pt-8 lg:flex-row lg:items-center">
          {/* Left: Text content */}
          <div className="flex-shrink-0 px-6 pb-8 sm:px-10 md:mx-auto md:max-w-2xl lg:mx-0 lg:max-w-none lg:w-[42%] lg:pb-0 lg:pl-16 lg:pr-10 xl:pl-24">
            {/* Rating badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-semibold text-text">9.0/10</span>
              <span className="text-sm text-text-muted">Booking.com</span>
            </div>

            {/* Headline */}
            <h1 className="mb-5 text-3xl font-bold leading-[1.1] tracking-tight text-text sm:text-4xl lg:text-5xl">
              Ferienwohnungen
              <br />
              <span className="text-primary">in Bad Lippspringe</span>
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-md text-base leading-relaxed text-text-light lg:text-lg">
              Direkt am Kurwald, nur 5 Gehminuten zur Westfalen Therme. Mit Massage-Angebot im Haus.
            </p>

            {/* USP pills */}
            <div className="mb-8 flex flex-wrap gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3.5 py-2 text-sm font-medium text-primary">
                <MapPin className="h-3.5 w-3.5" /> 500m Therme
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3.5 py-2 text-sm font-medium text-primary">
                <Wifi className="h-3.5 w-3.5" /> Gratis WLAN
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3.5 py-2 text-sm font-medium text-primary">
                <Car className="h-3.5 w-3.5" /> Kostenlos Parken
              </span>
            </div>

            {/* Booking form */}
            <div className="mb-6 rounded-2xl border border-border bg-white p-4 shadow-lg sm:p-5">
              <BookingBar booking={booking} setBooking={setBooking} onSearch={handleSearch} />
              <p className="mt-3 text-center text-xs text-text-muted">
                ab 40&euro;/Nacht &middot; Mindestaufenthalt 2 Nächte
              </p>
            </div>

            {/* Quick links */}
            <div className="flex gap-5">
              <Link href="/erholungs-kellerchen/" className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light">
                Kellerchen ab 40&euro;
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/erholungs-apartment/" className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light">
                Apartment ab 70&euro;
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right: Two apartment images */}
          <div className="flex-1 px-4 pb-20 sm:px-6 lg:pr-10 lg:pb-0 xl:pr-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Apartment */}
              <Link href="/erholungs-apartment/" className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg block sm:aspect-[4/5]">
                <Image
                  src="/images/apartment/apartment-ferienwohnung.jpg"
                  alt="Erholungs Apartment - Geräumige Ferienwohnung"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 55vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white sm:text-xl">Erholungs Apartment</h3>
                    <p className="text-sm text-white/80">Erdgeschoss &middot; bis 4 Personen</p>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow">
                    ab 70&euro;
                  </span>
                </div>
              </Link>
              {/* Kellerchen */}
              <Link href="/erholungs-kellerchen/" className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg block sm:aspect-[4/5]">
                <Image
                  src="/images/kellerchen/booking/19.jpg"
                  alt="Erholungs Kellerchen - Schlafzimmer mit Himmelbett und LED-Beleuchtung"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 55vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white sm:text-xl">Erholungs Kellerchen</h3>
                    <p className="text-sm text-white/80">~25 qm &middot; bis 2 Personen</p>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow">
                    ab 40&euro;
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
