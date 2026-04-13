---
name: seo-audit
description: Vollständiger SEO-Audit für erholungs-apartments.de – erstellt auf Basis einer statischen Code-Analyse am 2026-04-13. Bewertet Technical SEO, Content, Schema, Performance und lokale Sichtbarkeit nach aktuellen Google-Richtlinien (2025/2026).
tools: Read, Bash, Write
---

# SEO-Audit: erholungs-apartments.de
**Datum:** 2026-04-13  
**Domäne:** https://erholungs-apartments.de  
**Framework:** Next.js 14+ (App Router, SSR)  
**Analysemethode:** Statische Code-Analyse (kein Crawl)

---

## Gesamtbewertung

| Kategorie | Score | Status |
|-----------|-------|--------|
| Technical SEO | 78/100 | ⚠️ Gut mit Lücken |
| Content & E-E-A-T | 65/100 | ⚠️ Verbesserungsbedarf |
| Structured Data / Schema | 85/100 | ✅ Stark |
| On-Page SEO | 80/100 | ✅ Gut |
| Performance (geschätzt) | 72/100 | ⚠️ Optimierungspotenzial |
| Lokale Sichtbarkeit | 70/100 | ⚠️ Ausbaufähig |
| **Gesamt** | **75/100** | **⚠️ Solide Basis, offene Punkte** |

---

## 1. Technical SEO

### ✅ Bestanden

- **robots.txt** vorhanden und korrekt konfiguriert (`Allow: /`, `Disallow: /api/`)
- **Sitemap** unter `/sitemap.xml` dynamisch generiert (Next.js `MetadataRoute.Sitemap`)
- **Sitemap-Referenz** in robots.txt eingetragen
- **HTTPS** erzwungen (metadataBase: `https://erholungs-apartments.de`)
- **`lang="de"`** im HTML-Root-Element gesetzt
- **Canonical-Tags** auf allen Haupt-Landingpages vorhanden (Homepage, Kellerchen, Apartment, Buchen, Massage, Bewertungen, Blog, Bad Lippspringe)
- **`/buchen/bestaetigung/`** ist korrekt mit `robots: { index: false, follow: false }` aus dem Index ausgeschlossen
- **`/api/`** ist in robots.txt ausgeschlossen
- **Skip-to-Content-Link** (Barrierefreiheit) im Root-Layout implementiert
- **`display: swap`** für Google Fonts aktiviert (Inter via `next/font/google`)
- **SSR** – Next.js App Router rendert serverseitig → gute Crawlbarkeit

### ⚠️ Probleme

#### KRITISCH

**1. Sitemap-Daten veraltet**  
Fast alle Seiten zeigen `lastModified: '2025-01-20'`. Nach den jüngsten Änderungen (April 2026) ist die Sitemap stark veraltet. Google könnte Seiten seltener crawlen.

```ts
// sitemap.ts – FIX: Daten aktualisieren
{ url: `${BASE_URL}/`, lastModified: '2026-04-13' },
{ url: `${BASE_URL}/erholungs-kellerchen/`, lastModified: '2026-04-13' },
// ... alle anderen Seiten ebenfalls anpassen
```

**2. Fehlende Canonical-Tags auf 2 Seiten**  
- `/kontakt/` – kein Canonical-Tag (nur in `layout.tsx`, aber nicht explizit gesetzt)
- `/blog/[slug]/` – `generateMetadata` fehlt → kein dynamisches Canonical pro Blog-Post

