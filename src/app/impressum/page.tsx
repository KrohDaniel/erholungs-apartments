import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { SITE_CONFIG } from '@/lib/constants';

// =============================================================================
// Impressum Page - SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Impressum',
  description: `Impressum der ${SITE_CONFIG.name}. Angaben gemäß § 5 TMG.`,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/impressum/',
  },
};

// =============================================================================
// Impressum Page
// =============================================================================

export default function ImpressumPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Startseite', href: '/' },
          { name: 'Impressum', href: '/impressum/' },
        ]}
      />
      {/* Breadcrumb */}
      <nav className="bg-secondary" aria-label="Breadcrumb">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-1.5 text-sm text-text-muted">
            <li>
              <Link href="/" className="hover:text-primary transition-colors duration-[var(--transition-fast)]">
                Startseite
              </Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="font-medium text-text">Impressum</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text sm:text-4xl">
            Impressum
          </h1>
          <div className="mt-4 h-1 w-16 rounded-full bg-accent" />

          <div className="mt-10 space-y-10 text-text-light leading-relaxed">
            {/* Angaben gem. § 5 TMG */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                Angaben gem&auml;&szlig; &sect; 5 TMG
              </h2>
              <address className="not-italic leading-relaxed">
                <p className="font-semibold text-text">{SITE_CONFIG.owner}</p>
                <p>{SITE_CONFIG.address}</p>
                <p>{SITE_CONFIG.zip} {SITE_CONFIG.city}</p>
                <p>{SITE_CONFIG.country}</p>
              </address>
            </div>

            {/* Kontakt */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">Kontakt</h2>
              <p>Telefon: <a href={`tel:+49${SITE_CONFIG.phone.replace(/^0/, '').replace(/\s/g, '')}`} className="text-primary hover:text-primary-light transition-colors duration-[var(--transition-fast)] underline underline-offset-2">+49 {SITE_CONFIG.phone.replace(/^0/, '')}</a></p>
              <p>
                E-Mail:{' '}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-primary hover:text-primary-light transition-colors duration-[var(--transition-fast)] underline underline-offset-2"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
            </div>

            {/* Umsatzsteuer-ID */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                Umsatzsteuer-ID
              </h2>
              <p>
                Kleinunternehmer gem&auml;&szlig; &sect; 19 UStG &ndash;
                es wird keine Umsatzsteuer erhoben.
              </p>
            </div>

            {/* Streitschlichtung */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                EU-Streitschlichtung
              </h2>
              <p>
                Die Europ&auml;ische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-light transition-colors duration-[var(--transition-fast)] underline underline-offset-2"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                .
              </p>
              <p className="mt-3">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>

            {/* Verbraucherstreitbeilegung */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </p>
            </div>

            {/* Haftung für Inhalte */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                Haftung f&uuml;r Inhalte
              </h2>
              <p>
                Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs. 1 TMG
                f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen
                Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder
                gespeicherte fremde Informationen zu &uuml;berwachen oder nach
                Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit
                hinweisen.
              </p>
              <p className="mt-3">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unber&uuml;hrt. Eine diesbez&uuml;gliche Haftung ist jedoch erst ab dem
                Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m&ouml;glich.
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                diese Inhalte umgehend entfernen.
              </p>
            </div>

            {/* Haftung für Links */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                Haftung f&uuml;r Links
              </h2>
              <p>
                Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren
                Inhalte wir keinen Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r
                diese fremden Inhalte auch keine Gew&auml;hr &uuml;bernehmen. F&uuml;r
                die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                wurden zum Zeitpunkt der Verlinkung auf m&ouml;gliche
                Rechtsverst&ouml;&szlig;e &uuml;berpr&uuml;ft. Rechtswidrige Inhalte
                waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
              <p className="mt-3">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
                derartige Links umgehend entfernen.
              </p>
            </div>

            {/* Urheberrecht */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes
                bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors
                bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f&uuml;r
                den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p className="mt-3">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
                wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
                werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
                trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
                wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
