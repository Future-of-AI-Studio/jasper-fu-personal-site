"use client";

import { useMemo, useState } from "react";

import {
  listAvailableDateKeys,
  listSlotsForDate,
  toDateKey,
} from "../../lib/availability";

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function AvailabilityCalendar({
  onSelectSlot,
  selectedSlot,
}: {
  onSelectSlot: (startIso: string) => void;
  selectedSlot?: string;
}) {
  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }));
  const [dateKey, setDateKey] = useState<string | null>(null);

  const availableDays = listAvailableDateKeys(cursor.year, cursor.month, now);
  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month, 0)).getUTCDate();
  const slots = dateKey ? listSlotsForDate(dateKey, now) : [];

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button
          className="calendar__nav"
          onClick={() =>
            setCursor((current) =>
              current.month === 1
                ? { year: current.year - 1, month: 12 }
                : { year: current.year, month: current.month - 1 },
            )
          }
          type="button"
        >
          Previous
        </button>
        <p>{monthLabel(cursor.year, cursor.month)}</p>
        <button
          className="calendar__nav"
          onClick={() =>
            setCursor((current) =>
              current.month === 12
                ? { year: current.year + 1, month: 1 }
                : { year: current.year, month: current.month + 1 },
            )
          }
          type="button"
        >
          Next
        </button>
      </div>
      <div className="calendar__grid" role="grid" aria-label="Availability">
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const key = toDateKey(cursor.year, cursor.month, day);
          const enabled = availableDays.includes(key);
          return (
            <button
              aria-pressed={dateKey === key}
              className={enabled ? "calendar__day is-open" : "calendar__day"}
              disabled={!enabled}
              key={key}
              onClick={() => setDateKey(key)}
              type="button"
            >
              {day}
            </button>
          );
        })}
      </div>
      {dateKey ? (
        <ul className="calendar__slots">
          {slots.length === 0 ? (
            <li>No remaining times that day.</li>
          ) : (
            slots.map((slot) => (
              <li key={slot.startIso}>
                <button
                  aria-pressed={selectedSlot === slot.startIso}
                  className="calendar__slot"
                  onClick={() => onSelectSlot(slot.startIso)}
                  type="button"
                >
                  {new Intl.DateTimeFormat(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                    timeZoneName: "short",
                  }).format(new Date(slot.startIso))}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : (
        <p className="calendar__hint">Select an available day to see times.</p>
      )}
    </div>
  );
}