```ts
// In blog/[slug]/page.tsx ergänzen:
export async function generateMetadata({ params }) {
  const post = posts.find(p => p.slug === params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${params.slug}/` }
  };
}
```

#### MITTEL

**3. Keine `priority` und `changefreq` in Sitemap**  
Google ignoriert diese Felder meist, aber Bing und Yandex verwenden sie. Für Kernseiten sinnvoll.

**4. Keine IndexNow-Integration**  
Bei Buchungsänderungen oder neuen Blog-Posts wird Bing/Yandex nicht aktiv benachrichtigt. IndexNow würde die Indexierung beschleunigen.

---

## 2. On-Page SEO

### ✅ Bestanden

- **Title-Tags** auf allen Seiten individuell gesetzt
- **Meta-Descriptions** auf allen Seiten vorhanden
- **Title-Template** konfiguriert: `'%s | Erholungs Apartments'`
- **OpenGraph** vollständig: `og:title`, `og:description`, `og:type`, `og:locale`, `og:image`
- **Twitter Card** (`summary_large_image`) gesetzt
- **H1-Tags** auf allen Seiten vorhanden (insgesamt 15 H1s für 14 Seiten + 1 in Komponente)
- **Breadcrumb-Navigation** auf Unterseiten (Buchen, Bad-Lippspringe-Slugs)
- **Keywords** in Metadata vorhanden (kein direkter Ranking-Faktor, aber schadet nicht)
- **Keine leeren `alt`-Attribute** gefunden

### ⚠️ Probleme

#### HOCH

**5. OpenGraph-Bild-URL ist relativ**  
Im Root-Layout ist die OG-Bild-URL relativ (`/images/hero/20180406_182210.jpg`). Da `metadataBase` gesetzt ist, löst Next.js dies auf – aber der Dateiname ist unoptimal (kein sprechender Name).

**6. Title-Tag auf Kontakt-Seite nicht spezifisch genug**  
Kontakt-Seite verwendet nur das Template-Fallback. Ein expliziter Kontakt-Title mit Keyword wäre besser:
```
"Kontakt | Erholungs Apartments Bad Lippspringe"
```

**7. Kein Twitter-Tag für Apartment-Detailseiten**  
Die Apartment-Seiten (Kellerchen, Apartment) haben kein spezifisches Twitter-Kartenbild.

#### NIEDRIG

**8. `<meta name="keywords">` wird von Google ignoriert** – ist im Code vorhanden, hat aber keinen Ranking-Effekt.

---

## 3. Structured Data / Schema.org

### ✅ Bestanden

- **`LodgingBusiness`** – vollständig mit `@id`, `name`, `address`, `geo`, `telephone`, `email`, `checkinTime`, `checkoutTime`, `aggregateRating`, `amenityFeature`, `priceRange`
- **`Apartment`** – pro Apartment-Seite mit `floorSize`, `occupancy`, `bed`, `offers`, `containedInPlace`
- **`WebSite`** – mit `inLanguage: 'de-DE'`
- **`Organization`** – mit Logo, `contactPoint`, vollständiger Adresse
- **`BreadcrumbList`** – korrekt implementiert (letztes Element ohne URL, wie Google empfiehlt)
- **`BlogPosting`** – mit `author`, `publisher`, `mainEntityOfPage`, `datePublished`, `dateModified`
- **JSON-LD** Format (korrekt, empfohlen)
- **`https://schema.org`** Kontext (korrekt)
- **XSS-Schutz** via `replace(/<\/script>/gi, '<\\/script>')` vorhanden

### ⚠️ Probleme

#### KRITISCH

**9. `FAQPage`-Schema auf der Homepage eingebunden aber nicht mehr erlaubt**

> ⚠️ **Google hat FAQPage Rich Results im August 2023 auf Regierungs- und Gesundheitsbehörden beschränkt.** Für kommerzielle Seiten wie Ferienwohnungen werden keine Rich Snippets mehr ausgespielt. Das Schema schadet nicht direkt, ist aber ohne Nutzen.

```tsx
// Homepage page.tsx – diese Zeile entfernen:
<SchemaMarkup type="FAQPage" />  // ← ENTFERNEN
```

**10. `aggregateRating` reviewCount zu niedrig**  
Aktuell: `reviewCount: '12'`. Wenn die tatsächliche Anzahl der Bewertungen nicht stimmt, kann Google das Schema als inakkurat werten.

#### MITTEL

**11. `BlogPosting`-Autor ist `Organization`, nicht `Person`**  
Google bevorzugt für E-E-A-T bei Blog-Artikeln einen `Person`-Typ als Autor (mit Namen, ggf. `sameAs` zu sozialem Profil).

```json
"author": {
  "@type": "Person",
  "name": "Erholungs Apartments Team",
  "url": "https://erholungs-apartments.de/impressum/"
}
```

**12. Fehlend: `LocalBusiness`-Schema mit `openingHoursSpecification`**  
Für lokales Ranking in Google Maps/Local Pack wäre `openingHoursSpecification` im `LodgingBusiness`-Schema hilfreich.

**13. Fehlend: `AggregateRating` auf Apartment-Detailseiten**  
Die Einzelseiten `/erholungs-kellerchen/` und `/erholungs-apartment/` haben kein `AggregateRating` – mögliche Rich Snippets (Sterne) werden nicht ausgewertet.

---

## 4. Content & E-E-A-T

### Bewertung nach Google QRG (Sept. 2025)

