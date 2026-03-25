// =============================================================================
// Erholungs Apartments - Price Calculation Logic
// =============================================================================

import { isWeekend, eachDayOfInterval, differenceInDays, parseISO } from 'date-fns';
import { getApartmentBySlug } from '@/lib/constants';
import type { Apartment, PriceCalculation } from '@/types';

// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------

export class PricingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PricingError';
  }
}

// -----------------------------------------------------------------------------
// Calculate price for a single night
// -----------------------------------------------------------------------------

/**
 * Returns the price for a single night based on the apartment, guest count,
 * and whether the date falls on a weekend (Friday/Saturday night).
 *
 * @param apartmentSlug - slug identifier of the apartment
 * @param guests - number of guests
 * @param date - the night's date (Date object or ISO string)
 * @returns price in EUR for that night
 */
export function calculateNightPrice(
  apartmentSlug: string,
  guests: number,
  date: Date | string
): number {
  const apartment = getApartmentBySlug(apartmentSlug);
  if (!apartment) {
    throw new PricingError(`Apartment "${apartmentSlug}" nicht gefunden.`);
  }

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const priceTable = isWeekend(dateObj) ? apartment.prices.weekend : apartment.prices.weekday;

  // Validate guest count
  if (guests < 1 || guests > apartment.maxGuests) {
    throw new PricingError(
      `Ungültige Gästeanzahl: ${guests}. Erlaubt: 1–${apartment.maxGuests} für ${apartment.name}.`
    );
  }

  const price = priceTable[guests];
  if (price === undefined) {
    throw new PricingError(
      `Kein Preis für ${guests} Gäste in ${apartment.name} konfiguriert.`
    );
  }

  return price;
}

// -----------------------------------------------------------------------------
// Determine applicable discount
// -----------------------------------------------------------------------------

/**
 * Returns the discount percentage for a given number of nights.
 * The highest qualifying discount is applied.
 */
export function getDiscountPercentage(apartment: Apartment, nights: number): number {
  let bestDiscount = 0;

  for (const discount of apartment.discounts) {
    if (nights >= discount.minNights && discount.percentage > bestDiscount) {
      bestDiscount = discount.percentage;
    }
  }

  return bestDiscount;
}

// -----------------------------------------------------------------------------
// Calculate total price for a stay
// -----------------------------------------------------------------------------

/**
 * Calculates the full price breakdown for a stay.
 *
 * @param apartmentSlug - slug identifier of the apartment
 * @param guests - number of guests
 * @param checkIn - check-in date (ISO string YYYY-MM-DD or Date)
 * @param checkOut - check-out date (ISO string YYYY-MM-DD or Date)
 * @returns detailed price breakdown
 */
export function calculateTotalPrice(
  apartmentSlug: string,
  guests: number,
  checkIn: Date | string,
  checkOut: Date | string
): PriceCalculation {
  const apartment = getApartmentBySlug(apartmentSlug);
  if (!apartment) {
    throw new PricingError(`Apartment "${apartmentSlug}" nicht gefunden.`);
  }

  const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;

  // Validate dates
  if (checkOutDate <= checkInDate) {
    throw new PricingError('Das Abreisedatum muss nach dem Anreisedatum liegen.');
  }

  const nights = differenceInDays(checkOutDate, checkInDate);

  // Validate minimum stay
  if (nights < apartment.minNights) {
    throw new PricingError(
      `Mindestaufenthalt: ${apartment.minNights} Nächte. Sie haben ${nights} Nacht/Nächte ausgewählt.`
    );
  }

  // Calculate price for each night
  // eachDayOfInterval includes start, excludes end by using end = day before checkout
  const stayNights = eachDayOfInterval({
    start: checkInDate,
    end: new Date(checkOutDate.getTime() - 24 * 60 * 60 * 1000), // day before checkout
  });

  let subtotal = 0;
  for (const night of stayNights) {
    subtotal += calculateNightPrice(apartmentSlug, guests, night);
  }

  // Apply discount
  const discountPercentage = getDiscountPercentage(apartment, nights);
  const discount = Math.round((subtotal * discountPercentage) / 100 * 100) / 100;
  const total = Math.round((subtotal - discount) * 100) / 100;

  // Average price per night (after discount)
  const pricePerNight = Math.round((total / nights) * 100) / 100;

  return {
    nights,
    pricePerNight,
    subtotal,
    discount,
    discountPercentage,
    total,
  };
}

// -----------------------------------------------------------------------------
// Format price for display
// -----------------------------------------------------------------------------

/**
 * Formats a price value as a German-locale EUR string.
 * Example: 45 -> "45,00 €"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
