// =============================================================================
// Invoice Types
// =============================================================================

export type InvoiceStatus = 'draft' | 'sent' | 'cancelled';
export type InvoiceChannel = 'Booking.com' | 'Airbnb' | 'FeWo-direkt' | 'Direkt';
export type InvoiceLanguage = 'de' | 'en' | 'nl';
export type InvoiceApartmentId = 'erholungs-apartment' | 'erholungs-kellerchen';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerNumber: string;
  status: InvoiceStatus;
  /** Zahlungsstatus - getrennt vom Lebenszyklus */
  paid?: boolean;
  /** Wann die Rechnung als abgeschlossen markiert wurde (status → 'sent') */
  finalizedAt?: string;
  createdAt: string;
  sentAt?: string;
  lastResentAt?: string;
  updatedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  replacedBy?: string;

  // Guest
  fullName: string;
  email: string;
  skipEmail?: boolean;
  company?: string;
  address: string;
  zipCity: string;
  language?: InvoiceLanguage;

  // Booking
  bookingNumber?: string;
  skipBookingNumber?: boolean;
  apartmentId: InvoiceApartmentId | '';
  arrivalDate: string;
  departureDate: string;
  channel: InvoiceChannel;
  paidAmount: number | null;
}

/**
 * Public guest-submitted invoice request.
 * Stored in `invoiceRequests` collection. Deleted once converted to an Invoice.
 */
export interface InvoiceRequest {
  id: string;
  createdAt: string;
  // Guest
  fullName: string;
  email: string;
  skipEmail?: boolean;
  company?: string;
  address: string;
  zipCity: string;
  // Booking
  bookingNumber?: string;
  skipBookingNumber?: boolean;
  apartmentId: InvoiceApartmentId | '';
  arrivalDate: string;
  departureDate: string;
  channel: InvoiceChannel;
  paidAmount: number | null;
  paid?: boolean;
  // Notes from guest (optional message)
  message?: string;
}

export interface InvoiceExtractedData {
  fullName?: string | null;
  email?: string | null;
  company?: string | null;
  bookingNumber?: string | null;
  paidAmount?: number | null;
  arrivalDate?: string | null;
  departureDate?: string | null;
  address?: string | null;
  zipCity?: string | null;
  channel?: InvoiceChannel | null;
  apartmentId?: InvoiceApartmentId | null;
  language?: InvoiceLanguage | null;
}
