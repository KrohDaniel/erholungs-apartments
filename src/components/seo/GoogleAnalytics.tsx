'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

// =============================================================================
// Google Analytics 4 Component (DSGVO-konform: nur nach Cookie-Consent)
// =============================================================================

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = 'cookie-consent';

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(localStorage.getItem(CONSENT_KEY) === 'accepted');
  }, []);

  if (!GA_ID || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
