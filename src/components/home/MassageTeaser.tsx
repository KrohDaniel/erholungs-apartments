import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, Clock, Sparkles } from 'lucide-react';
import { PHONE_HREF } from '@/components/layout/Navigation';

const packages = [
  {
    name: 'Wohlf\u00FChlen',
    duration: '60 min',
    price: '75\u20AC',
  },
  {
    name: 'Verspannungsfrei',
    duration: '90 min',
    price: '95\u20AC',
  },
  {
    name: 'Schmerzl\u00F6sung',
    duration: '120 min',
    price: '130\u20AC',
  },
];

export default function MassageTeaser() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-[#E8F0E0] py-16 sm:py-20 lg:py-24">
      {/* Decorative circle */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 z-0" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 z-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <div>
            {/* Label */}
            <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
              Exklusiv f&uuml;r unsere G&auml;ste
            </span>

            <h2 className="mb-4 text-3xl font-bold text-text sm:text-4xl">
              Wohlbefinden Massage
              <br />
              direkt im Haus
            </h2>
            <div className="mb-6 h-1 w-16 rounded-full bg-accent" />

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-text-light">
              G&ouml;nnen Sie sich eine professionelle Massage-Behandlung &ndash;
              direkt in unserem Haus, ohne Anfahrt. Ob R&uuml;ckenschmerzen,
              Verspannungen oder einfach pure Entspannung.
            </p>

            {/* Packages */}
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className="min-w-0 rounded-xl border border-border bg-white p-3 text-center shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-md sm:p-4"
                >
                  <Sparkles className="mx-auto mb-2 h-5 w-5 text-accent" />
                  <h4 className="mb-1 break-words text-sm font-bold leading-tight text-text">
                    {pkg.name}
                  </h4>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>{pkg.duration}</span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {pkg.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Free consultation note */}
            <p className="mb-6 text-sm font-medium text-primary">
              &#10003; Erstgespr&auml;ch kostenlos
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/wohlbefinden-massage/"
                className="group/btn inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-light hover:shadow-lg"
              >
                Mehr erfahren
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
              >
                <Phone className="h-4 w-4" />
                Termin vereinbaren
              </a>
            </div>
          </div>

          {/* Right: Massage image */}
          <div className="relative overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/massage/massage-wohlbefinden.jpg"
                alt="Wohlbefinden Massage - Professionelle Behandlung"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 z-0 h-full w-full rounded-2xl border-2 border-accent/20" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
