'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Home,
  CalendarDays,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  PartyPopper,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { APARTMENTS } from '@/lib/constants';
import { calculateTotalPrice, formatPrice } from '@/lib/pricing';
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar';
import PriceCalculator from '@/components/booking/PriceCalculator';
import type { Apartment, PaymentMethod, PriceCalculation } from '@/types';

// =============================================================================
// BookingForm - Mehrstufiges Buchungsformular
// =============================================================================

const STEPS = [
  { label: 'Apartment & Datum', icon: CalendarDays },
  { label: 'Ihre Daten', icon: User },
  { label: 'Zusammenfassung', icon: CreditCard },
  { label: 'Bestaetigung', icon: Check },
];

interface FormErrors {
  apartmentId?: string;
  dates?: string;
  guests?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  paymentMethod?: string;
}

export default function BookingForm() {
  const searchParams = useSearchParams();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Schritt 1: Apartment, Datum, Gaeste
  const [selectedApartmentId, setSelectedApartmentId] = useState(
    searchParams.get('apartment') || ''
  );
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(
    Number(searchParams.get('guests')) || 1
  );

  // Schritt 2: Gaesteinformationen
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Schritt 3: Zahlungsmethode
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');

  // ---------------------------------------------------------------------------
  // Abgeleitete Werte
  // ---------------------------------------------------------------------------

  const selectedApartment = useMemo<Apartment | undefined>(
    () => APARTMENTS.find((a) => a.id === selectedApartmentId || a.slug === selectedApartmentId),
    [selectedApartmentId]
  );

  const priceCalculation = useMemo<PriceCalculation | null>(() => {
    if (!selectedApartment || !checkIn || !checkOut || guests < 1) return null;
    try {
      return calculateTotalPrice(selectedApartment.slug, guests, checkIn, checkOut);
    } catch {
      return null;
    }
  }, [selectedApartment, checkIn, checkOut, guests]);

  // URL-Parameter fuer initiale Datumsauswahl
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

  // Gaeste-Anzahl anpassen wenn Apartment wechselt
  useEffect(() => {
    if (selectedApartment && guests > selectedApartment.maxGuests) {
      setGuests(selectedApartment.maxGuests);
    }
  }, [selectedApartment, guests]);

  // ---------------------------------------------------------------------------
  // Validierung
  // ---------------------------------------------------------------------------

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: FormErrors = {};

      if (step === 0) {
        if (!selectedApartmentId) {
          newErrors.apartmentId = 'Bitte waehlen Sie ein Apartment aus.';
        }
        if (!checkIn || !checkOut) {
          newErrors.dates = 'Bitte waehlen Sie An- und Abreisedatum aus.';
        } else if (selectedApartment) {
          const nights = differenceInDays(checkOut, checkIn);
          if (nights < selectedApartment.minNights) {
            newErrors.dates = `Mindestaufenthalt: ${selectedApartment.minNights} Naechte.`;
          }
        }
        if (guests < 1) {
          newErrors.guests = 'Mindestens 1 Gast erforderlich.';
        }
        if (selectedApartment && guests > selectedApartment.maxGuests) {
          newErrors.guests = `Maximal ${selectedApartment.maxGuests} Gaeste moeglich.`;
        }
      }

      if (step === 1) {
        if (!guestName.trim()) {
          newErrors.guestName = 'Bitte geben Sie Ihren Namen ein.';
        }
        if (!guestEmail.trim()) {
          newErrors.guestEmail = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
          newErrors.guestEmail = 'Bitte geben Sie eine gueltige E-Mail-Adresse ein.';
        }
        if (!guestPhone.trim()) {
          newErrors.guestPhone = 'Bitte geben Sie Ihre Telefonnummer ein.';
        }
      }

      if (step === 2) {
        if (!paymentMethod) {
          newErrors.paymentMethod = 'Bitte waehlen Sie eine Zahlungsmethode.';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [selectedApartmentId, selectedApartment, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, paymentMethod]
  );

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const goToNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      setSubmitError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateStep]);

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
    setSubmitError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ---------------------------------------------------------------------------
  // Formular absenden
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback(async () => {
    if (!validateStep(2)) return;
    if (!selectedApartment || !checkIn || !checkOut || !priceCalculation) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const body = {
        apartmentId: selectedApartment.id,
        checkIn: format(checkIn, 'yyyy-MM-dd'),
        checkOut: format(checkOut, 'yyyy-MM-dd'),
        guests,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        notes: notes.trim() || undefined,
        paymentMethod,
        totalPrice: priceCalculation.total,
      };

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || 'Buchung konnte nicht erstellt werden.'
        );
      }

      const result = await response.json();

      // Zur Bestaetigung wechseln
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Weiterleitung zur Zahlung wenn URL vorhanden
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [validateStep, selectedApartment, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, notes, paymentMethod, priceCalculation]);

  // ---------------------------------------------------------------------------
  // Datumsauswahl-Handler
  // ---------------------------------------------------------------------------

  const handleDateSelect = useCallback((newCheckIn: Date, newCheckOut: Date) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    setErrors((prev) => ({ ...prev, dates: undefined }));
  }, []);

  // ---------------------------------------------------------------------------
  // Schritt-Fortschrittsanzeige
  // ---------------------------------------------------------------------------

  function renderProgressIndicator() {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.label} className="flex flex-1 items-center">
                {/* Schritt-Punkt */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-[var(--transition-base)] sm:h-12 sm:w-12 ${
                      isCompleted
                        ? 'border-primary bg-primary text-white'
                        : isActive
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-white text-text-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 hidden text-xs font-medium sm:block ${
                      isActive
                        ? 'text-accent'
                        : isCompleted
                          ? 'text-primary'
                          : 'text-text-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Verbindungslinie */}
                {index < STEPS.length - 1 && (
                  <div className="mx-2 h-0.5 flex-1 sm:mx-4">
                    <div
                      className={`h-full rounded-full transition-all duration-[var(--transition-base)] ${
                        index < currentStep ? 'bg-primary' : 'bg-border-light'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobiler Schrittname */}
        <p className="mt-4 text-center text-sm font-medium text-accent sm:hidden">
          Schritt {currentStep + 1}: {STEPS[currentStep].label}
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Schritt 1: Apartment & Datum
  // ---------------------------------------------------------------------------

  function renderStep1() {
    return (
      <div className="space-y-8">
        {/* Apartment-Auswahl */}
        <div>
          <h2 className="mb-1 text-xl font-semibold text-text">
            Apartment waehlen
          </h2>
          <p className="mb-4 text-sm text-text-muted">
            Waehlen Sie das gewuenschte Apartment fuer Ihren Aufenthalt.
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
                    setErrors((prev) => ({ ...prev, apartmentId: undefined }));
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

          {errors.apartmentId && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-500" role="alert">
              <AlertCircle className="h-4 w-4" />
              {errors.apartmentId}
            </p>
          )}
        </div>

        {/* Gaeste-Anzahl */}
        {selectedApartment && (
          <div>
            <h2 className="mb-1 text-xl font-semibold text-text">
              Anzahl Gaeste
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Maximal {selectedApartment.maxGuests} Gaeste in {selectedApartment.name}.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-light transition-all duration-[var(--transition-fast)] hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Gaest entfernen"
              >
                -
              </button>
              <span className="min-w-[80px] text-center text-lg font-semibold text-text">
                {guests} {guests === 1 ? 'Gast' : 'Gaeste'}
              </span>
              <button
                type="button"
                onClick={() =>
                  setGuests(Math.min(selectedApartment.maxGuests, guests + 1))
                }
                disabled={guests >= selectedApartment.maxGuests}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-light transition-all duration-[var(--transition-fast)] hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Gast hinzufuegen"
              >
                +
              </button>
            </div>

            {errors.guests && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-red-500" role="alert">
                <AlertCircle className="h-4 w-4" />
                {errors.guests}
              </p>
            )}
          </div>
        )}

        {/* Kalender */}
        {selectedApartment && (
          <div>
            <h2 className="mb-1 text-xl font-semibold text-text">
              Datum waehlen
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Mindestaufenthalt: {selectedApartment.minNights} Naechte. Check-in ab {selectedApartment.checkInTime} Uhr, Check-out bis {selectedApartment.checkOutTime} Uhr.
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

            {errors.dates && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-red-500" role="alert">
                <AlertCircle className="h-4 w-4" />
                {errors.dates}
              </p>
            )}
          </div>
        )}

        {/* Preisvorschau */}
        {selectedApartment && checkIn && checkOut && (
          <PriceCalculator
            apartmentSlug={selectedApartment.slug}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Schritt 2: Gaesteinformationen
  // ---------------------------------------------------------------------------

  function renderStep2() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold text-text">
            Ihre Kontaktdaten
          </h2>
          <p className="mb-6 text-sm text-text-muted">
            Bitte geben Sie Ihre Daten ein, damit wir Ihre Buchung bearbeiten koennen.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Name"
                name="guestName"
                placeholder="Ihr vollstaendiger Name"
                required
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setErrors((prev) => ({ ...prev, guestName: undefined }));
                }}
                error={errors.guestName}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="E-Mail"
                name="guestEmail"
                type="email"
                placeholder="ihre@email.de"
                required
                value={guestEmail}
                onChange={(e) => {
                  setGuestEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, guestEmail: undefined }));
                }}
                error={errors.guestEmail}
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <Input
              label="Telefon"
              name="guestPhone"
              type="tel"
              placeholder="+49 ..."
              required
              value={guestPhone}
              onChange={(e) => {
                setGuestPhone(e.target.value);
                setErrors((prev) => ({ ...prev, guestPhone: undefined }));
              }}
              error={errors.guestPhone}
              icon={<Phone className="h-4 w-4" />}
            />

            <Textarea
              label="Nachrichten / Besondere Wuensche"
              name="notes"
              placeholder="Haben Sie besondere Wuensche oder Anmerkungen? (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Zusammenfassung der bisherigen Auswahl */}
        {selectedApartment && checkIn && checkOut && (
          <div className="rounded-xl border border-border-light bg-secondary/50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-text">
              Ihre Auswahl
            </h3>
            <div className="grid gap-2 text-sm text-text-light sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-text-muted" />
                {selectedApartment.name}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-text-muted" />
                {format(checkIn, 'd. MMM', { locale: de })} - {format(checkOut, 'd. MMM', { locale: de })}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-text-muted" />
                {guests} {guests === 1 ? 'Gast' : 'Gaeste'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Schritt 3: Zusammenfassung & Zahlung
  // ---------------------------------------------------------------------------

  function renderStep3() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold text-text">
            Buchungsuebersicht
          </h2>
          <p className="mb-6 text-sm text-text-muted">
            Bitte pruefen Sie Ihre Buchungsdaten und waehlen Sie eine Zahlungsmethode.
          </p>
        </div>

        {/* Buchungsdetails */}
        <Card>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-text">Buchungsdetails</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Apartment
                  </p>
                  <p className="mt-0.5 font-medium text-text">
                    {selectedApartment?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Zeitraum
                  </p>
                  <p className="mt-0.5 font-medium text-text">
                    {checkIn && checkOut && (
                      <>
                        {format(checkIn, 'd. MMMM yyyy', { locale: de })}
                        {' '}&ndash;{' '}
                        {format(checkOut, 'd. MMMM yyyy', { locale: de })}
                      </>
                    )}
                  </p>
                  {priceCalculation && (
                    <p className="text-sm text-text-muted">
                      {priceCalculation.nights} {priceCalculation.nights === 1 ? 'Nacht' : 'Naechte'}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Gaeste
                  </p>
                  <p className="mt-0.5 font-medium text-text">
                    {guests} {guests === 1 ? 'Gast' : 'Gaeste'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Kontakt
                  </p>
                  <p className="mt-0.5 font-medium text-text">{guestName}</p>
                  <p className="text-sm text-text-muted">{guestEmail}</p>
                  <p className="text-sm text-text-muted">{guestPhone}</p>
                </div>
              </div>
            </div>

            {notes && (
              <div className="border-t border-border-light pt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Anmerkungen
                </p>
                <p className="mt-0.5 text-sm text-text-light">{notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preisberechnung */}
        {selectedApartment && (
          <PriceCalculator
            apartmentSlug={selectedApartment.slug}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        )}

        {/* Zahlungsmethode */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-text">
            Zahlungsmethode
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Stripe / Kreditkarte */}
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('stripe');
                setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
              }}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-[var(--transition-fast)] ${
                paymentMethod === 'stripe'
                  ? 'border-accent bg-accent/5'
                  : 'border-border-light bg-white hover:border-border'
              }`}
              aria-pressed={paymentMethod === 'stripe'}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  paymentMethod === 'stripe'
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-text-muted'
                }`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-text">Kreditkarte / Stripe</p>
                <p className="text-xs text-text-muted">
                  Visa, Mastercard, SEPA
                </p>
              </div>
              {paymentMethod === 'stripe' && (
                <Check className="ml-auto h-5 w-5 text-accent" />
              )}
            </button>

            {/* PayPal */}
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('paypal');
                setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
              }}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-[var(--transition-fast)] ${
                paymentMethod === 'paypal'
                  ? 'border-accent bg-accent/5'
                  : 'border-border-light bg-white hover:border-border'
              }`}
              aria-pressed={paymentMethod === 'paypal'}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  paymentMethod === 'paypal'
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-text-muted'
                }`}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.564 0-1.04.408-1.13.964L7.076 21.337z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text">PayPal</p>
                <p className="text-xs text-text-muted">
                  Sicher und schnell bezahlen
                </p>
              </div>
              {paymentMethod === 'paypal' && (
                <Check className="ml-auto h-5 w-5 text-accent" />
              )}
            </button>
          </div>

          {errors.paymentMethod && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-500" role="alert">
              <AlertCircle className="h-4 w-4" />
              {errors.paymentMethod}
            </p>
          )}
        </div>

        {/* Fehleranzeige */}
        {submitError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Fehler bei der Buchung</p>
              <p className="mt-1 text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Schritt 4: Bestaetigung
  // ---------------------------------------------------------------------------

  function renderStep4() {
    return (
      <div className="py-8 text-center sm:py-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <PartyPopper className="h-10 w-10 text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-text sm:text-3xl">
          Vielen Dank fuer Ihre Buchung!
        </h2>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-accent" />

        <p className="mx-auto mt-6 max-w-lg text-text-light leading-relaxed">
          Ihre Buchungsanfrage wurde erfolgreich gesendet. Sie erhalten in Kuerze eine
          Bestaetigung per E-Mail an{' '}
          <span className="font-semibold text-text">{guestEmail}</span>.
        </p>

        {/* Buchungsdetails */}
        {selectedApartment && checkIn && checkOut && priceCalculation && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border-light bg-white p-6 text-left shadow-sm">
            <h3 className="mb-4 text-center text-lg font-semibold text-text">
              Ihre Buchung
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Apartment</span>
                <span className="font-medium text-text">{selectedApartment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Anreise</span>
                <span className="font-medium text-text">
                  {format(checkIn, 'd. MMMM yyyy', { locale: de })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Abreise</span>
                <span className="font-medium text-text">
                  {format(checkOut, 'd. MMMM yyyy', { locale: de })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Naechte</span>
                <span className="font-medium text-text">{priceCalculation.nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Gaeste</span>
                <span className="font-medium text-text">{guests}</span>
              </div>
              <div className="border-t border-border-light pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-text">Gesamtpreis</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(priceCalculation.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mx-auto mt-8 max-w-md text-sm text-text-muted">
          Sie werden in Kuerze zur Zahlungsseite weitergeleitet. Falls die Weiterleitung
          nicht automatisch erfolgt, kontaktieren Sie uns bitte telefonisch oder per E-Mail.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a href="/" className="inline-block">
            <Button variant="primary" icon={<Home className="h-4 w-4" />}>
              Zur Startseite
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Navigation-Buttons
  // ---------------------------------------------------------------------------

  function renderNavigation() {
    if (currentStep === 3) return null;

    return (
      <div className="mt-8 flex items-center justify-between border-t border-border-light pt-6">
        {currentStep > 0 ? (
          <Button
            variant="ghost"
            onClick={goToPrev}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Zurueck
          </Button>
        ) : (
          <div />
        )}

        {currentStep < 2 ? (
          <Button
            variant="accent"
            size="lg"
            onClick={goToNext}
            icon={<ChevronRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Weiter
          </Button>
        ) : (
          <Button
            variant="accent"
            size="lg"
            onClick={handleSubmit}
            loading={isSubmitting}
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Jetzt verbindlich buchen
          </Button>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Hauptrender
  // ---------------------------------------------------------------------------

  return (
    <div className="mx-auto max-w-4xl">
      {renderProgressIndicator()}

      <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
        {renderNavigation()}
      </div>
    </div>
  );
}

export { BookingForm };
