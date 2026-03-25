import Link from 'next/link';
import { Waves, TreePine, Mountain, ArrowRight } from 'lucide-react';

const highlights = [
  {
    icon: Waves,
    name: 'Westfalen Therme',
    distance: '500m Entfernung',
    description:
      'Entspannen Sie in der beliebten Therme mit Wasserwelt und Saunalandschaft.',
  },
  {
    icon: TreePine,
    name: 'Kurwald',
    distance: '300m Entfernung',
    description:
      'Genie\u00DFen Sie das Heilklima im wundersch\u00F6nen Kurwald Bad Lippspringe.',
  },
  {
    icon: Mountain,
    name: 'Externsteine',
    distance: '12km Entfernung',
    description:
      'Besuchen Sie das faszinierende Naturdenkmal im Teutoburger Wald.',
  },
];

export default function UmgebungTeaser() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-3xl font-bold text-text sm:text-4xl">
            Erleben Sie Bad Lippspringe
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" />
          <p className="mx-auto max-w-2xl text-text-muted">
            Entdecken Sie die sch&ouml;nsten Ausflugsziele rund um unsere
            Ferienwohnungen
          </p>
        </div>

        {/* Highlight cards */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {highlights.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Top bar with icon */}
              <div className="flex items-center gap-4 border-b border-border-light bg-background p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">
                    {item.name}
                  </h3>
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {item.distance}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <p className="leading-relaxed text-text-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* All highlights link */}
        <div className="text-center">
          <Link
            href="/bad-lippspringe/"
            className="group/btn inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
          >
            Alle Highlights entdecken
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
