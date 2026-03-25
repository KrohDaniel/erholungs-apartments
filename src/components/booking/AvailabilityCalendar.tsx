'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  startOfDay,
  addDays,
  differenceInDays,
  parseISO,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// =============================================================================
// AvailabilityCalendar - Interaktiver Kalender zur Datumsauswahl
// =============================================================================

interface AvailabilityCalendarProps {
  apartmentId: string;
  onDateSelect: (checkIn: Date, checkOut: Date) => void;
  blockedDates?: string[];
  /** Mindestaufenthalt in Naechten (Standard: 2) */
  minNights?: number;
}

type SelectionState = 'idle' | 'checkIn' | 'checkOut';

const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function AvailabilityCalendar({
  apartmentId,
  onDateSelect,
  blockedDates: externalBlockedDates,
  minNights = 2,
}: AvailabilityCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState>('idle');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [fetchedBlockedDates, setFetchedBlockedDates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Blocked Dates zusammenfuehren (extern + vom API geladen)
  // ---------------------------------------------------------------------------

  const blockedSet = useMemo(() => {
    const set = new Set<string>(fetchedBlockedDates);
    if (externalBlockedDates) {
      for (const d of externalBlockedDates) {
        set.add(d);
      }
    }
    return set;
  }, [fetchedBlockedDates, externalBlockedDates]);

  // ---------------------------------------------------------------------------
  // Blocked Dates vom API laden
  // ---------------------------------------------------------------------------

  const fetchBlockedDates = useCallback(
    async (month: number, year: number) => {
      if (!apartmentId) return;
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/availability?apartmentId=${encodeURIComponent(apartmentId)}&month=${month}&year=${year}`
        );
        if (res.ok) {
          const data: string[] = await res.json();
          setFetchedBlockedDates((prev) => {
            const next = new Set(prev);
            for (const d of data) {
              next.add(d);
            }
            return next;
          });
        }
      } catch {
        // Fehler ignorieren - Kalender bleibt nutzbar
      } finally {
        setIsLoading(false);
      }
    },
    [apartmentId]
  );

  // Beim Monatswechsel beide sichtbaren Monate laden
  useEffect(() => {
    const m1 = currentMonth;
    const m2 = addMonths(currentMonth, 1);
    fetchBlockedDates(m1.getMonth() + 1, m1.getFullYear());
    fetchBlockedDates(m2.getMonth() + 1, m2.getFullYear());
  }, [currentMonth, fetchBlockedDates]);

  // ---------------------------------------------------------------------------
  // Hilfsfunktionen
  // ---------------------------------------------------------------------------

  const isBlocked = useCallback(
    (date: Date): boolean => blockedSet.has(format(date, 'yyyy-MM-dd')),
    [blockedSet]
  );

  const isPast = useCallback(
    (date: Date): boolean => isBefore(date, today),
    [today]
  );

  const isDisabled = useCallback(
    (date: Date): boolean => isPast(date) || isBlocked(date),
    [isPast, isBlocked]
  );

  /**
   * Prueft ob zwischen zwei Daten blockierte Tage liegen.
   */
  const hasBlockedInRange = useCallback(
    (start: Date, end: Date): boolean => {
      const days = eachDayOfInterval({ start, end: addDays(end, -1) });
      return days.some((d) => isBlocked(d));
    },
    [isBlocked]
  );

  // ---------------------------------------------------------------------------
  // Klick-Handler
  // ---------------------------------------------------------------------------

  const handleDayClick = useCallback(
    (date: Date) => {
      if (isDisabled(date)) return;

      if (selectionState === 'idle' || selectionState === 'checkOut') {
        // Neuen Check-in setzen
        setCheckIn(date);
        setCheckOut(null);
        setSelectionState('checkIn');
      } else if (selectionState === 'checkIn' && checkIn) {
        // Check-out setzen
        if (isBefore(date, checkIn) || isSameDay(date, checkIn)) {
          // Wenn vor dem Check-in geklickt, als neuen Check-in setzen
          setCheckIn(date);
          setCheckOut(null);
          return;
        }

        const nights = differenceInDays(date, checkIn);
        if (nights < minNights) {
          // Mindestaufenthalt nicht erreicht
          return;
        }

        // Pruefe ob blockierte Tage im Bereich liegen
        if (hasBlockedInRange(checkIn, date)) {
          // Blockiertes Datum im Bereich - als neuen Check-in setzen
          setCheckIn(date);
          setCheckOut(null);
          return;
        }

        setCheckOut(date);
        setSelectionState('checkOut');
        onDateSelect(checkIn, date);
      }
    },
    [selectionState, checkIn, minNights, isDisabled, hasBlockedInRange, onDateSelect]
  );

  // ---------------------------------------------------------------------------
  // Datumsanzeige-Logik
  // ---------------------------------------------------------------------------

  const isInRange = useCallback(
    (date: Date): boolean => {
      if (!checkIn) return false;
      const end = checkOut || hoveredDate;
      if (!end) return false;
      if (isBefore(end, checkIn)) return false;
      return isAfter(date, checkIn) && isBefore(date, end);
    },
    [checkIn, checkOut, hoveredDate]
  );

  const isRangeStart = useCallback(
    (date: Date): boolean => !!checkIn && isSameDay(date, checkIn),
    [checkIn]
  );

  const isRangeEnd = useCallback(
    (date: Date): boolean => {
      if (checkOut) return isSameDay(date, checkOut);
      if (hoveredDate && checkIn && selectionState === 'checkIn') {
        return isSameDay(date, hoveredDate) && isAfter(hoveredDate, checkIn);
      }
      return false;
    },
    [checkOut, hoveredDate, checkIn, selectionState]
  );

  // ---------------------------------------------------------------------------
  // Monatsnavigation
  // ---------------------------------------------------------------------------

  const goToPrevMonth = useCallback(() => {
    const prev = subMonths(currentMonth, 1);
    if (!isBefore(endOfMonth(prev), today)) {
      setCurrentMonth(prev);
    }
  }, [currentMonth, today]);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth, 1));
  }, [currentMonth]);

  const canGoPrev = !isBefore(endOfMonth(subMonths(currentMonth, 1)), today);

  // ---------------------------------------------------------------------------
  // Kalender-Grid fuer einen Monat generieren
  // ---------------------------------------------------------------------------

  function renderMonth(monthDate: Date) {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    // Woche beginnt am Montag (locale: de)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div>
        {/* Monatsname */}
        <h3 className="mb-4 text-center text-lg font-semibold text-text">
          {format(monthDate, 'MMMM yyyy', { locale: de })}
        </h3>

        {/* Wochentags-Header */}
        <div className="mb-2 grid grid-cols-7 gap-0">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-text-muted"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Tage-Grid */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day) => {
            const inCurrentMonth = isSameMonth(day, monthDate);
            const disabled = isDisabled(day);
            const blocked = isBlocked(day);
            const isToday = isSameDay(day, today);
            const rangeStart = isRangeStart(day);
            const rangeEnd = isRangeEnd(day);
            const inRange = isInRange(day);
            const isSelected = rangeStart || rangeEnd;

            // Hover-Logik: Pruefe ob Hover-Datum valide waere
            const isHoverPreview =
              selectionState === 'checkIn' &&
              checkIn &&
              hoveredDate &&
              isSameDay(day, hoveredDate) &&
              isAfter(day, checkIn) &&
              differenceInDays(day, checkIn) >= minNights &&
              !hasBlockedInRange(checkIn, day);

            if (!inCurrentMonth) {
              return <div key={day.toISOString()} className="aspect-square" />;
            }

            // CSS-Klassen zusammenbauen
            let dayClasses =
              'relative flex aspect-square items-center justify-center text-sm transition-all duration-[var(--transition-fast)]';

            if (disabled) {
              dayClasses += ' cursor-not-allowed text-text-muted/40';
              if (blocked && !isPast(day)) {
                dayClasses += ' line-through';
              }
            } else {
              dayClasses += ' cursor-pointer hover:bg-accent/10';
            }

            if (isSelected) {
              dayClasses += ' bg-accent text-white font-bold rounded-full z-10';
            } else if (inRange) {
              dayClasses += ' bg-accent/15 text-text';
            } else if (isHoverPreview) {
              dayClasses += ' bg-accent/25 rounded-full';
            }

            if (isToday && !isSelected) {
              dayClasses += ' font-bold';
            }

            // Range-Hintergrund-Verbindung
            let bgClasses = '';
            if (rangeStart && (checkOut || (hoveredDate && isAfter(hoveredDate, checkIn!)))) {
              bgClasses = 'after:absolute after:inset-y-0 after:right-0 after:w-1/2 after:bg-accent/15 after:-z-10';
            }
            if (rangeEnd && checkIn) {
              bgClasses = 'after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:bg-accent/15 after:-z-10';
            }

            return (
              <div
                key={day.toISOString()}
                className={`${dayClasses} ${bgClasses}`}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => !disabled && setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDayClick(day);
                  }
                }}
                aria-label={`${format(day, 'd. MMMM yyyy', { locale: de })}${
                  blocked ? ', nicht verfuegbar' : ''
                }${isSelected ? ', ausgewaehlt' : ''}`}
                aria-disabled={disabled}
              >
                {/* Heute-Indikator */}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Auswahlstatus-Anzeige
  // ---------------------------------------------------------------------------

  function renderSelectionHint() {
    if (selectionState === 'idle') {
      return 'Bitte Anreisedatum auswaehlen';
    }
    if (selectionState === 'checkIn' && checkIn) {
      return `Anreise: ${format(checkIn, 'd. MMM yyyy', { locale: de })} - Bitte Abreisedatum waehlen (mind. ${minNights} Naechte)`;
    }
    if (checkIn && checkOut) {
      const nights = differenceInDays(checkOut, checkIn);
      return `${format(checkIn, 'd. MMM', { locale: de })} - ${format(checkOut, 'd. MMM yyyy', { locale: de })} (${nights} ${nights === 1 ? 'Nacht' : 'Naechte'})`;
    }
    return '';
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const secondMonth = addMonths(currentMonth, 1);

  return (
    <div className="w-full" role="application" aria-label="Verfuegbarkeitskalender">
      {/* Navigation Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-light transition-all duration-[var(--transition-fast)] hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Vorheriger Monat"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            Laden...
          </div>
        )}

        <button
          onClick={goToNextMonth}
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-light transition-all duration-[var(--transition-fast)] hover:bg-secondary"
          aria-label="Naechster Monat"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Kalender-Grid: 2 Monate nebeneinander (Desktop), 1 Monat (Mobil) */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        {renderMonth(currentMonth)}
        <div className="hidden md:block">{renderMonth(secondMonth)}</div>
      </div>

      {/* Mobil: Zweiter Monat sichtbar */}
      <div className="mt-8 md:hidden">{renderMonth(secondMonth)}</div>

      {/* Auswahl-Status */}
      <div className="mt-6 rounded-xl bg-secondary px-4 py-3 text-center text-sm text-text-light">
        {renderSelectionHint()}
      </div>

      {/* Legende */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-accent" />
          Ausgewaehlt
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-accent/15 border border-accent/30" />
          Aufenthalt
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
          <span className="line-through">Belegt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative inline-block h-3 w-3">
            <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
          </span>
          Heute
        </div>
      </div>

      {/* Reset-Button */}
      {(checkIn || checkOut) && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setCheckIn(null);
              setCheckOut(null);
              setSelectionState('idle');
              setHoveredDate(null);
            }}
            className="text-sm text-text-muted underline transition-colors duration-[var(--transition-fast)] hover:text-primary"
          >
            Auswahl zuruecksetzen
          </button>
        </div>
      )}
    </div>
  );
}

export { AvailabilityCalendar };
export type { AvailabilityCalendarProps };
