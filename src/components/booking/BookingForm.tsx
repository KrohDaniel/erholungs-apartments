'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Home,
  CalendarDays,
  Users,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { APARTMENTS, BOOKING_COM_URLS } from '@/lib/constants';
import { formatPrice } from '@/lib/pricing';
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar';
import type { Apartment } from '@/types';

// =============================================================================
// BookingForm - Verfügbarkeit prüfen & auf Booking.com weiterleiten
// =============================================================================

export default function BookingForm() {
  const searchParams = useSearchParams();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [selectedApartmentId, setSelectedApartmentId] = useState(
    searchParams.get('apartment') || ''
  );
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(
    Number(searchParams.get('guests')) || 1
  );

  // ---------------------------------------------------------------------------
  // Abgeleitete Werte
  // ---------------------------------------------------------------------------

  const selectedApartment = useMemo<Apartment | undefined>(
    () => APARTMENTS.find((a) => a.id === selectedApartmentId || a.slug === selectedApartmentId),
    [selectedApartmentId]
  );

  // URL-Parameter für initiale Datumsauswahl
  useEffect(() => {
    const checkinParam = searchParams.get('checkin');
    const checkoutParam = searchParams.get('checkout');
    if (checkinParam) {
      const d = new Date(checkinParam);
      if (!isNaN(d.getTime())) setCheckIn(d);
    }
    if (checkoutParam) {
      const d = new Date(checkoutParam);
      if (!isNaN(d.getTime())) setCheckOut(d);
    }
  }, [searchParams]);

  // Gäste-Anzahl anpassen wenn Apartment wechselt
  useEffect(() => {
    if (selectedApartment && guests > selectedApartment.maxGuests) {
      setGuests(selectedApartment.maxGuests);
    }
  }, [selectedApartment, guests]);

  // ---------------------------------------------------------------------------
  // Booking.com URL mit Datums-Parametern
  // ---------------------------------------------------------------------------

  const bookingComUrl = useMemo(() => {
    if (!selectedApartment) return null;
    const baseUrl = BOOKING_COM_URLS[selectedApartment.slug];
    if (!baseUrl) return null;

    const params = new URLSearchParams();
    params.set('group_adults', String(guests));
    params.set('no_rooms', '1');

    if (checkIn) {
      params.set('checkin', format(checkIn, 'yyyy-MM-dd'));
    }
    if (checkOut) {
      params.set('checkout', format(checkOut, 'yyyy-MM-dd'));
    }

    return `${baseUrl}&${params.toString()}`;
  }, [selectedApartment, checkIn, checkOut, guests]);

  // ---------------------------------------------------------------------------
  // Datumsauswahl-Handler
  // ---------------------------------------------------------------------------

  const handleDateSelect = useCallback((newCheckIn: Date, newCheckOut: Date) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="space-y-8">
          {/* Apartment-Auswahl */}
          <div>
            <h2 className="mb-1 text-xl font-semibold text-text">
              Apartment wählen
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Wählen Sie das gewünschte Apartment für Ihren Aufenthalt.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {APARTMENTS.map((apartment) => {
                const isSelected =
                  selectedApartmentId === apartment.id ||
                  selectedApartmentId === apartment.slug;
                const minPrice = Math.min(
                  ...Object.values(apartment.prices.weekday)
                );

                return (
                  <button
                    key={apartment.id}
                    type="button"
                    onClick={() => {
                      setSelectedApartmentId(apartment.id);
                    }}
                    className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-[var(--transition-base)] ${
                      isSelected
                        ? 'border-accent bg-accent/5 shadow-md'
                        : 'border-border-light bg-white hover:border-border hover:shadow-sm'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {/* Bild */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={apartment.images[0].src}
                        alt={apartment.images[0].alt}
                        fill
                        className="object-cover transition-transform duration-[var(--transition-slow)] group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      {isSelected && (
                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-text">
                        {apartment.name}
                      </h3>
                      <p className="mt-1 text-sm text-text-muted line-clamp-2">
                        {apartment.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            {apartment.sqm > 0 ? `${apartment.sqm} m\u00B2` : apartment.floor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            max. {apartment.maxGuests}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          ab {formatPrice(minPrice)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gäste-Anzahl */}
          {selectedApartment && (
            <div>
              <h2 className="mb-1 text-xl font-semibold text-text">
                Anzahl Gäste
              </h2>
              <p className="mb-4 text-sm text-text-muted">
                Maximal {selectedApartment.maxGuests} {selectedApartment.maxGuests === 1 ? 'Gast' : 'Personen'} in {selectedApartment.name}.
                {selectedApartment.slug === 'erholungs-apartment' && ' Ein Kind ist zusätzlich willkommen.'}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-light transition-all duration-[var(--transition-fast)] hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Gast entfernen"
                >
                  -
                </button>
                <span className="min-w-[80px] text-center text-lg font-semibold text-text">
                  {guests} {guests === 1 ? 'Gast' : 'Gäste'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setGuests(Math.min(selectedApartment.maxGuests, guests + 1))
                  }
                  disabled={guests >= selectedApartment.maxGuests}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-light transition-all duration-[var(--transition-fast)] hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Gast hinzufügen"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Kalender */}
          {selectedApartment && (
            <div>
              <h2 className="mb-1 text-xl font-semibold text-text">
                Verfügbarkeit prüfen
              </h2>
              <p className="mb-4 text-sm text-text-muted">
                Mindestaufenthalt: {selectedApartment.minNights} Nächte. Check-in ab {selectedApartment.checkInTime} Uhr, Check-out bis {selectedApartment.checkOutTime} Uhr.
              </p>

              <Card>
                <CardContent>
                  <AvailabilityCalendar
                    apartmentId={selectedApartment.id}
                    onDateSelect={handleDateSelect}
                    minNights={selectedApartment.minNights}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Booking.com Hinweis & Button */}
          {selectedApartment && (
            <div className="space-y-4">
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-text">
                      Buchen Sie bequem über Booking.com
                    </p>
                    <p className="mt-1 text-sm text-text-light leading-relaxed">
                      Die Buchung erfolgt sicher und einfach über Booking.com.
                      Der aktuelle Preis inkl. aller Rabatte wird Ihnen direkt
                      auf Booking.com angezeigt.
                      {checkIn && checkOut && (
                        <> Ihr gewählter Zeitraum ({format(checkIn, 'd. MMM', { locale: de })} &ndash; {format(checkOut, 'd. MMM yyyy', { locale: de })}) wird automatisch übernommen.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {bookingComUrl && (
                <div className="flex justify-center">
                  <a
                    href={bookingComUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="accent"
                      size="lg"
                      icon={<ExternalLink className="h-4 w-4" />}
                      iconPosition="right"
                    >
                      Auf Booking.com buchen
                    </Button>
                  </a>
                </div>
              )}

              {!bookingComUrl && (
                <p className="flex items-center justify-center gap-1.5 text-sm text-text-muted">
                  <AlertCircle className="h-4 w-4" />
                  Booking.com-Link für dieses Apartment ist nicht verfügbar.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { BookingForm };
