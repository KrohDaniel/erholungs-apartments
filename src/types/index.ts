// =============================================================================
// Erholungs Apartments - TypeScript Types
// =============================================================================

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

/** Price per night indexed by guest count (e.g. { 1: 40, 2: 45 }) */
export type PriceByGuests = Record<number, number>;

export interface PriceConfig {
  weekday: PriceByGuests;
  weekend: PriceByGuests;
}

export interface Discount {
  /** Minimum number of nights to qualify */
  minNights: number;
  /** Discount percentage (e.g. 10 for 10%) */
  percentage: number;
}

// -----------------------------------------------------------------------------
// Apartment
// -----------------------------------------------------------------------------

export interface ApartmentImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Apartment {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  sqm: number;
  maxGuests: number;
  images: ApartmentImage[];
  amenities: string[];
  prices: PriceConfig;
  discounts: Discount[];
  minNights: number;
  checkInTime: string;
  checkOutTime: string;
  floor: string;
  bedType: string;
}

// -----------------------------------------------------------------------------
// Booking
// -----------------------------------------------------------------------------

export interface Booking {
  id: string;
  apartmentId: string;
  checkIn: string; // ISO date string YYYY-MM-DD
  checkOut: string; // ISO date string YYYY-MM-DD
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  status: BookingStatus;
  paymentId: string | null;
  paymentMethod: PaymentMethod | null;
  createdAt: string; // ISO datetime string
  notes?: string;
}

export interface BookingFormData {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
}

// -----------------------------------------------------------------------------
// Price Calculation Result
// -----------------------------------------------------------------------------

export interface PriceCalculation {
  nights: number;
  pricePerNight: number; // average
  subtotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
}

// -----------------------------------------------------------------------------
// Review
// -----------------------------------------------------------------------------

export interface Review {
  id: string;
  apartmentId: string;
  guestName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string; // ISO date string
  source: 'direct' | 'airbnb' | 'google' | 'booking';
  visible: boolean;
}

// -----------------------------------------------------------------------------
// Blog
// -----------------------------------------------------------------------------

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  image: string | null;
  published: boolean;
  publishedAt: string | null; // ISO datetime string
  author?: string;
  tags?: string[];
}

// -----------------------------------------------------------------------------
// Blocked Date (from iCal sync or manual)
// -----------------------------------------------------------------------------

export interface BlockedDate {
  id: string;
  apartmentId: string;
  date: string; // ISO date string YYYY-MM-DD
  source: 'airbnb' | 'booking' | 'manual' | 'internal';
  bookingRef?: string;
}

// -----------------------------------------------------------------------------
// Contact Form
// -----------------------------------------------------------------------------

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  apartment?: string;
}

// -----------------------------------------------------------------------------
// Massage
// -----------------------------------------------------------------------------

export interface MassagePackage {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number | null; // null for free consultation
  priceLabel: string;
}

// -----------------------------------------------------------------------------
// Umgebung (Surroundings)
// -----------------------------------------------------------------------------

export interface UmgebungHighlight {
  id: string;
  name: string;
  description: string;
  distance: string;
  image?: string;
  link?: string;
}

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------

export interface FAQItem {
  question: string;
  answer: string;
}

// -----------------------------------------------------------------------------
// SEO
// -----------------------------------------------------------------------------

export interface SEOConfig {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  siteUrl: string;
  locale: string;
  ogImage: string;
}

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------

export interface SiteConfig {
  name: string;
  domain: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  owner: string;
}

// -----------------------------------------------------------------------------
// Color Scheme
// -----------------------------------------------------------------------------

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}
