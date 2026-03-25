// =============================================================================
// Erholungs Apartments - Email Service (Resend)
// =============================================================================

import { Resend } from 'resend';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { getApartmentById } from '@/lib/constants';
import { SITE_CONFIG } from '@/lib/constants';
import { formatPrice } from '@/lib/pricing';
import type { Booking } from '@/types';

// -----------------------------------------------------------------------------
// Resend Client
// -----------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = `Erholungs Apartments <noreply@${SITE_CONFIG.domain}>`;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd. MMMM yyyy', { locale: de });
}

function getApartmentName(apartmentId: string): string {
  return getApartmentById(apartmentId)?.name ?? apartmentId;
}

function getCheckInTime(apartmentId: string): string {
  return getApartmentById(apartmentId)?.checkInTime ?? '14:00';
}

function getCheckOutTime(apartmentId: string): string {
  return getApartmentById(apartmentId)?.checkOutTime ?? '11:00';
}

// -----------------------------------------------------------------------------
// Shared Email Styles
// -----------------------------------------------------------------------------

const emailStyles = {
  container: `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #FAFAF7;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  `,
  header: `
    background-color: #2D5016;
    color: #ffffff;
    padding: 24px 32px;
    text-align: center;
  `,
  headerTitle: `
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.5px;
  `,
  body: `
    padding: 32px;
    color: #1A1A1A;
    line-height: 1.6;
  `,
  greeting: `
    font-size: 18px;
    margin-bottom: 16px;
  `,
  detailsTable: `
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
  `,
  detailLabel: `
    padding: 10px 12px;
    border-bottom: 1px solid #e0e0e0;
    color: #555;
    font-size: 14px;
    width: 40%;
    vertical-align: top;
  `,
  detailValue: `
    padding: 10px 12px;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
    font-size: 14px;
    vertical-align: top;
  `,
  totalRow: `
    background-color: #F5EFE6;
    font-size: 16px;
  `,
  infoBox: `
    background-color: #F5EFE6;
    border-left: 4px solid #C9A84C;
    padding: 16px 20px;
    margin: 24px 0;
    border-radius: 0 4px 4px 0;
  `,
  footer: `
    background-color: #f5f5f0;
    padding: 20px 32px;
    text-align: center;
    color: #666;
    font-size: 12px;
    border-top: 1px solid #e0e0e0;
  `,
};

// -----------------------------------------------------------------------------
// Booking Confirmation Email (to guest)
// -----------------------------------------------------------------------------

export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  const apartmentName = getApartmentName(booking.apartmentId);
  const checkInTime = getCheckInTime(booking.apartmentId);
  const checkOutTime = getCheckOutTime(booking.apartmentId);

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">Buchungsbestätigung</h1>
      </div>
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">
          Liebe/r ${booking.guestName},
        </p>
        <p>
          vielen Dank für Ihre Buchung! Wir freuen uns, Sie in unserem
          <strong>${apartmentName}</strong> begrüßen zu dürfen.
        </p>

        <table style="${emailStyles.detailsTable}">
          <tr>
            <td style="${emailStyles.detailLabel}">Apartment</td>
            <td style="${emailStyles.detailValue}">${apartmentName}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Anreise</td>
            <td style="${emailStyles.detailValue}">${formatDate(booking.checkIn)} ab ${checkInTime} Uhr</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Abreise</td>
            <td style="${emailStyles.detailValue}">${formatDate(booking.checkOut)} bis ${checkOutTime} Uhr</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Gäste</td>
            <td style="${emailStyles.detailValue}">${booking.guests} ${booking.guests === 1 ? 'Person' : 'Personen'}</td>
          </tr>
          <tr style="${emailStyles.totalRow}">
            <td style="${emailStyles.detailLabel}"><strong>Gesamtpreis</strong></td>
            <td style="${emailStyles.detailValue}"><strong>${formatPrice(booking.totalPrice)}</strong></td>
          </tr>
        </table>

        <div style="${emailStyles.infoBox}">
          <strong>Check-in Informationen:</strong><br />
          <br />
          <strong>Adresse:</strong> ${SITE_CONFIG.address}, ${SITE_CONFIG.zip} ${SITE_CONFIG.city}<br />
          <strong>Check-in:</strong> Ab ${checkInTime} Uhr<br />
          <strong>Check-out:</strong> Bis ${checkOutTime} Uhr<br />
          <br />
          Kostenlose Parkplätze stehen direkt am Haus zur Verfügung.<br />
          Die WLAN-Zugangsdaten erhalten Sie bei der Anreise.
        </div>

        <p>
          Bei Fragen erreichen Sie uns jederzeit unter:<br />
          Telefon: <a href="tel:${SITE_CONFIG.phone}">${SITE_CONFIG.phone}</a><br />
          E-Mail: <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>
        </p>

        <p>Wir wünschen Ihnen einen erholsamen Aufenthalt!</p>
        <p>
          Herzliche Grüße<br />
          <strong>${SITE_CONFIG.owner}</strong><br />
          ${SITE_CONFIG.name}
        </p>
      </div>
      <div style="${emailStyles.footer}">
        ${SITE_CONFIG.name} &middot; ${SITE_CONFIG.address}, ${SITE_CONFIG.zip} ${SITE_CONFIG.city}<br />
        ${SITE_CONFIG.phone} &middot; ${SITE_CONFIG.email}
      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.guestEmail,
    subject: `Buchungsbestätigung – ${apartmentName} (${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)})`,
    html,
  });
}

