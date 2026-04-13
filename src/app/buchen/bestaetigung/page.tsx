'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { PHONE_NUMBER, PHONE_HREF, EMAIL } from '@/components/layout/Navigation';

// =============================================================================
// Styles (CSS-in-JS objects to avoid dependency on styled-jsx or CSS modules)
// =============================================================================

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    backgroundColor: '#FAFAF7',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  } as React.CSSProperties,

  card: {
    maxWidth: 560,
    width: '100%',
    background: '#ffffff',
    borderRadius: 16,
    padding: '48px 32px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  successCircle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 96,
    borderRadius: '50%',
    backgroundColor: 'rgba(45, 80, 22, 0.1)',
    color: '#2D5016',
    marginBottom: 24,
  } as React.CSSProperties,

  errorIcon: {
    color: '#B91C1C',
    marginBottom: 24,
  } as React.CSSProperties,

  headingSuccess: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2D5016',
    margin: '0 0 8px',
  } as React.CSSProperties,

  headingError: {
    fontSize: 28,
    fontWeight: 700,
    color: '#B91C1C',
    margin: '0 0 8px',
  } as React.CSSProperties,

  subtitle: {
    fontSize: 16,
    color: '#555',
    margin: '0 0 24px',
    lineHeight: 1.5,
  } as React.CSSProperties,

  referenceBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
    background: '#F5EFE6',
    border: '1px solid #E0D5C4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  } as React.CSSProperties,

  referenceLabel: {
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  } as React.CSSProperties,

  referenceValue: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1A1A1A',
    wordBreak: 'break-all' as const,
    fontFamily: 'monospace',
  } as React.CSSProperties,

  infoBox: {
    background: 'rgba(45, 80, 22, 0.05)',
    borderLeft: '4px solid #C9A84C',
    borderRadius: '0 8px 8px 0',
    padding: '16px 20px',
    marginBottom: 24,
    textAlign: 'left' as const,
  } as React.CSSProperties,

  infoText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 1.6,
    margin: 0,
  } as React.CSSProperties,

  contactBox: {
    marginBottom: 32,
  } as React.CSSProperties,

  contactHeading: {
    fontSize: 14,
    color: '#888',
    margin: '0 0 12px',
  } as React.CSSProperties,

  contactItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    margin: '4px 12px',
    fontSize: 15,
  } as React.CSSProperties,

  contactLink: {
    color: '#2D5016',
    textDecoration: 'none',
    fontWeight: 500,
  } as React.CSSProperties,

  contactIcon: {
    color: '#C9A84C',
    flexShrink: 0,
  } as React.CSSProperties,

  ctaGroup: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 12,
    justifyContent: 'center',
  } as React.CSSProperties,

  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    backgroundColor: '#2D5016',
    color: '#ffffff',
    border: 'none',
    transition: 'background-color 0.2s ease',
  } as React.CSSProperties,

  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    backgroundColor: '#F5EFE6',
    color: '#2D5016',
    border: '1px solid #D4C9B4',
    transition: 'background-color 0.2s ease',
  } as React.CSSProperties,
};

// =============================================================================
// CSS Animations (injected once via a <style> tag)
// =============================================================================

const animationStyles = `
  @keyframes confirmationScaleIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); }
  }

  @keyframes confirmationFadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes confirmationSpin {
    to { transform: rotate(360deg); }
  }

  .confirmation-animate-card {
    animation: confirmationFadeInUp 0.5s ease-out;
  }

  .confirmation-animate-icon {
    animation: confirmationScaleIn 0.6s ease-out;
  }

  .confirmation-spinner {
    animation: confirmationSpin 0.8s linear infinite;
  }

  .confirmation-btn-primary:hover {
    background-color: #1E3A0E !important;
  }

  .confirmation-btn-secondary:hover {
    background-color: #EEE5D6 !important;
  }

  .confirmation-link:hover {
    text-decoration: underline !important;
  }

  @media (max-width: 480px) {
    .confirmation-card-responsive {
      padding: 32px 20px !important;
    }

    .confirmation-heading-responsive {
      font-size: 24px !important;
    }

    .confirmation-cta-responsive {
      flex-direction: column !important;
    }

    .confirmation-btn-responsive {
      justify-content: center !important;
      width: 100% !important;
    }

    .confirmation-contact-responsive {
      display: flex !important;
      margin: 8px 0 !important;
      justify-content: center !important;
    }
  }
`;

