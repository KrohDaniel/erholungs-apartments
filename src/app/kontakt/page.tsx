'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/lib/constants';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

// =============================================================================
// Kontakt Page
// =============================================================================

const APARTMENT_OPTIONS = [
  { value: 'allgemein', label: 'Allgemeine Anfrage' },
  { value: 'kellerchen', label: 'Erholungs Kellerchen' },
  { value: 'apartment', label: 'Erholungs Apartment' },
];

export default function KontaktPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('apartment') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Beim Senden ist ein Fehler aufgetreten.');
      }

      setFormState('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setFormState('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
    }
  }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Startseite', href: '/' },
        { name: 'Kontakt', href: '/kontakt' },
      ]} />

      {/* Breadcrumb */}
      <nav className="bg-secondary" aria-label="Breadcrumb">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-3 lg:px-8">
          <ol className="flex items-center gap-1.5 text-sm text-text-muted min-h-[44px]">
            <li>
              <Link href="/" className="hover:text-primary transition-colors duration-[var(--transition-fast)]">
                Startseite
              </Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="font-medium text-text">Kontakt</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
            Kontakt
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-light leading-relaxed">
            Haben Sie Fragen zu unseren Apartments oder m&ouml;chten Sie eine Buchung vornehmen?
            Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Left: Contact Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                <h2 className="mb-2 text-2xl font-bold text-text">
                  Schreiben Sie uns
                </h2>
                <p className="mb-8 text-text-muted">
                  F&uuml;llen Sie das Formular aus und wir melden uns schnellstm&ouml;glich bei Ihnen.
                </p>

                {/* Success Message */}
                {formState === 'success' && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        Nachricht erfolgreich gesendet!
                      </p>
                      <p className="mt-1 text-sm text-green-700">
                        Vielen Dank f&uuml;r Ihre Nachricht. Wir werden uns so schnell wie m&ouml;glich bei Ihnen melden.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {formState === 'error' && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">
                        Fehler beim Senden
                      </p>
                      <p className="mt-1 text-sm text-red-700">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      name="name"
                      label="Name"
                      placeholder="Ihr vollständiger Name"
                      required
                    />
                    <Input
                      name="email"
                      label="E-Mail"
                      type="email"
                      placeholder="ihre@email.de"
                      required
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      name="phone"
                      label="Telefon"
                      type="tel"
                      placeholder="+49 ..."
                      helperText="Optional"
                    />
                    <Select
                      name="apartment"
                      label="Apartment-Auswahl"
                      options={APARTMENT_OPTIONS}
                      placeholder="Bitte wählen"
                      defaultValue="allgemein"
                      required
                    />
                  </div>

                  <Textarea
                    name="message"
                    label="Nachricht"
                    placeholder="Ihre Nachricht an uns..."
                    rows={5}
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={formState === 'loading'}
                    icon={<Send className="h-4 w-4" />}
                    iconPosition="right"
                  >
                    Nachricht senden
                  </Button>
                </form>
              </div>
            </div>

            {/* Right: Contact Info */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Contact Info Card */}
                <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm sm:p-8">
                  <h3 className="mb-6 text-xl font-bold text-text">
                    Kontaktdaten
                  </h3>

                  <div className="space-y-5">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-muted">Adresse</p>
                        <p className="mt-0.5 text-text leading-relaxed">
                          {SITE_CONFIG.address}<br />
                          {SITE_CONFIG.zip} {SITE_CONFIG.city}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-muted">Telefon</p>
                        <a
                          href={`tel:+49${SITE_CONFIG.phone.replace(/^0/, '')}`}
                          className="mt-0.5 block text-text hover:text-primary transition-colors duration-[var(--transition-fast)]"
                        >
                          {SITE_CONFIG.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-muted">E-Mail</p>
                        <a
                          href={`mailto:${SITE_CONFIG.email}`}
                          className="mt-0.5 block text-text hover:text-primary transition-colors duration-[var(--transition-fast)]"
                        >
                          {SITE_CONFIG.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="mt-6 rounded-xl bg-secondary p-4">
                    <p className="text-sm text-text-muted">Inhaberin</p>
                    <p className="mt-0.5 font-medium text-text">{SITE_CONFIG.owner}</p>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="overflow-hidden rounded-2xl border border-border-light shadow-sm aspect-video sm:aspect-auto">
                  <iframe
                    src="https://www.google.com/maps?q=Adolf-Kolping-Str.+11,+33175+Bad+Lippspringe,+Deutschland&output=embed&hl=de"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Standort Erholungs Apartments"
                    className="w-full h-full min-h-[200px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
