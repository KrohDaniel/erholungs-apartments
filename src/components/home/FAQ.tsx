'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Wie sind die Check-in und Check-out Zeiten?',
    answer:
      'Check-in: Ab 14:00 Uhr (Kellerchen) bzw. 17:00 Uhr (Apartment). Check-out: Bis 11:00 Uhr.',
  },
  {
    question: 'Gibt es kostenlose Parkplätze?',
    answer:
      'Ja, kostenlose Parkplätze stehen direkt am Haus zur Verfügung.',
  },
  {
    question: 'Ist WLAN verfügbar?',
    answer:
      'Ja, schnelles WLAN ist in allen Unterkünften kostenlos verfügbar.',
  },
  {
    question: 'Kann ich die Wohlbefinden Massage buchen?',
    answer:
      'Ja! Die Wohlbefinden Massage befindet sich direkt im selben Haus. Termine können telefonisch unter 01771666353 vereinbart werden.',
  },
  {
    question: 'Wie weit ist die Westfalen Therme entfernt?',
    answer:
      'Die Westfalen Therme ist nur ca. 500 Meter (5–7 Gehminuten) von unseren Ferienwohnungen entfernt.',
  },
  {
    question: 'Sind Haustiere erlaubt?',
    answer:
      'Bitte kontaktieren Sie uns vorab, damit wir dies individuell besprechen können.',
  },
  {
    question: 'Wie kann ich stornieren?',
    answer:
      'Kostenlose Stornierung bis 7 Tage vor Anreise. Bei Stornierung innerhalb von 7 Tagen vor Anreise wird die erste Nacht berechnet. Bei Nichtanreise (No-Show) wird der gesamte Betrag fällig.',
  },
  {
    question: 'Gibt es Langzeitrabatte?',
    answer:
      'Ja! Ab 7 Nächten erhalten Sie 10% Rabatt, ab 30 Nächten sogar 20% Rabatt.',
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-primary sm:py-5 md:py-6 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-text sm:text-lg">
          {item.question}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary transition-colors duration-300">
          {isOpen ? (
            <Minus className="h-4 w-4 text-primary" />
          ) : (
            <Plus className="h-4 w-4 text-primary" />
          )}
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-4 pr-12 leading-relaxed text-text-light sm:pb-5 md:pb-6">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-3xl font-bold text-text sm:text-4xl">
            H&auml;ufig gestellte Fragen
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Accordion */}
        <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQAccordionItem
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