| Faktor | Score | Begründung |
|--------|-------|------------|
| Experience | 55/100 | Bewertungen vorhanden, aber keine persönlichen Gästestorys/Fotos von Inhabern |
| Expertise | 60/100 | Lokale Infos zu Bad Lippspringe gut; Massageseite ohne Therapeuten-Qualifikationen |
| Authoritativeness | 50/100 | Keine externen Links/Press, keine Google-My-Business-Verknüpfung sichtbar |
| Trustworthiness | 80/100 | Impressum vorhanden, Datenschutz (DSGVO), Cookie Consent, HTTPS |

### ✅ Stärken

- **Blog vorhanden** mit 4 Artikeln zu lokalen Themen (Wanderwege, Therme, Wellness)
- **Bewertungsseite** mit ausführlichen Kundenzitaten
- **FAQ-Sektion** auf der Homepage mit relevanten Fragen
- **Preise transparent** ausgewiesen
- Gute interne Verlinkung zwischen Seiten

### ⚠️ Schwächen

#### HOCH

**14. Blog-Posts haben keine `generateMetadata`**  
Alle Blog-Artikel teilen sich die generischen Seiten-Metadaten. Jeder Artikel braucht eine individuelle `description` und `title`.

**15. Kein echter Blog-Content (statische Dummy-Daten)**  
Die Blog-Seiten sind mit statischen `posts`-Arrays befüllt. Es handelt sich nicht um echte Blogbeiträge mit Volltexten – dünner Inhalt (thin content).

**16. Massage-Seite ohne Qualifikationssignale**  
Keine Nennung von Ausbildung, Zertifikaten oder Erfahrungsjahren der Therapeutin → schwaches E-E-A-T für YMYL-Adjacent-Thema Gesundheit.

#### MITTEL

**17. Keine strukturierten Bewertungsdaten aus externen Quellen**  
Echte Bewertungs-Embeds (Booking.com Widget, Google Reviews) würden Vertrauen und Aktualität stärken.

**18. Kein About/Über-uns-Seite**  
Fehlt. Google schätzt Transparenz über die Betreiber (E-E-A-T: Authoritativeness).

---

## 5. Performance (Geschätzte Risiken aus Code-Analyse)

> Hinweis: Kein Lighthouse-Run durchgeführt. Bewertung basiert auf Code-Muster-Analyse.

### ✅ Stärken

- **`next/image`** durchgängig verwendet (automatische Optimierung, WebP/AVIF)
- **`priority`** auf Hero-Bilder gesetzt (LCP-Optimierung)
- **`display: swap`** für Webfonts
- **SSR** – kein JavaScript für initiales Rendering nötig
- **`Suspense`** auf der Buchungsseite für progressive Hydration

### ⚠️ Risiken

**19. Große Hero-Bilddatei**  
`/images/hero/20180406_182210.jpg` – Dateiname suggeriert unoptimiertes Originalbild (keine Größenangabe im Dateinamen). Ohne Überprüfung unklar ob für LCP optimiert.

**20. ReviewsCarousel ist Client-Side (`'use client'`)**  
Der Carousel rendert client-seitig. Bei langsamen Verbindungen kann dies CLS verursachen, wenn die Höhe nicht reserviert ist.

**21. `wanderer-felsen.jpg` noch 2.7 MB**  
Nach der PNG→JPEG-Konvertierung ist das größte Wanderbild noch 2.7 MB. Sollte auf max. 400 KB für Web reduziert werden (via `next/image` mit `sizes`-Attribut wird es aber automatisch skaliert – prüfen ob `sizes` korrekt gesetzt ist).

---

## 6. Lokale SEO

### ✅ Stärken

- Vollständige Adresse in Schema.org (Straße, PLZ, Stadt, Region)
- `GeoCoordinates` mit Lat/Long
- Telefonnummer im internationalen Format `+49...`
- Lokale Keywords in Titles: "Bad Lippspringe", "Westfalen Therme", "Teutoburger Wald"
- Dedicated Seiten für lokale Ausflugsziele (`/bad-lippspringe/[slug]`)

### ⚠️ Probleme

**22. Kein Google Business Profile sichtbar verknüpft**  
Kein `sameAs`-Link zu Google Maps oder Google Business Profile im Schema.

**23. Keine NAP-Konsistenz prüfbar**  
Name/Adresse/Telefon im Schema sollte identisch mit Google Business Profile, Booking.com-Listing und Impressum sein.

**24. Fehlend: `openingHoursSpecification`**  
Für den "Wohlbefinden Massage"-Bereich (physischer Standort) fehlen Öffnungszeiten im LocalBusiness-Schema.

---

## 7. Priorisierte Maßnahmenliste

### 🔴 Kritisch (sofort umsetzen)

