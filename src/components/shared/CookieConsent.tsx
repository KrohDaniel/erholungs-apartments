'use client';

import { useState, useEffect } from 'react';

// =============================================================================
// Cookie Consent Banner (DSGVO-konform)
// =============================================================================

const CONSENT_KEY = 'cookie-consent';

type ConsentState = 'pending' | 'accepted' | 'rejected';

function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return 'pending';
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'accepted' || stored === 'rejected') return stored;
  return 'pending';
}

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('pending');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    setConsent(stored);
    if (stored === 'pending') {
      // Small delay so banner slides in
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
    setVisible(false);
    // Reload to activate Google Analytics
    window.location.reload();
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsent('rejected');
    setVisible(false);
  }

  if (consent !== 'pending') return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className={`
        fixed bottom-0 left-0 right-0 z-[55]
        transition-transform duration-500 ease-out
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="bg-white border-t border-border-light shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm text-text-light leading-relaxed">
                Wir verwenden Cookies, um Ihnen die bestm&ouml;gliche Erfahrung
                auf unserer Website zu bieten. Dazu z&auml;hlen technisch
                notwendige Cookies sowie optionale Analyse-Cookies (Google
                Analytics). Weitere Informationen finden Sie in unserer{' '}
                <a
                  href="/datenschutzerklaerung"
                  className="text-primary underline underline-offset-2 hover:text-primary-light transition-colors"
                >
                  Datenschutzerkl&auml;rung
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleReject}
                className="
                  px-5 py-2.5 text-sm font-medium rounded-lg
                  border border-border text-text-light
                  hover:bg-secondary hover:text-text
                  transition-colors duration-200
                  cursor-pointer
                "
              >
                Nur notwendige
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="
                  px-5 py-2.5 text-sm font-medium rounded-lg
                  bg-primary text-white
                  hover:bg-primary-dark
                  transition-colors duration-200
                  cursor-pointer
                "
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Check if the user has accepted analytics cookies.
 * Use this to conditionally load Google Analytics.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) === 'accepted';
}
