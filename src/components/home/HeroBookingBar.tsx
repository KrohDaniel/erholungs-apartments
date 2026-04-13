'use client';

import { useState, useCallback } from 'react';
import {
  Search,
  CalendarDays,
  Users,
  ChevronDown,
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
// HeroBookingBar (Client Component)
// =============================================================================

export default function HeroBookingBar() {
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
    <div className="mb-5 rounded-2xl border border-border bg-white p-4 shadow-lg sm:mb-6 sm:p-5">
      <div className="space-y-3">
        {/* Date row */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="min-w-0">
            <label
              htmlFor="hero-checkin"
              className="mb-1 block text-xs font-medium text-text-muted sm:mb-1.5 sm:text-sm"
            >
              Anreise
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="hero-checkin"
                type="date"
                value={booking.checkIn}
                onChange={(e) => setBooking({ checkIn: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full min-w-0 rounded-lg border border-border bg-background py-2 pl-9 pr-2 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:py-2.5"
              />
            </div>
          </div>
          <div className="min-w-0">
            <label
              htmlFor="hero-checkout"
              className="mb-1 block text-xs font-medium text-text-muted sm:mb-1.5 sm:text-sm"
            >
              Abreise
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="hero-checkout"
                type="date"
                value={booking.checkOut}
                onChange={(e) => setBooking({ checkOut: e.target.value })}
                min={booking.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full min-w-0 rounded-lg border border-border bg-background py-2 pl-9 pr-2 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Guests + Search row */}
        <div className="grid grid-cols-[1fr_1fr] gap-2 sm:grid-cols-[1fr_2fr] sm:gap-3">
          <div className="min-w-0">
            <label
              htmlFor="hero-guests"
              className="mb-1 block text-xs font-medium text-text-muted sm:mb-1.5 sm:text-sm"
            >
              Gäste
            </label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <select
                id="hero-guests"
                value={booking.guests}
                onChange={(e) => setBooking({ guests: e.target.value })}
                className="w-full min-w-0 appearance-none rounded-lg border border-border bg-background py-2 pl-9 pr-8 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:py-2.5"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-light hover:shadow-lg active:scale-[0.98] cursor-pointer sm:py-2.5"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span>Verfügbarkeit prüfen</span>
            </button>
          </div>
        </div>
      </div>
      <p className="mt-2.5 text-center text-xs text-text-muted sm:mt-3">
        ab 30&euro;/Nacht &middot; Mindestaufenthalt 2 N&auml;chte
      </p>
    </div>
  );
}
