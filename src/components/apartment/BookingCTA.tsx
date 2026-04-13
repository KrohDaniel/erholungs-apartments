'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Users, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SITE_CONFIG } from '@/lib/constants';

// =============================================================================
// BookingCTA Component
// =============================================================================

interface BookingCTAProps {
  apartmentSlug: string;
  minPrice: number;
}

export default function BookingCTA({ apartmentSlug, minPrice }: BookingCTAProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const bookingUrl = `/buchen/?apartment=${apartmentSlug}${checkIn ? `&checkin=${checkIn}` : ''}${checkOut ? `&checkout=${checkOut}` : ''}${guests > 1 ? `&guests=${guests}` : ''}`;

  return (
    <>
      {/* -----------------------------------------------------------------------
          Desktop Sidebar Card
          ----------------------------------------------------------------------- */}
      <div className="hidden lg:block">
        <Card className="sticky top-24 shadow-lg border-border">
          <div className="p-6">
            {/* Price highlight */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-text">
                  ab {minPrice}&thinsp;&euro;
                </span>
                <span className="text-text-muted text-base">/Nacht</span>
              </div>
            </div>

            {/* Date inputs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label
                  htmlFor="cta-checkin"
                  className="block text-xs font-semibold text-text-light uppercase tracking-wide mb-1.5"
                >
                  Check-in
                </label>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="date"
                    id="cta-checkin"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="
                      w-full rounded-lg border border-border bg-white pl-9 pr-3 py-2.5
                      text-sm text-text placeholder:text-text-muted
                      transition-all duration-[var(--transition-fast)]
                      focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
                    "
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="cta-checkout"
                  className="block text-xs font-semibold text-text-light uppercase tracking-wide mb-1.5"
                >
                  Check-out
                </label>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="date"
                    id="cta-checkout"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="
                      w-full rounded-lg border border-border bg-white pl-9 pr-3 py-2.5
                      text-sm text-text placeholder:text-text-muted
                      transition-all duration-[var(--transition-fast)]
                      focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
                    "
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Guest selector */}
            <div className="mb-6">
              <label
                htmlFor="cta-guests"
                className="block text-xs font-semibold text-text-light uppercase tracking-wide mb-1.5"
              >
                Gäste
              </label>
              <div className="relative">
                <Users
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <select
                  id="cta-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="
                    w-full rounded-lg border border-border bg-white pl-9 pr-10 py-2.5
                    text-sm text-text appearance-none
                    transition-all duration-[var(--transition-fast)]
                    focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
                    cursor-pointer
                  "
                >
                  <option value={1}>1 Gast</option>
                  <option value={2}>2 Gäste</option>
                  {apartmentSlug === 'erholungs-apartment' && (
                    <>
                      <option value={3}>3 Gäste</option>
                      <option value={4}>4 Gäste</option>
                    </>
                  )}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <Link href={bookingUrl} className="block">
              <Button
                variant="accent"
                size="lg"
                fullWidth
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Verfügbarkeit prüfen
              </Button>
            </Link>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-text-muted">oder</span>
              </div>
            </div>

            {/* Phone CTA */}
            <a
              href={`tel:+49${SITE_CONFIG.phone.replace(/^0/, '').replace(/\s/g, '')}`}
              className="
                flex items-center justify-center gap-2.5
                w-full py-3 px-4 rounded-lg
                text-primary text-sm font-medium
                border-2 border-primary/20 bg-primary/5
                hover:bg-primary/10 hover:border-primary/30
                transition-all duration-[var(--transition-fast)]
              "
            >
              <Phone size={16} />
              Telefonisch: {SITE_CONFIG.phone}
            </a>
          </div>
        </Card>
      </div>

      {/* -----------------------------------------------------------------------
          Mobile Sticky Bottom Bar
          ----------------------------------------------------------------------- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border shadow-xl pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-sm mx-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-text">
                ab {minPrice}&thinsp;&euro;
              </span>
              <span className="text-text-muted text-sm">/Nacht</span>
            </div>
            <a
              href={`tel:+49${SITE_CONFIG.phone.replace(/^0/, '').replace(/\s/g, '')}`}
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
            >
              <Phone size={11} />
              {SITE_CONFIG.phone}
            </a>
          </div>

          <Link href={bookingUrl}>
            <Button
              variant="accent"
              size="md"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              Jetzt buchen
            </Button>
          </Link>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="lg:hidden h-20" aria-hidden="true" />
    </>
  );
}

export { BookingCTA };
export type { BookingCTAProps };