| # | Maßnahme | Aufwand | Wirkung |
|---|----------|---------|---------|
| 1 | Sitemap-Daten auf `2026-04-13` aktualisieren | 5 min | ⬆️⬆️⬆️ Crawl-Frequenz |
| 2 | `FAQPage`-Schema aus Homepage entfernen (hat keinen Effekt für kommerzielle Seiten) | 2 min | ⬆️ Sauberkeit |
| 3 | `generateMetadata` für `/blog/[slug]/` implementieren | 30 min | ⬆️⬆️⬆️ CTR |

### 🟠 Hoch (diese Woche)

| # | Maßnahme | Aufwand | Wirkung |
|---|----------|---------|---------|
| 4 | `AggregateRating` auf Apartment-Detailseiten hinzufügen | 20 min | ⬆️⬆️ Rich Snippets |
| 5 | Blogger-Autor auf `Person`-Typ ändern | 10 min | ⬆️ E-E-A-T |
| 6 | `openingHoursSpecification` für Massage-Service in Schema ergänzen | 15 min | ⬆️ Local Pack |
| 7 | `sameAs` Google Business Profile URL in Organization-Schema | 5 min | ⬆️ Local SEO |
| 8 | Blog-Artikel: Echten Volltext-Content hinzufügen (kein Dummy) | Groß | ⬆️⬆️⬆️ Content-Tiefe |

### 🟡 Mittel (nächsten 2 Wochen)

| # | Maßnahme | Aufwand | Wirkung |
|---|----------|---------|---------|
| 9 | Über-uns-Seite erstellen | Mittel | ⬆️ E-E-A-T |
| 10 | Massage-Therapeutin mit Qualifikationen auf Massage-Seite vorstellen | Klein | ⬆️ E-E-A-T |
| 11 | Hero-Bild (`20180406_182210.jpg`) umbenennen und Größe prüfen | Klein | ⬆️ LCP |
| 12 | Bewertungen aus externem Widget laden (Booking.com oder Google) | Mittel | ⬆️ Trust |
| 13 | IndexNow-Implementierung für schnellere Indexierung bei Bing/Yandex | Mittel | ⬆️ Discovery |

### 🟢 Niedrig (Backlog)

| # | Maßnahme | Aufwand | Wirkung |
|---|----------|---------|---------|
| 14 | NAP-Konsistenz mit Booking.com-Listing abgleichen | Klein | ⬆️ Local Trust |
| 15 | `priority`/`changefreq` in Sitemap ergänzen | Klein | Minimal |
| 16 | Twitter-Karten-Bilder für Apartment-Seiten | Klein | ⬆️ Social CTR |
| 17 | CLS-Risiko bei ReviewsCarousel prüfen (Mindesthöhe reservieren) | Klein | ⬆️ CLS |

---

## 8. Code-Korrekturen (direkt umsetzbar)

### Fix 1: Sitemap-Daten aktualisieren

```ts
// src/app/sitemap.ts
const TODAY = '2026-04-13';

const staticPages: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, lastModified: TODAY },
  { url: `${BASE_URL}/erholungs-kellerchen/`, lastModified: TODO },
  // ... alle Einträge aktualisieren
];
```

### Fix 2: FAQPage-Schema entfernen

```tsx
// src/app/page.tsx – Zeile entfernen:
- <SchemaMarkup type="FAQPage" />
```

### Fix 3: Blog-Slug generateMetadata

```tsx
// src/app/blog/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.datePublished,
    },
  };
}
```

### Fix 4: AggregateRating auf Apartment-Seiten

```ts
// In generateApartmentSchema() hinzufügen:
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue: '4.9',
  reviewCount: '12',
  bestRating: '5',
  worstRating: '1',
},
```

### Fix 5: Google Business Profile verknüpfen

```ts
// In generateOrganizationSchema() ergänzen:
sameAs: [
  'https://www.google.com/maps/place/IHRE-PLACE-ID',
  'https://www.booking.com/hotel/de/IHRE-HOTEL-ID.html',
],
```

---

## Quellen & Referenzen

- Google Search Central: [Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data)
- Google Quality Rater Guidelines (September 2025)
- [FAQPage Rich Results Policy](https://developers.google.com/search/docs/appearance/structured-data/faqpage) – nur Health/Gov seit Aug. 2023
- Core Web Vitals Thresholds 2026: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1
- [IndexNow Protocol](https://www.indexnow.org/)
- [CrUX Vis](https://cruxvis.withgoogle.com) (CrUX Dashboard-Nachfolger, Nov. 2025)
