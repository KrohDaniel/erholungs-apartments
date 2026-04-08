import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

// =============================================================================
// Footer Component
// =============================================================================

const NAV_LINKS = [
  { label: 'Startseite', href: '/' },
  { label: 'Kellerchen', href: '/erholungs-kellerchen' },
  { label: 'Apartment', href: '/erholungs-apartment' },
  { label: 'Buchen', href: '/buchen' },
  { label: 'Massage', href: '/wohlbefinden-massage' },
  { label: 'Umgebung', href: '/bad-lippspringe' },
  { label: 'Bewertungen', href: '/bewertungen' },
  { label: 'Kontakt', href: '/kontakt' },
];

const APARTMENT_LINKS = [
  { label: 'Kellerchen', href: '/erholungs-kellerchen' },
  { label: 'Apartment', href: '/erholungs-apartment' },
];

const LEGAL_LINKS = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutzerklaerung' },
];

export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm text-text-light border-t border-border-light">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 - Logo, Description & Address */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-5">
              <div className="relative w-[44px] h-[44px] shrink-0">
                <Image
                  src="/images/general/logo-ohne-schrift.png"
                  alt="Erholungs Apartments Logo"
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="44px"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold tracking-tight text-primary">
                  Erholungs
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.2em] font-medium text-accent">
                  Apartments
                </span>
              </div>
            </Link>
            <p className="text-sm text-text-light leading-relaxed mb-5">
              Willkommen in unseren liebevoll eingerichteten Ferienwohnungen in
              Bad Lippspringe – Ihr Zuhause für erholsame Tage am Rande des
              Teutoburger Waldes.
            </p>
            <address className="not-italic text-sm text-text-muted leading-relaxed">
              <span className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0 text-primary" />
                <span>
                  Adolf-Kolping-Str. 11
                  <br />
                  33175 Bad Lippspringe
                </span>
              </span>
            </address>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-light hover:text-primary transition-colors duration-[var(--transition-fast)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Apartments */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-5">
              Unsere Apartments
            </h3>
            <ul className="space-y-3">
              {APARTMENT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-light hover:text-primary transition-colors duration-[var(--transition-fast)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-5">
                Rechtliches
              </h3>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-light hover:text-primary transition-colors duration-[var(--transition-fast)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-5">
              Kontakt
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+491771666353"
                  className="flex items-center gap-3 text-sm text-text-light hover:text-primary transition-colors duration-[var(--transition-fast)]"
                >
                  <Phone size={16} className="shrink-0 text-primary" />
                  0177 1666353
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@erholungs-apartments.de"
                  className="flex items-center gap-3 text-sm text-text-light hover:text-primary transition-colors duration-[var(--transition-fast)]"
                >
                  <Mail size={16} className="shrink-0 text-primary" />
                  info@erholungs-apartments.de
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-text-light">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-primary" />
                  <span>
                    Adolf-Kolping-Str. 11
                    <br />
                    33175 Bad Lippspringe
                  </span>
                </div>
              </li>
            </ul>

            {/* Google Maps Embed */}
            <div className="mt-6 rounded-xl overflow-hidden border border-border-light aspect-video">
              <iframe
                src="https://www.google.com/maps?q=Adolf-Kolping-Str.+11,+33175+Bad+Lippspringe,+Deutschland&output=embed&hl=de"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Standort Erholungs Apartments - Adolf-Kolping-Str. 11, Bad Lippspringe"
                className="opacity-80 hover:opacity-100 transition-opacity duration-[var(--transition-base)] w-full h-full min-h-[140px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-light bg-white/60">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-3">
              <div className="relative w-[36px] h-[36px] shrink-0">
                <Image
                  src="/images/general/logo-ohne-schrift.png"
                  alt="Erholungs Apartments Logo"
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="36px"
                />
              </div>
              <p>&copy; {new Date().getFullYear()} Erholungs Apartments. Alle Rechte vorbehalten.</p>
            </div>
            <div className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-primary transition-colors duration-[var(--transition-fast)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
