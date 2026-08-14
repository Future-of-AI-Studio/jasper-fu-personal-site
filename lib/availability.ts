export const AVAILABILITY_TIMEZONE = "America/New_York";
export const SLOT_MINUTES = 30;
export const MIN_NOTICE_HOURS = 24;

export type WeekdayHours = {
  startMinutes: number;
  endMinutes: number;
} | null;

export const weeklyHours: WeekdayHours[] = [
  null,
  { startMinutes: 10 * 60, endMinutes: 16 * 60 },
  { startMinutes: 10 * 60, endMinutes: 16 * 60 },
  { startMinutes: 10 * 60, endMinutes: 16 * 60 },
  { startMinutes: 10 * 60, endMinutes: 16 * 60 },
  { startMinutes: 10 * 60, endMinutes: 14 * 60 },
  null,
];

export const blackoutDates = new Set<string>(["2026-12-25", "2026-01-01"]);

export type AvailabilitySlot = {
  startIso: string;
  endIso: string;
  dateKey: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function parseDateKey(dateKey: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) {
    throw new Error("Date must use YYYY-MM-DD");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));

  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() + 1 !== month ||
    probe.getUTCDate() !== day
  ) {
    throw new Error("Date is not a valid calendar day");
  }

  return { year, month, day };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  const asUtc = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour") % 24,
    read("minute"),
    read("second"),
  );

  return asUtc - date.getTime();
}

export function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  minutesFromMidnight: number,
  timeZone = AVAILABILITY_TIMEZONE,
) {
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const offset = getTimeZoneOffsetMs(utcGuess, timeZone);
  return new Date(utcGuess.getTime() - offset);
}

export function isBlackoutDate(dateKey: string) {
  return blackoutDates.has(dateKey);
}

export function listSlotsForDate(
  dateKey: string,
  now = new Date(),
): AvailabilitySlot[] {
  const { year, month, day } = parseDateKey(dateKey);
  if (isBlackoutDate(dateKey)) {
    return [];
  }

  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const hours = weeklyHours[weekday];
  if (!hours) {
    return [];
  }

  if (hours.endMinutes <= hours.startMinutes) {
    throw new Error("Availability window must end after it starts");
  }

  const slots: AvailabilitySlot[] = [];
  const earliest = now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000;

  for (
    let cursor = hours.startMinutes;
    cursor + SLOT_MINUTES <= hours.endMinutes;
    cursor += SLOT_MINUTES
  ) {
    const start = zonedDateTimeToUtc(year, month, day, cursor);
    const end = zonedDateTimeToUtc(year, month, day, cursor + SLOT_MINUTES);
    if (start.getTime() < earliest) continue;

    slots.push({
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      dateKey,
    });
  }

  return slots;
}

export function listAvailableDateKeys(
  year: number,
  month: number,
  now = new Date(),
) {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const keys: string[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = toDateKey(year, month, day);
    if (listSlotsForDate(dateKey, now).length > 0) {
      keys.push(dateKey);
    }
  }

  return keys;
}

export function assertSlotIsBookable(
  startIso: string,
  now = new Date(),
) {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) {
    throw new Error("Requested slot is not a valid time");
  }

  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: AVAILABILITY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(start);

  const match = listSlotsForDate(dateKey, now).find(
    (slot) => slot.startIso === start.toISOString(),
  );

  if (!match) {
    throw new Error("Requested slot is not available");
  }

  return match;
}
