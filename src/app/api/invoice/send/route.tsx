// =============================================================================
// Invoice Send API - generates PDF (server-side) + emails via Resend
// =============================================================================

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { InvoicePdfDocument } from '@/components/invoice/InvoicePdfDocument';
import { INVOICE_CONFIG } from '@/lib/invoice-constants';
import type { Invoice } from '@/types/invoice';

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { invoiceId, subject, body, overrideEmail } = (await request.json()) as {
      invoiceId?: string;
      subject?: string;
      body?: string;
      overrideEmail?: string;
    };

    if (!invoiceId || !subject || !body) {
      return NextResponse.json(
        { error: 'invoiceId, subject und body sind erforderlich.' },
        { status: 400 }
      );
    }

    if (overrideEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(overrideEmail)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse.' },
        { status: 400 }
      );
    }

    // Load invoice
    const db = getAdminDb();
    const snap = await db.collection('invoices').doc(invoiceId).get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: 'Rechnung nicht gefunden.' },
        { status: 404 }
      );
    }
    const invoice = { id: snap.id, ...snap.data() } as Invoice;

    const targetEmail = overrideEmail || invoice.email;
    if (!targetEmail) {
      return NextResponse.json(
        { error: 'Keine E-Mail-Adresse angegeben.' },
        { status: 400 }
      );
    }

    // Render PDF
    const pdfBuffer = await renderToBuffer(<InvoicePdfDocument inv={invoice} />);

    // Filename: Rechnung_2026-005_Nachname.pdf
    const lastName = (invoice.fullName || 'Gast').split(/\s+/).slice(-1)[0];
    const safeLast = lastName.replace(/[^a-zA-Z0-9äöüÄÖÜß-]/g, '');
    const filename = `Rechnung_${invoice.invoiceNumber || 'Entwurf'}_${safeLast}.pdf`;

    // Send via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY nicht konfiguriert.' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);
    const fromAddress = `${INVOICE_CONFIG.name} <noreply@${INVOICE_CONFIG.domain}>`;

    const result = await resend.emails.send({
      from: fromAddress,
      to: targetEmail,
      replyTo: INVOICE_CONFIG.email,
      subject,
      text: body,
      attachments: [
        {
          filename,
          content: pdfBuffer,
        },
      ],
    });

    if (result.error) {
      console.error('[Resend Error]', result.error);
      return NextResponse.json(
        { error: `Versand fehlgeschlagen: ${result.error.message}` },
        { status: 502 }
      );
    }

    // Track send/resend timestamps. Status stays whatever it was —
    // sending an e-mail does NOT lock the invoice (only manual finalize does).
    const now = new Date().toISOString();
    const wasAlreadySent = !!invoice.sentAt;
    await snap.ref.update(
      wasAlreadySent
        ? { lastResentAt: now }
        : { sentAt: now }
    );

    return NextResponse.json({
      ok: true,
      messageId: result.data?.id,
      sentAt: now,
      isResend: wasAlreadySent,
    });
  } catch (error) {
    console.error('[API /invoice/send]', error);
    const message =
      error instanceof Error ? error.message : 'Unbekannter Fehler beim Versand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
