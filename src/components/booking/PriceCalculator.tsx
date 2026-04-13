'use client';

import { useMemo } from 'react';
import {
  differenceInDays,
  eachDayOfInterval,
  addDays,
  isWeekend,
  format,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { Calculator, Tag, Moon, Sun, Percent } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { getApartmentBySlug } from '@/lib/constants';
import { calculateTotalPrice, formatPrice } from '@/lib/pricing';
import type { PriceCalculation } from '@/types';

// =============================================================================
// PriceCalculator - Live-Preisberechnung
// =============================================================================

interface PriceCalculatorProps {
  apartmentSlug: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

interface NightBreakdown {
  weekdayNights: number;
  weekendNights: number;
  weekdayPrice: number;
  weekendPrice: number;
}

export default function PriceCalculator({
  apartmentSlug,
  checkIn,
  checkOut,
  guests,
}: PriceCalculatorProps) {
  // ---------------------------------------------------------------------------
  // Preisberechnung
  // ---------------------------------------------------------------------------

  const apartment = useMemo(
    () => getApartmentBySlug(apartmentSlug),
    [apartmentSlug]
  );

  const priceResult = useMemo<PriceCalculation | null>(() => {
    if (!checkIn || !checkOut || !apartmentSlug || guests < 1) return null;
    try {
      return calculateTotalPrice(apartmentSlug, guests, checkIn, checkOut);
    } catch {
      return null;
    }
  }, [apartmentSlug, checkIn, checkOut, guests]);

  const nightBreakdown = useMemo<NightBreakdown | null>(() => {
    if (!checkIn || !checkOut || !apartment) return null;

    const nights = eachDayOfInterval({
      start: checkIn,
      end: addDays(checkOut, -1),
    });

    let weekdayNights = 0;
    let weekendNights = 0;

    for (const night of nights) {
      if (isWeekend(night)) {
        weekendNights++;
      } else {
        weekdayNights++;
      }
    }

    const weekdayPrice = apartment.prices.weekday[guests] ?? 0;
    const weekendPrice = apartment.prices.weekend[guests] ?? 0;

    return { weekdayNights, weekendNights, weekdayPrice, weekendPrice };
  }, [checkIn, checkOut, apartment, guests]);

  // ---------------------------------------------------------------------------
  // Kein Datum ausgewählt
  // ---------------------------------------------------------------------------

  if (!checkIn || !checkOut) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Calculator className="mx-auto mb-3 h-10 w-10 text-text-muted/40" />
          <p className="text-text-muted">Bitte Datum auswählen</p>
          <p className="mt-1 text-sm text-text-muted/60">
            Wählen Sie An- und Abreisedatum, um den Preis zu berechnen.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // Fehler bei Berechnung
  // ---------------------------------------------------------------------------

  if (!priceResult || !nightBreakdown || !apartment) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-red-500">
            Preis konnte nicht berechnet werden. Bitte prüfen Sie Ihre Eingaben.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // Preis-Anzeige
  // ---------------------------------------------------------------------------

  const { nights, subtotal, discount, discountPercentage, total } = priceResult;
  const { weekdayNights, weekendNights, weekdayPrice, weekendPrice } = nightBreakdown;
  const hasDifferentPrices = weekdayPrice !== weekendPrice;
  const hasDiscount = discount > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-text">Preisberechnung</h3>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          {format(checkIn, 'd. MMM', { locale: de })} -{' '}
          {format(checkOut, 'd. MMM yyyy', { locale: de })}
          {' '}({nights} {nights === 1 ? 'Nacht' : 'Nächte'})
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Wochentag-Nächte */}
        {weekdayNights > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-text-light">
              <Moon className="h-4 w-4 text-text-muted" />
              <span>
                {weekdayNights} {weekdayNights === 1 ? 'Wochennacht' : 'Wochennächte'}
                {hasDifferentPrices && (
                  <span className="text-text-muted"> x {formatPrice(weekdayPrice)}</span>
                )}
              </span>
            </div>
            <span className="font-medium text-text">
              {formatPrice(weekdayNights * weekdayPrice)}
            </span>
          </div>
        )}

        {/* Wochenend-Nächte */}
        {weekendNights > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-text-light">
              <Sun className="h-4 w-4 text-text-muted" />
              <span>
                {weekendNights} {weekendNights === 1 ? 'Wochenendnacht' : 'Wochenendnächte'}
                {hasDifferentPrices && (
                  <span className="text-text-muted"> x {formatPrice(weekendPrice)}</span>
                )}
              </span>
            </div>
            <span className="font-medium text-text">
              {formatPrice(weekendNights * weekendPrice)}
            </span>
          </div>
        )}

        {/* Zwischensumme */}
        {(hasDiscount || hasDifferentPrices) && (
          <>
            <div className="border-t border-border-light pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-light">Zwischensumme</span>
                <span className="font-medium text-text">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </>
        )}

        {/* Rabatt */}
        {hasDiscount && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <Percent className="h-4 w-4" />
              <span>
                Langzeitrabatt (-{discountPercentage}%
                {discountPercentage === 10 && ', ab 7 Nächte'}
                {discountPercentage === 20 && ', ab 30 Nächte'})
              </span>
            </div>
            <span className="font-medium text-green-700">
              -{formatPrice(discount)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {/* Gesamtpreis */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-text">Gesamtpreis</p>
            <p className="text-xs text-text-muted">
              Durchschnittlich {formatPrice(total / nights)} pro Nacht
            </p>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(total)}
          </p>
        </div>

        {/* Rabatt-Hinweis falls kein Rabatt, aber nah dran */}
        {!hasDiscount && nights >= 5 && nights < 7 && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent/10 px-3 py-2">
            <Tag className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-xs text-text-light">
              <span className="font-semibold">Tipp:</span> Ab 7 Nächten erhalten Sie 10% Rabatt!
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export { PriceCalculator };
export type { PriceCalculatorProps };
