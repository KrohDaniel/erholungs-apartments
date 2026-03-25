import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-secondary to-background py-20">
      <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
        {/* 404 Number */}
        <p className="text-8xl font-bold text-primary/20 sm:text-9xl">404</p>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">
          Seite nicht gefunden
        </h1>

        {/* Description */}
        <p className="mt-4 text-lg text-text-light leading-relaxed">
          Die gesuchte Seite existiert leider nicht oder wurde verschoben.
          Vielleicht finden Sie hier, was Sie suchen:
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-light hover:shadow-lg"
          >
            <Home className="h-4 w-4" />
            Zur Startseite
          </Link>
          <Link
            href="/buchen/"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
          >
            Jetzt buchen
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 rounded-2xl border border-border-light bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-text-muted">Beliebte Seiten:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Kellerchen', href: '/erholungs-kellerchen/' },
              { label: 'Apartment', href: '/erholungs-apartment/' },
              { label: 'Massage', href: '/wohlbefinden-massage/' },
              { label: 'Umgebung', href: '/bad-lippspringe/' },
              { label: 'Blog', href: '/blog/' },
              { label: 'Kontakt', href: '/kontakt/' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-secondary px-4 py-2 text-sm text-text-light transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
