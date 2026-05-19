// =============================================================================
// Invoice Template helpers (variable substitution for e-mail templates)
// =============================================================================

import {
  dateLong,
  dateMed,
  dateApi,
  firstName,
  nights,
} from './invoice-format';
import { INVOICE_APARTMENTS, INVOICE_CONFIG } from './invoice-constants';
import type { Invoice } from '@/types/invoice';

export function renderTemplate(tpl: string, inv: Invoice): string {
  const apt = INVOICE_APARTMENTS.find((a) => a.id === inv.apartmentId);
  const ctx: Record<string, string | number> = {
    first_name: firstName(inv.fullName) || 'Gast',
    full_name: inv.fullName || '',
    apartment: apt ? apt.name : 'Apartment',
    invoice_number: inv.invoiceNumber || '',
    arrival: dateLong(inv.arrivalDate),
    departure: dateLong(inv.departureDate),
    arrival_short: dateMed(inv.arrivalDate),
    departure_short: dateMed(inv.departureDate),
    nights: nights(inv.arrivalDate, inv.departureDate),
    check_in_time: '15:00',
    phone: INVOICE_CONFIG.phone,
    owner: INVOICE_CONFIG.owner,
    site_name: INVOICE_CONFIG.name,
  };
  return tpl.replace(/\{(\w+)\}/g, (_, k) => {
    const v = ctx[k];
    return v != null ? String(v) : `{${k}}`;
  });
}

export function buildPayload(inv: Invoice) {
  return {
    email: inv.email || '',
    fullName: inv.fullName || '',
    company: inv.company || '',
    bookingNumber: inv.bookingNumber || '',
    paidAmount: Number(inv.paidAmount) || 0,
    arrivalDate: dateApi(inv.arrivalDate),
    departureDate: dateApi(inv.departureDate),
    address: inv.address || '',
    zipCity: inv.zipCity || '',
    invoiceNumber: inv.invoiceNumber || '',
  };
}