// -----------------------------------------------------------------------------
// Booking Notification Email (to owner)
// -----------------------------------------------------------------------------

export async function sendBookingNotification(booking: Booking): Promise<void> {
  const apartmentName = getApartmentName(booking.apartmentId);

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">Neue Buchung eingegangen</h1>
      </div>
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">
          Hallo ${SITE_CONFIG.owner},
        </p>
        <p>
          es ist eine neue Buchung für das <strong>${apartmentName}</strong> eingegangen.
        </p>

        <table style="${emailStyles.detailsTable}">
          <tr>
            <td style="${emailStyles.detailLabel}">Buchungs-ID</td>
            <td style="${emailStyles.detailValue}">${booking.id}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Apartment</td>
            <td style="${emailStyles.detailValue}">${apartmentName}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Gast</td>
            <td style="${emailStyles.detailValue}">${booking.guestName}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">E-Mail</td>
            <td style="${emailStyles.detailValue}"><a href="mailto:${booking.guestEmail}">${booking.guestEmail}</a></td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Telefon</td>
            <td style="${emailStyles.detailValue}"><a href="tel:${booking.guestPhone}">${booking.guestPhone}</a></td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Anreise</td>
            <td style="${emailStyles.detailValue}">${formatDate(booking.checkIn)}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Abreise</td>
            <td style="${emailStyles.detailValue}">${formatDate(booking.checkOut)}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Gäste</td>
            <td style="${emailStyles.detailValue}">${booking.guests}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Status</td>
            <td style="${emailStyles.detailValue}">${booking.status}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Zahlungsart</td>
            <td style="${emailStyles.detailValue}">${booking.paymentMethod ?? '–'}</td>
          </tr>
          <tr style="${emailStyles.totalRow}">
            <td style="${emailStyles.detailLabel}"><strong>Gesamtpreis</strong></td>
            <td style="${emailStyles.detailValue}"><strong>${formatPrice(booking.totalPrice)}</strong></td>
          </tr>
        </table>

        ${booking.notes ? `<div style="${emailStyles.infoBox}"><strong>Anmerkungen:</strong><br />${booking.notes}</div>` : ''}
      </div>
      <div style="${emailStyles.footer}">
        Diese Benachrichtigung wurde automatisch versendet.
      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: SITE_CONFIG.email,
    subject: `Neue Buchung: ${booking.guestName} – ${apartmentName} (${formatDate(booking.checkIn)})`,
    html,
  });
}

// -----------------------------------------------------------------------------
// Cancellation Confirmation Email (to guest)
// -----------------------------------------------------------------------------

export async function sendCancellationConfirmation(booking: Booking): Promise<void> {
  const apartmentName = getApartmentName(booking.apartmentId);

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">Stornierungsbestätigung</h1>
      </div>
      <div style="${emailStyles.body}">
        <p style="${emailStyles.greeting}">
          Liebe/r ${booking.guestName},
        </p>
        <p>
          Ihre Buchung für das <strong>${apartmentName}</strong> wurde erfolgreich storniert.
        </p>

        <table style="${emailStyles.detailsTable}">
          <tr>
            <td style="${emailStyles.detailLabel}">Buchungs-ID</td>
            <td style="${emailStyles.detailValue}">${booking.id}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Apartment</td>
            <td style="${emailStyles.detailValue}">${apartmentName}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Ursprüngliche Anreise</td>
            <td style="${emailStyles.detailValue}">${formatDate(booking.checkIn)}</td>
          </tr>
          <tr>
            <td style="${emailStyles.detailLabel}">Ursprüngliche Abreise</td>
            <td style="${emailStyles.detailValue}">${formatDate(booking.checkOut)}</td>
          </tr>
        </table>

        <p>
          Sollte eine Erstattung anfallen, wird diese innerhalb von 5–10 Werktagen
          auf Ihr Konto zurückgebucht.
        </p>

        <p>
          Wir hoffen, Sie bei einer anderen Gelegenheit bei uns begrüßen zu dürfen.
        </p>

        <p>
          Bei Fragen erreichen Sie uns unter:<br />
          Telefon: <a href="tel:${SITE_CONFIG.phone}">${SITE_CONFIG.phone}</a><br />
          E-Mail: <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>
        </p>

        <p>
          Herzliche Grüße<br />
          <strong>${SITE_CONFIG.owner}</strong><br />
          ${SITE_CONFIG.name}
        </p>
      </div>
      <div style="${emailStyles.footer}">
        ${SITE_CONFIG.name} &middot; ${SITE_CONFIG.address}, ${SITE_CONFIG.zip} ${SITE_CONFIG.city}<br />
        ${SITE_CONFIG.phone} &middot; ${SITE_CONFIG.email}
      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.guestEmail,
    subject: `Stornierungsbestätigung – ${apartmentName}`,
    html,
  });
}
