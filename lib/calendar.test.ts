import { describe, it, expect } from "vitest";
import { googleCalendarLink } from "@/lib/calendar";

describe("googleCalendarLink", () => {
  it("builds a valid Google Calendar template URL", () => {
    const url = googleCalendarLink({ title: "Кардио", dateStr: "2026-03-15" });
    expect(url).toContain("https://calendar.google.com/calendar/render?");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("dates=20260315%2F20260316");
  });

  it("includes description when provided", () => {
    const url = googleCalendarLink({
      title: "Бег",
      dateStr: "2026-01-01",
      description: "10 км в среднем темпе",
    });
    expect(url).toContain("details=");
  });

  it("uses the exclusive next-day end date for the all-day event", () => {
    const url = googleCalendarLink({ title: "X", dateStr: "2026-12-31" });
    expect(url).toContain("dates=20261231%2F20270101");
  });
});
