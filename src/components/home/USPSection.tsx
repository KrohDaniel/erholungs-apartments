import { Sparkles, MapPin, PiggyBank, UserCheck } from 'lucide-react';

const usps = [
  {
    icon: Sparkles,
    title: 'Wohlbefinden Massage im Haus',
    description:
      'Professionelle Massage-Behandlungen direkt im selben Geb\u00E4ude. Entspannung ohne Anfahrt.',
  },
  {
    icon: MapPin,
    title: 'Ideale Lage am Kurort',
    description:
      '500m zur Westfalen Therme, 300m zum Kurwald. Alles fu\u00DFl\u00E4ufig erreichbar.',
  },
  {
    icon: PiggyBank,
    title: 'G\u00FCnstiger als Hotels',
    description:
      'Direktbuchung ohne Plattform-Geb\u00FChren. Langzeitrabatte bis -20%.',
  },
  {
    icon: UserCheck,
    title: 'Pers\u00F6nlicher Service',
    description:
      'Ihr pers\u00F6nlicher Gastgeber vor Ort. Individuelle Tipps und Empfehlungen.',
  },
];

export default function USPSection() {
  return (
    <section className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-3xl font-bold text-text sm:text-4xl">
            Warum Erholungs Apartments?
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* USP grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {usps.map((usp) => (
            <div
              key={usp.title}
              className="group rounded-2xl bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
            >
              {/* Icon */}
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20">
                <usp.icon className="h-6 w-6 text-accent" />
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-bold text-text">
                {usp.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-text-muted">
                {usp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
