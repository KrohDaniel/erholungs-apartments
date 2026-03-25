import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

// =============================================================================
// Datenschutzerklaerung Page - SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: `Datenschutzerklärung der ${SITE_CONFIG.name}. Informationen zum Datenschutz gemäß DSGVO.`,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/datenschutzerklaerung',
  },
};

// =============================================================================
// Datenschutzerklaerung Page
// =============================================================================

export default function DatenschutzerklaerungPage() {
  return (
    <>
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
            <li className="font-medium text-text">Datenschutzerkl&auml;rung</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text sm:text-4xl">
            Datenschutzerkl&auml;rung
          </h1>
          <div className="mt-4 h-1 w-16 rounded-full bg-accent" />

          <div className="mt-10 space-y-10 text-text-light leading-relaxed">
            {/* 1. Verantwortliche Stelle */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                1. Verantwortliche Stelle
              </h2>
              <p>
                Verantwortlich f&uuml;r die Datenverarbeitung auf dieser Website ist:
              </p>
              <address className="mt-3 not-italic rounded-xl bg-secondary p-5 leading-relaxed">
                <p className="font-semibold text-text">{SITE_CONFIG.owner}</p>
                <p>{SITE_CONFIG.address}</p>
                <p>{SITE_CONFIG.zip} {SITE_CONFIG.city}</p>
                <p className="mt-2">Telefon: +49 (0) {SITE_CONFIG.phone}</p>
                <p>
                  E-Mail:{' '}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-primary hover:text-primary-light transition-colors duration-[var(--transition-fast)] underline underline-offset-2"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </p>
              </address>
            </div>

            {/* 2. Erhebung personenbezogener Daten */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                2. Erhebung und Speicherung personenbezogener Daten
              </h2>
              <p>
                Beim Besuch unserer Website werden automatisch Informationen an den
                Server unserer Website gesendet. Diese Informationen werden
                tempor&auml;r in einem sogenannten Logfile gespeichert. Folgende
                Informationen werden dabei ohne Ihr Zutun erfasst und bis zur
                automatisierten L&ouml;schung gespeichert:
              </p>
              <ul className="mt-4 list-disc space-y-1.5 pl-6">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>
                  Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners
                  sowie der Name Ihres Access-Providers
                </li>
              </ul>
              <p className="mt-4">
                Die genannten Daten werden durch uns zu folgenden Zwecken
                verarbeitet:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6">
                <li>
                  Gew&auml;hrleistung eines reibungslosen Verbindungsaufbaus der
                  Website
                </li>
                <li>
                  Gew&auml;hrleistung einer komfortablen Nutzung unserer Website
                </li>
                <li>Auswertung der Systemsicherheit und -stabilit&auml;t</li>
                <li>Weitere administrative Zwecke</li>
              </ul>
              <p className="mt-4">
                Die Rechtsgrundlage f&uuml;r die Datenverarbeitung ist Art. 6
                Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse folgt aus
                den oben aufgelisteten Zwecken zur Datenerhebung. In keinem Fall
                verwenden wir die erhobenen Daten zu dem Zweck, R&uuml;ckschl&uuml;sse
                auf Ihre Person zu ziehen.
              </p>
            </div>

            {/* 3. Cookies */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">3. Cookies</h2>
              <p>
                Wir setzen auf unserer Website Cookies ein. Hierbei handelt es sich
                um kleine Dateien, die Ihr Browser automatisch erstellt und die auf
                Ihrem Endger&auml;t (Laptop, Tablet, Smartphone o. &Auml;.) gespeichert
                werden, wenn Sie unsere Seite besuchen.
              </p>
              <p className="mt-3">
                Cookies richten auf Ihrem Endger&auml;t keinen Schaden an, enthalten
                keine Viren, Trojaner oder sonstige Schadsoftware. In dem Cookie
                werden Informationen abgelegt, die sich jeweils im Zusammenhang mit
                dem spezifisch eingesetzten Endger&auml;t ergeben.
              </p>
              <p className="mt-3">
                <strong className="text-text">Technisch notwendige Cookies:</strong>{' '}
                Diese sind erforderlich, um die Grundfunktionen der Website
                sicherzustellen (z. B. Sitzungs-Cookies). Sie werden nach Ende
                Ihres Besuchs automatisch gel&ouml;scht.
              </p>
              <p className="mt-3">
                <strong className="text-text">Analytische Cookies:</strong>{' '}
                Diese Cookies helfen uns, das Nutzungsverhalten zu verstehen und
                unsere Website zu verbessern. Sie werden nur mit Ihrer Einwilligung
                gesetzt.
              </p>
              <p className="mt-3">
                Sie k&ouml;nnen Ihre Browser-Einstellung individuell anpassen und
                das Setzen von Cookies einschr&auml;nken oder verhindern. Bitte
                beachten Sie, dass dadurch die Funktionalit&auml;t unserer Website
                eingeschr&auml;nkt sein kann.
              </p>
            </div>

            {/* 4. Google Analytics */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                4. Google Analytics (GA4)
              </h2>
              <p>
                Diese Website nutzt Google Analytics 4 (GA4), einen
                Webanalysedienst der Google Ireland Limited (&bdquo;Google&ldquo;),
                Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
              <p className="mt-3">
                Google Analytics verwendet Cookies, die eine Analyse Ihrer
                Benutzung der Website erm&ouml;glichen. Die durch das Cookie
                erzeugten Informationen &uuml;ber Ihre Benutzung dieser Website werden
                in der Regel an einen Server von Google in den USA &uuml;bertragen
                und dort gespeichert.
              </p>
              <p className="mt-3">
                <strong className="text-text">IP-Anonymisierung:</strong>{' '}
                Wir haben auf dieser Website die IP-Anonymisierung aktiviert.
                Dadurch wird Ihre IP-Adresse von Google innerhalb von
                Mitgliedstaaten der Europ&auml;ischen Union oder in anderen
                Vertragsstaaten des Abkommens &uuml;ber den Europ&auml;ischen
                Wirtschaftsraum vor der &Uuml;bermittlung in die USA gek&uuml;rzt.
              </p>
              <p className="mt-3">
                Die Nutzung von Google Analytics erfolgt auf Grundlage Ihrer
                Einwilligung gem&auml;&szlig; Art. 6 Abs. 1 S. 1 lit. a DSGVO. Sie
                k&ouml;nnen Ihre Einwilligung jederzeit widerrufen, indem Sie Ihre
                Cookie-Einstellungen anpassen.
              </p>
              <p className="mt-3">
                N&auml;here Informationen zu Nutzungsbedingungen und Datenschutz
                finden Sie unter{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-light transition-colors duration-[var(--transition-fast)] underline underline-offset-2"
                >
                  https://policies.google.com/privacy
                </a>
                .
              </p>
            </div>

            {/* 5. Kontaktformular */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                5. Kontaktformular
              </h2>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
                Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
                angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und f&uuml;r
                den Fall von Anschlussfragen bei uns gespeichert.
              </p>
              <p className="mt-3">
                Die Verarbeitung der in das Kontaktformular eingegebenen Daten
                erfolgt somit ausschlie&szlig;lich auf Grundlage Ihrer Einwilligung
                (Art. 6 Abs. 1 lit. a DSGVO). Sie k&ouml;nnen diese Einwilligung
                jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per
                E-Mail an uns. Die Rechtm&auml;&szlig;igkeit der bis zum Widerruf
                erfolgten Datenverarbeitungsvorg&auml;nge bleibt vom Widerruf
                unber&uuml;hrt.
              </p>
              <p className="mt-3">
                Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei
                uns, bis Sie uns zur L&ouml;schung auffordern, Ihre Einwilligung zur
                Speicherung widerrufen oder der Zweck f&uuml;r die Datenspeicherung
                entf&auml;llt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage).
                Zwingende gesetzliche Bestimmungen &ndash; insbesondere
                Aufbewahrungsfristen &ndash; bleiben unber&uuml;hrt.
              </p>
            </div>

            {/* 6. Zahlungsdaten */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                6. Zahlungsdatenverarbeitung (Stripe / PayPal)
              </h2>
              <p>
                F&uuml;r die Abwicklung von Zahlungen nutzen wir die Dienste von
                Stripe und PayPal. Ihre Zahlungsdaten werden direkt an die
                jeweiligen Zahlungsdienstleister &uuml;bermittelt und dort
                verarbeitet. Wir selbst speichern keine vollst&auml;ndigen
                Kreditkarten- oder Bankkontodaten.
              </p>
              <p className="mt-4">
                <strong className="text-text">Stripe:</strong>{' '}
                Stripe Inc., 510 Townsend Street, San Francisco, CA 94103, USA.
                Datenschutzerkl&auml;rung:{' '}
                <a
                  href="https://stripe.com/de/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-light transition-colors duration-[var(--transition-fast)] underline underline-offset-2"
                >
                  https://stripe.com/de/privacy
                </a>
              </p>
              <p className="mt-3">
                <strong className="text-text">PayPal:</strong>{' '}
                PayPal (Europe) S.&agrave; r.l. et Cie, S.C.A., 22-24 Boulevard
                Royal, L-2449 Luxembourg. Datenschutzerkl&auml;rung:{' '}
                <a
                  href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-light transition-colors duration-[var(--transition-fast)] underline underline-offset-2"
                >
                  https://www.paypal.com/de/webapps/mpp/ua/privacy-full
                </a>
              </p>
              <p className="mt-3">
                Die Rechtsgrundlage f&uuml;r die Datenverarbeitung ist Art. 6
                Abs. 1 S. 1 lit. b DSGVO (Vertragserf&uuml;llung).
              </p>
            </div>

            {/* 7. Rechte der Betroffenen */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                7. Rechte der Betroffenen
              </h2>
              <p>
                Sie haben gegen&uuml;ber uns folgende Rechte hinsichtlich Ihrer
                personenbezogenen Daten:
              </p>
              <ul className="mt-4 list-disc space-y-1.5 pl-6">
                <li>
                  <strong className="text-text">Recht auf Auskunft</strong> &ndash;
                  Sie k&ouml;nnen Auskunft &uuml;ber Ihre von uns verarbeiteten
                  personenbezogenen Daten verlangen (Art. 15 DSGVO).
                </li>
                <li>
                  <strong className="text-text">Recht auf Berichtigung</strong> &ndash;
                  Sie k&ouml;nnen die Berichtigung unrichtiger oder die
                  Vervollst&auml;ndigung Ihrer bei uns gespeicherten
                  personenbezogenen Daten verlangen (Art. 16 DSGVO).
                </li>
                <li>
                  <strong className="text-text">Recht auf L&ouml;schung</strong> &ndash;
                  Sie k&ouml;nnen die L&ouml;schung Ihrer bei uns gespeicherten
                  personenbezogenen Daten verlangen (Art. 17 DSGVO).
                </li>
                <li>
                  <strong className="text-text">
                    Recht auf Einschr&auml;nkung der Verarbeitung
                  </strong>{' '}
                  &ndash; Sie k&ouml;nnen die Einschr&auml;nkung der Verarbeitung
                  Ihrer personenbezogenen Daten verlangen (Art. 18 DSGVO).
                </li>
                <li>
                  <strong className="text-text">Recht auf Daten&uuml;bertragbarkeit</strong>{' '}
                  &ndash; Sie k&ouml;nnen verlangen, dass wir Ihnen Ihre
                  personenbezogenen Daten in einem strukturierten, g&auml;ngigen und
                  maschinenlesbaren Format &uuml;bermitteln (Art. 20 DSGVO).
                </li>
                <li>
                  <strong className="text-text">Widerspruchsrecht</strong> &ndash;
                  Sie k&ouml;nnen der Verarbeitung Ihrer personenbezogenen Daten
                  widersprechen (Art. 21 DSGVO).
                </li>
              </ul>
              <p className="mt-4">
                Dar&uuml;ber hinaus haben Sie das Recht, sich bei einer
                Datenschutz-Aufsichtsbeh&ouml;rde &uuml;ber die Verarbeitung Ihrer
                personenbezogenen Daten durch uns zu beschweren.
              </p>
            </div>

            {/* 8. SSL-Verschluesselung */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                8. SSL-/TLS-Verschl&uuml;sselung
              </h2>
              <p>
                Diese Website nutzt aus Sicherheitsgr&uuml;nden und zum Schutz der
                &Uuml;bertragung vertraulicher Inhalte, wie zum Beispiel
                Buchungsanfragen oder Kontaktanfragen, die Sie an uns als
                Seitenbetreiber senden, eine SSL-/TLS-Verschl&uuml;sselung.
              </p>
              <p className="mt-3">
                Eine verschl&uuml;sselte Verbindung erkennen Sie daran, dass die
                Adresszeile des Browsers von &bdquo;http://&ldquo; auf
                &bdquo;https://&ldquo; wechselt und an dem Schloss-Symbol in Ihrer
                Browserzeile.
              </p>
              <p className="mt-3">
                Wenn die SSL-/TLS-Verschl&uuml;sselung aktiviert ist, k&ouml;nnen
                die Daten, die Sie an uns &uuml;bermitteln, nicht von Dritten
                mitgelesen werden.
              </p>
            </div>

            {/* 9. Aktualitaet */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-text">
                9. Aktualit&auml;t und &Auml;nderung dieser Datenschutzerkl&auml;rung
              </h2>
              <p>
                Diese Datenschutzerkl&auml;rung ist aktuell g&uuml;ltig und hat den
                Stand Januar 2025.
              </p>
              <p className="mt-3">
                Durch die Weiterentwicklung unserer Website oder aufgrund
                ge&auml;nderter gesetzlicher beziehungsweise beh&ouml;rdlicher Vorgaben
                kann es notwendig werden, diese Datenschutzerkl&auml;rung zu
                &auml;ndern. Die jeweils aktuelle Datenschutzerkl&auml;rung kann
                jederzeit auf dieser Seite von Ihnen abgerufen und ausgedruckt
                werden.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
