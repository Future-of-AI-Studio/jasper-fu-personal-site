import { describe, expect, it } from "vitest";

import {
  AVAILABILITY_TIMEZONE,
  SLOT_MINUTES,
  assertSlotIsBookable,
  listAvailableDateKeys,
  listSlotsForDate,
  parseDateKey,
  toDateKey,
  zonedDateTimeToUtc,
} from "./availability";

const monday = "2026-08-17";
const sunday = "2026-08-16";
const christmas = "2026-12-25";
const nowBeforeMonday = new Date("2026-08-10T12:00:00.000Z");

function verifySlots(dateKey: string, expectedCount: number) {
  const slots = listSlotsForDate(dateKey, nowBeforeMonday);
  expect(slots).toHaveLength(expectedCount);
  expect(slots.every((slot) => slot.dateKey === dateKey)).toBe(true);
  expect(
    slots.every((slot) => {
      const start = new Date(slot.startIso).getTime();
      const end = new Date(slot.endIso).getTime();
      return end - start === SLOT_MINUTES * 60 * 1000;
    }),
  ).toBe(true);
  return slots;
}

describe("availability calendar", () => {
  it("lists weekday slots in Eastern Time", () => {
    const slots = verifySlots(monday, 12);
    const first = zonedDateTimeToUtc(2026, 8, 17, 10 * 60);
    expect(slots[0]?.startIso).toBe(first.toISOString());
  });

  it("returns no slots on a closed weekday", () => {
    verifySlots(sunday, 0);
  });

  it("returns no slots on a blackout date", () => {
    verifySlots(christmas, 0);
  });

  it("rejects an invalid date key", () => {
    expect(() => parseDateKey("08/17/2026")).toThrow("Date must use YYYY-MM-DD");
  });

  it("rejects a non-existent calendar day", () => {
    expect(() => parseDateKey("2026-02-31")).toThrow(
      "Date is not a valid calendar day",
    );
  });

  it("rejects a month outside 1-12", () => {
    expect(() => listAvailableDateKeys(2026, 0, nowBeforeMonday)).toThrow(
      "Month must be between 1 and 12",
    );
    expect(() => listAvailableDateKeys(2026, 13, nowBeforeMonday)).toThrow(
      "Month must be between 1 and 12",
    );
  });

  it.each([1, 12])("accepts month boundary %i", (month) => {
    const keys = listAvailableDateKeys(2026, month, nowBeforeMonday);
    expect(Array.isArray(keys)).toBe(true);
  });

  it("formats a date key with padded parts", () => {
    expect(toDateKey(2026, 8, 7)).toBe("2026-08-07");
  });

  it("hides slots inside the minimum-notice window", () => {
    const sundayMorning = new Date("2026-08-16T15:00:00.000Z");
    const slots = listSlotsForDate(monday, sundayMorning);
    expect(slots.length).toBeLessThan(12);
    expect(slots.length).toBeGreaterThan(0);
  });

  it("accepts a published slot and rejects an unpublished one", () => {
    const [slot] = listSlotsForDate(monday, nowBeforeMonday);
    expect(assertSlotIsBookable(slot!.startIso, nowBeforeMonday).startIso).toBe(
      slot!.startIso,
    );
    expect(() =>
      assertSlotIsBookable("2026-08-17T00:00:00.000Z", nowBeforeMonday),
    ).toThrow("Requested slot is not available");
  });

  it("rejects a malformed slot timestamp", () => {
    expect(() => assertSlotIsBookable("not-a-date", nowBeforeMonday)).toThrow(
      "Requested slot is not a valid time",
    );
  });

  it("uses America/New_York as the canonical booking timezone", () => {
    expect(AVAILABILITY_TIMEZONE).toBe("America/New_York");
  });
});
