import { MapPin, Car, Wifi, Heart } from 'lucide-react';

const trustItems = [
  {
    icon: MapPin,
    text: '500m zur Westfalen Therme',
  },
  {
    icon: Car,
    text: 'Kostenlos Parken',
  },
  {
    icon: Wifi,
    text: 'Schnelles WLAN',
  },
  {
    icon: Heart,
    text: 'Wohlbefinden Massage im Haus',
  },
];

export default function TrustBar() {
  return (
    <section
      id="trust-bar"
      className="border-b border-border bg-secondary"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 md:gap-0">
          {trustItems.map((item, index) => (
            <div
              key={item.text}
              className={`flex flex-col items-center gap-1.5 px-2 py-2 text-center sm:flex-row sm:justify-center sm:gap-3 sm:px-4 ${
                index < trustItems.length - 1
                  ? 'md:border-r md:border-border'
                  : ''
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-xs font-medium text-text-light sm:text-sm">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
