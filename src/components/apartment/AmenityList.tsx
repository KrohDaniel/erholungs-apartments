import {
  Bed,
  UtensilsCrossed,
  Bath,
  Wifi,
  Car,
  Shirt,
  Droplets,
  Sun,
  Home,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

// =============================================================================
// AmenityList Component
// =============================================================================

interface AmenityListProps {
  amenities: string[];
}

// -----------------------------------------------------------------------------
// Amenity icon mapping
// -----------------------------------------------------------------------------

const amenityIconMap: Record<string, LucideIcon> = {
  Doppelbett: Bed,
  Küche: UtensilsCrossed,
  Badezimmer: Bath,
  Bad: Bath,
  WLAN: Wifi,
  'Kostenlose Parkplätze': Car,
  Parkplatz: Car,
  Bettwäsche: Shirt,
  Handtücher: Droplets,
  Balkon: Sun,
  Erdgeschoss: Home,
  'Gemütliche Atmosphäre': Sparkles,
  Gemütlich: Sparkles,
};

function getIcon(amenity: string): LucideIcon {
  // Exact match first
  if (amenityIconMap[amenity]) return amenityIconMap[amenity];

  // Partial match fallback
  const lowerAmenity = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIconMap)) {
    if (lowerAmenity.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerAmenity)) {
      return icon;
    }
  }

  // Default fallback
  return Sparkles;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function AmenityList({ amenities }: AmenityListProps) {
  return (
    <section aria-labelledby="amenities-heading">
      <h2
        id="amenities-heading"
        className="text-2xl font-semibold text-text mb-6"
      >
        Ausstattung
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {amenities.map((amenity) => {
          const Icon = getIcon(amenity);
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 py-2"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                <Icon size={20} className="text-primary" />
              </div>
              <span className="text-text font-medium">{amenity}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { AmenityList };
export type { AmenityListProps };
