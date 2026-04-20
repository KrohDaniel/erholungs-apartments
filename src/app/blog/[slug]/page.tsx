import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Tag,
  Share2,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  BookOpen,
} from 'lucide-react';
import SchemaMarkup, { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { SITE_CONFIG } from '@/lib/constants';

// =============================================================================
// Blog Post Data
// =============================================================================

interface BlogPostFull {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
  image?: string;
}

const blogPostData: Record<string, BlogPostFull> = {
  'die-besten-wanderwege-rund-um-bad-lippspringe': {
    slug: 'die-besten-wanderwege-rund-um-bad-lippspringe',
    title: 'Die 5 besten Wanderwege rund um Bad Lippspringe',
    excerpt:
      'Von kurzen Kurwald-Spaziergängen bis zur Tagestour zu den Externsteinen: Entdecken Sie die schönsten Wanderrouten im Teutoburger Wald mit GPS-Daten, Schwierigkeitsgraden und Insider-Tipps.',
    date: '2025-03-15',
    category: 'Ausflugsziele',
    readTime: '8 Min.',
    image: '/images/blog/wanderwege-waldweg.jpg',
    content: `
      <h2>Warum Bad Lippspringe ein Wanderparadies ist</h2>
      <p>
        Bad Lippspringe liegt am Rand des Teutoburger Waldes und ist damit ein idealer Ausgangspunkt
        für Wanderungen aller Schwierigkeitsgrade. Der Ort verfügt über einen <strong>zertifizierten
        Heilwald</strong> mit besonders reiner Luft, die nachweislich die Atemwege stärkt. Ob Sie nur
        eine halbe Stunde spazieren gehen möchten oder eine ganztägige Wanderung planen – wir haben
        für Sie die fünf schönsten Routen zusammengestellt.
      </p>
      <p>
        Übrigens: Alle Touren starten bequem von unseren
        <a href="/erholungs-apartment/">Erholungs Apartments</a> aus, die nur wenige Gehminuten
        vom Kurwald entfernt liegen.
      </p>

      <h2>Tour 1: Der Kurwald-Rundweg – 3 km, leicht</h2>
      <p>
        <strong>Dauer:</strong> ca. 45–60 Minuten | <strong>Schwierigkeit:</strong> Leicht |
        <strong>Höhenmeter:</strong> minimal
      </p>
      <p>
        Direkt vor unserer Haustür beginnt der Kurwald-Rundweg. Auf rund 3 Kilometern führt er
        durch den heilklimatischen Kurwald Bad Lippspringes. Entlang der Strecke finden Sie
        <strong>Kneippanlagen</strong>, Ruhebänke und informative Tafeln zur heimischen Flora und
        Fauna. Besonders angenehm: Die Terrainkurwege sind nach Schwierigkeitsgrad farblich markiert,
        sodass Sie Ihre Belastung individuell steuern können.
      </p>
      <p>
        <strong>Unser Tipp:</strong> Starten Sie am frühen Morgen, wenn der Wald noch im Nebel liegt –
        die Atmosphäre ist dann besonders magisch. Im Anschluss ist der Weg zur
        <a href="/bad-lippspringe/westfalen-therme/">Westfalen Therme</a> nur 500 Meter weit.
      </p>

      <h2>Tour 2: Zu den Externsteinen – 12 km, mittel</h2>
      <p>
        <strong>Dauer:</strong> ca. 3–4 Stunden | <strong>Schwierigkeit:</strong> Mittel |
        <strong>Höhenmeter:</strong> ca. 180 m
      </p>
      <p>
        Die <a href="/bad-lippspringe/externsteine/">Externsteine</a> gehören zu den
        bekanntesten Naturdenkmälern Deutschlands. Die markanten Sandsteinfelsen ragen bis zu
        40 Meter in die Höhe und ziehen jährlich über 500.000 Besucher an. Der Wanderweg von
        Bad Lippspringe führt durch abwechslungsreiche Landschaft mit Waldpassagen, offenen
        Feldern und herrlichen Aussichtspunkten.
      </p>
      <p>
        Am Ziel erwarten Sie die beeindruckenden Felsen, ein idyllischer See und ein Informationszentrum.
        Der Eintritt zum Felsen kostet nur wenige Euro und ist jeden Cent wert – die Aussicht von oben
        über den Teutoburger Wald ist atemberaubend.
      </p>

      <h2>Tour 3: Der Arminiusweg – 8 km, mittel</h2>
      <p>
        <strong>Dauer:</strong> ca. 2,5 Stunden | <strong>Schwierigkeit:</strong> Mittel |
        <strong>Höhenmeter:</strong> ca. 120 m
      </p>
      <p>
        Dieser Rundweg führt entlang des Eggewegs und bietet spektakuläre Ausblicke auf die
        westfälische Ebene. Der Weg ist gut ausgeschildert und führt durch Buchenwälder, an
        Quellen vorbei und über sanfte Hügel. Benannt nach dem Cheruskerfürsten Arminius, der
        in dieser Region die berühmte Varusschlacht führte, verbindet er Natur mit Geschichte.
      </p>

      <h2>Tour 4: Gartenschau-Rundgang – 4 km, leicht</h2>
      <p>
        <strong>Dauer:</strong> ca. 1–1,5 Stunden | <strong>Schwierigkeit:</strong> Leicht |
        <strong>Höhenmeter:</strong> minimal
      </p>
      <p>
        Das Gelände der <a href="/bad-lippspringe/gartenschau/">ehemaligen Landesgartenschau 2017</a>
        ist ein wunderschöner Park mit Themengärten, Spielplätzen und Wasserflächen. Der Rundweg
        eignet sich perfekt für Familien und alle, die einen entspannten Spaziergang im Grünen suchen.
        Im Frühling blühen hier Tulpen und Narzissen, im Sommer Rosen und Stauden.
      </p>

      <h2>Tour 5: Lippequellweg – 6 km, leicht bis mittel</h2>
      <p>
        <strong>Dauer:</strong> ca. 1,5–2 Stunden | <strong>Schwierigkeit:</strong> Leicht bis mittel |
        <strong>Höhenmeter:</strong> ca. 60 m
      </p>
      <p>
        Dieser Weg führt zur Lippequelle, der zweitstärksten natürlichen Quelle Deutschlands.
        Die Lippe entspringt direkt in Bad Lippspringe und fließt 220 km bis zum Rhein. Der
        Lippequellweg kombiniert Stadtgeschichte mit Naturerlebnis und ist auch im Winter reizvoll.
      </p>

      <h2>Praktische Tipps für Ihre Wanderung</h2>
      <ul>
        <li><strong>Schuhwerk:</strong> Feste Wanderschuhe für Tour 2 und 3, bequeme Sneaker reichen für Tour 1, 4 und 5</li>
        <li><strong>Verpflegung:</strong> Wasser und Proviant mitnehmen – auf den längeren Touren gibt es unterwegs keine Einkehrmöglichkeiten</li>
        <li><strong>Beste Jahreszeit:</strong> Frühling (April–Mai) und Herbst (September–Oktober) bieten die schönsten Farben</li>
        <li><strong>Karten:</strong> Die Tourist-Information Bad Lippspringe (Am Kurpark 1) hat kostenlose Wanderkarten</li>
        <li><strong>Markierung:</strong> Die Terrainkurwege sind farblich markiert: Grün = leicht, Blau = mittel, Rot = schwer</li>
      </ul>

      <h2>Nach der Wanderung: Erholung pur</h2>
      <p>
        Nach einer erfüllenden Wanderung gibt es nichts Besseres als Erholung. In unseren
        <a href="/erholungs-apartment/">Erholungs Apartments</a> können Sie die Füße hochlegen,
        oder Sie gönnen sich eine wohltuende
        <a href="/wohlbefinden-massage/">Massage direkt im Haus</a> – Ihre Muskeln werden es
        Ihnen danken. Und wenn Sie den Tag noch ausklingen lassen möchten, ist die
        <a href="/bad-lippspringe/westfalen-therme/">Westfalen Therme</a> nur 5 Gehminuten entfernt.
      </p>
      <p>
        <strong><a href="/buchen/">Jetzt Ferienwohnung buchen</a></strong> und Bad Lippspringe
        zu Fuß entdecken – ab 45 € pro Nacht.
      </p>
    `,
  },

  'westfalen-therme-tipps-fuer-ihren-besuch': {
    slug: 'westfalen-therme-tipps-fuer-ihren-besuch',
    title: 'Westfalen Therme Bad Lippspringe: Der komplette Guide für Ihren Besuch',
    excerpt:
      'Alles über die Westfalen Therme: Saunalandschaft, Solebecken, Preise, Öffnungszeiten und unsere Insider-Tipps für den perfekten Thermentag – nur 500 m von unseren Apartments.',
    date: '2025-02-20',
    category: 'Wellness',
    readTime: '9 Min.',
    image: '/images/blog/therme-indoor-pool.jpg',
    content: `
      <h2>Die Westfalen Therme: Wellness direkt um die Ecke</h2>
      <p>
        Die <a href="/bad-lippspringe/westfalen-therme/">Westfalen Therme</a> in Bad Lippspringe
        gehört zu den beliebtesten Wellness-Einrichtungen in Ostwestfalen-Lippe. Auf über
        5.000 m² Wasserfläche bietet sie Solebecken, eine weitläufige Saunalandschaft und
        einen gepflegten Außenbereich. Von unseren
        <a href="/erholungs-apartment/">Erholungs Apartments</a> aus erreichen Sie die Therme
        in nur <strong>5 bis 7 Gehminuten zu Fuß</strong> – kein Auto nötig.
      </p>

      <h2>Was erwartet Sie in der Westfalen Therme?</h2>

      <h3>Solebecken und Wasserwelt</h3>
      <p>
        Das Herzstück der Therme sind die Solebecken mit einem Salzgehalt von bis zu 12 %.
        Das Sole-Wasser wirkt nachweislich wohltuend auf Haut, Gelenke und Atemwege. Neben
        den Innenbecken gibt es ein großzügiges Außenbecken, das auch im Winter bei dampfender
        Wasseroberfläche ein besonderes Erlebnis bietet. Wassertemperaturen liegen zwischen
        32 °C und 36 °C – ideal zum langen Entspannen.
      </p>

      <h3>Saunalandschaft</h3>
      <p>
        Die weitläufige Saunalandschaft bietet mehrere Saunen für jeden Geschmack:
      </p>
      <ul>
        <li><strong>Finnische Sauna</strong> (90 °C) – der Klassiker mit regelmäßigen Aufgüssen</li>
        <li><strong>Bio-Sauna</strong> (60 °C) – milder, mit aromatischen Kräuterdüften</li>
        <li><strong>Dampfbad</strong> (45 °C) – besonders schonend und ideal für Einsteiger</li>
        <li><strong>Infrarot-Kabine</strong> – gezielte Tiefenwärme für verspannte Muskeln</li>
      </ul>
      <p>
        Besonders empfehlenswert sind die <strong>Aufguss-Zeremonien</strong>, bei denen erfahrene
        Saunameister mit verschiedenen ätherischen Ölen arbeiten. Die Aufguss-Zeiten sind im
        Eingangsbereich ausgehängt – planen Sie Ihren Besuch entsprechend.
      </p>

      <h3>Außenbereich und Gastronomie</h3>
      <p>
        Bei schönem Wetter lässt es sich im gepflegten Außenbereich auf Liegen wunderbar entspannen.
        Die hauseigene Gastronomie bietet leichte Gerichte, Salate, Snacks und eine gute Auswahl
        an Getränken. Tipp: Die frisch gepressten Säfte sind eine gesunde Erfrischung nach dem Saunagang.
      </p>

      <h2>Preise und Öffnungszeiten</h2>
      <p>
        Die aktuellen Eintrittspreise und Öffnungszeiten finden Sie direkt auf der
        <a href="https://www.westfalentherme.de" target="_blank" rel="noopener noreferrer">offiziellen Website der Westfalen Therme</a>.
        Als grobe Orientierung: Ein 4-Stunden-Ticket für die Therme inklusive Saunalandschaft
        liegt bei ca. 20–30 € (Stand 2025). Vergünstigte Abendtarife sind oft ab 18:00 Uhr verfügbar.
      </p>

      <h2>Unsere 7 Insider-Tipps</h2>
      <ol>
        <li><strong>Unter der Woche kommen:</strong> Dienstag bis Donnerstag ist die Therme am ruhigsten – perfekt für ungestörte Entspannung</li>
        <li><strong>Früh da sein:</strong> Die erste Stunde nach Öffnung ist die leerste</li>
        <li><strong>Badeschlappen mitnehmen:</strong> Eigene Schlappen sind bequemer, können aber auch vor Ort geliehen werden</li>
        <li><strong>Mindestens 3–4 Stunden einplanen:</strong> Für Therme + Sauna brauchen Sie Zeit</li>
        <li><strong>Abendtarif nutzen:</strong> Günstiger und entspannte Atmosphäre</li>
        <li><strong>Handtücher:</strong> Bringen Sie zwei mit – eins für die Sauna, eins zum Duschen</li>
        <li><strong>Nach dem Thermenbesuch:</strong> Eine <a href="/wohlbefinden-massage/">Massage in unserem Haus</a> rundet den Tag perfekt ab</li>
      </ol>

      <h2>Anfahrt von unseren Apartments</h2>
      <p>
        Von den <a href="/erholungs-apartment/">Erholungs Apartments</a> in der Adolf-Kolping-Str. 11
        gehen Sie einfach Richtung Süden – nach ca. 500 Metern (5–7 Minuten zu Fuß) sind Sie da.
        Auch mit dem Auto ist die Therme in 2 Minuten erreichbar, Parkplätze sind vorhanden.
      </p>

      <h2>Therme + Apartment: Die perfekte Kombination</h2>
      <p>
        Warum nicht den Thermenbesuch mit einer Übernachtung verbinden? In unseren
        <a href="/erholungs-apartment/">Apartments</a> (ab 70 €/Nacht) oder dem gemütlichen
        <a href="/erholungs-kellerchen/">Erholungs Kellerchen</a> (ab 45 €/Nacht) können Sie
        nach der Therme direkt in Ihre eigene Ferienwohnung zurückkehren – kein Stress, keine
        lange Heimfahrt. Und am nächsten Morgen starten Sie ausgeruht in einen neuen Tag.
      </p>
      <p>
        <strong><a href="/buchen/">Jetzt Verfügbarkeit prüfen</a></strong> und Ihren
        Wellness-Aufenthalt planen.
      </p>
    `,
  },

  'wellness-wochenende-in-bad-lippspringe-planen': {
    slug: 'wellness-wochenende-in-bad-lippspringe-planen',
    title: 'Wellness-Wochenende in Bad Lippspringe: So planen Sie 3 perfekte Tage',
    excerpt:
      'Der ultimative Guide für Ihr Wellness-Wochenende: Freitag ankommen, Samstag Therme und Massage genießen, Sonntag Natur erleben. Mit konkretem Zeitplan und Preisen.',
    date: '2025-01-10',
    category: 'Wellness',
    readTime: '10 Min.',
    image: '/images/blog/wellness-spa-kerzen.jpg',
    content: `
      <h2>Warum Bad Lippspringe ideal für ein Wellness-Wochenende ist</h2>
      <p>
        Bad Lippspringe vereint alles, was ein perfektes Wellness-Wochenende braucht:
        einen <strong>heilklimatischen Kurwald</strong> direkt vor der Tür, die
        <a href="/bad-lippspringe/westfalen-therme/">Westfalen Therme</a> in Gehweite und
        eine <a href="/wohlbefinden-massage/">professionelle Massage</a> direkt im Haus.
        Kein anderer Ort in Ostwestfalen-Lippe bietet diese Kombination so kompakt.
      </p>
      <p>
        In diesem Guide zeigen wir Ihnen Schritt für Schritt, wie Sie das perfekte
        Erholungswochenende zusammenstellen – inklusive konkretem Zeitplan und Preisübersicht.
      </p>

      <h2>Freitag: Ankommen und Durchatmen</h2>

      <h3>15:00 – Check-in</h3>
      <p>
        Beziehen Sie Ihr <a href="/erholungs-apartment/">Erholungs Apartment</a> (ab 70 €/Nacht,
        bis 2 Personen + 1 Kind) oder das gemütliche <a href="/erholungs-kellerchen/">Erholungs Kellerchen</a>
        (ab 45 €/Nacht, bis 2 Personen). Beide Unterkünfte sind voll ausgestattet mit Küche,
        WLAN und kostenlosem Parkplatz direkt am Haus.
      </p>

      <h3>16:00 – Kurwald-Spaziergang</h3>
      <p>
        Starten Sie mit einem 45-minütigen Spaziergang durch den Kurwald. Die heilklimatische
        Waldluft senkt nachweislich den Cortisolspiegel und hilft Ihnen, nach einer langen
        Arbeitswoche abzuschalten. Der <a href="/bad-lippspringe/kurwald/">Kurwald</a> beginnt
        nur 300 Meter von unseren Apartments entfernt.
      </p>

      <h3>18:30 – Abendessen</h3>
      <p>
        Bereiten Sie sich in Ihrer voll ausgestatteten Küche ein leichtes Abendessen zu, oder
        besuchen Sie eines der Restaurants in der Innenstadt. Empfehlung: Das Restaurant
        "Zum Arminiusbrunnen" (ca. 10 Minuten zu Fuß) bietet gute westfälische Küche.
      </p>

      <h2>Samstag: Der große Wellness-Tag</h2>

      <h3>09:00 – Ausgiebiges Frühstück</h3>
      <p>
        Starten Sie entspannt in den Tag mit einem Frühstück in Ihrem Apartment. Der nächste
        Supermarkt (Rewe) ist nur 5 Minuten zu Fuß entfernt – am besten kaufen Sie schon am
        Freitag ein.
      </p>

      <h3>10:00 – Westfalen Therme (3–4 Stunden)</h3>
      <p>
        Verbringen Sie den Vormittag in der <a href="/bad-lippspringe/westfalen-therme/">Westfalen Therme</a>.
        Unser Tipp: Starten Sie mit den Solebecken (herrlich für die Haut), dann in die Saunalandschaft
        (finnische Sauna, Bio-Sauna, Dampfbad), und genießen Sie zum Abschluss den Außenbereich.
        Aktuelle Preise und Öffnungszeiten finden Sie auf
        <a href="https://www.westfalentherme.de" target="_blank" rel="noopener noreferrer">westfalentherme.de</a>.
      </p>

      <h3>14:30 – Mittagspause im Apartment</h3>
      <p>
        Zurück im Apartment – nur 5 Gehminuten – können Sie sich frisch machen und eine
        Kleinigkeit essen. Die Ruhezeit zwischen Therme und Massage macht den Nachmittag
        besonders erholsam.
      </p>

      <h3>16:00 – Wohlbefinden Massage (60–120 Min.)</h3>
      <p>
        Das Highlight: Eine professionelle <a href="/wohlbefinden-massage/">Massage direkt in
        unserem Haus</a>. Unser Masseur Andreas Kroh bietet drei Pakete:
      </p>
      <ul>
        <li><strong>Wohlfühlen</strong> (60 Min.) – 75 € – Ganzkörper-Entspannungsmassage</li>
        <li><strong>Verspannungsfrei</strong> (90 Min.) – 95 € – Intensive Behandlung für Nacken, Schultern und Rücken</li>
        <li><strong>Schmerzlösung</strong> (120 Min.) – 130 € – Therapeutische Massage bei chronischen Verspannungen</li>
      </ul>
      <p>
        Das kostenlose Erstgespräch stellt sicher, dass die Behandlung genau auf Ihre Bedürfnisse
        abgestimmt ist. Termine vereinbaren Sie direkt bei der Buchung oder telefonisch.
      </p>

      <h3>19:00 – Abendprogramm</h3>
      <p>
        Nach so viel Entspannung haben Sie sich ein gutes Abendessen verdient. Oder machen Sie
        es sich einfach in Ihrem Apartment gemütlich – mit WLAN, Smart-TV und einer Tasse Tee.
      </p>

      <h2>Sonntag: Natur und Abreise</h2>

      <h3>09:00 – Frühstück und Gartenschau</h3>
      <p>
        Besuchen Sie nach dem Frühstück das Gelände der
        <a href="/bad-lippspringe/gartenschau/">ehemaligen Landesgartenschau</a>. Die Themengärten,
        Spielplätze und Wasserflächen sind besonders im Frühling und Sommer wunderschön. Planen
        Sie ca. 1–1,5 Stunden ein.
      </p>

      <h3>11:00 – Check-out</h3>
      <p>
        Packen Sie in Ruhe zusammen und starten Sie tiefenentspannt in die neue Woche.
      </p>

      <h2>Was kostet ein Wellness-Wochenende?</h2>
      <p>Hier eine Beispielrechnung für 2 Personen, 2 Nächte:</p>
      <ul>
        <li><strong>Apartment (2 Nächte):</strong> ab 140 € (Erholungs Apartment) oder ab 90 € (Kellerchen)</li>
        <li><strong>Westfalen Therme:</strong> ca. 25–30 € pro Person</li>
        <li><strong>Massage (60 Min.):</strong> 75 € pro Person</li>
        <li><strong>Verpflegung:</strong> ca. 40–60 € (Selbstverpflegung)</li>
      </ul>
      <p>
        <strong>Gesamt ab ca. 280 € für 2 Personen</strong> – deutlich günstiger als ein
        Hotel-Wellness-Paket, und Sie haben Ihre eigene Ferienwohnung mit voller Privatsphäre.
      </p>

      <h2>Jetzt Ihr Wellness-Wochenende buchen</h2>
      <p>
        Prüfen Sie die Verfügbarkeit und buchen Sie direkt online:
        <strong><a href="/buchen/">Jetzt buchen</a></strong>. Bei Aufenthalten ab 7 Nächten
        erhalten Sie 10 % Rabatt, ab 30 Nächten sogar 20 %.
      </p>
      <p>
        Fragen? Rufen Sie uns an unter <a href="tel:+491771666353">0177 1666353</a> oder
        schreiben Sie uns an <a href="mailto:info@erholungs-apartments.de">info@erholungs-apartments.de</a>.
      </p>
    `,
  },

  'bad-lippspringe-im-fruehling-gartenschau-und-mehr': {
    slug: 'bad-lippspringe-im-fruehling-gartenschau-und-mehr',
    title: 'Bad Lippspringe im Frühling: Gartenschau, Kurwald und Ausflugstipps',
    excerpt:
      'Tulpen, Narzissen und frisches Waldgrün: Warum der Frühling die schönste Jahreszeit für Bad Lippspringe ist. Mit Ausflugstipps, Terminen und Übernachtungsideen.',
    date: '2024-12-05',
    category: 'Saisonale Tipps',
    readTime: '8 Min.',
    image: '/images/blog/fruehling-tulpen-park.jpg',
    content: `
      <h2>Warum Sie Bad Lippspringe im Frühling besuchen sollten</h2>
      <p>
        Wenn im März die ersten Krokusse sprießen und im April die Kirschbäume blühen,
        verwandelt sich Bad Lippspringe in ein farbenfrohes Naturparadies. Die Kombination
        aus <a href="/bad-lippspringe/gartenschau/">Gartenschau-Gelände</a>,
        <a href="/bad-lippspringe/kurwald/">heilklimatischem Kurwald</a> und der umliegenden
        Teutoburger-Wald-Landschaft macht den Frühling zur schönsten Reisezeit für
        Naturliebhaber und Erholungssuchende.
      </p>

      <h2>Die Gartenschau: 20 Hektar Blütenparadies</h2>
      <p>
        Das Gelände der <strong>ehemaligen Landesgartenschau 2017</strong> ist längst zu einem
        festen Bestandteil Bad Lippspringes geworden. Auf rund 20 Hektar erstrecken sich
        Themengärten, die im Frühling in voller Pracht erstrahlen:
      </p>
      <ul>
        <li><strong>März–April:</strong> Krokusse, Narzissen und Hyazinthen setzen die ersten Farbakzente</li>
        <li><strong>April–Mai:</strong> Tausende Tulpen in allen Farben – das Highlight der Frühlingssaison</li>
        <li><strong>Mai–Juni:</strong> Rhododendren und Azaleen übernehmen die Blütenshow</li>
      </ul>
      <p>
        Das Gelände bietet außerdem großzügige <strong>Spielplätze</strong>, einen Klettergarten,
        Wasserspielanlagen und Ruhezonen. Perfekt für Familien mit Kindern, aber auch für Paare
        und Alleinreisende, die Natur und Ruhe suchen. Der Eintritt ist frei.
      </p>

      <h2>Der Kurwald im Frühlingskleid</h2>
      <p>
        Auch der <a href="/bad-lippspringe/kurwald/">Kurwald</a> zeigt sich im Frühling von
        seiner schönsten Seite. Das frische Grün der Buchen und Eichen, der Gesang der Vögel
        und die milde Waldluft laden zu ausführlichen Spaziergängen ein. Besonders reizvoll:
      </p>
      <ul>
        <li><strong>Buschwindröschen-Teppiche</strong> am Waldboden (März–April)</li>
        <li><strong>Bärlauch-Felder</strong> mit intensivem Duft (April–Mai)</li>
        <li><strong>Vogelkonzerte</strong> am frühen Morgen – Nachtigall, Rotkehlchen und Buchfink</li>
      </ul>
      <p>
        Die <strong>Terrainkurwege</strong> bieten verschiedene Schwierigkeitsgrade (leicht,
        mittel, schwer), sodass für jede Kondition die passende Route dabei ist. Von unseren
        <a href="/erholungs-apartment/">Erholungs Apartments</a> aus sind es nur 300 Meter
        bis zum Waldrand.
      </p>

      <h2>Frühlingsausflüge in der Umgebung</h2>
      <p>
        Die Region rund um Bad Lippspringe hat im Frühling noch mehr zu bieten:
      </p>

      <h3>Externsteine (12 km)</h3>
      <p>
        Die <a href="/bad-lippspringe/externsteine/">Externsteine</a> sind besonders im Frühling
        beeindruckend, wenn das frische Grün die Felsen umrahmt. Die Wanderung dorthin dauert
        ca. 3 Stunden und führt durch blühende Landschaft.
      </p>

      <h3>Paderborner Altstadt (15 km)</h3>
      <p>
        Die historische Altstadt von Paderborn mit dem Dom, den Paderquellen und dem
        Rathaus ist einen Tagesausflug wert. Im Frühling finden dort regelmäßig Märkte
        und kulturelle Veranstaltungen statt.
      </p>

      <h3>Senne-Landschaft</h3>
      <p>
        Die nahe Senne – eine der letzten großen Heidelandschaften Deutschlands – blüht
        im späten Frühling besonders schön. Wacholderheiden und Sandtrockenrasen bieten
        seltene Flora und Fauna.
      </p>

      <h2>Praktische Tipps für Ihren Frühlings-Aufenthalt</h2>
      <ul>
        <li><strong>Beste Reisezeit:</strong> Mitte April bis Mitte Mai für die volle Blütenpracht</li>
        <li><strong>Packliste:</strong> Leichte Jacke (Morgen und Abend können kühl sein), bequeme Schuhe, Kamera</li>
        <li><strong>Wetter:</strong> Durchschnittstemperaturen im April: 8–15 °C, im Mai: 12–20 °C</li>
        <li><strong>Gartenschau:</strong> Am frühen Morgen (vor 10 Uhr) oder am späten Nachmittag (nach 16 Uhr) am ruhigsten</li>
        <li><strong>Allergiker:</strong> Im Kurwald ist die Pollenbelastung durch die natürliche Filterung deutlich geringer als in der Stadt</li>
      </ul>

      <h2>Frühling + Wellness = Perfekt</h2>
      <p>
        Kombinieren Sie die Frühlingsnatur mit einem Wellness-Programm: Morgens durch den
        blühenden Kurwald spazieren, nachmittags in der
        <a href="/bad-lippspringe/westfalen-therme/">Westfalen Therme</a> entspannen und
        abends eine <a href="/wohlbefinden-massage/">Massage in unserem Haus</a> genießen.
        So wird Ihr Frühlings-Aufenthalt zum ganzheitlichen Erholungserlebnis.
      </p>

      <h2>Jetzt den Frühling buchen</h2>
      <p>
        Planen Sie Ihren Frühlings-Aufenthalt in unseren
        <a href="/erholungs-apartment/">Erholungs Apartments</a> – ab 45 € pro Nacht im
        <a href="/erholungs-kellerchen/">Erholungs Kellerchen</a> oder ab 70 € im Apartment.
        Bei längeren Aufenthalten ab 7 Nächten profitieren Sie von <strong>10 % Rabatt</strong>.
      </p>
      <p>
        <strong><a href="/buchen/">Jetzt Verfügbarkeit prüfen und buchen</a></strong>
      </p>
    `,
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getOtherPosts(currentSlug: string): BlogPostFull[] {
  return Object.values(blogPostData).filter(
    (post) => post.slug !== currentSlug
  );
}

function getRelatedPosts(currentSlug: string): BlogPostFull[] {
  return getOtherPosts(currentSlug).slice(0, 2);
}

// =============================================================================
// Static Params for SSG
// =============================================================================

export function generateStaticParams() {
  return Object.keys(blogPostData).map((slug) => ({ slug }));
}

// =============================================================================
// Dynamic Metadata
// =============================================================================

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostData[slug];

  if (!post) {
    return {
      title: 'Beitrag nicht gefunden',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostData[slug];

  if (!post) {
    notFound();
  }

  const otherPosts = getOtherPosts(post.slug);
  const relatedPosts = getRelatedPosts(post.slug);

  return (
    <>
      {/* Schema.org BlogPosting + Breadcrumb markup */}
      <SchemaMarkup
        type="BlogPosting"
        blogPost={{
          title: post.title,
          description: post.excerpt,
          datePublished: post.date,
          image: post.image,
          url: `/blog/${post.slug}/`,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Startseite', href: '/' },
          { name: 'Blog', href: '/blog/' },
          { name: post.title, href: `/blog/${post.slug}/` },
        ]}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Breadcrumb                                                         */}
      {/* ------------------------------------------------------------------ */}
      <nav
        aria-label="Breadcrumb"
        className="bg-secondary/60 border-b border-border"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-primary"
              >
                Startseite
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link
                href="/blog/"
                className="transition-colors hover:text-primary"
              >
                Blog
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-text truncate max-w-[200px] sm:max-w-none">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Article Header                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-gradient-to-b from-secondary to-background py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Category tag */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary mb-4">
            <Tag className="h-3 w-3" />
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl font-bold text-text leading-tight sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-5 flex items-center justify-center gap-4 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} Lesezeit
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Hero image                                                         */}
      {/* ------------------------------------------------------------------ */}
      {post.image && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-2 mb-10">
          <div className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
            <div className="relative aspect-[21/9]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                quality={85}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Article Body + Sidebar                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main content */}
            <article className="lg:col-span-2">
              <div
                className="prose-blog mx-auto max-w-3xl space-y-5 text-text-light leading-relaxed
                  [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text [&_h2]:leading-snug
                  [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text
                  [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-text-light
                  [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
                  [&_li]:text-text-light [&_li]:leading-relaxed
                  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-light"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* ---------------------------------------------------------- */}
              {/* Share Section                                               */}
              {/* ---------------------------------------------------------- */}
              <div className="mx-auto mt-12 max-w-3xl border-t border-border-light pt-8">
                <div className="flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-text-muted" />
                  <span className="text-sm font-semibold text-text">
                    Beitrag teilen:
                  </span>
                  <div className="flex gap-2">
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=https://erholungs-apartments.de/blog/${post.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Auf Facebook teilen"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-text-muted transition-colors hover:bg-primary hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    {/* X / Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=https://erholungs-apartments.de/blog/${post.slug}/&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Auf X teilen"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-text-muted transition-colors hover:bg-primary hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - https://erholungs-apartments.de/blog/' + post.slug + '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Über WhatsApp teilen"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-text-muted transition-colors hover:bg-primary hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                    {/* Email */}
                    <a
                      href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent('Schau dir diesen Artikel an: https://erholungs-apartments.de/blog/' + post.slug + '/')}`}
                      aria-label="Per E-Mail teilen"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-text-muted transition-colors hover:bg-primary hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Back link                                                   */}
              {/* ---------------------------------------------------------- */}
              <div className="mx-auto mt-8 max-w-3xl">
                <Link
                  href="/blog/"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-light"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  Zurück zur Übersicht
                </Link>
              </div>
            </article>

            {/* ------------------------------------------------------------ */}
            {/* Sidebar (desktop)                                             */}
            {/* ------------------------------------------------------------ */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Other posts */}
                <div className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
                  <div className="border-b border-border-light bg-background px-6 py-4">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-text">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Andere Beiträge
                    </h2>
                  </div>
                  <div className="divide-y divide-border-light">
                    {otherPosts.map((otherPost) => (
                      <Link
                        key={otherPost.slug}
                        href={`/blog/${otherPost.slug}/`}
                        className="group block px-6 py-4 transition-colors hover:bg-secondary/50"
                      >
                        <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors leading-snug">
                          {otherPost.title}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {formatDate(otherPost.date)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA card */}
                <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary-dark shadow-lg">
                  <div className="p-6 text-center">
                    <h3 className="mb-2 text-lg font-bold text-white">
                      Jetzt buchen
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-white/80">
                      Erleben Sie Bad Lippspringe hautnah. Buchen Sie Ihre
                      Ferienwohnung direkt bei uns.
                    </p>
                    <Link
                      href="/buchen/"
                      className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-accent-light hover:shadow-lg active:scale-[0.98]"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Verfügbarkeit prüfen
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Contact info card */}
                <div className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
                  <div className="border-b border-border-light bg-background px-6 py-4">
                    <h2 className="text-lg font-bold text-text">Kontakt</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">Telefon</p>
                        <p className="text-sm font-medium text-text">
                          {SITE_CONFIG.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">E-Mail</p>
                        <p className="text-sm font-medium text-text">
                          {SITE_CONFIG.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">Adresse</p>
                        <p className="text-sm font-medium text-text">
                          {SITE_CONFIG.address}
                          <br />
                          {SITE_CONFIG.zip} {SITE_CONFIG.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Related Posts                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-border-light bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-text sm:text-3xl">
            Das könnte Sie auch interessieren
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:gap-8">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}/`}
                className="group flex flex-col rounded-2xl border border-border-light bg-white shadow-sm transition-all duration-[var(--transition-base)] hover:shadow-lg hover:-translate-y-1 hover:border-border overflow-hidden"
              >
                {/* Post image */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-secondary to-background">
                  {related.image && (
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      quality={80}
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary">
                      <Tag className="h-3 w-3" />
                      {related.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={related.date}>
                      {formatDate(related.date)}
                    </time>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-text leading-snug group-hover:text-primary transition-colors">
                    {related.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-text-light leading-relaxed line-clamp-2">
                    {related.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-[var(--transition-base)]">
                    Weiterlesen
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
