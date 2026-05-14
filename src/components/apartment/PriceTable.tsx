import { Clock, Tag, CalendarCheck, ExternalLink } from 'lucide-react';
import { getApartmentBySlug } from '@/lib/constants';

// =============================================================================
// PriceTable Component
// =============================================================================

interface PriceTableProps {
  apartmentSlug: string;
}

export default function PriceTable({ apartmentSlug }: PriceTableProps) {
  const apartment = getApartmentBySlug(apartmentSlug);

  if (!apartment) return null;

  const { prices, discounts, minNights, checkInTime, checkOutTime } = apartment;

  return (
    <section aria-labelledby="prices-heading">
      <h2
        id="prices-heading"
        className="text-2xl font-semibold text-text mb-6"
      >
        Preise
      </h2>

      {/* Price table */}
      <div className="overflow-x-auto rounded-xl border border-border-light">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary">
              <th className="px-5 py-3.5 text-sm font-semibold text-text-light">
                Zeitraum
              </th>
              <th className="px-5 py-3.5 text-sm font-semibold text-text-light text-center">
                1–2 Personen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            <tr className="bg-white hover:bg-background transition-colors">
              <td className="px-5 py-4 text-sm font-medium text-text">
                Pro Nacht
              </td>
              <td className="px-5 py-4 text-center">
                <span className="text-xs text-text-muted">ab </span>
                <span className="text-lg font-semibold text-primary">
                  {prices.weekday[1]}&thinsp;&euro;
                </span>
                <span className="text-xs text-text-muted block">/Nacht</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Booking.com hint */}
      <p className="mt-4 text-xs text-text-muted leading-relaxed">
        Richtpreise &ndash; der aktuelle Preis inkl. Rabatte wird auf Booking.com angezeigt.
      </p>

      {/* Discounts */}
      <div className="mt-5 flex flex-wrap gap-3">
        {discounts.map((discount) => (
          <span
            key={discount.minNights}
            className="
              inline-flex items-center gap-1.5 px-3.5 py-1.5
              bg-accent/10 text-accent-dark border border-accent/20
              rounded-full text-sm font-semibold
            "
          >
            <Tag size={14} />
            <span>{`-${discount.percentage}% ab ${discount.minNights} Nächten`}</span>
          </span>
        ))}
      </div>

      {/* Additional info */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-text-light">
          <CalendarCheck size={18} className="text-primary flex-shrink-0" />
          <span>
            Mindestaufenthalt: <strong className="text-text">{minNights} N&auml;chte</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-light">
          <Clock size={18} className="text-primary flex-shrink-0" />
          <span>
            Check-in ab <strong className="text-text">{checkInTime} Uhr</strong>
            {' '}&middot;{' '}
            Check-out bis <strong className="text-text">{checkOutTime} Uhr</strong>
          </span>
        </div>
      </div>
    </section>
  );
}

export { PriceTable };
export type { PriceTableProps };