// =============================================================================
// Confirmation Content Component
// =============================================================================

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get('session_id');
  const paypalOrderId = searchParams.get('paypal_order_id');
  const cancelled = searchParams.get('cancelled');

  // ---------------------------------------------------------------------------
  // Cancelled State
  // ---------------------------------------------------------------------------

  if (cancelled === 'true') {
    return (
      <>
        <title>Buchung abgebrochen | Erholungs Apartments Bad Lippspringe</title>
        <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
        <div style={styles.page}>
          <div
            style={styles.card}
            className="confirmation-animate-card confirmation-card-responsive"
          >
            {/* Error Icon */}
            <div style={styles.errorIcon} className="confirmation-animate-icon">
              <XCircle size={64} strokeWidth={1.5} />
            </div>

            <h1 style={styles.headingError} className="confirmation-heading-responsive">
              Buchung abgebrochen
            </h1>
            <p style={styles.subtitle}>
              Die Zahlung wurde nicht abgeschlossen. Es wurde kein Betrag berechnet.
            </p>

            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                Falls Sie Fragen haben oder Hilfe bei der Buchung
                ben&ouml;tigen, stehen wir Ihnen gerne zur Verf&uuml;gung.
              </p>
            </div>

            {/* Contact */}
            <div style={styles.contactBox}>
              <div style={styles.contactItem} className="confirmation-contact-responsive">
                <Phone size={18} style={styles.contactIcon} />
                <a
                  href={PHONE_HREF}
                  style={styles.contactLink}
                  className="confirmation-link"
                >
                  {PHONE_NUMBER}
                </a>
              </div>
              <div style={styles.contactItem} className="confirmation-contact-responsive">
                <Mail size={18} style={styles.contactIcon} />
                <a
                  href={`mailto:${EMAIL}`}
                  style={styles.contactLink}
                  className="confirmation-link"
                >
                  {EMAIL}
                </a>
              </div>
            </div>

            {/* CTA */}
            <div style={styles.ctaGroup} className="confirmation-cta-responsive">
              <a
                href="/buchen/"
                style={styles.btnPrimary}
                className="confirmation-btn-primary confirmation-btn-responsive"
              >
                <ArrowLeft size={18} />
                Erneut buchen
              </a>
              <a
                href="/"
                style={styles.btnSecondary}
                className="confirmation-btn-secondary confirmation-btn-responsive"
              >
                <Home size={18} />
                Zur&uuml;ck zur Startseite
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Success State
  // ---------------------------------------------------------------------------

  const referenceId = sessionId ?? paypalOrderId ?? null;

  return (
    <>
      <title>Buchung best&auml;tigt | Erholungs Apartments Bad Lippspringe</title>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div style={styles.page}>
        <div
          style={styles.card}
          className="confirmation-animate-card confirmation-card-responsive"
        >
          {/* Animated Success Icon */}
          <div style={styles.successCircle} className="confirmation-animate-icon">
            <CheckCircle size={64} strokeWidth={1.5} />
          </div>

          <h1 style={styles.headingSuccess} className="confirmation-heading-responsive">
            Buchung best&auml;tigt!
          </h1>
          <p style={styles.subtitle}>
            Vielen Dank f&uuml;r Ihre Buchung bei Erholungs Apartments
          </p>

          {/* Reference */}
          {referenceId && (
            <div style={styles.referenceBox}>
              <span style={styles.referenceLabel}>Buchungsreferenz</span>
              <span style={styles.referenceValue}>{referenceId}</span>
            </div>
          )}

          {/* Info */}
          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              Sie erhalten in K&uuml;rze eine Best&auml;tigungsmail an Ihre
              E-Mail-Adresse mit allen Details zu Ihrem Aufenthalt.
            </p>
          </div>

          {/* Contact */}
          <div style={styles.contactBox}>
            <p style={styles.contactHeading}>Bei Fragen erreichen Sie uns unter:</p>
            <div style={styles.contactItem} className="confirmation-contact-responsive">
              <Phone size={18} style={styles.contactIcon} />
              <a
                href={PHONE_HREF}
                style={styles.contactLink}
                className="confirmation-link"
              >
                {PHONE_NUMBER}
              </a>
            </div>
            <div style={styles.contactItem} className="confirmation-contact-responsive">
              <Mail size={18} style={styles.contactIcon} />
              <a
                href={`mailto:${EMAIL}`}
                style={styles.contactLink}
                className="confirmation-link"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          {/* CTA */}
          <div style={styles.ctaGroup} className="confirmation-cta-responsive">
            <a
              href="/"
              style={styles.btnPrimary}
              className="confirmation-btn-primary confirmation-btn-responsive"
            >
              <Home size={18} />
              Zur&uuml;ck zur Startseite
            </a>
            <a
              href="/erholungs-apartment/"
              style={styles.btnSecondary}
              className="confirmation-btn-secondary confirmation-btn-responsive"
            >
              <ArrowLeft size={18} />
              Apartment ansehen
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Loading Fallback
// =============================================================================

function LoadingFallback() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAF7',
        }}
      >
        <div
          className="confirmation-spinner"
          style={{
            width: 40,
            height: 40,
            border: '3px solid #e0e0e0',
            borderTopColor: '#2D5016',
            borderRadius: '50%',
          }}
        />
      </div>
    </>
  );
}

// =============================================================================
// Page Component (with Suspense boundary for useSearchParams)
// =============================================================================

export default function BuchungBestaetigungPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmationContent />
    </Suspense>
  );
}
